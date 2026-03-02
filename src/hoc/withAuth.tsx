"use client";

import { ComponentType } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export function withAuth<P extends object>(Component: ComponentType<P>) {
  const AuthenticatedComponent = (props: P) => {
    return (
      <ProtectedRoute>
        <Component {...props} />
      </ProtectedRoute>
    );
  };

  return AuthenticatedComponent;
}
