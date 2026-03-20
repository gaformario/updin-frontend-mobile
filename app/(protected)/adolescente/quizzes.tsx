import { adolescenteQuizzesStyles as styles } from "@/styles/adolescente/quizzes";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

type QuizStatus = "novo" | "em_progresso" | "concluido";

type QuizItem = {
  id: string;
  titulo: string;
  categoria: string;
  questoes: number;
  dificuldade: 1 | 2 | 3;
  status: QuizStatus;
  acao: string;
  icone: keyof typeof MaterialCommunityIcons.glyphMap;
};

const summary = [
  { label: "Concluídos", value: "12" },
  { label: "Pontos XP", value: "850" },
  { label: "Acertos", value: "87%" },
];

const quizzes: QuizItem[] = [
  {
    id: "quiz-1",
    titulo: "Introdução à Poupança",
    categoria: "Poupança",
    questoes: 10,
    dificuldade: 1,
    status: "novo",
    acao: "Jogar",
    icone: "bank-outline",
  },
  {
    id: "quiz-2",
    titulo: "Entendendo Investimentos",
    categoria: "Investimentos",
    questoes: 12,
    dificuldade: 2,
    status: "em_progresso",
    acao: "Continuar",
    icone: "chart-line",
  },
  {
    id: "quiz-3",
    titulo: "Orçamento Pessoal",
    categoria: "Planejamento",
    questoes: 8,
    dificuldade: 1,
    status: "concluido",
    acao: "Jogar Novamente",
    icone: "chart-bar",
  },
  {
    id: "quiz-4",
    titulo: "Conceitos de Juros",
    categoria: "Matemática Financeira",
    questoes: 15,
    dificuldade: 3,
    status: "novo",
    acao: "Jogar",
    icone: "cash-multiple",
  },
  {
    id: "quiz-5",
    titulo: "Consumo Consciente",
    categoria: "Educação",
    questoes: 10,
    dificuldade: 1,
    status: "novo",
    acao: "Jogar",
    icone: "recycle",
  },
];

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
    label: "Concluído",
    containerStyle: styles.badgeGreen,
    textStyle: styles.badgeGreenText,
  },
};

function DifficultyStars({ value }: { value: QuizItem["dificuldade"] }) {
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
  const insets = useSafeAreaInsets();

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
          {summary.map((item) => (
            <View key={item.label} style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{item.value}</Text>
              <Text style={styles.summaryLabel}>{item.label}</Text>
            </View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(220).delay(80)} style={styles.list}>
          {quizzes.map((quiz, index) => {
            const status = statusMap[quiz.status];

            return (
              <Animated.View
                key={quiz.id}
                entering={FadeInDown.duration(220).delay(110 + index * 35)}
                style={styles.quizCard}
              >
                <View style={styles.quizHeader}>
                  <View style={styles.quizIconWrap}>
                    <MaterialCommunityIcons
                      name={quiz.icone}
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
                        <Text style={styles.quizMetaText}>{quiz.questoes} questões</Text>
                      </View>
                      <DifficultyStars value={quiz.dificuldade} />
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  activeOpacity={0.86}
                  style={[
                    styles.actionButton,
                    quiz.status === "concluido"
                      ? styles.actionButtonMuted
                      : styles.actionButtonPrimary,
                  ]}
                >
                  <Ionicons
                    name={quiz.status === "concluido" ? "refresh-circle-outline" : "play-outline"}
                    size={16}
                    color={quiz.status === "concluido" ? "#667085" : "#FFF"}
                  />
                  <Text
                    style={[
                      styles.actionButtonText,
                      quiz.status === "concluido"
                        ? styles.actionButtonTextMuted
                        : styles.actionButtonTextPrimary,
                    ]}
                  >
                    {quiz.acao}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </Animated.View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
