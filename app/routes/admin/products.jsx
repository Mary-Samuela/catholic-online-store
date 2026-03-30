import { useState } from "react";

const initialProducts = [
  {
    id: 1,
    name: "Holy Bible (RSV Catholic Edition)",
    price: 1200,
    category: "books",
    stock: 12,
    status: "active",
  },
  {
    id: 2,
    name: "Catechism of the Catholic Church",
    price: 1500,
    category: "books",
    stock: 8,
    status: "active",
  },
  {
    id: 3,
    name: "Daily Roman Missal",
    price: 2200,
    category: "books",
    stock: 5,
    status: "active",
  },
  {
    id: 7,
    name: "Wooden Rosary Beads",
    price: 450,
    category: "articles",
    stock: 30,
    status: "active",
  },
  {
    id: 8,
    name: "Crucifix – Wall Mount (30cm)",
    price: 950,
    category: "articles",
    stock: 7,
    status: "active",
  },
  {
    id: 9,
    name: "Miraculous Medal (Silver)",
    price: 300,
    category: "articles",
    stock: 50,
    status: "active",
  },
  {
    id: 12,
    name: "Priest Vestment Set",
    price: 8500,
    category: "articles",
    stock: 3,
    status: "active",
  },
  {
    id: 13,
    name: "Divine Mercy Novena CD",
    price: 800,
    category: "av",
    stock: 18,
    status: "active",
  },
  {
    id: 14,
    name: "Gregorian Chant DVD",
    price: 700,
    category: "av",
    stock: 0,
    status: "inactive",
  },
  {
    id: 15,
    name: "Rosary Audio USB (All Mysteries)",
    price: 1100,
    category: "av",
    stock: 22,
    status: "active",
  },
];

const categoryIcon = { books: "📖", articles: "✝️", av: "🎵" };
const EMPTY_FORM = {
  name: "",
  price: "",
  category: "books",
  stock: "",
  status: "active",
};

export default function AdminProducts() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null); // null = adding new
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  // ── Filtered list ──
  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "all" || p.category === catFilter;
    return matchSearch && matchCat;
  });

  // ── Show toast ──
  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  // ── Open modal ──
  function openAdd() {
    setEditProduct(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setShowModal(true);
  }

  function openEdit(product) {
    setEditProduct(product);
    setForm({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      status: product.status,
    });
    setFormErrors({});
    setShowModal(true);
  }

  // ── Validate form ──
  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Product name is required.";
    if (!form.price || form.price <= 0) e.price = "Enter a valid price.";
    if (form.stock === "" || form.stock < 0)
      e.stock = "Enter a valid stock quantity.";
    return e;
  }

  // ── Save product ──
  function handleSave() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    if (editProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editProduct.id
            ? {
                ...p,
                ...form,
                price: Number(form.price),
                stock: Number(form.stock),
              }
            : p,
        ),
      );
      showToast("Product updated successfully!");
    } else {
      const newProduct = {
        ...form,
        id: Date.now(),
        price: Number(form.price),
        stock: Number(form.stock),
      };
      setProducts((prev) => [newProduct, ...prev]);
      showToast("Product added successfully!");
    }
    setShowModal(false);
  }

  // ── Delete product ──
  function handleDelete(id) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirm(null);
    showToast("Product deleted.", "error");
  }

  // ── Toggle status ──
  function toggleStatus(id) {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "active" ? "inactive" : "active" }
          : p,
      ),
    );
  }

  return (
    <div className="flex flex-col gap-6 relative">
      {/* ── Toast ── */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-white text-sm font-semibold shadow-lg transition ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-500 text-sm mt-1">
            {products.length} products total
          </p>
        </div>
        <button
          onClick={openAdd}
          className="bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-red-800 transition flex items-center gap-2"
        >
          <span className="text-lg leading-none">+</span> Add Product
        </button>
      </div>

      {/* ── Filters ── */}
      <div className="flex gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 flex-1 min-w-48"
        />
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          <option value="all">All categories</option>
          <option value="books">Books</option>
          <option value="articles">Articles</option>
          <option value="av">Audio & Video</option>
        </select>
      </div>

      {/* ── Products table ── */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="text-left text-gray-500 text-xs">
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold text-right">Price</th>
                <th className="px-4 py-3 font-semibold text-center">Stock</th>
                <th className="px-4 py-3 font-semibold text-center">Status</th>
                <th className="px-4 py-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    No products found
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition"
                  >
                    {/* Name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                          <span className="text-lg opacity-40">
                            {categoryIcon[product.category]}
                          </span>
                        </div>
                        <span className="font-medium text-gray-800 leading-tight">
                          {product.name}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 capitalize text-gray-500">
                      {product.category === "av"
                        ? "Audio & Video"
                        : product.category}
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3 text-right font-semibold text-gray-800">
                      KES {product.price.toLocaleString()}
                    </td>

                    {/* Stock */}
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`font-semibold ${
                          product.stock === 0
                            ? "text-red-600"
                            : product.stock <= 5
                              ? "text-orange-500"
                              : "text-green-600"
                        }`}
                      >
                        {product.stock === 0 ? "Out of stock" : product.stock}
                      </span>
                    </td>

                    {/* Status toggle */}
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleStatus(product.id)}
                        className={`text-xs font-semibold px-3 py-1 rounded-full transition ${
                          product.status === "active"
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {product.status === "active" ? "Active" : "Inactive"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="text-xs border border-blue-300 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(product.id)}
                          className="text-xs border border-red-300 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add / Edit modal ── */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 flex items-center justify-center px-4"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 flex flex-col gap-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">
                {editProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Product name
                </label>
                <input
                  value={form.name}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, name: e.target.value }));
                    setFormErrors((p) => ({ ...p, name: null }));
                  }}
                  placeholder="e.g. Holy Bible (RSV)"
                  className={`border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 ${
                    formErrors.name
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                {formErrors.name && (
                  <p className="text-xs text-red-500">{formErrors.name}</p>
                )}
              </div>

              {/* Price & Stock row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Price (KES)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, price: e.target.value }));
                      setFormErrors((p) => ({ ...p, price: null }));
                    }}
                    placeholder="e.g. 1200"
                    className={`border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 ${
                      formErrors.price
                        ? "border-red-400 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  {formErrors.price && (
                    <p className="text-xs text-red-500">{formErrors.price}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Stock quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, stock: e.target.value }));
                      setFormErrors((p) => ({ ...p, stock: null }));
                    }}
                    placeholder="e.g. 10"
                    className={`border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 ${
                      formErrors.stock
                        ? "border-red-400 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  {formErrors.stock && (
                    <p className="text-xs text-red-500">{formErrors.stock}</p>
                  )}
                </div>
              </div>

              {/* Category & Status row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, category: e.target.value }))
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    <option value="books">Religious Books</option>
                    <option value="articles">Religious Articles</option>
                    <option value="av">Audio & Video</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, status: e.target.value }))
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal actions */}
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-300 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-red-700 text-white font-bold py-2.5 rounded-xl hover:bg-red-800 transition"
              >
                {editProduct ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirmation modal ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 flex flex-col gap-4 shadow-xl">
            <div className="text-center">
              <span className="text-4xl">⚠️</span>
              <h3 className="text-lg font-bold text-gray-800 mt-3">
                Delete Product?
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                This action cannot be undone. The product will be permanently
                removed.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-gray-300 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-600 text-white font-bold py-2.5 rounded-xl hover:bg-red-700 transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
