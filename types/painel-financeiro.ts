import type { ImageSourcePropType } from "react-native";

export interface AdolescenteResumo {
  id: string;
  nome: string;
  saldoTotal: number;
}

export interface ExtratoItem {
  id: string;
  titulo: string;
  data: string;
  valor: number;
  tipo: "credito" | "debito";
}

export interface MissaoAtiva {
  id: string;
  titulo: string;
  subtitulo: string;
  recompensa: number;
  status: "aguardando_validacao" | "em_andamento" | "pendente" | "aprovada";
}

export interface EvidenciaMissao {
  id: string;
  legenda?: string;
  imagem?: ImageSourcePropType;
}

export interface MissaoValidacao extends MissaoAtiva {
  descricao: string;
  comentarioAdolescente: string;
  concluidaEm: string;
  feedbackResponsavel?: string;
  evidencias: EvidenciaMissao[];
}

export interface AdolescentePainelFinanceiro {
  adolescenteId: string;
  nome: string;
  saldoTotal: number;
  mesadaFixa: number;
  variavel: number;
  extratoRecente: ExtratoItem[];
  missoesAtivas: MissaoValidacao[];
}
