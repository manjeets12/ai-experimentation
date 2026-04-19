import { StyleSheet } from "react-native";
import { makeStyles } from "../../../../theme/helper";

export const useStyles = makeStyles((theme) => {
  const { colors } = theme;
  
  return StyleSheet.create({
    // Variants
    primary: { backgroundColor: colors.primary },
    success: { backgroundColor: colors.success },
    warning: { backgroundColor: "#f57c00" },
    error: { backgroundColor: colors.error },
    neutral: { backgroundColor: colors.divider },

    // Text Variants
    primaryText: { color: colors.background },
    successText: { color: colors.background },
    warningText: { color: colors.background },
    errorText: { color: colors.background },
    neutralText: { color: colors.textPrimary },
  });
});
