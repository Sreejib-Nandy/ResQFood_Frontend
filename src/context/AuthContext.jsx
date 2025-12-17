import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import { connectSocket, disconnectSocket } from "../socket/socket";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // SOCKET LIFECYCLE (connect on login, disconnect on logout / expiry)
  useEffect(() => {
    if (user) {
      connectSocket(user);
    } else {
      disconnectSocket();
    }
  }, [user]);

  // RESTORE SESSION ON REFRESH
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        const res = await api.get("/users/me");
        setUser(res.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
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

      navigate("/");
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
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
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
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
      navigate("/");
      toast.success("Logged out successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  const hardLogout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        hardLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
