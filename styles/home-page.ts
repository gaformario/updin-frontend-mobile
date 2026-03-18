import { colors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const homeStyles = StyleSheet.create({
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
