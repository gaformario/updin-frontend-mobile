import { useAuth } from "@/features/auth/context/AuthContext";
import { buscarRankingParaTela } from "@/services/ranking";
import { adolescenteRankingStyles as styles } from "@/styles/adolescente/ranking";
import type {
  RankingListaItem,
  RankingPeriod,
  RankingTelaResumo,
} from "@/types/view-models";
import { getErrorMessage } from "@/utils/errors";
import { getInitials } from "@/utils/initials";
import {
  Entypo,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const PERIOD_FILTERS: { key: RankingPeriod; label: string }[] = [
  { key: "geral", label: "Geral" },
  { key: "semanal", label: "Semanal" },
  { key: "mensal", label: "Mensal" },
];

// function getPeriodoLabel(periodo: RankingPeriod) {
//   if (periodo === "semanal") {
//     return "Semanal";
//   }

//   if (periodo === "mensal") {
//     return "Mensal";
//   }

//   return "Geral";
// }

function PodiumCard({
  item,
  variant,
}: {
  item: RankingListaItem;
  variant: "first" | "second" | "third";
}) {
  const config = {
    first: {
      avatarStyle: styles.firstAvatar,
      baseStyle: styles.firstBase,
      icon: "trophy-outline" as const,
      label: "1º",
    },
    second: {
      avatarStyle: styles.secondAvatar,
      baseStyle: styles.secondBase,
      label: "2º",
    },
    third: {
      avatarStyle: styles.thirdAvatar,
      baseStyle: styles.thirdBase,
      icon: "medal-outline" as const,
      label: "3º",
    },
  }[variant];

  return (
    <View style={styles.podiumItem}>
      <View style={[styles.podiumAvatar, config.avatarStyle]}>
        <Text style={styles.avatarEmoji}>{getInitials(item.nome)}</Text>
      </View>
      <View style={[styles.podiumBase, config.baseStyle]}>
        {variant === "second" ? (
          <Ionicons name="medal-outline" size={18} color="#FFF" />
        ) : (
          <MaterialCommunityIcons name={config.icon} size={18} color="#FFF" />
        )}
        <Text style={styles.podiumPlace}>{config.label}</Text>
      </View>
      <Text style={styles.podiumName}>{item.nome.split(" ")[0]}</Text>
      <Text style={styles.podiumPoints}>{item.xp} XP</Text>
    </View>
  );
}

export default function RankingScreen() {
  const { session } = useAuth();
  const insets = useSafeAreaInsets();
  const adolescenteId = session?.perfis.adolescenteId;
  const cacheRef = useRef<Partial<Record<RankingPeriod, RankingTelaResumo>>>(
    {},
  );
  const [periodo, setPeriodo] = useState<RankingPeriod>("geral");
  const [rankingData, setRankingData] = useState<RankingTelaResumo | null>(
    null,
  );
  const rankingDataRef = useRef<RankingTelaResumo | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inlineError, setInlineError] = useState<string | null>(null);

  rankingDataRef.current = rankingData;

  useEffect(() => {
    let active = true;

    async function carregarPeriodo(targetPeriodo: RankingPeriod) {
      if (!adolescenteId) {
        setInitialLoading(false);
        setIsRefreshing(false);
        return;
      }

      const cachedData = cacheRef.current[targetPeriodo];

      if (cachedData) {
        setRankingData(cachedData);
        setInitialLoading(false);
        setIsRefreshing(true);
      } else if (!rankingDataRef.current) {
        setInitialLoading(true);
      } else {
        setIsRefreshing(true);
      }

      setError(null);
      setInlineError(null);

      try {
        const data = await buscarRankingParaTela({
          escopo: "global",
          periodo: targetPeriodo,
          adolescenteId,
        });

        if (!active) {
          return;
        }

        cacheRef.current[targetPeriodo] = data;
        setRankingData(data);
        setError(null);
        setInlineError(null);

        const periodosPendentes = PERIOD_FILTERS.map(
          (filter) => filter.key,
        ).filter(
          (candidate) =>
            candidate !== targetPeriodo && !cacheRef.current[candidate],
        );

        for (const candidate of periodosPendentes) {
          void buscarRankingParaTela({
            escopo: "global",
            periodo: candidate,
            adolescenteId,
          })
            .then((prefetchedData) => {
              cacheRef.current[candidate] = prefetchedData;
            })
            .catch(() => undefined);
        }
      } catch (requestError) {
        if (!active) {
          return;
        }

        const message = getErrorMessage(requestError);

        if (!cachedData && !rankingDataRef.current) {
          setError(message);
        } else {
          setInlineError(message);
        }
      } finally {
        if (active) {
          setInitialLoading(false);
          setIsRefreshing(false);
        }
      }
    }

    void carregarPeriodo(periodo);

    return () => {
      active = false;
    };
  }, [adolescenteId, periodo]);

  const currentUser = useMemo(
    () =>
      rankingData?.classificacaoCompleta.find((entry) => entry.isCurrentUser) ??
      rankingData?.classificacaoCompleta[0] ??
      null,
    [rankingData],
  );

  if (initialLoading && !rankingData) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={[styles.content, { flex: 1, justifyContent: "center" }]}>
          <ActivityIndicator size="large" color="#FF6A00" />
        </View>
      </SafeAreaView>
    );
  }

  if (error && !rankingData) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={[styles.content, { flex: 1, justifyContent: "center" }]}>
          <Text style={styles.heroTitle}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!rankingData || !currentUser) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={[styles.content, { flex: 1, justifyContent: "center" }]}>
          <Text style={styles.heroTitle}>Nenhum ranking de XP disponível.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={[]}>
      <Animated.ScrollView
        entering={FadeIn.duration(180)}
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={["#FF6A00", "#F43F5E", "#E6007A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { paddingTop: insets.top + 12 }]}
        >
          <TouchableOpacity
            activeOpacity={0.82}
            onPress={() => router.replace("/(protected)/adolescente/home")}
            style={styles.backButton}
          >
            <Feather name="arrow-left" size={20} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.heroTitleRow}>
            <MaterialCommunityIcons
              name="trophy-outline"
              size={22}
              color="#FFF"
            />
            <Text style={styles.heroTitle}>Ranking</Text>
          </View>
          <Text style={styles.heroSubtitle}>
            Compare seu desempenho com a galera
          </Text>
        </LinearGradient>

        <Animated.View
          entering={FadeInDown.duration(220).delay(40)}
          style={styles.filterWrap}
        >
          <View style={styles.filterHeader}>
            <Text style={styles.filterSectionLabel}>Período</Text>
            {isRefreshing ? (
              <View style={styles.refreshIndicator}>
                {/* <ActivityIndicator size="small" color="#FF5A00" /> */}
                {/* <Text style={styles.refreshLabel}>Atualizando...</Text> */}
              </View>
            ) : null}
          </View>

          <View style={styles.filterRow}>
            {PERIOD_FILTERS.map((filter) => {
              const active = filter.key === periodo;

              return (
                <TouchableOpacity
                  key={filter.key}
                  activeOpacity={0.85}
                  onPress={() => setPeriodo(filter.key)}
                  style={[
                    styles.filterButton,
                    active ? styles.filterButtonActive : null,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterLabel,
                      active ? styles.filterLabelActive : null,
                    ]}
                  >
                    {filter.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {inlineError ? (
            <Text style={styles.inlineErrorText}>{inlineError}</Text>
          ) : null}
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(220).delay(70)}>
          <LinearGradient
            colors={["#8A2BE2", "#E600C8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.currentCard}
          >
            <Text style={styles.currentLabel}>Sua Posição Atual</Text>

            <View style={styles.currentRow}>
              <View style={styles.currentUserWrap}>
                <View style={styles.currentAvatar}>
                  <Text style={styles.avatarEmoji}>
                    {getInitials(currentUser.nome)}
                  </Text>
                </View>
                <View>
                  <Text style={styles.currentName}>{currentUser.nome}</Text>
                  <View style={styles.currentMetaRow}>
                    <Text style={styles.currentRank}>
                      #{currentUser.posicao}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.currentScoreWrap}>
                <Text style={styles.currentScore}>{currentUser.xp}</Text>
                <Text style={styles.currentScoreLabel}>Pontos XP</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(220).delay(100)}
          style={styles.card}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>
              <Entypo name="trophy" size={18} color="#8A2BE2" /> Top 3
            </Text>
            <Text style={styles.cardMeta}>
              {rankingData.totalParticipantes} participantes
            </Text>
          </View>

          <View style={styles.podiumRow}>
            {rankingData.top3[1] ? (
              <PodiumCard item={rankingData.top3[1]} variant="second" />
            ) : (
              <View style={styles.podiumPlaceholder} />
            )}
            {rankingData.top3[0] ? (
              <PodiumCard item={rankingData.top3[0]} variant="first" />
            ) : (
              <View style={styles.podiumPlaceholder} />
            )}
            {rankingData.top3[2] ? (
              <PodiumCard item={rankingData.top3[2]} variant="third" />
            ) : (
              <View style={styles.podiumPlaceholder} />
            )}
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(220).delay(130)}
          style={styles.card}
        >
          <Text style={styles.listTitle}>Classificação Completa</Text>

          <View style={styles.fullList}>
            {rankingData.classificacaoCompleta.map((entry) => (
              <View
                key={`${rankingData.periodo}-${entry.id}`}
                style={[
                  styles.listItem,
                  entry.isCurrentUser ? styles.listItemHighlighted : null,
                ]}
              >
                <View style={styles.listLeading}>
                  {entry.posicao <= 3 ? (
                    <View
                      style={[
                        styles.rankBadge,
                        entry.posicao === 1
                          ? styles.rankBadgeGold
                          : entry.posicao === 2
                            ? styles.rankBadgeSilver
                            : styles.rankBadgeBronze,
                      ]}
                    >
                      {entry.posicao === 2 ? (
                        <Ionicons
                          name="medal-outline"
                          size={18}
                          color="#667085"
                        />
                      ) : (
                        <MaterialCommunityIcons
                          name={
                            entry.posicao === 1
                              ? "trophy-outline"
                              : "medal-outline"
                          }
                          size={18}
                          color={entry.posicao === 1 ? "#B7791F" : "#C26A2D"}
                        />
                      )}
                    </View>
                  ) : (
                    <View style={styles.rankNumberBubble}>
                      <Text style={styles.rankNumberText}>
                        #{entry.posicao}
                      </Text>
                    </View>
                  )}

                  <View style={styles.inlineAvatar}>
                    <Text style={styles.inlineAvatarEmoji}>
                      {getInitials(entry.nome)}
                    </Text>
                  </View>

                  <View>
                    <Text style={styles.listName}>
                      {entry.nome}
                      {entry.isCurrentUser ? " (Voce)" : ""}
                    </Text>
                    <Text style={styles.listPoints}>{entry.xp} XP</Text>
                  </View>
                </View>

                <Ionicons name="trending-up" size={20} color="#8B5CF6" />
              </View>
            ))}
          </View>
        </Animated.View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
