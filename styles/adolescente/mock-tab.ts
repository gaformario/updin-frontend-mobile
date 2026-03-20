import { colors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const adolescenteMockTabStyles = StyleSheet.create({
  mockScreen: { flex: 1, backgroundColor: "#F5F5F7", padding: 16 },
  mockHero: { borderRadius: 24, padding: 22, marginBottom: 16 },
  mockHeroEyebrow: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    marginBottom: 6,
  },
  mockHeroTitle: { color: "#FFF", fontSize: 28, fontWeight: "700" },
  mockCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E9EAF0",
  },
  mockCardTitle: { color: "#231942", fontSize: 18, fontWeight: "700", marginBottom: 8 },
  mockCardText: { color: "#667085", fontSize: 15, lineHeight: 22 },
});
