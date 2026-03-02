import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
  requiredRoles?: string[];
};

export function ProtectedRoute({ children, requiredRoles }: Props) {
  const { isAuthenticated, loading, roles } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    if (requiredRoles && !requiredRoles.some((role) => roles.includes(role))) {
      navigate("/403", { replace: true });
    }
  }, [loading, isAuthenticated, roles, requiredRoles, navigate]);

  if (loading) {
    return null; // ou spinner
  }

  if (requiredRoles && !requiredRoles.some((role) => roles.includes(role))) {
    return null;
  }

  return <>{children}</>;
}
