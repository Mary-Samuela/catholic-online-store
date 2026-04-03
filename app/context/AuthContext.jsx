import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── On app load, check if user is already logged in ──
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      authAPI
        .getMe()
        .then((data) => setUser(data))
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // ── Login ──
  async function login(credentials) {
    const data = await authAPI.login(credentials);
    localStorage.setItem("token", data.token);
    setUser(data);
    return data;
  }

  // ── Register ──
  async function register(userData) {
    const data = await authAPI.register(userData);
    localStorage.setItem("token", data.token);
    setUser(data);
    return data;
  }

  // ── Logout ──
  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Custom hook ──
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
