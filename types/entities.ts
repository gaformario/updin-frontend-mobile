export type UserType = "responsavel" | "adolescente";
export type Periodicidade = "semanal" | "quinzenal" | "mensal";
export type TipoMovimentacao = "credito" | "debito";
export type OrigemMovimentacao =
  | "mesada"
  | "ajuste_manual"
  | "gasto"
  | "recompensa";
export type MissaoAtribuicaoStatus = "pendente" | "concluida" | "validada";
export type RankingEscopo = "global" | "responsavel";

export interface BaseEntity {
  criadoEm: string;
  atualizadoEm?: string;
}

export interface Usuario extends BaseEntity {
  id: string;
  nome: string;
  usuario: string;
  email: string | null;
  tipo: UserType;
  ativo: boolean;
  atualizadoEm: string;
}

export interface Responsavel extends BaseEntity {
  id: string;
  usuarioId: string;
  cpf: string | null;
  telefone: string | null;
  atualizadoEm: string;
  usuario?: Usuario;
}

export interface Adolescente extends BaseEntity {
  id: string;
  usuarioId: string;
  responsavelId: string;
  cpf: string | null;
  dataNascimento: string;
  telefone: string | null;
  atualizadoEm: string;
  usuario?: Usuario;
  conta?: Conta;
}

export interface Conta extends BaseEntity {
  id: string;
  adolescenteId: string;
  saldoTotal: string;
  atualizadoEm: string;
  movimentacoes?: Movimentacao[];
}

export interface Mesada extends BaseEntity {
  id: string;
  adolescenteId: string;
  responsavelId: string;
  valor: string;
  periodicidade: Periodicidade;
  descricao: string | null;
  dataInicio: string;
  ativa: boolean;
  atualizadoEm: string;
}

export interface Movimentacao {
  id: string;
  contaId: string;
  tipo: TipoMovimentacao;
  origem: OrigemMovimentacao;
  valor: string;
  descricao: string | null;
  saldoApos: string;
  criadoEm: string;
}

export interface Missao extends BaseEntity {
  id: string;
  responsavelId: string;
  titulo: string;
  descricao: string | null;
  pontos: number;
  recompensaFinanceira: string | null;
  ativa: boolean;
  atualizadoEm: string;
}

export interface MissaoAtribuicao extends BaseEntity {
  id: string;
  missaoId: string;
  adolescenteId: string;
  status: MissaoAtribuicaoStatus;
  dataLimite: string | null;
  concluidaEm: string | null;
  validadaEm: string | null;
  observacao: string | null;
  validadaPorResponsavelId: string | null;
  atualizadoEm: string;
  missao?: Missao;
}

export interface Quiz extends BaseEntity {
  id: string;
  responsavelId: string;
  titulo: string;
  descricao: string | null;
  ativo: boolean;
  atualizadoEm: string;
  perguntas?: QuizPergunta[];
}

export interface QuizPergunta {
  id: string;
  quizId: string;
  enunciado: string;
  ordem: number;
  alternativas: QuizAlternativa[];
}

export interface QuizAlternativa {
  id: string;
  perguntaId: string;
  texto: string;
  correta?: boolean;
}

export interface QuizTentativa {
  id: string;
  quizId: string;
  adolescenteId: string;
  pontuacao: number;
  acertos: number;
  totalPerguntas: number;
  finalizadoEm: string;
  respostas?: QuizResposta[];
}

export interface QuizResposta {
  id: string;
  tentativaId: string;
  perguntaId: string;
  alternativaId: string;
  correta: boolean;
}

export interface RankingItem {
  posicao: number;
  adolescenteId: string;
  nome: string;
  usuario: string;
  pontuacaoTotal: number;
  eventosPontuados: number;
}

export interface RankingResponse {
  escopo: RankingEscopo;
  totalParticipantes: number;
  ranking: RankingItem[];
}
