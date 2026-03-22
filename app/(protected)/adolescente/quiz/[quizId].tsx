import { useAuth } from "@/features/auth/context/AuthContext";
import { getQuizActionLabel } from "@/services/mappers";
import { loadQuizProgress } from "@/services/quiz-progress";
import { buscarQuizPublicoPorId } from "@/services/quizzes";
import { adolescenteQuizDetalheStyles as styles } from "@/styles/adolescente/quiz-detalhe";
import type { QuizPergunta } from "@/types/entities";
import type { QuizStatus } from "@/types/view-models";
import { getErrorMessage } from "@/utils/errors";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

function getPerguntasOrdenadas(perguntas?: QuizPergunta[]) {
  return [...(perguntas ?? [])].sort((left, right) => left.ordem - right.ordem);
}

function getDifficultyLabel(totalPerguntas: number) {
  if (totalPerguntas >= 12) {
    return "Avancado";
  }

  if (totalPerguntas >= 8) {
    return "Intermediario";
  }

  return "Inicial";
}

export default function QuizDetalheScreen() {
  const { quizId } = useLocalSearchParams<{ quizId: string }>();
  const { session } = useAuth();
  const insets = useSafeAreaInsets();
  const adolescenteId = session?.perfis.adolescenteId;
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [perguntas, setPerguntas] = useState<QuizPergunta[]>([]);
  const [status, setStatus] = useState<QuizStatus>("novo");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function voltarParaQuizzes() {
    router.replace("/(protected)/adolescente/quizzes");
  }

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function carregar() {
        if (!quizId) {
          if (active) {
            setLoading(false);
          }
          return;
        }

        try {
          setLoading(true);
          setError(null);
          const quiz = await buscarQuizPublicoPorId(String(quizId));

          if (!active) {
            return;
          }

          setTitulo(quiz.titulo);
          setDescricao(
            quiz.descricao?.trim() || "Quiz disponível para responder.",
          );
          setPerguntas(getPerguntasOrdenadas(quiz.perguntas));

          const progress = await loadQuizProgress({
            adolescenteId,
            quizId: String(quizId),
          });

          if (active) {
            setStatus(progress?.status ?? "novo");
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
    }, [adolescenteId, quizId]),
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.stateContainer}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </SafeAreaView>
    );
  }

  if (error || !titulo) {
    return (
      <SafeAreaView style={styles.stateContainer}>
        <TouchableOpacity
          activeOpacity={0.82}
          onPress={voltarParaQuizzes}
          style={styles.inlineBackButton}
        >
          <Feather name="arrow-left" size={18} color="#101828" />
          <Text style={styles.inlineBackText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.stateTitle}>Quiz não encontrado</Text>
        <Text style={styles.stateText}>
          {error ?? "Não foi possível carregar os detalhes desse quiz."}
        </Text>
      </SafeAreaView>
    );
  }

  const totalPerguntas = perguntas.length;
  const dificuldade = getDifficultyLabel(totalPerguntas);
  const acao = getQuizActionLabel(status);

  function handlePrimaryAction() {
    const restartParam = status === "concluido" ? "?restart=1" : "";

    router.push(
      `/(protected)/adolescente/quiz/${String(quizId)}/responder${restartParam}` as any,
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={[]}>
      <LinearGradient
        colors={["#6D28F0", "#4F46E5", "#2563EB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <TouchableOpacity
          activeOpacity={0.82}
          onPress={voltarParaQuizzes}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={22} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.headerTitleRow}>
          <MaterialCommunityIcons
            name="book-open-page-variant-outline"
            size={22}
            color="#FFF"
          />
          <Text style={styles.headerTitle}>{titulo}</Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <Text style={styles.heroDescription}>{descricao}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaCard}>
              <Text style={styles.metaValue}>{totalPerguntas}</Text>
              <Text style={styles.metaLabel}>Questões</Text>
            </View>
            <View style={styles.metaCard}>
              <Text style={styles.metaValue}>{dificuldade}</Text>
              <Text style={styles.metaLabel}>Nível</Text>
            </View>
            <View style={styles.metaCard}>
              <Text style={styles.metaValue}>{totalPerguntas * 10}</Text>
              <Text style={styles.metaLabel}>XP potencial</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="list-outline" size={18} color="#4F46E5" />
            <Text style={styles.sectionTitle}>Preview das perguntas</Text>
          </View>

          {perguntas.length ? (
            perguntas.map((pergunta, index) => (
              <View key={pergunta.id} style={styles.questionPreviewCard}>
                <Text style={styles.questionBadge}>Questão {index + 1}</Text>
                <Text style={styles.questionText}>{pergunta.enunciado}</Text>
                <Text style={styles.questionMeta}>
                  {pergunta.alternativas.length} Alternativas Disponíveis
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>
              Esse quiz ainda não possui perguntas publicadas.
            </Text>
          )}
        </View>

        <TouchableOpacity
          activeOpacity={0.88}
          style={[
            styles.primaryButton,
            (!adolescenteId || !perguntas.length) &&
              styles.primaryButtonDisabled,
          ]}
          disabled={!adolescenteId || !perguntas.length}
          onPress={handlePrimaryAction}
        >
          <Feather name="play-circle" size={18} color="#FFF" />
          <Text style={styles.primaryButtonText}>{acao}</Text>
        </TouchableOpacity>

        {!adolescenteId ? (
          <Text style={styles.helpText}>
            Entre com um perfil de adolescente para enviar uma tentativa.
          </Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
