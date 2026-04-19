import React from "react";
import { useStyles } from "./config";
import { Base } from "./Base";
import { CLoaderProps } from "./types";

const CLoader: React.FC<CLoaderProps> = ({
  colorVariant = "primary",
  fullScreen = false,
  ...props
}) => {
  const { styles, theme } = useStyles();

  const containerStyle = fullScreen ? styles.fullScreen : {};
  const loaderColor = theme.colors[colorVariant];

  return (
    <Base
      {...props}
      fullScreen={fullScreen}
      containerStyle={containerStyle as any}
      loaderColor={loaderColor}
    />
  );
};

export default CLoader;
export * from "./types";
export * from "./config";
