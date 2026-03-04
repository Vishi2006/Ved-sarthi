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
    <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] flex items-center bg-[#F5EFE0]/70 backdrop-blur-[20px] saturate-180 border-neo shadow-neo rounded-full px-2 py-2 pl-6 w-max anim-nav-drop">
      {/* Logo */}
      <NavLink to="/" className="flex items-center mr-8">
        <span className="font-syne font-extrabold text-[15px] text-neo-black tracking-[-0.5px] whitespace-nowrap">
          HealthBridge
        </span>
        <span className="inline-block bg-neo-yellow border-[2px] border-neo-black rounded px-[6px] py-[1px] ml-1 text-[11px] font-space font-bold align-middle shadow-[2px_2px_0_var(--neo-black)] text-neo-black">
          AI
        </span>
      </NavLink>

      {/* Primary nav */}
      <div className="flex items-center gap-1">
        <NavLink
            to="/upload-records"
            className="font-dm text-[13px] font-medium text-neo-black px-3.5 py-1.5 rounded-full transition-colors hover:bg-black/5"
            onClick={guardNav}
        >
          My Records
        </NavLink>
        <NavLink
            to="/dashboard"
            className="font-dm text-[13px] font-medium text-neo-black px-3.5 py-1.5 rounded-full transition-colors hover:bg-black/5"
            onClick={guardNav}
        >
          Insights
        </NavLink>
        <NavLink
            to="/appointments"
            className="font-dm text-[13px] font-medium text-neo-black px-3.5 py-1.5 rounded-full transition-colors hover:bg-black/5"
            onClick={guardNav}
        >
          Profile
        </NavLink>
      </div>

      {/* Actions */}
      <div className="ml-2 flex items-center">
        {isAuthenticated ? (
          <button
            className="font-syne font-bold text-[13px] bg-neo-black text-neo-white border-neo rounded-full px-5 py-2.5 shadow-[3px_3px_0_rgba(0,0,0,0.3)] transition-all hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0_rgba(0,0,0,0.3)] flex items-center gap-2"
            onClick={logout}
          >
            Logout
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-neo-yellow border-[1.5px] border-neo-black text-[9px] font-bold text-neo-black">
              {user?.name?.slice(0, 1)?.toUpperCase() || "U"}
            </div>
          </button>
        ) : (
          <button
            className="font-syne font-bold text-[13px] bg-neo-black text-neo-white border-neo rounded-full px-5 py-2.5 shadow-[3px_3px_0_rgba(0,0,0,0.3)] transition-all hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0_rgba(0,0,0,0.3)]"
            onClick={() => openAuthModal("register")}
          >
            Get Early Access →
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
