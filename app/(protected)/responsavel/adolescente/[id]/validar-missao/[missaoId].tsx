import {
  aprovarMissaoDoAdolescente,
  buscarMissaoParaValidacao,
  recusarMissaoDoAdolescente,
} from "@/services/responsavel";
import { validarMissaoStyles } from "@/styles/validar-missao";
import type { MissaoValidacao } from "@/types/painel-financeiro";
import { formatCurrency } from "@/utils/currency";
import { formatDateTime } from "@/utils/date";
import { getErrorMessage, getErrorTitle } from "@/utils/errors";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

function InfoCard({
  title,
  children,
  icon,
  highlighted = false,
}: {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  highlighted?: boolean;
}) {
  return (
    <View
      style={[
        validarMissaoStyles.card,
        highlighted ? validarMissaoStyles.cardHighlighted : null,
      ]}
    >
      <View style={validarMissaoStyles.cardHeader}>
        {icon}
        <Text
          style={[
            validarMissaoStyles.cardTitle,
            highlighted ? validarMissaoStyles.cardTitleHighlighted : null,
          ]}
        >
          {title}
        </Text>
      </View>
      {children}
    </View>
  );
}

export default function ValidarMissaoScreen() {
  const { id, missaoId } = useLocalSearchParams<{
    id: string;
    missaoId: string;
  }>();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [missao, setMissao] = useState<MissaoValidacao | null>(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    let active = true;

    async function carregar() {
      if (!id || !missaoId) {
        if (active) {
          setMissao(null);
          setLoading(false);
        }
        return;
      }

      try {
        const data = await buscarMissaoParaValidacao(
          String(id),
          String(missaoId),
        );

        if (active) {
          setMissao(data ?? null);
          setFeedback(data?.feedbackResponsavel ?? "");
        }
      } catch (requestError) {
        if (active) {
          Alert.alert(
            getErrorTitle(requestError),
            getErrorMessage(requestError),
          );
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
  }, [id, missaoId]);

  async function handleSubmit(action: "aprovar" | "recusar") {
    if (!id || !missaoId || saving) {
      return;
    }

    try {
      setSaving(true);

      if (action === "aprovar") {
        await aprovarMissaoDoAdolescente(
          String(id),
          String(missaoId),
          feedback,
        );
      } else {
        await recusarMissaoDoAdolescente();
      }

      Alert.alert(
        action === "aprovar" ? "Missão aprovada" : "Missão recusada",
        action === "aprovar"
          ? "A missão foi validada com sucesso."
          : "A API atual nao oferece endpoint de recusa.",
        [
          {
            text: "OK",
            onPress: () =>
              router.replace(`/responsavel/adolescente/${String(id)}` as any),
          },
        ],
      );
    } catch (requestError) {
      Alert.alert(getErrorTitle(requestError), getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={validarMissaoStyles.loadingContainer}>
        <Text>Carregando...</Text>
      </SafeAreaView>
    );
  }

  if (!missao) {
    return (
      <SafeAreaView style={validarMissaoStyles.loadingContainer}>
        <Text style={validarMissaoStyles.notFoundText}>
          Missão não encontrada.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={validarMissaoStyles.screen} edges={["bottom"]}>
      <View
        style={[validarMissaoStyles.header, { paddingTop: insets.top + 12 }]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.back()}
          style={validarMissaoStyles.backButton}
        >
          <Feather name="arrow-left" size={22} color="#FFF" />
        </TouchableOpacity>

        <Text style={validarMissaoStyles.headerTitle}>Validar Missão</Text>
        <Text style={validarMissaoStyles.headerSubtitle}>
          Aguardando sua aprovação
        </Text>
      </View>

      <ScrollView
        style={validarMissaoStyles.scroll}
        contentContainerStyle={[
          validarMissaoStyles.content,
          { paddingBottom: insets.bottom + 20 },
        ]}
      >
        <View style={validarMissaoStyles.topCard}>
          <Text style={validarMissaoStyles.topTitle}>{missao.titulo}</Text>
          <View style={validarMissaoStyles.dateRow}>
            <Feather name="calendar" size={14} color="#667085" />
            <Text style={validarMissaoStyles.dateText}>
              Concluída em: {formatDateTime(missao.concluidaEm)}
            </Text>
          </View>
        </View>

        <View style={validarMissaoStyles.rewardCard}>
          <Text style={validarMissaoStyles.rewardLabel}>
            Valor da Recompensa
          </Text>
          <Text style={validarMissaoStyles.rewardValue}>
            {formatCurrency(missao.recompensa)}
          </Text>
        </View>

        <InfoCard title="Descrição da Missão">
          <Text style={validarMissaoStyles.cardText}>{missao.descricao}</Text>
        </InfoCard>

        <InfoCard
          title="Comentário do Adolescente"
          icon={<Feather name="message-square" size={16} color="#2563EB" />}
          highlighted
        >
          <Text style={validarMissaoStyles.cardText}>
            {missao.comentarioAdolescente || "Nenhum comentario enviado."}
          </Text>
        </InfoCard>

        <InfoCard
          title="Evidências Anexadas"
          icon={
            <MaterialCommunityIcons
              name="image-outline"
              size={18}
              color="#667085"
            />
          }
        >
          <View style={validarMissaoStyles.evidenceGrid}>
            {missao.evidencias.length ? (
              missao.evidencias.map((evidencia) => (
                <View
                  key={evidencia.id}
                  style={validarMissaoStyles.evidenceCard}
                >
                  {evidencia.imagem ? (
                    <Image
                      source={evidencia.imagem}
                      resizeMode="cover"
                      style={validarMissaoStyles.evidenceImage}
                    />
                  ) : (
                    <View style={validarMissaoStyles.evidencePlaceholder}>
                      <MaterialCommunityIcons
                        name="image-off-outline"
                        size={28}
                        color="#98A2B3"
                      />
                    </View>
                  )}
                </View>
              ))
            ) : (
              <Text style={validarMissaoStyles.cardText}>
                Nenhuma evidencia enviada.
              </Text>
            )}
          </View>
        </InfoCard>

        <InfoCard title="Feedback (Opcional)">
          <TextInput
            value={feedback}
            onChangeText={setFeedback}
            placeholder="Deixe um comentário para o adolescente..."
            placeholderTextColor="#98A2B3"
            multiline
            textAlignVertical="top"
            style={validarMissaoStyles.feedbackInput}
          />
        </InfoCard>

        <View style={validarMissaoStyles.footerRow}>
          <TouchableOpacity
            activeOpacity={0.86}
            disabled={saving}
            onPress={() => void handleSubmit("recusar")}
            style={[
              validarMissaoStyles.actionButton,
              validarMissaoStyles.rejectButton,
            ]}
          >
            <Feather name="x-circle" size={18} color="#FFF" />
            <Text style={validarMissaoStyles.actionText}>Recusar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.86}
            disabled={saving}
            onPress={() => void handleSubmit("aprovar")}
            style={[
              validarMissaoStyles.actionButton,
              validarMissaoStyles.approveButton,
            ]}
          >
            <Feather name="check-circle" size={18} color="#FFF" />
            <Text style={validarMissaoStyles.actionText}>
              {saving ? "Salvando..." : "Aprovar"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
