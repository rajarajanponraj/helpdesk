import { Dialog, DialogBackdrop, Transition, TransitionChild } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { getCookie } from "cookies-next";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { useUser } from "../../store/session";
import { toast } from "@/shadcn/hooks/use-toast";
import { useSidebar } from "@/shadcn/ui/sidebar";

export default function CreateSellerModal({ keypress, setKeyPressDown }) {
  const { t } = useTranslation("peppermint");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const token = getCookie("session");
  const { user } = useUser();
  const { state } = useSidebar();

  // Seller Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  async function createSeller() {
    if (!name || !email || !phone || !address) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "All fields are required.",
      });
      return;
    }

    await fetch(`/api/v1/seller/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        address,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          toast({
            variant: "default",
            title: "Success",
            description: "Seller created successfully.",
          });
          setOpen(false);
          router.push("/sellers");
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: res.error || "Failed to create seller.",
          });
        }
      })
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "An error occurred while creating the seller.",
        });
      });
  }

  function checkPress() {
    if (keypress) {
      setOpen(true);
      setKeyPressDown(false);
    }
  }

  useEffect(() => checkPress(), [keypress]);

  return (
    <>
      <Transition show={open} as={Fragment}>
        <Dialog as="div" className="fixed z-10 inset-0" onClose={() => setOpen(false)}>
          <div className="flex items-center justify-center min-h-screen text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75" />
            </TransitionChild>

            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="bg-white dark:bg-gray-900 rounded-lg px-6 py-5 shadow-xl max-w-md w-full">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t("Create New Seller")}
                  </h3>
                  <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-700">
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="mt-4 space-y-4">
                  <input
                    type="text"
                    placeholder="Seller Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createSeller}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                  >
                    Create Seller
                  </button>
                </div>
              </div>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
