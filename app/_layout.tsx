import { Stack } from "expo-router/stack";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";

export default function RootLayout() {
  useEffect(() => {
    // Mengatur navigation bar jadi hitam
    SystemUI.setBackgroundColorAsync("#000000");
  }, []);
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="task-report" />
      <Stack.Screen name="add-task" />
    </Stack>
  );
}
