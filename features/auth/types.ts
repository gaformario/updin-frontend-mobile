import type { LoginPerfis } from "@/types/api";
import type { Adolescente, Responsavel, UserType, Usuario } from "@/types/entities";
import type { AdolescenteResumo } from "@/types/painel-financeiro";

export interface LoginPayload {
  login: string;
  senha: string;
  tipo: UserType;
}

export interface AuthSession {
  token: string;
  usuario: Usuario;
  perfis: LoginPerfis;
  perfil: Responsavel | Adolescente;
  adolescenteSelecionado: AdolescenteResumo | null;
}