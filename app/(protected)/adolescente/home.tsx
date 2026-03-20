import { useAuth } from "@/features/auth/context/AuthContext";
import { buscarPainelFinanceiroDoAdolescente } from "@/services/adolescente";
import { adolescenteHomeStyles as stylePainel } from "@/styles/adolescente/home";
import type { AdolescentePainelFinanceiro } from "@/types/painel-financeiro";
import { formatCurrency } from "@/utils/currency";
import { getErrorMessage } from "@/utils/errors";
import { getInitials } from "@/utils/initials";
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const quickActions = [
  {
    key: "extrato",
    label: "Extrato",
    route: "/(protected)/adolescente/extrato" as const,
    icon: <Feather name="trending-up" size={20} color="#4F46E5" />,
  },
  {
    key: "quizzes",
    label: "Quizzes",
    route: "/(protected)/adolescente/quizzes" as const,
    icon: <Ionicons name="book-outline" size={20} color="#9333EA" />,
  },
  {
    key: "ranking",
    label: "Ranking",
    route: "/(protected)/adolescente/ranking" as const,
    icon: (
      <MaterialCommunityIcons name="trophy-outline" size={20} color="#F97316" />
    ),
  },
];

const missionIcons = ["car-sport-outline", "book-outline", "cart-outline"] as const;
const missionProgress = {
  mesada: 0.8,
  missoes: 0.2,
};

export default function HomeAdolescente() {
  const { session } = useAuth();
  const insets = useSafeAreaInsets();
  const adolescenteId = session?.perfis.adolescenteId;
  const [painel, setPainel] = useState<AdolescentePainelFinanceiro | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    if (!adolescenteId) {
      setPainel(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await buscarPainelFinanceiroDoAdolescente(adolescenteId);
      setPainel(data);
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

  if (loading) {
    return (
      <SafeAreaView style={stylePainel.container}>
        <View style={[stylePainel.scrollContent, { flex: 1, justifyContent: "center" }]}> 
          <ActivityIndicator size="large" color="#8B3DFF" />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !painel) {
    return (
      <SafeAreaView style={stylePainel.container}>
        <View style={[stylePainel.scrollContent, { flex: 1, justifyContent: "center" }]}> 
          <Text style={stylePainel.sectionTitle}>{error ?? "Nao foi possivel carregar o painel."}</Text>
          <TouchableOpacity style={stylePainel.actionCard} onPress={() => void carregar()}>
            <Text style={stylePainel.actionLabel}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const primeiroNome = painel.nome.split(" ")[0];

  return (
    <SafeAreaView style={stylePainel.container} edges={[]}>
      <Animated.ScrollView
        entering={FadeIn.duration(180)}
        style={stylePainel.scrollView}
        contentContainerStyle={stylePainel.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={["#8B3DFF", "#E6007A", "#FF0066"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[stylePainel.heroCard, { paddingTop: insets.top + 12 }]}
        >
          <View style={stylePainel.heroTopRow}>
            <View style={stylePainel.headerUserRow}>
              <View style={stylePainel.headerAvatar}>
                <Text style={stylePainel.headerAvatarEmoji}>{getInitials(painel.nome)}</Text>
              </View>
              <View>
                <Text style={stylePainel.headerName}>Ola, {primeiroNome}!</Text>
                <Text style={stylePainel.headerSubtitle}>Bem-vindo de volta</Text>
              </View>
            </View>

            <TouchableOpacity activeOpacity={0.8} style={stylePainel.notificationButton}>
              <Ionicons name="notifications-outline" size={20} color="#FFF" />
              <View style={stylePainel.notificationBadge}>
                <Text style={stylePainel.notificationBadgeText}>
                  {painel.missoesAtivas.filter((missao) => missao.status === "aguardando_validacao").length}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={stylePainel.balanceCard}>
            <Text style={stylePainel.balanceLabel}>Saldo Disponivel</Text>
            <Text style={stylePainel.balanceValue}>
              {formatCurrency(painel.saldoTotal)}
            </Text>

            <View style={stylePainel.progressTrack}>
              <View
                style={[
                  stylePainel.progressFill,
                  { width: `${missionProgress.mesada * 100}%` },
                ]}
              />
            </View>

            <Text style={stylePainel.progressText}>80% Mesada | 20% Missoes</Text>
          </View>
        </LinearGradient>

        <Animated.View entering={FadeInDown.duration(220).delay(40)}>
          <View style={stylePainel.sectionCard}>
            <View style={stylePainel.sectionHeader}>
              <Text style={stylePainel.sectionTitle}>Missoes Pendentes</Text>
              <Text style={stylePainel.sectionMeta}>
                {painel.missoesAtivas.length} ativas
              </Text>
            </View>

            <View style={stylePainel.missionList}>
              {painel.missoesAtivas.length ? (
                painel.missoesAtivas.map((missao, index) => (
                  <TouchableOpacity
                    key={missao.id}
                    activeOpacity={0.86}
                    style={stylePainel.missionCard}
                    onPress={() =>
                      router.push(`/(protected)/adolescente/missao/${missao.id}` as any)
                    }
                  >
                    <View style={stylePainel.rowIcon}>
                      <Ionicons
                        name={missionIcons[index] ?? "sparkles-outline"}
                        size={20}
                        color="#7C3AED"
                      />
                    </View>

                    <View style={stylePainel.rowContent}>
                      <Text style={stylePainel.rowTitle}>{missao.titulo}</Text>
                      <Text style={stylePainel.rowSubtitle}>
                        Toque para ver detalhes
                      </Text>
                    </View>

                    <Text style={stylePainel.rowValue}>
                      +{formatCurrency(missao.recompensa)}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={stylePainel.rowSubtitle}>Nenhuma missao pendente.</Text>
              )}
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(220).delay(90)}>
          <View style={stylePainel.actionsRow}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.key}
                activeOpacity={0.85}
                style={stylePainel.actionCard}
                onPress={() => router.push(action.route as any)}
              >
                <View style={stylePainel.actionIcon}>{action.icon}</View>
                <Text style={stylePainel.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(220).delay(130)}>
          <LinearGradient
            colors={["#3B82F6", "#06B6D4"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={stylePainel.tipCard}
          >
            <View style={stylePainel.tipHeader}>
              <Octicons name="light-bulb" size={15} color="#FCD34D" />
              <Text style={stylePainel.tipTitle}>Dica do Dia</Text>
            </View>

            <Text style={stylePainel.tipText}>
              Guardar uma parte da sua mesada antes de gastar ajuda a criar o habito de poupar.
            </Text>
          </LinearGradient>
        </Animated.View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}