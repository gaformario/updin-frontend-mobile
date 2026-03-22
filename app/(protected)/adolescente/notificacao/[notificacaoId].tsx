import { useAuth } from "@/features/auth/context/AuthContext";
import { buscarNotificacaoDoAdolescente } from "@/services/adolescente";
import { adolescenteNotificacaoAprovadaStyles as styles } from "@/styles/adolescente/notificacao-aprovada";
import type { MissaoValidadaNotificacaoResumo } from "@/types/view-models";
import { formatCurrency } from "@/utils/currency";
import { formatDateTime } from "@/utils/date";
import { getErrorMessage } from "@/utils/errors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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

export default function NotificacaoMissaoAprovadaScreen() {
  const { notificacaoId } = useLocalSearchParams<{ notificacaoId: string }>();
  const { session } = useAuth();
  const insets = useSafeAreaInsets();
  const adolescenteId = session?.perfis.adolescenteId;
  const [notificacao, setNotificacao] =
    useState<MissaoValidadaNotificacaoResumo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function carregar() {
      if (!adolescenteId || !notificacaoId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await buscarNotificacaoDoAdolescente(
          adolescenteId,
          String(notificacaoId),
        );

        if (active) {
          setNotificacao(data);
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
  }, [adolescenteId, notificacaoId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.stateContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </SafeAreaView>
    );
  }

  if (error || !notificacao) {
    return (
      <SafeAreaView style={styles.stateContainer}>
        <TouchableOpacity
          activeOpacity={0.82}
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.stateTitle}>Notificação não encontrada</Text>
        <Text style={styles.stateText}>
          {error ?? "Não foi possível carregar os detalhes dessa aprovação."}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={[]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          activeOpacity={0.82}
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.hero}>
          <View style={styles.heroIconWrap}>
            <Ionicons
              name="checkmark-circle-outline"
              size={54}
              color="#08A63B"
            />
          </View>
          <Text style={styles.heroTitle}>{notificacao.titulo}</Text>
          <Text style={styles.heroSubtitle}>{notificacao.subtitulo}</Text>
          <Text style={styles.missionTitle}>{notificacao.missaoTitulo}</Text>
        </View>

        {notificacao.temCreditoFinanceiro ? (
          <View style={styles.card}>
            <Text style={styles.financialLabel}>Valor Creditado</Text>
            <Text style={styles.financialValue}>
              +{formatCurrency(notificacao.valorCreditado)}
            </Text>

            <View style={styles.divider} />

            <View style={styles.moneyRow}>
              <Text style={styles.moneyRowLabel}>Saldo Anterior</Text>
              <Text style={styles.moneyRowValue}>
                {formatCurrency(notificacao.saldoAnterior)}
              </Text>
            </View>

            <View style={styles.moneyRow}>
              <Text style={styles.moneyRowLabel}>Missão Concluída</Text>
              <Text style={[styles.moneyRowValue, styles.moneyRowHighlight]}>
                +{formatCurrency(notificacao.valorCreditado)}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.moneyRow}>
              <Text style={styles.moneyRowLabel}>Novo Saldo</Text>
              <Text style={[styles.moneyRowValue, styles.moneyRowHighlight]}>
                {formatCurrency(notificacao.novoSaldo)}
              </Text>
            </View>
          </View>
        ) : null}

        <View style={styles.xpCard}>
          <View style={styles.xpIconWrap}>
            <MaterialCommunityIcons
              name="star-four-points"
              size={22}
              color="#FFF"
            />
          </View>
          <View>
            <Text style={styles.xpLabel}>Você também ganhou</Text>
            <Text style={styles.xpValue}>+{notificacao.xpGanho} Pontos XP</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Mensagem do Responsável</Text>
          <Text style={styles.infoText}>{notificacao.mensagem}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Data da Validação</Text>
          <Text style={styles.infoText}>
            {formatDateTime(notificacao.validadaEm)}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => router.push("/(protected)/adolescente/extrato" as any)}
          style={styles.ctaButton}
        >
          <Ionicons name="trending-up-outline" size={20} color="#047857" />
          <Text style={styles.ctaText}>Ver Extrato Atualizado</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
