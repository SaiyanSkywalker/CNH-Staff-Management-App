import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import DropDownPicker from "react-native-dropdown-picker";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
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
    fontSize: 30,
    color: "#FFFFFF",
    marginBottom: 20,
  },
  dropdownView: {
    width: "85%",
    marginBottom: 100,
    zIndex: 10,
  },
  submitText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  submitBtn: {
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
  const onPressSubmit = async () => {
    Alert.alert(
      "Submission Successful",
      "Your request has been forwarded to your manager."
    );
  };
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {
      label: "09/27/23 - 11:00 am - 3:00 pm",
      value: "09/27/23 - 11:00 am - 3:00 pm",
    },
    {
      label: "09/27/23 - 11:30 am - 3:30 pm",
      value: "09/27/23 - 11:30 am - 3:30 pm",
    },
    {
      label: "09/27/23 - 12:00 pm - 4:00 pm",
      value: "09/27/23 - 12:00 pm - 4:00 pm",
    },
  ]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}> Schedule Shift</Text>
      <View style={styles.dropdownView}>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          placeholder="Select a shift"
        />
      </View>
      <TouchableOpacity onPress={onPressSubmit} style={styles.submitBtn}>
        <Text style={styles.submitText}>SUBMIT REQUEST </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Page;
