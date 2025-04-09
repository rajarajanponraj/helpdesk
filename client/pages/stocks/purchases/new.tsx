import { getCookie } from "cookies-next";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "@/shadcn/hooks/use-toast";

export default function AddPurchase() {
  const router = useRouter();
console.log(getCookie("session"))
  const [form, setForm] = useState({
    stockId: "",
    quantity: "",
    price: "",
    sellerId: "",
    proofType: "",
    proofFile: "",
  });

  const { data: stocks } = useQuery({
    queryKey: ["stocks"],
    queryFn: async () =>
      (await fetch(`/api/v1/stocks/all`, {
        headers: { Authorization: `Bearer ${getCookie("session")}` },
      })).json(),
  });

  
  const { data: sellers } = useQuery({
    queryKey: ["sellers"],
    queryFn: async () =>
      (await fetch(`/api/v1/sellers/all`, {
        headers: { Authorization: `Bearer ${getCookie("session")}` },
      })).json(),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const payload = {
        stockId: form.stockId,
        quantity:  parseInt(form.quantity),
        price: parseFloat(form.price),
        sellerId: form.sellerId,
        proofType: form.proofType,
        proofFile: form.proofFile
      };
    console.log(JSON.stringify(payload))
      const res = await fetch(`/api/v1/purchases/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getCookie("session")}`,
          "Content-Type": "application/json", // ✅ Don't set 'Content-Type', browser will do it
        },
        body: JSON.stringify(payload),
      });
    
      if (!res.ok) throw new Error("Failed to add purchase");
      return res.json();
    },
    onSuccess: () => {
       toast({
                  variant: "default",
                  title: "Success",
                  description: "Purchase created successfully",
                });
      router.push("/stocks/purchases");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as any;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate();
  };

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">➕ Add New Purchase</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Select Stock</label>
          <select name="stockId" required value={form.stockId} onChange={handleChange} className="w-full p-2 border">
            <option value="">-- Select --</option>
            {stocks?.stocks?.map((stock: any) => (
              <option key={stock.id} value={stock.id}>
                {stock.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Quantity</label>
          <input
            type="number"
            name="quantity"
            required
            value={form.quantity}
            onChange={handleChange}
            className="w-full p-2 border"
          />
        </div>

        <div>
          <label className="block font-medium">Price</label>
          <input
            type="number"
            name="price"
            required
            value={form.price}
            onChange={handleChange}
            className="w-full p-2 border"
          />
        </div>

        <div>
          <label className="block font-medium">Seller</label>
          <select name="sellerId" required value={form.sellerId} onChange={handleChange} className="w-full p-2 border">
            <option value="">-- Select --</option>
            {sellers?.sellers?.map((seller: any) => (
              <option key={seller.id} value={seller.id}>
                {seller.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Proof Type</label>
          <input
            type="text"
            name="proofType"
            required
            value={form.proofType}
            onChange={handleChange}
            className="w-full p-2 border"
          />
        </div>

        <div>
          <label className="block font-medium">Upload Proof</label>
          <input
            type="file"
            name="proofFile"
            accept="application/pdf,image/*"
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {isPending ? "Submitting..." : "Submit Purchase"}
        </button>
      </form>
    </main>
  );
}
