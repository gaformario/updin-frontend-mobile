import { mockEvidenciasMissao } from "@/services/mock-validacao-missao-assets";
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
        titulo: "Mesada fixa - semanal",
        data: "25/11/2025",
        valor: 200,
        tipo: "credito",
      },
      {
        id: "2",
        titulo: "Missão: Organizar o quarto",
        data: "24/11/2025",
        valor: 25,
        tipo: "credito",
      },
      {
        id: "3",
        titulo: "Missão: Fazer exercícios",
        data: "22/11/2025",
        valor: 30,
        tipo: "credito",
      },
    ],
    missoesAtivas: [
      {
        id: "1",
        titulo: "Lavar o carro",
        subtitulo: "Aguardando validação",
        recompensa: 40,
        status: "aguardando_validacao",
        descricao:
          "Esta missão consiste em lavar o carro. O adolescente deve realizar a tarefa completamente e enviar comprovação.",
        comentarioAdolescente:
          "Tarefa concluída! Fiz tudo conforme solicitado e tirei fotos como prova.",
        concluidaEm: "2025-11-27",
        feedbackResponsavel: "",
        evidencias: [
          {
            id: "evidencia-1",
            legenda: "Carro finalizado",
            imagem: mockEvidenciasMissao.carroAntes,
          },
          {
            id: "evidencia-2",
            legenda: "Detalhe da limpeza",
            imagem: mockEvidenciasMissao.carroDepois,
          },
        ],
      },
      {
        id: "2",
        titulo: "Estudar matemática (2h)",
        subtitulo: "Em andamento",
        recompensa: 30,
        status: "em_andamento",
        descricao: "Separar duas horas para revisar exercícios e teoria.",
        comentarioAdolescente: "",
        concluidaEm: "",
        feedbackResponsavel: "",
        evidencias: [],
      },
      {
        id: "3",
        titulo: "Ajudar nas compras",
        subtitulo: "Pendente",
        recompensa: 35,
        status: "pendente",
        descricao: "Acompanhar as compras do mercado e ajudar a guardar tudo.",
        comentarioAdolescente: "",
        concluidaEm: "",
        feedbackResponsavel: "",
        evidencias: [],
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
        titulo: "Mesada fixa - semanal",
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
        descricao: "Separar os materiais escolares por matéria.",
        comentarioAdolescente: "",
        concluidaEm: "",
        feedbackResponsavel: "",
        evidencias: [],
      },
    ],
  },
};
