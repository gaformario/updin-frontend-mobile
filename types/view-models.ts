export type QuizStatus = "novo" | "em_progresso" | "concluido";
export type RankingScope = "global" | "familia";
export type RankingPeriod = "geral" | "semanal" | "mensal";
export type RankingMovement = "up" | "same" | "down";

export interface PublicQuizResumo {
  id: string;
  titulo: string;
  descricaoCurta: string;
  categoria: string;
  questoes: number;
  dificuldade: 1 | 2 | 3;
  status: QuizStatus;
  acao: string;
}

export interface PublicQuizzesResumo {
  concluidos: number;
  pontosXp: number;
  acertosPercentual: number;
}

export interface QuizTentativaResumo {
  tentativaId: string;
  pontuacao: number;
  acertos: number;
  totalPerguntas: number;
  percentualAcertos: number;
  finalizadoEm: string;
}

export interface RankingListaItem {
  id: string;
  nome: string;
  usuario: string;
  xp: number;
  posicao: number;
  isCurrentUser?: boolean;
  movimento?: RankingMovement;
}

export interface RankingTelaResumo {
  escopo: string;
  criterio: string;
  periodo: RankingPeriod;
  totalParticipantes: number;
  top3: RankingListaItem[];
  classificacaoCompleta: RankingListaItem[];
}

export interface MissaoValidadaNotificacaoResumo {
  id: string;
  titulo: string;
  subtitulo: string;
  mensagem: string;
  missaoTitulo: string;
  xpGanho: number;
  valorCreditado: number;
  saldoAnterior: number;
  novoSaldo: number;
  temCreditoFinanceiro: boolean;
  atribucaoId?: string;
  missaoId?: string;
  validadaEm: string;
  criadoEm: string;
  lidaEm: string | null;
}
