import { colors } from "@/constants/colors";
import { useAuth } from "@/features/auth/context/AuthContext";
import { buscarMissaoDoAdolescente } from "@/services/adolescente";
import { adolescenteDetalhesMissaoStyles as styles } from "@/styles/adolescente/detalhes-missao";
import type { MissaoValidacao } from "@/types/painel-financeiro";
import { formatCurrency } from "@/utils/currency";
import { formatDate } from "@/utils/date";
import { getErrorMessage } from "@/utils/errors";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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

const statusLabels: Record<MissaoValidacao["status"], string> = {
  aguardando_validacao: "Status: Aguardando validação",
  em_andamento: "Status: Em andamento",
  pendente: "Status: Pendente",
  aprovada: "Status: Aprovada",
};

function InfoCard({
  title,
  icon,
  children,
  highlighted = false,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  highlighted?: boolean;
}) {
  return (
    <View
      style={[styles.infoCard, highlighted ? styles.infoCardHighlighted : null]}
    >
      <View style={styles.infoHeader}>
        {icon}
        <Text style={styles.infoTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

export default function MissaoDetalhesScreen() {
  const { missaoId } = useLocalSearchParams<{ missaoId: string }>();
  const { session } = useAuth();
  const insets = useSafeAreaInsets();
  const adolescenteId = session?.perfis.adolescenteId;
  const [missao, setMissao] = useState<MissaoValidacao | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function carregar() {
      if (!adolescenteId || !missaoId) {
        if (active) {
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await buscarMissaoDoAdolescente(
          adolescenteId,
          String(missaoId),
        );

        if (active) {
          setMissao(data);
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
  }, [adolescenteId, missaoId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.notFoundContainer}>
        <ActivityIndicator size="large" color="#8B3DFF" />
      </SafeAreaView>
    );
  }

  if (error || !missao) {
    return (
      <SafeAreaView style={styles.notFoundContainer}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.back()}
          style={styles.notFoundBack}
        >
          <Feather name="arrow-left" size={18} color={colors.neutral.text} />
          <Text style={styles.notFoundBackText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.notFoundTitle}>Missao nao encontrada</Text>
        <Text style={styles.notFoundText}>
          {error ??
            "Nao encontramos os detalhes dessa missao para esse adolescente."}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={[]}>
      <LinearGradient
        colors={["#8B3DFF", "#E6007A", "#FF0066"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <TouchableOpacity
          activeOpacity={0.82}
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={22} color="#FFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Detalhes da Missão</Text>
        <Text style={styles.headerSubtitle}>
          Complete e ganhe sua recompensa
        </Text>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.rewardCard}>
          <View style={styles.rewardLabelRow}>
            <MaterialCommunityIcons
              name="cash-multiple"
              size={20}
              color="#D9F99D"
            />
            <Text style={styles.rewardLabel}>Recompensa</Text>
          </View>
          <Text style={styles.rewardValue}>
            {formatCurrency(missao.recompensa)}
          </Text>
          <View style={styles.rewardBadge}>
            <Ionicons name="star" size={12} color="#F59E0B" />
            <Text style={styles.rewardBadgeText}>Ganhe pontos extras!</Text>
          </View>
        </View>

        <View style={styles.missionCard}>
          <View style={styles.missionTitleRow}>
            <View style={styles.missionIcon}>
              <Ionicons name="star" size={20} color="#7C3AED" />
            </View>
            <Text style={styles.missionTitle}>{missao.titulo}</Text>
          </View>
          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>
              {statusLabels[missao.status]}
            </Text>
          </View>
        </View>

        <InfoCard
          title="Descrição Completa"
          icon={<Feather name="file-text" size={16} color="#475467" />}
        >
          <Text style={styles.descriptionText}>{missao.descricao}</Text>
        </InfoCard>

        <InfoCard
          title="Prazo"
          icon={<Feather name="calendar" size={16} color="#2563EB" />}
        >
          <Text style={styles.infoText}>
            {missao.prazo ? formatDate(missao.prazo) : "Sem prazo definido"}
          </Text>
        </InfoCard>

        <InfoCard
          title="Observações do Responsável"
          icon={<Feather name="eye" size={16} color="#2563EB" />}
          highlighted
        >
          <Text style={styles.infoText}>
            {missao.observacoesResponsavel ||
              "Nenhuma observação adicional enviada pelo responsável."}
          </Text>
        </InfoCard>

        <LinearGradient
          colors={["#FF8A47", "#FF5EA8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.tipCard}
        >
          <View style={styles.tipHeader}>
            <Ionicons name="bulb-outline" size={16} color="#FFF5A5" />
            <Text style={styles.tipTitle}>Dica</Text>
          </View>
          <Text style={styles.tipText}>
            Quanto melhor voce documentar a conclusão da missão, mais rápida
            será a aprovação.
          </Text>
        </LinearGradient>

        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.completeButton}
          onPress={() =>
            router.push(
              `/(protected)/adolescente/missao/${missao.id}/concluir` as any,
            )
          }
        >
          <Feather name="check-circle" size={18} color="#FFF" />
          <Text style={styles.completeButtonText}>Marcar como Concluída</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
