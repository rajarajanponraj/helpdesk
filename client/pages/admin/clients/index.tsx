import { getCookie } from "cookies-next";

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

const fetchAllClients = async () => {
  const res = await fetch(`/api/v1/clients/all`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("session")}`,
    },
  });
  return res.json();
};

export default function Clients() {
  const { data, status } = useQuery({
    queryKey: ["fetchAllClients"],
    queryFn: fetchAllClients,
  });

  const columns = useMemo(
    () => [
      { header: "Client Name", accessorKey: "name" },
      { header: "Contact Name", accessorKey: "contactName" },
      {
        header: "Actions",
        accessorKey: "id",
        cell: ({ getValue }) => (
          <button
            type="button"
            className="rounded bg-white hover:bg-red-100 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:text-white shadow-sm ring-1 ring-inset ring-gray-300"
            onClick={() => deleteClient(getValue())}
          >
            Delete
          </button>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: data?.clients || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  async function deleteClient(id) {
    await fetch(`/api/v1/clients/${id}/delete-client`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getCookie("session")}`,
      },
    });
  }

  return (
    <main className="flex-1">
      <div className="relative max-w-4xl mx-auto md:px-8 xl:px-0">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Clients</h1>
        <div className="py-4">
          {status === "pending" && <h2>Loading data...</h2>}
          {status === "error" && <h2 className="text-2xl font-bold">Error fetching data...</h2>}
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
      </div>
    </main>
  );
}
