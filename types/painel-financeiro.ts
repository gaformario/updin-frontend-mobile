import type { ImageSourcePropType } from "react-native";
import type { Periodicidade } from "@/types/entities";

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
  categoria: "mesada" | "missao" | "outro";
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
  prazo?: string | null;
  observacoesResponsavel?: string;
  dica?: string;
  comentarioAdolescente: string;
  concluidaEm: string;
  feedbackResponsavel?: string;
  evidencias: EvidenciaMissao[];
}

export interface AdolescentePainelFinanceiro {
  adolescenteId: string;
  contaId: string | null;
  responsavelId: string;
  nome: string;
  saldoTotal: number;
  saldoMesada: number;
  saldoMissoes: number;
  percentualSaldoMesada: number;
  percentualSaldoMissoes: number;
  mesadaId: string | null;
  mesadaValor: number;
  mesadaPeriodicidade: Periodicidade | null;
  mesadaAtiva: boolean;
  mesadaFixa: number;
  variavel: number;
  extratoRecente: ExtratoItem[];
  missoesAtivas: MissaoValidacao[];
  missoesAguardandoValidacao: MissaoValidacao[];
}
