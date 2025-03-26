import { toast } from "@/shadcn/hooks/use-toast";
import { hasAccess } from "@/shadcn/lib/hasAccess";
import { Switch } from "@headlessui/react";
import { getCookie } from "cookies-next";
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

async function fetchWebhooks() {
  const res = await fetch(`/api/v1/webhooks/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("session")}`,
    },
  });
  hasAccess(res);
  return res.json();
}

async function createWebhook(webhook) {
  const res = await fetch(`/api/v1/webhook/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("session")}`,
    },
    body: JSON.stringify(webhook),
  });
  return res.json();
}

async function deleteWebhook(id) {
  await fetch(`/api/v1/admin/webhook/${id}/delete`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getCookie("session")}`,
    },
  });
}

export default function Webhooks() {
  const queryClient = useQueryClient();
  const [show, setShow] = useState("main");
  const [enabled, setEnabled] = useState(true);
  const [url, setUrl] = useState("");
  const [type, setType] = useState("ticket_created");
  const [secret, setSecret] = useState();
  const [name, setName] = useState("");

  const { data, status } = useQuery({ queryKey: ["webhooks"], queryFn: fetchWebhooks });

  const addWebhookMutation = useMutation({
    mutationFn: (webhook: any) => createWebhook(webhook),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
      setShow("main");
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error -> Unable to add",
        description: error.message,
      });
    },
  });
  

  const deleteWebhookMutation = useMutation({
    mutationFn: (id: string) => deleteWebhook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
    },
  });
  

  const columns = useMemo(
    () => [
      { header: "Name", accessorKey: "name" },
      { header: "URL", accessorKey: "url" },
      { header: "Type", accessorKey: "type" },
      {
        header: "Actions",
        accessorKey: "id",
        cell: ({ getValue }) => (
          <button
            onClick={() => deleteWebhookMutation.mutate(getValue())}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: data?.webhooks || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <main className="flex-1">
      <div className="relative max-w-4xl mx-auto md:px-8 xl:px-0">
        <h1 className="text-3xl font-extrabold text-foreground">Webhook Settings</h1>
        {status === "pending" && <p>Loading...</p>}
        {status === "error" && <p>Error loading webhooks</p>}
        {status === "success" && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="bg-white">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
