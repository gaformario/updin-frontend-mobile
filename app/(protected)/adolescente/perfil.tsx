import { useAuth } from "@/features/auth/context/AuthContext";
import { buscarResumoPerfilDoAdolescente } from "@/services/adolescente";
import { buscarRankingParaTela } from "@/services/ranking";
import { adolescentePerfilStyles as stylePainel } from "@/styles/adolescente/perfil";
import type { AdolescenteProfileResumo } from "@/types/view-models";
import { getErrorMessage } from "@/utils/errors";
import { getInitials } from "@/utils/initials";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const conquistas = [
  {
    key: "primeira-missao",
    label: "Primeira\nMissao",
    icon: <Feather name="target" size={22} color="#7C3AED" />,
    active: true,
  },
  {
    key: "poupador",
    label: "Poupador",
    icon: (
      <MaterialCommunityIcons
        name="piggy-bank-outline"
        size={22}
        color="#16A34A"
      />
    ),
    active: true,
  },
  {
    key: "estudante",
    label: "Estudante",
    icon: <Ionicons name="book-outline" size={22} color="#2563EB" />,
    active: true,
  },
  {
    key: "estrela",
    label: "Estrela",
    icon: <Ionicons name="star-outline" size={22} color="#F59E0B" />,
    active: true,
  },
  {
    key: "focado",
    label: "Focado",
    icon: <Feather name="crosshair" size={22} color="#98A2B3" />,
    active: false,
  },
  {
    key: "sequencia",
    label: "Sequencia",
    icon: <MaterialCommunityIcons name="fire" size={22} color="#98A2B3" />,
    active: false,
  },
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
    label: "Notificacoes",
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
  { key: "s1", semana: "S1", pontos: 0 },
  { key: "s2", semana: "S2", pontos: 0 },
  { key: "s3", semana: "S3", pontos: 0 },
  { key: "s4", semana: "S4", pontos: 0 },
  { key: "s5", semana: "S5", pontos: 0 },
];

export default function PerfilScreen() {
  const { session, signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const adolescenteId = session?.perfis.adolescenteId;
  const responsavelId =
    session?.usuario.tipo === "adolescente" &&
    session?.perfil &&
    "responsavelId" in session.perfil
      ? session.perfil.responsavelId
      : null;
  const [resumo, setResumo] = useState<AdolescenteProfileResumo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    if (!session || !adolescenteId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const ranking = await buscarRankingParaTela({
        periodo: "geral",
        adolescenteId,
        responsavelId,
      });
      const profile = await buscarResumoPerfilDoAdolescente({
        adolescenteId,
        usuario: session.usuario,
        ranking,
      });

      setResumo(profile);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [adolescenteId, responsavelId, session]);

  useFocusEffect(
    useCallback(() => {
      void carregar();
    }, [carregar]),
  );

  async function handleSignOut() {
    await signOut();
    router.replace("/(auth)/login-adolescente");
  }

  if (loading) {
    return (
      <SafeAreaView style={stylePainel.profileScreen}>
        <View
          style={[
            stylePainel.profileScrollContent,
            { flex: 1, justifyContent: "center" },
          ]}
        >
          <ActivityIndicator size="large" color="#9333EA" />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !resumo) {
    return (
      <SafeAreaView style={stylePainel.profileScreen}>
        <View
          style={[
            stylePainel.profileScrollContent,
            { flex: 1, justifyContent: "center" },
          ]}
        >
          <Text style={stylePainel.profileSectionTitle}>
            {error ?? "Nao foi possivel carregar o perfil."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const estatisticas = [
    {
      key: "missoes",
      label: "Missoes",
      value: resumo.totalMissoes,
      icon: <Feather name="target" size={18} color="#A855F7" />,
      backgroundColor: "#F3E8FF",
    },
    {
      key: "quizzes",
      label: "Quizzes",
      value: resumo.totalQuizzes,
      icon: <Ionicons name="book-outline" size={18} color="#3B82F6" />,
      backgroundColor: "#DBEAFE",
    },
    {
      key: "conquistas",
      label: "Conquistas",
      value: resumo.totalConquistas,
      icon: <Feather name="award" size={18} color="#F59E0B" />,
      backgroundColor: "#FEF3C7",
    },
  ];

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
              <Text style={stylePainel.profileAvatarText}>
                {getInitials(resumo.nome)}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              style={stylePainel.profileAvatarEditButton}
            >
              <Feather name="camera" size={12} color="#7C3AED" />
            </TouchableOpacity>
          </View>

          <Text style={stylePainel.profileName}>{resumo.nome}</Text>
          <Text style={stylePainel.profileHandle}>@{resumo.usuario}</Text>
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
              <Text style={stylePainel.profileSectionTitle}>
                Minhas Conquistas
              </Text>
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
              <Text style={stylePainel.profileSectionTitle}>
                Evolução Mensal
              </Text>
            </View>

            <View style={stylePainel.profileEvolutionCard}>
              <View style={stylePainel.profileEvolutionRow}>
                {evolucaoSemanal.map((item) => (
                  <View key={item.key} style={stylePainel.profileEvolutionItem}>
                    <Text style={stylePainel.profileEvolutionValue}>
                      {item.pontos}
                    </Text>
                    <Text style={stylePainel.profileEvolutionWeek}>
                      {item.semana}
                    </Text>
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
                    <Text style={stylePainel.profileSettingLabel}>
                      {item.label}
                    </Text>
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
