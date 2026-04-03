import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { productAPI } from "../services/api";
import { useCart } from "../context/CartContext";

const categoryIcon = { books: "📖", articles: "✝️", av: "🎵" };

export default function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    setError(null);
    setQuantity(1);
    productAPI
      .getOne(id)
      .then(({ product, related }) => {
        setProduct(product);
        setRelated(related);
      })
      .catch(() => setError("Product not found or server is unavailable."))
      .finally(() => setLoading(false));
  }, [id]);

  function handleAddToCart() {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function renderStars(rating) {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-lg ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
      >
        ★
      </span>
    ));
  }

  // ── Loading skeleton ──
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 animate-pulse">
        <div className="bg-white rounded-2xl p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-gray-200 rounded-xl h-80" />
          <div className="flex flex-col gap-4">
            <div className="bg-gray-200 h-4 rounded w-1/4" />
            <div className="bg-gray-200 h-8 rounded w-3/4" />
            <div className="bg-gray-200 h-4 rounded w-1/3" />
            <div className="bg-gray-200 h-10 rounded w-1/2" />
            <div className="bg-gray-200 h-12 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ──
  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-500">
        <span className="text-6xl">🔍</span>
        <h2 className="text-2xl font-bold text-gray-700">Product not found</h2>
        <p className="text-sm">{error}</p>
        <Link
          to="/shop"
          className="bg-red-700 text-white px-6 py-2 rounded-lg hover:bg-red-800 transition"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 text-xs text-gray-500 flex gap-2">
          <Link to="/" className="hover:text-red-700">
            Home
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-red-700">
            Shop
          </Link>
          <span>/</span>
          <Link
            to={`/shop?category=${product.category}`}
            className="hover:text-red-700 capitalize"
          >
            {product.category === "av" ? "Audio & Video" : product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-medium truncate">
            {product.name}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* ── Image ── */}
          <div className="flex flex-col gap-4">
            <div className="relative bg-gray-100 rounded-xl h-80 flex items-center justify-center">
              <span className="text-9xl opacity-20">
                {categoryIcon[product.category]}
              </span>
              {product.badge && (
                <span
                  className={`absolute top-4 left-4 text-white text-sm font-bold px-3 py-1 rounded-full ${
                    product.badge === "Best Seller"
                      ? "bg-red-600"
                      : product.badge === "Popular"
                        ? "bg-blue-600"
                        : "bg-green-600"
                  }`}
                >
                  {product.badge}
                </span>
              )}
              {product.stock <= 5 && product.stock > 0 && (
                <span className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Only {product.stock} left!
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="w-16 h-16 bg-gray-100 rounded-lg border-2 border-gray-200 flex items-center justify-center cursor-pointer hover:border-red-400 transition"
                >
                  <span className="text-2xl opacity-20">
                    {categoryIcon[product.category]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Info ── */}
          <div className="flex flex-col gap-5">
            <span className="text-xs font-semibold text-red-700 bg-red-50 px-3 py-1 rounded-full w-fit capitalize">
              {product.category === "av" ? "Audio & Video" : product.category}
            </span>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-2">
              <div className="flex">{renderStars(product.rating)}</div>
              <span className="text-sm text-gray-500">
                ({product.rating}.0 / 5.0)
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-red-700">
                KES {product.price.toLocaleString()}
              </span>
              <span className="text-sm text-gray-400 line-through">
                KES {Math.round(product.price * 1.15).toLocaleString()}
              </span>
              <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
                Save 13%
              </span>
            </div>

            <p
              className={`text-sm font-medium ${
                product.stock === 0
                  ? "text-red-600"
                  : product.stock <= 5
                    ? "text-orange-500"
                    : "text-green-600"
              }`}
            >
              {product.stock === 0
                ? "✕ Out of Stock"
                : product.stock <= 5
                  ? `⚠ Low Stock — only ${product.stock} left`
                  : `✓ In Stock (${product.stock} available)`}
            </p>

            {/* Quantity */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 font-medium">
                  Quantity:
                </span>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition font-bold"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 text-sm font-semibold border-x border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stock, q + 1))
                    }
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition font-bold"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-400">
                  Total:{" "}
                  <span className="text-red-700 font-bold">
                    KES {(product.price * quantity).toLocaleString()}
                  </span>
                </span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 font-semibold py-3 rounded-xl transition text-white ${
                  product.stock === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : added
                      ? "bg-green-600"
                      : "bg-red-700 hover:bg-red-800"
                }`}
              >
                {product.stock === 0
                  ? "Out of Stock"
                  : added
                    ? "✓ Added to Cart!"
                    : "Add to Cart"}
              </button>
              <Link
                to="/checkout"
                className="flex-1 text-center border-2 border-red-700 text-red-700 font-semibold py-3 rounded-xl hover:bg-red-50 transition"
              >
                Buy Now
              </Link>
            </div>

            <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-100">
              {[
                "🚚 Free shipping over KES 3K",
                "🔒 Secure checkout",
                "📦 Fast delivery",
              ].map((t) => (
                <span key={t} className="text-xs text-gray-500">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="bg-white rounded-2xl border border-gray-200 mt-6 overflow-hidden">
          <div className="flex border-b border-gray-200">
            {["description", "details"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-semibold capitalize transition ${
                  activeTab === tab
                    ? "border-b-2 border-red-600 text-red-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="p-6">
            {activeTab === "description" ? (
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {(product.details || []).map((d) => (
                  <li
                    key={d}
                    className="flex items-center gap-3 text-sm text-gray-600"
                  >
                    <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ── Related products ── */}
        {related.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p) => (
                <Link
                  key={p._id}
                  to={`/product/${p._id}`}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition"
                >
                  <div className="bg-gray-100 h-36 flex items-center justify-center">
                    <span className="text-5xl opacity-20">
                      {categoryIcon[p.category]}
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold text-gray-800 leading-tight">
                      {p.name}
                    </p>
                    <p className="text-red-700 font-bold text-sm mt-1">
                      KES {p.price.toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
