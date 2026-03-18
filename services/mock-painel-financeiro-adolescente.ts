import type { AdolescentePainelFinanceiro } from "@/types/painel-financeiro";

export const mockPainelFinanceiroPorAdolescenteId: Record<
  string,
  AdolescentePainelFinanceiro
> = {
  "ado-1": {
    adolescenteId: "ado-1",
    nome: "Lucas Silva",
    saldoTotal: 250,
    mesadaFixa: 200,
    variavel: 50,
    extratoRecente: [
      {
        id: "1",
        titulo: "Mesada Fixa - Semanal",
        data: "25/11/2025",
        valor: 200,
        tipo: "credito",
      },
      {
        id: "2",
        titulo: "Missao: Organizar o quarto",
        data: "24/11/2025",
        valor: 25,
        tipo: "credito",
      },
      {
        id: "3",
        titulo: "Missao: Fazer exercicios",
        data: "22/11/2025",
        valor: 30,
        tipo: "credito",
      },
    ],
    missoesAtivas: [
      {
        id: "1",
        titulo: "Lavar o carro",
        subtitulo: "Aguardando validacao",
        recompensa: 40,
        status: "aguardando_validacao",
      },
      {
        id: "2",
        titulo: "Estudar matematica (2h)",
        subtitulo: "Em andamento",
        recompensa: 30,
        status: "em_andamento",
      },
      {
        id: "3",
        titulo: "Ajudar nas compras",
        subtitulo: "Pendente",
        recompensa: 35,
        status: "pendente",
      },
    ],
  },
  "ado-2": {
    adolescenteId: "ado-2",
    nome: "Maria Silva",
    saldoTotal: 180.5,
    mesadaFixa: 144.4,
    variavel: 36.1,
    extratoRecente: [
      {
        id: "1",
        titulo: "Mesada Fixa - Semanal",
        data: "25/11/2025",
        valor: 144.4,
        tipo: "credito",
      },
    ],
    missoesAtivas: [
      {
        id: "1",
        titulo: "Organizar materiais",
        subtitulo: "Em andamento",
        recompensa: 20,
        status: "em_andamento",
      },
    ],
  },
};
