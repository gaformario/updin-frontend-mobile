import { useAuth } from "@/features/auth/context/AuthContext";
import { mockPainelFinanceiroPorAdolescenteId } from "@/services/mock-painel-financeiro-adolescente";
import { adolescenteHomeStyles as stylePainel } from "@/styles/adolescente/home";
import { formatCurrency } from "@/utils/currency";
import { getInitials } from "@/utils/initials";
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Text, TouchableOpacity, View } from "react-native";
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
  mesada: 0.65,
  missoes: 0.35,
};

export default function HomeAdolescente() {
  const { session } = useAuth();
  const insets = useSafeAreaInsets();

  const adolescenteId =
    session?.usuario.tipo === "adolescente" ? session.perfil.id : "ado-1";

  const painel =
    mockPainelFinanceiroPorAdolescenteId[adolescenteId] ??
    mockPainelFinanceiroPorAdolescenteId["ado-1"];

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
                <Text style={stylePainel.headerName}>Olá, {primeiroNome}!</Text>
                <Text style={stylePainel.headerSubtitle}>Bem-vindo de volta</Text>
              </View>
            </View>

            <TouchableOpacity activeOpacity={0.8} style={stylePainel.notificationButton}>
              <Ionicons name="notifications-outline" size={20} color="#FFF" />
              <View style={stylePainel.notificationBadge}>
                <Text style={stylePainel.notificationBadgeText}>2</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={stylePainel.balanceCard}>
            <Text style={stylePainel.balanceLabel}>Saldo Disponível</Text>
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

            <Text style={stylePainel.progressText}>65% Mesada | 35% Missões</Text>
          </View>
        </LinearGradient>

        <Animated.View entering={FadeInDown.duration(220).delay(40)}>
          <View style={stylePainel.sectionCard}>
            <View style={stylePainel.sectionHeader}>
              <Text style={stylePainel.sectionTitle}>Missões Pendentes</Text>
              <Text style={stylePainel.sectionMeta}>
                {painel.missoesAtivas.length} ativas
              </Text>
            </View>

            <View style={stylePainel.missionList}>
              {painel.missoesAtivas.map((missao, index) => (
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
              ))}
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
              Guardar 10% do que você ganha é um ótimo hábito para começar a
              poupar!
            </Text>
          </LinearGradient>
        </Animated.View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
