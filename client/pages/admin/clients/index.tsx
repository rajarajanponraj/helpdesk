import { getCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
// import ClientNotesModal from "../../components/ClientNotesModal";
// import UpdateClientModal from "../../components/UpdateClientModal";

const fetchAllClients = async () => {
  const res = await fetch(`/api/v1/clients/all`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("session")}`,
    },
  });
  return res.json();
};

function DefaultColumnFilter({ column: { filterValue, setFilter } }: any) {
  return (
    <input
      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
      type="text"
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder="Type to filter"
    />
  );
}
function Table({ columns, data }: any) {
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      // fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows: any, id: any, filterValue: any) =>
        rows.filter((row: any) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        }),
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const table = useReactTable({
    data: data?.clients || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="overflow-x-auto md:-mx-6 lg:-mx-8">
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
  );
}

export default function Clients() {
  const { data, status,refetch } = useQuery({
    queryKey: ["fetchAllClients"],
    queryFn: fetchAllClients,
  });
 

  const router = useRouter();

  async function deleteClient(id: any) {
    await fetch(`/api/v1/clients/${id}/delete-client`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getCookie("session")}`,
      },
    })
      .then((res) => res.json())
      .then(() => {
        refetch();
      });
  }

  const columns = React.useMemo(
    () => [
      {
        Header: "Client Name",
        accessor: "name",
        width: 10,
        id: "client_name",
      },
      {
        Header: "Contact Name",
        accessor: "contactName",
        id: "contactName",
      },
      {
        Header: "",
        id: "actions",
        Cell: ({ row, value }: any) => {
          return (
            <div className="space-x-4 flex flex-row">
              {/* <UpdateClientModal client={row.original} />
            <ClientNotesModal notes={row.original.notes} id={row.original.id} /> */}
              <button
                type="button"
                className="rounded bg-white hover:bg-red-100 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:text-white shadow-sm ring-1 ring-inset ring-gray-300"
                onClick={() => deleteClient(row.original.id)}
              >
                Delete
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <main className="flex-1">
      <div className="relative max-w-4xl mx-auto md:px-8 xl:px-0">
        <div className="pt-10 pb-16 divide-y-2">
          <div className="px-4 sm:px-6 md:px-0">
            <h1 className="text-3xl font-extrabold text-gray-900  dark:text-white">
              Clients
            </h1>
          </div>
          <div className="px-4 sm:px-6 md:px-0">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto mt-4">
                <p className="mt-2 text-sm text-gray-700  dark:text-white">
                  A list of all internal users of your instance.
                </p>
              </div>
              <div className="sm:ml-16 mt-5 flex flex-row space-x-2">
                <Link
                  href={`/submit`}
                  type="button"
                  className="inline-flex items-center px-2.5 py-1.5 border font-semibold border-gray-300 shadow-sm text-xs rounded text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Guest Ticket Url
                </Link>
                <Link
                  href={`/portal/`}
                  type="button"
                  className="inline-flex items-center px-2.5 py-1.5 border font-semibold border-gray-300 shadow-sm text-xs rounded text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Portal Url
                </Link>
                <Link
                  href={`/auth/register`}
                  type="button"
                  className="inline-flex items-center px-2.5 py-1.5 border font-semibold border-gray-300 shadow-sm text-xs rounded text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Portal Register
                </Link>
                <Link
                  href="/admin/clients/new"
                  className="rounded bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  New Client
                </Link>
              </div>
            </div>
            <div className="py-4">
              {status === "pending" && (
                <div className="min-h-screen flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
                  <h2> Loading data ... </h2>
                </div>
              )}

              {status === "error" && (
                <div className="min-h-screen flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
                  <h2 className="text-2xl font-bold">
                    {" "}
                    Error fetching data ...{" "}
                  </h2>
                </div>
              )}

              {status === "success" && (
                <div>
                  <div className="hidden sm:block">
                    <Table columns={columns} data={data.clients} />
                  </div>

                  <div className="sm:hidden">
                    {data.clients.map((client: any) => (
                      <div
                        key={client.id}
                        className="flex flex-col text-center bg-white rounded-lg shadow mt-4"
                      >
                        <div className="flex-1 flex flex-col p-8">
                          <h3 className=" text-gray-900 text-sm font-medium">
                            {client.name}
                          </h3>
                          <dl className="mt-1 flex-grow flex flex-col justify-between">
                            <dd className="text-gray-500 text-sm">
                              {client.number}
                            </dd>
                            <dt className="sr-only">Role</dt>
                            <dd className="mt-3">
                              <span>
                                Primary Contact - {client.contactName}
                              </span>
                            </dd>
                          </dl>
                        </div>
                        <div className="space-x-4 align-middle flex flex-row justify-center -mt-8 mb-4">
                          {/* <UpdateClientModal client={client} /> */}
                          {/* <ClientNotesModal
                            notes={client.notes}
                            id={client.id}
                          /> */}
                          {/* <button
                            type="button"
                            className=" inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                            onClick={() => setOpen(true)}
                          >
                            New Ticket
                          </button> */}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}