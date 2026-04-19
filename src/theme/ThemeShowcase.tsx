import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from "react-native";
import { useTheme } from "./ThemeProvider";
import { spacing, borderRadius, fontSizes } from "./tokens/sizes";

export const ThemeShowcase = () => {
  const { theme, toggleTheme, mode, isSystemTheme, setUseSystemTheme } = useTheme();
  const { colors } = theme;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: spacing.md,
    },
    header: {
      fontSize: fontSizes.xxl,
      fontWeight: "bold",
      color: colors.textPrimary,
      marginBottom: spacing.lg,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      fontSize: fontSizes.lg,
      fontWeight: "600",
      color: colors.textPrimary,
      marginBottom: spacing.md,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.md,
    },
    text: {
      color: colors.textPrimary,
      fontSize: fontSizes.md,
    },
    subtext: {
      color: colors.textSecondary,
      fontSize: fontSizes.sm,
      marginTop: spacing.xxs,
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.sm,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      alignItems: "center",
      marginTop: spacing.md,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: fontSizes.md,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    chip: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xxs,
      borderRadius: borderRadius.full,
      backgroundColor: colors.secondary,
    },
    chipText: {
      color: "#fff",
      fontSize: fontSizes.xs,
    }
  });

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle={mode === "dark" ? "light-content" : "dark-content"} />
      
      <Text style={styles.header}>Theme Showcase</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Controls</Text>
        <TouchableOpacity style={styles.button} onPress={toggleTheme}>
          <Text style={styles.buttonText}>Toggle Light/Dark</Text>
        </TouchableOpacity>
        
        <View style={styles.row}>
          <Text style={styles.text}>System Theme</Text>
          <TouchableOpacity 
            style={[styles.chip, { opacity: isSystemTheme ? 1 : 0.5 }]} 
            onPress={() => setUseSystemTheme(!isSystemTheme)}
          >
            <Text style={styles.chipText}>{isSystemTheme ? "ON" : "OFF"}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtext}>Current Mode: {mode.toUpperCase()}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Semantic Colors</Text>
        
        <View style={styles.card}>
          <Text style={[styles.text, { color: colors.primary }]}>Primary Color</Text>
          <Text style={styles.subtext}>Used for main actions and branding</Text>
        </View>

        <View style={styles.card}>
          <Text style={[styles.text, { color: colors.secondary }]}>Secondary Color</Text>
          <Text style={styles.subtext}>Used for highlights and accents</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.text}>Surface Background</Text>
          <Text style={styles.subtext}>Text Secondary style applied here</Text>
        </View>

        <View style={styles.card}>
          <Text style={[styles.text, { color: colors.error }]}>Error Message</Text>
          <Text style={[styles.text, { color: colors.success, marginTop: spacing.xs }]}>Success Message</Text>
        </View>
      </View>
    </ScrollView>
  );
};
