import { useAuth } from "@/features/auth/context/AuthContext";
import {
  buscarPainelFinanceiroDoAdolescente,
  listarExtratoDoAdolescente,
} from "@/services/adolescente";
import { adolescenteExtratoStyles as stylePainel } from "@/styles/adolescente/extrato";
import type { ExtratoItem } from "@/types/painel-financeiro";
import { formatCurrency } from "@/utils/currency";
import { formatDate, formatMonthYear } from "@/utils/date";
import { getErrorMessage } from "@/utils/errors";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

type ExtratoCategoria = "mesada" | "missao" | "outro";
type ExtratoHistoricoItem = ExtratoItem & { categoria: ExtratoCategoria };

const filtros: { key: "tudo" | ExtratoCategoria; label: string }[] = [
  { key: "tudo", label: "Tudo" },
  { key: "mesada", label: "Mesada" },
  { key: "missao", label: "Missões" },
];

function getCategoria(item: ExtratoItem): ExtratoCategoria {
  if (item.titulo.toLowerCase().includes("mesada")) {
    return "mesada";
  }

  if (item.titulo.toLowerCase().includes("miss")) {
    return "missao";
  }

  return "outro";
}

function getCategoriaMeta(categoria: ExtratoCategoria) {
  if (categoria === "mesada") {
    return {
      label: "Mesada",
      icon: "dollar-sign" as const,
      iconColor: "#4F46E5",
      iconBackground: "#E0E7FF",
    };
  }

  if (categoria === "missao") {
    return {
      label: "Missão",
      icon: "target" as const,
      iconColor: "#A855F7",
      iconBackground: "#F3E8FF",
    };
  }

  return {
    label: "Movimentacao",
    icon: "credit-card" as const,
    iconColor: "#16A34A",
    iconBackground: "#DCFCE7",
  };
}

function ExtratoItemCard({ item }: { item: ExtratoHistoricoItem }) {
  const categoria = getCategoriaMeta(item.categoria);

  return (
    <View style={stylePainel.statementItemCard}>
      <View
        style={[
          stylePainel.statementItemIcon,
          { backgroundColor: categoria.iconBackground },
        ]}
      >
        <Feather name={categoria.icon} size={18} color={categoria.iconColor} />
      </View>

      <View style={stylePainel.statementItemContent}>
        <Text style={stylePainel.statementItemTitle}>{item.titulo}</Text>
        <Text style={stylePainel.statementItemDate}>
          {formatDate(item.data)}
        </Text>
      </View>

      <View style={stylePainel.statementItemMeta}>
        <Text style={stylePainel.statementItemValue}>
          {item.tipo === "credito" ? "+" : "-"}
          {formatCurrency(item.valor)}
        </Text>
        <Text style={stylePainel.statementItemCategory}>{categoria.label}</Text>
      </View>
    </View>
  );
}

export default function ExtratoScreen() {
  const { session } = useAuth();
  const insets = useSafeAreaInsets();
  const adolescenteId = session?.perfis.adolescenteId;
  const [filtroAtivo, setFiltroAtivo] = useState<"tudo" | ExtratoCategoria>(
    "tudo",
  );
  const [saldoTotal, setSaldoTotal] = useState(0);
  const [historico, setHistorico] = useState<ExtratoHistoricoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    if (!adolescenteId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const [painel, extrato] = await Promise.all([
        buscarPainelFinanceiroDoAdolescente(adolescenteId),
        listarExtratoDoAdolescente(adolescenteId),
      ]);

      setSaldoTotal(painel.saldoTotal);
      setHistorico(
        extrato.map((item) => ({ ...item, categoria: getCategoria(item) })),
      );
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [adolescenteId]);

  useFocusEffect(
    useCallback(() => {
      void carregar();
    }, [carregar]),
  );

  const periodoAtual = historico[0]?.data
    ? formatMonthYear(historico[0].data)
    : "Mes atual";

  const itensFiltrados = useMemo(() => {
    if (filtroAtivo === "tudo") {
      return historico;
    }

    return historico.filter((item) => item.categoria === filtroAtivo);
  }, [filtroAtivo, historico]);

  const resumo = useMemo(() => {
    return historico.reduce(
      (acc, item) => {
        if (item.categoria === "mesada") {
          acc.totalMesada += item.valor;
        }

        if (item.categoria === "missao") {
          acc.totalMissoes += item.valor;
        }

        if (item.tipo === "credito") {
          acc.totalRecebido += item.valor;
        }
        return acc;
      },
      {
        totalMesada: 0,
        totalMissoes: 0,
        totalRecebido: 0,
      },
    );
  }, [historico]);

  if (loading) {
    return (
      <SafeAreaView style={stylePainel.statementScreen}>
        <View
          style={[
            stylePainel.statementScrollContent,
            { flex: 1, justifyContent: "center" },
          ]}
        >
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={stylePainel.statementScreen}>
        <View
          style={[
            stylePainel.statementScrollContent,
            { flex: 1, justifyContent: "center" },
          ]}
        >
          <Text style={stylePainel.statementHeaderTitle}>{error}</Text>
          <TouchableOpacity
            style={stylePainel.statementFilterButtonActive}
            onPress={() => void carregar()}
          >
            <Text style={stylePainel.statementFilterTextActive}>
              Tentar novamente
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={stylePainel.statementScreen} edges={[]}>
      <Animated.ScrollView
        entering={FadeIn.duration(180)}
        style={stylePainel.scrollView}
        contentContainerStyle={[
          stylePainel.statementScrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={["#4F46E5", "#06B6D4"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[stylePainel.statementHeader, { paddingTop: insets.top + 10 }]}
        >
          <TouchableOpacity
            onPress={() => router.push("/(protected)/adolescente/home")}
            style={stylePainel.statementBackButton}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={20} color="#FFF" />
          </TouchableOpacity>

          <Text style={stylePainel.statementHeaderTitle}>Extrato</Text>
          <Text style={stylePainel.statementHeaderSubtitle}>
            Histórico de transações
          </Text>
        </LinearGradient>

        <Animated.View entering={FadeInDown.duration(220).delay(30)}>
          <View style={stylePainel.statementBalanceCard}>
            <View style={stylePainel.statementBalanceTopRow}>
              <Feather name="trending-up" size={14} color="#D7FFE5" />
              <Text style={stylePainel.statementBalanceLabel}>Saldo Atual</Text>
            </View>

            <Text style={stylePainel.statementBalanceValue}>
              {formatCurrency(saldoTotal)}
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(220).delay(70)}>
          <View style={stylePainel.statementFilterCard}>
            {filtros.map((filtro) => {
              const ativo = filtro.key === filtroAtivo;

              return (
                <TouchableOpacity
                  key={filtro.key}
                  activeOpacity={0.85}
                  style={[
                    stylePainel.statementFilterButton,
                    ativo && stylePainel.statementFilterButtonActive,
                  ]}
                  onPress={() => setFiltroAtivo(filtro.key)}
                >
                  <Text
                    style={[
                      stylePainel.statementFilterText,
                      ativo && stylePainel.statementFilterTextActive,
                    ]}
                  >
                    {filtro.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(220).delay(110)}>
          <View style={stylePainel.statementList}>
            {itensFiltrados.length ? (
              itensFiltrados.map((item) => (
                <ExtratoItemCard key={item.id} item={item} />
              ))
            ) : (
              <Text style={stylePainel.statementSummaryLabel}>
                Nenhuma movimentação encontrada.
              </Text>
            )}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(220).delay(150)}>
          <View style={stylePainel.statementSummaryCard}>
            <Text style={stylePainel.statementSummaryTitle}>
              Resumo de {periodoAtual}
            </Text>

            <View style={stylePainel.statementSummaryRow}>
              <View style={stylePainel.statementSummaryLabelRow}>
                <Feather name="dollar-sign" size={14} color="#4F46E5" />
                <Text style={stylePainel.statementSummaryLabel}>
                  Total Mesada
                </Text>
              </View>
              <Text style={stylePainel.statementSummaryValue}>
                {formatCurrency(resumo.totalMesada)}
              </Text>
            </View>

            <View style={stylePainel.statementSummaryRow}>
              <View style={stylePainel.statementSummaryLabelRow}>
                <Feather name="target" size={14} color="#A855F7" />
                <Text style={stylePainel.statementSummaryLabel}>
                  Total Missões
                </Text>
              </View>
              <Text style={stylePainel.statementSummaryValue}>
                {formatCurrency(resumo.totalMissoes)}
              </Text>
            </View>

            <View style={stylePainel.statementSummaryDivider} />

            <View style={stylePainel.statementSummaryRow}>
              <Text style={stylePainel.statementSummaryTotalLabel}>
                Total Recebido
              </Text>
              <Text style={stylePainel.statementSummaryTotalValue}>
                {formatCurrency(resumo.totalRecebido)}
              </Text>
            </View>
          </View>
        </Animated.View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
