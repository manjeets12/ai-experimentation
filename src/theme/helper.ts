import { useMemo } from "react";
import { StyleSheet,  } from "react-native";
import { useTheme } from "./ThemeProvider";
import { Theme,  } from "./createTheme";

/**
 * A utility to create themed styles for React Native components.
 *
 * @param stylesFactory - A function that returns styles. It receives the theme and optional parameters.
 * @returns A hook that provides the generated styles and current theme colors.
 *
 * @example
 * const useStyle = makeStyles((theme, params: { isActive: boolean }) => (
 *   StyleSheet.create({
 *     container: {
 *       backgroundColor: params.isActive ? theme.colors.primary : theme.colors.background,
 *       padding: 16,
 *     },
 *   })
 * ));
 *
 * // Usage in component:
 * const { styles, colors } = useStyle({ isActive: true });
 */
export const makeStyles =
  <P extends any[], T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>>(
    stylesFactory: (theme: Theme, ...params: P) => T
  ) =>
  (...params: P) => {
    const { theme } = useTheme();

    const styles = useMemo(() => stylesFactory(theme, ...params), [theme, ...params]);

    return {
      styles,
      colors: theme.colors,
      theme,
    };
  };
