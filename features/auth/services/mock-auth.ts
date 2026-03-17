import type { Adolescente, Responsavel, Usuario } from "@/types/entities";

type MockAccountBase = {
  senha: string;
  usuario: Usuario;
};

type MockResponsavelAccount = MockAccountBase & {
  tipo: "responsavel";
  cpf: string;
  perfil: Responsavel;
};

type MockAdolescenteAccount = MockAccountBase & {
  tipo: "adolescente";
  perfil: Adolescente;
};

export type MockAccount = MockResponsavelAccount | MockAdolescenteAccount;
export type MockAccounts = {
  responsavel: MockResponsavelAccount;
  adolescente: MockAdolescenteAccount;
};

function nowIso() {
  return new Date().toISOString();
}

const baseTimestamp = nowIso();

export const mockCredentials = {
  adolescente: {
    usuario: "joao.adolescente",
    senha: "ado123",
  },
  responsavel: {
    email: "responsavel@updin.com",
    cpf: "12345678900",
    senha: "resp123",
  },
} as const;

const responsavelUsuario: Usuario = {
  id: "user-resp-1",
  nome: "Gabriel Responsavel",
  usuario: "gabriel.responsavel",
  email: mockCredentials.responsavel.email,
  senhaHash: "",
  tipo: "responsavel",
  ativo: true,
  criadoEm: baseTimestamp,
  atualizadoEm: baseTimestamp,
};

const adolescenteUsuario: Usuario = {
  id: "user-ado-1",
  nome: "Joao Adolescente",
  usuario: mockCredentials.adolescente.usuario,
  senhaHash: "",
  tipo: "adolescente",
  ativo: true,
  criadoEm: baseTimestamp,
  atualizadoEm: baseTimestamp,
};

export const mockAccounts: MockAccounts = {
  responsavel: {
    tipo: "responsavel",
    senha: mockCredentials.responsavel.senha,
    cpf: mockCredentials.responsavel.cpf,
    usuario: responsavelUsuario,
    perfil: {
      id: "resp-1",
      usuarioId: responsavelUsuario.id,
      cpf: mockCredentials.responsavel.cpf,
      telefone: "11999999999",
      criadoEm: baseTimestamp,
      atualizadoEm: baseTimestamp,
    },
  },
  adolescente: {
    tipo: "adolescente",
    senha: mockCredentials.adolescente.senha,
    usuario: adolescenteUsuario,
    perfil: {
      id: "ado-1",
      usuarioId: adolescenteUsuario.id,
      responsavelId: "resp-1",
      cpf: "98765432100",
      telefone: "11988888888",
      dataNascimento: "2011-03-20",
      criadoEm: baseTimestamp,
      atualizadoEm: baseTimestamp,
    },
  },
};

export function normalizeCpf(value: string) {
  return value.replace(/\D/g, "");
}

export function isValidEmail(value: string) {
  return /\S+@\S+\.\S+/.test(value);
}

export function isValidCpf(value: string) {
  return normalizeCpf(value).length === 11;
}
