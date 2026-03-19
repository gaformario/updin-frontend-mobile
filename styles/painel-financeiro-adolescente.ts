import { colors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const stylePainel = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.background,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.neutral.text,
    marginBottom: 16,
  },
  emptyButton: {
    backgroundColor: colors.brand.blue,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  emptyButtonText: {
    color: "#FFF",
    fontWeight: "700",
  },
  topHeader: {
    backgroundColor: colors.brand.blue,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 12,
    padding: 2,
    borderRadius: 999,
  },
  headerUserRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerAvatarText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
    lineHeight: 16,
  },
  headerName: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
  headerSubtitle: {
    color: "#DCE7FF",
    fontSize: 13,
    marginTop: 2,
  },
  pageTitleContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
    backgroundColor: colors.neutral.background,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.neutral.text,
  },
  scrollContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 24,
  },
  balanceCard: {
    backgroundColor: "#08C443",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  balanceLabel: {
    color: "#D7FFE5",
    fontSize: 14,
    fontWeight: "600",
  },
  balanceValue: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 4,
    marginBottom: 12,
  },
  balanceSplitRow: {
    flexDirection: "row",
    gap: 10,
  },
  balanceMiniCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 12,
    padding: 12,
  },
  miniLabel: {
    color: "#D7FFE5",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  miniValue: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  actionCard: {
    flex: 1,
    backgroundColor: colors.neutral.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    minHeight: 82,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
  },
  sectionCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  rowContent: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  rowSubtitle: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
  },
  rowValue: {
    fontSize: 15,
    fontWeight: "700",
  },
  missaoMeta: {
    alignItems: "flex-end",
  },
  rewardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  warningButton: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});
