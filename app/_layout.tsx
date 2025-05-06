import { Stack } from "expo-router/stack";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="task-report" />
      <Stack.Screen name="done-report" />
      <Stack.Screen name="add-task" />
    </Stack>
  );
}
