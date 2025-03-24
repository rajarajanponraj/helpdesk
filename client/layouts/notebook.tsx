import { PlusIcon as PlusIconMini } from "@heroicons/react/20/solid";
import { getCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import Loader from "react-spinners/ClipLoader";

async function fetchNotebooks() {
  const token = getCookie("session");
  const res = await fetch(`/api/v1/notebooks/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function NoteBookLayout({ children }) {
  const router = useRouter();
  const { data, status } = useQuery({ queryKey: ["getUsersNotebooks"], queryFn: fetchNotebooks });

  return (
    <div>
      {status === "pending" && (
        <div className="flex flex-col justify-center items-center h-screen">
          <Loader color="green" size={100} />
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-row">
          <div className="flex flex-col w-64 border-r-[1px]">
            <div className="border-b-[1px] p-2">
              <Link className="inline-flex items-center text-sm font-medium text-green-600 dark:text-white" href="/notebook/new">
                <PlusIconMini className="h-5 w-5" aria-hidden="true" />
              </Link>
            </div>
            <nav className="flex-1 w-full" aria-label="Sidebar">
              {data?.notebooks?.map((item) => (
                <Link
                  key={item.id}
                  href={`/notebook/${item.id}`}
                  className={classNames(
                    router.query.id === item.id
                      ? "bg-green-500 text-white hover:text-white"
                      : "text-gray-900 dark:text-white hover:bg-green-500 hover:text-white hover:bg-opacity-75",
                    "group flex text-left px-2 py-2 w-full text-sm font-medium border-b-[1px] border-gray-200"
                  )}
                >
                  <div className="flex flex-row items-center justify-between w-full">
                    <span className="truncate">{item.title}</span>
                  </div>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-1">
            <div className="h-[80vh]">{children}</div>
          </div>
        </div>
      )}
    </div>
  );
}
