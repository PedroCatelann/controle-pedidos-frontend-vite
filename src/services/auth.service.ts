import { apiBackEnd } from "./api";

type LoginRequest = {
  username: string;
  password: string;
};

export type CreateUserRequest = {
  username: string;
  password: string;
  fullname: string;
  permission: "MANAGER" | "COMMON_USER";
};

export async function login(data: LoginRequest) {
  const response = await apiBackEnd.post("/auth/signin", data);
  return response.data.body;
}

export async function createUser(data: CreateUserRequest) {
  const response = await apiBackEnd.post("/auth/createUser", data);
  return response.data;
}
