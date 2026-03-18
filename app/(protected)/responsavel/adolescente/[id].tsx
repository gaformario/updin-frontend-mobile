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
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
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
  return (
    <View style={stylePainel.row}>
      <View style={[stylePainel.rowIcon, { backgroundColor: "#DBEAFE" }]}>
        <Feather name="dollar-sign" size={16} color="#2563EB" />
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

function MissaoRow({ item }: { item: MissaoAtiva }) {
  const statusColor =
    item.status === "aguardando_validacao"
      ? "#F97316"
      : item.status === "em_andamento"
        ? "#6B7280"
        : "#6B7280";

  const statusLabel =
    item.status === "aguardando_validacao"
      ? "Aguardando validacao"
      : item.status === "em_andamento"
        ? "Em andamento"
        : "Pendente";

  return (
    <View style={stylePainel.row}>
      <View style={[stylePainel.rowIcon, { backgroundColor: "#FDE7D8" }]}>
        <Feather name="eye" size={16} color={statusColor} />
      </View>

      <View style={stylePainel.rowContent}>
        <Text style={stylePainel.rowTitle}>{item.titulo}</Text>
        <Text style={stylePainel.rowSubtitle}>{statusLabel}</Text>
      </View>

      <View>
        <Text style={[stylePainel.rowValue, { color: "#A855F7" }]}>
          {formatCurrency(item.recompensa)}
        </Text>
        {item.status === "aguardando_validacao" ? (
          <Text style={stylePainel.validarText}>Validar</Text>
        ) : null}
      </View>
    </View>
  );
}

export default function AdolescentePainelFinanceiroScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const insets = useSafeAreaInsets();
  const [painelFinanceiro, setpainelFinanceiro] =
    useState<AdolescentePainelFinanceiro | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function carregar() {
      if (!id) {
        if (active) {
          setpainelFinanceiro(null);
          setLoading(false);
        }
        return;
      }

      const data = await buscarPainelFinanceiroDoAdolescente(String(id));

      if (active) {
        setpainelFinanceiro(data ?? null);
        setLoading(false);
      }
    }

    setLoading(true);
    void carregar();

    return () => {
      active = false;
    };
  }, [id]);

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
          <Text style={stylePainel.emptyButtonText}>Voltar para seleção</Text>
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
              <Text style={stylePainel.miniLabel}>Variável (20%)</Text>
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
            icon={
              <MaterialCommunityIcons name="target" size={22} color="#A855F7" />
            }
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
            <MissaoRow key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
