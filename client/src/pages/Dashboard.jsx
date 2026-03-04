import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Dashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 anim-fade-up">
      <div className="bg-white/40 backdrop-blur-[24px] saturate-200 border-2 border-white/80 rounded-[28px] p-8 shadow-clay-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[60%] bg-gradient-to-b from-white/50 to-transparent pointer-events-none rounded-t-[28px]"></div>
        
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <h1 className="font-syne font-extrabold text-3xl tracking-[-1px] text-neo-black">
              Patient Dashboard
            </h1>
            <button
              onClick={logout}
              className="font-syne font-bold text-[13px] bg-neo-black text-neo-white border-[2px] border-neo-black rounded-full px-5 py-2.5 shadow-[3px_3px_0_rgba(0,0,0,0.3)] transition-all hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0_rgba(0,0,0,0.3)] hover:text-neo-yellow cursor-none"
              type="button"
            >
              Logout →
            </button>
          </div>
          
          <div className="font-space font-bold text-[11px] uppercase tracking-[1px] text-min-grey mb-2">
            // Welcome back, {user?.name || "User"}
          </div>
          
          <p className="font-dm text-[15px] text-[#555] leading-relaxed max-w-2xl">
            Overview of your health insights, previous consultations, and upcoming
            appointments will appear here. Manage your records and get AI-driven triage suggestions.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8">
            <div className="bg-white/50 backdrop-blur-sm border-[1.5px] border-white/70 rounded-[20px] p-6 shadow-step transition-all hover:-translate-y-1 hover:shadow-clay cursor-none">
              <div className="w-10 h-10 bg-clay-sky border-[2px] border-neo-black rounded-xl flex items-center justify-center text-xl shadow-[2px_2px_0_var(--neo-black)] mb-4 pb-0.5">📂</div>
              <h3 className="font-syne font-bold text-[16px] text-neo-black mb-1.5">My Records</h3>
              <p className="font-dm text-[13px] text-min-grey leading-[1.5]">View, upload, and securely share your medical history.</p>
            </div>
            
            <div className="bg-white/50 backdrop-blur-sm border-[1.5px] border-white/70 rounded-[20px] p-6 shadow-step transition-all hover:-translate-y-1 hover:shadow-clay cursor-none">
              <div className="w-10 h-10 bg-clay-peach border-[2px] border-neo-black rounded-xl flex items-center justify-center text-xl shadow-[2px_2px_0_var(--neo-black)] mb-4 pb-0.5">💬</div>
              <h3 className="font-syne font-bold text-[16px] text-neo-black mb-1.5">AI Insights</h3>
              <p className="font-dm text-[13px] text-min-grey leading-[1.5]">Review past triage reports and recommendations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
