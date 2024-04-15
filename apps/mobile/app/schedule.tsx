import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import DropDownPicker from "react-native-dropdown-picker";
import { StyleSheet, Text, View, TouchableOpacity, Alert, Button, TextInput} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
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
  dateText: {
    color: "black",
    fontSize: 16,
    fontWeight: "700",
  },
  submitText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  dateSelectedBtn: {
    width: "85%",
    backgroundColor: "#ffffff",
    height: 50,
    alignItems: "left",
    borderRadius: 8,
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 0,
    borderColor: "black",
    borderWidth: 1,
  },
  dateBtn: {
    width: "35%",
    backgroundColor: "#ffffff",
    height: 50,
    alignItems: "center",
    borderRadius: 8,
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
    borderColor: "black",
    borderWidth: 1,
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
    console.warn("A date has been picked: ", datePicked);
    auth?.socket?.emit("shift_submission");

    Alert.alert(
      "Submission Successful",
      "Your request has been forwarded to your manager."
    );
  };
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {
      label: "11:00 am - 3:00 pm",
      value: "11:00 am - 3:00 pm",
    },
    {
      label: "11:30 am - 3:30 pm",
      value: "11:30 am - 3:30 pm",
    },
    {
      label: "12:00 pm - 4:00 pm",
      value: "12:00 pm - 4:00 pm",
    },
  ]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [datePicked, setDate] = useState<string>("");
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setDate(date);
    hideDatePicker();
  };
  const getDate = () => {
    let tempDate = datePicked.toString().split(' ');
    return datePicked !== ''
      ? `  ${tempDate[0]} ${tempDate[1]} ${tempDate[2]} ${tempDate[3]}`
      : '';
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}> Schedule Shift</Text>
      <TouchableOpacity style = {styles.dateSelectedBtn}>
      <TextInput
        style={styles.dateText}
        value={getDate()}
        placeholder="  No Date Selected"
        placeholderTextColor={"black"}
      />
      </TouchableOpacity>
      <TouchableOpacity onPress={showDatePicker} style={styles.dateBtn}>
        <Text style={styles.dateText}> Select a date</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        onChange={datePicked => setDate(datePicked)}
      />
      <View style={styles.dropdownView}>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          placeholder="Select a time"
          placeholderStyle={{
            color: "black",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: "700"
          }}
          labelStyle={{
            fontWeight: "700"
          }}
        />
      </View>
      <TouchableOpacity onPress={onPressSubmit} style={styles.submitBtn}>
        <Text style={styles.submitText}>SUBMIT REQUEST </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Page;
