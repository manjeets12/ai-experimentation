import React from "react";
import { Text } from "react-native";
import { useStyles } from "./config";
import { CTextProps } from "./types";

const CText: React.FC<CTextProps> = ({
  variant = "body",
  color,
  align,
  style,
  children,
  ...props
}) => {
  const { styles, theme } = useStyles();

  const resolvedStyle = [
    styles[variant],
    color ? { color: theme.colors[color] } : {},
    align ? { textAlign: align } : {},
    style,
  ];

  return (
    <Text style={resolvedStyle} {...props}>
      {children}
    </Text>
  );
};

export default CText;
export * from "./types";
export * from "./config";
