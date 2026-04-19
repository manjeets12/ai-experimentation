import React from "react";
import { useStyles } from "./config";
import { Base } from "./Base";
import { CChipProps } from "./types";

const CChip: React.FC<CChipProps> = ({
  variant = "filled",
  selected = false,
  disabled = false,
  ...props
}) => {
  const { styles } = useStyles();
  const containerStyle = [
    styles[variant],
    selected ? styles.selected : {},
    disabled ? styles.disabled : {},
  ];

  const textStyle = [
    styles[`${variant}Text`],
    selected ? styles.selectedText : {},
    disabled ? styles.disabled : {},
  ];

  return (
    <Base
      {...props}
      disabled={disabled}
      selected={selected}
      containerStyle={containerStyle}
      textStyle={textStyle}
    />
  );
};

export default CChip;
export * from "./types";
export * from "./config";
