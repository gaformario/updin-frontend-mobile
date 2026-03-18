import { StyleSheet } from "react-native";

export const configMesadaStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },
  header: {
    backgroundColor: "#3D63F3",
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
    color: "#D7E3FF",
    marginTop: 2,
    fontSize: 13,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 8,
    gap: 16,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  labelNoMargin: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
  },
  helperText: {
    color: "#667085",
    fontSize: 12,
    marginTop: 4,
  },
  moneyInput: {
    minHeight: 56,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  moneyPrefix: {
    fontSize: 28,
    color: "#98A2B3",
  },
  moneyTextInput: {
    flex: 1,
    fontSize: 30,
    fontWeight: "600",
    color: "#111827",
  },
  splitCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  splitCardGreen: {
    backgroundColor: "#E7F9EC",
    borderColor: "#86EFAC",
    marginBottom: 10,
  },
  splitCardOrange: {
    backgroundColor: "#FFF0DD",
    borderColor: "#FDBA74",
  },
  splitTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  splitSubtitle: {
    marginTop: 4,
    fontSize: 12,
  },
  splitValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  segmentRow: {
    flexDirection: "row",
    gap: 8,
  },
  segmentButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 12,
    backgroundColor: "#EEF2F7",
    alignItems: "center",
    justifyContent: "center",
  },
  segmentButtonActive: {
    backgroundColor: "#3D63F3",
  },
  segmentText: {
    color: "#344054",
    fontWeight: "600",
  },
  segmentTextActive: {
    color: "#FFF",
  },
  switchCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  confirmButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3D63F3",
  },
  confirmText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },
});
