import { useState, useEffect } from "react";
import { Link } from "react-router";
import { productAPI } from "../services/api";
import { useCart } from "../context/CartContext";

const categories = [
  {
    id: "books",
    label: "Religious Books",
    description: "Bibles, prayer books & more",
    icon: "📖",
    color: "bg-red-50 border-red-200 text-red-800",
    btnColor: "bg-red-700 hover:bg-red-800",
  },
  {
    id: "articles",
    label: "Religious Articles",
    description: "Rosaries, crucifixes, medals",
    icon: "✝️",
    color: "bg-blue-50 border-blue-200 text-blue-800",
    btnColor: "bg-blue-700 hover:bg-blue-800",
  },
  {
    id: "av",
    label: "Audio & Video",
    description: "CDs, DVDs, USB content",
    icon: "🎵",
    color: "bg-green-50 border-green-200 text-green-800",
    btnColor: "bg-green-700 hover:bg-green-800",
  },
];

const trustPoints = [
  { icon: "🚚", title: "Free Shipping", desc: "On orders over KES 3,000" },
  { icon: "🔒", title: "Secure Payment", desc: "M-Pesa, cards & more" },
  { icon: "✅", title: "Authentic Products", desc: "Verified religious goods" },
  { icon: "📦", title: "Fast Delivery", desc: "Nairobi & nationwide" },
];

const categoryIcon = { books: "📖", articles: "✝️", av: "🎵" };

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    productAPI
      .getFeatured()
      .then((data) => setFeatured(data))
      .catch((err) => console.error("Failed to load featured:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-0">
      {/* ── HERO ── */}
      <section className="bg-red-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center text-center gap-6">
          <span className="text-6xl">✝</span>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Find Your Faith.
            <br />
            <span className="text-red-200">Deepen Your Devotion.</span>
          </h1>
          <p className="text-red-100 text-lg max-w-xl">
            Kenya's trusted Catholic online store. Browse books, rosaries,
            medals, audio-visual content and much more — all in one place.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-2">
            <Link
              to="/shop"
              className="bg-white text-red-700 font-semibold px-8 py-3 rounded-lg hover:bg-red-50 transition"
            >
              Shop Now
            </Link>
            <Link
              to="/shop"
              className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-red-600 transition"
            >
              Browse Categories
            </Link>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {trustPoints.map((t) => (
            <div key={t.title} className="flex items-center gap-3">
              <span className="text-2xl">{t.icon}</span>
              <div>
                <p className="font-semibold text-sm">{t.title}</p>
                <p className="text-blue-200 text-xs">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Shop by Category
          </h2>
          <p className="text-center text-gray-500 mb-10">
            Everything you need for your spiritual journey
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.id}`}
                className={`border-2 rounded-xl p-8 flex flex-col items-center text-center gap-3 hover:shadow-md transition ${cat.color}`}
              >
                <span className="text-5xl">{cat.icon}</span>
                <h3 className="text-xl font-bold">{cat.label}</h3>
                <p className="text-sm opacity-75">{cat.description}</p>
                <span
                  className={`mt-2 text-white text-sm font-semibold px-6 py-2 rounded-lg transition ${cat.btnColor}`}
                >
                  Browse →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                Featured Products
              </h2>
              <p className="text-gray-500 mt-1">Most loved by our community</p>
            </div>
            <Link
              to="/shop"
              className="text-red-700 font-semibold hover:underline text-sm"
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="border border-gray-200 rounded-xl overflow-hidden animate-pulse"
                >
                  <div className="bg-gray-200 h-44" />
                  <div className="p-4 flex flex-col gap-2">
                    <div className="bg-gray-200 h-3 rounded w-3/4" />
                    <div className="bg-gray-200 h-3 rounded w-1/2" />
                    <div className="bg-gray-200 h-8 rounded mt-1" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featured.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={() => addToCart(product, 1)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── SCRIPTURE BANNER ── */}
      <section className="bg-red-700 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <span className="text-4xl">✝</span>
          <blockquote className="text-2xl font-light italic mt-4 text-red-100">
            "Go therefore and make disciples of all nations."
          </blockquote>
          <p className="text-red-300 mt-2 text-sm">— Matthew 28:19</p>
          <Link
            to="/shop"
            className="inline-block mt-8 bg-white text-red-700 font-semibold px-8 py-3 rounded-lg hover:bg-red-50 transition"
          >
            Start Shopping
          </Link>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product, onAddToCart }) {
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    onAddToCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  const badgeColor = {
    "Best Seller": "bg-red-600",
    Popular: "bg-blue-600",
    New: "bg-green-600",
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition flex flex-col">
      <div className="relative bg-gray-100 h-44 flex items-center justify-center">
        <span className="text-5xl opacity-30">
          {categoryIcon[product.category]}
        </span>
        {product.badge && (
          <span
            className={`absolute top-2 left-2 text-white text-xs font-bold px-2 py-0.5 rounded ${badgeColor[product.badge]}`}
          >
            {product.badge}
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-sm font-semibold text-gray-800 leading-tight flex-1">
          {product.name}
        </p>
        <p className="text-red-700 font-bold mt-1">
          KES {product.price.toLocaleString()}
        </p>
        <div className="flex gap-2 mt-3">
          <Link
            to={`/product/${product._id}`}
            className="flex-1 text-center border border-red-600 text-red-700 text-xs py-1.5 rounded-lg hover:bg-red-50 transition"
          >
            View
          </Link>
          <button
            onClick={handleAddToCart}
            className={`flex-1 text-white text-xs py-1.5 rounded-lg transition ${added ? "bg-green-600" : "bg-red-700 hover:bg-red-800"}`}
          >
            {added ? "✓ Added!" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
