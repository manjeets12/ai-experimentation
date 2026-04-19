import React from "react";
import { useStyles } from "./config";
import { Base } from "./Base";
import { CIconButtonProps } from "./types";

const SIZE_MAP = {
  small: 20,
  medium: 24,
  large: 32,
};

const CIconButton: React.FC<CIconButtonProps> = ({
  variant = "ghost",
  size = "medium",
  iconColor = "textPrimary",
  disabled = false,
  ...props
}) => {
  const { styles, theme } = useStyles();
  const containerStyle = [
    styles[variant],
    typeof size === "string" ? styles[size] : { width: size + 16, height: size + 16 },
    disabled ? styles.disabled : {},
  ];

  const iconSize = typeof size === "string" ? SIZE_MAP[size] : size;
  const finalIconColor = theme.colors[iconColor];

  return (
    <Base
      {...props}
      containerStyle={containerStyle}
      iconSize={iconSize}
      finalIconColor={finalIconColor}
      disabled={disabled}
    />
  );
};

export default CIconButton;
export * from "./types";
export * from "./config";
