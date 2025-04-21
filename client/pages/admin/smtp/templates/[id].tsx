import { toast } from "@/shadcn/hooks/use-toast";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/themes/prism.css";
import { useEffect, useState } from "react";
import Editor from "react-simple-code-editor";

export default function EmailTemplates() {
  const [template, setTemplate] = useState<string>("");
  const [ticketDetails, setTicketDetails] = useState<any>(null); // State to store ticket details
  const router = useRouter();

  // Fetch the email template
  async function fetchTemplate() {
    await fetch(`/api/v1/ticket/template/${router.query.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("session")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setTemplate(data.template[0].html);
        }
      });
  }

  // Fetch the ticket details
  async function fetchTicketDetails() {
    await fetch(`/api/v1/tickets/${router.query.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("session")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setTicketDetails(data.ticket);
        }
      });
  }

  // Update the email template
  async function updateTemplate() {
    await fetch(`/api/v1/ticket/template/${router.query.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("session")}`,
      },
      body: JSON.stringify({ html: template }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          toast({
            variant: "default",
            title: "Success",
            description: `Template updated`,
          });
        }
      });
  }

  // Replace placeholders with actual ticket details
  const renderTemplate = (template: string) => {
    if (!ticketDetails) return template;

    return template
      .replace(/{{userName}}/g, ticketDetails.userName || "N/A")
      .replace(/{{ticketId}}/g, ticketDetails.id || "N/A")
      .replace(/{{ticketContent}}/g, ticketDetails.content || "N/A")
      .replace(/{{ticketStatus}}/g, ticketDetails.status || "N/A");
  };

  useEffect(() => {
    fetchTemplate();
    fetchTicketDetails();
  }, []);

  return (
    <div>
      <div>
        <button
          type="button"
          onClick={updateTemplate}
          className="rounded-md bg-green-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        >
          Update Template
        </button>
      </div>
      <div className="flex flex-row">
        <div className="w-1/2 overflow-scroll">
          {template !== undefined && (
            <Editor
              value={template}
              onValueChange={(code) => setTemplate(code)}
              highlight={(code) => highlight(code, languages.js, "html")}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 12,
                overflow: "scroll",
              }}
              textareaClassName="overflow-scroll"
            />
          )}
        </div>
        <div className="w-1/2">
          <span>
            <div
              dangerouslySetInnerHTML={{
                __html: renderTemplate(template),
              }}
            />
          </span>
        </div>
      </div>
    </div>
  );
}
