import React from "react";
import { View, StyleSheet } from "react-native";
import { sizes } from "../../../../theme/tokens/sizes";
import { CDividerProps } from "./types";
import CText from "../CText";

interface BaseProps extends CDividerProps {
  containerStyle: any;
  lineStyle: any;
  labelContainerStyle: any;
  labelTextStyle: any;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  line: {
    flex: 1,
    height: 1,
  },
  labelContainer: {
    paddingHorizontal: sizes.spacing.sm,
  },
  label: {
    fontSize: sizes.fontSizes.sm,
  },
});

export const Base: React.FC<BaseProps> = ({
  label,
  containerStyle,
  lineStyle,
  labelContainerStyle,
  labelTextStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.line, lineStyle]} />
      {label && (
        <View style={[styles.labelContainer, labelContainerStyle]}>
          <CText style={[styles.label, labelTextStyle]}>{label}</CText>
        </View>
      )}
      {label && <View style={[styles.line, lineStyle]} />}
    </View>
  );
};
