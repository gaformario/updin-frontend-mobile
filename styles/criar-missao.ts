import { StyleSheet } from "react-native";

export const criarMissaoStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },
  header: {
    backgroundColor: "#9A00FF",
    paddingHorizontal: 16,
    paddingBottom: 18,
  },
  backButton: {
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
    padding: 8,
    gap: 14,
  },
  highlightCard: {
    backgroundColor: "#FF5B00",
    borderRadius: 14,
    padding: 14,
  },
  highlightLabel: {
    color: "#FFF3E8",
    fontSize: 12,
  },
  highlightValue: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "700",
    marginTop: 4,
  },
  highlightCaption: {
    color: "#FFF3E8",
    fontSize: 11,
    marginTop: 2,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 10,
  },
  inputRow: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 52,
    color: "#111827",
    fontSize: 15,
  },
  textArea: {
    minHeight: 88,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: "#111827",
    fontSize: 15,
  },
  moneyPrefix: {
    color: "#98A2B3",
    fontSize: 24,
  },
  segmentRow: {
    flexDirection: "row",
    gap: 8,
  },
  segmentButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: 12,
    backgroundColor: "#EEF2F7",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  segmentButtonActive: {
    backgroundColor: "#9A00FF",
  },
  segmentText: {
    color: "#344054",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
  segmentTextActive: {
    color: "#FFF",
  },
  footerRow: {
    flexDirection: "row",
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
  },
  cancelText: {
    color: "#344054",
    fontWeight: "600",
    fontSize: 16,
  },
  createButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#C084FC",
  },
  createText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },
});
