import Auth from "@/components/auth";
import { useSession } from "@/context/SessionContext";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function App() {
  const { session, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      router.replace("/(tabs)");
    }
  }, [session]);

  // Jika sedang memeriksa session, tampilkan loading
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Jika belum login, tampilkan Auth
  return <View style={{ flex: 1 }}>{!session && <Auth />}</View>;
}
