import { TextProps, TextStyle } from "react-native";
import { ThemeColors } from "../../../../theme/createTheme";

export type CTextVariant = "heading" | "subheading" | "body" | "caption" | "label";

export interface CTextProps extends TextProps {
  variant?: CTextVariant;
  color?: keyof ThemeColors;
  align?: TextStyle["textAlign"];
  children?: React.ReactNode;
}
