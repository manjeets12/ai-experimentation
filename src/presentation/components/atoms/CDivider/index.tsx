import React from "react";
import { sizes } from "../../../../theme/tokens/sizes";
import { useStyles } from "./config";
import { Base } from "./Base";
import { CDividerProps } from "./types";

const CDivider: React.FC<CDividerProps> = ({ label, marginVertical }) => {
  const { styles } = useStyles();

  const containerStyle = marginVertical ? { marginVertical } : { marginVertical: sizes.spacing.md };

  return (
    <Base
      label={label}
      containerStyle={containerStyle}
      lineStyle={styles.line}
      labelContainerStyle={{}}
      labelTextStyle={styles.label}
    />
  );
};

export default CDivider;
export * from "./types";
export * from "./config";
