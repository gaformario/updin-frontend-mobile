import { colors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const selectAdoStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.background,
  },
  header: {
    backgroundColor: colors.brand.blue,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 18,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  headerSubtitle: {
    color: "#DCE7FF",
    fontSize: 13,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 8,
    gap: 8,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: colors.neutral.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#A855F7",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmoji: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "700",
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.neutral.text,
  },
  caption: {
    fontSize: 12,
    color: colors.neutral.muted,
    marginTop: 2,
  },
  balance: {
    fontSize: 16,
    fontWeight: "700",
    color: "#16A34A",
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: colors.neutral.background,
  },
  logoutButton: {
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: colors.brand.blue,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
