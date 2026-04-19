import { ViewStyle, TextStyle } from "react-native";

export type CBadgeVariant = "primary" | "success" | "warning" | "error" | "neutral";

export interface CBadgeProps {
  label?: string;
  variant?: CBadgeVariant;
  dot?: boolean;
}
