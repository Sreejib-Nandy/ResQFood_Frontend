import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔄 RESTORE SESSION ON REFRESH
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        const res = await api.get("/users/me");
        setUser(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          setUser(null);
        } else {
          // Unexpected error (network / server issue)
          console.error("Failed to restore session", err);
          setUser(null);
        }
      } finally {
        setInterval(() => {
          setLoading(false);
      }, 1500);
      }
    };
    loadUser();
  }, []);

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await api.post(
        "/auth/login",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      toast.success(res.data.message);

      const profile = await api.get("/users/me");
      setUser(profile.data);
      localStorage.setItem("resq_user", JSON.stringify(profile.data));

      navigate("/");
      return { success: true };

    } catch (err) {
      toast.error(err.response?.data?.message);
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (formData) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/register", formData);
      toast.success(res.data.message);

      return { success: true, message: res.data.message };

    } catch (err) {
      toast.error(err.response?.data?.message);
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      setUser(null);
      localStorage.removeItem("resq_user");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const hardLogout = () => {
    setUser(null);
    localStorage.removeItem("resq_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, hardLogout }}>
      {children}
    </AuthContext.Provider>
  );
};


