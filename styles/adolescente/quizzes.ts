import { colors } from "@/constants/colors";
import { StyleSheet } from "react-native";

export const adolescenteQuizzesStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  scroll: {
    flex: 1,
  },
  content: {
    gap: 14,
  },
  hero: {
    paddingHorizontal: 14,
    paddingBottom: 18,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  heroTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "700",
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    fontWeight: "500",
  },
  summaryRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ECEEF3",
    shadowColor: "#101828",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  summaryValue: {
    color: "#101828",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  summaryLabel: {
    color: "#667085",
    fontSize: 12,
  },
  list: {
    paddingHorizontal: 16,
    gap: 12,
  },
  quizCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#ECEEF3",
    shadowColor: "#101828",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  quizHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 14,
  },
  quizIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#F3EEFF",
    alignItems: "center",
    justifyContent: "center",
  },
  quizMain: {
    flex: 1,
  },
  quizTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  quizTitle: {
    flex: 1,
    color: "#101828",
    fontSize: 16,
    fontWeight: "700",
  },
  quizCategory: {
    color: "#98A2B3",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  quizMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  quizMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  quizMetaText: {
    color: "#667085",
    fontSize: 12,
  },
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  badgeBase: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeTextBase: {
    fontSize: 11,
    fontWeight: "600",
  },
  badgeBlue: {
    backgroundColor: "#EEF2FF",
  },
  badgeBlueText: {
    color: "#6384FF",
  },
  badgeOrange: {
    backgroundColor: "#FFF1E6",
  },
  badgeOrangeText: {
    color: "#F08A24",
  },
  badgeGreen: {
    backgroundColor: "#E8F9EC",
  },
  badgeGreenText: {
    color: "#23B26D",
  },
  actionButton: {
    minHeight: 42,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  actionButtonPrimary: {
    backgroundColor: "#6D28F0",
  },
  actionButtonMuted: {
    backgroundColor: "#F2F4F7",
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  actionButtonTextPrimary: {
    color: "#FFFFFF",
  },
  actionButtonTextMuted: {
    color: "#475467",
  },
});
