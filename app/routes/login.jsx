import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    if (!form.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      await login({ email: form.email, password: form.password });
      navigate("/");
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-16">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm w-full max-w-md p-8 flex flex-col gap-6">
        {/* Logo */}
        <div className="text-center">
          <Link to="/" className="inline-flex flex-col items-center gap-1">
            <span className="text-4xl text-red-700">✝</span>
            <span className="text-lg font-bold text-gray-800">
              Catholic Online Store
            </span>
            <span className="text-xs text-gray-400">
              Sign in to your account
            </span>
          </Link>
        </div>

        {/* Error banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-red-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="accent-red-600 w-4 h-4" />
            <span className="text-sm text-gray-600">Remember me</span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-white transition ${
              loading
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-700 hover:bg-red-800"
            }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Social buttons (UI only) */}
        <div className="flex flex-col gap-3">
          <button className="flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition font-medium">
            <span className="text-lg font-bold">G</span>
            Continue with Google
          </button>
          <button className="flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition font-medium">
            <span className="text-lg font-bold">f</span>
            Continue with Facebook
          </button>
        </div>

        {/* Register link */}
        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-red-700 font-semibold hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>

      <Link
        to="/shop"
        className="mt-6 text-sm text-gray-400 hover:text-red-600 transition"
      >
        ← Back to Shop
      </Link>
    </div>
  );
}
