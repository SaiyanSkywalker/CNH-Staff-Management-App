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
  const onPressLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
    const success = await auth?.login(email, password);
    if (success) {
      Alert.alert("Login Successful", "You are now logged in.");
    } else {
      Alert.alert("Login Failed", "Invalid email or password.");
    } 
  };
  const onPressForgotPassword = () => {
    // Do something about forgot password operation
  };
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  return (
    <View style={styles.container}>
      <Text style={styles.title}> Staffing for Nurses</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setEmail(text)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          secureTextEntry
          placeholder="Password"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <TouchableOpacity onPress={onPressForgotPassword}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onPressLogin} style={styles.loginBtn}>
        <Text style={styles.loginText}>LOGIN </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Page;
