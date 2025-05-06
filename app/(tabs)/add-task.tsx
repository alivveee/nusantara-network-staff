import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React from "react";
import { RelativePathString, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

const typeOptions = [
  {
    label: "Pengiriman",
    value: "delivery",
    icon: "cube-outline",
  },
  {
    label: "Kanvassing",
    value: "canvassing",
    icon: "walk-outline",
  },
];

export default function AddTask() {
  const router = useRouter();

  const renderItem = ({
    item,
  }: {
    item: { label: string; value: string; icon: string };
  }) => (
    <TouchableOpacity
      style={styles.typeItem}
      onPress={() => {
        router.push(`/add-task/${item.value}` as RelativePathString);
      }}
    >
      <Ionicons
        name={item.icon as keyof typeof Ionicons.glyphMap}
        size={32}
        color="#007aff"
        style={{ marginBottom: 10 }}
      />
      <Text style={styles.optionText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={typeOptions}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        keyExtractor={(item) => item.value}
      />
    </View>
  );
}

const boxWidth = (screenWidth - 40) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  typeItem: {
    backgroundColor: "#ffffff",
    width: boxWidth,
    paddingVertical: 20,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  listContainer: {
    padding: 15,
  },
});
