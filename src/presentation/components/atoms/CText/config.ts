import { StyleSheet } from "react-native";
import { sizes } from "../../../../theme/tokens/sizes";
import { makeStyles } from "../../../../theme/helper";

export const useStyles = makeStyles((theme) => {
  const { colors } = theme;

  return StyleSheet.create({
    heading: {
      fontSize: sizes.fontSizes.xxl,
      fontWeight: "bold",
      lineHeight: sizes.fontSizes.xxl * 1.2,
      color: colors.textPrimary,
    },
    subheading: {
      fontSize: sizes.fontSizes.lg,
      fontWeight: "600",
      lineHeight: sizes.fontSizes.lg * 1.2,
      color: colors.textPrimary,
    },
    body: {
      fontSize: sizes.fontSizes.md,
      fontWeight: "normal",
      lineHeight: sizes.fontSizes.md * 1.4,
      color: colors.textPrimary,
    },
    caption: {
      fontSize: sizes.fontSizes.sm,
      fontWeight: "normal",
      lineHeight: sizes.fontSizes.sm * 1.4,
      color: colors.textSecondary,
    },
    label: {
      fontSize: sizes.fontSizes.xs,
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: 0.5,
      color: colors.textPrimary,
    },
  });
});
