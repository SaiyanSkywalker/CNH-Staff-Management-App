import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { parse, format } from "date-fns";
import DropDownPicker from "react-native-dropdown-picker";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import axios from "axios";
import config from "../config";

import ScheduleEntryAttributes from "@shared/src/interfaces/ScheduleEntryAttributes";
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
    console.warn("A date has been picked: ", shiftDate);
    auth?.socket?.emit("shift_submission");

    Alert.alert(
      "Submission Successful",
      "Your request has been forwarded to your manager."
    );
  };
  const [open, setOpen] = useState<boolean>(false);
  const [selectedShiftInterval, setSelectedShiftInterval] =
    useState<string>("");
  const [shifts, setShifts] = useState<ScheduleEntryAttributes[]>([]);
  const defaultIntervals = ["4hr", "8hr", "12hr"];
  const shiftFilters: { [key: string]: string[][] } = {
    "4hr": [
      ["07:00", "11:00"],
      ["11:00", "15:00"],
      ["15:00", "19:00"],
      ["19:00", "23:00"],
      ["23:00", "07:00"],
    ],
    "8hr": [
      ["07:00", "15:00"],
      ["15:00", "23:00"],
      ["23:00", "07:00"],
    ],
    "12hr": [
      ["07:00", "19:00"],
      ["19:00", "07:00"],
    ],
  };
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
  const [filter, setFilter] = useState<string>("4hr");
  const [shiftDate, setShiftDate] = useState<Date | undefined>(undefined);
  const [formattedDate, setFormattedDate] = useState<string>("Select a date");
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    const midnight = new Date(new Date(date).setHours(0, 0, 0, 0));
    setShiftDate(midnight);
    setFormattedDate(getDate(midnight));
    getAllShifts(midnight);
    hideDatePicker();
  };
  const getDate = (date: Date | null) => {
    let tempDate = date?.toString().split(" ");

    return tempDate
      ? `${tempDate[0]} ${tempDate[1]} ${tempDate[2]} ${tempDate[3]}`
      : "";
  };

  const getAllShifts = async (shiftDate: Date) => {
    try {
      if (shiftDate && auth) {
        const costCenterId = auth?.user?.unitId;
        const response = await axios.get(
          `${config.apiUrl}/schedule/unit?shiftDate=${shiftDate}&costCenterId=${costCenterId}`
        );
        const currentShifts: ScheduleEntryAttributes[] = response.data;
        console.log(shiftDate);
        console.log(currentShifts.length);
        setShifts(currentShifts);
        getIntervals(shiftDate, currentShifts);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getIntervals = (
    shiftDate: Date,
    currentShifts: ScheduleEntryAttributes[]
  ) => {
    const selectedFilters = shiftFilters[filter];
    console.log(selectedFilters);
    const buckets: { [key: string]: ScheduleEntryAttributes[] } = {};
    selectedFilters.forEach((filter) => {
      const key = `${filter[0]}-${filter[1]}`;
      // Compare shift times with selected window
      const dateString = format(shiftDate, "yyyyMMdd");
      const lowerDateBound = parse(
        `${dateString} ${filter[0]}`,
        "yyyyMMdd HH:mm",
        new Date()
      );
      const upperDateBound = parse(
        `${dateString} ${filter[1]}`,
        "yyyyMMdd HH:mm",
        new Date()
      );

      // Handles case where shift extends into next day
      if (upperDateBound < lowerDateBound) {
        upperDateBound.setDate(upperDateBound.getDate() + 1);
      }

      // If shift is in window, add it to bucket
      buckets[key] = currentShifts.filter((shift: ScheduleEntryAttributes) => {
        // store start and end times of shift
        const shiftStartTime = parse(
          `${dateString} ${shift.startTime}`,
          "yyyyMMdd HH:mm",
          new Date()
        );
        const shiftEndTime = parse(
          `${dateString} ${shift.endTime}`,
          "yyyyMMdd HH:mm",
          new Date()
        );

        if (shiftEndTime < shiftStartTime) {
          shiftEndTime.setDate(shiftEndTime.getDate() + 1);
        }
        //Subtract 30 minutes from shiftEndTIme (30 minutes is added to each shift to account for change over between staff)
        shiftEndTime.setMinutes(shiftEndTime.getMinutes() - 30);

        return !(
          (shiftStartTime < lowerDateBound && shiftEndTime < lowerDateBound) ||
          (shiftStartTime > upperDateBound && shiftEndTime > upperDateBound)
        );
      });
    });

    // Compare against capacities
    const result = [];
    const defaultCapacity = 25;
    for (let key in buckets) {
      const numShifts = buckets[key].length;
      if (numShifts < defaultCapacity) {
        result.push({ label: key, value: key });
      }
      console.log(`key:${key} length:${numShifts}`);
    }
    setItems(result);
  };
  useEffect(() => {
    if (shiftDate) {
      getIntervals(shiftDate, shifts);
    }
  }, [filter]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Schedule Shift</Text>

      <View style={styles.dropdownView}>
        <Text style={styles.inputLabel}>Date (press to select)</Text>
        <TouchableOpacity
          onPress={showDatePicker}
          style={styles.dateSelectedBtn}
        >
          <Text style={styles.dateText}>{formattedDate}</Text>
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
          value={selectedShiftInterval}
          items={items}
          setOpen={setOpen}
          setValue={setSelectedShiftInterval}
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
        date={shiftDate}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        onChange={(shiftDate: Date) => setShiftDate(shiftDate)}
      />
      <TouchableOpacity onPress={onPressSubmit} style={styles.submitBtn}>
        <Text style={styles.submitText}>SUBMIT REQUEST </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Page;
