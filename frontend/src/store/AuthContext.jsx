import React, { createContext, useCallback, useEffect, useState } from "react";
import api from "../services/api";

export const AuthContext = createContext({
  user: null,
  token: null,
  setAuth: () => {},
  logout: () => {},
  loading: false,
});
const readToken = () => localStorage.getItem("token") || localStorage.getItem("auth-token") || null;

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => readToken());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));
  const setAuth = useCallback(({ token: newToken, user: newUser }) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      localStorage.setItem("auth-token", newToken); 
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("auth-token");
    }
    setToken(newToken || null);
    if (newUser) setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("auth-token");
    setToken(null);
    setUser(null);
  }, []);
  useEffect(() => {
    let mounted = true;
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    (async () => {
      try {
        const resp = await api.get("/api/auth/me");
        if (!mounted) return;

        const data = resp?.data ?? null;
        if (data) {
          setUser(data.user ?? data);
        }
      } catch (err) {
        console.error("Failed to fetch current user", err);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("auth-token");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
      return () => {
      mounted = false;
    };
  }, [token]);

  const value = {
    user,
    token,
    setAuth,
    logout,
    loading,
  };
return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export default AuthProvider;