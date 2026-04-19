import { StyleSheet, } from "react-native";
import { makeStyles } from "../../../../theme/helper";

export const useStyles = makeStyles((theme) => {
  const { colors } = theme;

  return StyleSheet.create({
    // Variants
    primary: { backgroundColor: colors.primary },
    secondary: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
    surface: { backgroundColor: colors.surface },
    ghost: { backgroundColor: colors.transparent },

    // Sizes
    small: { width: 32, height: 32 },
    medium: { width: 44, height: 44 },
    large: { width: 56, height: 56 },

    // States
    disabled: { opacity: 0.5 },
    pressed: { opacity: 0.7 },
  });
});
