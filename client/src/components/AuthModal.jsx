import { useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";

const AuthModal = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authMode,
    setAuthMode,
    login,
    register,
  } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const title = useMemo(() => {
    return authMode === "register" ? "Create account" : "Welcome back";
  }, [authMode]);

  if (!isAuthModalOpen) return null;

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (authMode === "register") {
        await register({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        });
      } else {
        await login({
          email: form.email.trim(),
          password: form.password,
        });
      }
    } catch (err) {
      setError(err?.message || "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">{title}</p>
            <p className="mt-1 text-xs text-slate-500">
              Sign in to continue to your dashboard.
            </p>
          </div>
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            onClick={closeAuthModal}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs text-rose-700">
            {error}
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          {authMode === "register" ? (
            <div>
              <label className="text-xs font-semibold text-slate-700">
                Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                required
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-teal-500/30 focus:ring-4"
                placeholder="Your name"
              />
            </div>
          ) : null}

          <div>
            <label className="text-xs font-semibold text-slate-700">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              required
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-teal-500/30 focus:ring-4"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              required
              minLength={6}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none ring-teal-500/30 focus:ring-4"
              placeholder="••••••••"
            />
          </div>

          <button
            disabled={submitting}
            className="mt-2 w-full rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
          >
            {authMode === "register" ? "Create account" : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-slate-600">
          {authMode === "register" ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                className="font-semibold text-teal-600 hover:text-teal-700"
                onClick={() => setAuthMode("login")}
              >
                Login
              </button>
            </>
          ) : (
            <>
              New here?{" "}
              <button
                type="button"
                className="font-semibold text-teal-600 hover:text-teal-700"
                onClick={() => setAuthMode("register")}
              >
                Create account
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

