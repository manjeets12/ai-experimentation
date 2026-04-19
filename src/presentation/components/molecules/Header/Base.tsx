import React from "react";
import { View, StyleSheet } from "react-native";
import { spacing, borderRadius } from "../../../../theme/tokens/sizes";
import { HeaderProps } from "./types";
import CIconButton from "../../atoms/CIconButton";
import CChip from "../../atoms/CChip";
import CText from "../../atoms/CText";

interface BaseProps extends HeaderProps {
  containerStyle: any;
  rightActionsStyle: any;
  upgradeChipStyle: any;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxs,
  },
  upgradeChip: {
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
});

export const Base: React.FC<BaseProps> = ({
  leftIcon,
  onLeftPress,
  title,
  hasUpgrade,
  onUpgradePress,
  rightIcons,
  onRightPress,
  containerStyle,
  rightActionsStyle,
  upgradeChipStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {leftIcon && (
        <CIconButton
          iconName={leftIcon}
          variant="ghost"
          onPress={onLeftPress}
        />
      )}

      {hasUpgrade && (
        <CChip
          label="Upgrade"
          onPress={onUpgradePress}
          variant='outlined'
        />
      )}

      {title && !hasUpgrade && (
        <CText variant="subheading">{title}</CText>
      )}

      <View style={[styles.rightActions, rightActionsStyle]}>
        {rightIcons?.map((icon, index) => (
          <CIconButton
            key={`${icon}-${index}`}
            iconName={icon}
            variant="ghost"
            onPress={() => onRightPress?.(index)}
          />
        ))}
      </View>
    </View>
  );
};
