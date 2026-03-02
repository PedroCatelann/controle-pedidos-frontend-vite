import { createContext, useContext, useEffect, useState } from "react";
import { getJwtPayload } from "@/utils/jwt";

type AuthContextType = {
  accessToken: string | null;
  roles: string[];
  isAuthenticated: boolean;
  fullname: string | null;
  login: (token: string, refreshToken: string, fullname: string) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [fullname, setFullname] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const storedFullname = localStorage.getItem("fullname");
    if (token) {
      const payload = getJwtPayload(token);
      setAccessToken(token);
      setRoles(payload?.roles || []);
      setFullname(storedFullname);
    }
    setLoading(false);
  }, []);

  const login = (token: string, refreshToken: string, fullname: string) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("fullname", fullname);

    const payload = getJwtPayload(token);

    setAccessToken(token);
    setRoles(payload?.roles ?? []);
    setFullname(fullname);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("fullname");
    setAccessToken(null);
    setRoles([]);
    setFullname(null);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        roles,
        isAuthenticated: !!accessToken,
        fullname,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro do AuthProvider");
  }
  return context;
}
