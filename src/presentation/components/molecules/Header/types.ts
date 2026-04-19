import { Ionicons } from "@expo/vector-icons";

export interface HeaderProps {
  leftIcon?: keyof typeof Ionicons.glyphMap;
  onLeftPress?: () => void;
  title?: string;
  hasUpgrade?: boolean;
  onUpgradePress?: () => void;
  rightIcons?: (keyof typeof Ionicons.glyphMap)[];
  onRightPress?: (index: number) => void;
}
