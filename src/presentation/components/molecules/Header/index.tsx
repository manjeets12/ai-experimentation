import React from "react";
import { useStyles } from "./config";
import { Base } from "./Base";
import { HeaderProps } from "./types";

const Header: React.FC<HeaderProps> = (props) => {
  const { styles } = useStyles();

  return (
    <Base
      {...props}
      containerStyle={styles.container}
      rightActionsStyle={{}}
      upgradeChipStyle={styles.upgradeChip}
    />
  );
};

export default Header;
export * from "./types";
export * from "./config";
