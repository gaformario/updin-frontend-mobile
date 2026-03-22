import {
  buscarPainelFinanceiroDoAdolescente,
  configurarMesadaDoAdolescente,
} from "@/services/responsavel";
import { configMesadaStyles } from "@/styles/configurar-mesada";
import { formatCurrency } from "@/utils/currency";
import { parseInputDecimal, toCurrencyInput } from "@/utils/decimal";
import { getErrorMessage, getErrorTitle } from "@/utils/errors";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Periodicidade = "Semanal" | "Quinzenal" | "Mensal";

function mapPeriodicidade(periodicidade?: string | null): Periodicidade {
  if (periodicidade === "quinzenal") {
    return "Quinzenal";
  }

  if (periodicidade === "mensal") {
    return "Mensal";
  }

  return "Semanal";
}

export default function ConfigurarMesadaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [periodicidade, setPeriodicidade] = useState<Periodicidade>("Semanal");
  const [ativo, setAtivo] = useState(true);
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
          setValor(toCurrencyInput(painelFinanceiro.mesadaValor));
          setPeriodicidade(
            mapPeriodicidade(painelFinanceiro.mesadaPeriodicidade),
          );
          setAtivo(painelFinanceiro.mesadaAtiva);
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

  const valorNumerico = useMemo(() => {
    return parseInputDecimal(valor);
  }, [valor]);

  function handleClose() {
    router.replace(`/responsavel/adolescente/${String(id)}` as any);
  }

  async function handleConfirm() {
    if (!id || saving) {
      return;
    }

    try {
      setSaving(true);
      await configurarMesadaDoAdolescente({
        adolescenteId: String(id),
        valor: valorNumerico,
        periodicidade,
        ativa: ativo,
      });

      Alert.alert("Sucesso", "Mesada atualizada com sucesso.", [
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
          configMesadaStyles.screen,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#2F6BFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          configMesadaStyles.screen,
          { justifyContent: "center", alignItems: "center", padding: 24 },
        ]}
      >
        <Text style={configMesadaStyles.headerTitle}>{error}</Text>
        <TouchableOpacity
          style={configMesadaStyles.confirmButton}
          onPress={() =>
            router.replace(`/responsavel/adolescente/${String(id)}` as any)
          }
        >
          <Text style={configMesadaStyles.confirmText}>←</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={configMesadaStyles.screen}>
      <View
        style={[configMesadaStyles.header, { paddingTop: insets.top + 10 }]}
      >
        <Text style={configMesadaStyles.headerTitle}>Configurar Mesada</Text>
        <Text style={configMesadaStyles.headerSubtitle}>{nome}</Text>
      </View>

      <ScrollView
        style={configMesadaStyles.scroll}
        contentContainerStyle={[
          configMesadaStyles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
      >
        <View style={configMesadaStyles.card}>
          <Text style={configMesadaStyles.label}>Valor Total da Mesada</Text>

          <View style={configMesadaStyles.moneyInput}>
            <Text style={configMesadaStyles.moneyPrefix}>R$</Text>
            <TextInput
              value={valor}
              onChangeText={setValor}
              keyboardType="decimal-pad"
              style={configMesadaStyles.moneyTextInput}
              placeholder="0"
              placeholderTextColor="#98A2B3"
            />
          </View>
        </View>

        <View style={configMesadaStyles.card}>
          <Text style={configMesadaStyles.label}>Divisão Automática</Text>

          <View
            style={[
              configMesadaStyles.splitCard,
              configMesadaStyles.splitCardGreen,
            ]}
          >
            <View>
              <Text
                style={[configMesadaStyles.splitTitle, { color: "#15803D" }]}
              >
                Mesada Fixa (80%)
              </Text>
              <Text
                style={[configMesadaStyles.splitSubtitle, { color: "#15803D" }]}
              >
                Valor garantido em cada ciclo
              </Text>
            </View>
            <Text style={[configMesadaStyles.splitValue, { color: "#15803D" }]}>
              {formatCurrency(valorNumerico * 0.8)}
            </Text>
          </View>

          <View
            style={[
              configMesadaStyles.splitCard,
              configMesadaStyles.splitCardOrange,
            ]}
          >
            <View>
              <Text
                style={[configMesadaStyles.splitTitle, { color: "#EA580C" }]}
              >
                Parte Variável (20%)
              </Text>
              <Text
                style={[configMesadaStyles.splitSubtitle, { color: "#EA580C" }]}
              >
                Para missões e recompensas
              </Text>
            </View>
            <Text style={[configMesadaStyles.splitValue, { color: "#EA580C" }]}>
              {formatCurrency(valorNumerico * 0.2)}
            </Text>
          </View>
        </View>

        <View style={configMesadaStyles.card}>
          <Text style={configMesadaStyles.label}>Periodicidade</Text>

          <View style={configMesadaStyles.segmentRow}>
            {(["Semanal", "Quinzenal", "Mensal"] as const).map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  configMesadaStyles.segmentButton,
                  periodicidade === item &&
                    configMesadaStyles.segmentButtonActive,
                ]}
                onPress={() => setPeriodicidade(item)}
              >
                <Text
                  style={[
                    configMesadaStyles.segmentText,
                    periodicidade === item &&
                      configMesadaStyles.segmentTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[configMesadaStyles.card, configMesadaStyles.switchCard]}>
          <View>
            <Text style={configMesadaStyles.labelNoMargin}>
              Ativar mesada automática
            </Text>
            <Text style={configMesadaStyles.helperText}>
              O valor sera creditado automaticamente
            </Text>
          </View>

          <Switch
            value={ativo}
            onValueChange={setAtivo}
            trackColor={{ false: "#D0D5DD", true: "#8CB0FF" }}
            thumbColor="#2F6BFF"
          />
        </View>

        <View style={configMesadaStyles.footerRow}>
          <TouchableOpacity
            style={configMesadaStyles.cancelButton}
            onPress={handleClose}
            disabled={saving}
          >
            <Text style={configMesadaStyles.cancelText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={configMesadaStyles.confirmButton}
            onPress={() => void handleConfirm()}
            disabled={saving}
          >
            <Text style={configMesadaStyles.confirmText}>
              {saving ? "Salvando..." : "Confirmar"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
