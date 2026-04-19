import { StyleSheet,  } from "react-native";
import { sizes } from "../../../../theme/tokens/sizes";
import { makeStyles } from "../../../../theme/helper";

export const useStyles = makeStyles((theme) => {
  const { colors } = theme;

  return StyleSheet.create({
    // Variants
    primary: { backgroundColor: colors.primary },
    secondary: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
    tertiary: { backgroundColor: colors.transparent },
    success: { backgroundColor: colors.success },
    error: { backgroundColor: colors.error },
    
    // Text Variants
    primaryText: { color: colors.background },
    secondaryText: { color: colors.primary },
    tertiaryText: { color: colors.primary },
    successText: { color: colors.background },
    errorText: { color: colors.background },

    // Sizes
    smallSize: { paddingVertical: sizes.spacing.xxs, paddingHorizontal: sizes.spacing.sm },
    mediumSize: { paddingVertical: sizes.spacing.sm, paddingHorizontal: sizes.spacing.md },
    largeSize: { paddingVertical: sizes.spacing.md, paddingHorizontal: sizes.spacing.lg },

    // Text Sizes
    smallTextSize: { fontSize: sizes.fontSizes.xs },
    mediumTextSize: { fontSize: sizes.fontSizes.md },
    largeTextSize: { fontSize: sizes.fontSizes.lg },

    // States
    disabled: { opacity: 0.5 },
    pressed: { opacity: 0.7 },
  });
});
