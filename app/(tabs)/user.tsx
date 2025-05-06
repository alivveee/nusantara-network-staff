import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "@kolking/react-native-avatar";

const avatarUrl = "https://api.dicebear.com/9.x/lorelei/svg?seed=Amaya";
const avatarName = "Karyawan 1";

const User = () => {
  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <Avatar
          size={150}
          name={avatarName}
          source={{ uri: avatarUrl }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Karyawan 1</Text>
        <Text style={styles.role}>Karyawan • PT Nusantara Network</Text>
        <Text style={styles.email}>jane.doe@email.com</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  profileSection: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 32,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  avatar: {
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2c3e50",
  },
  role: {
    fontSize: 16,
    color: "#7f8c8d",
    marginTop: 8,
  },
  email: {
    fontSize: 14,
    color: "#bdc3c7",
    marginTop: 4,
  },
});

export default User;
