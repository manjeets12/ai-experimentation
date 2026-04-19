import React from "react";
import { Pressable, ActivityIndicator, ViewStyle, TextStyle, StyleSheet } from "react-native";
import { sizes } from "../../../../theme/tokens/sizes";
import { CButtonProps } from "./types";
import CText from "../CText";

interface BaseProps extends CButtonProps {
  containerStyle: ViewStyle[];
  textStyle: TextStyle[];
  loaderColor: string;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: sizes.borderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  text: {
    fontWeight: "600",
  },
});

export const Base: React.FC<BaseProps> = ({
  title,
  loading,
  disabled,
  containerStyle,
  textStyle,
  loaderColor,
  ...props
}) => {
  return (
    <Pressable
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.container,
        ...containerStyle,
        pressed && { opacity: 0.7 },
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={loaderColor} size="small" />
      ) : (
        <CText style={[styles.text, ...textStyle]}>{title}</CText>
      )}
    </Pressable>
  );
};
