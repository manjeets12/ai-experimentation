import { StyleSheet } from "react-native";
import { makeStyles } from "../../../../theme/helper";

export const useStyles = makeStyles((theme) => {
  const { colors } = theme;

  return StyleSheet.create({
    line: {
      backgroundColor: colors.divider,
    },
    label: {
      color: colors.textSecondary,
    },
  });
});
