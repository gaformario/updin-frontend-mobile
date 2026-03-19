import { mockPainelFinanceiroPorAdolescenteId } from "@/services/mock-painel-financeiro-adolescente";
import { mockAdolescentesResumo } from "@/services/mock-responsavel";

export async function listarAdolescentesDoResponsavel() {
  return mockAdolescentesResumo;
}

export async function buscarPainelFinanceiroDoAdolescente(
  adolescenteId: string,
) {
  return mockPainelFinanceiroPorAdolescenteId[adolescenteId];
}

export async function buscarMissaoParaValidacao(
  adolescenteId: string,
  missaoId: string,
) {
  const painel = mockPainelFinanceiroPorAdolescenteId[adolescenteId];

  return painel?.missoesAtivas.find((missao) => missao.id === missaoId);
}

export async function aprovarMissaoDoAdolescente(
  adolescenteId: string,
  missaoId: string,
  feedbackResponsavel?: string,
) {
  const painel = mockPainelFinanceiroPorAdolescenteId[adolescenteId];

  if (!painel) {
    return null;
  }

  const missao = painel.missoesAtivas.find((item) => item.id === missaoId);

  if (!missao) {
    return null;
  }

  missao.feedbackResponsavel = feedbackResponsavel ?? "";

  return missao;
}

export async function recusarMissaoDoAdolescente(
  adolescenteId: string,
  missaoId: string,
  feedbackResponsavel?: string,
) {
  const painel = mockPainelFinanceiroPorAdolescenteId[adolescenteId];

  if (!painel) {
    return null;
  }

  const missao = painel.missoesAtivas.find((item) => item.id === missaoId);

  if (!missao) {
    return null;
  }

  missao.feedbackResponsavel = feedbackResponsavel ?? "";

  return missao;
}
