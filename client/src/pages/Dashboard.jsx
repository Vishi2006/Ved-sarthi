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
    <div className="min-h-[calc(100vh-80px)] p-4 md:p-8 flex justify-center">
      <div className="w-full max-w-6xl bg-[#F5EFE0] rounded-[32px] md:rounded-[48px] border-[4px] md:border-[8px] border-neo-black shadow-[8px_8px_0_rgba(0,0,0,0.2)] md:shadow-[12px_12px_0_rgba(0,0,0,0.2)] overflow-hidden relative flex flex-col md:flex-row anim-fade-up">

        {/* Dashboard Sidebar / Header */}
        <div className="bg-neo-black text-neo-white pt-10 pb-6 px-6 md:px-10 md:w-[340px] shrink-0 relative flex flex-col justify-between">
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-neo-yellow/20 rounded-full blur-xl pointer-events-none md:-top-10 md:-left-10 md:w-64 md:h-64"></div>

          <div>
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div>
                <p className="font-space font-bold text-[10px] uppercase tracking-[1px] text-white/60 mb-1">
                  // Patient Dashboard
                </p>
                <h1 className="font-syne font-extrabold text-3xl tracking-[-1px] max-w-[200px]">
                  Hi, {user?.name?.split(' ')[0] || "User"}
                </h1>
              </div>
              <button
                onClick={logout}
                className="w-10 h-10 bg-neo-yellow rounded-full border-2 border-neo-black flex items-center justify-center text-neo-black shadow-[2px_2px_0_var(--neo-black)] font-syne font-bold text-[18px] transition-transform hover:-translate-y-0.5"
                aria-label="Logout"
              >
                <div className="flex items-center justify-center text-[14px]">🚪</div>
              </button>
            </div>

            {/* Quick Stats Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 relative z-10 mb-6 md:mb-0">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="font-dm text-[12px] text-white/70 mb-1">Upcoming</div>
                  <div className="font-syne font-bold text-[18px]">No Appts</div>
                </div>
                <div className="w-px bg-white/20"></div>
                <div className="flex-1">
                  <div className="font-dm text-[12px] text-white/70 mb-1">Recent AI</div>
                  <div className="font-syne font-bold text-[18px] text-neo-yellow">Analysis Ready</div>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:block relative z-10 mt-auto">
            <div className="p-5 bg-white/5 rounded-[20px] border border-white/10">
              <div className="font-syne font-bold text-[15px] mb-2 text-neo-yellow">Need help?</div>
              <div className="font-dm text-[13px] text-white/60 mb-4">Support is active 24/7 for premium members.</div>
              <button className="w-full bg-white text-neo-black font-syne font-bold text-[13px] py-2.5 rounded-xl transition-transform hover:-translate-y-0.5">Contact Support</button>
            </div>
          </div>
        </div>

        {/* Scrollable Main Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8 md:p-10 bg-white/40">
          <div className="font-space font-bold text-[13px] uppercase text-neo-black mb-5 flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-neo-red"></div>
            Quick Actions
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <button className="bg-clay-sky border-[2.5px] border-neo-black rounded-[24px] p-5 text-left shadow-[4px_4px_0_var(--neo-black)] transition-transform hover:-translate-y-1 group">
              <div className="w-12 h-12 bg-white/50 border-[1.5px] border-neo-black rounded-full flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">📄</div>
              <div className="font-syne font-bold text-[16px] text-neo-black mb-1">Upload</div>
              <div className="font-dm text-[12px] text-black/60">New Report</div>
            </button>
            <button className="bg-clay-peach border-[2.5px] border-neo-black rounded-[24px] p-5 text-left shadow-[4px_4px_0_var(--neo-black)] transition-transform hover:-translate-y-1 group">
              <div className="w-12 h-12 bg-white/50 border-[1.5px] border-neo-black rounded-full flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">🤖</div>
              <div className="font-syne font-bold text-[16px] text-neo-black mb-1">Triage</div>
              <div className="font-dm text-[12px] text-black/60">AI Insights</div>
            </button>
            <button className="bg-clay-sage border-[2.5px] border-neo-black rounded-[24px] p-5 text-left shadow-[4px_4px_0_var(--neo-black)] transition-transform hover:-translate-y-1 group">
              <div className="w-12 h-12 bg-white/50 border-[1.5px] border-neo-black rounded-full flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">👨‍⚕️</div>
              <div className="font-syne font-bold text-[16px] text-neo-black mb-1">Doctors</div>
              <div className="font-dm text-[12px] text-black/60">Find Specialists</div>
            </button>
            <button className="bg-clay-lemon border-[2.5px] border-neo-black rounded-[24px] p-5 text-left shadow-[4px_4px_0_var(--neo-black)] transition-transform hover:-translate-y-1 group">
              <div className="w-12 h-12 bg-white/50 border-[1.5px] border-neo-black rounded-full flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">📂</div>
              <div className="font-syne font-bold text-[16px] text-neo-black mb-1">Records</div>
              <div className="font-dm text-[12px] text-black/60">History</div>
            </button>
          </div>

          <div className="bg-white border-[2.5px] border-neo-black rounded-[28px] p-6 shadow-[5px_5px_0_rgba(0,0,0,0.1)]">
            <div className="font-syne font-bold text-[18px] text-neo-black mb-5 inline-flex items-center gap-2">
              Activity Log
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4 p-3 hover:bg-black/5 rounded-xl transition-colors">
                <div className="w-10 h-10 rounded-full bg-clay-sky/50 flex items-center justify-center text-sm border-[1.5px] border-neo-black shadow-[2px_2px_0_var(--neo-black)]">🩸</div>
                <div className="flex-1">
                  <div className="font-dm font-bold text-[15px] text-neo-black">CBC Report Uploaded</div>
                  <div className="font-dm text-[13px] text-[#666]">Processed by AI · 2 days ago</div>
                </div>
                <button className="font-space text-[11px] font-bold underline text-neo-black opacity-60 hover:opacity-100 hidden sm:block">View Report</button>
              </div>
              <div className="w-full h-px bg-black/5"></div>
              <div className="flex items-center gap-4 p-3 hover:bg-black/5 rounded-xl transition-colors opacity-70">
                <div className="w-10 h-10 rounded-full bg-clay-sage/50 flex items-center justify-center text-sm border-[1.5px] border-neo-black shadow-[2px_2px_0_var(--neo-black)]">🩺</div>
                <div className="flex-1">
                  <div className="font-dm font-bold text-[15px] text-neo-black">Account Created</div>
                  <div className="font-dm text-[13px] text-[#666]">Welcome to HealthBridge</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom App Navigation (Mobile Only) */}
        <div className="md:hidden bg-neo-black text-neo-white px-6 py-4 shrink-0 border-t border-white/10 flex justify-between items-center z-10 w-full mt-auto">
          <button className="flex flex-col items-center gap-1 opacity-100 transition-opacity">
            <div className="text-[20px]">🏠</div>
            <span className="font-space font-bold text-[10px] text-neo-yellow">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition-opacity relative">
            <div className="text-[20px]">📅</div>
            <span className="font-space font-bold text-[10px]">Appts</span>
            <div className="absolute top-0 right-0 w-2 h-2 bg-neo-red rounded-full"></div>
          </button>
          <button className="flex flex-col items-center gap-1 -mt-4 relative z-20">
            <div className="w-[56px] h-[56px] bg-neo-yellow border-[3px] border-neo-black rounded-full flex items-center justify-center shadow-[0_4px_0_var(--neo-black)] text-[24px] transition-transform hover:-translate-y-1">
              +
            </div>
          </button>
          <button className="flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
            <div className="text-[20px]">📁</div>
            <span className="font-space font-bold text-[10px]">Files</span>
          </button>
          <button className="flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition-opacity">
            <div className="text-[20px]">👤</div>
            <span className="font-space font-bold text-[10px]">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
