import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Dashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-900">
          Patient Dashboard
        </h1>
        <button
          onClick={logout}
          className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          type="button"
        >
          Logout
        </button>
      </div>
      <p className="mt-2 text-sm text-slate-600">
        Welcome{user?.name ? `, ${user.name}` : ""}.
      </p>
      <p className="mt-2 text-sm text-slate-600">
        Overview of your health insights, previous consultations, and upcoming
        appointments will appear here.
      </p>
    </div>
  );
};

export default Dashboard;
