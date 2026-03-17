import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
type Props = {
  children: React.ReactNode;
  backgroundColor?: string;
};

export function ScreenContainer({ children, backgroundColor }: Props) {
  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor }]}
      edges={["top", "bottom"]}
    >
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 12,
  },
});
