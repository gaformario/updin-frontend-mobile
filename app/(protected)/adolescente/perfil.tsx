import { useAuth } from "@/features/auth/context/AuthContext";
import { adolescentePerfilStyles as stylePainel } from "@/styles/adolescente/perfil";
import { getInitials } from "@/utils/initials";
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const estatisticas = [
  {
    key: "missoes",
    label: "Missões",
    value: 24,
    icon: <Feather name="target" size={18} color="#A855F7" />,
    backgroundColor: "#F3E8FF",
  },
  {
    key: "quizzes",
    label: "Quizzes",
    value: 12,
    icon: <Ionicons name="book-outline" size={18} color="#3B82F6" />,
    backgroundColor: "#DBEAFE",
  },
  {
    key: "conquistas",
    label: "Conquistas",
    value: 4,
    icon: <Feather name="award" size={18} color="#F59E0B" />,
    backgroundColor: "#FEF3C7",
  },
];

const conquistas = [
  { key: "primeira-missao", label: "Primeira\nMissão", icon: "🏆", active: true },
  { key: "poupador", label: "Poupador", icon: "💰", active: true },
  { key: "estudante", label: "Estudante", icon: "📚", active: true },
  { key: "estrela", label: "Estrela", icon: "⭐", active: true },
  { key: "focado", label: "Focado", icon: "🎯", active: false },
  { key: "sequencia", label: "Sequência", icon: "🔥", active: false },
];

const configuracoes = [
  {
    key: "editar",
    label: "Editar Perfil",
    icon: <Feather name="camera" size={16} color="#3B82F6" />,
    backgroundColor: "#DBEAFE",
  },
  {
    key: "notificacoes",
    label: "Notificações",
    icon: <Ionicons name="notifications-outline" size={16} color="#A855F7" />,
    backgroundColor: "#F3E8FF",
  },
  {
    key: "privacidade",
    label: "Privacidade",
    icon: <Feather name="shield" size={16} color="#22C55E" />,
    backgroundColor: "#DCFCE7",
  },
];

const evolucaoSemanal = [
  { key: "s1", semana: "S1", pontos: 450 },
  { key: "s2", semana: "S2", pontos: 680 },
  { key: "s3", semana: "S3", pontos: 820 },
  { key: "s4", semana: "S4", pontos: 950 },
  { key: "s5", semana: "S5", pontos: 1180 },
];

export default function PerfilScreen() {
  const { session, signOut } = useAuth();
  const insets = useSafeAreaInsets();

  const nome = session?.usuario.nome ?? "Lucas Silva";
  const usuario = session?.usuario.usuario ?? "lucassilva";

  async function handleSignOut() {
    await signOut();
    router.replace("/(auth)/login-adolescente");
  }

  return (
    <SafeAreaView style={stylePainel.profileScreen} edges={[]}>
      <Animated.ScrollView
        entering={FadeIn.duration(180)}
        style={stylePainel.scrollView}
        contentContainerStyle={[
          stylePainel.profileScrollContent,
          { paddingBottom: insets.bottom + 28 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={["#9333EA", "#4F46E5"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[stylePainel.profileHero, { paddingTop: insets.top + 8 }]}
        >
          <View style={stylePainel.profileAvatarWrap}>
            <View style={stylePainel.profileAvatar}>
              <Text style={stylePainel.profileAvatarText}>{getInitials(nome)}</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              style={stylePainel.profileAvatarEditButton}
            >
              <Feather name="camera" size={12} color="#7C3AED" />
            </TouchableOpacity>
          </View>

          <Text style={stylePainel.profileName}>{nome}</Text>
          <Text style={stylePainel.profileHandle}>@{usuario}</Text>
        </LinearGradient>

        <Animated.View entering={FadeInDown.duration(220).delay(30)}>
          <View style={stylePainel.profileStatsCard}>
            <Text style={stylePainel.profileSectionTitle}>Estatísticas</Text>

            <View style={stylePainel.profileStatsRow}>
              {estatisticas.map((item) => (
                <View key={item.key} style={stylePainel.profileStatItem}>
                  <View
                    style={[
                      stylePainel.profileStatIconWrap,
                      { backgroundColor: item.backgroundColor },
                    ]}
                  >
                    {item.icon}
                  </View>
                  <Text style={stylePainel.profileStatValue}>{item.value}</Text>
                  <Text style={stylePainel.profileStatLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(220).delay(70)}>
          <View style={stylePainel.profileSectionCard}>
            <View style={stylePainel.profileSectionHeader}>
              <Feather name="award" size={14} color="#F59E0B" />
              <Text style={stylePainel.profileSectionTitle}>Minhas Conquistas</Text>
            </View>

            <View style={stylePainel.profileBadgeGrid}>
              {conquistas.map((item) => (
                <View
                  key={item.key}
                  style={[
                    stylePainel.profileBadgeCard,
                    item.active
                      ? stylePainel.profileBadgeCardActive
                      : stylePainel.profileBadgeCardInactive,
                  ]}
                >
                  <Text style={stylePainel.profileBadgeEmoji}>{item.icon}</Text>
                  <Text
                    style={[
                      stylePainel.profileBadgeLabel,
                      !item.active && stylePainel.profileBadgeLabelInactive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(220).delay(110)}>
          <View style={stylePainel.profileSectionCard}>
            <View style={stylePainel.profileSectionHeader}>
              <MaterialCommunityIcons
                name="chart-line"
                size={16}
                color="#22C55E"
              />
              <Text style={stylePainel.profileSectionTitle}>Evolução Mensal</Text>
            </View>

            <View style={stylePainel.profileEvolutionCard}>
              <View style={stylePainel.profileEvolutionRow}>
                {evolucaoSemanal.map((item) => (
                  <View key={item.key} style={stylePainel.profileEvolutionItem}>
                    <Text style={stylePainel.profileEvolutionValue}>{item.pontos}</Text>
                    <Text style={stylePainel.profileEvolutionWeek}>{item.semana}</Text>
                  </View>
                ))}
              </View>

              <Text style={stylePainel.profileEvolutionCaption}>
                Pontos XP por semana
              </Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(220).delay(150)}>
          <View style={stylePainel.profileSectionCard}>
            <Text style={stylePainel.profileSectionTitle}>Configurações</Text>

            <View style={stylePainel.profileSettingsList}>
              {configuracoes.map((item) => (
                <TouchableOpacity
                  key={item.key}
                  activeOpacity={0.85}
                  style={stylePainel.profileSettingRow}
                >
                  <View style={stylePainel.profileSettingLeft}>
                    <View
                      style={[
                        stylePainel.profileSettingIconWrap,
                        { backgroundColor: item.backgroundColor },
                      ]}
                    >
                      {item.icon}
                    </View>
                    <Text style={stylePainel.profileSettingLabel}>{item.label}</Text>
                  </View>

                  <Feather name="chevron-right" size={16} color="#98A2B3" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(220).delay(190)}>
          <TouchableOpacity
            activeOpacity={0.88}
            style={stylePainel.profileLogoutButton}
            onPress={handleSignOut}
          >
            <Feather name="log-out" size={16} color="#FFF" />
            <Text style={stylePainel.profileLogoutText}>Sair</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
