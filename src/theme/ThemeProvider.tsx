import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { Appearance, ColorSchemeName } from "react-native";
import { Theme, createTheme, ThemeMode } from "./createTheme";

interface ThemeContextType {
  theme: Theme;
  mode: ThemeMode;
  isSystemTheme: boolean;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  setUseSystemTheme: (useSystem: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>((Appearance.getColorScheme() as ThemeMode) || "light");
  const [isSystemTheme, setIsSystemTheme] = useState(true);

  useEffect(() => {
    if (!isSystemTheme) return;

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (colorScheme) {
        setModeState(colorScheme as ThemeMode);
      }
    });

    return () => subscription.remove();
  }, [isSystemTheme]);

  const theme = useMemo(() => createTheme(mode), [mode]);

  const setMode = (newMode: ThemeMode) => {
    setIsSystemTheme(false);
    setModeState(newMode);
  };

  const toggleTheme = () => {
    setIsSystemTheme(false);
    setModeState((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setUseSystemTheme = (useSystem: boolean) => {
    setIsSystemTheme(useSystem);
    if (useSystem) {
      setModeState((Appearance.getColorScheme() as ThemeMode) || "light");
    }
  };

  const value = useMemo(
    () => ({
      theme,
      mode,
      isSystemTheme,
      setMode,
      toggleTheme,
      setUseSystemTheme,
    }),
    [theme, mode, isSystemTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
