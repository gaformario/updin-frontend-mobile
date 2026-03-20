import type {
  Adolescente,
  Conta,
  Mesada,
  MissaoAtribuicao,
  Movimentacao,
  OrigemMovimentacao,
  Quiz,
  RankingResponse,
  Usuario,
} from "@/types/entities";
import type {
  AdolescentePainelFinanceiro,
  AdolescenteResumo,
  ExtratoItem,
  MissaoAtiva,
  MissaoValidacao,
} from "@/types/painel-financeiro";
import type {
  AdolescenteProfileResumo,
  AdolescenteQuizResumo,
  QuizzesResumo,
  RankingListaItem,
} from "@/types/view-models";
import { parseDecimal } from "@/utils/decimal";

function getMovimentacaoTitulo(
  movimentacao: Movimentacao,
  origem: OrigemMovimentacao = movimentacao.origem,
) {
  if (movimentacao.descricao?.trim()) {
    return movimentacao.descricao;
  }

  const labels: Record<OrigemMovimentacao, string> = {
    mesada: "Mesada",
    ajuste_manual: "Ajuste manual",
    gasto: "Gasto",
    recompensa: "Recompensa",
  };

  return labels[origem];
}

function mapStatus(status: MissaoAtribuicao["status"]): MissaoAtiva["status"] {
  if (status === "concluida") {
    return "aguardando_validacao";
  }

  if (status === "validada") {
    return "aprovada";
  }

  return "pendente";
}

function sortByLatest<T extends { criadoEm?: string; dataInicio?: string }>(
  items: T[],
) {
  return [...items].sort((left, right) => {
    const leftDate = new Date(left.criadoEm ?? left.dataInicio ?? 0).getTime();
    const rightDate = new Date(right.criadoEm ?? right.dataInicio ?? 0).getTime();

    return rightDate - leftDate;
  });
}

export function mapAdolescenteResumo(
  adolescente: Adolescente,
  conta?: Conta | null,
) {
  return {
    id: adolescente.id,
    nome: adolescente.usuario?.nome ?? "Adolescente",
    saldoTotal: parseDecimal(conta?.saldoTotal ?? adolescente.conta?.saldoTotal),
  } satisfies AdolescenteResumo;
}

export function mapExtratoItem(movimentacao: Movimentacao) {
  return {
    id: movimentacao.id,
    titulo: getMovimentacaoTitulo(movimentacao),
    data: movimentacao.criadoEm,
    valor: parseDecimal(movimentacao.valor),
    tipo: movimentacao.tipo,
  } satisfies ExtratoItem;
}

export function mapMissaoValidacao(atribuicao: MissaoAtribuicao) {
  const recompensa = parseDecimal(atribuicao.missao?.recompensaFinanceira);
  const status = mapStatus(atribuicao.status);
  const observacao = atribuicao.observacao ?? undefined;

  return {
    id: atribuicao.id,
    titulo: atribuicao.missao?.titulo ?? "Missao",
    subtitulo:
      status === "aguardando_validacao"
        ? "Aguardando validacao"
        : status === "aprovada"
          ? "Aprovada"
          : "Pendente",
    recompensa,
    status,
    descricao: atribuicao.missao?.descricao ?? "",
    prazo: atribuicao.dataLimite,
    observacoesResponsavel: atribuicao.status === "pendente" ? observacao : undefined,
    comentarioAdolescente: atribuicao.status === "concluida" ? observacao ?? "" : "",
    concluidaEm: atribuicao.concluidaEm ?? "",
    feedbackResponsavel: atribuicao.status === "validada" ? observacao ?? "" : "",
    evidencias: [],
  } satisfies MissaoValidacao;
}

export function buildPainelFinanceiro(params: {
  adolescente: Adolescente;
  conta?: Conta | null;
  mesadas: Mesada[];
  movimentacoes: Movimentacao[];
  atribuicoes: MissaoAtribuicao[];
}) {
  const { adolescente, conta, mesadas, movimentacoes, atribuicoes } = params;
  const orderedMesadas = sortByLatest(mesadas);
  const mesadaAtual =
    orderedMesadas.find((mesada) => mesada.ativa) ?? orderedMesadas[0] ?? null;
  const mesadaValor = parseDecimal(mesadaAtual?.valor);
  const extratoRecente = sortByLatest(movimentacoes).slice(0, 3).map(mapExtratoItem);
  const missoesAtivas = sortByLatest(atribuicoes).map(mapMissaoValidacao);

  return {
    adolescenteId: adolescente.id,
    contaId: conta?.id ?? adolescente.conta?.id ?? null,
    responsavelId: adolescente.responsavelId,
    nome: adolescente.usuario?.nome ?? "Adolescente",
    saldoTotal: parseDecimal(conta?.saldoTotal ?? adolescente.conta?.saldoTotal),
    mesadaId: mesadaAtual?.id ?? null,
    mesadaValor,
    mesadaPeriodicidade: mesadaAtual?.periodicidade ?? null,
    mesadaAtiva: mesadaAtual?.ativa ?? false,
    mesadaFixa: mesadaValor * 0.8,
    variavel: mesadaValor * 0.2,
    extratoRecente,
    missoesAtivas,
  } satisfies AdolescentePainelFinanceiro;
}

export function mapQuizResumo(quiz: Quiz) {
  const quantidadePerguntas = quiz.perguntas?.length ?? 0;
  const dificuldade = quantidadePerguntas >= 12 ? 3 : quantidadePerguntas >= 8 ? 2 : 1;

  return {
    id: quiz.id,
    titulo: quiz.titulo,
    categoria: quiz.descricao?.split(" ").slice(0, 2).join(" ") || "Educacao",
    questoes: quantidadePerguntas,
    dificuldade,
    status: "novo",
    acao: "Jogar",
  } satisfies AdolescenteQuizResumo;
}

export function buildQuizzesResumo(quizzes: Quiz[]) {
  const totalQuestoes = quizzes.reduce(
    (total, quiz) => total + (quiz.perguntas?.length ?? 0),
    0,
  );

  return {
    concluidos: 0,
    pontosXp: totalQuestoes * 10,
    acertosPercentual: 0,
  } satisfies QuizzesResumo;
}

export function mapRankingLista(
  response: RankingResponse,
  adolescenteId?: string,
) {
  return response.ranking.map((item) => ({
    id: item.adolescenteId,
    nome: item.nome,
    pontos: item.pontuacaoTotal,
    posicao: item.posicao,
    isCurrentUser: item.adolescenteId === adolescenteId,
    movimento: "same",
  })) satisfies RankingListaItem[];
}

export function buildProfileResumo(params: {
  usuario: Usuario;
  quizzes: Quiz[];
  atribuicoes: MissaoAtribuicao[];
  ranking: RankingListaItem[];
}) {
  const { usuario, quizzes, atribuicoes, ranking } = params;
  const rankingAtual = ranking.find((item) => item.isCurrentUser);

  return {
    nome: usuario.nome,
    usuario: usuario.usuario,
    totalMissoes: atribuicoes.length,
    totalQuizzes: quizzes.length,
    totalConquistas: atribuicoes.filter((item) => item.status === "validada").length,
    pontosXp: rankingAtual?.pontos ?? 0,
  } satisfies AdolescenteProfileResumo;
}