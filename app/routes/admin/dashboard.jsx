import { useState } from "react";
import { Link } from "react-router";

// ── Mock stats ──
const stats = [
  {
    label: "Total Revenue",
    value: "KES 284,500",
    change: "+12.5%",
    up: true,
    icon: "💰",
  },
  {
    label: "Total Orders",
    value: "237",
    change: "+8.2%",
    up: true,
    icon: "📦",
  },
  { label: "Total Products", value: "16", change: "+2", up: true, icon: "🛍️" },
  {
    label: "Total Customers",
    value: "189",
    change: "+15.3%",
    up: true,
    icon: "👥",
  },
];

// ── Mock recent orders ──
const recentOrders = [
  {
    id: "COS-001",
    customer: "John Kamau",
    items: 3,
    total: 2450,
    status: "delivered",
    date: "30 Mar 2026",
  },
  {
    id: "COS-002",
    customer: "Mary Wanjiku",
    items: 1,
    total: 1200,
    status: "processing",
    date: "30 Mar 2026",
  },
  {
    id: "COS-003",
    customer: "Peter Ochieng",
    items: 2,
    total: 1750,
    status: "shipped",
    date: "29 Mar 2026",
  },
  {
    id: "COS-004",
    customer: "Grace Muthoni",
    items: 4,
    total: 5200,
    status: "pending",
    date: "29 Mar 2026",
  },
  {
    id: "COS-005",
    customer: "James Mutua",
    items: 1,
    total: 800,
    status: "cancelled",
    date: "28 Mar 2026",
  },
  {
    id: "COS-006",
    customer: "Agnes Njeri",
    items: 2,
    total: 1550,
    status: "delivered",
    date: "28 Mar 2026",
  },
  {
    id: "COS-007",
    customer: "David Kiprono",
    items: 1,
    total: 450,
    status: "processing",
    date: "27 Mar 2026",
  },
];

// ── Mock top products ──
const topProducts = [
  { name: "Holy Bible (RSV)", sales: 42, revenue: 50400, category: "books" },
  {
    name: "Catechism of the Church",
    sales: 35,
    revenue: 52500,
    category: "books",
  },
  {
    name: "Wooden Rosary Beads",
    sales: 61,
    revenue: 27450,
    category: "articles",
  },
  {
    name: "Miraculous Medal (Silver)",
    sales: 58,
    revenue: 17400,
    category: "articles",
  },
  { name: "Divine Mercy Novena CD", sales: 29, revenue: 23200, category: "av" },
];

const statusStyles = {
  delivered: "bg-green-100 text-green-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  pending: "bg-yellow-100 text-yellow-800",
  cancelled: "bg-red-100 text-red-800",
};

const categoryIcon = { books: "📖", articles: "✝️", av: "🎵" };

export default function AdminDashboard() {
  const [orderSearch, setOrderSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = recentOrders.filter((o) => {
    const matchSearch =
      o.customer.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.id.toLowerCase().includes(orderSearch.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex flex-col gap-8">
      {/* ── Page title ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="text-sm text-gray-400">Monday, 30 March 2026</div>
      </div>

      {/* ── Stats cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">{stat.icon}</span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  stat.up
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue bar chart (CSS-based) */}
        <div className="xl:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-gray-800">Monthly Revenue</h2>
              <p className="text-xs text-gray-400 mt-0.5">Last 7 months</p>
            </div>
            <span className="text-xs bg-red-50 text-red-700 px-3 py-1 rounded-full font-semibold">
              2026
            </span>
          </div>
          <RevenueChart />
        </div>

        {/* Category breakdown */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-bold text-gray-800 mb-1">Sales by Category</h2>
          <p className="text-xs text-gray-400 mb-6">All time</p>
          <CategoryBreakdown />
        </div>
      </div>

      {/* ── Orders + Top products row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent orders table */}
        <div className="xl:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">Recent Orders</h2>
            <Link
              to="/admin/orders"
              className="text-xs text-red-600 hover:underline font-semibold"
            >
              View all →
            </Link>
          </div>

          {/* Filters */}
          <div className="flex gap-3 mb-4 flex-wrap">
            <input
              type="text"
              placeholder="Search orders..."
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 flex-1 min-w-0"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500 text-xs">
                  <th className="pb-3 font-semibold">Order ID</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold text-center">Items</th>
                  <th className="pb-3 font-semibold text-right">Total</th>
                  <th className="pb-3 font-semibold text-center">Status</th>
                  <th className="pb-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 text-center text-gray-400 text-sm"
                    >
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition"
                    >
                      <td className="py-3 font-mono text-xs text-red-700 font-bold">
                        {order.id}
                      </td>
                      <td className="py-3 text-gray-800 font-medium">
                        {order.customer}
                      </td>
                      <td className="py-3 text-center text-gray-500">
                        {order.items}
                      </td>
                      <td className="py-3 text-right font-semibold text-gray-800">
                        KES {order.total.toLocaleString()}
                      </td>
                      <td className="py-3 text-center">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${statusStyles[order.status]}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 text-gray-400 text-xs">
                        {order.date}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top products */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">Top Products</h2>
            <Link
              to="/admin/products"
              className="text-xs text-red-600 hover:underline font-semibold"
            >
              Manage →
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center gap-3">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    index === 0
                      ? "bg-yellow-100 text-yellow-700"
                      : index === 1
                        ? "bg-gray-100 text-gray-600"
                        : index === 2
                          ? "bg-orange-100 text-orange-700"
                          : "bg-gray-50 text-gray-400"
                  }`}
                >
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-400">{product.sales} sales</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-gray-800">
                    KES {product.revenue.toLocaleString()}
                  </p>
                  <p className="text-xs">{categoryIcon[product.category]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Revenue bar chart (pure CSS) ──
function RevenueChart() {
  const data = [
    { month: "Oct", value: 38000 },
    { month: "Nov", value: 52000 },
    { month: "Dec", value: 81000 },
    { month: "Jan", value: 45000 },
    { month: "Feb", value: 63000 },
    { month: "Mar", value: 72000 },
    { month: "Apr", value: 284500 },
  ];
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="flex items-end gap-2 h-40">
      {data.map((d) => (
        <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-xs text-gray-400 font-medium">
            {d.value >= 1000 ? `${Math.round(d.value / 1000)}K` : d.value}
          </span>
          <div className="w-full flex items-end" style={{ height: "100px" }}>
            <div
              className="w-full bg-red-600 rounded-t-md hover:bg-red-700 transition-all"
              style={{ height: `${Math.round((d.value / max) * 100)}%` }}
            />
          </div>
          <span className="text-xs text-gray-500">{d.month}</span>
        </div>
      ))}
    </div>
  );
}

// ── Category breakdown (CSS progress bars) ──
function CategoryBreakdown() {
  const data = [
    { label: "Religious Books", pct: 45, color: "bg-red-500", icon: "📖" },
    { label: "Religious Articles", pct: 35, color: "bg-blue-500", icon: "✝️" },
    { label: "Audio & Video", pct: 20, color: "bg-green-500", icon: "🎵" },
  ];
  return (
    <div className="flex flex-col gap-5">
      {data.map((d) => (
        <div key={d.label} className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-1.5 text-gray-700 font-medium">
              <span className="text-base">{d.icon}</span>
              {d.label}
            </span>
            <span className="font-bold text-gray-800">{d.pct}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className={`${d.color} h-2 rounded-full transition-all`}
              style={{ width: `${d.pct}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
