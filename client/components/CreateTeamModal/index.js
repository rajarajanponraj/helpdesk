import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";

export default function CreateUser() {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");

  const router = useRouter();

  async function createTeam() {
    await fetch("/api/v1/admin/team/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
      }),
    }).then((res) => res.json());
  }

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        type="button"
        className="inline-flex items-center p-1 border border-transparent rounded-md shadow-xs px-4 text-white bg-green-600 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        Create new Team
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
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
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
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Create a new Team
                    </Dialog.Title>
                    <div className="mt-2 space-y-4">
                      <input
                        type="text"
                        className="shadow-xs focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Team Name"
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-xs px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      createTeam();
                      // router.reload(router.pathname);
                    }}
                  >
                    Create
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
