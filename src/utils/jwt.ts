import { jwtDecode } from "jwt-decode";
type JwtPayload = {
  sub: string;
  roles: string[];
  exp: number;
};

export function getJwtPayload(token: string): JwtPayload | null {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
}
