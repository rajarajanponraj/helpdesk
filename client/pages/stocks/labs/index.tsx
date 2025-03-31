import { getCookie } from "cookies-next";
import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";

// Fetch all labs
const fetchAllLabs = async () => {
  const res = await fetch(`/api/v1/labs`, {
    headers: { Authorization: `Bearer ${getCookie("session")}` },
  });
  return res.json();
};

// Fetch all departments
const fetchDepartments = async () => {
  const res = await fetch(`/api/v1/departments`, {
    headers: { Authorization: `Bearer ${getCookie("session")}` },
  });
  return res.json();
};

// Create lab
const createLab = async (lab) => {
  const res = await fetch(`/api/v1/labs/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("session")}`,
    },
    body: JSON.stringify(lab),
  });
  return res.json();
};

// Delete lab
const deleteLab = async (id) => {
  await fetch(`/api/v1/labs/delete/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getCookie("session")}` },
  });
};

export default function Labs() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch labs and departments
  const { data, status } = useQuery({ queryKey: ["fetchAllLabs"], queryFn: fetchAllLabs });
  const { data: departmentData, status: departmentStatus } = useQuery({
    queryKey: ["fetchDepartments"],
    queryFn: fetchDepartments,
  });

  const [labData, setLabData] = useState({ name: "", location: "", departmentId: "" });

  // Create lab mutation
  const createMutation = useMutation({
    mutationFn: createLab,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["fetchAllLabs"] }),
  });

  // Delete lab mutation
  const deleteMutation = useMutation({
    mutationFn: deleteLab,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["fetchAllLabs"] }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(labData);
    setLabData({ name: "", location: "", departmentId: "" });
  };

  const columns = useMemo(
    () => [
      { header: "Lab Name", accessorKey: "name" },
      { header: "Location", accessorKey: "location" },
      { header: "Department", accessorKey: "department.name" },
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
    data: data?.labs || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <main className="flex-1 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold">Labs Management</h1>

      <form onSubmit={handleSubmit} className="mt-4 space-y-2">
        <input
          type="text"
          placeholder="Lab Name"
          value={labData.name}
          onChange={(e) => setLabData({ ...labData, name: e.target.value })}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Location"
          value={labData.location}
          onChange={(e) => setLabData({ ...labData, location: e.target.value })}
          className="border p-2 w-full"
        />

        {/* Department Dropdown */}
        <select
          value={labData.departmentId}
          onChange={(e) => setLabData({ ...labData, departmentId: e.target.value })}
          className="border p-2 w-full"
        >
          <option value="">Select Department</option>
          {departmentStatus === "pending" && <option disabled>Loading...</option>}
          {departmentStatus === "error" && <option disabled>Error fetching departments</option>}
          {departmentStatus === "success" &&
            departmentData.departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
        </select>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Create Lab
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
