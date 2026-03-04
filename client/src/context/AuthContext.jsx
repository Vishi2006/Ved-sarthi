import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import * as authService from "../services/authService";

export const AuthContext = createContext(null);

const TOKEN_KEY = "healthmeet_token";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // 'login' | 'register'
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const isAuthenticated = Boolean(token && user);

  const openAuthModal = useCallback((mode = "login") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    const res = await authService.register({ name, email, password });
    localStorage.setItem(TOKEN_KEY, res.token);
    setToken(res.token);
    setUser(res.user);
    setIsAuthModalOpen(false);
    return res;
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const res = await authService.login({ email, password });
    localStorage.setItem(TOKEN_KEY, res.token);
    setToken(res.token);
    setUser(res.user);
    setIsAuthModalOpen(false);
    return res;
  }, []);

  const refreshMe = useCallback(async () => {
    if (!token) return null;
    const me = await authService.me(token);
    setUser(me.user);
    return me;
  }, [token]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (token) {
          const me = await authService.me(token);
          if (!alive) return;
          setUser(me.user);
        }
      } catch {
        if (!alive) return;
        logout();
      } finally {
        if (alive) setIsBootstrapping(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [token, logout]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      isBootstrapping,
      isAuthModalOpen,
      authMode,
      setAuthMode,
      openAuthModal,
      closeAuthModal,
      register,
      login,
      logout,
      refreshMe,
    }),
    [
      user,
      token,
      isAuthenticated,
      isBootstrapping,
      isAuthModalOpen,
      authMode,
      openAuthModal,
      closeAuthModal,
      register,
      login,
      logout,
      refreshMe,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

