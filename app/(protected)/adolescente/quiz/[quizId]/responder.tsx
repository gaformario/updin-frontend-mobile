import { useAuth } from "@/features/auth/context/AuthContext";
import {
  loadQuizProgress,
  markQuizAsCompleted,
  saveQuizDraft,
} from "@/services/quiz-progress";
import {
  buscarQuizPublicoPorId,
  enviarTentativaQuiz,
} from "@/services/quizzes";
import { adolescenteResponderQuizStyles as styles } from "@/styles/adolescente/responder-quiz";
import type { QuizPergunta } from "@/types/entities";
import { getErrorMessage, getErrorTitle } from "@/utils/errors";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

export default function ResponderQuizScreen() {
  const { quizId, restart } = useLocalSearchParams<{
    quizId: string;
    restart?: string;
  }>();
  const { session } = useAuth();
  const insets = useSafeAreaInsets();
  const adolescenteId = session?.perfis.adolescenteId;
  const [titulo, setTitulo] = useState("");
  const [perguntas, setPerguntas] = useState<QuizPergunta[]>([]);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
        setPerguntas(getPerguntasOrdenadas(quiz.perguntas));

        if (adolescenteId && restart !== "1") {
          const progress = await loadQuizProgress({
            adolescenteId,
            quizId: String(quizId),
          });

          if (active && progress?.status === "em_progresso") {
            setRespostas(progress.respostas);
          }
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
  }, [adolescenteId, quizId, restart]);

  const totalPerguntas = perguntas.length;
  const respondidas = useMemo(
    () => perguntas.filter((pergunta) => respostas[pergunta.id]).length,
    [perguntas, respostas],
  );

  function selecionarAlternativa(perguntaId: string, alternativaId: string) {
    setRespostas((current) => ({
      ...current,
      [perguntaId]: alternativaId,
    }));
  }

  useEffect(() => {
    if (
      !adolescenteId ||
      !quizId ||
      !totalPerguntas ||
      !Object.keys(respostas).length
    ) {
      return;
    }

    void saveQuizDraft({
      adolescenteId,
      quizId: String(quizId),
      respostas,
      totalPerguntas,
    });
  }, [adolescenteId, quizId, respostas, totalPerguntas]);

  async function handleSubmit() {
    if (!quizId || !adolescenteId || saving) {
      return;
    }

    if (respondidas !== totalPerguntas) {
      Alert.alert(
        "Quiz incompleto",
        "Responda todas as perguntas antes de enviar a tentativa.",
      );
      return;
    }

    try {
      setSaving(true);
      const tentativa = await enviarTentativaQuiz({
        quizId: String(quizId),
        adolescenteId,
        respostas: perguntas.map((pergunta) => ({
          perguntaId: pergunta.id,
          alternativaId: respostas[pergunta.id],
        })),
      });

      await markQuizAsCompleted({
        adolescenteId,
        quizId: String(quizId),
        respostas,
        tentativaId: tentativa.id,
        pontuacao: tentativa.pontuacao,
        acertos: tentativa.acertos,
        totalPerguntas: tentativa.totalPerguntas,
        finalizadoEm: tentativa.finalizadoEm,
      });

      router.replace(
        `/(protected)/adolescente/quiz/tentativa/${tentativa.id}` as any,
      );
    } catch (requestError) {
      Alert.alert(getErrorTitle(requestError), getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

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
          onPress={() => router.back()}
          style={styles.inlineBackButton}
        >
          <Feather name="arrow-left" size={18} color="#101828" />
          <Text style={styles.inlineBackText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.stateTitle}>Quiz indisponível</Text>
        <Text style={styles.stateText}>
          {error ?? "Nao foi possivel abrir esse quiz para resposta."}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={[]}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          activeOpacity={0.82}
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Responder Quiz</Text>
        <Text style={styles.headerSubtitle}>{titulo}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.progressCard}>
          <Text style={styles.progressLabel}>Progresso</Text>
          <Text style={styles.progressValue}>
            {respondidas}/{totalPerguntas} respondidas
          </Text>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width:
                    totalPerguntas > 0
                      ? `${(respondidas / totalPerguntas) * 100}%`
                      : "0%",
                },
              ]}
            />
          </View>
        </View>

        {perguntas.map((pergunta, questionIndex) => (
          <View key={pergunta.id} style={styles.questionCard}>
            <Text style={styles.questionIndex}>
              Questao {questionIndex + 1}
            </Text>
            <Text style={styles.questionText}>{pergunta.enunciado}</Text>

            <View style={styles.optionsList}>
              {pergunta.alternativas.map((alternativa, optionIndex) => {
                const selected = respostas[pergunta.id] === alternativa.id;

                return (
                  <TouchableOpacity
                    key={alternativa.id}
                    activeOpacity={0.85}
                    style={[
                      styles.optionButton,
                      selected && styles.optionButtonSelected,
                    ]}
                    onPress={() =>
                      selecionarAlternativa(pergunta.id, alternativa.id)
                    }
                  >
                    <View
                      style={[
                        styles.optionBullet,
                        selected && styles.optionBulletSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionBulletText,
                          selected && styles.optionBulletTextSelected,
                        ]}
                      >
                        {String.fromCharCode(65 + optionIndex)}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.optionText,
                        selected && styles.optionTextSelected,
                      ]}
                    >
                      {alternativa.texto}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        <View style={styles.footerRow}>
          <TouchableOpacity
            activeOpacity={0.86}
            style={[styles.footerButton, styles.secondaryButton]}
            onPress={() => router.back()}
            disabled={saving}
          >
            <Text style={styles.secondaryButtonText}>Revisar depois</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.86}
            style={[styles.footerButton, styles.primaryButton]}
            onPress={() => void handleSubmit()}
            disabled={saving || !adolescenteId || !totalPerguntas}
          >
            <Text style={styles.primaryButtonText}>
              {saving ? "Enviando..." : "Enviar tentativa"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
