import { getCookie } from "cookies-next";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";

const addDepartment = async (department) => {
  const res = await fetch(`/api/v1/departments/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("session")}`,
    },
    body: JSON.stringify(department),
  });
  return res.json();
};

export default function CreateDepartment() {
  const router = useRouter();
  const [departmentForm, setDepartmentForm] = useState({ name: "" });

  const addMutation = useMutation({
    mutationFn: addDepartment,
    onSuccess: () => {
      router.push("/stocks/department");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addMutation.mutateAsync(departmentForm);
  };

  return (
    <main className="flex-1 max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-4">Create Department</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Department Name"
          value={departmentForm.name}
          onChange={(e) => setDepartmentForm({ ...departmentForm, name: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Submit
        </button>
      </form>
      <button
        onClick={() => router.push("/stocks/department")}
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md"
      >
        Cancel
      </button>
    </main>
  );
}