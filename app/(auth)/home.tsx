import { AppButton } from "@/components/ui/AppButton";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { colors } from "@/constants/colors";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function LoginGeralScreen() {
  return (
    <ScreenContainer backgroundColor={colors.brand.home}>
      <View style={styles.wrapper}>
        <Image
          source={require("@/assets/images/Updin-Logo.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <View style={styles.card}>
          <Text style={styles.logo}>
            <FontAwesome name="play-circle" size={32} /> Updin
          </Text>
          <Text style={styles.subtitle}>Educacao financeira gamificada</Text>

          <View style={styles.buttons}>
            <AppButton
              title="Sou Responsavel"
              variant="blue"
              onPress={() => router.push("/login-responsavel")}
            />

            <AppButton
              title="Sou Adolescente"
              gradient={colors.gradients.button}
              onPress={() => router.push("/login-adolescente")}
            />
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <AntDesign name="copyright" size={14} color="#9CA3AF" />
        <Text style={styles.footerText}>
          {" "}
          Updin • 2026 • Todos os direitos reservados
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#F3F4F6",
    borderRadius: 28,
    padding: 28,
  },
  logo: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    color: colors.neutral.text,
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 16,
    color: colors.neutral.muted,
    marginBottom: 28,
  },
  buttons: {
    gap: 14,
  },
  logoImage: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 16,
    transform: [{ scale: 2.5 }],
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10,
  },

  footerText: {
    color: "#9CA3AF",
    fontSize: 12,
  },
});
