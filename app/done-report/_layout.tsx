import { useLocalSearchParams } from "expo-router";
import { Stack } from "expo-router/stack";

export default function _Layout() {
  return (
    <Stack
      screenOptions={{
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Laporan Selesai" }} />
    </Stack>
  );
}
