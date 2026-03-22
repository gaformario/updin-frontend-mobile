import { useAuth } from "@/features/auth/context/AuthContext";
import { listarAdolescentesDoResponsavel } from "@/services/responsavel";
import { selectAdoStyle } from "@/styles/selecionar-adolescente";
import type { AdolescenteResumo } from "@/types/painel-financeiro";
import { formatCurrency } from "@/utils/currency";
import { getErrorMessage } from "@/utils/errors";
import { getInitials } from "@/utils/initials";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function SelecionarAdolescenteScreen() {
  const [adolescentes, setAdolescentes] = useState<AdolescenteResumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectAdolescente, session, signOut } = useAuth();
  const insets = useSafeAreaInsets();

  const carregar = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listarAdolescentesDoResponsavel();
      setAdolescentes(data);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void carregar();
    }, [carregar]),
  );

  async function handleSelect(adolescente: AdolescenteResumo) {
    await selectAdolescente(adolescente);
    router.push(`/responsavel/adolescente/${adolescente.id}` as any);
  }

  async function handleSignOut() {
    await signOut();
    router.replace("/login-responsavel");
  }

  return (
    <SafeAreaView style={selectAdoStyle.container} edges={["bottom"]}>
      <View style={[selectAdoStyle.header, { paddingTop: insets.top + 12 }]}>
        <Text style={selectAdoStyle.headerTitle}>Selecione o Adolescente</Text>
        <Text style={selectAdoStyle.headerSubtitle}>
          {session?.usuario.nome
            ? `${session.usuario.nome}, escolha qual perfil deseja gerenciar`
            : "Escolha qual perfil deseja gerenciar"}
        </Text>
      </View>

      {loading ? (
        <View
          style={[
            selectAdoStyle.listContent,
            { flex: 1, justifyContent: "center" },
          ]}
        >
          <ActivityIndicator size="large" color="#2F6BFF" />
        </View>
      ) : error ? (
        <View
          style={[
            selectAdoStyle.listContent,
            { flex: 1, justifyContent: "center" },
          ]}
        >
          <Text style={selectAdoStyle.name}>{error}</Text>
          <TouchableOpacity
            style={selectAdoStyle.card}
            onPress={() => void carregar()}
          >
            <Text style={selectAdoStyle.logoutButtonText}>
              Tentar novamente
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={adolescentes}
          keyExtractor={(item) => item.id}
          style={selectAdoStyle.list}
          contentContainerStyle={selectAdoStyle.listContent}
          onRefresh={() => void carregar()}
          refreshing={loading}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.85}
              style={selectAdoStyle.card}
              onPress={() => void handleSelect(item)}
            >
              <View style={selectAdoStyle.leftContent}>
                <View style={selectAdoStyle.avatar}>
                  <Text style={selectAdoStyle.avatarEmoji}>
                    {getInitials(item.nome || "")}
                  </Text>
                </View>

                <View>
                  <Text style={selectAdoStyle.name}>{item.nome}</Text>
                  <Text style={selectAdoStyle.caption}>Saldo disponível</Text>
                </View>
              </View>

              <Text style={selectAdoStyle.balance}>
                {formatCurrency(item.saldoTotal)}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      <View style={selectAdoStyle.footer}>
        <TouchableOpacity
          style={selectAdoStyle.logoutButton}
          onPress={handleSignOut}
        >
          <Text style={selectAdoStyle.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
