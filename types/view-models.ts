export type QuizStatus = "novo" | "em_progresso" | "concluido";
export type RankingPeriod = "semanal" | "mensal" | "geral";
export type RankingMovement = "up" | "same" | "down";

export interface AdolescenteQuizResumo {
  id: string;
  titulo: string;
  categoria: string;
  questoes: number;
  dificuldade: 1 | 2 | 3;
  status: QuizStatus;
  acao: string;
}

export interface QuizzesResumo {
  concluidos: number;
  pontosXp: number;
  acertosPercentual: number;
}

export interface RankingListaItem {
  id: string;
  nome: string;
  pontos: number;
  posicao: number;
  isCurrentUser?: boolean;
  movimento?: RankingMovement;
}

export interface AdolescenteProfileResumo {
  nome: string;
  usuario: string;
  totalMissoes: number;
  totalQuizzes: number;
  totalConquistas: number;
  pontosXp: number;
}
