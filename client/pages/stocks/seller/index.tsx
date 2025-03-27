import { getCookie } from "cookies-next";
import React, { useMemo, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle, Input, Label } from "@headlessui/react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";

const fetchAllSellers = async () => {
  const res = await fetch(`/api/v1/sellers/all`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("session")}`,
    },
  });
  return res.json();
};

const addSeller = async (seller) => {
  const res = await fetch(`/api/v1/sellers/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("session")}`,
    },
    body: JSON.stringify(seller),
  });
  return res.json();
};

export default function Sellers() {
  const queryClient = useQueryClient();
  const { data, status } = useQuery({ queryKey: ["fetchAllSellers"], queryFn: fetchAllSellers });

  const addMutation = useMutation({
    mutationFn: addSeller,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["fetchAllSellers"] }),
  });

  const [sellerForm, setSellerForm] = useState({ name: "", contact: "", email: "", address: "" });
  const [isDialogOpen, setDialogOpen] = useState(false);

  // Reset form when opening dialog
  useEffect(() => {
    console.log("Dialog state changed:", isDialogOpen);
    if (isDialogOpen) {
      setSellerForm({ name: "", contact: "", email: "", address: "" });
    }
  }, [isDialogOpen,data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addMutation.mutateAsync(sellerForm);
      setDialogOpen(false); // Close dialog after successful mutation
    } catch (error) {
      console.error("Failed to add seller:", error);
    }
  };

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

  return (
    <main className="flex-1 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold">Sellers</h1>
      <Button className="mt-4" onClick={() => {
        console.log(isDialogOpen)
        setDialogOpen((prev) => {
          console.log("Previous state:", prev);
          return true;
        });
      }}>Add Seller</Button>

<Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)} className="relative z-50">
      {/* The backdrop */}
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        {/* The actual dialog panel */}
        <DialogPanel className="max-w-lg space-y-4 bg-white p-12 rounded-lg shadow-lg">
          <DialogTitle className="font-bold text-lg">Update Seller Status</DialogTitle>
          <p>Are you sure you want to update the status of {Sellers?.name}?</p>
          <div className="flex gap-4">
            <button
              className="px-4 py-2 bg-gray-300 rounded"
              onClick={() => setDialogOpen(false)}
              
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded"
              onClick={handleSubmit}
             
            >
              
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>

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
