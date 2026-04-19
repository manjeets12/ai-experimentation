import { StyleSheet } from "react-native";
import { makeStyles } from "../../../../theme/helper";

export const useStyles = makeStyles((theme) => {
  const { colors } = theme;

  return StyleSheet.create({
    // Variants
    filled: { backgroundColor: colors.surface },
    outlined: { backgroundColor: colors.transparent, borderWidth: 1, borderColor: colors.border },
    
    // Text Variants
    filledText: { color: colors.textPrimary },
    outlinedText: { color: colors.textPrimary },

    // States
    selected: { backgroundColor: colors.primary, borderColor: colors.primary },
    selectedText: { color: colors.background },
    disabled: { opacity: 0.5 },
  });
});
