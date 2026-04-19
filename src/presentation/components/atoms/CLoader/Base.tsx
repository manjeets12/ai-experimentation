import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { CLoaderProps } from "./types";

interface BaseProps extends CLoaderProps {
  containerStyle: any;
  loaderColor: string;
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export const Base: React.FC<BaseProps> = ({
  containerStyle,
  loaderColor,
  fullScreen,
  ...props
}) => {
  return (
    <View style={[fullScreen ? styles.fullScreen : styles.container, containerStyle]}>
      <ActivityIndicator color={loaderColor} {...props} />
    </View>
  );
};
