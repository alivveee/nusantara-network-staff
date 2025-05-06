import React, { useState } from "react";
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

interface TextFieldProps {
  label: string;
  value?: string;
  onChangeText?: (text: string) => void;
  editable?: boolean;
  multiline?: boolean;
  secureTextEntry?: boolean;
  placeholder?: string;
  style?: StyleProp<TextStyle>;
  rightIcon?: (color: string) => React.ReactNode;
  leftIcon?: (color: string) => React.ReactNode;
  onPressIcon?: (event: GestureResponderEvent) => void;
}

export default function TextField({
  label,
  value,
  onChangeText,
  editable = true,
  multiline = false,
  secureTextEntry = false,
  placeholder,
  style,
  rightIcon,
  leftIcon,
  onPressIcon,
}: TextFieldProps) {
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {/* Left Icon */}
        {leftIcon && <View>{leftIcon("grey")}</View>}

        {/* Input Field */}
        <TextInput
          style={[styles.fieldValue, style]}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          multiline={multiline}
          secureTextEntry={isSecure}
          placeholder={placeholder}
        />

        {/* Right Icon */}
        {secureTextEntry ? (
          <TouchableOpacity onPress={() => setIsSecure(!isSecure)}>
            <AntDesign
              name={isSecure ? "eyeo" : "eye"}
              size={24}
              color="#333"
              style={{ marginLeft: 8 }}
            />
          </TouchableOpacity>
        ) : (
          rightIcon && (
            <TouchableOpacity onPress={onPressIcon}>
              {rightIcon("black")}
            </TouchableOpacity>
          )
        )}
      </View>

      <View style={styles.separator} />
    </View>
  );
}

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  fieldValue: {
    fontSize: 16,
    color: "#333",
    paddingVertical: 4,
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginTop: 8,
  },
});
