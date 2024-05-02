import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import ScheduleEntryAttributes from "@shared/src/interfaces/ScheduleEntryAttributes";
import { useAuth } from "../contexts/AuthContext";
import {
  AgendaList,
  CalendarProvider,
  DateData,
  WeekCalendar,
} from "react-native-calendars";
import { format, parseISO } from "date-fns";

import axios from "axios";
import config from "../config";

const styles = StyleSheet.create({
  header: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  container: {
    backgroundColor: "white",
    flex: 1,
  },

  eventCard: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
    padding: 20,
    justifyContent: "space-between",
    flexDirection: "row",
  },

  shiftsHeader: {
    fontSize: 36,
    textAlign: "center",
    fontWeight: "bold",
    color: "#067496",
    marginVertical: 20,
  },
  section: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  calendarContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calendarHeader: {
    textAlign: "center",
    margin: 20,
    fontSize: 20,
  },
});

const CalendarPage: React.FC = () => {
  const today = new Date();
  const markedDate = format(today, "yyyy-MM-dd");
  const user = useAuth();
  const [shifts, setShifts] = useState<{
    [date: string]: ScheduleEntryAttributes[];
  }>({});
  const [calendarHeader, setCalendarHeader] = useState<string>(
    `${format(today, "MMM yyyy")}`
  );
  useEffect(() => {
    getShifts();
  }, [user.auth?.user]);

  const handleDayPress = (date: DateData) => {
    setCalendarHeader(`${format(new Date(date.dateString), "MMM yyyy")}`);
  };

  /**
   * Get all shifts for a user
   */
  const getShifts = async () => {
    try {
      const response = await axios.get(
        `${config.apiUrl}/schedule/${user.auth?.user?.username}`
      );
      const fetchedShifts: { [date: string]: ScheduleEntryAttributes[] } = {};

      // Create events for AgendaList
      if (response.data) {
        response.data.forEach((shift: ScheduleEntryAttributes) => {
          const date = format(
            parseISO(shift.shiftDate.toString()),
            "yyyy-MM-dd"
          );
          if (!fetchedShifts[date]) {
            fetchedShifts[date] = [];
          }
          fetchedShifts[date].push(shift);
        });

        setShifts(fetchedShifts);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.calendarHeader}>{calendarHeader}</Text>
        <CalendarProvider date={markedDate} showTodayButton>
          <WeekCalendar firstDay={1} onDayPress={handleDayPress} />
          <Text style={styles.shiftsHeader}>Events</Text>
          <AgendaList
            sections={Object.keys(shifts).map((date) => ({
              title: date,
              data: shifts[date],
            }))}
            sectionStyle={styles.calendarContainer}
            renderItem={({ item }) => (
              <View style={styles.eventCard}>
                <View>
                  <Text>{`${item.startTime} - ${item.endTime}`}</Text>
                  <Text>Duration: {item.duration} hours</Text>
                </View>
                <View>
                  <Text>Shift Type: {item.shiftType}</Text>
                  <Text>Job Code: {item.jobCode}</Text>
                </View>
              </View>
            )}
          />
        </CalendarProvider>
      </View>
    </>
  );
};

export default CalendarPage;
