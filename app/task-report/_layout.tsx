/* eslint-disable react-hooks/rules-of-hooks */
import { Header } from "@react-navigation/elements";
import { useLocalSearchParams } from "expo-router";
import { Stack } from "expo-router/stack";

export default function _Layout() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const title = type == "pengiriman" ? "Pengiriman" : "Kanvassing";
  return (
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
  );
}
