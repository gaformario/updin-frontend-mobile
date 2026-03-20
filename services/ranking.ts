import { api } from "@/services/api-client";
import { mapRankingLista } from "@/services/mappers";
import type { RankingApiResponse } from "@/types/api";
import type { RankingPeriod } from "@/types/view-models";

export async function buscarRankingGlobal() {
  return api.get<RankingApiResponse>("/ranking/global");
}

export async function buscarRankingDoResponsavel(responsavelId: string) {
  return api.get<RankingApiResponse>(`/ranking/responsaveis/${responsavelId}`);
}

export async function buscarRankingParaTela(params: {
  periodo: RankingPeriod;
  adolescenteId: string;
  responsavelId?: string | null;
}) {
  const { periodo, adolescenteId, responsavelId } = params;
  const response =
    periodo === "geral" || !responsavelId
      ? await buscarRankingGlobal()
      : await buscarRankingDoResponsavel(responsavelId);

  return mapRankingLista(response, adolescenteId);
}
