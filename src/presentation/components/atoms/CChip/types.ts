import { PressableProps, ViewStyle, TextStyle } from "react-native";

export type CChipVariant = "filled" | "outlined";

export interface CChipProps extends PressableProps {
  label: string;
  variant?: CChipVariant;
  selected?: boolean;
  disabled?: boolean;
}
