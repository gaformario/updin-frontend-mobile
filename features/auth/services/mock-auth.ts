import type { Adolescente, Responsavel, Usuario } from "@/types/entities";

import {
  mockAdolescentesAssociados,
  mockResponsavelAccount,
  mockResponsavelCredentials,
  mockResponsavelUsuario,
  mockUsuariosAdolescentes,
} from "@/services/mock-responsavel";

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

export const mockCredentials = {
  adolescente: {
    usuario: mockUsuariosAdolescentes[0].usuario,
    senha: "ado123",
  },
  responsavel: mockResponsavelCredentials,
} as const;

export const mockAccounts: MockAccounts = {
  responsavel: mockResponsavelAccount,
  adolescente: {
    tipo: "adolescente",
    senha: mockCredentials.adolescente.senha,
    usuario: mockUsuariosAdolescentes[0],
    perfil: mockAdolescentesAssociados[0],
  },
};

export { mockResponsavelAccount, mockResponsavelCredentials, mockResponsavelUsuario };

export function normalizeCpf(value: string) {
  return value.replace(/\D/g, "");
}

export function isValidEmail(value: string) {
  return /\S+@\S+\.\S+/.test(value);
}

export function isValidCpf(value: string) {
  return normalizeCpf(value).length === 11;
}
