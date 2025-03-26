import { getCookie } from "cookies-next";
import Link from "next/link";
import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import ResetPassword from "../../../../components/ResetPassword";
import UpdateUserModal from "../../../../components/UpdateUserModal";

const fetchUsers = async (token) => {
  const res = await fetch(`/api/v1/users/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

export default function UserAuthPanel() {
  const token = getCookie("session");
  const { data, status, refetch } = useQuery({
    queryKey: ["fetchAuthUsers"],
    queryFn: () => fetchUsers(token),
  });

  async function deleteUser(id) {
    try {
      await fetch(`/api/v1/auth/user/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      refetch();
    } catch (error) {
      console.log(error);
    }
  }

  const columns = useMemo(
    () => [
      { header: "Name", accessorKey: "name" },
      { header: "Email", accessorKey: "email" },
      {
        header: "Actions",
        accessorKey: "id",
        cell: ({ getValue }) => (
          <div className="space-x-4 flex flex-row">
            <UpdateUserModal user={getValue()} />
            <ResetPassword user={getValue()} />
            <button
              type="button"
              onClick={() => deleteUser(getValue())}
              className="inline-flex items-center px-4 py-1.5 border font-semibold border-gray-300 shadow-sm text-xs rounded text-white bg-red-700 hover:bg-red-500"
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: data?.users || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <main className="flex-1">
      <div className="relative max-w-4xl mx-auto md:px-8 xl:px-0">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Internal Users</h1>
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
