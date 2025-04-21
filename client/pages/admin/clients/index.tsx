import { getCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
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

  if (!res.ok) {
    throw new Error("Failed to fetch clients");
  }

  return res.json();
};

function Table({ columns, data }: any) {
  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
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
                <td
                  key={cell.id}
                  className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Clients() {
  const { data, status, refetch } = useQuery({
    queryKey: ["fetchAllClients"],
    queryFn: fetchAllClients,
  });

  const router = useRouter();

  async function deleteClient(id: string) {
    try {
      const res = await fetch(`/api/v1/clients/${id}/delete-client`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getCookie("session")}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete client");
      }

      refetch();
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  }

  const columns = React.useMemo(
    () => [
      {
        header: "Client Name",
        accessorKey: "name",
      },
      {
        header: "Contact Name",
        accessorKey: "contactName",
      },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }: any) => (
          <button
            type="button"
            className="rounded bg-red-500 text-white px-2 py-1"
            onClick={() => deleteClient(row.original.id)}
          >
            Delete
          </button>
        ),
      },
    ],
    []
  );

  return (
    <main className="flex-1">
      <div className="relative max-w-4xl mx-auto md:px-8 xl:px-0">
        <div className="pt-10 pb-16 divide-y-2">
          <div className="px-4 sm:px-6 md:px-0">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Clients
            </h1>
          </div>
          <div className="px-4 sm:px-6 md:px-0">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto mt-4">
                <p className="mt-2 text-sm text-gray-700 dark:text-white">
                  A list of all internal users of your instance.
                </p>
              </div>
              <div className="sm:ml-16 mt-5 flex flex-row space-x-2">
                <Link
                  href="/submit"
                  className="inline-flex items-center px-2.5 py-1.5 border font-semibold border-gray-300 shadow-sm text-xs rounded text-gray-700 bg-white hover:bg-gray-50"
                >
                  Guest Ticket Url
                </Link>
                <Link
                  href="/portal/"
                  className="inline-flex items-center px-2.5 py-1.5 border font-semibold border-gray-300 shadow-sm text-xs rounded text-gray-700 bg-white hover:bg-gray-50"
                >
                  Portal Url
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center px-2.5 py-1.5 border font-semibold border-gray-300 shadow-sm text-xs rounded text-gray-700 bg-white hover:bg-gray-50"
                >
                  Portal Register
                </Link>
                <Link
                  href="/admin/clients/new"
                  className="rounded bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  New Client
                </Link>
              </div>
            </div>
            <div className="py-4">
              {status === "pending" && (
                <div className="min-h-screen flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
                  <h2>Loading data...</h2>
                </div>
              )}

              {status === "error" && (
                <div className="min-h-screen flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
                  <h2 className="text-2xl font-bold">Error fetching data...</h2>
                </div>
              )}

              {status === "success" && (
                <div>
                  <div className="hidden sm:block">
                    <Table columns={columns} data={data.clients} />
                  </div>

                  <div className="sm:hidden">
                    {data.clients.map((client: any) => (
                      <div
                        key={client.id}
                        className="flex flex-col text-center bg-white rounded-lg shadow mt-4"
                      >
                        <div className="flex-1 flex flex-col p-8">
                          <h3 className="text-gray-900 text-sm font-medium">
                            {client.name}
                          </h3>
                          <dl className="mt-1 flex-grow flex flex-col justify-between">
                            <dd className="text-gray-500 text-sm">
                              {client.number}
                            </dd>
                            <dt className="sr-only">Role</dt>
                            <dd className="mt-3">
                              <span>Primary Contact - {client.contactName}</span>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}