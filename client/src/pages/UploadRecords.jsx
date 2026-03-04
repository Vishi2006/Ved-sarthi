import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

const UploadRecords = () => {
  const { token, isAuthenticated } = useAuth();
  const [chatHistory, setChatHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchChatHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        
        const res = await fetch(`${baseUrl}/api/ai/chat-history`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch history (${res.status})`);
        }

        const data = await res.json();
        setChatHistory(data);
      } catch (err) {
        console.error("Error fetching chat history:", err);
        setError(err.message || "Failed to load chat history");
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, [isAuthenticated, token]);

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Please log in to view your records</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 anim-fade-up">
      <div className="bg-white/40 backdrop-blur-[24px] saturate-200 border-2 border-white/80 rounded-[28px] p-8 shadow-clay-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[60%] bg-gradient-to-b from-white/50 to-transparent pointer-events-none rounded-t-[28px]"></div>

        <div className="relative z-10">
          <h1 className="font-syne font-extrabold text-3xl tracking-[-1px] text-neo-black mb-2">
            Your Medical Records
          </h1>
          <p className="font-dm text-[15px] text-[#555] leading-relaxed max-w-2xl mb-8">
            View all your uploaded medical reports and AI analysis history.
          </p>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block">
                <div className="animationLoading w-8 h-8 border-4 border-neo-yellow border-t-neo-black rounded-full"></div>
              </div>
              <p className="font-dm text-[14px] text-[#666] mt-4">Loading your records...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-100/80 border-[2px] border-red-500 rounded-xl text-red-700 font-dm text-[14px]">
              ❌ {error}
            </div>
          )}

          {!loading && !error && (
            <>
              {!chatHistory?.messages || chatHistory.messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📋</div>
                  <p className="font-dm text-[16px] text-[#555] mb-4">No records yet</p>
                  <p className="font-dm text-[14px] text-[#999] mb-6">
                    Upload your first medical report from the home page to get started!
                  </p>
                  <a 
                    href="/" 
                    className="inline-block font-syne font-bold text-[14px] bg-neo-black text-neo-white border-neo rounded-full px-6 py-3 shadow-neo hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-neo-lg transition-all"
                  >
                    Go to Home Page ↗
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatHistory.messages.map((message, index) => (
                    <div
                      key={index}
                      className={`p-5 rounded-[20px] border-[2px] transition-all ${
                        message.role === "user"
                          ? "bg-neo-black text-neo-white border-neo-black ml-8"
                          : "bg-white/70 text-neo-black border-white mr-8"
                      }`}
                    >
                      <div className={`font-space font-bold text-[10px] uppercase tracking-[1px] mb-2 ${
                        message.role === "user" ? "text-neo-yellow" : "text-[#666]"
                      }`}>
                        {message.role === "user" ? "📋 Your Upload" : "🤖 AI Analysis"}
                      </div>
                      <p className="font-dm text-[14px] leading-[1.6] whitespace-pre-wrap break-words max-h-[200px] overflow-y-auto">
                        {message.content}
                      </p>
                      <div className={`font-dm text-[11px] mt-3 opacity-60 ${
                        message.role === "user" ? "text-neo-white/60" : "text-[#999]"
                      }`}>
                        {new Date(message.at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animationLoading {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default UploadRecords;
