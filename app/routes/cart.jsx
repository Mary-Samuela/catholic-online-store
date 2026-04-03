import { Link } from "react-router";
import { useState } from "react";
import { useCart } from "../context/CartContext";

const categoryIcon = { books: "📖", articles: "✝️", av: "🎵" };
const SHIPPING_THRESHOLD = 3000;
const SHIPPING_COST = 300;

export default function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice } =
    useCart();

  const [coupon, setCoupon] = useState("");
  const [couponMsg, setCouponMsg] = useState(null);
  const [discount, setDiscount] = useState(0);

  const shipping = totalPrice >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = totalPrice + shipping - discount;

  function applyCoupon() {
    if (coupon.trim().toUpperCase() === "CATHOLIC10") {
      const amt = Math.round(totalPrice * 0.1);
      setDiscount(amt);
      setCouponMsg({
        type: "success",
        text: `✓ 10% discount applied — you save KES ${amt.toLocaleString()}`,
      });
    } else {
      setDiscount(0);
      setCouponMsg({
        type: "error",
        text: "✕ Invalid coupon code. Try CATHOLIC10.",
      });
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-5 px-4">
        <span className="text-8xl">🛒</span>
        <h2 className="text-2xl font-bold text-gray-700">Your cart is empty</h2>
        <p className="text-gray-500 text-sm text-center">
          You have not added any items yet.
        </p>
        <Link
          to="/shop"
          className="bg-red-700 text-white font-semibold px-8 py-3 rounded-xl hover:bg-red-800 transition"
        >
          Go to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-red-700 text-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Your Cart</h1>
          <p className="text-red-200 text-sm mt-1">
            {items.length} item{items.length !== 1 ? "s" : ""} in your cart
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Items ── */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Shipping progress */}
          {totalPrice < SHIPPING_THRESHOLD ? (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800 font-medium mb-2">
                Add{" "}
                <span className="font-bold">
                  KES {(SHIPPING_THRESHOLD - totalPrice).toLocaleString()}
                </span>{" "}
                more for FREE shipping!
              </p>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (totalPrice / SHIPPING_THRESHOLD) * 100)}%`,
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-sm text-green-800 font-semibold">
                🎉 You qualify for FREE shipping!
              </p>
            </div>
          )}

          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 items-start"
            >
              <div className="bg-gray-100 rounded-lg w-20 h-20 flex items-center justify-center shrink-0">
                <span className="text-3xl opacity-25">
                  {categoryIcon[item.category]}
                </span>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      to={`/product/${item._id}`}
                      className="text-sm font-semibold text-gray-800 hover:text-red-700 transition leading-tight"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-gray-400 capitalize mt-0.5">
                      {item.category}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-gray-300 hover:text-red-500 transition text-lg leading-none shrink-0"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.quantity - 1)
                      }
                      className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition font-bold text-sm"
                    >
                      −
                    </button>
                    <span className="px-3 py-1.5 text-sm font-semibold border-x border-gray-300">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.quantity + 1)
                      }
                      className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition font-bold text-sm"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">
                      KES {item.price.toLocaleString()} × {item.quantity}
                    </p>
                    <p className="text-red-700 font-bold text-sm">
                      KES {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-2">
            <Link
              to="/shop"
              className="text-sm text-red-700 font-semibold hover:underline"
            >
              ← Continue Shopping
            </Link>
            <button
              onClick={clearCart}
              className="text-sm text-gray-400 hover:text-red-500 transition"
            >
              Clear cart
            </button>
          </div>
        </div>

        {/* ── Summary ── */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
            <h2 className="text-lg font-bold text-gray-800">Order Summary</h2>
            <div className="flex flex-col gap-3 text-sm border-b border-gray-100 pb-4">
              <div className="flex justify-between text-gray-600">
                <span>
                  Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)
                </span>
                <span className="font-medium text-gray-800">
                  KES {totalPrice.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span
                  className={
                    shipping === 0
                      ? "text-green-600 font-semibold"
                      : "font-medium text-gray-800"
                  }
                >
                  {shipping === 0 ? "FREE" : `KES ${shipping.toLocaleString()}`}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="font-semibold">
                    − KES {discount.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-800">Total</span>
              <span className="text-xl font-bold text-red-700">
                KES {total.toLocaleString()}
              </span>
            </div>
            <Link
              to="/checkout"
              className="w-full text-center bg-red-700 text-white font-bold py-3 rounded-xl hover:bg-red-800 transition"
            >
              Proceed to Checkout →
            </Link>
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-2">We accept</p>
              <div className="flex justify-center gap-3 flex-wrap">
                {["M-Pesa", "Visa", "Mastercard", "Cash on Delivery"].map(
                  (m) => (
                    <span
                      key={m}
                      className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-500"
                    >
                      {m}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Coupon */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-3">
              Have a coupon?
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              />
              <button
                onClick={applyCoupon}
                className="bg-red-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-800 transition font-semibold"
              >
                Apply
              </button>
            </div>
            {couponMsg && (
              <p
                className={`text-xs mt-2 font-medium ${couponMsg.type === "success" ? "text-green-600" : "text-red-500"}`}
              >
                {couponMsg.text}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-2">
              Try: <span className="font-mono font-bold">CATHOLIC10</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
