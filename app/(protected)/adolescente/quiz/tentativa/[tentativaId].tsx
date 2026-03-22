import {
  buscarQuizPublicoPorId,
  buscarTentativaQuiz,
} from "@/services/quizzes";
import { adolescenteResultadoQuizStyles as styles } from "@/styles/adolescente/resultado-quiz";
import { formatDateTime } from "@/utils/date";
import { getErrorMessage } from "@/utils/errors";
import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
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

type ResultadoState = {
  quizTitulo: string;
  pontuacao: number;
  acertos: number;
  totalPerguntas: number;
  percentualAcertos: number;
  finalizadoEm: string;
};

function getMensagem(percentualAcertos: number) {
  if (percentualAcertos >= 80) {
    return "Excelente desempenho!\nVocê mandou muito bem nesse quiz.";
  }

  if (percentualAcertos >= 50) {
    return "Bom trabalho.\nVocê já está no caminho certo para evoluir ainda mais.";
  }

  return "Cada tentativa ajuda no aprendizado.\nRevise o conteúdo e tente novamente quando quiser.";
}

export default function ResultadoQuizScreen() {
  const { tentativaId } = useLocalSearchParams<{ tentativaId: string }>();
  const insets = useSafeAreaInsets();
  const [resultado, setResultado] = useState<ResultadoState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function carregar() {
      if (!tentativaId) {
        if (active) {
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const tentativa = await buscarTentativaQuiz(String(tentativaId));
        const quiz = await buscarQuizPublicoPorId(tentativa.quizId);
        const percentualAcertos =
          tentativa.totalPerguntas > 0
            ? Math.round((tentativa.acertos / tentativa.totalPerguntas) * 100)
            : 0;

        if (!active) {
          return;
        }

        setResultado({
          quizTitulo: quiz.titulo,
          pontuacao: tentativa.pontuacao,
          acertos: tentativa.acertos,
          totalPerguntas: tentativa.totalPerguntas,
          percentualAcertos,
          finalizadoEm: tentativa.finalizadoEm,
        });
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
  }, [tentativaId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.stateContainer}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </SafeAreaView>
    );
  }

  if (error || !resultado) {
    return (
      <SafeAreaView style={styles.stateContainer}>
        <TouchableOpacity
          activeOpacity={0.82}
          onPress={() => router.replace("/(protected)/adolescente/quizzes")}
          style={styles.inlineBackButton}
        >
          <Feather name="arrow-left" size={18} color="#101828" />
          <Text style={styles.inlineBackText}>Voltar para quizzes</Text>
        </TouchableOpacity>
        <Text style={styles.stateTitle}>Tentativa indisponível</Text>
        <Text style={styles.stateText}>
          {error ?? "Não foi possível carregar o resultado dessa tentativa."}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={[]}>
      <LinearGradient
        colors={["#16A34A", "#0EA5E9"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <View style={styles.successIcon}>
          <Ionicons name="checkmark" size={30} color="#16A34A" />
        </View>
        <Text style={styles.headerTitle}>Tentativa enviada</Text>
        <Text style={styles.headerSubtitle}>{resultado.quizTitulo}</Text>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Pontuação final</Text>
          <Text style={styles.scoreValue}>{resultado.pontuacao} XP</Text>
          <Text style={styles.scoreMessage}>
            {getMensagem(resultado.percentualAcertos)}
          </Text>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>
              {resultado.acertos}/{resultado.totalPerguntas}
            </Text>
            <Text style={styles.metricLabel}>Acertos</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>
              {resultado.percentualAcertos}%
            </Text>
            <Text style={styles.metricLabel}>Desempenho</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Finalizado em</Text>
          <Text style={styles.infoText}>
            {formatDateTime(resultado.finalizadoEm)}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.primaryButton}
          onPress={() => router.replace("/(protected)/adolescente/quizzes")}
        >
          <Text style={styles.primaryButtonText}>Voltar ao catálogo</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
