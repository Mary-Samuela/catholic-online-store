// Base URL of your backend
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ── Helper: get token from localStorage ──
const getToken = () => localStorage.getItem("token");

// ── Helper: build headers ──
const headers = (auth = false) => {
  const h = { "Content-Type": "application/json" };
  if (auth) h["Authorization"] = `Bearer ${getToken()}`;
  return h;
};

// ── Helper: handle response ──
const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
};

// ══════════════════════════════════════════
//  AUTH
// ══════════════════════════════════════════
export const authAPI = {
  register: (userData) =>
    fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(userData),
    }).then(handleResponse),

  login: (credentials) =>
    fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(credentials),
    }).then(handleResponse),

  getMe: () =>
    fetch(`${BASE_URL}/auth/me`, {
      headers: headers(true),
    }).then(handleResponse),
};

// ══════════════════════════════════════════
//  PRODUCTS
// ══════════════════════════════════════════
export const productAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${BASE_URL}/products?${query}`).then(handleResponse);
  },
  getAllAdmin: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${BASE_URL}/products/admin/all?${query}`, {
      headers: headers(true),
    }).then(handleResponse);
  },
  getFeatured: () =>
    fetch(`${BASE_URL}/products/featured`).then(handleResponse),

  getOne: (id) => fetch(`${BASE_URL}/products/${id}`).then(handleResponse),

  create: (data) =>
    fetch(`${BASE_URL}/products`, {
      method: "POST",
      headers: headers(true),
      body: JSON.stringify(data),
    }).then(handleResponse),

  update: (id, data) =>
    fetch(`${BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: headers(true),
      body: JSON.stringify(data),
    }).then(handleResponse),

  delete: (id) =>
    fetch(`${BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: headers(true),
    }).then(handleResponse),
};

// ══════════════════════════════════════════
//  ORDERS
// ══════════════════════════════════════════
export const orderAPI = {
  create: (orderData) =>
    fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: headers(true),
      body: JSON.stringify(orderData),
    }).then(handleResponse),

  getMyOrders: () =>
    fetch(`${BASE_URL}/orders/myorders`, {
      headers: headers(true),
    }).then(handleResponse),

  getOne: (id) =>
    fetch(`${BASE_URL}/orders/${id}`, {
      headers: headers(true),
    }).then(handleResponse),

  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`${BASE_URL}/orders?${query}`, {
      headers: headers(true),
    }).then(handleResponse);
  },

  updateStatus: (id, data) =>
    fetch(`${BASE_URL}/orders/${id}/status`, {
      method: "PUT",
      headers: headers(true),
      body: JSON.stringify(data),
    }).then(handleResponse),
};

// ══════════════════════════════════════════
//  USERS (admin)
// ══════════════════════════════════════════
export const userAPI = {
  updateProfile: (data) =>
    fetch(`${BASE_URL}/users/profile`, {
      method: "PUT",
      headers: headers(true),
      body: JSON.stringify(data),
    }).then(handleResponse),

  getAll: () =>
    fetch(`${BASE_URL}/users`, {
      headers: headers(true),
    }).then(handleResponse),

  toggle: (id) =>
    fetch(`${BASE_URL}/users/${id}/toggle`, {
      method: "PUT",
      headers: headers(true),
    }).then(handleResponse),
};
