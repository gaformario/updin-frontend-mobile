import { colors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const adolescenteResultadoQuizStyles = StyleSheet.create({
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
    alignItems: "center",
    gap: 10,
  },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "700",
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 14,
  },
  scoreCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 20,
    padding: 18,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#E7EAF2",
  },
  scoreLabel: {
    color: "#667085",
    fontSize: 14,
  },
  scoreValue: {
    color: "#101828",
    fontSize: 32,
    fontWeight: "800",
  },
  scoreMessage: {
    color: "#475467",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  metricsRow: {
    flexDirection: "row",
    gap: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.neutral.white,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "#E7EAF2",
  },
  metricValue: {
    color: "#101828",
    fontSize: 20,
    fontWeight: "700",
  },
  metricLabel: {
    color: "#667085",
    fontSize: 12,
  },
  infoCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E7EAF2",
    gap: 6,
  },
  infoTitle: {
    color: "#667085",
    fontSize: 13,
  },
  infoText: {
    color: "#101828",
    fontSize: 15,
    fontWeight: "600",
  },
  primaryButton: {
    minHeight: 50,
    borderRadius: 14,
    backgroundColor: "#6D28F0",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
