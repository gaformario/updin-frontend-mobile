import type {
  Adolescente,
  Conta,
  Mesada,
  Missao,
  MissaoAtribuicao,
  Movimentacao,
  Quiz,
  QuizTentativa,
  RankingResponse,
  Responsavel,
  Usuario,
} from "@/types/entities";

export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}

export interface LoginRequest {
  login: string;
  senha: string;
}

export interface LoginPerfis {
  responsavelId?: string;
  adolescenteId?: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
  perfis: LoginPerfis;
}

export type AuthMeResponse = Usuario;
export type ResponsavelMeResponse = Responsavel;
export type ResponsavelAdolescentesResponse = Adolescente[];
export type AdolescenteResponse = Adolescente;
export type AdolescenteContaResponse = Conta;
export type AdolescenteMesadasResponse = Mesada[];
export type MesadaResponse = Mesada;
export type ContaResponse = Conta;
export type ContaMovimentacoesResponse = Movimentacao[];
export type MovimentacaoResponse = Movimentacao;
export type ResponsavelMissoesResponse = Missao[];
export type AdolescenteMissoesResponse = MissaoAtribuicao[];
export type MissaoAtribuicaoResponse = MissaoAtribuicao;
export type ResponsavelQuizzesResponse = Quiz[];
export type AdolescenteQuizzesResponse = Quiz[];
export type QuizResponse = Quiz;
export type QuizTentativaResponse = QuizTentativa;
export type RankingApiResponse = RankingResponse;

export interface RegisterResponsavelRequest {
  nome: string;
  usuario: string;
  email?: string;
  senha: string;
  cpf?: string;
  telefone?: string;
}

export interface CreateAdolescenteRequest {
  nome: string;
  usuario: string;
  email?: string;
  senha: string;
  dataNascimento: string;
  cpf?: string;
  telefone?: string;
}

export interface CreateMesadaRequest {
  valor: number;
  periodicidade: "semanal" | "quinzenal" | "mensal";
  descricao?: string;
  dataInicio?: string;
}

export interface UpdateMesadaRequest {
  valor?: number;
  periodicidade?: "semanal" | "quinzenal" | "mensal";
  ativa?: boolean;
  descricao?: string;
  dataInicio?: string;
}

export interface CreateMovimentacaoRequest {
  tipo: "credito" | "debito";
  origem: "mesada" | "ajuste_manual" | "gasto" | "recompensa";
  valor: number;
  descricao?: string;
}

export interface CreateMissaoRequest {
  titulo: string;
  descricao?: string;
  pontos: number;
  recompensaFinanceira?: number;
  ativa?: boolean;
}

export interface CreateMissaoAtribuicaoRequest {
  adolescenteId: string;
  dataLimite?: string;
  observacao?: string;
}

export interface ConcluirMissaoAtribuicaoRequest {
  observacao?: string;
}

export interface ValidarMissaoAtribuicaoRequest {
  observacao?: string;
}

export interface CreateQuizAlternativaRequest {
  texto: string;
  correta: boolean;
}

export interface CreateQuizPerguntaRequest {
  enunciado: string;
  ordem: number;
  alternativas: CreateQuizAlternativaRequest[];
}

export interface CreateQuizRequest {
  titulo: string;
  descricao?: string;
  perguntas: CreateQuizPerguntaRequest[];
}

export interface CreateQuizTentativaRequest {
  respostas: {
    perguntaId: string;
    alternativaId: string;
  }[];
}