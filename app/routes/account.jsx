import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { orderAPI, userAPI } from "../services/api";

const statusStyles = {
  delivered: "bg-green-100 text-green-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  pending: "bg-yellow-100 text-yellow-800",
  cancelled: "bg-red-100 text-red-800",
};

const categoryIcon = { books: "📖", articles: "✝️", av: "🎵" };

export default function Account() {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);

  // Profile form
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState(null);

  // Redirect to login if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  // Fill profile form with current user data
  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  // Fetch orders
  useEffect(() => {
    if (!user) return;
    setOrdersLoading(true);
    orderAPI
      .getMyOrders()
      .then((data) => setOrders(data))
      .catch(() => setOrdersError("Failed to load orders."))
      .finally(() => setOrdersLoading(false));
  }, [user]);

  async function handleProfileSave(e) {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg(null);
    try {
      await userAPI.updateProfile(profileForm);
      setProfileMsg({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setProfileMsg({ type: "error", text: err.message });
    } finally {
      setProfileSaving(false);
    }
  }

  async function handlePasswordSave(e) {
    e.preventDefault();
    if (passwordForm.password.length < 8) {
      setPasswordMsg({
        type: "error",
        text: "Password must be at least 8 characters.",
      });
      return;
    }
    if (passwordForm.password !== passwordForm.confirmPassword) {
      setPasswordMsg({ type: "error", text: "Passwords do not match." });
      return;
    }
    setPasswordSaving(true);
    setPasswordMsg(null);
    try {
      await userAPI.updateProfile({ password: passwordForm.password });
      setPasswordMsg({
        type: "success",
        text: "Password changed successfully!",
      });
      setPasswordForm({ password: "", confirmPassword: "" });
    } catch (err) {
      setPasswordMsg({ type: "error", text: err.message });
    } finally {
      setPasswordSaving(false);
    }
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400 text-sm animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-red-700 text-white py-10">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Account</h1>
            <p className="text-red-200 text-sm mt-1">
              Welcome back, {user.firstName} {user.lastName}
            </p>
            <p className="text-red-300 text-xs mt-1">
              <Link to="/" className="hover:text-white">
                Home
              </Link>
              {" / "}
              <span className="text-white">Account</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="border border-red-300 text-red-100 px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* ── Sidebar ── */}
        <aside className="md:col-span-1">
          {/* User card */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-red-700">
                {user.firstName[0]}
                {user.lastName[0]}
              </span>
            </div>
            <div className="text-center">
              <p className="font-semibold text-gray-800">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
              {user.role === "admin" && (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold mt-1 inline-block">
                  Admin
                </span>
              )}
            </div>
          </div>

          {/* Nav tabs */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {[
              { id: "orders", label: "My Orders", icon: "📦" },
              { id: "profile", label: "Edit Profile", icon: "👤" },
              { id: "password", label: "Change Password", icon: "🔒" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition border-b border-gray-100 last:border-0 ${
                  activeTab === tab.id
                    ? "bg-red-50 text-red-700 border-l-2 border-l-red-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}

            {user.role === "admin" && (
              <Link
                to="/admin"
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-700 hover:bg-red-50 transition border-t border-gray-100"
              >
                <span>⚙️</span>
                Admin Panel
              </Link>
            )}
          </div>
        </aside>

        {/* ── Main content ── */}
        <div className="md:col-span-3">
          {/* ── ORDERS TAB ── */}
          {activeTab === "orders" && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-5">
                Order History
              </h2>

              {ordersLoading ? (
                <div className="flex flex-col gap-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="border border-gray-100 rounded-xl p-4 animate-pulse"
                    >
                      <div className="flex justify-between mb-3">
                        <div className="bg-gray-200 h-4 rounded w-1/4" />
                        <div className="bg-gray-200 h-4 rounded w-1/5" />
                      </div>
                      <div className="bg-gray-200 h-3 rounded w-1/3" />
                    </div>
                  ))}
                </div>
              ) : ordersError ? (
                <div className="text-center py-10 text-red-500">
                  <p>⚠️ {ordersError}</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <p className="text-5xl mb-4">📦</p>
                  <p className="text-lg font-semibold">No orders yet</p>
                  <p className="text-sm mt-1">
                    Your order history will appear here
                  </p>
                  <Link
                    to="/shop"
                    className="inline-block mt-4 bg-red-700 text-white px-6 py-2 rounded-lg hover:bg-red-800 transition text-sm font-semibold"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="border border-gray-200 rounded-xl p-4 hover:border-red-200 transition"
                    >
                      {/* Order header */}
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                        <div>
                          <span className="font-mono text-sm font-bold text-red-700">
                            {order.orderNumber}
                          </span>
                          <span className="text-xs text-gray-400 ml-3">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-KE",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusStyles[order.orderStatus]}`}
                        >
                          {order.orderStatus}
                        </span>
                      </div>

                      {/* Order items */}
                      <div className="flex flex-col gap-2 mb-3">
                        {order.orderItems.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 text-sm"
                          >
                            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center shrink-0">
                              <span className="text-sm opacity-40">
                                {categoryIcon[item.category]}
                              </span>
                            </div>
                            <span className="flex-1 text-gray-700 text-xs leading-tight">
                              {item.name}
                            </span>
                            <span className="text-gray-400 text-xs">
                              ×{item.quantity}
                            </span>
                            <span className="font-semibold text-gray-800 text-xs">
                              KES{" "}
                              {(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Order footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100 flex-wrap gap-2">
                        <div className="text-xs text-gray-500 flex gap-4">
                          <span>
                            Payment:{" "}
                            <span
                              className={`font-semibold ${
                                order.paymentStatus === "paid"
                                  ? "text-green-600"
                                  : "text-orange-500"
                              }`}
                            >
                              {order.paymentStatus}
                            </span>
                          </span>
                          <span className="capitalize">
                            Via: {order.paymentMethod}
                          </span>
                        </div>
                        <span className="font-bold text-red-700">
                          KES {order.total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── PROFILE TAB ── */}
          {activeTab === "profile" && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-5">
                Edit Profile
              </h2>

              {profileMsg && (
                <div
                  className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${
                    profileMsg.type === "success"
                      ? "bg-green-50 border border-green-200 text-green-700"
                      : "bg-red-50 border border-red-200 text-red-700"
                  }`}
                >
                  {profileMsg.text}
                </div>
              )}

              <form
                onSubmit={handleProfileSave}
                className="flex flex-col gap-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      First name
                    </label>
                    <input
                      type="text"
                      value={profileForm.firstName}
                      onChange={(e) =>
                        setProfileForm((p) => ({
                          ...p,
                          firstName: e.target.value,
                        }))
                      }
                      className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      Last name
                    </label>
                    <input
                      type="text"
                      value={profileForm.lastName}
                      onChange={(e) =>
                        setProfileForm((p) => ({
                          ...p,
                          lastName: e.target.value,
                        }))
                      }
                      className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                  </div>
                </div>

                {/* Email (read only) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Email address
                    <span className="text-gray-400 font-normal ml-1">
                      (cannot be changed)
                    </span>
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Phone number
                  </label>
                  <div className="flex">
                    <span className="border border-r-0 border-gray-300 bg-gray-50 rounded-l-lg px-3 py-2.5 text-sm text-gray-500">
                      +254
                    </span>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) =>
                        setProfileForm((p) => ({ ...p, phone: e.target.value }))
                      }
                      placeholder="700 000 000"
                      className="flex-1 border border-gray-300 rounded-r-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={profileSaving}
                  className={`w-full py-3 rounded-xl font-bold text-white transition ${
                    profileSaving
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-red-700 hover:bg-red-800"
                  }`}
                >
                  {profileSaving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          )}

          {/* ── PASSWORD TAB ── */}
          {activeTab === "password" && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-5">
                Change Password
              </h2>

              {passwordMsg && (
                <div
                  className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${
                    passwordMsg.type === "success"
                      ? "bg-green-50 border border-green-200 text-green-700"
                      : "bg-red-50 border border-red-200 text-red-700"
                  }`}
                >
                  {passwordMsg.text}
                </div>
              )}

              <form
                onSubmit={handlePasswordSave}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    New password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.password}
                    onChange={(e) =>
                      setPasswordForm((p) => ({
                        ...p,
                        password: e.target.value,
                      }))
                    }
                    placeholder="At least 8 characters"
                    className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Confirm new password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm((p) => ({
                        ...p,
                        confirmPassword: e.target.value,
                      }))
                    }
                    placeholder="Repeat new password"
                    className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                  {passwordForm.confirmPassword.length > 0 && (
                    <p
                      className={`text-xs font-medium ${
                        passwordForm.password === passwordForm.confirmPassword
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {passwordForm.password === passwordForm.confirmPassword
                        ? "✓ Passwords match"
                        : "✕ Passwords do not match"}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={passwordSaving}
                  className={`w-full py-3 rounded-xl font-bold text-white transition ${
                    passwordSaving
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-red-700 hover:bg-red-800"
                  }`}
                >
                  {passwordSaving ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
