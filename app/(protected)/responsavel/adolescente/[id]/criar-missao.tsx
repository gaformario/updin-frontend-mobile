import { buscarPainelFinanceiroDoAdolescente } from "@/services/responsavel";
import { criarMissaoStyles } from "@/styles/criar-missao";
import { formatCurrency } from "@/utils/currency";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TipoValidacao = "manual" | "automatica";

export default function CriarMissaoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [nome, setNome] = useState("");
  const [saldoVariavel, setSaldoVariavel] = useState(50);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [recompensa, setRecompensa] = useState("");
  const [prazo, setPrazo] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [tipoValidacao, setTipoValidacao] = useState<TipoValidacao>("manual");

  useEffect(() => {
    let active = true;

    async function carregar() {
      if (!id) {
        return;
      }

      const painelFinanceiro = await buscarPainelFinanceiroDoAdolescente(
        String(id),
      );

      if (active && painelFinanceiro) {
        setNome(painelFinanceiro.nome);
        setSaldoVariavel(painelFinanceiro.variavel);
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

  function handleCreate() {}

  return (
    <View style={criarMissaoStyles.screen}>
      <View style={[criarMissaoStyles.header, { paddingTop: insets.top + 10 }]}>
        {/* <TouchableOpacity onPress={handleClose} style={criarMissaoStyles.backButton}>
          <Feather name="arrow-left" size={20} color="#FFF" />
        </TouchableOpacity> */}

        <Text style={criarMissaoStyles.headerTitle}>Criar Nova Missão</Text>
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
            Saldo Variável Disponível
          </Text>
          <Text style={criarMissaoStyles.highlightValue}>
            {formatCurrency(saldoVariavel)}
          </Text>
          <Text style={criarMissaoStyles.highlightCaption}>
            Limite para novas missões
          </Text>
        </View>

        <View style={criarMissaoStyles.card}>
          <Text style={criarMissaoStyles.label}>Titulo da Missão</Text>
          <View style={criarMissaoStyles.inputRow}>
            <Feather name="eye" size={16} color="#98A2B3" />
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
          <Text style={criarMissaoStyles.label}>Descrição Detalhada</Text>
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
            <Text style={criarMissaoStyles.moneyPrefix}>$</Text>
            <TextInput
              value={recompensa}
              onChangeText={setRecompensa}
              placeholder="0.00"
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
          <Text style={criarMissaoStyles.label}>Observações (Opcional)</Text>
          <TextInput
            value={observacoes}
            onChangeText={setObservacoes}
            placeholder="Informações adicionais..."
            placeholderTextColor="#98A2B3"
            style={criarMissaoStyles.textArea}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={criarMissaoStyles.card}>
          <Text style={criarMissaoStyles.label}>Tipo de Validação</Text>
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
                Aprovação Manual
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
                Validação Automática
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={criarMissaoStyles.footerRow}>
          <TouchableOpacity
            style={criarMissaoStyles.cancelButton}
            onPress={handleClose}
          >
            <Text style={criarMissaoStyles.cancelText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={criarMissaoStyles.createButton}
            onPress={handleCreate}
          >
            <Text style={criarMissaoStyles.createText}>Criar Missão</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
