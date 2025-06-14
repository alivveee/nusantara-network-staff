import { Picker } from "@react-native-picker/picker";
import React from "react";
import {
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View
} from "react-native";

interface TextFieldProps {
  label: string;
  selectedValue?: string;
  onValueChange: (itemValue: string) => void;
  options: { label: string; value: string }[];
  style?: StyleProp<TextStyle>;
}

export default function PickerField({
  label,
  selectedValue,
  onValueChange,
  options,
  style,
}: TextFieldProps) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={(itemValue) => onValueChange(itemValue)}
          style={[styles.picker, style]}
          dropdownIconColor="#666"
        >
          {options.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>
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
  pickerContainer: {
    borderRadius: 4,
    paddingHorizontal: Platform.OS === "ios" ? 0 : -8,
    marginBottom: Platform.OS === "ios" ? 0 : -8,
  },
  picker: {
    height: Platform.OS === "ios" ? 150 : 50,
    width: "100%",
    color: "#333",
  },
});
