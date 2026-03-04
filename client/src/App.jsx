import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";

const App = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <AppRoutes />
      <AuthModal />
    </div>
  );
};

export default App;
