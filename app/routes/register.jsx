import { useState } from "react";
import { Link } from "react-router";

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for this field as user types
    setErrors((prev) => ({ ...prev, [name]: null }));
  }

  function validate() {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required.";
    if (!form.lastName.trim()) e.lastName = "Last name is required.";
    if (!form.email.includes("@")) e.email = "Enter a valid email address.";
    if (form.phone && form.phone.length < 9)
      e.phone = "Enter a valid phone number.";
    if (form.password.length < 8)
      e.password = "Password must be at least 8 characters.";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match.";
    if (!form.agreeTerms) e.agreeTerms = "You must agree to the terms.";
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  }

  // ── Success state ──
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-10 max-w-md w-full text-center flex flex-col gap-4">
          <span className="text-6xl">🎉</span>
          <h2 className="text-2xl font-bold text-gray-800">Account Created!</h2>
          <p className="text-gray-500 text-sm">
            Welcome to Catholic Online Store,{" "}
            <span className="font-semibold text-gray-700">
              {form.firstName}
            </span>
            ! Your account has been created successfully.
          </p>
          <Link
            to="/login"
            className="bg-red-700 text-white font-bold py-3 rounded-xl hover:bg-red-800 transition"
          >
            Sign In Now
          </Link>
          <Link to="/shop" className="text-sm text-gray-400 hover:text-red-600">
            Browse Shop First →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-16">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm w-full max-w-lg p-8 flex flex-col gap-6">
        {/* Logo */}
        <div className="text-center">
          <Link to="/" className="inline-flex flex-col items-center gap-1">
            <span className="text-4xl text-red-700">✝</span>
            <span className="text-lg font-bold text-gray-800">
              Catholic Online Store
            </span>
            <span className="text-xs text-gray-400">
              Create your free account
            </span>
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                First name
              </label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="John"
                className={`border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 ${
                  errors.firstName
                    ? "border-red-400 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              {errors.firstName && (
                <p className="text-xs text-red-500">{errors.firstName}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Last name
              </label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className={`border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 ${
                  errors.lastName
                    ? "border-red-400 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              {errors.lastName && (
                <p className="text-xs text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>

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
              className={`border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 ${
                errors.email ? "border-red-400 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Phone number{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div className="flex">
              <span className="border border-r-0 border-gray-300 bg-gray-50 rounded-l-lg px-3 py-2.5 text-sm text-gray-500">
                +254
              </span>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="700 000 000"
                className={`flex-1 border rounded-r-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 ${
                  errors.phone ? "border-red-400 bg-red-50" : "border-gray-300"
                }`}
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 pr-10 ${
                  errors.password
                    ? "border-red-400 bg-red-50"
                    : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password}</p>
            )}

            {/* Password strength indicator */}
            {form.password.length > 0 && (
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`flex-1 h-1 rounded-full transition-all ${
                      form.password.length >= level * 3
                        ? level <= 1
                          ? "bg-red-400"
                          : level <= 2
                            ? "bg-orange-400"
                            : level <= 3
                              ? "bg-yellow-400"
                              : "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Confirm password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your password"
              className={`border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 ${
                errors.confirmPassword
                  ? "border-red-400 bg-red-50"
                  : "border-gray-300"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">{errors.confirmPassword}</p>
            )}
            {/* Match indicator */}
            {form.confirmPassword.length > 0 && (
              <p
                className={`text-xs font-medium ${
                  form.password === form.confirmPassword
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {form.password === form.confirmPassword
                  ? "✓ Passwords match"
                  : "✕ Passwords do not match"}
              </p>
            )}
          </div>

          {/* Terms */}
          <div className="flex flex-col gap-1">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={form.agreeTerms}
                onChange={handleChange}
                className="accent-red-600 w-4 h-4 mt-0.5 shrink-0"
              />
              <span className="text-sm text-gray-600">
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-red-700 hover:underline font-medium"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-red-700 hover:underline font-medium"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.agreeTerms && (
              <p className="text-xs text-red-500 ml-6">{errors.agreeTerms}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-white transition mt-1 ${
              loading
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-700 hover:bg-red-800"
            }`}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Login link */}
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-red-700 font-semibold hover:underline"
          >
            Sign in
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
