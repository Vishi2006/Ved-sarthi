import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { isAuthenticated, openAuthModal, user, logout } = useAuth();

  const guardNav = (e) => {
    if (isAuthenticated) return;
    e.preventDefault();
    openAuthModal("login");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500">
            <span className="text-sm font-bold text-white">H</span>
          </div>
          <span className="text-lg font-semibold tracking-tight text-slate-900">
            HealthAI
          </span>
        </NavLink>

        {/* Primary nav */}
        <nav className="hidden flex-1 items-center gap-6 text-sm text-slate-600 md:flex">
          <NavLink
            to="/upload-records"
            className={({ isActive }) =>
              `transition hover:text-slate-900 ${
                isActive ? "font-semibold text-slate-900" : ""
              }`
            }
            onClick={guardNav}
          >
            My Records
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `transition hover:text-slate-900 ${
                isActive ? "font-semibold text-slate-900" : ""
              }`
            }
            onClick={guardNav}
          >
            Health Insights
          </NavLink>
          <NavLink
            to="/appointments"
            className={({ isActive }) =>
              `transition hover:text-slate-900 ${
                isActive ? "font-semibold text-slate-900" : ""
              }`
            }
            onClick={guardNav}
          >
            Profile
          </NavLink>
        </nav>

        {/* Search + actions */}
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-500 md:flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4 text-slate-400"
            >
              <circle cx="11" cy="11" r="6" />
              <path d="m16 16 3.5 3.5" />
            </svg>
            <input
              type="text"
              placeholder="Search records..."
              className="w-40 border-none bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>

          {isAuthenticated ? (
            <button
              className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
              onClick={logout}
            >
              Logout
            </button>
          ) : (
            <button
              className="rounded-full bg-teal-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-teal-600"
              onClick={() => openAuthModal("register")}
            >
              Get Started
            </button>
          )}

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-xs font-semibold text-white">
            {user?.name?.slice(0, 1)?.toUpperCase() || "U"}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

