import { StyleSheet } from "react-native";
import { makeStyles } from "../../../../theme/helper";
import { palette } from "../../../../theme/tokens/palette";

export const useStyles = makeStyles((theme) => {
  const { colors } = theme;

  return StyleSheet.create({
    container: {
      backgroundColor: colors.background,
    },
    upgradeChip: {
      backgroundColor: palette.secondary[50],
    },
    upgradeText: {
      color: palette.secondary[600],
      fontWeight: "bold",
    },
  });
});
