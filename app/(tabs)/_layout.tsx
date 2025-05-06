import { Tabs } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

export default function _layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          height: 62,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 13,
        },
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tugas",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="clipboard-list-outline"
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="add-task"
        options={{
          title: "Tambah Tugas",
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="add" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          title: "Anda",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user-circle" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
