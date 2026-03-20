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
  adolescente: MockAdolescenteAccount[];
};

export const mockCredentials = {
  adolescente: [
    {
      usuario: mockUsuariosAdolescentes[0].usuario,
      senha: mockUsuariosAdolescentes[0].senhaHash,
    },
    {
      usuario: mockUsuariosAdolescentes[1].usuario,
      senha: mockUsuariosAdolescentes[1].senhaHash,
    },
  ],
  responsavel: mockResponsavelCredentials,
} as const;

export const mockAccounts: MockAccounts = {
  responsavel: mockResponsavelAccount,
  adolescente: mockUsuariosAdolescentes.map((usuario, index) => ({
    tipo: "adolescente" as const,
    senha: mockCredentials.adolescente[index]?.senha ?? "ado123",
    usuario,
    perfil: mockAdolescentesAssociados[index],
  })),
};

export {
  mockResponsavelAccount,
  mockResponsavelCredentials,
  mockResponsavelUsuario,
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
