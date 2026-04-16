import { AppButton } from "@/components/ui/AppButton";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { colors } from "@/constants/colors";
import { homeStyles } from "@/styles/home-page";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";

export default function LoginGeralScreen() {
  return (
    <ScreenContainer backgroundColor={colors.brand.home}>
      <View style={homeStyles.wrapper}>
        <Image
          source={require("@/assets/images/Updin-Logo.png")}
          style={homeStyles.logoImage}
          resizeMode="contain"
        />
        <View style={homeStyles.card}>
          <Text style={homeStyles.logo}>
            <FontAwesome name="play-circle" size={32} /> Updin
          </Text>
          <Text style={homeStyles.subtitle}>
            Educação Financeira Gamificada
          </Text>

          <View style={homeStyles.buttons}>
            <AppButton
              title="Sou Responsável"
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
      <View style={homeStyles.footer}>
        <AntDesign name="copyright" size={14} color="#9CA3AF" />
        <Text style={homeStyles.footerText}>
          {" "}
          Updin © • 2026 • Todos os direitos reservados
        </Text>
      </View>
    </ScreenContainer>
  );
}
