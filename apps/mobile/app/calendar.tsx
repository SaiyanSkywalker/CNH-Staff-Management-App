import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import ScheduleEntryAttributes from "@shared/src/interfaces/ScheduleEntryAttributes";
import AuthProider, { useAuth } from "../contexts/AuthContext";
import { AgendaList, CalendarProvider } from "react-native-calendars";
import { format, parseISO } from 'date-fns';


import axios from "axios";
// type Event = {
//   time: string;
//   location: string;
//   duration: string;
// };

// type EventsKey = "28" | "29" | "30";

// type EventSchedule = {
//   [K in EventsKey]?: Event[];
// };

// const events: EventSchedule = {
//   "28": [{ time: "10:00 AM", location: "ICU - Room 145", duration: "8 hours" }],
//   "29": [{ time: "9:00 AM", location: "ICU", duration: "5 hours" }],
//   "30": [],
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#71B7C7",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 50,
  },
  header: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  calendarContainer: {
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    margin: 10,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  // dayOfWeek: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   marginTop: 10,
  // },
  // dateText: {
  //   fontSize: 18,
  //   fontWeight: "bold",
  // },
  eventText: {
    fontSize: 16,
    color: "#333333",
    paddingVertical: 5,
  },
  // noEventsText: {
  //   textAlign: "center",
  //   fontSize: 16,
  //   color: "#333333",
  //   paddingVertical: 20,
  // },
  // currentDay: {
  //   borderRadius: 50,
  //   backgroundColor: "#fb5b5a",
  //   padding: 5,
  // },
  // normalDay: {
  //   padding: 5,
  // },
  // dayText: {
  //   color: "white",
  // },
  eventCard: {
    backgroundColor: "#e7e7e7",
    borderRadius: 6,
    padding: 10,
    marginVertical: 5,
  },
});


const CalendarPage: React.FC = () => {
  //TODO: rewrite UI in component to use AgendaList component from
  // Wix's React Native Calendars library (https://wix.github.io/react-native-calendars/docs/Components/AgendaList)

  // Gets shifts from db for a user
  const user = useAuth();
  const [items, setItems] = useState<{[date: string]: ScheduleEntryAttributes[]}>({});

  useEffect(() => {
    const getShifts = async () => {
      try {
        
        const response = await axios.get(`/schedule/${user.auth?.user}`);
        const fetchedItems: {[date: string]: ScheduleEntryAttributes[]} = {};

        response.data.forEach((shift: ScheduleEntryAttributes) => {
          const date = format(parseISO(shift.shiftDate.toString()), 'yyyy-MM-dd');
          if (!fetchedItems[date]) {
            fetchedItems[date] = [];
          }
          fetchedItems[date].push(shift);
        });

        setItems(fetchedItems);
      } catch (error) {
        console.error(error);
      }
    };
    getShifts();
  }, [user.auth?.user]);

  const today = new Date();
  const markedDate = format(today, 'yyyy-MM-dd');

  return (
    <CalendarProvider date={markedDate}>
      <View style={styles.container}>
        <AgendaList
          sections={Object.keys(items).map(date => ({title: date, data: items[date]}))}
          renderItem={({ item }) => (
            <View style={styles.eventCard}>
              <Text style={styles.eventText}>{`${item.firstName} ${item.middleInitial} ${item.lastName}`}</Text>
              <Text style={styles.eventText}>{`${item.startTime} - ${item.endTime}`}</Text>
              <Text style={styles.eventText}>{item.duration}</Text>
              <Text style={styles.eventText}>{item.shiftType}</Text>
              <Text style={styles.eventText}>{item.jobCode}</Text>
            </View>
          )}
          sectionStyle={styles.calendarContainer}
        />
      </View>
    </CalendarProvider>
  );
};

export default CalendarPage;

