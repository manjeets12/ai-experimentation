import React from "react";
import { useStyles } from "./config";
import { Base } from "./Base";
import { CButtonProps } from "./types";

const CButton: React.FC<CButtonProps> = ({
  variant = "primary",
  size = "medium",
  disabled,
  loading,
  ...props
}) => {
  const { styles } = useStyles();
  const containerStyle = [
    styles[variant],
    styles[`${size}Size`],
    disabled ? styles.disabled : {},
  ];

  const textStyle = [
    styles[`${variant}Text`],
    styles[`${size}TextSize`],
    disabled ? styles.disabled : {},
  ];

  const loaderColor = styles[`${variant}Text`].color as string;

  return (
    <Base
      {...props}
      variant={variant}
      size={size}
      disabled={disabled}
      loading={loading}
      containerStyle={containerStyle}
      textStyle={textStyle}
      loaderColor={loaderColor}
    />
  );
};

export default CButton;
export * from "./types";
export * from "./config";
