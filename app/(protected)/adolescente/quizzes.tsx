import { useAuth } from "@/features/auth/context/AuthContext";
import {
  buscarResumoQuizzesDoAdolescente,
  listarQuizzesParaAdolescente,
} from "@/services/quizzes";
import { adolescenteQuizzesStyles as styles } from "@/styles/adolescente/quizzes";
import type { AdolescenteQuizResumo, QuizzesResumo, QuizStatus } from "@/types/view-models";
import { getErrorMessage } from "@/utils/errors";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const iconMap: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  poupanca: "bank-outline",
  educacao: "school-outline",
  investimento: "chart-line",
};

const statusMap: Record<
  QuizStatus,
  { label: string; containerStyle: object; textStyle: object }
> = {
  novo: {
    label: "Novo",
    containerStyle: styles.badgeBlue,
    textStyle: styles.badgeBlueText,
  },
  em_progresso: {
    label: "Em Progresso",
    containerStyle: styles.badgeOrange,
    textStyle: styles.badgeOrangeText,
  },
  concluido: {
    label: "Concluido",
    containerStyle: styles.badgeGreen,
    textStyle: styles.badgeGreenText,
  },
};

function DifficultyStars({ value }: { value: AdolescenteQuizResumo["dificuldade"] }) {
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

export default function QuizzesScreen() {
  const { session } = useAuth();
  const insets = useSafeAreaInsets();
  const adolescenteId = session?.perfis.adolescenteId;
  const [summary, setSummary] = useState<QuizzesResumo>({
    concluidos: 0,
    pontosXp: 0,
    acertosPercentual: 0,
  });
  const [quizzes, setQuizzes] = useState<AdolescenteQuizResumo[]>([]);
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
      const [resumo, lista] = await Promise.all([
        buscarResumoQuizzesDoAdolescente(adolescenteId),
        listarQuizzesParaAdolescente(adolescenteId),
      ]);

      setSummary(resumo);
      setQuizzes(lista);
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
          <TouchableOpacity style={styles.actionButtonPrimary} onPress={() => void carregar()}>
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
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
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
            onPress={() => router.back()}
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

        <Animated.View entering={FadeInDown.duration(220).delay(40)} style={styles.summaryRow}>
          {[
            { label: "Concluidos", value: String(summary.concluidos) },
            { label: "Pontos XP", value: String(summary.pontosXp) },
            { label: "Acertos", value: `${summary.acertosPercentual}%` },
          ].map((item) => (
            <View key={item.label} style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{item.value}</Text>
              <Text style={styles.summaryLabel}>{item.label}</Text>
            </View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(220).delay(80)} style={styles.list}>
          {quizzes.length ? (
            quizzes.map((quiz, index) => {
              const status = statusMap[quiz.status];
              const iconKey = quiz.categoria.toLowerCase().split(" ")[0];

              return (
                <Animated.View
                  key={quiz.id}
                  entering={FadeInDown.duration(220).delay(110 + index * 35)}
                  style={styles.quizCard}
                >
                  <View style={styles.quizHeader}>
                    <View style={styles.quizIconWrap}>
                      <MaterialCommunityIcons
                        name={iconMap[iconKey] ?? "book-open-page-variant-outline"}
                        size={24}
                        color="#8B5CF6"
                      />
                    </View>

                    <View style={styles.quizMain}>
                      <View style={styles.quizTitleRow}>
                        <Text style={styles.quizTitle}>{quiz.titulo}</Text>
                        <View style={[styles.badgeBase, status.containerStyle]}>
                          <Text style={[styles.badgeTextBase, status.textStyle]}>
                            {status.label}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.quizCategory}>{quiz.categoria}</Text>

                      <View style={styles.quizMetaRow}>
                        <View style={styles.quizMetaItem}>
                          <Feather name="clock" size={12} color="#667085" />
                          <Text style={styles.quizMetaText}>{quiz.questoes} questoes</Text>
                        </View>
                        <DifficultyStars value={quiz.dificuldade} />
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.86}
                    style={styles.actionButtonPrimary}
                    onPress={() =>
                      Alert.alert(
                        "Em breve",
                        "A API de quizzes ja esta integrada, mas a tela de tentativa ainda nao existe neste app.",
                      )
                    }
                  >
                    <Ionicons name="play-outline" size={16} color="#FFF" />
                    <Text style={styles.actionButtonTextPrimary}>
                      {quiz.acao}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            })
          ) : (
            <Text style={styles.heroSubtitle}>Nenhum quiz disponivel no momento.</Text>
          )}
        </Animated.View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}