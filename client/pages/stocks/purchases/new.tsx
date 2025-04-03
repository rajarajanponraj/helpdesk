import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";

export default function CreatePurchase() {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [sellers, setSellers] = useState<Array<{ id: string; name: string }>>([]);

  // Fetch Sellers from API
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await fetch("/api/v1/sellers/all", {
          method: "GET",
          headers: { Authorization: `Bearer ${getCookie("session")}` },
        });
        console.log(getCookie("session"));
        const data = await response.json();
        if (data.success && Array.isArray(data.sellers)) {
            setSellers(data.sellers);
          } else {
            setSellers([]); // Ensure state is not undefined
          }
      } catch (error) {
        console.error("Error fetching sellers:", error);
      }
    };

    fetchSellers();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        stockId: data.stockId || null,
        sellerId: data.sellerId,
        quantity: Number(data.quantity), // Ensure numeric values
        price: Number(data.price),
        proofType: data.proofType,
        proofFile: data.proofFile[0] || null,
      };
  console.log(payload);
      const response = await fetch("/api/v1/purchases/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set JSON content type
          Authorization: `Bearer ${getCookie("session")}`,
        },
        body: JSON.stringify(payload), // Send JSON instead of FormData
      });

      const result = await response.json();
      if (result.success) {
        reset();
        router.push("/stocks/purchases");
      } else {
        alert("Failed to create purchase");
      }
    } catch (error) {
      console.log(error)
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Create Purchase</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="text"
          placeholder="Stock ID"
          {...register("stockId")}
          className="w-full p-2 border rounded"
        />

        <select {...register("sellerId")} className="w-full p-2 border rounded" required>
          <option value="">Select Seller</option>
          {sellers.length > 0 &&
            sellers.map((seller) => (
              <option key={seller.id} value={seller.id}>
                {seller.name}
              </option>
            ))}
        </select>

        <input
          type="number"
          placeholder="Quantity"
          {...register("quantity")}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Price"
          {...register("price")}
          className="w-full p-2 border rounded"
          required
        />
        <select {...register("proofType")} className="w-full p-2 border rounded" required>
          <option value="Invoice">Invoice</option>
          <option value="Receipt">Receipt</option>
          <option value="Warranty">Warranty</option>
        </select>
        <input type="file" {...register("proofFile")} className="w-full p-2 border rounded" />

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded" disabled={loading}>
          {loading ? "Saving..." : "Create Purchase"}
        </button>
      </form>
    </main>
  );
}
