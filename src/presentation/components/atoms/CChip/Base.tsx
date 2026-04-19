import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { sizes } from "../../../../theme/tokens/sizes";
import { CChipProps } from "./types";
import CText from "../CText";

interface BaseProps extends CChipProps {
  containerStyle: any[];
  textStyle: any[];
}

const styles = StyleSheet.create({
  container: {
    borderRadius: sizes.borderRadius.full,
    paddingHorizontal: sizes.spacing.md,
    paddingVertical: sizes.spacing.xxs,
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginRight: sizes.spacing.xs,
    marginBottom: sizes.spacing.xs,
  },
  text: {
    fontSize: sizes.fontSizes.sm,
    fontWeight: "500",
  },
});

export const Base: React.FC<BaseProps> = ({
  label,
  containerStyle,
  textStyle,
  ...props
}) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        ...containerStyle,
        pressed && { opacity: 0.7 },
      ]}
      {...props}
    >
      <CText style={[styles.text, ...textStyle]}>{label}</CText>
    </Pressable>
  );
};
