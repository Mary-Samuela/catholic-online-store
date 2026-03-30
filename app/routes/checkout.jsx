import { useState } from "react";
import { Link } from "react-router";

// ── Mock order items (will come from cart state/context later) ──
const orderItems = [
  {
    id: 1,
    name: "Holy Bible (RSV Catholic Edition)",
    price: 1200,
    quantity: 1,
    category: "books",
  },
  {
    id: 7,
    name: "Wooden Rosary Beads",
    price: 450,
    quantity: 2,
    category: "articles",
  },
  {
    id: 13,
    name: "Divine Mercy Novena CD",
    price: 800,
    quantity: 1,
    category: "av",
  },
];

const categoryIcon = { books: "📖", articles: "✝️", av: "🎵" };
const SHIPPING_COST = 300;

const STEPS = ["Delivery", "Payment", "Confirm"];

export default function Checkout() {
  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [ordered, setOrdered] = useState(false);

  // ── Delivery form ──
  const [delivery, setDelivery] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    county: "",
    notes: "",
  });

  // ── Payment ──
  const [payMethod, setPayMethod] = useState("mpesa");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [cardForm, setCardForm] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  const [deliveryErrors, setDeliveryErrors] = useState({});

  // ── Calculations ──
  const subtotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= 3000 ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  // ── Delivery validation ──
  function validateDelivery() {
    const e = {};
    if (!delivery.firstName.trim()) e.firstName = "Required";
    if (!delivery.lastName.trim()) e.lastName = "Required";
    if (!delivery.email.includes("@")) e.email = "Enter a valid email";
    if (delivery.phone.length < 9) e.phone = "Enter a valid phone";
    if (!delivery.address.trim()) e.address = "Required";
    if (!delivery.city.trim()) e.city = "Required";
    if (!delivery.county.trim()) e.county = "Required";
    return e;
  }

  function handleDeliveryChange(e) {
    const { name, value } = e.target;
    setDelivery((p) => ({ ...p, [name]: value }));
    setDeliveryErrors((p) => ({ ...p, [name]: null }));
  }

  function nextStep() {
    if (step === 0) {
      const errs = validateDelivery();
      if (Object.keys(errs).length > 0) {
        setDeliveryErrors(errs);
        return;
      }
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function placeOrder() {
    setPlacing(true);
    setTimeout(() => {
      setPlacing(false);
      setOrdered(true);
    }, 2000);
  }

  // ── Order success ──
  if (ordered) {
    const orderNum = `COS-${Date.now().toString().slice(-6)}`;
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-16">
        <div className="bg-white border border-gray-200 rounded-2xl p-10 max-w-md w-full text-center flex flex-col gap-5">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-4xl">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Order Placed!</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Thank you,{" "}
            <span className="font-semibold text-gray-700">
              {delivery.firstName}
            </span>
            ! Your order has been received. You will get a confirmation on{" "}
            <span className="font-semibold text-gray-700">
              {delivery.email}
            </span>
            .
          </p>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Order number</p>
            <p className="text-xl font-bold text-red-700 font-mono">
              {orderNum}
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm text-gray-500">
            <p>
              📍 Delivering to:{" "}
              <span className="font-medium text-gray-700">
                {delivery.city}, {delivery.county}
              </span>
            </p>
            <p>
              💳 Payment:{" "}
              <span className="font-medium text-gray-700 capitalize">
                {payMethod === "mpesa"
                  ? "M-Pesa"
                  : payMethod === "card"
                    ? "Card"
                    : "Cash on Delivery"}
              </span>
            </p>
            <p>
              📦 Total:{" "}
              <span className="font-bold text-red-700">
                KES {total.toLocaleString()}
              </span>
            </p>
          </div>
          <Link
            to="/shop"
            className="bg-red-700 text-white font-bold py-3 rounded-xl hover:bg-red-800 transition"
          >
            Continue Shopping
          </Link>
          <Link
            to="/account"
            className="text-sm text-gray-400 hover:text-red-600"
          >
            View My Orders →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ── Header ── */}
      <div className="bg-red-700 text-white py-8">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-2xl font-bold mb-4">Checkout</h1>

          {/* Step indicator */}
          <div className="flex items-center gap-0">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center">
                <div
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                    i === step
                      ? "bg-white text-red-700"
                      : i < step
                        ? "bg-red-500 text-white"
                        : "bg-red-800 text-red-300"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      i < step
                        ? "bg-white text-red-600"
                        : "bg-red-300 text-red-800"
                    }`}
                  >
                    {i < step ? "✓" : i + 1}
                  </span>
                  {label}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`w-8 h-0.5 ${i < step ? "bg-white" : "bg-red-600"}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── LEFT: Step content ── */}
        <div className="lg:col-span-2">
          {/* ── STEP 0: Delivery ── */}
          {step === 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-5">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span className="w-7 h-7 bg-red-700 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  1
                </span>
                Delivery Information
              </h2>

              {/* Name row */}
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="First name"
                  name="firstName"
                  value={delivery.firstName}
                  onChange={handleDeliveryChange}
                  error={deliveryErrors.firstName}
                  placeholder="John"
                />
                <Field
                  label="Last name"
                  name="lastName"
                  value={delivery.lastName}
                  onChange={handleDeliveryChange}
                  error={deliveryErrors.lastName}
                  placeholder="Doe"
                />
              </div>

              <Field
                label="Email address"
                name="email"
                type="email"
                value={delivery.email}
                onChange={handleDeliveryChange}
                error={deliveryErrors.email}
                placeholder="you@example.com"
              />

              {/* Phone with prefix */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Phone number
                </label>
                <div className="flex">
                  <span className="border border-r-0 border-gray-300 bg-gray-50 rounded-l-lg px-3 py-2.5 text-sm text-gray-500">
                    +254
                  </span>
                  <input
                    name="phone"
                    value={delivery.phone}
                    onChange={handleDeliveryChange}
                    placeholder="700 000 000"
                    className={`flex-1 border rounded-r-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 ${
                      deliveryErrors.phone
                        ? "border-red-400 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                </div>
                {deliveryErrors.phone && (
                  <p className="text-xs text-red-500">{deliveryErrors.phone}</p>
                )}
              </div>

              <Field
                label="Street address / Building"
                name="address"
                value={delivery.address}
                onChange={handleDeliveryChange}
                error={deliveryErrors.address}
                placeholder="e.g. Kenyatta Avenue, Apt 4B"
              />

              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="City / Town"
                  name="city"
                  value={delivery.city}
                  onChange={handleDeliveryChange}
                  error={deliveryErrors.city}
                  placeholder="Nairobi"
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    County
                  </label>
                  <select
                    name="county"
                    value={delivery.county}
                    onChange={handleDeliveryChange}
                    className={`border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 ${
                      deliveryErrors.county
                        ? "border-red-400 bg-red-50"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Select county</option>
                    {[
                      "Nairobi",
                      "Mombasa",
                      "Kisumu",
                      "Nakuru",
                      "Eldoret",
                      "Thika",
                      "Nyeri",
                      "Meru",
                      "Kakamega",
                      "Kilifi",
                      "Machakos",
                      "Kisii",
                      "Garissa",
                      "Other",
                    ].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {deliveryErrors.county && (
                    <p className="text-xs text-red-500">
                      {deliveryErrors.county}
                    </p>
                  )}
                </div>
              </div>

              {/* Delivery notes */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Delivery notes{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  name="notes"
                  value={delivery.notes}
                  onChange={handleDeliveryChange}
                  rows={3}
                  placeholder="e.g. Call before delivery, leave at gate..."
                  className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                />
              </div>
            </div>
          )}

          {/* ── STEP 1: Payment ── */}
          {step === 1 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-5">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span className="w-7 h-7 bg-red-700 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  2
                </span>
                Payment Method
              </h2>

              {/* Payment options */}
              <div className="flex flex-col gap-3">
                {[
                  {
                    id: "mpesa",
                    label: "M-Pesa",
                    desc: "Pay via Safaricom M-Pesa STK Push",
                  },
                  {
                    id: "card",
                    label: "Credit / Debit Card",
                    desc: "Visa or Mastercard",
                  },
                  {
                    id: "cod",
                    label: "Cash on Delivery",
                    desc: "Pay when your order arrives",
                  },
                ].map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-start gap-3 border-2 rounded-xl p-4 cursor-pointer transition ${
                      payMethod === method.id
                        ? "border-red-600 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payMethod"
                      value={method.id}
                      checked={payMethod === method.id}
                      onChange={() => setPayMethod(method.id)}
                      className="accent-red-600 mt-0.5"
                    />
                    <div>
                      <p className="font-semibold text-sm text-gray-800">
                        {method.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {method.desc}
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              {/* M-Pesa fields */}
              {payMethod === "mpesa" && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex flex-col gap-3">
                  <p className="text-sm font-semibold text-green-800">
                    M-Pesa Payment
                  </p>
                  <p className="text-xs text-green-700">
                    Enter your M-Pesa number. You will receive an STK Push
                    prompt on your phone to complete payment.
                  </p>
                  <div className="flex">
                    <span className="border border-r-0 border-gray-300 bg-white rounded-l-lg px-3 py-2.5 text-sm text-gray-500">
                      +254
                    </span>
                    <input
                      type="tel"
                      value={mpesaPhone}
                      onChange={(e) => setMpesaPhone(e.target.value)}
                      placeholder="700 000 000"
                      className="flex-1 border border-gray-300 rounded-r-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                </div>
              )}

              {/* Card fields */}
              {payMethod === "card" && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col gap-4">
                  <p className="text-sm font-semibold text-blue-800">
                    Card Details
                  </p>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-600">
                      Card number
                    </label>
                    <input
                      value={cardForm.number}
                      onChange={(e) =>
                        setCardForm((p) => ({ ...p, number: e.target.value }))
                      }
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 font-mono"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-600">
                      Cardholder name
                    </label>
                    <input
                      value={cardForm.name}
                      onChange={(e) =>
                        setCardForm((p) => ({ ...p, name: e.target.value }))
                      }
                      placeholder="JOHN DOE"
                      className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-gray-600">
                        Expiry date
                      </label>
                      <input
                        value={cardForm.expiry}
                        onChange={(e) =>
                          setCardForm((p) => ({ ...p, expiry: e.target.value }))
                        }
                        placeholder="MM / YY"
                        maxLength={7}
                        className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-gray-600">
                        CVV
                      </label>
                      <input
                        value={cardForm.cvv}
                        onChange={(e) =>
                          setCardForm((p) => ({ ...p, cvv: e.target.value }))
                        }
                        placeholder="123"
                        maxLength={4}
                        type="password"
                        className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* COD notice */}
              {payMethod === "cod" && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-amber-800">
                    Cash on Delivery
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    Please have the exact amount of{" "}
                    <span className="font-bold">
                      KES {total.toLocaleString()}
                    </span>{" "}
                    ready when your order arrives. Available within Nairobi
                    only.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── STEP 2: Confirm ── */}
          {step === 2 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-6">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span className="w-7 h-7 bg-red-700 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  3
                </span>
                Confirm Your Order
              </h2>

              {/* Delivery summary */}
              <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-1.5 text-sm">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold text-gray-700">
                    Delivery details
                  </p>
                  <button
                    onClick={() => setStep(0)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-gray-600">
                  <span className="font-medium">Name:</span>{" "}
                  {delivery.firstName} {delivery.lastName}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span> {delivery.email}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Phone:</span> +254{" "}
                  {delivery.phone}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Address:</span>{" "}
                  {delivery.address}, {delivery.city}, {delivery.county}
                </p>
                {delivery.notes && (
                  <p className="text-gray-600">
                    <span className="font-medium">Notes:</span> {delivery.notes}
                  </p>
                )}
              </div>

              {/* Payment summary */}
              <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-1.5 text-sm">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold text-gray-700">Payment method</p>
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-gray-600">
                  {payMethod === "mpesa" && `M-Pesa — +254 ${mpesaPhone}`}
                  {payMethod === "card" &&
                    `Card ending in ${cardForm.number.slice(-4) || "----"}`}
                  {payMethod === "cod" && "Cash on Delivery"}
                </p>
              </div>

              {/* Items summary */}
              <div className="flex flex-col gap-3">
                <p className="font-semibold text-gray-700 text-sm">
                  Order items
                </p>
                {orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 text-sm"
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                      <span className="text-lg opacity-30">
                        {categoryIcon[item.category]}
                      </span>
                    </div>
                    <span className="flex-1 text-gray-700">{item.name}</span>
                    <span className="text-gray-400">×{item.quantity}</span>
                    <span className="font-semibold text-gray-800">
                      KES {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Final total */}
              <div className="border-t border-gray-100 pt-4 flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>KES {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span
                    className={
                      shipping === 0 ? "text-green-600 font-semibold" : ""
                    }
                  >
                    {shipping === 0
                      ? "FREE"
                      : `KES ${shipping.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base text-gray-900 pt-1 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-red-700">
                    KES {total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ── Navigation buttons ── */}
          <div className="flex justify-between mt-5">
            {step > 0 ? (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="border border-gray-300 text-gray-600 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition"
              >
                ← Back
              </button>
            ) : (
              <Link
                to="/cart"
                className="border border-gray-300 text-gray-600 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition"
              >
                ← Back to Cart
              </Link>
            )}

            {step < STEPS.length - 1 ? (
              <button
                onClick={nextStep}
                className="bg-red-700 text-white font-bold px-8 py-3 rounded-xl hover:bg-red-800 transition"
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={placeOrder}
                disabled={placing}
                className={`font-bold px-8 py-3 rounded-xl transition text-white ${
                  placing
                    ? "bg-red-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {placing ? "Placing Order..." : "✓ Place Order"}
              </button>
            )}
          </div>
        </div>

        {/* ── RIGHT: Order summary sidebar ── */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-4 sticky top-24">
            <h3 className="font-bold text-gray-800">Order Summary</h3>

            {orderItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 text-sm">
                <div className="relative shrink-0">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg opacity-25">
                      {categoryIcon[item.category]}
                    </span>
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {item.quantity}
                  </span>
                </div>
                <span className="flex-1 text-gray-600 leading-tight text-xs">
                  {item.name}
                </span>
                <span className="font-semibold text-gray-800 text-xs">
                  KES {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}

            <div className="border-t border-gray-100 pt-3 flex flex-col gap-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>KES {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span
                  className={
                    shipping === 0 ? "text-green-600 font-semibold" : ""
                  }
                >
                  {shipping === 0 ? "FREE" : `KES ${shipping.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-1 border-t border-gray-100">
                <span>Total</span>
                <span className="text-red-700">
                  KES {total.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 text-xs text-gray-400 pt-1 border-t border-gray-100">
              <span>🔒 SSL secured checkout</span>
              <span>📦 Estimated delivery: 2–4 business days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Reusable field component ──
function Field({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 ${
          error ? "border-red-400 bg-red-50" : "border-gray-300"
        }`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
