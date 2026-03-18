import { colors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const loginAdolescenteStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  card: {
    backgroundColor: colors.neutral.white,
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
    marginBottom: 20,
  },
  badge: {
    backgroundColor: "#F3E8FF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 20,
  },
  badgeText: {
    textAlign: "center",
    color: colors.brand.purple,
    fontSize: 15,
    fontWeight: "600",
  },
});
