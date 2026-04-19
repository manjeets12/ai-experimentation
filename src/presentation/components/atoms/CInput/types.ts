import { TextInputProps, ViewStyle, TextStyle, StyleProp } from "react-native";

export interface CInputProps extends TextInputProps {
  label?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputWrapperStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
}
