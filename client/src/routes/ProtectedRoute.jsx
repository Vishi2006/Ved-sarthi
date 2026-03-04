import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, openAuthModal, isBootstrapping } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isBootstrapping && !isAuthenticated) openAuthModal("login");
  }, [isBootstrapping, isAuthenticated, openAuthModal]);

  if (isBootstrapping) return null;

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default ProtectedRoute;

