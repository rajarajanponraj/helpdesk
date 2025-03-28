import { getCookie } from "cookies-next";
import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";

const fetchAllSellers = async () => {
  const res = await fetch(`/api/v1/sellers/all`, {
    headers: {
      Authorization: `Bearer ${getCookie("session")}`,
    },
  });
  return res.json();
};

export default function Sellers() {
  const router = useRouter();
  const { data, status } = useQuery({ queryKey: ["fetchAllSellers"], queryFn: fetchAllSellers });

  const columns = useMemo(
    () => [
      { header: "Seller Name", accessorKey: "name" },
      { header: "Contact", accessorKey: "contact" },
      { header: "Email", accessorKey: "email" },
      { header: "Address", accessorKey: "address" },
    ],
    []
  );

  const table = useReactTable({
    data: data?.sellers || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
console.log(getCookie("session"));
  return (
    
    <main className="flex-1 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold">Sellers</h1>

      <button
        onClick={() => router.push("/stocks/seller/new")}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Create Seller
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
