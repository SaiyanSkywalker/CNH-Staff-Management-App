import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, FlatList, StyleSheet } from "react-native";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import config from "../config";
import ChannelAttributes from "@shared/src/interfaces/ChannelAttributes";
import AnnouncementAttributes from "@shared/src/interfaces/AnnouncementAttributes";
import { TouchableOpacity } from "react-native-gesture-handler";
import DropDownPicker from "react-native-dropdown-picker";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  messageList: {
    flex: 3,
    marginTop: 32,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginRight: 10,
    backgroundColor: "white",
  },
  picker: {
    flex: 1,
    marginBottom: 20,
  },
  sendBtn: {
    padding: 15,
    backgroundColor: "black",
    borderRadius: 5,
  },
  sendBtnText: {
    color: "white",
    fontWeight: "bold",
  },
  dropdownHeader: {
    marginBottom: 20,
  },
});

export default function ChatPage() {
  const mockChannels: ChannelAttributes[] = [
    { id: 25, name: "News" },
    { id: 29, name: "Travel Alerts" },
    { id: 45, name: "Other" },
    { id: 92, name: "PICU" },
  ];
  const [channels, setChannels] = useState<ChannelAttributes[]>(mockChannels);
  const [selectedId, setSelectedId] = useState<number>(-1);
  const [announcements, setAnnouncements] = useState<AnnouncementAttributes[]>(
    []
  );
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState<boolean>(false);
  const { auth } = useAuth();

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        // const response = await axios.get(`${config.apiUrl}/channel/`);
        // setChannels(response.data);
        setChannels(mockChannels);
      } catch (error) {
        console.error("Failed to fetch channels", error);
      }
    };
    fetchChannels();
  }, []);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const selectedChannel: ChannelAttributes | undefined = channels.find(
        (x) => x.id === selectedId
      );
      if (selectedChannel) {
        try {
          // const response = await axios.get(
          //   `${config.apiUrl}/channel/${selectedChannel.id}`
          // );
          // setAnnouncements(response.data);
        } catch (error) {
          console.error("Failed to fetch announcements", error);
        }
      }
    };
    fetchAnnouncements();
  }, [selectedId]);

  const handleSend = () => {
    const selectedChannel: ChannelAttributes | undefined = channels.find(
      (x) => x.id === selectedId
    );
    console.log("BEFORE SEND");
    console.log(selectedChannel);
    if (message && selectedChannel?.id && auth?.user?.id && auth?.socket) {
      const newAnnouncement: AnnouncementAttributes = {
        body: message,
        senderId: auth.user?.id,
        channelId: selectedChannel.id,
        sender: null
      };

      //TODO: Emit event to socket

      // Allows for duplicate messages
      setAnnouncements((prevAnnouncements) => [
        ...prevAnnouncements,
        newAnnouncement,
      ]);
      setMessage("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.dropdownHeader}>Channel</Text>
      <DropDownPicker
        multiple={false}
        open={open}
        setOpen={setOpen}
        value={selectedId}
        setValue={setSelectedId}
        items={channels.map((channel) => {
          return {
            label: channel.name,
            value: channel.id,
          };
        })}
        onChangeValue={(value: any) => {
          setSelectedId(value);
        }}
      />

      <View style={styles.messageList}>
        <FlatList
          data={announcements}
          keyExtractor={(item, idx) =>
            item.id ? item.id.toString() : idx.toString()
          }
          renderItem={({ item }) => (
            <Text>{`${item.senderId}: ${item.body}`}</Text>
          )}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message here..."
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendBtnText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
