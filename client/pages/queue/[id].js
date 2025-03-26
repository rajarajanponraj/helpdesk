import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import Link from "next/link";
import Loader from "react-spinners/ClipLoader";
import { useRouter } from "next/router";
import TicketsMobileList from "../../components/TicketsMobileList";

async function getUserTickets(router) {
  const res = await fetch(`/api/v1/ticket/emailQueue?name=${router.query.id}`);
  return res.json();
}

export default function AssignedTickets() {
  const router = useRouter();
  const { data, status } = useQuery({
    queryKey: ["userTickets"],
    queryFn: () => getUserTickets(router),
  });

  const high = "bg-red-100 text-red-800";
  const low = "bg-blue-100 text-blue-800";
  const normal = "bg-green-100 text-green-800";

  const columns = React.useMemo(
    () => [
      { header: "No.", accessorKey: "Number", size: 10 },
      { header: "Name", accessorKey: "name" },
      { header: "Client", accessorKey: "client.name" },
      {
        header: "Priority",
        accessorKey: "priority",
        cell: ({ getValue }) => {
          let p = getValue();
          let badge = p === "Low" ? low : p === "Normal" ? normal : high;
          return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge}`}>
              {p}
            </span>
          );
        },
      },
      {
        header: "Title",
        accessorKey: "title",
        cell: ({ getValue }) => <div className="truncate">{getValue()}</div>,
      },
      {
        header: "Actions",
        accessorKey: "id",
        cell: ({ getValue }) => <Link href={`/tickets/${getValue()}`}>View</Link>,
      },
    ],
    []
  );

  const table = useReactTable({
    data: data?.tickets || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      {status === "pending" && (
        <div className="flex flex-col justify-center items-center h-screen">
          <Loader color="green" size={100} />
        </div>
      )}
      {status === "success" && (
        <>
          {data.tickets && data.tickets.length > 0 ? (
            <>
              <div className="hidden sm:block">
                <div className="overflow-x-auto">
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
              </div>
              <div className="sm:hidden">
                <TicketsMobileList tickets={data.tickets} />
              </div>
            </>
          ) : (
            <div className="text-center mt-72">
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                You currently don't have any assigned tickets. :)
              </h3>
            </div>
          )}
        </>
      )}
    </>
  );
}
