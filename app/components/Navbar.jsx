import { Link, NavLink, useLocation } from "react-router";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Home", exact: true },
    { to: "/shop", label: "Shop", exact: true },
    { to: "/shop?category=books", label: "Books", exact: false },
    { to: "/shop?category=articles", label: "Articles", exact: false },
    { to: "/shop?category=av", label: "Audio & Video", exact: false },
  ];

  // ── Custom active check ──
  // This checks the full path + search string so each link
  // is only highlighted when it exactly matches the current URL
  function isActive(link) {
    const currentPath = location.pathname;
    const currentSearch = location.search;
    const currentFull = currentPath + currentSearch;

    if (link.exact && link.to === "/") {
      return currentPath === "/";
    }

    // For links with query strings like /shop?category=books
    if (link.to.includes("?")) {
      return currentFull === link.to;
    }

    // For plain paths like /shop — only match if no category param
    if (link.to === "/shop") {
      return currentPath === "/shop" && !currentSearch.includes("category");
    }

    return currentFull === link.to;
  }

  return (
    <header className="bg-blue-700 text-white shadow-md sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-red-700 text-xs text-center py-1 text-red-100">
        Free shipping on orders over KES 3,000 | Catholic Online Store Kenya
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <img
            className="h-20 w-auto invert brightness-0"
            src="/paulines2 logo.png"
            alt="Pauline Logo"
          />
          <span className="hidden sm:block leading-tight">
            Catholic
            <br />
            <span className="text-red-200 text-sm font-normal">
              Online Store
            </span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={
                isActive(link)
                  ? "text-white border-b-2 border-white pb-0.5"
                  : "text-red-100 hover:text-white transition"
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side icons */}
        <div className="flex items-center gap-4">
          {/* Account */}
          {user ? (
            <div className="hidden sm:flex items-center gap-3">
              <Link
                to="/account"
                className="text-red-100 hover:text-white text-sm"
              >
                Hi, {user.firstName}
              </Link>
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="text-xs bg-white text-red-700 px-2 py-0.5 rounded font-bold hover:bg-red-50"
                >
                  Admin
                </Link>
              )}
              <button
                onClick={logout}
                className="text-xs text-red-200 hover:text-white"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden sm:block text-red-100 hover:text-white"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </Link>
          )}

          {/* Cart */}
          <Link to="/cart" className="relative text-red-100 hover:text-white">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 7h13M7 13H5.4M10 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
              />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-red-700 text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Hamburger */}
          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-red-800 px-4 pb-4 flex flex-col gap-3 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`py-1 border-b border-red-700 ${
                isActive(link)
                  ? "text-white font-semibold"
                  : "text-red-100 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <>
              <Link
                to="/account"
                onClick={() => setMenuOpen(false)}
                className="text-red-100 hover:text-white py-1"
              >
                My Account ({user.firstName})
              </Link>
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="text-red-100 hover:text-white py-1"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="text-left text-red-200 hover:text-white py-1"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="text-red-100 hover:text-white py-1"
            >
              Login / Register
            </Link>
          )}

          <Link
            to="/cart"
            onClick={() => setMenuOpen(false)}
            className="text-red-100 hover:text-white py-1"
          >
            Cart ({totalItems})
          </Link>
        </div>
      )}
    </header>
  );
}
