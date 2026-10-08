import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { login as apiLogin, registerUser as apiRegister, getProfile, logoutUser, updateProfile as apiUpdateProfile } from "../services/auth";

const AuthContext = createContext(null);

const CURRENCY_SYMBOLS = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CAD: "CA$",
  AUD: "AU$",
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const data = await getProfile();
      setUser(data);
      if (data.dark_mode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      // If token expired and couldn't be refreshed, user is null
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();

    const handleForceLogout = () => {
      setUser(null);
    };

    window.addEventListener("auth:logout", handleForceLogout);
    return () => {
      window.removeEventListener("auth:logout", handleForceLogout);
    };
  }, [fetchCurrentUser]);

  const login = async (credentials) => {
    const data = await apiLogin(credentials);
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    if (data.user) {
      setUser(data.user);
    } else {
      await fetchCurrentUser();
    }
    return data;
  };

  const register = async (userData) => {
    const data = await apiRegister(userData);
    if (data.access) {
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      if (data.user) {
        setUser(data.user);
      } else {
        await fetchCurrentUser();
      }
    }
    return data;
  };

  const logout = async () => {
    const refresh = localStorage.getItem("refresh");
    await logoutUser(refresh);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const updated = await apiUpdateProfile(profileData);
    setUser(updated);
    if (updated.dark_mode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    return updated;
  };

  const formatCurrency = useCallback((amount) => {
    const num = Number(amount) || 0;
    const currencyCode = user?.currency || "INR";
    const symbol = CURRENCY_SYMBOLS[currencyCode] || currencyCode + " ";
    return `${symbol}${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [user?.currency]);

  const getCurrencySymbol = useCallback(() => {
    const currencyCode = user?.currency || "INR";
    return CURRENCY_SYMBOLS[currencyCode] || currencyCode;
  }, [user?.currency]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
        refreshUser: fetchCurrentUser,
        formatCurrency,
        getCurrencySymbol,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
