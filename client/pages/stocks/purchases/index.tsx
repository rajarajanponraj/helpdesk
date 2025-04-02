import { getCookie } from "cookies-next";
import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";

const fetchAllPurchases = async () => {
  const res = await fetch(`/api/v1/purchases/all`, {
    headers: {
      Authorization: `Bearer ${getCookie("session")}`,
    },
  });
  return res.json();
};

export default function Purchases() {
  const router = useRouter();
  const { data, status } = useQuery({ queryKey: ["fetchAllPurchases"], queryFn: fetchAllPurchases });

  const columns = useMemo(
    () => [
      { header: "Stock Name", accessorKey: "stock.name" },
      { header: "Seller", accessorKey: "seller.name" },
      { header: "Quantity", accessorKey: "quantity" },
      { header: "Price", accessorKey: "price" },
      { header: "Purchase Date", accessorKey: "purchaseDate" },
      { header: "Proof Type", accessorKey: "proofType" },
      { header: "Proof File", accessorKey: "proofFile", cell: ({ row }) => (
          <a href={row.original.proofFile} target="_blank" className="text-blue-500 underline">
            View File
          </a>
        )
      },
    ],
    []
  );

  const table = useReactTable({
    data: data?.purchases || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <main className="flex-1 max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-extrabold">Purchases</h1>
      <button
        onClick={() => router.push("/stocks/purchases/new")}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md"
      >
        Add Purchase
      </button>
      <div className="py-4">
        {status === "pending" && <h2>Loading...</h2>}
        {status === "error" && <h2>Error loading data</h2>}
        {status === "success" && (
          <table className="w-full border-collapse border border-gray-300 mt-4">
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
