import type {
  Adolescente,
  Conta,
  Mesada,
  MissaoAtribuicao,
  Movimentacao,
  OrigemMovimentacao,
  Quiz,
  QuizTentativa,
  RankingResponse,
} from "@/types/entities";
import type {
  AdolescentePainelFinanceiro,
  AdolescenteResumo,
  ExtratoItem,
  MissaoAtiva,
  MissaoValidacao,
} from "@/types/painel-financeiro";
import type {
  MissaoValidadaNotificacaoResumo,
  PublicQuizResumo,
  PublicQuizzesResumo,
  QuizStatus,
  QuizTentativaResumo,
  RankingListaItem,
  RankingTelaResumo,
} from "@/types/view-models";
import { parseDecimal } from "@/utils/decimal";

function getMovimentacaoTitulo(
  movimentacao: Movimentacao,
  origem: OrigemMovimentacao = movimentacao.origem,
) {
  if (
    (movimentacao.tipoRegistro === "missao" ||
      movimentacao.origemExibicao === "missao") &&
    movimentacao.missao?.titulo?.trim()
  ) {
    return movimentacao.missao.titulo;
  }

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

function getMovimentacaoCategoria(movimentacao: Movimentacao) {
  if (
    movimentacao.tipoRegistro === "missao" ||
    movimentacao.origemExibicao === "missao" ||
    movimentacao.origem === "recompensa"
  ) {
    return "missao" as const;
  }

  if (
    movimentacao.tipoRegistro === "mesada" ||
    movimentacao.origemExibicao === "mesada" ||
    movimentacao.origem === "mesada"
  ) {
    return "mesada" as const;
  }

  return "outro" as const;
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
    const rightDate = new Date(
      right.criadoEm ?? right.dataInicio ?? 0,
    ).getTime();

    return rightDate - leftDate;
  });
}

function buildSaldoPorOrigem(
  movimentacoes: Movimentacao[],
  saldoTotal: number,
) {
  const totais = movimentacoes.reduce(
    (accumulator, movimentacao) => {
      if (movimentacao.tipo !== "credito") {
        return accumulator;
      }

      const valor = parseDecimal(movimentacao.valor);
      const categoria = getMovimentacaoCategoria(movimentacao);

      if (categoria === "mesada") {
        accumulator.mesada += valor;
      }

      if (categoria === "missao") {
        accumulator.missoes += valor;
      }

      return accumulator;
    },
    { mesada: 0, missoes: 0 },
  );

  const totalConsiderado = totais.mesada + totais.missoes;

  if (saldoTotal <= 0 || totalConsiderado <= 0) {
    return {
      saldoMesada: 0,
      saldoMissoes: 0,
      percentualSaldoMesada: 0,
      percentualSaldoMissoes: 0,
    };
  }

  const percentualSaldoMesada = totais.mesada / totalConsiderado;
  const percentualSaldoMissoes = totais.missoes / totalConsiderado;

  return {
    saldoMesada: saldoTotal * percentualSaldoMesada,
    saldoMissoes: saldoTotal * percentualSaldoMissoes,
    percentualSaldoMesada,
    percentualSaldoMissoes,
  };
}

export function mapAdolescenteResumo(
  adolescente: Adolescente,
  conta?: Conta | null,
) {
  return {
    id: adolescente.id,
    nome: adolescente.usuario?.nome ?? "Adolescente",
    saldoTotal: parseDecimal(
      conta?.saldoTotal ?? adolescente.conta?.saldoTotal,
    ),
  } satisfies AdolescenteResumo;
}

export function mapExtratoItem(movimentacao: Movimentacao) {
  return {
    id: movimentacao.id,
    titulo: getMovimentacaoTitulo(movimentacao),
    data: movimentacao.criadoEm,
    valor: parseDecimal(movimentacao.valor),
    tipo: movimentacao.tipo,
    categoria: getMovimentacaoCategoria(movimentacao),
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
        ? "Aguardando validação"
        : status === "aprovada"
          ? "Aprovada"
          : "Pendente",
    recompensa,
    status,
    descricao: atribuicao.missao?.descricao ?? "",
    prazo: atribuicao.dataLimite,
    observacoesResponsavel:
      atribuicao.status === "pendente" ? observacao : undefined,
    comentarioAdolescente:
      atribuicao.status === "concluida" ? (observacao ?? "") : "",
    concluidaEm: atribuicao.concluidaEm ?? "",
    feedbackResponsavel:
      atribuicao.status === "validada" ? (observacao ?? "") : "",
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
  const saldoTotal = parseDecimal(
    conta?.saldoTotal ?? adolescente.conta?.saldoTotal,
  );
  const mesadaValor = parseDecimal(mesadaAtual?.valor);
  const extratoRecente = sortByLatest(movimentacoes)
    .slice(0, 3)
    .map(mapExtratoItem);
  const atribuicoesOrdenadas = sortByLatest(atribuicoes);
  const missoesAtivas = atribuicoesOrdenadas
    .filter((atribuicao) => atribuicao.status === "pendente")
    .map(mapMissaoValidacao);
  const missoesAguardandoValidacao = atribuicoesOrdenadas
    .filter((atribuicao) => atribuicao.status === "concluida")
    .map(mapMissaoValidacao);
  const saldoPorOrigem = buildSaldoPorOrigem(movimentacoes, saldoTotal);

  return {
    adolescenteId: adolescente.id,
    contaId: conta?.id ?? adolescente.conta?.id ?? null,
    responsavelId: adolescente.responsavelId,
    nome: adolescente.usuario?.nome ?? "Adolescente",
    saldoTotal,
    saldoMesada: saldoPorOrigem.saldoMesada,
    saldoMissoes: saldoPorOrigem.saldoMissoes,
    percentualSaldoMesada: saldoPorOrigem.percentualSaldoMesada,
    percentualSaldoMissoes: saldoPorOrigem.percentualSaldoMissoes,
    mesadaId: mesadaAtual?.id ?? null,
    mesadaValor,
    mesadaPeriodicidade: mesadaAtual?.periodicidade ?? null,
    mesadaAtiva: mesadaAtual?.ativa ?? false,
    mesadaFixa: mesadaValor * 0.8,
    variavel: mesadaValor * 0.2,
    extratoRecente,
    missoesAtivas,
    missoesAguardandoValidacao,
  } satisfies AdolescentePainelFinanceiro;
}

export function mapPublicQuizResumo(quiz: Quiz) {
  const quantidadePerguntas = quiz.perguntas?.length ?? 0;
  const dificuldade =
    quantidadePerguntas >= 8 ? 3 : quantidadePerguntas >= 5 ? 2 : 1;
  const descricaoCurta = quiz.descricao?.trim() || "Quiz disponível.";

  return {
    id: quiz.id,
    titulo: quiz.titulo,
    descricaoCurta,
    categoria: quiz.categoria,
    questoes: quantidadePerguntas,
    dificuldade,
    status: "novo",
    acao: "Jogar",
  } satisfies PublicQuizResumo;
}

export function buildPublicQuizzesResumo(params?: {
  concluidos?: number;
  pontosXp?: number;
  acertosPercentual?: number;
}) {
  const { concluidos = 0, pontosXp = 0, acertosPercentual = 0 } = params ?? {};
  return {
    concluidos,
    pontosXp,
    acertosPercentual,
  } satisfies PublicQuizzesResumo;
}

export function mapQuizTentativaResumo(tentativa: QuizTentativa) {
  const percentualAcertos =
    tentativa.totalPerguntas > 0
      ? Math.round((tentativa.acertos / tentativa.totalPerguntas) * 100)
      : 0;

  return {
    tentativaId: tentativa.id,
    pontuacao: tentativa.pontuacao,
    acertos: tentativa.acertos,
    totalPerguntas: tentativa.totalPerguntas,
    percentualAcertos,
    finalizadoEm: tentativa.finalizadoEm,
  } satisfies QuizTentativaResumo;
}

export function mapMissaoValidadaNotificacao(notificacao: {
  id: string;
  titulo: string;
  subtitulo: string;
  mensagem: string | null;
  criadoEm: string;
  lidaEm: string | null;
  dados?: {
    atribuicaoId?: string;
    missaoId?: string;
    missaoTitulo?: string;
    xpGanho?: number;
    valorCreditado?: string;
    saldoAnterior?: string;
    novoSaldo?: string;
    mensagemResponsavel?: string;
    validadaEm?: string;
  } | null;
}) {
  const valorCreditado = parseDecimal(notificacao.dados?.valorCreditado);
  const saldoAnterior = parseDecimal(notificacao.dados?.saldoAnterior);
  const novoSaldo = parseDecimal(notificacao.dados?.novoSaldo);
  const mensagem =
    notificacao.mensagem?.trim() ||
    notificacao.dados?.mensagemResponsavel?.trim() ||
    "Missão aprovada com sucesso!";

  return {
    id: notificacao.id,
    titulo: notificacao.titulo,
    subtitulo: notificacao.subtitulo,
    mensagem,
    missaoTitulo: notificacao.dados?.missaoTitulo?.trim() || "Missão aprovada",
    xpGanho: Math.max(notificacao.dados?.xpGanho ?? 0, 0),
    valorCreditado,
    saldoAnterior,
    novoSaldo,
    temCreditoFinanceiro: valorCreditado > 0,
    atribucaoId: notificacao.dados?.atribuicaoId,
    missaoId: notificacao.dados?.missaoId,
    validadaEm: notificacao.dados?.validadaEm || notificacao.criadoEm,
    criadoEm: notificacao.criadoEm,
    lidaEm: notificacao.lidaEm,
  } satisfies MissaoValidadaNotificacaoResumo;
}

export function getQuizActionLabel(status: QuizStatus) {
  if (status === "concluido") {
    return "Jogar Novamente";
  }

  if (status === "em_progresso") {
    return "Continuar";
  }

  return "Jogar";
}

function mapRankingItem(
  item: RankingResponse["classificacaoCompleta"][number],
  adolescenteId?: string,
) {
  return {
    id: item.adolescenteId,
    nome: item.nome,
    usuario: item.usuario,
    xp: item.xpTotal ?? item.pontuacaoTotal,
    posicao: item.posicao,
    isCurrentUser: item.adolescenteId === adolescenteId,
    movimento: "same",
  } satisfies RankingListaItem;
}

export function mapRankingTela(
  response: RankingResponse,
  adolescenteId?: string,
) {
  const classificacaoCompleta = response.classificacaoCompleta?.length
    ? response.classificacaoCompleta
    : (response.ranking ?? []);
  const top3 = response.top3?.length
    ? response.top3
    : classificacaoCompleta.slice(0, 3);

  return {
    escopo: response.escopo,
    criterio: response.criterio,
    periodo: response.periodo,
    totalParticipantes: response.totalParticipantes,
    top3: top3.map((item) => mapRankingItem(item, adolescenteId)),
    classificacaoCompleta: classificacaoCompleta.map((item) =>
      mapRankingItem(item, adolescenteId),
    ),
  } satisfies RankingTelaResumo;
}
