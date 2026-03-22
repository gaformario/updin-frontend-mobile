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
    gap: 12,
  },
  hero: {
    paddingHorizontal: 16,
    paddingBottom: 54,
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
    fontSize: 32,
    fontWeight: "700",
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    fontWeight: "500",
  },
  summarySection: {
    marginTop: -28,
    paddingHorizontal: 16,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.neutral.white,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E7E8EE",
    shadowColor: "#101828",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  summaryValue: {
    color: "#101828",
    fontSize: 17,
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
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E7E8EE",
    shadowColor: "#101828",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  quizHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
  },
  quizIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#F4EFFF",
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
    fontSize: 15,
    fontWeight: "700",
  },
  quizCategory: {
    color: "#8A94A6",
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
    paddingVertical: 5,
  },
  badgeTextBase: {
    fontSize: 11,
    fontWeight: "600",
  },
  badgeBlue: {
    backgroundColor: "#EEF2FF",
  },
  badgeBlueText: {
    color: "#7A86FF",
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
    borderRadius: 11,
    overflow: "hidden",
  },
  actionButtonPrimary: {
    minHeight: 42,
    borderRadius: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  actionButtonMuted: {
    backgroundColor: "#F2F4F7",
  },
  actionButtonError: {
    marginHorizontal: 16,
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
  emptyCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#ECEEF3",
    gap: 8,
  },
  emptyTitle: {
    color: "#101828",
    fontSize: 18,
    fontWeight: "700",
  },
  emptyText: {
    color: "#667085",
    fontSize: 14,
    lineHeight: 20,
  },
});
