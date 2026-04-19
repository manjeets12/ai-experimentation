import React from "react";
import {
  View,
  Modal,
  TouchableWithoutFeedback,
  Switch
} from "react-native";
import CText from "../../components/atoms/CText";
import { useTheme } from "../../../theme/ThemeProvider";

interface ConversationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  styles: any;
}

export const ConversationDrawer: React.FC<ConversationDrawerProps> = ({
  isOpen,
  onClose,
  styles,
}) => {
  const { theme, mode, toggleTheme } = useTheme();

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.drawerOverlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.drawerOverlayTouchable} />
        </TouchableWithoutFeedback>
        <View style={styles.drawerContent}>
          <View style={styles.drawerHeader}>
            <CText variant="heading">Settings</CText>
          </View>
          
          <View style={{ padding: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
                <CText variant="body">Dark Theme</CText>
                <Switch 
                    value={mode === 'dark'} 
                    onValueChange={toggleTheme} 
                    trackColor={{ true: theme.colors.primary, false: theme.colors.border }}
                />
            </View>

            <View style={{ backgroundColor: theme.colors.error + '20', padding: 16, borderRadius: 8 }}>
                <CText variant="body" color="error" style={{ textAlign: 'center' }}>
                    Chats are coming soon. Currently there is some issue at the Server.
                </CText>
            </View>
          </View>

        </View>
      </View>
    </Modal>
  );
};
