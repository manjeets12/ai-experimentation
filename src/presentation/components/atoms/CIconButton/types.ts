import { PressableProps, ViewStyle } from "react-native";
import { ThemeColors } from "../../../../theme/createTheme";
import { Ionicons } from "@expo/vector-icons";

export type CIconButtonVariant = "primary" | "secondary" | "ghost" | "surface";

export interface CIconButtonProps extends PressableProps {
  iconName: keyof typeof Ionicons.glyphMap;
  variant?: CIconButtonVariant;
  size?: number | "small" | "medium" | "large";
  iconColor?: keyof ThemeColors;
  disabled?: boolean;
}
