import { useState, useEffect } from "react";
import { productAPI, uploadAPI } from "../../services/api";

const categoryIcon = { books: "📖", articles: "✝️", av: "🎵" };

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  category: "books",
  stock: "",
  badge: "",
  status: "active",
  details: "", // comma separated, we'll split later
  images: [],
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState([]);

  // Load products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const data = await productAPI.getAllAdmin();
      setProducts(data.products);
    } catch (err) {
      showToast("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  }

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "all" || p.category === catFilter;
    return matchSearch && matchCat;
  });

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function openAdd() {
    setEditProduct(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setImagePreview([]);
    setShowModal(true);
  }

  function openEdit(product) {
    setEditProduct(product);
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category || "books",
      stock: product.stock || "",
      badge: product.badge || "",
      status: product.status || "active",
      details: (product.details || []).join(", "),
      images: product.images || [],
    });
    setImagePreview(product.images || []);
    setFormErrors({});
    setShowModal(true);
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Product name is required.";
    if (!form.description.trim()) e.description = "Description is required.";
    if (!form.price || form.price <= 0) e.price = "Enter a valid price.";
    if (form.stock === "" || form.stock < 0)
      e.stock = "Enter a valid stock quantity.";
    return e;
  }

  // ── Handle image file selection and upload ──
  async function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file);
    setImagePreview((prev) => [...prev, localPreview]);

    setUploading(true);
    try {
      const result = await uploadAPI.uploadImage(file);
      // Replace local preview with real Cloudinary URL
      setImagePreview((prev) => [...prev.slice(0, -1), result.url]);
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, result.url],
      }));
      showToast("Image uploaded successfully!");
    } catch (err) {
      // Remove the preview if upload failed
      setImagePreview((prev) => prev.slice(0, -1));
      showToast("Image upload failed: " + err.message, "error");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(index) {
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }

  async function handleSave() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    setSaving(true);
    try {
      const productData = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        stock: Number(form.stock),
        badge: form.badge || null,
        status: form.status,
        images: form.images,
        details: form.details
          ? form.details
              .split(",")
              .map((d) => d.trim())
              .filter(Boolean)
          : [],
      };

      if (editProduct) {
        await productAPI.update(editProduct._id, productData);
        showToast("Product updated successfully!");
      } else {
        await productAPI.create(productData);
        showToast("Product added successfully!");
      }

      setShowModal(false);
      fetchProducts(); // reload from API
    } catch (err) {
      showToast(err.message || "Failed to save product", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await productAPI.delete(id);
      showToast("Product deleted.", "error");
      setDeleteConfirm(null);
      fetchProducts();
    } catch (err) {
      showToast(err.message || "Failed to delete product", "error");
    }
  }

  async function toggleStatus(product) {
    try {
      await productAPI.update(product._id, {
        status: product.status === "active" ? "inactive" : "active",
      });
      fetchProducts();
    } catch (err) {
      showToast("Failed to update status", "error");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 relative">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl text-white text-sm font-semibold shadow-lg ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
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

      {/* Filters */}
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

      {/* Table */}
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
                    key={product._id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {/* Show real image if available */}
                        <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-lg opacity-40">
                              {categoryIcon[product.category]}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 leading-tight">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">
                            {product.description?.slice(0, 60)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 capitalize text-gray-500">
                      {product.category === "av"
                        ? "Audio & Video"
                        : product.category}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-800">
                      KES {product.price.toLocaleString()}
                    </td>
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
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleStatus(product)}
                        className={`text-xs font-semibold px-3 py-1 rounded-full transition ${
                          product.status === "active"
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {product.status === "active" ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="text-xs border border-blue-300 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(product._id)}
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

      {/* Add / Edit modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 flex items-start justify-center px-4 py-8 overflow-y-auto"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 flex flex-col gap-5 shadow-xl">
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

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={form.description}
                  rows={4}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, description: e.target.value }));
                    setFormErrors((p) => ({ ...p, description: null }));
                  }}
                  placeholder="Describe the product in detail..."
                  className={`border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none ${
                    formErrors.description
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                {formErrors.description && (
                  <p className="text-xs text-red-500">
                    {formErrors.description}
                  </p>
                )}
              </div>

              {/* Details */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Product details
                  <span className="text-gray-400 font-normal ml-1">
                    (comma separated)
                  </span>
                </label>
                <input
                  value={form.details}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, details: e.target.value }))
                  }
                  placeholder="e.g. Hardcover, 300 pages, Publisher: Ignatius Press"
                  className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                <p className="text-xs text-gray-400">
                  Each item separated by a comma will appear as a bullet point
                  on the product page.
                </p>
              </div>

              {/* Price & Stock */}
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

              {/* Category, Badge, Status */}
              <div className="grid grid-cols-3 gap-4">
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
                    Badge
                  </label>
                  <select
                    value={form.badge}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, badge: e.target.value }))
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    <option value="">No badge</option>
                    <option value="Best Seller">Best Seller</option>
                    <option value="Popular">Popular</option>
                    <option value="New">New</option>
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

              {/* Image upload */}
              {/* Image area */}
              <div className="flex flex-col gap-4">
                <div className="relative bg-gray-100 rounded-xl h-80 flex items-center justify-center overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-9xl opacity-20">
                      {categoryIcon[product.category]}
                    </span>
                  )}
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

                {/* Thumbnail strip */}
                {product.images && product.images.length > 1 && (
                  <div className="flex gap-2">
                    {product.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`View ${i + 1}`}
                        className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200 cursor-pointer hover:border-red-400 transition"
                      />
                    ))}
                  </div>
                )}
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
                disabled={saving || uploading}
                className={`flex-1 font-bold py-2.5 rounded-xl transition text-white ${
                  saving || uploading
                    ? "bg-red-400 cursor-not-allowed"
                    : "bg-red-700 hover:bg-red-800"
                }`}
              >
                {saving
                  ? "Saving..."
                  : editProduct
                    ? "Save Changes"
                    : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 flex flex-col gap-4 shadow-xl">
            <div className="text-center">
              <span className="text-4xl">⚠️</span>
              <h3 className="text-lg font-bold text-gray-800 mt-3">
                Delete Product?
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                This action cannot be undone.
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
