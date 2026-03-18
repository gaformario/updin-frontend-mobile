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
