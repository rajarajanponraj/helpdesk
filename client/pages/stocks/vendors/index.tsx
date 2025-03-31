import { getCookie } from "cookies-next";
import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";

// Fetch all vendors
const fetchAllVendors = async () => {
  const res = await fetch(`/api/v1/vendors`, {
    headers: { Authorization: `Bearer ${getCookie("session")}` },
  });
  return res.json();
};

// Create vendor
const createVendor = async (vendor) => {
  const res = await fetch(`/api/v1/vendors/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("session")}`,
    },
    body: JSON.stringify(vendor),
  });
  return res.json();
};

// Delete vendor
const deleteVendor = async (id) => {
  await fetch(`/api/v1/vendors/delete/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getCookie("session")}` },
  });
};

export default function Vendors() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch vendors
  const { data, status } = useQuery({ queryKey: ["fetchAllVendors"], queryFn: fetchAllVendors });

  const [vendorData, setVendorData] = useState({ name: "", contact: "", location: "" });

  // Create vendor mutation
  const createMutation = useMutation({
    mutationFn: createVendor,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["fetchAllVendors"] }),
  });

  // Delete vendor mutation
  const deleteMutation = useMutation({
    mutationFn: deleteVendor,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["fetchAllVendors"] }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(vendorData);
    setVendorData({ name: "", contact: "", location: "" });
  };

  const columns = useMemo(
    () => [
      { header: "Vendor Name", accessorKey: "name" },
      { header: "Contact", accessorKey: "contact" },
      { header: "Location", accessorKey: "location" },
      {
        header: "Actions",
        cell: ({ row }) => (
          <button
            onClick={() => deleteMutation.mutate(row.original.id)}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            Delete
          </button>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: data?.vendors || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <main className="flex-1 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold">Vendor Management</h1>

      <form onSubmit={handleSubmit} className="mt-4 space-y-2">
        <input
          type="text"
          placeholder="Vendor Name"
          value={vendorData.name}
          onChange={(e) => setVendorData({ ...vendorData, name: e.target.value })}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Contact"
          value={vendorData.contact}
          onChange={(e) => setVendorData({ ...vendorData, contact: e.target.value })}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Location"
          value={vendorData.location}
          onChange={(e) => setVendorData({ ...vendorData, location: e.target.value })}
          className="border p-2 w-full"
        />
        
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Create Vendor
        </button>
      </form>

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
