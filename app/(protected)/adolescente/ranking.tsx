import { useAuth } from "@/features/auth/context/AuthContext";
import { buscarRankingParaTela } from "@/services/ranking";
import { adolescenteRankingStyles as styles } from "@/styles/adolescente/ranking";
import type { RankingListaItem, RankingPeriod } from "@/types/view-models";
import { getErrorMessage } from "@/utils/errors";
import { getInitials } from "@/utils/initials";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const filters: { key: RankingPeriod; label: string }[] = [
  { key: "semanal", label: "Semanal" },
  { key: "mensal", label: "Mensal" },
  { key: "geral", label: "Geral" },
];

function TrendIcon() {
  return <Text style={styles.trendNeutral}>-</Text>;
}

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
      label: "1o",
    },
    second: {
      avatarStyle: styles.secondAvatar,
      baseStyle: styles.secondBase,
      label: "2o",
    },
    third: {
      avatarStyle: styles.thirdAvatar,
      baseStyle: styles.thirdBase,
      icon: "medal-outline" as const,
      label: "3o",
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
      <Text style={styles.podiumPoints}>{item.pontos} pts</Text>
    </View>
  );
}

export default function RankingScreen() {
  const { session } = useAuth();
  const insets = useSafeAreaInsets();
  const [period, setPeriod] = useState<RankingPeriod>("semanal");
  const [ranking, setRanking] = useState<RankingListaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const adolescenteId = session?.perfis.adolescenteId;
  const responsavelId =
    session?.usuario.tipo === "adolescente" &&
    session?.perfil &&
    "responsavelId" in session.perfil
      ? session.perfil.responsavelId
      : null;

  useEffect(() => {
    let active = true;

    async function carregar() {
      if (!adolescenteId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await buscarRankingParaTela({
          periodo: period,
          adolescenteId,
          responsavelId,
        });

        if (active) {
          setRanking(data);
        }
      } catch (requestError) {
        if (active) {
          setError(getErrorMessage(requestError));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void carregar();

    return () => {
      active = false;
    };
  }, [adolescenteId, period, responsavelId]);

  const currentUser = useMemo(
    () => ranking.find((entry) => entry.isCurrentUser) ?? ranking[0],
    [ranking],
  );
  const topThree = ranking.slice(0, 3);

  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={[styles.content, { flex: 1, justifyContent: "center" }]}>
          <ActivityIndicator size="large" color="#FF6A00" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={[styles.content, { flex: 1, justifyContent: "center" }]}>
          <Text style={styles.heroTitle}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentUser) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={[styles.content, { flex: 1, justifyContent: "center" }]}>
          <Text style={styles.heroTitle}>Nenhum ranking disponivel.</Text>
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
            onPress={() => router.back()}
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
          <View style={styles.filterRow}>
            {filters.map((filter) => {
              const active = filter.key === period;

              return (
                <TouchableOpacity
                  key={filter.key}
                  activeOpacity={0.85}
                  onPress={() => setPeriod(filter.key)}
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
                    <TrendIcon />
                  </View>
                </View>
              </View>

              <View style={styles.currentScoreWrap}>
                <Text style={styles.currentScore}>{currentUser.pontos}</Text>
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
            <Text style={styles.cardTitle}>🏆 Top 3</Text>
          </View>

          <View style={styles.podiumRow}>
            {topThree[1] ? (
              <PodiumCard item={topThree[1]} variant="second" />
            ) : (
              <View />
            )}
            {topThree[0] ? (
              <PodiumCard item={topThree[0]} variant="first" />
            ) : (
              <View />
            )}
            {topThree[2] ? (
              <PodiumCard item={topThree[2]} variant="third" />
            ) : (
              <View />
            )}
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(220).delay(130)}
          style={styles.card}
        >
          <Text style={styles.listTitle}>Classificação Completa</Text>

          <View style={styles.fullList}>
            {ranking.map((entry) => (
              <View
                key={`${period}-${entry.id}`}
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
                      {entry.isCurrentUser ? " (Você)" : ""}
                    </Text>
                    <Text style={styles.listPoints}>
                      {entry.pontos} pontos XP
                    </Text>
                  </View>
                </View>

                <TrendIcon />
              </View>
            ))}
          </View>
        </Animated.View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
