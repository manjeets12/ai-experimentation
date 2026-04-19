import { StyleSheet } from "react-native";
import { makeStyles } from "../../../../theme/helper";

export const useStyles = makeStyles((theme) => {
  const { colors } = theme;

  return StyleSheet.create({
    fullScreen: {
      backgroundColor: colors.background,
    },
  });
});
