import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";

const App = () => {
  return (
    <div className="min-h-screen relative font-dm">
      {/* LIQUID BG BLOBS */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute rounded-full blur-[60px] opacity-25 anim-blob-float w-[500px] h-[500px] bg-clay-sky -top-[100px] -left-[100px]"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="absolute rounded-full blur-[60px] opacity-25 anim-blob-float w-[400px] h-[400px] bg-clay-lavender top-[40%] -right-[80px]"
          style={{ animationDelay: "-4s" }}
        ></div>
        <div
          className="absolute rounded-full blur-[60px] opacity-25 anim-blob-float w-[350px] h-[350px] bg-clay-sage -bottom-[80px] left-[30%]"
          style={{ animationDelay: "-8s" }}
        ></div>
        <div
          className="absolute rounded-full blur-[60px] opacity-25 anim-blob-float w-[280px] h-[280px] bg-clay-peach top-[60%] left-[10%]"
          style={{ animationDelay: "-2s" }}
        ></div>
      </div>

      {/* NOISE OVERLAY */}
      <div
        className="fixed inset-0 z-10 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px",
        }}
      ></div>

      <div className="relative z-20 flex flex-col items-center">
        <Navbar />
        <main className="w-full max-w-[1280px] px-10 mx-auto mt-[80px] mb-20 relative">
          <AppRoutes />
        </main>
        <AuthModal />
      </div>
    </div>
  );
};

export default App;
