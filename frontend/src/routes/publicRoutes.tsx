import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function PublicRoute() {
  const { user, loading } = useAuthStore();

  if (loading) {
    return <div>Loading...</div>;
  }

  // 👇 If already logged in → redirect
  if (user) {
    return <Navigate to="/user/" replace />;
  }

  return <Outlet />;
}