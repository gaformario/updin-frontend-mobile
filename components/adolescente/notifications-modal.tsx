import { adolescenteHomeStyles as stylePainel } from "@/styles/adolescente/home";
import type { MissaoValidadaNotificacaoResumo } from "@/types/view-models";
import { formatCurrency } from "@/utils/currency";
import { formatDateTime } from "@/utils/date";
import { Ionicons } from "@expo/vector-icons";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

function NotificationListItem({
  item,
  onPress,
}: {
  item: MissaoValidadaNotificacaoResumo;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.86}
      onPress={onPress}
      style={[
        stylePainel.notificationCard,
        item.lidaEm ? stylePainel.notificationCardRead : null,
      ]}
    >
      <View style={stylePainel.notificationCardTop}>
        <View style={stylePainel.notificationIconWrap}>
          <Ionicons name="checkmark-circle" size={24} color="#16A34A" />
        </View>

        <View style={stylePainel.notificationContent}>
          <Text style={stylePainel.notificationTitle}>{item.titulo}</Text>
          <Text style={stylePainel.notificationSubTitle}>{item.subtitulo}</Text>
        </View>

        <View style={stylePainel.notificationMeta}>
          <View style={stylePainel.notificationXpBadge}>
            <Text style={stylePainel.notificationXpBadgeText}>
              +{item.xpGanho} XP
            </Text>
          </View>
          <Text style={stylePainel.notificationDate}>
            {formatDateTime(item.criadoEm)}
          </Text>
        </View>
      </View>

      <Text style={stylePainel.notificationMissionTitle}>
        {item.missaoTitulo}
      </Text>
      <Text style={stylePainel.notificationMessage} numberOfLines={2}>
        {item.mensagem}
      </Text>

      {item.temCreditoFinanceiro ? (
        <View style={stylePainel.notificationMoneyRow}>
          <Text style={stylePainel.notificationMoneyLabel}>
            Crédito aprovado
          </Text>
          <Text style={stylePainel.notificationMoneyValue}>
            +{formatCurrency(item.valorCreditado)}
          </Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

export function NotificationsModal({
  visible,
  notificacoes,
  bottomInset,
  onClose,
  onOpenNotification,
}: {
  visible: boolean;
  notificacoes: MissaoValidadaNotificacaoResumo[];
  bottomInset: number;
  onClose: () => void;
  onOpenNotification: (notificacaoId: string) => void;
}) {
  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={stylePainel.modalOverlay}>
        <TouchableOpacity
          activeOpacity={1}
          style={{ flex: 1 }}
          onPress={onClose}
        />

        <View
          style={[stylePainel.modalSheet, { paddingBottom: bottomInset + 20 }]}
        >
          <View style={stylePainel.modalHandle} />

          <View style={stylePainel.modalHeader}>
            <View style={{ flex: 1 }}>
              <Text style={stylePainel.modalTitle}>Notificações</Text>
              <Text style={stylePainel.modalSubtitle}>
                Missões Aprovadas | Histórico de notificações
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.82}
              onPress={onClose}
              style={stylePainel.modalCloseButton}
            >
              <Ionicons name="close" size={18} color="#344054" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={stylePainel.notificationList}
          >
            {notificacoes.length ? (
              notificacoes.map((item) => (
                <NotificationListItem
                  key={item.id}
                  item={item}
                  onPress={() => onOpenNotification(item.id)}
                />
              ))
            ) : (
              <View style={stylePainel.notificationEmpty}>
                <Ionicons
                  name="notifications-off-outline"
                  size={24}
                  color="#98A2B3"
                />
                <Text style={stylePainel.notificationEmptyTitle}>
                  Nenhuma notificação ainda
                </Text>
                <Text style={stylePainel.notificationEmptyText}>
                  Quando uma missão for aprovada, ela aparecerá aqui.
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
