import { mockEvidenciasMissao } from "@/services/mock-validacao-missao-assets";
import type { AdolescentePainelFinanceiro } from "@/types/painel-financeiro";

export type ExtratoCategoria = "mesada" | "missao";

export type ExtratoHistoricoItem = {
  id: string;
  titulo: string;
  data: string;
  valor: number;
  tipo: "credito" | "debito";
  categoria: ExtratoCategoria;
  periodo: string;
};

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
          "Esta missão consiste em lavar o carro. O adolescente deve realizar a tarefa completamente, lavar a parte externa e interna do carro, seguir as orientações combinadas pelo responsável e enviar fotos ou comentários como prova da conclusão.",
        prazo: "Sem prazo definido - Complete quando puder!",
        observacoesResponsavel:
          "Faça com capricho e atenção aos detalhes. Tire fotos antes e depois para comprovar!",
        dica: "Quanto melhor voce documentar a conclusão da missão, mais rápida sera a aprovação!",
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
        descricao:
          "Separar duas horas para revisar exercícios e teoria, dedicar pelo menos 2 horas ao estudo, revisar teoria, resolver exercícios e anotar as principais dúvidas encontradas.",
        prazo: "Entregar até sexta-feira, 18h",
        observacoesResponsavel:
          "Escolha um lugar silencioso e mantenha o foco durante o estudo.",
        dica: "Quebrar o estudo em blocos de 30 minutos pode ajudar a render mais.",
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
        descricao:
          "Acompanhar as compras do mercado, ajudar a conferir a lista, dar apoio durante as compras e guardar os itens nos lugares corretos ao chegar em casa.",
        prazo: "Concluir no próximo fim de semana",
        observacoesResponsavel:
          "Preste atenção nos itens mais pesados e ajude com organização.",
        dica: "Separar os produtos por categoria acelera na hora de guardar.",
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
        descricao:
          "Separar os materiais escolares por matÃ©ria, organizar cadernos, livros e folhas, descartar papÃ©is sem uso e deixar a mochila pronta para a semana.",
        prazo: "Concluir hoje at? 20h",
        observacoesResponsavel:
          "Capriche na organiza??o para facilitar sua rotina nos estudos.",
        dica: "Use pastas ou etiquetas para identificar cada mat?ria mais rapidamente.",
        comentarioAdolescente: "",
        concluidaEm: "",
        feedbackResponsavel: "",
        evidencias: [],
      },
    ],
  },
};

export const mockExtratoCompletoPorAdolescenteId: Record<
  string,
  ExtratoHistoricoItem[]
> = {
  "ado-1": [
    {
      id: "hist-1",
      titulo: "Mesada fixa - semanal",
      data: "2025-11-25",
      valor: 200,
      tipo: "credito",
      categoria: "mesada",
      periodo: "Novembro 2025",
    },
    {
      id: "hist-2",
      titulo: "Missão: Organizar o quarto",
      data: "2025-11-24",
      valor: 25,
      tipo: "credito",
      categoria: "missao",
      periodo: "Novembro 2025",
    },
    {
      id: "hist-3",
      titulo: "Missão: Fazer exercícios",
      data: "2025-11-22",
      valor: 30,
      tipo: "credito",
      categoria: "missao",
      periodo: "Novembro 2025",
    },
    {
      id: "hist-4",
      titulo: "Mesada fixa - semanal",
      data: "2025-11-18",
      valor: 200,
      tipo: "credito",
      categoria: "mesada",
      periodo: "Novembro 2025",
    },
    {
      id: "hist-5",
      titulo: "Missão: Estudar matemática",
      data: "2025-11-17",
      valor: 35,
      tipo: "credito",
      categoria: "missao",
      periodo: "Novembro 2025",
    },
    {
      id: "hist-6",
      titulo: "Missão: Lavar o carro",
      data: "2025-11-15",
      valor: 40,
      tipo: "credito",
      categoria: "missao",
      periodo: "Novembro 2025",
    },
  ],
  "ado-2": [
    {
      id: "hist-7",
      titulo: "Mesada fixa - semanal",
      data: "2025-11-25",
      valor: 144.4,
      tipo: "credito",
      categoria: "mesada",
      periodo: "Novembro 2025",
    },
    {
      id: "hist-8",
      titulo: "Missão: Organizar materiais",
      data: "2025-11-23",
      valor: 20,
      tipo: "credito",
      categoria: "missao",
      periodo: "Novembro 2025",
    },
    {
      id: "hist-9",
      titulo: "Missão: Revisar redação",
      data: "2025-11-16",
      valor: 16.1,
      tipo: "credito",
      categoria: "missao",
      periodo: "Novembro 2025",
    },
  ],
};
