import  EmailReplyParser  from "email-reply-parser";
import Imap from "imap";
import { simpleParser } from "mailparser";
import { prisma } from "../../prisma";
import { EmailConfig, EmailQueue } from "../types/email";
import { AuthService } from "./auth.service";
import { Readable } from "stream";

function getReplyText(email: any): string {
  const parsed = new EmailReplyParser().read(email.text);
  const fragments = parsed.getFragments();

  let replyText = "";

  fragments.forEach((fragment: any) => {
    console.log("FRAGMENT", fragment.getContent());
    if (!fragment.isHidden() && !fragment.isSignature() && !fragment.isQuoted()) {
      replyText += fragment.getContent();
    }
  });

  return replyText;
}

export class ImapService {
  private static async getImapConfig(queue: EmailQueue): Promise<EmailConfig> {
    switch (queue.serviceType) {
      case "gmail": {
        const validatedAccessToken = await AuthService.getValidAccessToken(queue);

        return {
          user: queue.username,
          host: queue.hostname,
          port: 993,
          tls: true,
          xoauth2: AuthService.generateXOAuth2Token(queue.username, validatedAccessToken),
          tlsOptions: { rejectUnauthorized: false, servername: queue.hostname },
        };
      }
      case "other":
        return {
          user: queue.username,
          password: queue.password,
          host: queue.hostname,
          port: queue.tls ? 993 : 143,
          tls: queue.tls || false,
          tlsOptions: { rejectUnauthorized: false, servername: queue.hostname },
        };
      default:
        throw new Error("Unsupported service type");
    }
  }

  private static async processEmail(parsed: any, isReply: boolean): Promise<void> {
    const { from, subject, text, html, textAsHtml } = parsed;

    if (isReply) {
      const ticketIdMatch = subject.match(/#(\d+)/);
      if (!ticketIdMatch) {
        throw new Error(`Could not extract ticket ID from subject: ${subject}`);
      }

      const ticketId = ticketIdMatch[1];
      const ticket = await prisma.ticket.findFirst({
        where: { Number: Number(ticketId) },
      });

      if (!ticket) {
        throw new Error(`Ticket not found: ${ticketId}`);
      }

      const replyText = getReplyText(parsed);

      await prisma.comment.create({
        data: {
          text: text ? replyText : "No Body",
          userId: null,
          ticketId: ticket.id,
          reply: true,
          replyEmail: from.value[0].address,
          public: true,
        },
      });
    } else {
      const imapEmail = await prisma.imap_Email.create({
        data: {
          from: from.value[0].address,
          subject: subject || "No Subject",
          body: text || "No Body",
          html: html || "",
          text: textAsHtml,
        },
      });

      await prisma.ticket.create({
        data: {
          email: from.value[0].address,
          name: from.value[0].name,
          title: imapEmail.subject || "-",
          isComplete: false,
          priority: "low",
          fromImap: true,
          detail: html || textAsHtml,
        },
      });
    }
  }

  static async fetchEmails(): Promise<void> {
    const queues = (await prisma.emailQueue.findMany()) as unknown as EmailQueue[];
    const today = new Date();

    for (const queue of queues) {
      try {
        const imapConfig = await this.getImapConfig(queue);

        if (queue.serviceType === "other" && !imapConfig.password) {
          console.error("IMAP configuration is missing a password");
          throw new Error("IMAP configuration is missing a password");
        }

        const imap = new Imap(imapConfig as Imap.Config);

        await new Promise((resolve, reject) => {
          imap.once("ready", () => {
            imap.openBox("INBOX", false, (err) => {
              if (err) {
                reject(err);
                return;
              }
              imap.search(["UNSEEN", ["ON", today]], (err, results) => {
                if (err) reject(err);
                if (!results?.length) {
                  console.log("No new messages");
                  imap.end();
                  resolve(null);
                  return;
                }

                const fetch = imap.fetch(results, { bodies: "" });

                fetch.on("message", (msg) => {
                  msg.on("body", (stream) => {
                    const readableStream = new Readable();
                    readableStream._read = () => {};
                    stream.on("data", (chunk) => readableStream.push(chunk));
                    stream.on("end", () => readableStream.push(null));

                    simpleParser(readableStream, async (err, parsed) => {
                      if (err) {
                        console.error("Error parsing email:", err);
                        return;
                      }
                      const isReply = parsed.subject?.includes("Re:");
                      await this.processEmail(parsed, isReply || false);
                    });
                  });

                  msg.once("attributes", (attrs) => {
                    imap.addFlags(attrs.uid, ["\\Seen"], () => {
                      console.log("Marked as read!");
                    });
                  });
                });

                fetch.once("error", reject);
                fetch.once("end", () => {
                  console.log("Done fetching messages");
                  imap.end();
                  resolve(null);
                });
              });
            });
          });

          imap.once("error", reject);
          imap.once("end", () => {
            console.log("Connection ended");
            resolve(null);
          });

          imap.connect();
        });
      } catch (error) {
        console.error(`Error processing queue ${queue.id}:`, error);
      }
    }
  }
}
