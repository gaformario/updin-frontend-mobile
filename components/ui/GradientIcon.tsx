import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ColorValue, StyleSheet, View } from "react-native";

type GradientColors = readonly [ColorValue, ColorValue, ...ColorValue[]];

type Props = {
  icon: React.ReactElement;
  colors: GradientColors;
  size?: number;
};

export function GradientIcon({ icon, colors, size = 50 }: Props) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <MaskedView
        style={{ width: size, height: size }}
        maskElement={
          <View style={[styles.maskContainer, { width: size, height: size }]}>
            {icon}
          </View>
        }
      >
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ width: size, height: size }}
        />
      </MaskedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  maskContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
});
