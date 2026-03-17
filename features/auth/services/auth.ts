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
  const account = mockAccounts[tipo];

  if (!normalizedLogin || !normalizedPassword) {
    throw new Error("Preencha login e senha.");
  }

  if (tipo === "adolescente") {
    if (isValidEmail(normalizedLogin) || isValidCpf(normalizedLogin)) {
      throw new Error("Adolescente deve acessar apenas com usuario e senha.");
    }

    if (normalizedLogin !== account.usuario.usuario.toLowerCase()) {
      throw new Error("Usuario de adolescente nao encontrado.");
    }
  }

  if (tipo === "responsavel") {
    const responsavelAccount = mockAccounts.responsavel;
    const cpf = normalizeCpf(normalizedLogin);
    const email = normalizedLogin;
    const matchesEmail =
      email === responsavelAccount.usuario.email?.toLowerCase();
    const matchesCpf = cpf === responsavelAccount.cpf;

    if (!matchesEmail && !matchesCpf) {
      throw new Error("Responsavel deve entrar com email ou CPF validos.");
    }
  }

  if (normalizedPassword !== account.senha) {
    throw new Error("Senha invalida.");
  }

  return {
    token: `mock-token-${tipo}`,
    usuario: account.usuario,
    perfil: account.perfil,
  };
}
