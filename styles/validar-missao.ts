import { StyleSheet } from "react-native";

export const validarMissaoStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F7FB",
    padding: 24,
  },
  notFoundText: {
    color: "#1F2937",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    backgroundColor: "#9A00FF",
    paddingHorizontal: 16,
    paddingBottom: 18,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
  headerSubtitle: {
    color: "#F5D9FF",
    marginTop: 2,
    fontSize: 13,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 10,
    gap: 14,
  },
  topCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
  },
  topTitle: {
    color: "#111827",
    fontSize: 17,
    fontWeight: "700",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  dateText: {
    color: "#667085",
    fontSize: 13,
    fontWeight: "500",
  },
  rewardCard: {
    backgroundColor: "#08C443",
    borderRadius: 16,
    padding: 16,
  },
  rewardLabel: {
    color: "#D7FFE5",
    fontSize: 13,
    fontWeight: "700",
  },
  rewardValue: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
  },
  cardHighlighted: {
    borderColor: "#BFDBFE",
    backgroundColor: "#EFF6FF",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  cardTitle: {
    color: "#344054",
    fontSize: 14,
    fontWeight: "700",
  },
  cardTitleHighlighted: {
    color: "#1D4ED8",
  },
  cardText: {
    color: "#344054",
    fontSize: 14,
    lineHeight: 20,
  },
  evidenceGrid: {
    flexDirection: "row",
    gap: 10,
  },
  evidenceCard: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#E5E7EB",
  },
  evidenceImage: {
    width: "100%",
    height: "100%",
  },
  evidencePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  feedbackInput: {
    minHeight: 96,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    backgroundColor: "#FFF",
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: "#111827",
    fontSize: 15,
  },
  footerRow: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  rejectButton: {
    backgroundColor: "#EF2B2D",
  },
  approveButton: {
    backgroundColor: "#0BAA46",
  },
  actionText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
