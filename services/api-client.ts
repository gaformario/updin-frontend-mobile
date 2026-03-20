import type { ApiErrorResponse } from "@/types/api";

const CONNECTION_ERROR_MESSAGE = "Não foi possível conectar com a API Updin.";

let authToken: string | null = null;
const unauthorizedListeners = new Set<() => void>();

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly details?: ApiErrorResponse | null,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = Omit<RequestInit, "body" | "headers"> & {
  body?: unknown;
  headers?: HeadersInit;
  skipUnauthorizedHandler?: boolean;
};

function getBaseUrl() {
  return process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
}

function buildUrl(path: string) {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const baseUrl = getBaseUrl();

  if (!baseUrl) {
    throw new Error(
      "EXPO_PUBLIC_API_URL não está definida. Configure a URL da API no arquivo .env.",
    );
  }

  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

async function parseResponseBody(response: Response) {
  const rawBody = await response.text();

  if (!rawBody) {
    return null;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return JSON.parse(rawBody) as unknown;
  }

  return rawBody;
}

function normalizeErrorMessage(
  payload: unknown,
  fallbackMessage: string,
  statusCode?: number,
) {
  if (payload && typeof payload === "object" && "message" in payload) {
    const message = (payload as ApiErrorResponse).message;

    if (Array.isArray(message)) {
      return message.join("\n");
    }

    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  if (statusCode === 401) {
    return "Sua sessao expirou. Entre novamente.";
  }

  if (statusCode === 403) {
    return "Voce nao tem permissao para acessar este recurso.";
  }

  if (statusCode === 400) {
    return "Revise os dados informados e tente novamente.";
  }

  return fallbackMessage;
}

function notifyUnauthorized() {
  unauthorizedListeners.forEach((listener) => listener());
}

export function setApiAuthToken(token: string | null) {
  authToken = token;
}

export function subscribeToUnauthorized(listener: () => void) {
  unauthorizedListeners.add(listener);

  return () => {
    unauthorizedListeners.delete(listener);
  };
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, headers, skipUnauthorizedHandler = false, ...rest } = options;
  const requestHeaders = new Headers(headers);

  requestHeaders.set("Accept", "application/json");

  if (authToken) {
    requestHeaders.set("Authorization", `Bearer ${authToken}`);
  }

  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  if (body !== undefined && !isFormData) {
    requestHeaders.set("Content-Type", "application/json");
  }

  try {
    const response = await fetch(buildUrl(path), {
      ...rest,
      headers: requestHeaders,
      body:
        body === undefined
          ? undefined
          : isFormData
            ? (body as FormData)
            : JSON.stringify(body),
    });

    const parsedBody = await parseResponseBody(response);

    if (!response.ok) {
      const errorMessage = normalizeErrorMessage(
        parsedBody,
        "Nao foi possivel concluir a requisicao.",
        response.status,
      );

      if (response.status === 401 && !skipUnauthorizedHandler) {
        notifyUnauthorized();
      }

      throw new ApiError(
        errorMessage,
        response.status,
        parsedBody as ApiErrorResponse | null,
      );
    }

    return parsedBody as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new Error(CONNECTION_ERROR_MESSAGE);
  }
}

export const api = {
  get<T>(path: string, options?: Omit<RequestOptions, "method" | "body">) {
    return apiRequest<T>(path, { ...options, method: "GET" });
  },
  post<T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ) {
    return apiRequest<T>(path, { ...options, method: "POST", body });
  },
  patch<T>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ) {
    return apiRequest<T>(path, { ...options, method: "PATCH", body });
  },
};

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isApiConnectionError(error: unknown) {
  return error instanceof Error && error.message === CONNECTION_ERROR_MESSAGE;
}

export function getApiErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return "Ocorreu um erro inesperado.";
}
