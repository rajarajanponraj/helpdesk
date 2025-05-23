import { useRouter } from "next/router";

import { getCookie } from "cookies-next";
import Link from "next/link";
import { useUser } from "../store/session";

export default function Home() {
  const router = useRouter();

  const { user } = useUser();

  async function updateFirstLogin() {
    await fetch(`/api/v1/auth/user/${user.id}/first-login`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getCookie("session")}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          router.push("/");
        }
      });
  }

  return (
    <div className="bg-background">
      <div className="flex justify-center align-center h-screen items-center">
        <div className="bg-background shadow-xl rounded-lg lg:p-8 p-4 mx-4">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <h1 className="text-2xl text-foreground font-bold">
                Peppermint{" "}
              </h1>
              <p className="text-foreground">
                Welcome to Peppermint! A fully open sourced ticket management
                system.
              </p>
            </div>
          </div>
          <div className="mt-4 ">
            <div className="flex flex-col space-y-4">
              <div className="border p-2 md:p-6 rounded-md border-dashed flex flex-col md:flex-row space-x-4 items-center">
                <img src="/github.svg" className="h-10 w-10" />
                <div className="flex flex-col align-center lg:w-[36em]">
                  <span className="font-bold text-lg">Github</span>
                  <span className="max-w-lg  text-xs md:text-md">
                    Being an open source project, all of our source code can be
                    housed here. If you ever face a bug or are unsure about
                    something.
                  </span>
                </div>
                <Link
                  target="_blank"
                  href="https://github.com/Peppermint-Lab/peppermint"
                  className="rounded-md mt-4 sm:mt-0 bg-gray-600 px-2.5 whitespace-nowrap hover:text-white py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-gray-500 "
                >
                  Check it out
                </Link>
              </div>
              <div className="border p-2 md:p-6 rounded-md border-dashed w-full flex flex-col md:flex-row space-x-4 items-center">
                <img src="/logo.svg" className="h-10 w-10" />
                <div className="flex flex-col align-center lg:w-[36em]">
                  <span className="font-bold text-lg">Docs</span>
                  <span className="max-w-lg text-xs md:text-md">
                    Documentation for Peppermint can be found here. If you find
                    something that isnt documented, feel free to open a PR or an
                    Issue. We'll get straight on it.
                  </span>
                </div>
                <Link
                  target="_blank"
                  href="https://github.com/Peppermint-Lab/peppermint"
                  className="rounded-md flex-end bg-green-600 mt-4 whitespace-nowrap sm:mt-0 px-2.5 py-1.5 text-sm font-semibold hover:text-white text-white shadow-xs hover:bg-green-500 "
                >
                  Check it out
                </Link>
              </div>
              <div className="border p-2 md:p-6 rounded-md border-dashed flex flex-col md:flex-row space-x-4 items-center ">
                <img src="/discord.svg" className="h-10 w-10" />
                <div className="flex flex-col align-center lg:w-[36em]">
                  <span className="font-bold text-lg">Discord</span>
                  <span className="max-w-lg text-xs md:text-md">
                    Join our discord server to get help from the community or
                    the developers. Not a bad place to hang out either.
                  </span>
                </div>
                <Link
                  target="_blank"
                  href="https://discord.gg/zbTy8nuHnK"
                  className="rounded-md bg-blue-600 mt-4 whitespace-nowrap sm:mt-0 px-2.5 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 "
                >
                  Check it out
                </Link>
              </div>
            </div>
          </div>
          <div className="float-right mt-4">
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-2.5 py-1.5 mr-6 text-sm font-semibold rounded-lg"
              onClick={() => updateFirstLogin()}
            >
              To Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
