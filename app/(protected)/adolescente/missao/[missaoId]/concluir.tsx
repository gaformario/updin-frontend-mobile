import { useAuth } from "@/features/auth/context/AuthContext";
import { mockPainelFinanceiroPorAdolescenteId } from "@/services/mock-painel-financeiro-adolescente";
import { adolescenteConcluirMissaoStyles as styles } from "@/styles/adolescente/concluir-missao";
import { formatCurrency } from "@/utils/currency";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function ConcluirMissaoScreen() {
  const { missaoId } = useLocalSearchParams<{ missaoId: string }>();
  const { session } = useAuth();
  const insets = useSafeAreaInsets();
  const [comentario, setComentario] = useState("");
  const [fotoSelecionada, setFotoSelecionada] = useState(false);

  const adolescenteId =
    session?.usuario.tipo === "adolescente" ? session.perfil.id : "ado-1";

  const painel =
    mockPainelFinanceiroPorAdolescenteId[adolescenteId] ??
    mockPainelFinanceiroPorAdolescenteId["ado-1"];

  const missao =
    painel.missoesAtivas.find((item) => item.id === String(missaoId)) ?? null;

  if (!missao) {
    return (
      <SafeAreaView style={styles.notFoundContainer}>
        <TouchableOpacity
          activeOpacity={0.82}
          onPress={() => router.back()}
          style={styles.notFoundBack}
        >
          <Feather name="arrow-left" size={18} color="#101828" />
          <Text style={styles.notFoundBackText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.notFoundTitle}>Missão não encontrada</Text>
        <Text style={styles.notFoundText}>
          Não foi possível abrir o envio para validação dessa missão.
        </Text>
      </SafeAreaView>
    );
  }

  const fotoMock = missao.evidencias[0]?.imagem;

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

        <Text style={styles.headerTitle}>Marcar como Concluída</Text>
        <Text style={styles.headerSubtitle}>{missao.titulo}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.confirmCard}>
          <View style={styles.confirmIconWrap}>
            <View style={styles.confirmIconInner}>
              <Ionicons name="checkmark" size={34} color="#FFF" />
            </View>
          </View>
          <Text style={styles.confirmTitle}>Missão Concluída?</Text>
          <Text style={styles.confirmText}>
            Você está prestes a marcar esta missão como concluída. Adicione
            evidências para acelerar a aprovação!
          </Text>
        </View>

        <View style={styles.rewardCard}>
          <Text style={styles.rewardLabel}>Valor a Receber (após aprovação)</Text>
          <Text style={styles.rewardValue}>{formatCurrency(missao.recompensa)}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Feather name="message-square" size={16} color="#2563EB" />
            <Text style={styles.cardTitle}>Adicionar Comentário</Text>
          </View>

          <TextInput
            value={comentario}
            onChangeText={setComentario}
            placeholder="Descreva como completou a missão, dificuldades que encontrou, etc..."
            placeholderTextColor="#98A2B3"
            multiline
            textAlignVertical="top"
            style={styles.commentInput}
          />
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="camera-outline" size={18} color="#9333EA" />
            <Text style={styles.cardTitle}>Anexar Foto de Comprovação</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.86}
            style={styles.photoDropzone}
            onPress={() => setFotoSelecionada((value) => !value)}
          >
            {fotoSelecionada && fotoMock ? (
              <>
                <Image source={fotoMock} style={styles.photoPreview} resizeMode="cover" />
                <View style={styles.photoOverlay}>
                  <Text style={styles.photoOverlayText}>Toque para trocar a foto</Text>
                </View>
              </>
            ) : (
              <View style={styles.photoPlaceholder}>
                <MaterialCommunityIcons name="camera-outline" size={30} color="#98A2B3" />
                <Text style={styles.photoPlaceholderText}>Toque para adicionar foto</Text>
              </View>
            )}
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
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.86} style={[styles.footerButton, styles.submitButton]}>
            <Feather name="send" size={16} color="#FFF" />
            <Text style={styles.submitButtonText}>Enviar para Validação</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
