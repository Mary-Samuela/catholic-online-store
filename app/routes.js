import { route, index, layout } from "@react-router/dev/routes";

export default [
  layout("layouts/MainLayout.jsx", [
    index("routes/home.jsx"),
    route("shop", "routes/shop.jsx"),
    route("product/:id", "routes/product.jsx"),
    route("cart", "routes/cart.jsx"),
    route("checkout", "routes/checkout.jsx"),
    route("login", "routes/login.jsx"),
    route("register", "routes/register.jsx"),
    route("account", "routes/account.jsx"),
  ]),
  layout("layouts/AdminLayout.jsx", [
    route("admin", "routes/admin/dashboard.jsx"),
    route("admin/products", "routes/admin/products.jsx"),
    route("admin/orders", "routes/admin/orders.jsx"),
  ]),
];
