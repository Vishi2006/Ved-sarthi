const DEFAULT_BASE_URL = "http://localhost:5000";

export const apiFetch = async (
  path,
  { method = "GET", body, token, headers = {} } = {}
) => {
  const baseUrl = import.meta.env.VITE_API_URL || DEFAULT_BASE_URL;
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

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
