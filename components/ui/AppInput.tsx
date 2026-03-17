import { colors } from "@/constants/colors";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

type Props = TextInputProps & {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
};

export function AppInput({ label, error, icon, rightElement, ...rest }: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>

      <View
        style={[
          styles.inputContainer,
          error ? styles.inputContainerError : undefined,
        ]}
      >
        {icon ? <View style={styles.leftIcon}>{icon}</View> : null}

        <TextInput
          placeholderTextColor={colors.neutral.placeholder}
          style={styles.input}
          {...rest}
        />

        {rightElement ? (
          <View style={styles.rightElement}>{rightElement}</View>
        ) : null}
      </View>

      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: colors.neutral.text,
  },
  inputContainer: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.neutral.border,
    backgroundColor: colors.neutral.white,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  inputContainerError: {
    borderColor: colors.neutral.danger,
  },
  leftIcon: {
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    minHeight: 52,
    fontSize: 15,
    color: colors.neutral.text,
  },
  rightElement: {
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    marginTop: 6,
    color: colors.neutral.danger,
    fontSize: 12,
  },
});
