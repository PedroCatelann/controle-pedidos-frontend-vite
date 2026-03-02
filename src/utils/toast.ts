import toast from "react-hot-toast";
import { AxiosError } from "axios";

/**
 * Exibe mensagem de erro
 */
export const showError = (message: string) => {
  toast.error(message, {
    position: "top-center"
  });
};

/**
 * Exibe mensagem de sucesso
 */
export const showSuccess = (message: string) => {
  toast.success(message, {
    position: "top-center"
  });
};

/**
 * Exibe mensagem de informação
 */
export const showInfo = (message: string) => {
  toast(message, {
    icon: "ℹ️",
    position: "top-center"
  });
};

/**
 * Exibe mensagem de loading
 */
export const showLoading = (message: string) => {
  return toast.loading(message, {
    position: "top-center"
  });
};

/**
 * Converte erro do axios em mensagem amigável
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.response?.data?.error;

    if (message) {
      return message;
    }

    switch (status) {
      case 400:
        return "Dados inválidos. Verifique as informações e tente novamente.";
      case 401:
        return "Não autorizado. Faça login novamente.";
      case 403:
        return "Acesso negado. Você não tem permissão para esta ação.";
      case 404:
        return "Recurso não encontrado.";
      case 500:
        return "Erro interno do servidor. Tente novamente mais tarde.";
      case 503:
        return "Serviço temporariamente indisponível. Tente novamente mais tarde.";
      default:
        return "Erro ao processar requisição. Tente novamente.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Erro desconhecido. Tente novamente.";
};

/**
 * Exibe erro do axios
 */
export const showAxiosError = (error: unknown) => {
  const message = getErrorMessage(error);
  showError(message);
};

