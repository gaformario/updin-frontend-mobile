import { useAuth } from "@/features/auth/context/AuthContext";
import { buscarPainelFinanceiroDoAdolescente } from "@/services/responsavel";
import { stylePainel } from "@/styles/painel-financeiro-adolescente";
import type {
  AdolescentePainelFinanceiro,
  ExtratoItem,
  MissaoAtiva,
} from "@/types/painel-financeiro";
import { formatCurrency } from "@/utils/currency";
import { getInitials } from "@/utils/initials";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const RESPONSAVEL_SELECT_ROUTE = "/responsavel/selecionar-adolescente";
const RESPONSAVEL_ADOLESCENTE_ROUTE = "/responsavel/adolescente";

function ActionCard({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={stylePainel.actionCard}
      onPress={onPress}
    >
      {icon}
      <Text style={stylePainel.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function ExtratoRow({ item }: { item: ExtratoItem }) {
  const isMesada = item.titulo.toLowerCase().includes("mesada");

  const iconName = isMesada ? "dollar-sign" : "check-circle";
  const iconColor = isMesada ? "#2563EB" : "#7C3AED";
  const bgColor = isMesada ? "#DBEAFE" : "#EDE9FE";

  return (
    <View style={stylePainel.row}>
      <View style={[stylePainel.rowIcon, { backgroundColor: bgColor }]}>
        <Feather name={iconName} size={16} color={iconColor} />
      </View>

      <View style={stylePainel.rowContent}>
        <Text style={stylePainel.rowTitle}>{item.titulo}</Text>
        <Text style={stylePainel.rowSubtitle}>{item.data}</Text>
      </View>

      <Text
        style={[
          stylePainel.rowValue,
          { color: item.tipo === "credito" ? "#22C55E" : "#EF4444" },
        ]}
      >
        {item.tipo === "credito" ? "+" : "-"}
        {formatCurrency(item.valor)}
      </Text>
    </View>
  );
}

function MissaoRow({
  adolescenteId,
  item,
}: {
  adolescenteId: string;
  item: MissaoAtiva;
}) {
  const precisaValidar = item.status === "aguardando_validacao";
  const statusColor = precisaValidar ? "#F97316" : "#6B7280";
  const statusLabel = precisaValidar
    ? "Aguardando validação"
    : item.status === "em_andamento"
      ? "Em andamento"
      : item.status === "aprovada"
        ? "Aprovada"
        : "Pendente";

  function handleOpenValidacao() {
    router.push(
      `${RESPONSAVEL_ADOLESCENTE_ROUTE}/${adolescenteId}/validar-missao/${item.id}` as any,
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={precisaValidar ? 0.82 : 1}
      style={stylePainel.row}
      onPress={precisaValidar ? handleOpenValidacao : undefined}
      disabled={!precisaValidar}
    >
      <View
        style={[
          stylePainel.rowIcon,
          { backgroundColor: precisaValidar ? "#FDE7D8" : "#E5E7EB" },
        ]}
      >
        <Feather
          name={precisaValidar ? "clock" : "target"}
          size={16}
          color={statusColor}
        />
      </View>

      <View style={stylePainel.rowContent}>
        <Text style={stylePainel.rowTitle}>{item.titulo}</Text>
        <Text style={stylePainel.rowSubtitle}>{statusLabel}</Text>
      </View>

      <View style={stylePainel.missaoMeta}>
        <View style={stylePainel.rewardRow}>
          <Text style={[stylePainel.rowValue, { color: "#A855F7" }]}>
            {formatCurrency(item.recompensa)}
          </Text>
          {precisaValidar ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleOpenValidacao}
              style={stylePainel.warningButton}
            >
              <Feather name="alert-circle" size={18} color="#F97316" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function AdolescentePainelFinanceiroScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const insets = useSafeAreaInsets();
  const [painelFinanceiro, setPainelFinanceiro] =
    useState<AdolescentePainelFinanceiro | null>(null);
  const [loading, setLoading] = useState(true);

  const carregarPainel = useCallback(async () => {
    if (!id) {
      setPainelFinanceiro(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const data = await buscarPainelFinanceiroDoAdolescente(String(id));
    setPainelFinanceiro(data ?? null);
    setLoading(false);
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      void carregarPainel();
    }, [carregarPainel]),
  );

  function handleOpenConfigurarMesada() {
    router.push(
      `${RESPONSAVEL_ADOLESCENTE_ROUTE}/${String(id)}/configurar-mesada` as any,
    );
  }

  function handleOpenCriarMissao() {
    router.push(
      `${RESPONSAVEL_ADOLESCENTE_ROUTE}/${String(id)}/criar-missao` as any,
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={stylePainel.loadingContainer} edges={["bottom"]}>
        <Text>Carregando...</Text>
      </SafeAreaView>
    );
  }

  if (!painelFinanceiro) {
    return (
      <SafeAreaView style={stylePainel.loadingContainer} edges={["bottom"]}>
        <Text style={stylePainel.emptyTitle}>Adolescente nao encontrado.</Text>
        <TouchableOpacity
          style={stylePainel.emptyButton}
          onPress={() => router.replace(RESPONSAVEL_SELECT_ROUTE as any)}
        >
          <Text style={stylePainel.emptyButtonText}>Voltar para selecao</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={stylePainel.container}>
      <View style={[stylePainel.topHeader, { paddingTop: insets.top + 12 }]}>
        <View style={stylePainel.headerRow}>
          <TouchableOpacity
            onPress={() => router.replace(RESPONSAVEL_SELECT_ROUTE as any)}
            style={stylePainel.backButton}
          >
            <Feather name="arrow-left" size={20} color="#FFF" />
          </TouchableOpacity>

          <View style={stylePainel.headerUserRow}>
            <View style={stylePainel.headerAvatar}>
              <Text style={stylePainel.headerAvatarText}>
                {getInitials(painelFinanceiro.nome || "")}
              </Text>
            </View>

            <View>
              <Text style={stylePainel.headerName}>
                {painelFinanceiro.nome}
              </Text>

              <Text style={stylePainel.headerSubtitle}>
                {session?.adolescenteSelecionado?.id ===
                painelFinanceiro.adolescenteId
                  ? "Painel financeiro do adolescente selecionado"
                  : "Painel financeiro"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        style={stylePainel.scrollView}
        contentContainerStyle={[
          stylePainel.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
      >
        <View style={stylePainel.balanceCard}>
          <Text style={stylePainel.balanceLabel}>Saldo Total</Text>
          <Text style={stylePainel.balanceValue}>
            {formatCurrency(painelFinanceiro.saldoTotal)}
          </Text>

          <View style={stylePainel.balanceSplitRow}>
            <View style={stylePainel.balanceMiniCard}>
              <Text style={stylePainel.miniLabel}>Mesada Fixa (80%)</Text>
              <Text style={stylePainel.miniValue}>
                {formatCurrency(painelFinanceiro.mesadaFixa)}
              </Text>
            </View>

            <View style={stylePainel.balanceMiniCard}>
              <Text style={stylePainel.miniLabel}>Variavel (20%)</Text>
              <Text style={stylePainel.miniValue}>
                {formatCurrency(painelFinanceiro.variavel)}
              </Text>
            </View>
          </View>
        </View>

        <View style={stylePainel.actionsRow}>
          <ActionCard
            icon={<Feather name="dollar-sign" size={22} color="#2563EB" />}
            label="Configurar Mesada"
            onPress={handleOpenConfigurarMesada}
          />
          <ActionCard
            icon={<Feather name="target" size={22} color="#A855F7" />}
            label="Criar Missão"
            onPress={handleOpenCriarMissao}
          />
        </View>

        <View style={stylePainel.sectionCard}>
          <View style={stylePainel.sectionHeader}>
            <Text style={stylePainel.sectionTitle}>Extrato Recente</Text>
            <Feather name="trending-up" size={16} color="#9CA3AF" />
          </View>

          {painelFinanceiro.extratoRecente.map((item) => (
            <ExtratoRow key={item.id} item={item} />
          ))}
        </View>

        <View style={stylePainel.sectionCard}>
          <Text style={stylePainel.sectionTitle}>Missões Ativas</Text>

          {painelFinanceiro.missoesAtivas.map((item) => (
            <MissaoRow
              key={item.id}
              adolescenteId={painelFinanceiro.adolescenteId}
              item={item}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
