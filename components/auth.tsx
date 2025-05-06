import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  AppState,
  Button,
  Text,
  TouchableOpacity,
} from "react-native";
import TextField from "./text-field";
import { supabase } from "@/lib/supabase";

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: "#333",
          }}
        >
          Nusantara Network
        </Text>
        <Text>Login Karyawan Lapangan</Text>
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TextField
          label="Email"
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
        />
      </View>
      <View style={styles.verticallySpaced}>
        <TextField
          label="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="* * * * * *"
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => login()}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 22,
    backgroundColor: "white",
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
  },
  mt20: {
    marginTop: 20,
  },
  loginButton: {
    backgroundColor: "#4285F4",
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
