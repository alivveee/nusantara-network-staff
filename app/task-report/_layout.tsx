/* eslint-disable react-hooks/rules-of-hooks */
import { Header } from "@react-navigation/elements";
import { useLocalSearchParams } from "expo-router";
import { Stack } from "expo-router/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function _Layout() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const title = type === "pengiriman" ? "Pengiriman" : "Kanvassing";
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerTitleStyle: {
            fontWeight: "bold",
          },

          header: ({ options }) => (
            <Header
              {...options}
              title={options.title || "Default Title"}
              headerStyle={{
                height: 64,
              }}
            />
          ),
        }}
      >
        <Stack.Screen name="index" options={{ title: title }} />
        <Stack.Screen name="submit" options={{ title: title }} />
      </Stack>
    </SafeAreaProvider>
  );
}
