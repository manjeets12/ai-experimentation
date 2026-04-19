import { palette } from "./tokens/palette";

export type ThemeMode = "light" | "dark";

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  divider: string;
  transparent:string;
}

export interface Theme {
  colors: ThemeColors;
  mode: ThemeMode;
}

const baseTokens = {
  light: {
    background: palette.neutral.white,
    surface: palette.neutral.gray50,
    textPrimary: palette.neutral.gray900,
    textSecondary: palette.neutral.gray600,
    border: palette.neutral.gray200,
    divider: palette.neutral.gray100,
    error: "#d32f2f",
    success: "#2e7d32",
    transparent:palette.neutral.transparent
  },
  dark: {
    background: palette.neutral.gray900,
    surface: "#1e1e1e",
    textPrimary: palette.neutral.gray50,
    textSecondary: palette.neutral.gray400,
    border: palette.neutral.gray800,
    divider: palette.neutral.gray800,
    error: "#f44336",
    success: "#4caf50",
    transparent:palette.neutral.transparent
  },
};

export const getThemeColors = (mode: ThemeMode): ThemeColors => {
  const isDark = mode === "dark";
  const base = baseTokens[mode];

  return {
    ...base,
    primary: isDark ? palette.primary[400] : palette.primary[500],
    secondary: isDark ? palette.secondary[400] : palette.secondary[500],
  };
};

export const createTheme = (mode: ThemeMode): Theme => {
  return {
    mode,
    colors: getThemeColors(mode),
  };
};
