import type { Adolescente, Responsavel, Usuario } from "@/types/entities";
import type { AdolescenteResumo } from "@/types/painel-financeiro";

function nowIso() {
  return new Date().toISOString();
}

const baseTimestamp = nowIso();

export const mockResponsavelCredentials = {
  email: "resp@updin.com",
  cpf: "12345678900",
  senha: "r123",
} as const;

export const mockResponsavelUsuario: Usuario = {
  id: "user-resp-1",
  nome: "Gabriel Responsavel",
  usuario: "gabriel.responsavel",
  email: mockResponsavelCredentials.email,
  senhaHash: "",
  tipo: "responsavel",
  ativo: true,
  criadoEm: baseTimestamp,
  atualizadoEm: baseTimestamp,
};

export const mockResponsavelPerfil: Responsavel = {
  id: "resp-1",
  usuarioId: mockResponsavelUsuario.id,
  cpf: mockResponsavelCredentials.cpf,
  telefone: "11999999999",
  criadoEm: baseTimestamp,
  atualizadoEm: baseTimestamp,
};

export const mockAdolescentesResumo: AdolescenteResumo[] = [
  {
    id: "ado-1",
    nome: "Lucas Silva",
    saldoTotal: 250,
  },
  {
    id: "ado-2",
    nome: "Maria Silva",
    saldoTotal: 180.5,
  },
];

export const mockAdolescentesAssociados: Adolescente[] = [
  {
    id: "ado-1",
    usuarioId: "user-ado-1",
    responsavelId: mockResponsavelPerfil.id,
    cpf: "98765432100",
    telefone: "11988888888",
    dataNascimento: "2011-03-20",
    criadoEm: baseTimestamp,
    atualizadoEm: baseTimestamp,
  },
  {
    id: "ado-2",
    usuarioId: "user-ado-2",
    responsavelId: mockResponsavelPerfil.id,
    cpf: "98765432101",
    telefone: "11988888889",
    dataNascimento: "2012-08-11",
    criadoEm: baseTimestamp,
    atualizadoEm: baseTimestamp,
  },
];

export const mockUsuariosAdolescentes: Usuario[] = [
  {
    id: "user-ado-1",
    nome: "Joao Adolescente",
    usuario: "joao.adolescente",
    senhaHash: "",
    tipo: "adolescente",
    ativo: true,
    criadoEm: baseTimestamp,
    atualizadoEm: baseTimestamp,
  },
  {
    id: "user-ado-2",
    nome: "Maria Adolescente",
    usuario: "maria.adolescente",
    senhaHash: "",
    tipo: "adolescente",
    ativo: true,
    criadoEm: baseTimestamp,
    atualizadoEm: baseTimestamp,
  },
];

export const mockResponsavelAccount = {
  tipo: "responsavel" as const,
  senha: mockResponsavelCredentials.senha,
  cpf: mockResponsavelCredentials.cpf,
  usuario: mockResponsavelUsuario,
  perfil: mockResponsavelPerfil,
};
