import { useEffect, useState, useRef } from "react";
import { useAuth } from "../hooks/useAuth";

const Home = () => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [locationStatus, setLocationStatus] = useState("requesting");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setLocationStatus("unavailable");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const payload = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp,
        };
        localStorage.setItem("healthmeet_location", JSON.stringify(payload));
        setLocationStatus("granted");
      },
      () => setLocationStatus("denied"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const requireAuth = (mode = "login") => {
    if (isAuthenticated) return true;
    openAuthModal(mode);
    return false;
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-8', 'translate-y-5');
        }
      });
    }, { threshold: 0.12 });
    
    document.querySelectorAll('.reveal, .feat-card, .tech-card, .how-card').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadMessage(null);
      setUploadError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadError("Please select a file to upload.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadMessage(null);

    const formData = new FormData();
    formData.append("report", file);

    try {
      const token = localStorage.getItem("healthmeet_token");
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      
      const headers = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const res = await fetch(`${baseUrl}/api/ai/upload-report`, {
        method: "POST",
        headers,
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Upload failed (${res.status})`);
      }

      if (isAuthenticated) {
        setUploadMessage("✅ Report uploaded and analyzed! Check 'My Records' to see your history.");
      } else {
        setUploadMessage("✅ Report analyzed successfully! Login to save it to your history.");
      }
      
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Upload error:", err);
      setUploadError(err.message || "An error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <section className="pt-[60px] pb-[80px] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-7">
          <div className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-md border-[2.5px] border-neo-black rounded-full py-2 pr-4 pl-2 w-max shadow-[3px_3px_0_var(--neo-black)] anim-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="w-7 h-7 bg-clay-sage border-[2px] border-neo-black rounded-full flex items-center justify-center text-[13px]">🇮🇳</div>
            <span className="font-space font-bold text-[11px] tracking-[0.5px] text-neo-black">Location : {locationStatus === 'granted' ? 'Enabled' : 'Blocked'}</span>
          </div>

          <h1 className="font-syne font-extrabold text-[clamp(44px,5vw,68px)] leading-[1.02] tracking-[-2px] text-neo-black anim-fade-up" style={{ animationDelay: '0.2s' }}>
            From report<br />to the <span className="inline-block bg-clay-sky border-[2.5px] border-neo-black rounded-xl px-3.5 py-0.5 shadow-[4px_4px_0_var(--neo-black)] relative -top-1 -rotate-[1.5deg]">right doctor</span><br />in <span className="inline-block bg-clay-lemon border-[2.5px] border-neo-black rounded-xl px-3.5 py-0.5 shadow-[4px_4px_0_var(--neo-black)] rotate-1">minutes</span>
          </h1>

          <p className="font-dm font-light text-[17px] text-[#444] leading-[1.6] max-w-[460px] anim-fade-up" style={{ animationDelay: '0.3s' }}>
            Upload your lab reports. Our AI triage reads them, asks a few smart questions, and connects you to the exact specialist you need — then handles the booking and payment automatically.
          </p>

          <div className="flex items-center gap-3 anim-fade-up" style={{ animationDelay: '0.4s' }}>
            <button 
              className="group relative overflow-hidden font-syne font-bold text-[15px] bg-neo-black text-neo-white border-[2.5px] border-neo-black rounded-full px-8 py-4 shadow-[5px_5px_0_var(--neo-black)] transition-all hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[8px_8px_0_var(--neo-black)] hover:text-neo-black cursor-none"
              onClick={() => requireAuth("register")}
            >
              <span className="relative z-10 transition-colors">Upload a Report →</span>
              <div className="absolute inset-0 bg-neo-yellow -translate-x-full transition-transform duration-300 ease-out group-hover:translate-x-0 z-0 rounded-full"></div>
            </button>
            <button 
              className="font-dm font-medium text-[14px] text-neo-black flex items-center gap-2 py-3.5 border-b-2 border-neo-black transition-[gap] duration-200 hover:gap-3.5 cursor-none"
              onClick={() => requireAuth("login")}
            >
              Watch Demo <span>↗</span>
            </button>
          </div>

          <div className="flex gap-6 anim-fade-up" style={{ animationDelay: '0.5s' }}>
            <div className="flex flex-col gap-0.5">
              <span className="font-syne font-extrabold text-[22px] text-neo-black">≥85%</span>
              <span className="font-space font-bold text-[11px] text-min-grey uppercase tracking-[0.5px]">OCR accuracy</span>
            </div>
            <div className="w-px bg-black/15"></div>
            <div className="flex flex-col gap-0.5">
              <span className="font-syne font-extrabold text-[22px] text-neo-black">&lt;30min</span>
              <span className="font-space font-bold text-[11px] text-min-grey uppercase tracking-[0.5px]">To confirmed slot</span>
            </div>
            <div className="w-px bg-black/15"></div>
            <div className="flex flex-col gap-0.5">
              <span className="font-syne font-extrabold text-[22px] text-neo-black">0</span>
              <span className="font-space font-bold text-[11px] text-min-grey uppercase tracking-[0.5px]">PHI leaks allowed</span>
            </div>
          </div>
        </div>

        <div className="anim-fade-up" style={{ animationDelay: '0.25s' }}>
          <div className="bg-white/45 backdrop-blur-[24px] border-2 border-white/80 rounded-[28px] p-7 shadow-clay-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[60%] bg-gradient-to-b from-white/50 to-transparent pointer-events-none rounded-t-[28px]"></div>
            
            <div className="relative z-10">
              <div className="font-space font-bold text-[10px] uppercase tracking-[1px] text-min-grey mb-4">
                // Report upload → triage → booking
              </div>

              <label 
                htmlFor="home-upload"
                className="group border-[2.5px] border-dashed border-black/25 rounded-[20px] p-8 text-center bg-white/30 transition-colors hover:border-neo-black hover:bg-white/50 mb-5 cursor-pointer block"
              >
                <div className="w-14 h-14 bg-clay-peach border-[2.5px] border-neo-black rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-[3px_3px_0_var(--neo-black)] group-hover:scale-110 transition-transform">📄</div>
                <div className="font-syne font-bold text-[15px] text-neo-black mb-1">
                  {file ? file.name : "Drop your medical report here"}
                </div>
                <div className="font-dm text-[12px] text-min-grey">or click to browse files</div>
                <div className="flex justify-center gap-2 mt-3">
                  <span className="font-space font-bold text-[10px] bg-clay-lemon border-[2px] border-neo-black rounded-md px-2 py-0.5 shadow-[2px_2px_0_var(--neo-black)] text-neo-black">PDF</span>
                  <span className="font-space font-bold text-[10px] bg-clay-lemon border-[2px] border-neo-black rounded-md px-2 py-0.5 shadow-[2px_2px_0_var(--neo-black)] text-neo-black">JPG</span>
                  <span className="font-space font-bold text-[10px] bg-clay-lemon border-[2px] border-neo-black rounded-md px-2 py-0.5 shadow-[2px_2px_0_var(--neo-black)] text-neo-black">PNG</span>
                </div>
                <input
                  id="home-upload"
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,image/png,image/jpeg,image/jpg"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>

              {uploadError && (
                <div className="mb-4 p-3 rounded-lg bg-red-100/80 border-[2px] border-red-500 text-red-700 font-dm text-[12px]">
                  ❌ {uploadError}
                </div>
              )}

              {uploadMessage && (
                <div className="mb-4 p-3 rounded-lg bg-green-100/80 border-[2px] border-green-500 text-green-700 font-dm text-[12px]">
                  {uploadMessage}
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={isUploading || !file}
                className={`w-full font-syne font-bold text-[13px] mb-5 py-3 rounded-lg border-[2px] border-neo-black uppercase tracking-[0.5px] transition-all
                  ${isUploading || !file
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-neo-yellow text-neo-black shadow-[3px_3px_0_var(--neo-black)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_var(--neo-black)]"
                  }
                `}
              >
                {isUploading ? "Uploading..." : file ? "Analyze Report" : "Select a File First"}
              </button>

              <div className="flex flex-col gap-2.5">
                {[
                  { num: 1, title: 'OCR Extraction', desc: 'Tesseract + Gemini Vision cleanup', color: 'bg-clay-peach' },
                  { num: 2, title: 'AI Triage Chat', desc: 'Max 4 questions, specialist output', color: 'bg-clay-sky' },
                  { num: 3, title: 'Telegram Booking', desc: 'Auto-negotiated with doctor via bot', color: 'bg-clay-sage' },
                  { num: 4, title: 'Razorpay Payment', desc: 'Pay & confirm. 10-15% commission split.', color: 'bg-clay-lemon' },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/50 backdrop-blur-sm border-[1.5px] border-white/70 rounded-[14px] px-4 py-3 shadow-step cursor-default">
                    <div className={`w-8 h-8 border-[2.5px] border-neo-black rounded-lg flex items-center justify-center font-syne font-extrabold text-[14px] text-neo-black shadow-[2px_2px_0_var(--neo-black)] shrink-0 ${step.color}`}>
                      {step.num}
                    </div>
                    <div className="flex-1">
                      <div className="font-syne font-bold text-[13px] text-neo-black mb-[1px]">{step.title}</div>
                      <div className="font-dm text-[11px] text-min-grey leading-[1.4]">{step.desc}</div>
                    </div>
                    <div className="text-[16px] text-min-grey">›</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-[80px]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 reveal opacity-0 translate-y-8 transition-all duration-700">
          <div className="mb-4 md:mb-0">
            <div className="inline-flex items-center gap-2 font-space font-bold text-[11px] uppercase tracking-[1.5px] text-neo-black mb-5">
              <div className="w-5 h-[2.5px] bg-neo-black"></div>
              Core Features
            </div>
            <h2 className="font-syne font-extrabold text-[clamp(36px,4vw,52px)] tracking-[-2px] text-neo-black leading-[1.05]">
              Everything you need.<br/>Nothing you don't.
            </h2>
          </div>
          <p className="font-dm font-light text-[14px] text-[#666] max-w-[260px] leading-[1.6]">
            Six tightly integrated modules. Each one production-grade and demo-ready.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: '🔬', title: 'Smart OCR Pipeline', desc: 'Tesseract with Sharp preprocessing — deskew, denoise, crop. Gemini cleans up what Tesseract misses. 85%+ usable text on standard Indian lab formats.', tag: 'Tesseract · Gemini Vision', color: 'bg-clay-sky' },
            { icon: '🧠', title: 'AI Triage Chat', desc: 'Gemini asks max 4 follow-up questions about your symptoms and report. Outputs a ranked specialist list and a patient briefing — never a diagnosis.', tag: 'Gemini 1.5 Flash', color: 'bg-clay-sage' },
            { icon: '🏥', title: 'Doctor Discovery', desc: 'Filter verified doctors by specialization and city. Pre-qualified patients with briefing attached — no cold walk-ins for doctors.', tag: 'Firestore · Location API', color: 'bg-clay-peach' },
            { icon: '🤖', title: 'Telegram Automation', desc: 'n8n workflow fires a Telegram message to the doctor with patient summary and slot options. 15-minute timeout. Auto-fallback to next doctor.', tag: 'n8n · Telegram Bot API', color: 'bg-neo-black text-neo-yellow', isNeo: true },
            { icon: '💳', title: 'Razorpay Payments', desc: 'Patient pays full consultation fee. Platform takes 10-15% commission — Zomato model. Idempotent webhook with Razorpay signature verification.', tag: 'Razorpay Route', color: 'bg-clay-lavender' },
            { icon: '🔐', title: 'Privacy by Design', desc: 'AES-256 encryption on PHI. Firebase security rules. Explicit consent before every upload and share. Audit logs for every event in the flow.', tag: 'Firebase · AES-256', color: 'bg-clay-coral' },
          ].map((f, i) => (
            <div key={i} className={`feat-card relative overflow-hidden p-7 transition-all duration-300 cursor-none opacity-0 translate-y-5 ${f.isNeo ? "bg-neo-black border-[2.5px] border-neo-black shadow-neo-lg hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0_rgba(0,0,0,0.3)] rounded-[20px]" : "bg-white/40 backdrop-blur-[20px] border-2 border-white/75 shadow-clay hover:-translate-y-1.5 hover:rotate-[0.5deg] hover:shadow-clay-lg rounded-3xl"}`} style={{ transitionDelay: `${0.05 + (i * 0.07)}s` }}>
              {!f.isNeo && <div className="absolute top-0 left-0 right-0 h-[50%] bg-gradient-to-b from-white/45 to-transparent pointer-events-none rounded-t-3xl"></div>}
              <div className={`w-[52px] h-[52px] border-[2.5px] rounded-[16px] flex items-center justify-center text-[22px] mb-5 shadow-[3px_3px_0_currentColor] relative z-10 ${f.isNeo ? 'border-neo-yellow text-neo-yellow bg-white/5' : `border-neo-black text-neo-black ${f.color}`}`}>
                {f.icon}
              </div>
              <div className={`font-syne font-bold text-[18px] mb-2 tracking-[-0.5px] relative z-10 ${f.isNeo ? 'text-neo-yellow' : 'text-neo-black'}`}>{f.title}</div>
              <div className={`font-dm text-[13.5px] leading-[1.6] relative z-10 ${f.isNeo ? 'text-white/70' : 'text-[#555]'}`}>{f.desc}</div>
              <div className={`inline-block mt-4 font-space font-bold text-[10px] uppercase tracking-[0.5px] rounded-full px-2.5 py-1 relative z-10 ${f.isNeo ? 'bg-white/10 border-[1.5px] border-white/20 text-white/60' : 'bg-black/5 border-[1.5px] border-black/15 text-[#555]'}`}>
                {f.tag}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TRIAGE DEMO */}
      <section className="py-[80px]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 items-center">
          <div className="flex flex-col gap-6 reveal opacity-0 translate-y-8 transition-all duration-700 text-left">
            <div className="inline-flex items-center gap-2 font-space font-bold text-[11px] uppercase tracking-[1.5px] text-neo-black mb-[-4px]">
              <div className="w-5 h-[2.5px] bg-neo-black"></div>
              AI Triage
            </div>
            <h2 className="font-syne font-extrabold text-[clamp(36px,4vw,52px)] tracking-[-2px] text-neo-black leading-[1.05]">
              Not a diagnosis.<br/>A direction.
            </h2>
            <p className="font-dm font-light text-[16px] text-[#444] leading-[1.7]">
              HealthBridge AI reads your report and asks targeted follow-up questions to understand your situation — then tells you which type of specialist to see. No guessing, no Googling symptoms at 2am.
            </p>
            <div className="flex flex-col gap-2.5 mt-2">
              {[
                { text: 'Strict system prompt: no diagnoses, no prescriptions, always recommend a licensed physician.', color: 'bg-clay-sage' },
                { text: 'Max 4 follow-up questions — respects patient time and reduces hallucination surface area.', color: 'bg-clay-sky' },
                { text: 'Outputs urgency flag: Routine / Urgent / Emergency — prompts immediate action if needed.', color: 'bg-clay-lemon' }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 font-dm text-[14px] text-[#444] leading-[1.5]">
                  <div className={`w-5 h-5 border-2 border-neo-black rounded-md shrink-0 mt-0.5 flex items-center justify-center text-[10px] text-neo-black ${item.color}`}>✓</div>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/40 backdrop-blur-[24px] saturate-200 border-2 border-white/80 rounded-[28px] overflow-hidden shadow-clay-lg reveal opacity-0 translate-y-8 transition-all duration-700 delay-100 relative">
             <div className="absolute top-0 left-0 right-0 h-[60%] bg-gradient-to-b from-white/30 to-transparent pointer-events-none rounded-t-[28px]"></div>
             <div className="relative z-10 w-full">
                <div className="bg-neo-black px-5 py-4 flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full border-[1.5px] border-white/30 bg-neo-red"></div>
                    <div className="w-2.5 h-2.5 rounded-full border-[1.5px] border-white/30 bg-neo-yellow"></div>
                    <div className="w-2.5 h-2.5 rounded-full border-[1.5px] border-white/30 bg-clay-sage"></div>
                  </div>
                  <span className="font-space font-bold text-[11px] text-white/70 ml-1">HealthBridge AI Triage</span>
                  <div className="ml-auto flex items-center gap-1.5 font-space text-[10px] text-clay-sage">
                    <div className="w-1.5 h-1.5 bg-clay-sage rounded-full anim-pulse"></div> Active Session
                  </div>
                </div>

                <div className="p-5 flex flex-col gap-3.5 h-[340px] overflow-y-auto">
                  <div className="flex gap-2.5 items-end">
                    <div className="w-[30px] h-[30px] rounded-[10px] border-2 border-neo-black flex items-center justify-center text-[13px] text-neo-black shrink-0 shadow-[2px_2px_0_var(--neo-black)] bg-clay-sky">🤖</div>
                    <div>
                      <div className="font-space font-bold text-[9px] text-min-grey mb-1 uppercase tracking-[0.5px]">HealthBridge AI</div>
                      <div className="max-w-[85%] px-4 py-3 text-[13px] leading-[1.5] border-[1.5px] border-black/10 shadow-msg bg-white/65 backdrop-blur-[10px] rounded-[4px_18px_18px_18px] text-neo-black">
                        I've read your CBC report. Your haemoglobin is 9.2 g/dL — below the normal range. How long have you been feeling fatigued or short of breath?
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-end flex-row-reverse">
                    <div className="w-[30px] h-[30px] rounded-[10px] border-2 border-neo-black flex items-center justify-center text-[13px] text-neo-black shrink-0 shadow-[2px_2px_0_var(--neo-black)] bg-clay-peach">👤</div>
                    <div className="max-w-[85%] px-4 py-3 text-[13px] leading-[1.5] border border-transparent shadow-neo bg-neo-black text-neo-white rounded-[18px_18px_4px_18px]">
                      About 3 weeks now. Also getting dizzy when I stand up quickly.
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-end">
                    <div className="w-[30px] h-[30px] rounded-[10px] border-2 border-neo-black flex items-center justify-center text-[13px] text-neo-black shrink-0 shadow-[2px_2px_0_var(--neo-black)] bg-clay-sky">🤖</div>
                    <div>
                      <div className="font-space font-bold text-[9px] text-min-grey mb-1 uppercase tracking-[0.5px]">HealthBridge AI · Triage Complete</div>
                      <div className="max-w-[85%] px-4 py-3 text-[13px] leading-[1.5] border-[1.5px] border-black/10 shadow-msg bg-white/65 backdrop-blur-[10px] rounded-[4px_18px_18px_18px] text-neo-black">
                        Based on your report and responses, I recommend seeing one of these specialists. Please consult a licensed physician.
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          <span className="font-syne font-bold text-[11px] text-neo-black bg-neo-yellow border-2 border-neo-black rounded-full px-3 py-1 shadow-[2px_2px_0_var(--neo-black)] cursor-none hover:-translate-y-[1px] hover:-translate-x-[1px] hover:shadow-[3px_3px_0_var(--neo-black)] transition-all">Haematologist</span>
                          <span className="font-syne font-bold text-[11px] text-neo-black bg-clay-sage border-2 border-neo-black rounded-full px-3 py-1 shadow-[2px_2px_0_var(--neo-black)] cursor-none hover:-translate-y-[1px] hover:-translate-x-[1px] hover:shadow-[3px_3px_0_var(--neo-black)] transition-all">Internal Medicine</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-4 border-t-2 border-black/10 flex gap-2.5 items-center bg-white/30 backdrop-blur-[8px]">
                  <input type="text" placeholder="Ask a follow-up question..." className="flex-1 bg-white/60 border-[1.5px] border-black/15 rounded-full px-4 py-2.5 font-dm text-[13px] text-neo-black outline-none placeholder:text-black/30 focus:border-neo-black focus:bg-white/80" disabled />
                  <button className="w-[38px] h-[38px] bg-neo-black text-neo-white border-[2.5px] border-neo-black rounded-xl flex items-center justify-center text-[16px] shadow-[2px_2px_0_rgba(0,0,0,0.3)] opacity-50 cursor-not-allowed">↑</button>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-[80px]">
        <div className="reveal opacity-0 translate-y-8 transition-all duration-700 text-center">
          <div className="inline-flex items-center gap-2 font-space font-bold text-[11px] uppercase tracking-[1.5px] text-neo-black mb-5">
            <div className="w-5 h-[2.5px] bg-neo-black"></div>
            The Flow
          </div>
          <h2 className="font-syne font-extrabold text-[clamp(36px,4vw,52px)] tracking-[-2px] text-neo-black leading-[1.05]">
            Four steps.<br/>Zero confusion.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12 relative">
          <div className="absolute top-[38px] left-[10%] right-[10%] h-[2.5px] z-0 hidden lg:block" style={{ backgroundImage: 'repeating-linear-gradient(to right, var(--neo-black) 0, var(--neo-black) 12px, transparent 12px, transparent 20px)' }}></div>
          
          {[
            { num: 1, title: 'Upload Report', desc: 'PDF or image. Encrypted and stored securely in Firebase Storage.', color: 'bg-clay-sky' },
            { num: 2, title: 'AI Reads + Triages', desc: 'OCR extracts text. Gemini asks 4 questions and suggests the right specialist.', color: 'bg-clay-peach' },
            { num: 3, title: 'Doctor Notified', desc: 'n8n sends a Telegram message to the matched doctor with your briefing and slot request.', color: 'bg-clay-sage' },
            { num: 4, title: 'Pay & Confirm', desc: 'Razorpay checkout. Booking confirmed. Doctor gets 85-90% of fee. You\'re done.', color: 'bg-clay-lemon' }
          ].map((item, i) => (
            <div key={i} className={`how-card bg-white/40 backdrop-blur-[16px] border-[2px] border-white/75 rounded-[22px] py-6 px-5 text-center shadow-clay relative z-10 cursor-none transition-transform duration-300 opacity-0 translate-y-5 ${i % 2 === 0 ? "hover:-translate-y-2 hover:-rotate-1" : "hover:-translate-y-2 hover:rotate-1"}`} style={{ transitionDelay: `${0.05 + (i * 0.07)}s` }}>
              <div className={`w-[52px] h-[52px] border-[2.5px] border-neo-black rounded-full flex items-center justify-center font-syne font-extrabold text-[20px] text-neo-black mx-auto mb-4 shadow-[3px_3px_0_var(--neo-black)] ${item.color}`}>{item.num}</div>
              <div className="font-syne font-bold text-[16px] text-neo-black mb-2">{item.title}</div>
              <div className="font-dm text-[12.5px] text-[#666] leading-[1.5]">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TECH STACK */}
      <section className="py-[80px]">
        <div className="reveal opacity-0 translate-y-8 transition-all duration-700 text-center">
          <div className="inline-flex items-center gap-2 font-space font-bold text-[11px] uppercase tracking-[1.5px] text-neo-black mb-5">
            <div className="w-5 h-[2.5px] bg-neo-black"></div>
            Tech Stack
          </div>
          <h2 className="font-syne font-extrabold text-[clamp(36px,4vw,52px)] tracking-[-2px] text-neo-black leading-[1.05]">
            Every choice<br/>is intentional.
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-12">
          {[
            { emoji: '⚡', name: 'Next.js 14', role: 'Frontend + API Routes', class: 'bg-clay-sky text-neo-black', rClass: 'text-black/55' },
            { emoji: '🔥', name: 'Firebase', role: 'Auth, Firestore, Storage', class: 'bg-clay-lemon text-neo-black', rClass: 'text-black/55' },
            { emoji: '🧠', name: 'Gemini', role: 'Triage AI + OCR cleanup', class: 'bg-clay-sage text-neo-black', rClass: 'text-black/55' },
            { emoji: '📝', name: 'Tesseract', role: 'OCR Engine + Sharp', class: 'bg-clay-peach text-neo-black', rClass: 'text-black/55' },
            { emoji: '🔄', name: 'n8n', role: 'Booking Automation', class: 'bg-clay-lavender text-neo-black', rClass: 'text-black/55' },
            { emoji: '📬', name: 'Telegram Bot', role: 'Doctor Messaging', class: 'bg-clay-coral text-neo-black', rClass: 'text-black/55' },
            { emoji: '💳', name: 'Razorpay', role: 'Payments + Commission', class: 'bg-neo-black text-neo-white', rClass: 'text-white/60' },
            { emoji: '🎨', name: 'Tailwind CSS', role: 'Vanilla CSS System', class: 'bg-neo-yellow text-neo-black', rClass: 'text-black/55' }
          ].map((t, i) => (
            <div key={i} className={`tech-card ${t.class} border-[2.5px] border-neo-black rounded-[18px] p-5 shadow-neo transition-all duration-200 hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-neo-lg cursor-none opacity-0 translate-y-5`} style={{ transitionDelay: `${0.05 + (i * 0.07)}s` }}>
              <span className="text-[28px] mb-2.5 block">{t.emoji}</span>
              <div className="font-syne font-extrabold text-[16px] mb-1">{t.name}</div>
              <div className={`font-dm text-[11.5px] ${t.rClass}`}>{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="py-[80px]">
        <div className="reveal opacity-0 translate-y-8 transition-all duration-700 text-center">
          <div className="inline-flex items-center gap-2 font-space font-bold text-[11px] uppercase tracking-[1.5px] text-neo-black mb-5">
            <div className="w-5 h-[2.5px] bg-neo-black"></div>
            Commission Model
          </div>
          <h2 className="font-syne font-extrabold text-[clamp(36px,4vw,52px)] tracking-[-2px] text-neo-black leading-[1.05]">
            Zomato model.<br/>For healthcare.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          <div className="bg-white/40 backdrop-blur-[20px] border-2 border-white/75 rounded-[28px] p-9 shadow-clay-lg relative overflow-hidden reveal opacity-0 translate-y-8 transition-all duration-700 delay-100">
            <div className="absolute top-0 left-0 right-0 h-[50%] bg-gradient-to-b from-white/40 to-transparent pointer-events-none rounded-t-[28px]"></div>
            <div className="relative z-10">
              <div className="font-space font-bold text-[10px] uppercase tracking-[1px] text-min-grey mb-3">// How the split works</div>
              <div className="font-syne font-extrabold text-[32px] tracking-[-1px] text-neo-black mb-1.5 leading-tight">10–15%<br/>Commission</div>
              <div className="font-dm text-[14px] text-[#666] mb-7">Patient pays full consultation fee. Platform retains commission. Doctor receives the rest — automatically logged on every booking.</div>

              <div className="flex flex-col gap-2.5">
                <div className="flex justify-between items-center p-3 px-4 bg-white/50 border-[1.5px] border-black/5 rounded-xl text-[14px] shadow-[2px_3px_0_rgba(0,0,0,0.05)]">
                  <span className="font-dm text-[#666]">Patient pays</span>
                  <span className="font-syne font-bold text-neo-black">₹ 1,000</span>
                </div>
                <div className="flex justify-between items-center p-3 px-4 bg-white/50 border-[1.5px] border-black/5 rounded-xl text-[14px] shadow-[2px_3px_0_rgba(0,0,0,0.05)]">
                  <span className="font-dm text-[#666]">Platform (12%)</span>
                  <span className="font-syne font-bold text-neo-red">−₹ 120</span>
                </div>
                <div className="flex justify-between items-center p-3 px-4 bg-white/70 border-[1.5px] border-black/20 rounded-xl text-[14px] shadow-[2px_3px_0_rgba(0,0,0,0.05)]">
                  <span className="font-dm font-bold text-neo-black">Doctor receives</span>
                  <span className="font-syne font-bold text-liquid-teal">₹ 880</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-neo-black border-[2.5px] border-neo-black rounded-[28px] p-9 shadow-neo-lg relative overflow-hidden reveal opacity-0 translate-y-8 transition-all duration-700 delay-200">
            <div className="relative z-10">
              <div className="font-space font-bold text-[10px] uppercase tracking-[1px] text-white/40 mb-3">// v1 → production path</div>
              <div className="font-syne font-extrabold text-[32px] tracking-[-1px] text-neo-yellow mb-1.5 leading-tight">Sandbox<br/>→ Live</div>
              <div className="font-dm text-[14px] text-white/60 mb-7">Portfolio builds in Razorpay test mode. Commission is simulated and recorded in Firestore. Production flips to Razorpay Route for real payouts.</div>

              <div className="flex flex-col gap-2.5">
                <div className="flex justify-between items-center p-3 px-4 bg-white/5 border-[1.5px] border-white/10 rounded-xl text-[14px]">
                  <span className="font-dm text-white/50">v1 (Portfolio)</span>
                  <span className="font-syne font-bold text-neo-white">Test simulated split</span>
                </div>
                <div className="flex justify-between items-center p-3 px-4 bg-white/5 border-[1.5px] border-white/10 rounded-xl text-[14px]">
                  <span className="font-dm text-white/50">v2 (Production)</span>
                  <span className="font-syne font-bold text-neo-white">Razorpay Route payouts</span>
                </div>
                <div className="flex justify-between items-center p-3 px-4 bg-white/5 border-[1.5px] border-white/10 rounded-xl text-[14px]">
                  <span className="font-dm text-white/50">Webhook security</span>
                  <span className="font-syne font-bold text-neo-yellow">Idempotent + Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-[60px] pb-[40px]">
        <div className="border-[2.5px] border-neo-black rounded-[28px] overflow-hidden shadow-neo-lg bg-neo-black">
          <div className="px-12 py-12 flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
            <div>
              <div className="font-syne font-extrabold text-[28px] text-neo-white tracking-[-1px] mb-1 text-center md:text-left">HealthBridge AI</div>
              <div className="font-space font-bold text-[11px] text-white/30 text-center md:text-left">// report → triage → specialist → booked</div>
            </div>
            <div className="text-center md:text-right">
              <div className="font-space text-[10px] text-white/30 uppercase tracking-[1px] mb-1.5">Built by</div>
              <div className="font-syne font-bold text-[16px] text-neo-yellow">Dishu & Vishi</div>
            </div>
          </div>
          <div className="bg-neo-yellow border-t-[2.5px] border-neo-black px-12 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="font-space font-bold text-[11px] text-neo-black">© 2026 HealthBridge AI · India</span>
            <div className="flex gap-5">
              <a href="#" className="font-space font-bold text-[11px] text-neo-black border-b-[2px] border-neo-black pb-0.5" onClick={(e) => e.preventDefault()}>Privacy</a>
              <a href="#" className="font-space font-bold text-[11px] text-neo-black border-b-[2px] border-neo-black pb-0.5" onClick={(e) => e.preventDefault()}>GitHub</a>
              <a href="#" className="font-space font-bold text-[11px] text-neo-black border-b-[2px] border-neo-black pb-0.5" onClick={(e) => e.preventDefault()}>Demo</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
