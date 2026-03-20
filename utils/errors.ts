import { getApiErrorMessage, isApiError } from "@/services/api-client";

export function getErrorTitle(error: unknown) {
  if (isApiError(error)) {
    if (error.statusCode === 401) {
      return "Sessao expirada";
    }

    if (error.statusCode === 403) {
      return "Acesso negado";
    }

    if (error.statusCode === 400) {
      return "Dados invalidos";
    }
  }

  return "Erro";
}

export function getErrorMessage(error: unknown) {
  return getApiErrorMessage(error);
}
