import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Event = {
  time: string;
  location: string;
  duration: string;
};

type EventsKey = '28' | '29' | '30';

type EventSchedule = {
  [K in EventsKey]?: Event[];
};

const events: EventSchedule = {
  '28': [{ time: '10:00 AM', location: 'ICU - Room 145', duration: '8 hours' }],
  '29': [{ time: '9:00 AM', location: 'ICU', duration: '5 hours' }],
  '30': [],
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#71B7C7',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: 50,
    },
    header: {
      color: '#FFFFFF',
      fontSize: 24,
      fontWeight: 'bold',
    },
    calendarContainer: {
      padding: 10,
      backgroundColor: '#FFFFFF',
      borderRadius: 6,
      margin: 10,
      width: '90%',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    dayOfWeek: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    dateText: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    eventText: {
      fontSize: 16,
      color: '#333333',
      paddingVertical: 5,
    },
    noEventsText: {
      textAlign: 'center',
      fontSize: 16,
      color: '#333333',
      paddingVertical: 20,
    },
    currentDay: {
      borderRadius: 50,
      backgroundColor: '#fb5b5a',
      padding: 5,
    },
    normalDay: {
      padding: 5,
    },
    dayText: {
      color: 'white',
    },
    eventCard: {
      backgroundColor: '#e7e7e7',
      borderRadius: 6,
      padding: 10,
      marginVertical: 5,
    },
  });

const CalendarPage: React.FC = () => {
  const renderEventsForDay = (day: EventsKey): JSX.Element => {
    const dayEvents = events[day];
    if (!dayEvents || dayEvents.length === 0) {
      return <Text style={styles.noEventsText}>No Events</Text>;
    }
    return (
      <>
        {dayEvents.map((event, index) => (
          <View key={index} style={styles.eventCard}>
            <Text style={styles.eventText}>{`${event.time}: ${event.location}`}</Text>
            <Text style={styles.eventText}>{event.duration}</Text>
          </View>
        ))}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>September</Text>
      <View style={styles.dayOfWeek}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'].map((day, index) => (
          <Text key={index} style={day === 'Thur' ? styles.currentDay : styles.normalDay}>
            <Text style={styles.dayText}>{day}</Text>
          </Text>
        ))}
      </View>
      <View style={styles.calendarContainer}>
        {(['28', '29', '30'] as EventsKey[]).map((day) => (
          <View key={day}>
            <Text style={styles.dateText}>{`Saturday, ${day} September`}</Text>
            {renderEventsForDay(day as EventsKey)}
          </View>
        ))}
      </View>
    </View>
  );
};

export default CalendarPage;
