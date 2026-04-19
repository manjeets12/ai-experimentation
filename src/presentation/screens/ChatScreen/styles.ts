import { StyleSheet, ViewStyle } from "react-native";
import { ThemeColors } from "../../../theme/createTheme";
import { spacing, borderRadius } from "../../../theme/tokens/sizes";

export const getChatStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    chatList: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.xl,
    },
    centerContainer: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: "center",
      alignItems: "center",
      padding: spacing.md,
    },
    loadingText: {
      marginTop: spacing.md,
      textAlign: "center",
    },
    retryBtn: {
      marginTop: spacing.md,
      padding: spacing.sm,
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: borderRadius.md,
    },
    emptyStateContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: spacing.xl,
      marginTop: "30%",
    },
    emptyStateTitle: {
      marginTop: spacing.md,
      marginBottom: spacing.xs,
      textAlign: "center",
    },
    emptyStateSubtitle: {
      textAlign: "center",
      paddingHorizontal: spacing.lg,
    },
    drawerOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "flex-start",
      alignItems: "flex-start",
    },
    drawerOverlayTouchable: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    drawerContent: {
      width: "75%",
      height: "100%",
      backgroundColor: colors.background,
      paddingTop: spacing.xl,
      shadowColor: "#000",
      shadowOffset: { width: 2, height: 0 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    drawerHeader: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    drawerItem: {
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    drawerItemActive: {
      backgroundColor: colors.border,
    },
    drawerLoaderContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    inputBarContainer: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: colors.background,
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    pillContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.background, // Match GPT solid feel or subtle surface
      borderRadius: borderRadius.full,
      borderWidth: 1.5,
      borderColor: colors.border,
      paddingLeft: spacing.sm,
      paddingRight: spacing.xxs,
      minHeight: 44,
    },
    input: {
      flex: 1,
      marginBottom: 0,
    },
    inputWrapper: {
      borderWidth: 0,
      backgroundColor: "transparent",
      paddingHorizontal: spacing.xs,
    },
    sendButton: {
      // Circle inside the pill
    },
    thinkingContainer: {
      //paddingVertical: spacing.sm,
    },
    scrollToBottomContainer: {
      position: 'absolute',
      top: -55,
      alignSelf: 'center',
      zIndex: 10,
      backgroundColor: colors.background,
      borderRadius: 30,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    }
  });
};
