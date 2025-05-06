import { Header } from "@react-navigation/elements";
import { Stack } from "expo-router/stack";

export default function _Layout() {
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
      <Stack.Screen name="canvassing" options={{ title: "Kanvassing" }} />
      <Stack.Screen name="delivery" options={{ title: "Pengiriman" }} />
    </Stack>
  );
}
