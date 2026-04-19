import React from "react";
import { Pressable, ViewStyle, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { sizes } from "../../../../theme/tokens/sizes";
import { CIconButtonProps } from "./types";

interface BaseProps extends CIconButtonProps {
  containerStyle: any[];
  iconSize: number;
  finalIconColor: string;
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: sizes.borderRadius.full,
  },
});

export const Base: React.FC<BaseProps> = ({
  iconName,
  containerStyle,
  iconSize,
  finalIconColor,
  disabled,
  ...props
}) => {
  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.container,
        ...containerStyle,
        pressed && { opacity: 0.7 },
      ]}
      {...props}
    >
      <Ionicons name={iconName} size={iconSize} color={finalIconColor} />
    </Pressable>
  );
};
