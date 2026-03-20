import { api } from "@/services/api-client";
import {
  buildPainelFinanceiro,
  buildProfileResumo,
  mapExtratoItem,
  mapMissaoValidacao,
} from "@/services/mappers";
import type {
  AdolescenteContaResponse,
  AdolescenteMesadasResponse,
  AdolescenteMissoesResponse,
  AdolescenteQuizzesResponse,
  AdolescenteResponse,
  ContaMovimentacoesResponse,
  MissaoAtribuicaoResponse,
} from "@/types/api";
import type { Quiz, Usuario } from "@/types/entities";
import type {
  AdolescentePainelFinanceiro,
  MissaoValidacao,
} from "@/types/painel-financeiro";
import type { AdolescenteProfileResumo, RankingListaItem } from "@/types/view-models";

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

export async function listarQuizzesDoAdolescente(adolescenteId: string) {
  const quizzes = await api.get<AdolescenteQuizzesResponse>(
    `/adolescentes/${adolescenteId}/quizzes`,
  );

  const quizzesDetalhados = await Promise.all(
    quizzes.map(async (quiz) => {
      if (quiz.perguntas?.length) {
        return quiz;
      }

      return api.get<Quiz>(`/quizzes/${quiz.id}`);
    }),
  );

  return quizzesDetalhados;
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

export async function buscarResumoPerfilDoAdolescente(params: {
  adolescenteId: string;
  usuario: Usuario;
  ranking: RankingListaItem[];
}) {
  const { adolescenteId, usuario, ranking } = params;
  const [quizzes, atribuicoes] = await Promise.all([
    listarQuizzesDoAdolescente(adolescenteId),
    listarMissoesDoAdolescente(adolescenteId),
  ]);

  return buildProfileResumo({
    usuario,
    quizzes,
    atribuicoes,
    ranking,
  }) satisfies AdolescenteProfileResumo;
}