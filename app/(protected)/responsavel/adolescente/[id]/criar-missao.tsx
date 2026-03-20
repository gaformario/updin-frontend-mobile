import { useAuth } from "@/features/auth/context/AuthContext";
import {
  buscarPainelFinanceiroDoAdolescente,
  criarMissaoParaAdolescente,
} from "@/services/responsavel";
import { criarMissaoStyles } from "@/styles/criar-missao";
import { formatCurrency } from "@/utils/currency";
import { parseInputDecimal } from "@/utils/decimal";
import { getErrorMessage, getErrorTitle } from "@/utils/errors";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TipoValidacao = "manual" | "automatica";

function parseDateInput(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return undefined;
  }

  const [day, month, year] = trimmed.split("/");

  if (!day || !month || !year) {
    return undefined;
  }

  return new Date(`${year}-${month}-${day}T00:00:00.000Z`).toISOString();
}

export default function CriarMissaoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const insets = useSafeAreaInsets();
  const [nome, setNome] = useState("");
  const [saldoVariavel, setSaldoVariavel] = useState(0);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [recompensa, setRecompensa] = useState("");
  const [prazo, setPrazo] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [tipoValidacao, setTipoValidacao] = useState<TipoValidacao>("manual");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function carregar() {
      if (!id) {
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const painelFinanceiro = await buscarPainelFinanceiroDoAdolescente(
          String(id),
        );

        if (active && painelFinanceiro) {
          setNome(painelFinanceiro.nome);
          setSaldoVariavel(painelFinanceiro.variavel);
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
  }, [id]);

  function handleClose() {
    router.replace(`/responsavel/adolescente/${String(id)}` as any);
  }

  async function handleCreate() {
    if (!id || saving) {
      return;
    }

    const responsavelId = session?.perfis.responsavelId;

    if (!responsavelId) {
      Alert.alert("Erro", "Nao foi possivel identificar o responsavel logado.");
      return;
    }

    try {
      setSaving(true);
      await criarMissaoParaAdolescente({
        responsavelId,
        adolescenteId: String(id),
        titulo,
        descricao: descricao || undefined,
        recompensaFinanceira: parseInputDecimal(recompensa),
        dataLimite: parseDateInput(prazo),
        observacao: observacoes || undefined,
      });

      Alert.alert("Sucesso", "Missao criada e atribuida com sucesso.", [
        {
          text: "OK",
          onPress: handleClose,
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
      <View
        style={[
          criarMissaoStyles.screen,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#A855F7" />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          criarMissaoStyles.screen,
          { justifyContent: "center", alignItems: "center", padding: 24 },
        ]}
      >
        <Text style={criarMissaoStyles.headerTitle}>{error}</Text>
        <TouchableOpacity
          style={criarMissaoStyles.createButton}
          onPress={handleClose}
        >
          <Text style={criarMissaoStyles.createText}>←</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={criarMissaoStyles.screen}>
      <View style={[criarMissaoStyles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={criarMissaoStyles.headerTitle}>Criar Nova Missao</Text>
        <Text style={criarMissaoStyles.headerSubtitle}>{nome}</Text>
      </View>

      <ScrollView
        style={criarMissaoStyles.scroll}
        contentContainerStyle={[
          criarMissaoStyles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
      >
        <View style={criarMissaoStyles.highlightCard}>
          <Text style={criarMissaoStyles.highlightLabel}>
            Saldo Variavel Disponivel
          </Text>
          <Text style={criarMissaoStyles.highlightValue}>
            {formatCurrency(saldoVariavel)}
          </Text>
          <Text style={criarMissaoStyles.highlightCaption}>
            Limite para novas missoes
          </Text>
        </View>

        <View style={criarMissaoStyles.card}>
          <Text style={criarMissaoStyles.label}>Titulo da Missao</Text>
          <View style={criarMissaoStyles.inputRow}>
            <Feather name="target" size={16} color="#98A2B3" />
            <TextInput
              value={titulo}
              onChangeText={setTitulo}
              placeholder="Ex: Organizar o quarto"
              placeholderTextColor="#98A2B3"
              style={criarMissaoStyles.input}
            />
          </View>
        </View>

        <View style={criarMissaoStyles.card}>
          <Text style={criarMissaoStyles.label}>Descricao Detalhada</Text>
          <TextInput
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Descreva o que precisa ser feito..."
            placeholderTextColor="#98A2B3"
            style={[criarMissaoStyles.textArea]}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={criarMissaoStyles.card}>
          <Text style={criarMissaoStyles.label}>Valor da Recompensa</Text>
          <View style={criarMissaoStyles.inputRow}>
            <Text style={criarMissaoStyles.moneyPrefix}>R$</Text>
            <TextInput
              value={recompensa}
              onChangeText={setRecompensa}
              placeholder="0,00"
              placeholderTextColor="#98A2B3"
              keyboardType="numeric"
              style={criarMissaoStyles.input}
            />
          </View>
        </View>

        <View style={criarMissaoStyles.card}>
          <Text style={criarMissaoStyles.label}>Prazo (Opcional)</Text>
          <View style={criarMissaoStyles.inputRow}>
            <Feather name="calendar" size={16} color="#98A2B3" />
            <TextInput
              value={prazo}
              onChangeText={setPrazo}
              placeholder="dd/mm/yyyy"
              placeholderTextColor="#98A2B3"
              style={criarMissaoStyles.input}
            />
          </View>
        </View>

        <View style={criarMissaoStyles.card}>
          <Text style={criarMissaoStyles.label}>Observacoes (Opcional)</Text>
          <TextInput
            value={observacoes}
            onChangeText={setObservacoes}
            placeholder="Informacoes adicionais..."
            placeholderTextColor="#98A2B3"
            style={criarMissaoStyles.textArea}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={criarMissaoStyles.card}>
          <Text style={criarMissaoStyles.label}>Tipo de Validacao</Text>
          <View style={criarMissaoStyles.segmentRow}>
            <TouchableOpacity
              style={[
                criarMissaoStyles.segmentButton,
                tipoValidacao === "manual" &&
                  criarMissaoStyles.segmentButtonActive,
              ]}
              onPress={() => setTipoValidacao("manual")}
            >
              <Text
                style={[
                  criarMissaoStyles.segmentText,
                  tipoValidacao === "manual" &&
                    criarMissaoStyles.segmentTextActive,
                ]}
              >
                Aprovacao Manual
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                criarMissaoStyles.segmentButton,
                tipoValidacao === "automatica" &&
                  criarMissaoStyles.segmentButtonActive,
              ]}
              onPress={() => setTipoValidacao("automatica")}
            >
              <Text
                style={[
                  criarMissaoStyles.segmentText,
                  tipoValidacao === "automatica" &&
                    criarMissaoStyles.segmentTextActive,
                ]}
              >
                Validacao Automatica
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={criarMissaoStyles.footerRow}>
          <TouchableOpacity
            style={criarMissaoStyles.cancelButton}
            onPress={handleClose}
            disabled={saving}
          >
            <Text style={criarMissaoStyles.cancelText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={criarMissaoStyles.createButton}
            onPress={() => void handleCreate()}
            disabled={saving}
          >
            <Text style={criarMissaoStyles.createText}>
              {saving ? "Criando..." : "Criar Missao"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
