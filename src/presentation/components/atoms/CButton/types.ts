import { PressableProps, ViewStyle, TextStyle } from "react-native";

export type CButtonVariant = "primary" | "secondary" | "tertiary" | "success" | "error";
export type CButtonSize = "small" | "medium" | "large";

export interface CButtonProps extends PressableProps {
  variant?: CButtonVariant;
  size?: CButtonSize;
  title: string;
  loading?: boolean;
  disabled?: boolean;
}
