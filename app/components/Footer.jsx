import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
            <span>✝</span> Catholic Online Store
          </h3>
          <p className="text-sm leading-relaxed">
            Bringing authentic religious resources to individuals, families, and
            faith communities across Kenya.
          </p>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-white font-semibold mb-3">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/shop?category=books"
                className="hover:text-white transition"
              >
                Religious Books
              </Link>
            </li>
            <li>
              <Link
                to="/shop?category=articles"
                className="hover:text-white transition"
              >
                Religious Articles
              </Link>
            </li>
            <li>
              <Link
                to="/shop?category=av"
                className="hover:text-white transition"
              >
                Audio & Video
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-white transition">
                All Products
              </Link>
            </li>
          </ul>
        </div>

        {/* Account */}
        <div>
          <h4 className="text-white font-semibold mb-3">Account</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/login" className="hover:text-white transition">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-white transition">
                Register
              </Link>
            </li>
            <li>
              <Link to="/account" className="hover:text-white transition">
                My Orders
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-white transition">
                My Cart
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>📍 Nairobi, Kenya</li>
            <li>📞 +254 700 000 000</li>
            <li>✉️ info@catholicstore.co.ke</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 text-center text-xs text-gray-500 py-4">
        © {new Date().getFullYear()} Catholic Online Store. All rights reserved.
      </div>
    </footer>
  );
}
