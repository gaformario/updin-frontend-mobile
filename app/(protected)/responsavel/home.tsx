import { colors } from "@/constants/colors";
import { useAuth } from "@/features/auth/context/AuthContext";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeResponsavel() {
  const { session, signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    router.replace("/home");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home do Responsável</Text>
      <Text style={styles.text}>Nome: {session?.usuario.nome}</Text>
      <Text style={styles.text}>Tipo: {session?.usuario.tipo}</Text>

      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: colors.neutral.background,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.neutral.text,
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: colors.neutral.muted,
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
    backgroundColor: colors.brand.blue,
    borderRadius: 14,
    minHeight: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "700",
  },
});
