import { getCookie } from "cookies-next";
import React, { useMemo, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getFilteredRowModel,
} from "@tanstack/react-table";

const fetchLabStocks = async () => {
    const res = await fetch(`/api/v1/stocks/all`, {
        headers: {
            Authorization: `Bearer ${getCookie("session")}`,
        },
    });
    return res.json();
};

const allocateStock = async (allocationData: { 
    stockId: string; 
    labId: string; 
    quantity: number; 
    serialNumber?: string; 
    condition: string; 
}) => {
    const res = await fetch(`/api/v1/labstocks/allocate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getCookie("session")}`,
        },
        body: JSON.stringify(allocationData),
    });
    return res.json();
};

export default function LabStockAllocation() {
    const router = useRouter();
    const { data, status } = useQuery({ queryKey: ["fetchLabStocks"], queryFn: fetchLabStocks });
    const [globalFilter, setGlobalFilter] = useState("");
    const [allocation, setAllocation] = useState({ 
        stockId: "", 
        labId: "", 
        quantity: 0, 
        serialNumber: "", 
        condition: "New" // Default condition
    });

    const mutation = useMutation({
        mutationFn: allocateStock,
        onSuccess: () => {
            alert("Stock allocated successfully!");
        },
        onError: () => {
            alert("Failed to allocate stock.");
        },
    });

    const columns = useMemo(
        () => [
            { header: "Stock Name", accessorKey: "name" },
            { header: "Category", accessorKey: "category" },
            { header: "Available Quantity", accessorKey: "availableQuantity" },
            {
                header: "Actions",
                id: "actions",
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button
                            className="text-blue-600 underline"
                            onClick={() => setAllocation({ ...allocation, stockId: row.original.id })}
                        >
                            Allocate
                        </button>
                    </div>
                ),
            },
        ],
        [allocation]
    );

    const table = useReactTable({
        data: data?.stocks || [],
        columns,
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    const handleAllocate = () => {
        if (allocation.stockId && allocation.labId && allocation.quantity > 0 && allocation.condition) {
            mutation.mutate(allocation);
        } else {
            alert("Please fill all fields correctly.");
        }
    };

    return (
        <main className="flex-1 max-w-6xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold">Lab Stock Allocation</h1>
            </div>

            <input
                type="text"
                placeholder="Search lab stocks..."
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

            <div className="mt-6">
                <h2 className="text-xl font-bold mb-4">Allocate Stock</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Dropdown for Stock ID */}
                    <select
                        value={allocation.stockId}
                        onChange={(e) => setAllocation({ ...allocation, stockId: e.target.value })}
                        className="px-3 py-2 border rounded-md"
                    >
                        <option value="">Select Stock</option>
                        {data?.stocks?.map((stock) => (
                            <option key={stock.id} value={stock.id}>
                                {stock.name} (Available: {stock.availableQuantity})
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Lab ID"
                        value={allocation.labId}
                        onChange={(e) => setAllocation({ ...allocation, labId: e.target.value })}
                        className="px-3 py-2 border rounded-md"
                    />
                    <input
                        type="number"
                        placeholder="Quantity"
                        value={allocation.quantity}
                        onChange={(e) => setAllocation({ ...allocation, quantity: Number(e.target.value) })}
                        className="px-3 py-2 border rounded-md"
                    />
                    <input
                        type="text"
                        placeholder="Serial Number"
                        value={allocation.serialNumber}
                        onChange={(e) => setAllocation({ ...allocation, serialNumber: e.target.value })}
                        className="px-3 py-2 border rounded-md"
                    />
                    <select
                        value={allocation.condition}
                        onChange={(e) => setAllocation({ ...allocation, condition: e.target.value })}
                        className="px-3 py-2 border rounded-md"
                    >
                        <option value="New">New</option>
                        <option value="Good">Good</option>
                        <option value="Needs Repair">Needs Repair</option>
                    </select>
                    <button
                        onClick={handleAllocate}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md"
                    >
                        Allocate
                    </button>
                </div>
            </div>
        </main>
    );
}