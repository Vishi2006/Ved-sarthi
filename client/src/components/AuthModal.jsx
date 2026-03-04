import { useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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
      navigate("/dashboard");
    } catch (err) {
      setError(err?.message || "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 anim-fade-up"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div className="w-full max-w-sm relative overflow-hidden bg-white/40 backdrop-blur-[24px] saturate-200 border-[2px] border-white/80 rounded-[28px] p-8 shadow-clay-lg">
        {/* Inner top highlight layer */}
        <div className="absolute top-0 left-0 right-0 h-[60%] bg-gradient-to-b from-white/50 to-transparent pointer-events-none rounded-t-[28px]"></div>

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <p className="font-syne font-bold text-2xl text-neo-black tracking-[-1px]">{title}</p>
              <p className="mt-1 font-dm text-[13px] text-[#333]">
                {authMode === "register" ? "Join HealthBridge AI today." : "Sign in to continue to your dashboard."}
              </p>
            </div>
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center rounded-xl border border-neo-black bg-clay-lemon text-neo-black shadow-[2px_2px_0_var(--neo-black)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--neo-black)] font-space font-bold text-xs"
              onClick={closeAuthModal}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {error ? (
            <div className="mb-4 rounded-[14px] border border-neo-red/30 bg-neo-red/10 px-4 py-3 text-[13px] font-dm text-neo-red shadow-inner">
              {error}
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="space-y-4">
            {authMode === "register" ? (
              <div>
                <label className="font-space font-bold text-[10px] uppercase tracking-[1px] text-[#333] block mb-1.5">
                  Full Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  required
                  autoComplete="name"
                  className="w-full rounded-[16px] border-2 border-transparent bg-white/75 px-4 py-3 font-dm text-[14px] text-neo-black outline-none transition-all placeholder:text-black/50 focus:border-neo-black focus:bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]"
                  placeholder="Your name"
                />
              </div>
            ) : null}

            <div>
              <label className="font-space font-bold text-[10px] uppercase tracking-[1px] text-[#333] block mb-1.5">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                required
                autoComplete="email"
                className="w-full rounded-[16px] border-2 border-transparent bg-white/75 px-4 py-3 font-dm text-[14px] text-neo-black outline-none transition-all placeholder:text-black/50 focus:border-neo-black focus:bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="font-space font-bold text-[10px] uppercase tracking-[1px] text-[#333] block mb-1.5">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                required
                minLength={6}
                autoComplete="current-password"
                className="w-full rounded-[16px] border-2 border-transparent bg-white/75 px-4 py-3 font-dm text-[14px] text-neo-black outline-none transition-all placeholder:text-black/50 focus:border-neo-black focus:bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]"
                placeholder="••••••••"
              />
            </div>

            <button
              disabled={submitting}
              className="mt-2 w-full font-syne font-bold text-[15px] bg-neo-black text-neo-white border-neo rounded-full px-4 py-3.5 shadow-neo transition-all hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-neo-lg hover:text-neo-yellow disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-neo"
              type="submit"
            >
              {authMode === "register" ? "Create Account →" : "Login →"}
            </button>
          </form>

          <div className="mt-6 text-center font-dm text-[13px] text-[#333]">
            {authMode === "register" ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  className="font-bold text-neo-black border-b-[1.5px] border-neo-black pb-0.5 hover:text-neo-yellow transition-colors"
                  onClick={() => setAuthMode("login")}
                >
                  Login here
                </button>
              </>
            ) : (
              <>
                New here?{" "}
                <button
                  type="button"
                  className="font-bold text-neo-black border-b-[1.5px] border-neo-black pb-0.5 hover:text-neo-yellow transition-colors"
                  onClick={() => setAuthMode("register")}
                >
                  Create an account
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
