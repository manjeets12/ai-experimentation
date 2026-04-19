import { ViewStyle, ActivityIndicatorProps } from "react-native";
import { ThemeColors } from "../../../../theme/createTheme";

export interface CLoaderProps extends ActivityIndicatorProps {
  colorVariant?: keyof ThemeColors;
  fullScreen?: boolean;
}
