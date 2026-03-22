import { api } from "@/services/api-client";
import {
  buildPainelFinanceiro,
  mapExtratoItem,
  mapMissaoValidadaNotificacao,
  mapMissaoValidacao,
} from "@/services/mappers";
import type {
  AdolescenteConquistasResponse,
  AdolescenteContaResponse,
  AdolescenteEstatisticasResponse,
  AdolescenteMesadasResponse,
  AdolescenteMissoesResponse,
  AdolescenteNotificacoesResponse,
  AdolescenteResponse,
  AdolescenteXpSemanalResponse,
  ContaMovimentacoesResponse,
  MissaoAtribuicaoResponse,
} from "@/types/api";
import type {
  AdolescenteConquistas,
  AdolescenteEstatisticas,
  AdolescenteXpSemanal,
} from "@/types/entities";
import type {
  AdolescentePainelFinanceiro,
  MissaoValidacao,
} from "@/types/painel-financeiro";

async function safeBuscarContaDoAdolescente(adolescenteId: string) {
  try {
    return await buscarContaDoAdolescente(adolescenteId);
  } catch {
    return null;
  }
}

async function listarMovimentacoesDaConta(contaId?: string | null) {
  if (!contaId) {
    return [];
  }

  return api.get<ContaMovimentacoesResponse>(`/contas/${contaId}/movimentacoes`);
}

export async function buscarAdolescentePorId(adolescenteId: string) {
  return api.get<AdolescenteResponse>(`/adolescentes/${adolescenteId}`);
}

export async function buscarContaDoAdolescente(adolescenteId: string) {
  return api.get<AdolescenteContaResponse>(`/adolescentes/${adolescenteId}/conta`);
}

export async function listarMesadasDoAdolescente(adolescenteId: string) {
  return api.get<AdolescenteMesadasResponse>(`/adolescentes/${adolescenteId}/mesadas`);
}

export async function listarMissoesDoAdolescente(adolescenteId: string) {
  return api.get<AdolescenteMissoesResponse>(`/adolescentes/${adolescenteId}/missoes`);
}

export async function buscarEstatisticasDoAdolescente(adolescenteId: string) {
  return api.get<AdolescenteEstatisticasResponse>(
    `/adolescentes/${adolescenteId}/estatisticas`,
  ) satisfies Promise<AdolescenteEstatisticas>;
}

export async function buscarConquistasDoAdolescente(adolescenteId: string) {
  return api.get<AdolescenteConquistasResponse>(
    `/adolescentes/${adolescenteId}/conquistas`,
  ) satisfies Promise<AdolescenteConquistas>;
}

export async function buscarXpSemanalDoAdolescente(adolescenteId: string) {
  return api.get<AdolescenteXpSemanalResponse>(
    `/adolescentes/${adolescenteId}/xp/semanal`,
  ) satisfies Promise<AdolescenteXpSemanal>;
}

export async function listarNotificacoesDoAdolescente(adolescenteId: string) {
  const notificacoes = await api.get<AdolescenteNotificacoesResponse>(
    `/adolescentes/${adolescenteId}/notificacoes`,
  );

  return notificacoes
    .filter((notificacao) => notificacao.tipo === "missao_validada")
    .sort(
      (left, right) =>
        new Date(right.criadoEm).getTime() - new Date(left.criadoEm).getTime(),
    )
    .map(mapMissaoValidadaNotificacao);
}

export async function buscarNotificacaoDoAdolescente(
  adolescenteId: string,
  notificacaoId: string,
) {
  const notificacoes = await listarNotificacoesDoAdolescente(adolescenteId);

  return (
    notificacoes.find((notificacao) => notificacao.id === notificacaoId) ?? null
  );
}

export async function buscarPainelFinanceiroDoAdolescente(adolescenteId: string) {
  const adolescente = await buscarAdolescentePorId(adolescenteId);
  const conta = adolescente.conta ?? (await safeBuscarContaDoAdolescente(adolescenteId));
  const [mesadas, atribuicoes, movimentacoes] = await Promise.all([
    listarMesadasDoAdolescente(adolescenteId),
    listarMissoesDoAdolescente(adolescenteId),
    listarMovimentacoesDaConta(conta?.id),
  ]);

  return buildPainelFinanceiro({
    adolescente,
    conta,
    mesadas,
    movimentacoes,
    atribuicoes,
  }) satisfies AdolescentePainelFinanceiro;
}

export async function listarExtratoDoAdolescente(adolescenteId: string) {
  const conta = await safeBuscarContaDoAdolescente(adolescenteId);
  const movimentacoes = await listarMovimentacoesDaConta(conta?.id);

  return movimentacoes
    .map(mapExtratoItem)
    .sort((left, right) => new Date(right.data).getTime() - new Date(left.data).getTime());
}

export async function buscarMissaoDoAdolescente(
  adolescenteId: string,
  atribuicaoId: string,
) {
  const atribuicao = await api.get<MissaoAtribuicaoResponse>(
    `/missoes/atribuicoes/${atribuicaoId}`,
  );

  if (atribuicao.adolescenteId !== adolescenteId) {
    return null;
  }

  return mapMissaoValidacao(atribuicao) satisfies MissaoValidacao;
}

export async function concluirMissaoDoAdolescente(
  atribuicaoId: string,
  observacao?: string,
) {
  return api.patch<MissaoAtribuicaoResponse>(
    `/missoes/atribuicoes/${atribuicaoId}/concluir`,
    observacao ? { observacao } : {},
  );
}
