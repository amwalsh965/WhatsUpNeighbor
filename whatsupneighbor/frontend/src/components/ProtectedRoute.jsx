import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const isLoggedIn = useAuth();

  if (isLoggedIn === null) return <div>Loading...</div>;

  if (!isLoggedIn) return <Navigate to="/auth" replace />;

  return children;
}