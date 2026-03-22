import { colors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const adolescenteResponderQuizStyles = StyleSheet.create({
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
    backgroundColor: "#6D28F0",
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
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
    marginTop: 6,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 14,
  },
  progressCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E7EAF2",
    gap: 8,
  },
  progressLabel: {
    color: "#667085",
    fontSize: 13,
  },
  progressValue: {
    color: "#101828",
    fontSize: 18,
    fontWeight: "700",
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "#EAECF5",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#6D28F0",
  },
  questionCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E7EAF2",
    gap: 12,
  },
  questionIndex: {
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
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 22,
  },
  optionsList: {
    gap: 10,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#DDE2EB",
    padding: 13,
    backgroundColor: "#FFF",
  },
  optionButtonSelected: {
    borderColor: "#6D28F0",
    backgroundColor: "#F4F0FF",
  },
  optionBullet: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F4F7",
  },
  optionBulletSelected: {
    backgroundColor: "#6D28F0",
  },
  optionBulletText: {
    color: "#475467",
    fontSize: 12,
    fontWeight: "700",
  },
  optionBulletTextSelected: {
    color: "#FFF",
  },
  optionText: {
    flex: 1,
    color: "#101828",
    fontSize: 14,
    lineHeight: 20,
  },
  optionTextSelected: {
    color: "#4C1D95",
    fontWeight: "600",
  },
  footerRow: {
    flexDirection: "row",
    gap: 10,
  },
  footerButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    backgroundColor: "#EAECF5",
  },
  secondaryButtonText: {
    color: "#344054",
    fontSize: 15,
    fontWeight: "700",
  },
  primaryButton: {
    backgroundColor: "#6D28F0",
  },
  primaryButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
