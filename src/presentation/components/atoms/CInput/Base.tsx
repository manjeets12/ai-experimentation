import React from "react";
import { View, TextInput, StyleSheet, Platform } from "react-native";
import { sizes } from "../../../../theme/tokens/sizes";
import { CInputProps } from "./types";
import CText from "../CText";

interface BaseProps extends CInputProps {
  containerStyle: any;
  inputWrapperStyle: any[];
  inputStyle: any;
  labelStyle: any;
  helperStyle: any;
  errorTextStyle: any;
}

const styles = StyleSheet.create({
  container: {
    marginBottom: sizes.spacing.md,
  },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: sizes.borderRadius.sm,
    paddingHorizontal: sizes.spacing.md,
    justifyContent: "center",
  },
  input: {
    fontSize: sizes.fontSizes.md,
    paddingVertical: sizes.spacing.sm,
    margin: 0,
  },
  label: {
    marginBottom: sizes.spacing.xxs,
  },
  helper: {
    marginTop: sizes.spacing.xxs,
    fontSize: sizes.fontSizes.xs,
  },
});

export const Base: React.FC<BaseProps> = ({
  label,
  helperText,
  error,
  containerStyle,
  inputWrapperStyle,
  inputStyle,
  labelStyle,
  helperStyle,
  errorTextStyle,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <CText variant="label" style={[styles.label, labelStyle]}>
          {label}
        </CText>
      )}
      <View style={[styles.inputWrapper, ...inputWrapperStyle]}>
        <TextInput
          style={[styles.input, inputStyle]}
          placeholderTextColor="#999"
          editable={!props.disabled}
          {...props}
        />
      </View>
      {(error || helperText) && (
        <CText style={[styles.helper, helperStyle, error ? errorTextStyle : {}]}>
          {error || helperText}
        </CText>
      )}
    </View>
  );
};
