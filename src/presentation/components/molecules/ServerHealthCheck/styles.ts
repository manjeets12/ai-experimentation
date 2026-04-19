import { StyleSheet } from "react-native";
import { makeStyles } from "@/theme/helper";

export const useStyles = makeStyles((theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      padding: 24,
    },
    checkingText: {
      marginTop: 16,
    },
    errorHeading: {
      marginTop: 16,
      textAlign: 'center',
    },
    errorBody: {
      marginTop: 8,
      textAlign: 'center',
      marginBottom: 24,
      lineHeight: 24,
    },
    codeBlock: {
      fontFamily: 'monospace',
    },
    retryText: {
      marginTop: 8,
    }
  })
);
