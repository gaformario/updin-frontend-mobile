import { colors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const adolescenteQuizDetalheStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  stateContainer: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    padding: 24,
    gap: 10,
  },
  inlineBackButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  inlineBackText: {
    color: "#101828",
    fontSize: 14,
    fontWeight: "600",
  },
  stateTitle: {
    color: "#101828",
    fontSize: 22,
    fontWeight: "700",
  },
  stateText: {
    color: "#667085",
    fontSize: 14,
    lineHeight: 20,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 22,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "700",
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 16,
    fontWeight: "500",
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 14,
  },
  heroCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E8EAF2",
    gap: 16,
  },
  heroDescription: {
    color: "#475467",
    fontSize: 14,
    lineHeight: 21,
  },
  metaRow: {
    flexDirection: "row",
    gap: 10,
  },
  metaCard: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: "center",
    gap: 4,
  },
  metaValue: {
    color: "#101828",
    fontSize: 18,
    fontWeight: "700",
  },
  metaLabel: {
    color: "#667085",
    fontSize: 12,
  },
  sectionCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E8EAF2",
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    color: "#101828",
    fontSize: 17,
    fontWeight: "700",
  },
  questionPreviewCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 14,
    gap: 8,
  },
  questionBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#EEF2FF",
    color: "#4F46E5",
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  questionText: {
    color: "#101828",
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 21,
  },
  questionMeta: {
    color: "#667085",
    fontSize: 12,
  },
  primaryButton: {
    minHeight: 50,
    borderRadius: 14,
    backgroundColor: "#6D28F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700",
  },
  helpText: {
    color: "#667085",
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
  },
  emptyText: {
    color: "#667085",
    fontSize: 14,
    lineHeight: 20,
  },
});
