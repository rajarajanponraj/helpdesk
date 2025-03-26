import { toast } from "@/shadcn/hooks/use-toast";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import { getCookie } from "cookies-next";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

async function fetchNotebooks() {
  const token = getCookie("session");
  const res = await fetch(`/api/v1/notebooks/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();

  if (res.status !== 200) {
    toast({
      title: "Error",
      description: "You do not have permission to view this resource.",
    });
  }
  return data;
}

export default function NoteBooksIndex() {
  const { t } = useTranslation("peppermint");
  const [sortBy, setSortBy] = useState("updatedAt");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const { data, status } = useQuery({
    queryKey: ["getUsersNotebooks"],
    queryFn: fetchNotebooks,
  });

  async function createNew() {
    const token = getCookie("session");
    const res = await fetch(`/api/v1/notebook/note/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: "Untitled",
        content: "",
      }),
    });
    const result = await res.json();
    if (result.success && result.id) {
      router.push(`/documents/${result.id}`);
    }
  }

  return (
    <div className="px-4 py-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-foreground">Documents</h1>
          <div className="flex items-center w-full justify-center flex-row space-x-2 flex-1 mr-2">
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updatedAt">Last Updated</SelectItem>
                <SelectItem value="createdAt">Created Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="mt-8 w-full flex justify-center">
        {status === "pending" && <p>Loading...</p>}
        {status === "error" && <p>Error loading documents.</p>}
        {status === "success" && data?.notebooks?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No documents found.</p>
            <Button variant="outline" size="sm" onClick={createNew}>
              New Document
            </Button>
          </div>
        ) : (
          <div className="flex flex-col w-full max-w-2xl justify-center space-y-4">
            {data?.notebooks?.length > 0 && (
              <div className="flex w-full justify-end">
                <Button variant="outline" size="sm" onClick={createNew}>
                  New Document
                </Button>
              </div>
            )}
            {data?.notebooks?.map((item) => (
              <button
                key={item.id}
                className="flex flex-row w-full justify-between items-center align-middle transition-colors"
                onClick={() => router.push(`/documents/${item.id}`)}
              >
                <h2 className="text-md font-semibold text-gray-900 dark:text-white">{item.title}</h2>
                <div className="space-x-2 flex flex-row items-center">
                  <span className="text-sm text-gray-500">
                    {new Date(item.updatedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
