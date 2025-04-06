import { getCookie } from "cookies-next";
import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel,
} from "@tanstack/react-table";

const fetchAllStocks = async () => {
  const res = await fetch(`/api/v1/stocks/all`, {
    headers: {
      Authorization: `Bearer ${getCookie("session")}`,
    },
  });
  return res.json();
};

export default function StockManagement() {
  const router = useRouter();
  const { data, status } = useQuery({ queryKey: ["fetchAllStocks"], queryFn: fetchAllStocks });
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo(
    () => [
      { header: "Stock Name", accessorKey: "name" },
      { header: "Category", accessorKey: "category" },
      { header: "Unit Price", accessorKey: "unitPrice" },
      {
        header: "Actions",
        id: "actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              className="text-blue-600 underline"
              onClick={() => router.push(`/stocks/stock/${row.original.id}`)}
            >
              View
            </button>
            <button
              className="text-green-600 underline"
              onClick={() => router.push(`/stocks/stock/${row.original.id}/edit`)}
            >
              Edit
            </button>
          </div>
        ),
      },
    ],
    [router]
  );

  const table = useReactTable({
    data: data?.stocks || [],
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <main className="flex-1 max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Stock Management</h1>
        <button
          onClick={() => router.push("/stocks/stock/new")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          ➕ Add New Stock
        </button>
      </div>

      <input
        type="text"
        placeholder="Search stocks..."
        value={globalFilter ?? ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="w-full mb-4 px-3 py-2 border rounded-md"
      />

      {status === "pending" && <h2>Loading...</h2>}
      {status === "error" && <h2>Error loading data</h2>}
      {status === "success" && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="border p-2 text-left">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-2 border">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
