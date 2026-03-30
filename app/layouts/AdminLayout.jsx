import { Outlet, Link } from "react-router";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-red-800 text-white p-6 flex flex-col gap-4">
        <h2 className="text-xl font-bold mb-4">✝ Admin Panel</h2>
        <Link to="/admin" className="hover:bg-red-700 px-3 py-2 rounded">
          Dashboard
        </Link>
        <Link
          to="/admin/products"
          className="hover:bg-red-700 px-3 py-2 rounded"
        >
          Products
        </Link>
        <Link to="/admin/orders" className="hover:bg-red-700 px-3 py-2 rounded">
          Orders
        </Link>
        <Link
          to="/"
          className="mt-auto hover:bg-red-700 px-3 py-2 rounded text-red-200"
        >
          ← Back to Store
        </Link>
      </aside>
      {/* Content */}
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
}
