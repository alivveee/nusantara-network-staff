import Auth from "@/components/auth";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Dapatkan session saat pertama kali load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsCheckingSession(false);

      // Jika sudah login, langsung arahkan ke tabs
      if (session?.user) {
        router.replace("/(tabs)/tasks");
      }
    });

    // Dengarkan perubahan status login
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session?.user) {
          router.replace("/(tabs)/tasks");
        }
      }
    );

    // Cleanup listener saat unmount
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Jika sedang memeriksa session, tampilkan loading
  if (isCheckingSession) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Jika belum login, tampilkan Auth
  return (
    <View style={{ flex: 1 }}>
      {!session && <Auth />}
    </View>
  );
}
