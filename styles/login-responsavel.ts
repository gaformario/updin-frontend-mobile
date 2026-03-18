import { colors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const loginResponsavelStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
  },
  card: {
    backgroundColor: colors.neutral.card,
    borderRadius: 28,
    padding: 24,
  },
  back: {
    fontSize: 28,
    color: colors.neutral.muted,
    marginBottom: 12,
  },
  emoji: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "700",
    color: colors.neutral.text,
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    color: colors.neutral.muted,
    marginBottom: 24,
  },
  linkButton: {
    marginTop: 12,
  },
  link: {
    textAlign: "center",
    color: colors.brand.blue,
    fontWeight: "600",
  },
  secondaryLink: {
    textAlign: "center",
    color: colors.neutral.muted,
    fontWeight: "500",
  },
});
