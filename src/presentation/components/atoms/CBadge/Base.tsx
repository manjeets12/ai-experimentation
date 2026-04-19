import React from "react";
import { View, StyleSheet } from "react-native";
import { sizes } from "../../../../theme/tokens/sizes";
import { CBadgeProps } from "./types";
import CText from "../CText";

interface BaseProps extends CBadgeProps {
  containerStyle: any[];
  textStyle: any[];
}

const styles = StyleSheet.create({
  container: {
    borderRadius: sizes.borderRadius.xs,
    paddingHorizontal: sizes.spacing.xxs,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 8,
    height: 8,
    minWidth: 8,
    borderRadius: sizes.borderRadius.full,
  },
  text: {
    fontSize: 10,
    fontWeight: "bold",
  },
});

export const Base: React.FC<BaseProps> = ({
  label,
  dot,
  containerStyle,
  textStyle,
}) => {
  return (
    <View style={[styles.container, dot && styles.dot, ...containerStyle]}>
      {!dot && label && (
        <CText style={[styles.text, ...textStyle]}>{label}</CText>
      )}
    </View>
  );
};
