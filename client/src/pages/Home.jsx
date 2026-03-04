import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

const Home = () => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [locationStatus, setLocationStatus] = useState("requesting"); // requesting | granted | denied | unavailable

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
      () => {
        setLocationStatus("denied");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const requireAuth = (mode = "login") => {
    if (isAuthenticated) return true;
    openAuthModal(mode);
    return false;
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-10 pt-8 lg:flex-row lg:items-start">
        <section className="flex-1 space-y-8">
          <header className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold uppercase tracking-wide text-teal-600">
                HealthAI
              </p>
              <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-600">
                Location:{" "}
                {locationStatus === "granted"
                  ? "enabled"
                  : locationStatus === "denied"
                    ? "blocked"
                    : locationStatus === "unavailable"
                      ? "not available"
                      : "requesting"}
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Your Health Journey,{" "}
              <span className="text-teal-600">Simplified</span>
            </h1>
            <p className="max-w-xl text-sm text-slate-600 sm:text-base">
              Manage your medical records and get personalized AI-driven health
              insights in one secure, private place. Your data, your health,
              your control.
            </p>
          </header>

          <div className="flex flex-wrap gap-4">
            <button
              className="rounded-lg bg-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-600"
              onClick={() => requireAuth("register")}
              type="button"
            >
              Upload Medical Records
            </button>
            <button
              className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              onClick={() => requireAuth("login")}
              type="button"
            >
              View History
            </button>
          </div>

          <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Project Overview
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              “Our Mission: Empowering you with AI-driven health management and
              secure record storage.”
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">
                  Secure Storage
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  HIPAA-compliant data encryption and private access.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">
                  AI Guidance
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  24/7 clinical support powered by AI, tailored to your health
                  profile.
                </p>
              </div>
            </div>
          </section>
        </section>

        <aside className="flex-1">
          <div className="mx-auto max-w-md rounded-3xl bg-white p-4 shadow-lg">
            <header className="mb-4 flex items-center justify-between rounded-2xl bg-teal-600 px-4 py-3 text-white">
              <div>
                <p className="text-sm font-semibold">Health Assistant</p>
                <p className="text-xs text-teal-100">AI Counselor Online</p>
              </div>
              <span className="h-8 w-8 rounded-full bg-teal-500/60" />
            </header>

            <div className="space-y-3 text-xs">
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl rounded-bl-sm bg-slate-100 px-3 py-2 text-slate-800">
                  Hello! I&apos;ve analyzed your latest medical reports. Your
                  vitamin D levels are slightly lower than the optimal range
                  (22ng/mL). Would you like some dietary recommendations or
                  supplement guidance?
                </div>
              </div>
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-teal-500 px-3 py-2 text-white">
                  Yes, please provide some natural sources and let me know if I
                  need specific supplements.
                </div>
              </div>
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl rounded-bl-sm bg-slate-100 px-3 py-2 text-slate-800">
                  Excellent. Natural sources include fatty fish (salmon,
                  mackerel), egg yolks, and fortified cereals. Based on your
                  profile, a daily supplement of 1000–2000 IU may be beneficial,
                  but please confirm with your physician.
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
              HealthAI Assistant provides information based on your data. Always
              consult a medical professional for clinical decisions or treatment.
            </div>

            <form className="mt-4 flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2">
              <input
                type="text"
                placeholder="Type your health question..."
                className="flex-1 cursor-not-allowed border-none bg-transparent text-xs text-slate-500 outline-none placeholder:text-slate-400"
                disabled
              />
              <button
                type="submit"
                className="inline-flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-full bg-slate-300 text-white shadow-sm"
                disabled
              >
                ▶
              </button>
            </form>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Home;
