import { useAuth } from "@/features/auth/context/AuthContext";
import {
  buscarConquistasDoAdolescente,
  buscarEstatisticasDoAdolescente,
  buscarXpSemanalDoAdolescente,
} from "@/services/adolescente";
import { adolescentePerfilStyles as stylePainel } from "@/styles/adolescente/perfil";
import type {
  AdolescenteConquista,
  AdolescenteConquistas,
  AdolescenteEstatisticas,
  AdolescenteXpSemanal,
} from "@/types/entities";
import { getErrorMessage } from "@/utils/errors";
import { getInitials } from "@/utils/initials";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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

function normalizeKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function getConquistaMeta(conquista: AdolescenteConquista) {
  const key = `${normalizeKey(conquista.codigo)}|${normalizeKey(conquista.nome)}`;

  if (key.includes("primeira")) {
    return {
      icon: <Feather name="target" size={20} color="#7C3AED" />,
      activeBackgroundColor: "#F3E8FF",
    };
  }

  if (key.includes("poupador")) {
    return {
      icon: (
        <MaterialCommunityIcons
          name="piggy-bank-outline"
          size={20}
          color="#16A34A"
        />
      ),
      activeBackgroundColor: "#DCFCE7",
    };
  }

  if (key.includes("estudante")) {
    return {
      icon: <Ionicons name="book-outline" size={20} color="#2563EB" />,
      activeBackgroundColor: "#DBEAFE",
    };
  }

  if (key.includes("focado")) {
    return {
      icon: <Feather name="crosshair" size={20} color="#F97316" />,
      activeBackgroundColor: "#FFEDD5",
    };
  }

  if (key.includes("estrela")) {
    return {
      icon: <Ionicons name="star-outline" size={20} color="#F59E0B" />,
      activeBackgroundColor: "#FEF3C7",
    };
  }

  if (key.includes("sequencia")) {
    return {
      icon: <MaterialCommunityIcons name="fire" size={20} color="#EF4444" />,
      activeBackgroundColor: "#FEE2E2",
    };
  }

  return {
    icon: <Feather name="award" size={20} color="#8B5CF6" />,
    activeBackgroundColor: "#F3E8FF",
  };
}

type PerfilData = {
  estatisticas: AdolescenteEstatisticas;
  conquistas: AdolescenteConquistas;
  xpSemanal: AdolescenteXpSemanal;
};

export default function PerfilScreen() {
  const { session, signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const adolescenteId = session?.perfis.adolescenteId;
  const [perfilData, setPerfilData] = useState<PerfilData | null>(null);
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
      const [estatisticas, conquistas, xpSemanal] = await Promise.all([
        buscarEstatisticasDoAdolescente(adolescenteId),
        buscarConquistasDoAdolescente(adolescenteId),
        buscarXpSemanalDoAdolescente(adolescenteId),
      ]);

      setPerfilData({
        estatisticas,
        conquistas,
        xpSemanal,
      });
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

  async function handleSignOut() {
    await signOut();
    router.replace("/(auth)/login-adolescente");
  }

  const semanas = useMemo(
    () =>
      [...(perfilData?.xpSemanal.semanas ?? [])].sort(
        (left, right) => left.numero - right.numero,
      ),
    [perfilData?.xpSemanal.semanas],
  );
  const maiorXpSemanal = Math.max(
    ...semanas.map((semana) => semana.xpGanho),
    1,
  );

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

  if (error || !perfilData || !session) {
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

  const { estatisticas, conquistas, xpSemanal } = perfilData;
  const estatisticasResumo = [
    {
      key: "missoes",
      label: "Missões",
      value: String(estatisticas.missoesConcluidas),
      icon: <Feather name="target" size={18} color="#A855F7" />,
      backgroundColor: "#F3E8FF",
    },
    {
      key: "quizzes",
      label: "Quizzes",
      value: String(estatisticas.quizzesCompletos),
      icon: <Ionicons name="book-outline" size={18} color="#3B82F6" />,
      backgroundColor: "#DBEAFE",
    },
    {
      key: "conquistas",
      label: "Conquistas",
      value: `${estatisticas.conquistasAlcancadas}/${estatisticas.totalConquistas}`,
      icon: <Feather name="award" size={18} color="#F59E0B" />,
      backgroundColor: "#FEF3C7",
    },
    {
      key: "xp",
      label: "XP Total",
      value: String(estatisticas.xpTotal),
      icon: (
        <MaterialCommunityIcons
          name="flash-outline"
          size={18}
          color="#16A34A"
        />
      ),
      backgroundColor: "#DCFCE7",
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
                {getInitials(session.usuario.nome)}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              style={stylePainel.profileAvatarEditButton}
            >
              <Feather name="camera" size={12} color="#7C3AED" />
            </TouchableOpacity>
          </View>

          <Text style={stylePainel.profileName}>{session.usuario.nome}</Text>
          <Text style={stylePainel.profileHandle}>
            @{session.usuario.usuario}
          </Text>
        </LinearGradient>

        <Animated.View entering={FadeInDown.duration(220).delay(30)}>
          <View style={stylePainel.profileStatsCard}>
            <Text style={stylePainel.profileSectionTitle}>Estatísticas</Text>

            <View style={stylePainel.profileStatsRow}>
              {estatisticasResumo.map((item) => (
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
              <Text style={stylePainel.profileSectionTitle}>Conquistas</Text>
              <Text style={stylePainel.profileSectionMeta}>
                {conquistas.conquistasAlcancadas}/{conquistas.totalConquistas}
              </Text>
            </View>

            <View style={stylePainel.profileBadgeGrid}>
              {conquistas.conquistas.map((item) => {
                const meta = getConquistaMeta(item);

                return (
                  <View
                    key={item.codigo}
                    style={[
                      stylePainel.profileBadgeCard,
                      item.conquistada
                        ? [
                            stylePainel.profileBadgeCardActive,
                            { backgroundColor: meta.activeBackgroundColor },
                          ]
                        : stylePainel.profileBadgeCardInactive,
                    ]}
                  >
                    <View style={stylePainel.profileBadgeIconWrap}>
                      {meta.icon}
                    </View>
                    <Text
                      style={[
                        stylePainel.profileBadgeLabel,
                        !item.conquistada &&
                          stylePainel.profileBadgeLabelInactive,
                      ]}
                    >
                      {item.nome}
                    </Text>
                    <Text
                      style={[
                        stylePainel.profileBadgeDescription,
                        !item.conquistada &&
                          stylePainel.profileBadgeDescriptionInactive,
                      ]}
                    >
                      {item.descricao}
                    </Text>
                  </View>
                );
              })}
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
                Evolução Semanal
              </Text>
              <Text style={stylePainel.profileSectionMeta}>
                {xpSemanal.xpTotal} XP
              </Text>
            </View>

            {semanas.length ? (
              <View style={stylePainel.profileEvolutionCard}>
                <View style={stylePainel.profileEvolutionRow}>
                  {semanas.map((item) => (
                    <View
                      key={item.semana}
                      style={stylePainel.profileEvolutionItem}
                    >
                      <Text style={stylePainel.profileEvolutionValue}>
                        +{item.xpGanho}
                      </Text>
                      <View style={stylePainel.profileEvolutionBarTrack}>
                        <View
                          style={[
                            stylePainel.profileEvolutionBarFill,
                            {
                              height: `${Math.max(
                                (item.xpGanho / maiorXpSemanal) * 100,
                                12,
                              )}%`,
                            },
                          ]}
                        />
                      </View>
                      <Text style={stylePainel.profileEvolutionWeek}>
                        S{item.numero}
                      </Text>
                      <Text style={stylePainel.profileEvolutionAccumulated}>
                        {item.xpAcumulado} XP
                      </Text>
                    </View>
                  ))}
                </View>

                <Text style={stylePainel.profileEvolutionCaption}>
                  XP ganho por semana
                </Text>
              </View>
            ) : (
              <Text style={stylePainel.profileEmptyText}>
                Ainda não há semanas com progresso de XP para exibir.
              </Text>
            )}
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
