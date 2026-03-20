import { colors } from "@/constants/colors";
import { adolescenteMockTabStyles as stylePainel } from "@/styles/adolescente/mock-tab";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  title: string;
  description: string;
};

export function MockTeenTabScreen({ title, description }: Props) {
  return (
    <SafeAreaView style={stylePainel.mockScreen} edges={["top"]}>
      <Animated.View entering={FadeIn.duration(180)}>
        <LinearGradient
          colors={colors.gradients.button}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={stylePainel.mockHero}
        >
          <Text style={stylePainel.mockHeroEyebrow}>Fluxo do adolescente</Text>
          <Text style={stylePainel.mockHeroTitle}>{title}</Text>
        </LinearGradient>

        <Animated.View entering={FadeInDown.duration(220).delay(50)}>
          <View style={stylePainel.mockCard}>
            <Text style={stylePainel.mockCardTitle}>Conteúdo mockado</Text>
            <Text style={stylePainel.mockCardText}>{description}</Text>
          </View>
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
}
