import { useState } from "react";
import { Link, useParams } from "react-router";

// ── Same mock data (will come from MongoDB later) ──
const allProducts = [
  {
    id: 1,
    name: "Holy Bible (RSV Catholic Edition)",
    price: 1200,
    category: "books",
    badge: "Best Seller",
    rating: 5,
    stock: 12,
    description:
      "The Revised Standard Version Catholic Edition is a faithful and accurate translation of the Holy Scriptures. This edition includes the deuterocanonical books accepted by the Catholic Church. Ideal for personal study, family prayer, and liturgical use.",
    details: [
      "Hardcover, 1800 pages",
      "Includes maps and concordance",
      "Publisher: Ignatius Press",
      "Language: English",
    ],
  },

  {
    id: 2,
    name: "Catechism of the Catholic Church",
    price: 1500,
    category: "books",
    badge: "Best Seller",
    rating: 5,
    stock: 8,
    description:
      "The official Catechism of the Catholic Church presents a complete and systematic account of the faith of the Church. An essential reference for every Catholic home, school, and parish.",
    details: [
      "Hardcover, 904 pages",
      "Second Edition",
      "Publisher: Libreria Editrice Vaticana",
      "Language: English",
    ],
  },

  {
    id: 3,
    name: "Daily Roman Missal",
    price: 2200,
    category: "books",
    badge: null,
    rating: 4,
    stock: 5,
    description:
      "The complete guide to the Roman Rite of the Mass in both English and Latin. Perfect for following the daily liturgy and deepening your participation in the Holy Mass.",
    details: [
      "Leather-bound, 2400 pages",
      "Bilingual: English & Latin",
      "Ribbon markers included",
      "Publisher: Midwest Theological Forum",
    ],
  },

  {
    id: 4,
    name: "Introduction to Christianity",
    price: 980,
    category: "books",
    badge: "Popular",
    rating: 4,
    stock: 15,
    description:
      "A classic work by Pope Emeritus Benedict XVI (then Joseph Ratzinger) exploring the meaning of the Apostles' Creed. One of the most important theological works of the 20th century.",
    details: [
      "Paperback, 320 pages",
      "Author: Joseph Ratzinger",
      "Publisher: Ignatius Press",
      "Language: English",
    ],
  },

  {
    id: 5,
    name: "The Story of a Soul – St Thérèse",
    price: 750,
    category: "books",
    badge: null,
    rating: 5,
    stock: 20,
    description:
      "The autobiography of St Thérèse of Lisieux, one of the most beloved saints of the Catholic Church. Her 'Little Way' of spiritual childhood has inspired millions worldwide.",
    details: [
      "Paperback, 268 pages",
      "Author: St Thérèse of Lisieux",
      "Publisher: TAN Books",
      "Language: English",
    ],
  },

  {
    id: 6,
    name: "Divine Mercy in My Soul",
    price: 890,
    category: "books",
    badge: "Popular",
    rating: 4,
    stock: 10,
    description:
      "The Diary of Saint Maria Faustina Kowalska — the complete text of her spiritual diary, in which she recorded all her encounters with Jesus and His message of Divine Mercy.",
    details: [
      "Hardcover, 750 pages",
      "Author: St Faustina Kowalska",
      "Publisher: Marian Press",
      "Language: English",
    ],
  },

  {
    id: 7,
    name: "Wooden Rosary Beads",
    price: 450,
    category: "articles",
    badge: "Popular",
    rating: 5,
    stock: 30,
    description:
      "Handcrafted wooden rosary beads, smooth to the touch and durable for daily prayer. Comes in a beautiful gift pouch — perfect for personal use or as a gift to a loved one.",
    details: [
      "Material: Natural olive wood",
      "Bead size: 8mm",
      "Length: 48cm",
      "Includes gift pouch",
    ],
  },

  {
    id: 8,
    name: "Crucifix – Wall Mount (30cm)",
    price: 950,
    category: "articles",
    badge: null,
    rating: 4,
    stock: 7,
    description:
      "A beautifully crafted wall-mount crucifix, ideal for the home, office, or chapel. Made from solid resin with a gold-tone finish on the corpus.",
    details: [
      "Material: Resin & metal",
      "Size: 30cm x 18cm",
      "Finish: Antique gold",
      "Includes wall mount fittings",
    ],
  },

  {
    id: 9,
    name: "Miraculous Medal (Silver)",
    price: 300,
    category: "articles",
    badge: "Popular",
    rating: 5,
    stock: 50,
    description:
      "The Miraculous Medal as revealed to St Catherine Labouré in 1830. Sterling silver finish with detailed relief of Our Lady. A cherished sacramental for the faithful.",
    details: [
      "Material: Sterling silver plated",
      "Size: 2cm diameter",
      "Includes 50cm chain",
      "Comes in gift box",
    ],
  },

  {
    id: 10,
    name: "St Benedict Medal",
    price: 350,
    category: "articles",
    badge: null,
    rating: 4,
    stock: 25,
    description:
      "The Medal of St Benedict is one of the oldest and most powerful sacramentals of the Church, used for protection against evil and for the sanctification of daily life.",
    details: [
      "Material: Zinc alloy",
      "Size: 3cm diameter",
      "Antique silver finish",
      "Includes prayer card",
    ],
  },

  {
    id: 11,
    name: "Holy Water Bottle",
    price: 200,
    category: "articles",
    badge: null,
    rating: 3,
    stock: 40,
    description:
      "A durable plastic holy water bottle shaped in the form of Our Lady of Lourdes. Perfect for keeping blessed water at home, in the car, or when travelling.",
    details: [
      "Material: BPA-free plastic",
      "Capacity: 200ml",
      "Height: 15cm",
      "Colour: White & blue",
    ],
  },

  {
    id: 12,
    name: "Priest Vestment Set",
    price: 8500,
    category: "articles",
    badge: "New",
    rating: 5,
    stock: 3,
    description:
      "A complete liturgical vestment set for priests, handcrafted with premium fabric. Includes chasuble, stole, maniple, chalice veil, and burse. Available in liturgical colours.",
    details: [
      "Fabric: Premium polyester blend",
      "Colours: White, Red, Green, Purple",
      "Fully lined",
      "Custom sizing available",
    ],
  },

  {
    id: 13,
    name: "Divine Mercy Novena CD",
    price: 800,
    category: "av",
    badge: "New",
    rating: 5,
    stock: 18,
    description:
      "A beautiful audio recording of the complete Divine Mercy Novena, guided by a Catholic priest. Includes the Chaplet of Divine Mercy and reflections for each day.",
    details: [
      "Format: Audio CD",
      "Duration: 3 hours 20 minutes",
      "Language: English",
      "Tracks: 15",
    ],
  },

  {
    id: 14,
    name: "Gregorian Chant DVD",
    price: 700,
    category: "av",
    badge: null,
    rating: 4,
    stock: 9,
    description:
      "Experience the ancient beauty of Gregorian chant with this professionally recorded DVD featuring monks from a Benedictine monastery. Ideal for liturgical prayer and meditation.",
    details: [
      "Format: DVD (Region-free)",
      "Duration: 2 hours 10 minutes",
      "Language: Latin with English subtitles",
      "Dolby 5.1 Surround",
    ],
  },

  {
    id: 15,
    name: "Rosary Audio USB (All Mysteries)",
    price: 1100,
    category: "av",
    badge: "Popular",
    rating: 5,
    stock: 22,
    description:
      "A USB flash drive containing audio recordings of all four mysteries of the Rosary — Joyful, Luminous, Sorrowful, and Glorious — perfect for prayer in the car or at home.",
    details: [
      "Format: MP3 on USB drive",
      "Storage: 8GB USB",
      "Total duration: 4 hours",
      "Language: English",
    ],
  },

  {
    id: 16,
    name: "Catholic Mass Explained DVD",
    price: 650,
    category: "av",
    badge: "New",
    rating: 4,
    stock: 14,
    description:
      "An educational DVD that walks viewers through every part of the Holy Mass, explaining the meaning and significance of each rite. Excellent for RCIA, youth groups, and families.",
    details: [
      "Format: DVD (Region-free)",
      "Duration: 1 hour 45 minutes",
      "Language: English",
      "Includes study guide booklet",
    ],
  },
];

const categoryIcon = { books: "📖", articles: "✝️", av: "🎵" };
const badgeColor = {
  "Best Seller": "bg-red-600",
  Popular: "bg-blue-600",
  New: "bg-green-600",
};

export default function ProductDetail() {
  const { id } = useParams();
  const product = allProducts.find((p) => p.id === Number(id));

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  // Related products — same category, exclude current
  const related = allProducts
    .filter((p) => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);

  // ── Product not found ──
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-500">
        <span className="text-6xl">🔍</span>
        <h2 className="text-2xl font-bold text-gray-700">Product not found</h2>
        <p className="text-sm">
          This product may have been removed or the link is incorrect.
        </p>
        <Link
          to="/shop"
          className="bg-red-700 text-white px-6 py-2 rounded-lg hover:bg-red-800 transition"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  function handleAddToCart() {
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
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-medium truncate">
            {product.name}
          </span>
        </div>
      </div>

      {/* ── Main product section ── */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left — Image */}
          <div className="flex flex-col gap-4">
            <div className="relative bg-gray-100 rounded-xl h-80 flex items-center justify-center">
              <span className="text-9xl opacity-20">
                {categoryIcon[product.category]}
              </span>
              {product.badge && (
                <span
                  className={`absolute top-4 left-4 text-white text-sm font-bold px-3 py-1 rounded-full ${badgeColor[product.badge]}`}
                >
                  {product.badge}
                </span>
              )}
              {product.stock <= 5 && (
                <span className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Only {product.stock} left!
                </span>
              )}
            </div>
            {/* Thumbnail strip — placeholder for multiple images later */}
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

          {/* Right — Info */}
          <div className="flex flex-col gap-5">
            {/* Category pill */}
            <span className="text-xs font-semibold text-red-700 bg-red-50 px-3 py-1 rounded-full w-fit capitalize">
              {product.category === "av" ? "Audio & Video" : product.category}
            </span>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">{renderStars(product.rating)}</div>
              <span className="text-sm text-gray-500">
                ({product.rating}.0 / 5.0)
              </span>
            </div>

            {/* Price */}
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

            {/* Stock status */}
            <p
              className={`text-sm font-medium ${product.stock > 5 ? "text-green-600" : "text-orange-500"}`}
            >
              {product.stock > 5
                ? `✓ In Stock (${product.stock} available)`
                : `⚠ Low Stock — only ${product.stock} left`}
            </p>

            {/* Quantity */}
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

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button
                onClick={handleAddToCart}
                className={`flex-1 font-semibold py-3 rounded-xl transition text-white ${
                  added ? "bg-green-600" : "bg-red-700 hover:bg-red-800"
                }`}
              >
                {added ? "✓ Added to Cart!" : "Add to Cart"}
              </button>
              <Link
                to="/checkout"
                className="flex-1 text-center border-2 border-red-700 text-red-700 font-semibold py-3 rounded-xl hover:bg-red-50 transition"
              >
                Buy Now
              </Link>
            </div>

            {/* Trust micro-badges */}
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

        {/* ── Tabs: Description / Details ── */}
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
                {product.details.map((d) => (
                  <li
                    key={d}
                    className="flex items-center gap-3 text-sm text-gray-600"
                  >
                    <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
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
                  key={p.id}
                  to={`/product/${p.id}`}
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
