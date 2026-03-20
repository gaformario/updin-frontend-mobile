import { useAuth } from "@/features/auth/context/AuthContext";
import {
  mockExtratoCompletoPorAdolescenteId,
  mockPainelFinanceiroPorAdolescenteId,
  type ExtratoCategoria,
  type ExtratoHistoricoItem,
} from "@/services/mock-painel-financeiro-adolescente";
import { adolescenteExtratoStyles as stylePainel } from "@/styles/adolescente/extrato";
import { formatCurrency } from "@/utils/currency";
import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const filtros: { key: "tudo" | ExtratoCategoria; label: string }[] = [
  { key: "tudo", label: "Tudo" },
  { key: "mesada", label: "Mesada" },
  { key: "missao", label: "Missões" },
];

function getCategoriaMeta(categoria: ExtratoCategoria) {
  if (categoria === "mesada") {
    return {
      label: "Mesada",
      icon: "dollar-sign" as const,
      iconColor: "#4F46E5",
      iconBackground: "#E0E7FF",
    };
  }

  return {
    label: "Missão",
    icon: "target" as const,
    iconColor: "#A855F7",
    iconBackground: "#F3E8FF",
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
        <Text style={stylePainel.statementItemDate}>{item.data}</Text>
      </View>

      <View style={stylePainel.statementItemMeta}>
        <Text style={stylePainel.statementItemValue}>
          +{formatCurrency(item.valor)}
        </Text>
        <Text style={stylePainel.statementItemCategory}>{categoria.label}</Text>
      </View>
    </View>
  );
}

export default function ExtratoScreen() {
  const { session } = useAuth();
  const insets = useSafeAreaInsets();
  const [filtroAtivo, setFiltroAtivo] = useState<"tudo" | ExtratoCategoria>("tudo");

  const adolescenteId =
    session?.usuario.tipo === "adolescente" ? session.perfil.id : "ado-1";

  const painel =
    mockPainelFinanceiroPorAdolescenteId[adolescenteId] ??
    mockPainelFinanceiroPorAdolescenteId["ado-1"];

  const historico =
    mockExtratoCompletoPorAdolescenteId[adolescenteId] ??
    mockExtratoCompletoPorAdolescenteId["ado-1"];

  const periodoAtual = historico[0]?.periodo ?? "Mês atual";

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

        acc.totalRecebido += item.valor;
        return acc;
      },
      {
        totalMesada: 0,
        totalMissoes: 0,
        totalRecebido: 0,
      },
    );
  }, [historico]);

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
              {formatCurrency(painel.saldoTotal)}
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
            {itensFiltrados.map((item) => (
              <ExtratoItemCard key={item.id} item={item} />
            ))}
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
                <Text style={stylePainel.statementSummaryLabel}>Total Mesada</Text>
              </View>
              <Text style={stylePainel.statementSummaryValue}>
                {formatCurrency(resumo.totalMesada)}
              </Text>
            </View>

            <View style={stylePainel.statementSummaryRow}>
              <View style={stylePainel.statementSummaryLabelRow}>
                <Feather name="target" size={14} color="#A855F7" />
                <Text style={stylePainel.statementSummaryLabel}>Total Missões</Text>
              </View>
              <Text style={stylePainel.statementSummaryValue}>
                {formatCurrency(resumo.totalMissoes)}
              </Text>
            </View>

            <View style={stylePainel.statementSummaryDivider} />

            <View style={stylePainel.statementSummaryRow}>
              <Text style={stylePainel.statementSummaryTotalLabel}>Total Recebido</Text>
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
