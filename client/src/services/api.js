// In dev: Vite proxy forwards /api/* to localhost:5000 — base URL is empty (relative).
// In prod: set VITE_API_URL=https://your-api-domain.com in client/.env
const BASE_URL = import.meta.env.VITE_API_URL ?? "";

export const apiFetch = async (
  path,
  { method = "GET", body, token, headers = {} } = {}
) => {
  const url = `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message = data?.message || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
};
