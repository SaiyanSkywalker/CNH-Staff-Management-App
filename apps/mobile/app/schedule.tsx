import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import DropDownPicker from "react-native-dropdown-picker";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#71B7C7",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 30,
    color: "#FFFFFF",
  },
  dropdownView: {
    width: "85%",
    zIndex: 10,
  },
  dateText: {
    color: "black",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 5,
  },
  submitText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  dateSelectedBtn: {
    backgroundColor: "#ffffff",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
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
  inputLabel: {
    color: "white",
    fontWeight: "bold",
    marginBottom: 6,
    fontSize: 16,
  },

  filterBtnContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  filterBtn: {
    width: "25%",
    borderColor: "#cde3ea",
    borderRadius: 5,
    borderWidth: 1,
  },
  defaultBackground: {
    backgroundColor: "white",
  },
  selectedBackground: {
    backgroundColor: "#fb5b5a",
    borderColor: "#fff",
    color: "white",
  },
  filterBtnText: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
});

const Page = () => {
  const { auth } = useAuth();
  const onPressSubmit = async () => {
    // TODO: Find a way to send shift requests to server through sockets
    console.warn("A date has been picked: ", datePicked);
    auth?.socket?.emit("shift_submission");

    Alert.alert(
      "Submission Successful",
      "Your request has been forwarded to your manager."
    );
  };
  const [open, setOpen] = useState<boolean>(false);
  const [shift, setShift] = useState<string>("");
  const defaultIntervals = ["4hr", "8hr", "12hr"];
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
  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);
  const [filter, setFilter] = useState<string>("4");
  const [datePicked, setDatePicked] = useState<Date | null>(null);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    setDatePicked(date);
    hideDatePicker();
  };
  const getDate = () => {
    let tempDate = datePicked?.toString().split(" ");
    return tempDate
      ? `${tempDate[0]} ${tempDate[1]} ${tempDate[2]} ${tempDate[3]}`
      : "";
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}> Schedule Shift</Text>

      <View style={styles.dropdownView}>
        <Text style={styles.inputLabel}>Date</Text>
        <TouchableOpacity
          onPress={showDatePicker}
          style={styles.dateSelectedBtn}
        >
          <Text style={styles.dateText}>{getDate() || "Select a date"}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.dropdownView}>
        <Text style={styles.inputLabel}>Shift Interval Filter</Text>
        <View style={styles.filterBtnContainer}>
          {defaultIntervals.map((interval, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.filterBtn,
                  interval === filter
                    ? styles.selectedBackground
                    : styles.defaultBackground,
                ]}
                onPress={() => setFilter(interval)}
              >
                <Text style={styles.filterBtnText}>{interval}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <View style={styles.dropdownView}>
        <Text style={styles.inputLabel}>Shift</Text>
        <DropDownPicker
          open={open}
          value={shift}
          items={items}
          setOpen={setOpen}
          setValue={setShift}
          setItems={setItems}
          placeholder="Select a shift"
          placeholderStyle={{
            color: "black",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: "700",
          }}
          labelStyle={{
            fontWeight: "700",
          }}
        />
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        onChange={(datePicked: Date) => setDatePicked(datePicked)}
      />
      <TouchableOpacity onPress={onPressSubmit} style={styles.submitBtn}>
        <Text style={styles.submitText}>SUBMIT REQUEST </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Page;
