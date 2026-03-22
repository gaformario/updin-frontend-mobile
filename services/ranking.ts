import { api } from "@/services/api-client";
import { mapRankingTela } from "@/services/mappers";
import type { RankingApiResponse } from "@/types/api";
import type { RankingPeriod, RankingScope } from "@/types/view-models";

function buildRankingGlobalPath(periodo: RankingPeriod) {
  if (periodo === "semanal") {
    return "/ranking/global/semanal";
  }

  if (periodo === "mensal") {
    return "/ranking/global/mensal";
  }

  return "/ranking/global";
}

function buildRankingResponsavelPath(
  responsavelId: string,
  periodo: RankingPeriod,
) {
  if (periodo === "semanal") {
    return `/ranking/responsaveis/${responsavelId}/semanal`;
  }

  if (periodo === "mensal") {
    return `/ranking/responsaveis/${responsavelId}/mensal`;
  }

  return `/ranking/responsaveis/${responsavelId}`;
}

export async function buscarRankingGlobal(periodo: RankingPeriod) {
  return api.get<RankingApiResponse>(buildRankingGlobalPath(periodo));
}

export async function buscarRankingDoResponsavel(
  responsavelId: string,
  periodo: RankingPeriod,
) {
  return api.get<RankingApiResponse>(
    buildRankingResponsavelPath(responsavelId, periodo),
  );
}

export async function buscarRankingParaTela(params: {
  escopo: RankingScope;
  periodo: RankingPeriod;
  adolescenteId: string;
  responsavelId?: string | null;
}) {
  const { escopo, periodo, adolescenteId, responsavelId } = params;
  const response =
    escopo === "global" || !responsavelId
      ? await buscarRankingGlobal(periodo)
      : await buscarRankingDoResponsavel(responsavelId, periodo);

  return mapRankingTela(response, adolescenteId);
}
