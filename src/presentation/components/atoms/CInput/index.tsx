import React, { useState } from "react";
import { useStyles } from "./config";
import { Base } from "./Base";
import { CInputProps } from "./types";

const CInput: React.FC<CInputProps> = ({ 
  disabled, 
  error, 
  containerStyle,
  inputWrapperStyle: customInputWrapperStyle,
  inputStyle: customInputStyle,
  labelStyle: customLabelStyle,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const { styles } = useStyles();

  const inputWrapperStyle = [
    styles.inputWrapper,
    isFocused ? styles.focused : {},
    error ? styles.error : {},
    disabled ? styles.disabled : {},
    customInputWrapperStyle,
  ];

  const labelStyle = [
    customLabelStyle,
  ];

  const inputStyle = [
    styles.input,
    customInputStyle,
  ];

  return (
    <Base
      {...props}
      disabled={disabled}
      error={error}
      containerStyle={containerStyle}
      inputWrapperStyle={inputWrapperStyle}
      inputStyle={inputStyle as any}
      labelStyle={labelStyle}
      helperStyle={styles.helper}
      errorTextStyle={styles.errorText}
      onFocus={(e) => {
        setIsFocused(true);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setIsFocused(false);
        props.onBlur?.(e);
      }}
    />
  );
};

export default CInput;
export * from "./types";
export * from "./config";
