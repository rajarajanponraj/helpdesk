import { getCookie } from "cookies-next";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import TicketsMobileList from "../TicketsMobileList";

const fetchALLTickets = async () => {
  const res = await fetch(`/api/v1/tickets/all/admin`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("session")}`,
    },
  });
  return res.json();
};

export default function AdminTicketLayout() {
  const { data, status } = useQuery({
    queryKey: ["fetchAllTickets"],
    queryFn: fetchALLTickets,
  });

  const columns = useMemo(
    () => [
      { header: "Type", accessorKey: "type", size: 50 },
      {
        header: "Summary",
        accessorKey: "title",
        cell: ({ getValue }) => <span className="max-w-[240px] truncate">{getValue()}</span>,
      },
      {
        header: "Assignee",
        accessorKey: "assignedTo.name",
        cell: ({ getValue }) => <span className="w-[80px] truncate">{getValue() || "n/a"}</span>,
      },
      {
        header: "Client",
        accessorKey: "client.name",
        cell: ({ getValue }) => <span className="w-[80px] truncate">{getValue() || "n/a"}</span>,
      },
      {
        header: "Priority",
        accessorKey: "priority",
        cell: ({ getValue }) => {
          const priorityClasses = {
            Low: "bg-blue-100 text-blue-800",
            Normal: "bg-green-100 text-green-800",
            High: "bg-red-100 text-red-800",
          };
          return (
            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ${priorityClasses[getValue()]}`}>{getValue()}</span>
          );
        },
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ getValue }) => {
          const statusMap = {
            needs_support: "Needs Support",
            in_progress: "In Progress",
            in_review: "In Review",
            done: "Done",
          };
          return <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700">{statusMap[getValue()]}</span>;
        },
      },
      {
        header: "Created",
        accessorKey: "createdAt",
        cell: ({ getValue }) => <span>{moment(getValue()).format("DD/MM/YYYY")}</span>,
      },
    ],
    []
  );

  const table = useReactTable({
    data: data?.tickets || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
  });

  return (
    <>
      {status === "success" && data.tickets.length > 0 ? (
        <div className="hidden sm:block overflow-x-auto">
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
      ) : (
        <div className="text-center mt-72">
          <h3 className="mt-2 text-sm font-medium text-gray-900">You currently don't have any assigned tickets. :)</h3>
        </div>
      )}
    </>
  );
}
