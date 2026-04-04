import { Link, useSearchParams } from "react-router";

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get("order");
  const total = searchParams.get("total");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-16">
      <div className="bg-white border border-gray-200 rounded-2xl p-10 max-w-md w-full text-center flex flex-col gap-5">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <span className="text-4xl">✓</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Order Placed!</h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          Your order has been received and is being processed. You will receive
          a confirmation email shortly.
        </p>
        {orderNumber && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Order number</p>
            <p className="text-xl font-bold text-red-700 font-mono">
              {orderNumber}
            </p>
          </div>
        )}
        {total && (
          <p className="text-sm text-gray-600">
            Total paid:{" "}
            <span className="font-bold text-gray-800">
              KES {Number(total).toLocaleString()}
            </span>
          </p>
        )}
        <div className="flex flex-col gap-3 mt-2">
          <Link
            to="/account"
            className="bg-red-700 text-white font-bold py-3 rounded-xl hover:bg-red-800 transition"
          >
            View My Orders
          </Link>
          <Link to="/shop" className="text-sm text-gray-400 hover:text-red-600">
            Continue Shopping →
          </Link>
        </div>
      </div>
    </div>
  );
}
