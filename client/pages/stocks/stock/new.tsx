import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";

export default function CreateStock() {
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const computerCategories = [
    { id: "1", name: "Laptops" },
    { id: "2", name: "Desktops" },
    { id: "3", name: "Monitors" },
    { id: "4", name: "Keyboards" },
    { id: "5", name: "Mice" },
    { id: "6", name: "Printers" },
    { id: "7", name: "Scanners" },
    { id: "8", name: "Storage Devices" },
    { id: "9", name: "Networking Equipment" },
    { id: "10", name: "Software" },
    { id: "11", name: "Computer Accessories" },
    { id: "12", name: "Graphics Cards" },
    { id: "13", name: "Processors" },
    { id: "14", name: "RAM" },
    { id: "15", name: "Motherboards" },
    { id: "16", name: "Power Supplies" },
    { id: "17", name: "Cooling Systems" },
    { id: "18", name: "Webcams" },
    { id: "19", name: "Speakers & Headphones" },
    { id: "20", name: "Cables & Adapters" },
  ];
  

  // Fetch Categories from API
  useEffect(() => {
    setCategories(computerCategories);
  }, []);
console.log(getCookie("session"))
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        name: data.name,
        categoryId: data.categoryId,
        description: data.description || "",
        quantity: Number(data.quantity),
        unitPrice: Number(data.unitPrice),
      };
      console.log(payload)
      const response = await fetch("/api/v1/stocks/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("session")}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.success) {
        reset();
        router.push("/stocks/stock");
      } else {
        alert("Failed to create stock");
      }
    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Create Stock</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="text"
          placeholder="Stock Name"
          {...register("name", { required: true })}
          className="w-full p-2 border rounded"
        />

        <select {...register("categoryId", { required: true })} className="w-full p-2 border rounded">
          <option value="">Select Category</option>
          {categories.length > 0 &&
            categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
        </select>

        <textarea
          placeholder="Description"
          {...register("description")}
          className="w-full p-2 border rounded"
        ></textarea>

        <input
          type="number"
          placeholder="Quantity"
          {...register("quantity", { required: true })}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          step="0.01"
          placeholder="Unit Price"
          {...register("unitPrice", { required: true })}
          className="w-full p-2 border rounded"
        />

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded" disabled={loading}>
          {loading ? "Saving..." : "Create Stock"}
        </button>
      </form>
    </main>
  );
}
