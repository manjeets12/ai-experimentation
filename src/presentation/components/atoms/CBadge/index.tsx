import React from "react";
import { useStyles } from "./config";
import { Base } from "./Base";
import { CBadgeProps } from "./types";

const CBadge: React.FC<CBadgeProps> = ({
  variant = "primary",
  dot = false,
  label,
}) => {
  const { styles } = useStyles();

  const containerStyle = [
    styles[variant],
  ];

  const textStyle = [
    styles[`${variant}Text`],
  ];

  return (
    <Base
      variant={variant}
      dot={dot}
      label={label}
      containerStyle={containerStyle}
      textStyle={textStyle}
    />
  );
};

export default CBadge;
export * from "./types";
export * from "./config";
