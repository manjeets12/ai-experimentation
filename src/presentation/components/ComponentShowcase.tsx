import React, { useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";
import { spacing } from "../../theme/tokens/sizes";
import CText from "./atoms/CText";
import CButton from "./atoms/CButton";
import CInput from "./atoms/CInput";
import CChip from "./atoms/CChip";
import CBadge from "./atoms/CBadge";
import CDivider from "./atoms/CDivider";
import CLoader from "./atoms/CLoader";

export const ComponentShowcase = () => {
  const { theme, toggleTheme } = useTheme();
  const [inputValue, setInputValue] = useState("");
  const [chipSelected, setChipSelected] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: spacing.md,
    },
    section: {
      marginBottom: spacing.xl,
    },
    row: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      gap: spacing.sm,
      marginTop: spacing.sm,
    },
  });

  return (
    <ScrollView style={styles.container}>
      {/* Typography */}
      <View style={styles.section}>
        <CText variant="heading">Typography</CText>
        <CText variant="subheading">Subheading Text</CText>
        <CText variant="body">Body text with semantic primary color.</CText>
        <CText variant="caption">Caption text for smaller details.</CText>
        <CText variant="label">Label style</CText>
      </View>

      <CDivider label="Buttons" />

      {/* Buttons */}
      <View style={styles.section}>
        <View style={styles.row}>
          <CButton title="Primary" variant="primary" size="medium" />
          <CButton title="Secondary" variant="secondary" size="small" />
        </View>
        <View style={styles.row}>
          <CButton title="Success" variant="success" size="medium" />
          <CButton title="Error" variant="error" size="medium" />
        </View>
        <View style={styles.row}>
          <CButton title="Loading" variant="primary" loading />
          <CButton title="Disabled" variant="primary" disabled />
        </View>
        <CButton 
          title="Toggle Theme" 
          variant="tertiary" 
          size="large" 
          onPress={toggleTheme} 
        />
      </View>

      <CDivider label="Inputs" />

      {/* Inputs */}
      <View style={styles.section}>
        <CInput 
          label="Username" 
          placeholder="Enter username" 
          value={inputValue}
          onChangeText={setInputValue}
          helperText="Choose a unique name"
        />
        <CInput 
          label="Password" 
          placeholder="Secure password" 
          secureTextEntry 
          error="Password is too short"
        />
        <CInput 
          label="Disabled Input" 
          disabled 
          placeholder="Cannot type here"
        />
      </View>

      <CDivider label="Status & Selection" />

      {/* Chips & Badges */}
      <View style={styles.section}>
        <CText variant="subheading">Chips</CText>
        <View style={styles.row}>
          <CChip 
            label="Selected Chip" 
            selected={chipSelected} 
            onPress={() => setChipSelected(!chipSelected)} 
          />
          <CChip label="Outlined Chip" variant="outlined" />
          <CChip label="Disabled Chip" disabled />
        </View>

        <CText variant="subheading" style={{ marginTop: spacing.md }}>Badges</CText>
        <View style={styles.row}>
          <CBadge label="99+" variant="error" />
          <CBadge label="New" variant="success" />
          <CBadge dot variant="primary" />
          <CBadge label="Neutral" variant="neutral" />
        </View>
      </View>

      <CDivider label="Loaders" />

      {/* Loaders */}
      <View style={styles.section}>
        <View style={styles.row}>
          <CLoader colorVariant="primary" size="large" />
          <CLoader colorVariant="secondary" />
          <CLoader colorVariant="success" />
        </View>
      </View>

      <View style={{ height: spacing.xxl }} />
    </ScrollView>
  );
};
