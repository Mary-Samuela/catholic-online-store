import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router";

// ── Mock data (replaced with real API calls in Step 2) ──
const allProducts = [
  // Books
  {
    id: 1,
    name: "Holy Bible (RSV Catholic Edition)",
    price: 1200,
    category: "books",
    badge: "Best Seller",
    rating: 5,
  },
  {
    id: 2,
    name: "Catechism of the Catholic Church",
    price: 1500,
    category: "books",
    badge: "Best Seller",
    rating: 5,
  },
  {
    id: 3,
    name: "Daily Roman Missal",
    price: 2200,
    category: "books",
    badge: null,
    rating: 4,
  },
  {
    id: 4,
    name: "Introduction to Christianity",
    price: 980,
    category: "books",
    badge: "Popular",
    rating: 4,
  },
  {
    id: 5,
    name: "The Story of a Soul – St Thérèse",
    price: 750,
    category: "books",
    badge: null,
    rating: 5,
  },
  {
    id: 6,
    name: "Divine Mercy in My Soul",
    price: 890,
    category: "books",
    badge: "Popular",
    rating: 4,
  },

  // Articles
  {
    id: 7,
    name: "Wooden Rosary Beads",
    price: 450,
    category: "articles",
    badge: "Popular",
    rating: 5,
  },
  {
    id: 8,
    name: "Crucifix – Wall Mount (30cm)",
    price: 950,
    category: "articles",
    badge: null,
    rating: 4,
  },
  {
    id: 9,
    name: "Miraculous Medal (Silver)",
    price: 300,
    category: "articles",
    badge: "Popular",
    rating: 5,
  },
  {
    id: 10,
    name: "St Benedict Medal",
    price: 350,
    category: "articles",
    badge: null,
    rating: 4,
  },
  {
    id: 11,
    name: "Holy Water Bottle",
    price: 200,
    category: "articles",
    badge: null,
    rating: 3,
  },
  {
    id: 12,
    name: "Priest Vestment Set",
    price: 8500,
    category: "articles",
    badge: "New",
    rating: 5,
  },

  // Audio & Video
  {
    id: 13,
    name: "Divine Mercy Novena CD",
    price: 800,
    category: "av",
    badge: "New",
    rating: 5,
  },
  {
    id: 14,
    name: "Gregorian Chant DVD",
    price: 700,
    category: "av",
    badge: null,
    rating: 4,
  },
  {
    id: 15,
    name: "Rosary Audio USB (All Mysteries)",
    price: 1100,
    category: "av",
    badge: "Popular",
    rating: 5,
  },
  {
    id: 16,
    name: "Catholic Mass Explained DVD",
    price: 650,
    category: "av",
    badge: "New",
    rating: 4,
  },
];

const categoryOptions = [
  { value: "all", label: "All Products" },
  { value: "books", label: "Religious Books" },
  { value: "articles", label: "Religious Articles" },
  { value: "av", label: "Audio & Video" },
];

const sortOptions = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A–Z" },
  { value: "rating", label: "Top Rated" },
];

const categoryIcon = { books: "📖", articles: "✝️", av: "🎵" };
const badgeColor = {
  "Best Seller": "bg-red-600",
  Popular: "bg-blue-600",
  New: "bg-green-600",
};

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read category from URL (e.g. /shop?category=books)
  const urlCategory = searchParams.get("category") || "all";

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(urlCategory);
  const [sort, setSort] = useState("default");
  const [maxPrice, setMaxPrice] = useState(10000);

  // Update category and keep URL in sync
  function handleCategory(val) {
    setCategory(val);
    if (val === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category: val });
    }
  }

  // Filter + sort
  const products = useMemo(() => {
    let list = allProducts.filter((p) => {
      const matchCat = category === "all" || p.category === category;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchPrice = p.price <= maxPrice;
      return matchCat && matchSearch && matchPrice;
    });

    if (sort === "price-asc")
      list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc")
      list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "name-asc")
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [search, category, sort, maxPrice]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ── Page header ── */}
      <div className="bg-red-700 text-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Our Shop</h1>
          <p className="text-red-200 mt-1 text-sm">
            {products.length} product{products.length !== 1 ? "s" : ""} found
          </p>
          {/* Breadcrumb */}
          <p className="text-red-300 text-xs mt-2">
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            {" / "}
            <span className="text-white">Shop</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* ── SIDEBAR ── */}
        <aside className="w-full md:w-64 shrink-0 flex flex-col gap-6">
          {/* Search */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="font-semibold text-gray-700 mb-3">Search</h3>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          {/* Category filter */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="font-semibold text-gray-700 mb-3">Category</h3>
            <div className="flex flex-col gap-2">
              {categoryOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleCategory(opt.value)}
                  className={`text-left text-sm px-3 py-2 rounded-lg transition ${
                    category === opt.value
                      ? "bg-red-700 text-white font-semibold"
                      : "text-gray-600 hover:bg-red-50 hover:text-red-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price filter */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="font-semibold text-gray-700 mb-3">Max Price</h3>
            <input
              type="range"
              min={200}
              max={10000}
              step={100}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-red-600"
            />
            <p className="text-sm text-gray-600 mt-2">
              Up to{" "}
              <span className="font-semibold text-red-700">
                KES {maxPrice.toLocaleString()}
              </span>
            </p>
          </div>

          {/* Reset */}
          <button
            onClick={() => {
              setSearch("");
              setSort("default");
              setMaxPrice(10000);
              handleCategory("all");
            }}
            className="text-sm text-red-600 hover:underline text-left px-1"
          >
            ✕ Clear all filters
          </button>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div className="flex-1">
          {/* Sort bar */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-800">
                {products.length}
              </span>{" "}
              results
            </p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Product grid */}
          {products.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-lg font-semibold">No products found</p>
              <p className="text-sm mt-1">
                Try adjusting your filters or search term
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <ShopProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Product Card ──
function ShopProductCard({ product }) {
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function renderStars(rating) {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={i < rating ? "text-yellow-400" : "text-gray-300"}
      >
        ★
      </span>
    ));
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition flex flex-col">
      {/* Image area */}
      <div className="relative bg-gray-100 h-40 flex items-center justify-center">
        <span className="text-5xl opacity-25">
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

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-xs text-gray-400 capitalize mb-1">
          {product.category}
        </p>
        <p className="text-sm font-semibold text-gray-800 leading-tight flex-1">
          {product.name}
        </p>
        <div className="flex text-xs mt-1">{renderStars(product.rating)}</div>
        <p className="text-red-700 font-bold mt-2 text-sm">
          KES {product.price.toLocaleString()}
        </p>

        {/* Buttons */}
        <div className="flex gap-1.5 mt-3">
          <Link
            to={`/product/${product.id}`}
            className="flex-1 text-center border border-red-600 text-red-700 text-xs py-1.5 rounded-lg hover:bg-red-50 transition"
          >
            Details
          </Link>
          <button
            onClick={handleAddToCart}
            className={`flex-1 text-white text-xs py-1.5 rounded-lg transition ${
              added ? "bg-green-600" : "bg-red-700 hover:bg-red-800"
            }`}
          >
            {added ? "✓ Added!" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
