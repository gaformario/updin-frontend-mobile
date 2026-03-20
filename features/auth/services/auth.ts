import type { LoginPayload, LoginResponse } from "@/features/auth/types";

import {
  isValidCpf,
  isValidEmail,
  mockAccounts,
  normalizeCpf,
} from "./mock-auth";

function normalizeLogin(value: string) {
  return value.trim().toLowerCase();
}

export async function signInRequest(
  payload: LoginPayload,
): Promise<LoginResponse> {
  const { login, senha, tipo } = payload;
  const normalizedLogin = normalizeLogin(login);
  const normalizedPassword = senha.trim();

  if (!normalizedLogin || !normalizedPassword) {
    throw new Error("Preencha login e senha.");
  }

  if (tipo === "adolescente") {
    const adolescenteAccount = mockAccounts.adolescente.find(
      (candidate) => candidate.usuario.usuario.toLowerCase() === normalizedLogin,
    );

    if (isValidEmail(normalizedLogin) || isValidCpf(normalizedLogin)) {
      throw new Error("Adolescente deve acessar apenas com usuario e senha.");
    }

    if (!adolescenteAccount) {
      throw new Error("Usuario de adolescente nao encontrado.");
    }

    if (normalizedPassword !== adolescenteAccount.senha) {
      throw new Error("Senha invalida.");
    }

    return {
      token: `mock-token-${tipo}-${adolescenteAccount.perfil.id}`,
      usuario: adolescenteAccount.usuario,
      perfil: adolescenteAccount.perfil,
    };
  }

  const responsavelAccount = mockAccounts.responsavel;
  const cpf = normalizeCpf(normalizedLogin);
  const email = normalizedLogin;
  const matchesEmail = email === responsavelAccount.usuario.email?.toLowerCase();
  const matchesCpf = cpf === responsavelAccount.cpf;

  if (!matchesEmail && !matchesCpf) {
    throw new Error("Responsavel deve entrar com email ou CPF validos.");
  }

  if (normalizedPassword !== responsavelAccount.senha) {
    throw new Error("Senha invalida.");
  }

  return {
    token: `mock-token-${tipo}`,
    usuario: responsavelAccount.usuario,
    perfil: responsavelAccount.perfil,
  };
}
