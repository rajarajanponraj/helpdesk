import { getCookie } from "cookies-next";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import TicketsMobileList from "../../components/TicketsMobileList";

const fetchAllTickets = async () => {
  const res = await fetch(`/api/v1/tickets/all/admin`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("session")}`,
    },
  });
  return res.json();
};

export default function Tickets() {
  const { data, status } = useQuery({
    queryKey: ["fetchAllTickets"],
    queryFn: fetchAllTickets,
  });

  const columns = [
    { header: "Type", accessorKey: "type" },
    { header: "Summary", accessorKey: "title" },
    { header: "Assignee", accessorKey: "assignedTo.name" },
    { header: "Client", accessorKey: "client.name" },
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
  ];

  const table = useReactTable({
    data: data?.tickets || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <main className="flex-1">
      <div className="relative max-w-4xl mx-auto md:px-8 xl:px-0">
        <h1 className="text-3xl font-extrabold text-gray-900">Tickets</h1>
        <div className="py-4">
          {status === "pending" && <h2>Loading data...</h2>}
          {status === "error" && <h2 className="text-2xl font-bold">Error fetching data...</h2>}
          {status === "success" && (
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
          )}
        </div>
      </div>
    </main>
  );
}
