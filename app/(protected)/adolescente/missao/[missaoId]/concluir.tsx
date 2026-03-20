import { useAuth } from "@/features/auth/context/AuthContext";
import {
  buscarMissaoDoAdolescente,
  concluirMissaoDoAdolescente,
} from "@/services/adolescente";
import { adolescenteConcluirMissaoStyles as styles } from "@/styles/adolescente/concluir-missao";
import { formatCurrency } from "@/utils/currency";
import { getErrorMessage, getErrorTitle } from "@/utils/errors";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
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

export default function ConcluirMissaoScreen() {
  const { missaoId } = useLocalSearchParams<{ missaoId: string }>();
  const { session } = useAuth();
  const insets = useSafeAreaInsets();
  const [comentario, setComentario] = useState("");
  const [fotoSelecionada, setFotoSelecionada] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [missaoTitulo, setMissaoTitulo] = useState("");
  const [recompensa, setRecompensa] = useState(0);

  const adolescenteId = session?.perfis.adolescenteId;

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
        const missao = await buscarMissaoDoAdolescente(
          adolescenteId,
          String(missaoId),
        );

        if (active && missao) {
          setMissaoTitulo(missao.titulo);
          setRecompensa(missao.recompensa);
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

  async function handleSubmit() {
    if (!missaoId || saving) {
      return;
    }

    try {
      setSaving(true);
      await concluirMissaoDoAdolescente(
        String(missaoId),
        comentario || undefined,
      );

      Alert.alert("Sucesso", "Missao enviada para validacao.", [
        {
          text: "OK",
          onPress: () => router.replace("/(protected)/adolescente/home"),
        },
      ]);
    } catch (requestError) {
      Alert.alert(getErrorTitle(requestError), getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.notFoundContainer}>
        <Text>Carregando...</Text>
      </SafeAreaView>
    );
  }

  if (error || !missaoTitulo) {
    return (
      <SafeAreaView style={styles.notFoundContainer}>
        <TouchableOpacity
          activeOpacity={0.82}
          onPress={() => router.back()}
          style={styles.notFoundBack}
        >
          <Feather name="arrow-left" size={18} color="#101828" />
          <Text style={styles.notFoundBackText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.notFoundTitle}>Missao nao encontrada</Text>
        <Text style={styles.notFoundText}>
          {error ??
            "Nao foi possivel abrir o envio para validacao dessa missao."}
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

        <Text style={styles.headerTitle}>Marcar como Concluida</Text>
        <Text style={styles.headerSubtitle}>{missaoTitulo}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.confirmCard}>
          <View style={styles.confirmIconWrap}>
            <View style={styles.confirmIconInner}>
              <Ionicons name="checkmark" size={34} color="#FFF" />
            </View>
          </View>
          <Text style={styles.confirmTitle}>Missao Concluida?</Text>
          <Text style={styles.confirmText}>
            Voce esta prestes a marcar esta missao como concluida. Adicione um
            comentario para acelerar a aprovacao.
          </Text>
        </View>

        <View style={styles.rewardCard}>
          <Text style={styles.rewardLabel}>
            Valor a Receber (apos aprovacao)
          </Text>
          <Text style={styles.rewardValue}>{formatCurrency(recompensa)}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Feather name="message-square" size={16} color="#2563EB" />
            <Text style={styles.cardTitle}>Adicionar Comentario</Text>
          </View>

          <TextInput
            value={comentario}
            onChangeText={setComentario}
            placeholder="Descreva como completou a missao, dificuldades que encontrou, etc..."
            placeholderTextColor="#98A2B3"
            multiline
            textAlignVertical="top"
            style={styles.commentInput}
          />
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons
              name="camera-outline"
              size={18}
              color="#9333EA"
            />
            <Text style={styles.cardTitle}>Anexar Foto de Comprovacao</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.86}
            style={styles.photoDropzone}
            onPress={() => setFotoSelecionada((value) => !value)}
          >
            <View style={styles.photoPlaceholder}>
              <MaterialCommunityIcons
                name="camera-outline"
                size={30}
                color="#98A2B3"
              />
              <Text style={styles.photoPlaceholderText}>
                {fotoSelecionada
                  ? "Foto marcada localmente"
                  : "Toque para simular uma foto"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.tipCard}>
          <Ionicons name="bulb-outline" size={16} color="#F59E0B" />
          <Text style={styles.tipText}>
            Dica: Adicionar fotos e comentários detalhados aumenta as chances de
            aprovação rápida!
          </Text>
        </View>

        <View style={styles.footerRow}>
          <TouchableOpacity
            activeOpacity={0.86}
            style={[styles.footerButton, styles.cancelButton]}
            onPress={() => router.back()}
            disabled={saving}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.86}
            style={[styles.footerButton, styles.submitButton]}
            disabled={saving}
            onPress={() => void handleSubmit()}
          >
            <Feather name="send" size={16} color="#FFF" />
            <Text style={styles.submitButtonText}>
              {saving ? "Enviando..." : "Enviar para Validacao"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
