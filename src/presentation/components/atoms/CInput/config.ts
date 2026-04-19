import { StyleSheet } from "react-native";
import { makeStyles } from "../../../../theme/helper";

export const useStyles = makeStyles((theme) => {
  const { colors } = theme;

  return StyleSheet.create({
    inputWrapper: {
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    input: {
      color: colors.textPrimary,
    },
    focused: {
      borderColor: colors.primary,
      borderWidth: 2,
    },
    error: {
      borderColor: colors.error,
    },
    disabled: {
      backgroundColor: colors.divider,
      opacity: 0.6,
    },
    helper: {
      color: colors.textSecondary,
    },
    errorText: {
      color: colors.error,
    },
  });
});
