import { getCookie } from "cookies-next";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";

const addSeller = async (seller: any) => {
  const res = await fetch(`/api/v1/sellers/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("session")}`,
    },
    body: JSON.stringify(seller),
  });
  return res.json();
};

export default function CreateSeller() {
  const router = useRouter();
  const [sellerForm, setSellerForm] = useState({ name: "", contact: "", email: "", address: "" });

  const addMutation = useMutation({
    mutationFn: addSeller,
    onSuccess: () => {
      router.push("/stocks/seller");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addMutation.mutateAsync(sellerForm);
  };

  return (
    <main className="flex-1 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-4">Create Seller</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={sellerForm.name}
          onChange={(e) => setSellerForm({ ...sellerForm, name: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Contact"
          value={sellerForm.contact}
          onChange={(e) => setSellerForm({ ...sellerForm, contact: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={sellerForm.email}
          onChange={(e) => setSellerForm({ ...sellerForm, email: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Address"
          value={sellerForm.address}
          onChange={(e) => setSellerForm({ ...sellerForm, address: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-md">
          Submit
        </button>
      </form>
      <button
        onClick={() => router.push("/sellers")}
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md"
      >
        Cancel
      </button>
    </main>
  );
}
