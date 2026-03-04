import { apiFetch } from "./api";

export const register = async ({ name, email, password }) => {
  return apiFetch("/api/auth/register", {
    method: "POST",
    body: { name, email, password },
  });
};

export const login = async ({ email, password }) => {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
};

export const me = async (token) => {
  return apiFetch("/api/auth/me", {
    method: "GET",
    token,
  });
};
