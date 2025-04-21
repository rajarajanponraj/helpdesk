import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";

const fetchDashboardData = async (token) => {
  const res = await fetch(`/api/v1/dashboard/summary`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch dashboard data");
  }
  return res.json();
};

export default function InventoryDashboard() {
  const token = getCookie("session");

  const { data, status } = useQuery({
    queryKey: ["dashboardSummary"],
    queryFn: () => fetchDashboardData(token),
  });

  return (
    <div className="flex flex-col p-6 space-y-6">
      {/* Header */}
      <div className="flex align-middle flex-row justify-center">
        <img className="h-12 w-auto" src="/logo.svg" alt="logo" />
        <h1 className="text-2xl ml-2 mt-3 font-extrabold text-green-600">
          Helpdesk Inventory Management
        </h1>
      </div>

      {/* Welcome Message */}
      <h1 className="font-bold text-xl text-center">
        Welcome to the Inventory Management Dashboard!
      </h1>

      {/* Summary Section */}
      {status === "loading" && <p>Loading dashboard data...</p>}
      {status === "error" && <p>Error loading dashboard data.</p>}
      {status === "success" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 border rounded-lg shadow hover:shadow-md">
            <h2 className="text-lg font-bold text-gray-700">Total Items</h2>
            <p className="text-2xl font-bold text-green-600">
              {data.totalItems || 0}
            </p>
          </div>
          <div className="p-4 border rounded-lg shadow hover:shadow-md">
            <h2 className="text-lg font-bold text-gray-700">Scraped Items</h2>
            <p className="text-2xl font-bold text-red-600">
              {data.scrapedItems || 0}
            </p>
          </div>
          <div className="p-4 border rounded-lg shadow hover:shadow-md">
            <h2 className="text-lg font-bold text-gray-700">Latest Purchase</h2>
            <p className="text-sm text-gray-500">
              {data.latestPurchase
                ? `${data.latestPurchase.itemName} - ${data.latestPurchase.quantity} units`
                : "No recent purchases"}
            </p>
          </div>
        </div>
      )}

      {/* Dashboard Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stocks Section */}
        <div className="p-4 border rounded-lg shadow hover:shadow-md">
          <h2 className="text-lg font-bold text-gray-700">Stocks</h2>
          <p className="text-sm text-gray-500">
            View and manage all available stocks in the inventory.
          </p>
          <Link
            href="/stocks/list"
            className="mt-2 inline-block text-blue-600 hover:underline"
          >
            Go to Stocks
          </Link>
        </div>

        {/* Purchases Section */}
        <div className="p-4 border rounded-lg shadow hover:shadow-md">
          <h2 className="text-lg font-bold text-gray-700">Purchases</h2>
          <p className="text-sm text-gray-500">
            Track and manage all purchase records.
          </p>
          <Link
            href="/stocks/purchases"
            className="mt-2 inline-block text-blue-600 hover:underline"
          >
            Go to Purchases
          </Link>
        </div>

        {/* Sales Section */}
        <div className="p-4 border rounded-lg shadow hover:shadow-md">
          <h2 className="text-lg font-bold text-gray-700">Sales</h2>
          <p className="text-sm text-gray-500">
            View and manage all sales transactions.
          </p>
          <Link
            href="/stocks/sales"
            className="mt-2 inline-block text-blue-600 hover:underline"
          >
            Go to Sales
          </Link>
        </div>

        {/* Allocated Lab Stocks Section */}
        <div className="p-4 border rounded-lg shadow hover:shadow-md">
          <h2 className="text-lg font-bold text-gray-700">Allocated Lab Stocks</h2>
          <p className="text-sm text-gray-500">
            Manage stocks allocated to different labs.
          </p>
          <Link
            href="/stocks/labstocks"
            className="mt-2 inline-block text-blue-600 hover:underline"
          >
            Go to Allocated Lab Stocks
          </Link>
        </div>

        {/* Reports Section */}
        <div className="p-4 border rounded-lg shadow hover:shadow-md">
          <h2 className="text-lg font-bold text-gray-700">Reports</h2>
          <p className="text-sm text-gray-500">
            Generate and view inventory reports.
          </p>
          <Link
            href="/stocks/reports"
            className="mt-2 inline-block text-blue-600 hover:underline"
          >
            Go to Reports
          </Link>
        </div>

        {/* Settings Section */}
        <div className="p-4 border rounded-lg shadow hover:shadow-md">
          <h2 className="text-lg font-bold text-gray-700">Settings</h2>
          <p className="text-sm text-gray-500">
            Configure inventory management settings.
          </p>
          <Link
            href="/stocks/settings"
            className="mt-2 inline-block text-blue-600 hover:underline"
          >
            Go to Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
