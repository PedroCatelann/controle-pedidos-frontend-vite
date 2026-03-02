import axios from "axios";
import * as environments from "../config/environments";
import { showAxiosError } from "@/utils/toast";

export const apiBackEnd = axios.create({
  baseURL: environments.APP_BACKEND,
});

// Estender o tipo de configuração do Axios para permitir skipToast
declare module "axios" {
  export interface InternalAxiosRequestConfig {
    skipToast?: boolean;
  }
}

// =====================
// REQUEST INTERCEPTOR
// =====================
apiBackEnd.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// =====================
// RESPONSE INTERCEPTOR
// =====================
apiBackEnd.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // evita loop infinito
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const username = localStorage.getItem("username");

        if (!refreshToken || !username) {
          throw new Error("Missing refresh data");
        }

        const response = await apiBackEnd.put(`/auth/refresh`, null, {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        });

        const newAccessToken = response.data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiBackEnd(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    // Exibir toast apenas para erros críticos ou se não foi configurado para pular
    // Não exibir para 401 (já tratado acima) ou se skipToast estiver true
    if (
      !originalRequest.skipToast &&
      error.response?.status !== 401 &&
      error.response?.status !== 403
    ) {
      // Para erros críticos (500, 503, etc), sempre mostrar
      if (error.response?.status && error.response.status >= 500) {
        showAxiosError(error);
      }
    }

    return Promise.reject(error);
  }
);
