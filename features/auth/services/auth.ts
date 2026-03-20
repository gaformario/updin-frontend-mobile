import { buscarAdolescentePorId } from "@/services/adolescente";
import {
  api,
  isApiConnectionError,
  setApiAuthToken,
} from "@/services/api-client";
import { buscarResponsavelMe } from "@/services/responsavel";
import type { AuthMeResponse, LoginResponse } from "@/types/api";

import type { AuthSession, LoginPayload } from "@/features/auth/types";

function getPerfilId(params: {
  usuarioTipo: LoginPayload["tipo"] | AuthMeResponse["tipo"];
  perfis?: LoginResponse["perfis"];
  previousSession?: Partial<AuthSession> | null;
}) {
  const { usuarioTipo, perfis, previousSession } = params;

  if (usuarioTipo === "responsavel") {
    return perfis?.responsavelId ?? previousSession?.perfis?.responsavelId ?? null;
  }

  return (
    perfis?.adolescenteId ??
    previousSession?.perfis?.adolescenteId ??
    previousSession?.perfil?.id ??
    null
  );
}

async function buildSession(params: {
  token: string;
  perfis: LoginResponse["perfis"];
  previousSession?: Partial<AuthSession> | null;
}) {
  const { token, perfis, previousSession } = params;

  setApiAuthToken(token);

  const usuario = await api.get<AuthMeResponse>("/auth/me");
  const perfilId = getPerfilId({
    usuarioTipo: usuario.tipo,
    perfis,
    previousSession,
  });

  if (usuario.tipo === "responsavel") {
    const perfil = await buscarResponsavelMe();

    return {
      token,
      usuario,
      perfis: {
        ...perfis,
        responsavelId: perfil.id,
      },
      perfil,
      adolescenteSelecionado: previousSession?.adolescenteSelecionado ?? null,
    } satisfies AuthSession;
  }

  if (!perfilId) {
    throw new Error("Nao foi possivel identificar o perfil do adolescente.");
  }

  const perfil = await buscarAdolescentePorId(perfilId);

  return {
    token,
    usuario,
    perfis: {
      ...perfis,
      adolescenteId: perfil.id,
    },
    perfil,
    adolescenteSelecionado: previousSession?.adolescenteSelecionado ?? null,
  } satisfies AuthSession;
}

export async function signInRequest(payload: LoginPayload) {
  const { login, senha } = payload;

  if (!login.trim() || !senha.trim()) {
    throw new Error("Preencha login e senha.");
  }

  const response = await api.post<LoginResponse>(
    "/auth/login",
    {
      login: login.trim(),
      senha: senha.trim(),
    },
    { skipUnauthorizedHandler: true },
  );

  return buildSession({
    token: response.token,
    perfis: response.perfis,
  });
}

export async function restoreSession(session: AuthSession) {
  try {
    return await buildSession({
      token: session.token,
      perfis: session.perfis,
      previousSession: session,
    });
  } catch (error) {
    if (isApiConnectionError(error)) {
      setApiAuthToken(session.token);
      return session;
    }

    throw error;
  }
}