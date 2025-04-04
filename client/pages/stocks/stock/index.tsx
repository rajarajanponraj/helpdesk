import { getCookie } from "cookies-next";
import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";

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

  const columns = useMemo(
    () => [
      { header: "Stock Name", accessorKey: "name" },
      { header: "Category", accessorKey: "category" },
      { header: "Quantity", accessorKey: "quantity" },
      { header: "Unit Price", accessorKey: "unitPrice" },
      { header: "Seller", accessorKey: "seller.name" },
    ],
    []
  );

  const table = useReactTable({
    data: data?.stocks || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <main className="flex-1 max-w-5xl mx-auto">
      <h1 className="text-3xl font-extrabold">Stock Management</h1>
      
      <button
        onClick={() => router.push("/stocks/stock/new")}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Add New Stock
      </button>

      <div className="py-4">
        {status === "pending" && <h2>Loading...</h2>}
        {status === "error" && <h2>Error loading data</h2>}
        {status === "success" && (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="border p-2">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-2 border">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
