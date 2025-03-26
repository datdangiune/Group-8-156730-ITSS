import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "@/service/auth";

const ProtectedRoute: React.FC = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
