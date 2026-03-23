import { useAuth } from "@/features/auth/context/AuthContext";
import {
  buildPublicQuizzesResumo,
  getQuizActionLabel,
} from "@/services/mappers";
import { loadQuizProgressMap } from "@/services/quiz-progress";
import { listarQuizzesDoCatalogoPublico } from "@/services/quizzes";
import { adolescenteQuizzesStyles as styles } from "@/styles/adolescente/quizzes";
import type {
  PublicQuizResumo,
  PublicQuizzesResumo,
  QuizStatus,
} from "@/types/view-models";
import { getErrorMessage } from "@/utils/errors";
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

const iconMap: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  poupanca: "bank-outline",
  educacao: "school-outline",
  investimento: "chart-line",
};

const statusAppearance: Record<
  QuizStatus,
  {
    badgeLabel: string;
    badgeContainerStyle: object;
    badgeTextStyle: object;
  }
> = {
  novo: {
    badgeLabel: "Novo",
    badgeContainerStyle: styles.badgeBlue,
    badgeTextStyle: styles.badgeBlueText,
  },
  em_progresso: {
    badgeLabel: "Em progresso",
    badgeContainerStyle: styles.badgeOrange,
    badgeTextStyle: styles.badgeOrangeText,
  },
  concluido: {
    badgeLabel: "Concluido",
    badgeContainerStyle: styles.badgeGreen,
    badgeTextStyle: styles.badgeGreenText,
  },
};

function DifficultyStars({
  value,
}: {
  value: PublicQuizResumo["dificuldade"];
}) {
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3].map((star) => (
        <Ionicons
          key={star}
          name="star"
          size={13}
          color={star <= value ? "#F6B100" : "#D8DCE5"}
        />
      ))}
    </View>
  );
}

function mergeQuizStatus(
  quiz: PublicQuizResumo,
  progressStatus?: QuizStatus,
): PublicQuizResumo {
  const status = progressStatus ?? "novo";

  return {
    ...quiz,
    status,
    acao: getQuizActionLabel(status),
  };
}

export default function QuizzesScreen() {
  const { session } = useAuth();
  const insets = useSafeAreaInsets();
  const adolescenteId = session?.perfis.adolescenteId;
  const [summary, setSummary] = useState<PublicQuizzesResumo>({
    concluidos: 0,
    pontosXp: 0,
    acertosPercentual: 0,
  });
  const [quizzes, setQuizzes] = useState<PublicQuizResumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [lista, progressMap] = await Promise.all([
        listarQuizzesDoCatalogoPublico(),
        loadQuizProgressMap(adolescenteId),
      ]);

      const quizzesComStatus = lista.map((quiz) =>
        mergeQuizStatus(quiz, progressMap[quiz.id]?.status),
      );
      const concluidos = Object.values(progressMap).filter(
        (progress) => progress.status === "concluido",
      );
      const pontosXp = concluidos.reduce(
        (total, progress) => total + (progress.pontuacao ?? 0),
        0,
      );
      const acertos = concluidos.reduce(
        (total, progress) => total + (progress.acertos ?? 0),
        0,
      );
      const totalPerguntas = concluidos.reduce(
        (total, progress) => total + progress.totalPerguntas,
        0,
      );
      const acertosPercentual =
        totalPerguntas > 0 ? Math.round((acertos / totalPerguntas) * 100) : 0;

      setSummary(
        buildPublicQuizzesResumo({
          concluidos: concluidos.length,
          pontosXp,
          acertosPercentual,
        }),
      );
      setQuizzes(quizzesComStatus);
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

  function abrirDetalheQuiz(quizId: string) {
    router.push(`/(protected)/adolescente/quiz/${quizId}` as any);
  }

  function handleQuizAction(quiz: PublicQuizResumo) {
    const restartParam = quiz.status === "concluido" ? "?restart=1" : "";

    router.push(
      `/(protected)/adolescente/quiz/${quiz.id}/responder${restartParam}` as any,
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={[styles.content, { flex: 1, justifyContent: "center" }]}>
          <ActivityIndicator size="large" color="#8B3DFF" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={[styles.content, { flex: 1, justifyContent: "center" }]}>
          <Text style={styles.heroTitle}>{error}</Text>
          <TouchableOpacity
            style={[styles.actionButtonPrimary, styles.actionButtonError]}
            onPress={() => void carregar()}
          >
            <Text style={styles.actionButtonTextPrimary}>Tentar novamente</Text>
          </TouchableOpacity>
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
          colors={["#8B3DFF", "#6D28F0", "#4B35F5"]}
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
            <Ionicons name="book-outline" size={22} color="#FFF" />
            <Text style={styles.heroTitle}>Quizzes</Text>
          </View>
          <Text style={styles.heroSubtitle}>Aprenda e ganhe pontos XP!</Text>
        </LinearGradient>

        <Animated.View
          entering={FadeInDown.duration(220).delay(40)}
          style={styles.summarySection}
        >
          <View style={styles.summaryRow}>
            {[
              { label: "Concluídos", value: String(summary.concluidos) },
              { label: "Pontos XP", value: String(summary.pontosXp) },
              { label: "Acertos", value: `${summary.acertosPercentual}%` },
            ].map((item) => (
              <View key={item.label} style={styles.summaryCard}>
                <Text style={styles.summaryValue}>{item.value}</Text>
                <Text style={styles.summaryLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.duration(220).delay(80)}
          style={styles.list}
        >
          {quizzes.length ? (
            quizzes.map((quiz, index) => {
              const iconKey = quiz.categoria.toLowerCase().split(" ")[0];
              const appearance = statusAppearance[quiz.status];
              const isCompleted = quiz.status === "concluido";

              return (
                <Animated.View
                  key={quiz.id}
                  entering={FadeInDown.duration(220).delay(110 + index * 35)}
                  style={styles.quizCard}
                >
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.quizHeader}
                    onPress={() => abrirDetalheQuiz(quiz.id)}
                  >
                    <View style={styles.quizIconWrap}>
                      <MaterialCommunityIcons
                        name={
                          iconMap[iconKey] ?? "book-open-page-variant-outline"
                        }
                        size={24}
                        color="#8B5CF6"
                      />
                    </View>

                    <View style={styles.quizMain}>
                      <View style={styles.quizTitleRow}>
                        <Text style={styles.quizTitle}>{quiz.titulo}</Text>
                        <View
                          style={[
                            styles.badgeBase,
                            appearance.badgeContainerStyle,
                          ]}
                        >
                          <Text
                            style={[
                              styles.badgeTextBase,
                              appearance.badgeTextStyle,
                            ]}
                          >
                            {appearance.badgeLabel}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.quizCategory}>{quiz.categoria}</Text>

                      <View style={styles.quizMetaRow}>
                        <View style={styles.quizMetaItem}>
                          <Feather name="clock" size={12} color="#667085" />
                          <Text style={styles.quizMetaText}>
                            {quiz.questoes} questões
                          </Text>
                        </View>
                        <DifficultyStars value={quiz.dificuldade} />
                      </View>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.86}
                    style={styles.actionButton}
                    onPress={() => handleQuizAction(quiz)}
                  >
                    {isCompleted ? (
                      <View
                        style={[
                          styles.actionButtonPrimary,
                          styles.actionButtonMuted,
                        ]}
                      >
                        <Feather name="rotate-cw" size={15} color="#667085" />
                        <Text
                          style={[
                            styles.actionButtonTextPrimary,
                            styles.actionButtonTextMuted,
                          ]}
                        >
                          {quiz.acao}
                        </Text>
                      </View>
                    ) : (
                      <LinearGradient
                        colors={["#B517FF", "#5B41F5"]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.actionButtonPrimary}
                      >
                        <Ionicons name="play-outline" size={16} color="#FFF" />
                        <Text style={styles.actionButtonTextPrimary}>
                          {quiz.acao}
                        </Text>
                      </LinearGradient>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              );
            })
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>
                Nenhum quiz publico disponível
              </Text>
              <Text style={styles.emptyText}>
                Assim que novos quizzes forem publicados, eles aparecerão aqui
                para todo adolescente.
              </Text>
            </View>
          )}
        </Animated.View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
