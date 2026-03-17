import { LinearGradient } from "expo-linear-gradient";
import {
  ActivityIndicator,
  ColorValue,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../constants/colors";

type Gradient = readonly [ColorValue, ColorValue, ...ColorValue[]];

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: "blue" | "purple" | "pink";
  gradient?: Gradient;
};

export function AppButton({
  title,
  onPress,
  loading = false,
  variant = "blue",
  gradient,
}: Props) {
  const backgroundColor =
    variant === "blue"
      ? colors.brand.blue
      : variant === "purple"
        ? colors.brand.purple
        : colors.brand.pink;

  const content = loading ? (
    <ActivityIndicator color="#FFF" />
  ) : (
    <Text style={styles.text}>{title}</Text>
  );

  return (
    <TouchableOpacity onPress={onPress} disabled={loading} activeOpacity={0.85}>
      {gradient ? (
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          {content}
        </LinearGradient>
      ) : (
        <View style={[styles.button, { backgroundColor }]}>{content}</View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  text: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
