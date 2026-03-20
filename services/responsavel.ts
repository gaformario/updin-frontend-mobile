import { api } from "@/services/api-client";
import {
  buscarContaDoAdolescente,
  buscarPainelFinanceiroDoAdolescente,
  listarMesadasDoAdolescente,
} from "@/services/adolescente";
import { mapAdolescenteResumo, mapMissaoValidacao } from "@/services/mappers";
import type {
  CreateMesadaRequest,
  CreateMissaoAtribuicaoRequest,
  CreateMissaoRequest,
  MissaoAtribuicaoResponse,
  ResponsavelAdolescentesResponse,
  ResponsavelMeResponse,
} from "@/types/api";
import type { Mesada, Missao } from "@/types/entities";

function getMissionPointsFromReward(recompensa?: number) {
  if (!recompensa || recompensa <= 0) {
    return 10;
  }

  return Math.max(1, Math.round(recompensa));
}

function mapPeriodicidadeLabel(periodicidade: "Semanal" | "Quinzenal" | "Mensal") {
  if (periodicidade === "Quinzenal") {
    return "quinzenal";
  }

  if (periodicidade === "Mensal") {
    return "mensal";
  }

  return "semanal";
}

function findMesadaAtual(mesadas: Mesada[]) {
  return mesadas.find((mesada) => mesada.ativa) ?? mesadas[0] ?? null;
}

export async function buscarResponsavelMe() {
  return api.get<ResponsavelMeResponse>("/responsaveis/me");
}

export async function listarAdolescentesDoResponsavel() {
  const adolescentes = await api.get<ResponsavelAdolescentesResponse>(
    "/responsaveis/me/adolescentes",
  );

  const contas = await Promise.all(
    adolescentes.map(async (adolescente) => {
      const conta = adolescente.conta ?? (await buscarContaDoAdolescente(adolescente.id));
      return mapAdolescenteResumo(adolescente, conta);
    }),
  );

  return contas;
}

export { buscarPainelFinanceiroDoAdolescente };

export async function buscarMissaoParaValidacao(
  adolescenteId: string,
  missaoId: string,
) {
  const atribuicao = await api.get<MissaoAtribuicaoResponse>(
    `/missoes/atribuicoes/${missaoId}`,
  );

  if (atribuicao.adolescenteId !== adolescenteId) {
    return null;
  }

  return mapMissaoValidacao(atribuicao);
}

export async function configurarMesadaDoAdolescente(params: {
  adolescenteId: string;
  valor: number;
  periodicidade: "Semanal" | "Quinzenal" | "Mensal";
  ativa: boolean;
}) {
  const { adolescenteId, valor, periodicidade, ativa } = params;
  const mesadas = await listarMesadasDoAdolescente(adolescenteId);
  const payload: CreateMesadaRequest = {
    valor,
    periodicidade: mapPeriodicidadeLabel(periodicidade),
    dataInicio: new Date().toISOString(),
  };
  const mesadaAtual = findMesadaAtual(mesadas);

  if (!mesadaAtual) {
    return api.post(`/adolescentes/${adolescenteId}/mesadas`, payload);
  }

  return api.patch(`/mesadas/${mesadaAtual.id}`, {
    valor,
    periodicidade: payload.periodicidade,
    ativa,
  });
}

export async function criarMissaoParaAdolescente(params: {
  responsavelId: string;
  adolescenteId: string;
  titulo: string;
  descricao?: string;
  recompensaFinanceira?: number;
  dataLimite?: string;
  observacao?: string;
}) {
  const {
    responsavelId,
    adolescenteId,
    titulo,
    descricao,
    recompensaFinanceira,
    dataLimite,
    observacao,
  } = params;

  const missao = await api.post<Missao>(
    `/responsaveis/${responsavelId}/missoes`,
    {
      titulo,
      descricao,
      pontos: getMissionPointsFromReward(recompensaFinanceira),
      recompensaFinanceira,
      ativa: true,
    } satisfies CreateMissaoRequest,
  );

  return api.post<MissaoAtribuicaoResponse>(
    `/missoes/${missao.id}/atribuicoes`,
    {
      adolescenteId,
      dataLimite,
      observacao,
    } satisfies CreateMissaoAtribuicaoRequest,
  );
}

export async function aprovarMissaoDoAdolescente(
  _adolescenteId: string,
  missaoId: string,
  feedbackResponsavel?: string,
) {
  return api.patch<MissaoAtribuicaoResponse>(
    `/missoes/atribuicoes/${missaoId}/validar`,
    feedbackResponsavel ? { observacao: feedbackResponsavel } : {},
  );
}

export async function recusarMissaoDoAdolescente() {
  throw new Error("A API atual nao possui endpoint para recusar uma missao.");
}