/**
 * File: index.tsx
 * Purpose: Component for "login" screen, allows user to log in to app
 */
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { router } from "expo-router";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#71B7C7",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 36,
    color: "#FFFFFF",
    marginBottom: 40,
  },
  inputView: {
    width: "80%",
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
  },
  inputText: {
    height: 50,
    color: "black",
  },
  forgotText: {
    color: "white",
    fontSize: 11,
  },
  loginText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "#fb5b5a",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
  },
});
const Page = () => {
  const { auth } = useAuth();

  /**
   * Handles user login,
   * Shows alerts if there are errors
   * Redirects to user schedule otherwise
   */
  const onPressLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both email and password.");
    }
    const success = await auth?.login(username, password, "1");
    if (success) {
      Alert.alert("Login Successful", "You are now logged in.");
      router.replace("/calendar");
    } else {
      Alert.alert("Login Failed", "Invalid email or password.");
    }
  };
  /**
   * TODO: Add functionality for forgot password
   * NOTE: workflow for combining this feature with CNH infrastructure was never devised
   */
  const onPressForgotPassword = () => {
    // Do something about forgot password operation
  };
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  return (
    <View style={styles.container}>
      <Text style={styles.title}> Staffing for Nurses</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Enter username"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setUsername(text)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          secureTextEntry
          placeholder="Enter password"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <TouchableOpacity onPress={onPressForgotPassword}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onPressLogin} style={styles.loginBtn}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Page;
