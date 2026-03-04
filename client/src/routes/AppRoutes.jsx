import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Appointment from "../pages/Appointment";
import Dashboard from "../pages/Dashboard";
import UploadRecords from "../pages/UploadRecords";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/appointments" element={<Appointment />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/upload-records" element={<UploadRecords />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

