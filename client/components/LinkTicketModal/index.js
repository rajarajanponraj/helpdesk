import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import { XIcon } from "@heroicons/react/24/outline";
import { CheckIcon, SelectorIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function LinkTicket({ id }) {
  const [open, setOpen] = useState(false);
  const [tickets, setTickets] = useState();
  const [n, setN] = useState();

  const router = useRouter();

  async function fetchTickets() {
    await fetch(`/api/v1/ticket/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res) {
          setTickets(res.tickets);
        }
      });
  }

  async function postData() {
    await fetch(`/api/v1/ticket/${id}/link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ticket: n,
      }),
    });
  }

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div>
      <button
        className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-xs text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
        onClick={() => {
          setOpen(true);
        }}
      >
        Link Ticket
      </button>

      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={setOpen}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl h-64 sm:w-full sm:p-6">
                <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                  <button
                    type="button"
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start w-full">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Link Ticket
                    </Dialog.Title>
                    <div className="mt-2 pb-16">
                      <p>
                        Link the selected ticket with another in order to keep
                        track of multiple tickets for the same or similar jobs.
                      </p>
                      <Listbox value={n} onChange={setN} className="z-50">
                        {({ open }) => (
                          <>
                            <div className="mt-1 relative">
                              <Listbox.Button className="bg-white relative w-full border border-gray-300 rounded-md shadow-xs pl-3 pr-10 py-2 text-left cursor-default focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <span className="block truncate">
                                  {n
                                    ? n.title + " - #" + n.id
                                    : "Please select new user"}
                                </span>
                                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                  <SelectorIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                </span>
                              </Listbox.Button>

                              <Transition
                                show={open}
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Listbox.Options className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-hidden sm:text-sm">
                                  {tickets.map((ticket) => (
                                    <Listbox.Option
                                      key={ticket.id}
                                      className={({ active }) =>
                                        classNames(
                                          active
                                            ? "text-white bg-indigo-600"
                                            : "text-gray-900",
                                          "cursor-default select-none relative py-2 pl-3 pr-9"
                                        )
                                      }
                                      value={ticket}
                                    >
                                      {({ n, active }) => (
                                        <>
                                          <span
                                            className={classNames(
                                              n
                                                ? "font-semibold"
                                                : "font-normal",
                                              "block truncate"
                                            )}
                                          >
                                            {ticket.title} - #{ticket.id}
                                          </span>

                                          {n ? (
                                            <span
                                              className={classNames(
                                                active
                                                  ? "text-white"
                                                  : "text-indigo-600",
                                                "absolute inset-y-0 right-0 flex items-center pr-4"
                                              )}
                                            >
                                              <CheckIcon
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                              />
                                            </span>
                                          ) : null}
                                        </>
                                      )}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          </>
                        )}
                      </Listbox>

                      <button
                        onClick={() => {
                          postData();
                          setOpen(false);
                        }}
                        type="button"
                        className="float-right mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-xs text-white bg-green-600 hover:bg-green-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
