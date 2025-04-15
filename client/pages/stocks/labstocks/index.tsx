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
import { toast } from "@/shadcn/hooks/use-toast";

const fetchLabStocks = async () => {
    const res = await fetch(`/api/v1/stocks/all`, {
        headers: {
            Authorization: `Bearer ${getCookie("session")}`,
        },
    });
    return res.json();
};

const fetchLabs = async () => {
    try {
        const res = await fetch("/api/v1/labs", {
            headers: {
                Authorization: `Bearer ${getCookie("session")}`,
            },
        });
        console.log("labsData:", res.json);
        return await res.json();
    } catch (err) {
        console.error("Failed to fetch labs", err);
    } finally {
    }
};
console.log("labsData:", fetchLabs);
console.log(getCookie("session"));

const fetchAllocatedLabStocks = async () => {
    const res = await fetch(`/api/v1/lab-stocks/all`, {
        headers: {
            Authorization: `Bearer ${getCookie("session")}`,
        },
    });
    console.log(`allocatedLabStocks: ${res.json}`);
    return res.json();
};

const allocateStock = async (allocationData: {
    stockId: string;
    labId: string;
    quantity: number;
    serialNumber?: string;
    condition: string;
}) => {
    const res = await fetch(`/api/v1/lab-stocks/create`, {
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
    const { data: stocksData, status: stockStatus } = useQuery({ queryKey: ["fetchLabStocks"], queryFn: fetchLabStocks });
    const { data: labsData, status: labsStatus } = useQuery({ queryKey: ["fetchLabs"], queryFn: fetchLabs });
    const { data: allocatedLabStocks, status: allocatedLabStocksStatus } = useQuery({
        queryKey: ["fetchAllocatedLabStocks"],
        queryFn: fetchAllocatedLabStocks,
    });
    const [globalFilter, setGlobalFilter] = useState("");
    const [allocation, setAllocation] = useState({
        stockId: "",
        labId: "",
        quantity: 0,
        serialNumber: "",
        condition: "New", // Default condition
    });
    const [activeTab, setActiveTab] = useState("table"); // State to manage active tab

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
        data: stocksData?.stocks || [],
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

            {/* Tabs */}
            <div className="flex border-b mb-4">
                <button
                    className={`px-4 py-2 ${activeTab === "table" ? "border-b-2 border-blue-600 font-bold" : ""}`}
                    onClick={() => setActiveTab("table")}
                >
                    View Stocks
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === "allocate" ? "border-b-2 border-blue-600 font-bold" : ""}`}
                    onClick={() => setActiveTab("allocate")}
                >
                    Allocate Stock
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === "allocated" ? "border-b-2 border-blue-600 font-bold" : ""}`}
                    onClick={() => setActiveTab("allocated")}
                >
                    Allocated Lab Stocks
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === "table" && (
                <>
                    <input
                        type="text"
                        placeholder="Search lab stocks..."
                        value={globalFilter ?? ""}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="w-full mb-4 px-3 py-2 border rounded-md"
                    />

                    {stockStatus === "pending" && <h2>Loading...</h2>}
                    {stockStatus === "error" && <h2>Error loading data</h2>}
                    {stockStatus === "success" && (
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
                </>
            )}

            {activeTab === "allocate" && (
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
                            {stocksData?.stocks?.map((stock) => (
                                <option key={stock.id} value={stock.id}>
                                    {stock.name} (Available: {stock.availableQuantity})
                                </option>
                            ))}
                        </select>

                        {/* Dropdown for Lab ID */}
                        <select
                            value={allocation.labId}
                            onChange={(e) => setAllocation({ ...allocation, labId: e.target.value })}
                            className="px-3 py-2 border rounded-md"
                        >
                            <option value="">Select Lab</option>
                            {labsData?.labs?.map((lab) => (
                                <option key={lab.id} value={lab.id}>
                                    {lab.name}
                                </option>
                            ))}
                        </select>
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
            )}

            {activeTab === "allocated" && (
                <>
                    {allocatedLabStocksStatus === "pending" && <h2>Loading allocated lab stocks...</h2>}
                    {allocatedLabStocksStatus === "error" && <h2>Error loading allocated lab stocks</h2>}
                    {allocatedLabStocksStatus === "success" && (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-300">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border p-2 text-left">Stock Name</th>
                                        <th className="border p-2 text-left">Lab Name</th>
                                        <th className="border p-2 text-left">Quantity</th>
                                        <th className="border p-2 text-left">Condition</th>
                                        <th className="border p-2 text-left">Serial Number</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allocatedLabStocks?.labStocks.map((allocated) => (
                                       <tr key={allocated.id} className="border hover:bg-gray-50">
                                       <td className="p-2 border">{allocated.stock?.name || "N/A"}</td>
                                       <td className="p-2 border">{allocated.lab?.name || "N/A"}</td>
                                       <td className="p-2 border">{allocated.quantity}</td>
                                       <td className="p-2 border">{allocated.condition}</td>
                                       <td className="p-2 border">{allocated.serialNumber || "N/A"}</td>
                                       <td className="p-2 border">{new Date(allocated.allocatedAt).toLocaleString()}</td>
                                   </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </main>
    );
}