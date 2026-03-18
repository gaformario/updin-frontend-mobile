import { buscarPainelFinanceiroDoAdolescente } from "@/services/responsavel";
import { configMesadaStyles } from "@/styles/configurar-mesada";
import { formatCurrency } from "@/utils/currency";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Periodicidade = "Semanal" | "Quinzenal" | "Mensal";

export default function ConfigurarMesadaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [periodicidade, setPeriodicidade] = useState<Periodicidade>("Semanal");
  const [ativo, setAtivo] = useState(true);

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
        setValor(painelFinanceiro.saldoTotal.toFixed(2).replace(".", ","));
      }
    }

    void carregar();

    return () => {
      active = false;
    };
  }, [id]);

  const valorNumerico = useMemo(() => {
    const parsed = Number(valor.replace(",", "."));
    return Number.isFinite(parsed) ? parsed : 0;
  }, [valor]);

  function handleClose() {
    router.replace(`/responsavel/adolescente/${String(id)}` as any);
  }

  function handleConfirm() {}

  return (
    <View style={configMesadaStyles.screen}>
      <View
        style={[configMesadaStyles.header, { paddingTop: insets.top + 10 }]}
      >
        {/* <TouchableOpacity onPress={handleClose} style={configMesadaStyles.backButton}>
          <Feather name="arrow-left" size={20} color="#FFF" />
        </TouchableOpacity> */}

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
                Valor garantido toda semana
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
                Parte Variavel (20%)
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
          >
            <Text style={configMesadaStyles.cancelText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={configMesadaStyles.confirmButton}
            onPress={handleConfirm}
          >
            <Text style={configMesadaStyles.confirmText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
