import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, FlatList, StyleSheet } from "react-native";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import config from "../config";
import ChannelAttributes from "@shared/src/interfaces/ChannelAttributes";
import AnnouncementAttributes from "@shared/src/interfaces/AnnouncementAttributes";
import { TouchableOpacity } from "react-native-gesture-handler";
import DropDownPicker from "react-native-dropdown-picker";
import { v4 as uuidv4 } from "uuid";
import { getToken } from "../utils/token";
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
    backgroundColor: "#067496",
    borderRadius: 5,
  },
  sendBtnText: {
    color: "white",
    fontWeight: "bold",
  },
  dropdownHeader: {
    marginBottom: 20,
  },
  announcementHeader: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  announcementContainer: {
    marginBottom: 16,
  },
  announcementName: { color: "#D46971", fontWeight: "600" },
  announcementDate: {},
  announcementBody: { color: "#067496" },
});

export default function ChatPage() {
  const [channels, setChannels] = useState<ChannelAttributes[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementAttributes[]>(
    []
  );
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState<boolean>(false);
  const [failure, setFailure] = useState<boolean>(false);
  const [channelMap, setChannelMap] = useState<Map<string, ChannelAttributes>>(
    new Map<string, ChannelAttributes>()
  );
  const [prevSelectedChannel, setPrevSelectedChannel] = useState<
    ChannelAttributes | undefined
  >(undefined);
  const [selectedChannel, setSelectedChannel] = useState<
    ChannelAttributes | undefined
  >(undefined);
  const [selectedChannelName, setSelectedChannelName] = useState<string>("");
  const { auth } = useAuth();
  const fetchAnnouncements = async () => {
    if (selectedChannel) {
      try {
        const accessToken = await getToken("accessToken");
        const response = await axios({
          method: "GET",
          url: `${config.apiUrl}/channel/${selectedChannel?.id}`,
          responseType: "json",
          headers: {
            unitId: auth?.user?.unitId,
            roleId: auth?.user?.roleId,
            Authorization: `Bearer: ${accessToken}`,
          },
        });
        const data = response.data;
        if (data) {
          auth?.socket?.emit("join_room", {
            prevSelectedChannel: prevSelectedChannel?.name,
            selectedChannel: selectedChannel?.name,
          });
          setAnnouncements(data);
        }
        setAnnouncements(response.data);
      } catch (error) {
        console.error("Failed to fetch announcements", error);
      }
    }
  };
  const fetchChannels = async () => {
    try {
      const accessToken = await getToken("accessToken");
      const response = await axios({
        method: "GET",
        url: `${config.apiUrl}/channel`,
        responseType: "json",
        headers: {
          unitId: auth?.user?.unitId,
          roleId: auth?.user?.roleId,
          Authorization: `Bearer: ${accessToken}`,
        },
      });
      const data: ChannelAttributes[] = await response.data;
      if (data) {
        setChannels(data);
        const newChannelMap: Map<string, ChannelAttributes> = new Map<
          string,
          ChannelAttributes
        >();
        data.forEach((channel) => {
          newChannelMap.set(channel.name, channel);
        });
        setChannelMap(newChannelMap);
      }
    } catch (error) {
      console.error("Failed to fetch channels", error);
    }
  };

  const handleChannelChange = (value: string | null) => {
    if (value) {
      setPrevSelectedChannel((prevChannel) => selectedChannel);
      setSelectedChannel((prevChannel) => channelMap.get(value));
    }
  };
  const parseAnnouncmentDate = (date: Date) => {
    if (!date) {
      return "";
    }
    const militaryHour: number = Number(date.toString().substring(16, 18));
    const hour: number = militaryHour % 12 == 0 ? 12 : militaryHour % 12;
    const period: string = militaryHour >= 12 ? "PM" : "AM";
    return (
      date.toString().substring(4, 16) +
      hour +
      date.toString().substring(18, 21) +
      " " +
      period
    );
  };
  useEffect(() => {
    fetchChannels();
  }, []);

  useEffect(() => {
    fetchAnnouncements();
    const providerListener = (newAnnouncement: AnnouncementAttributes) => {
      const announcementExists = announcements.some(
        (announcement) => announcement.id === newAnnouncement.id
      );
      setAnnouncements((announcements) => [...announcements, newAnnouncement]);
      setMessage("");
    };
    const subscriberListener = (newAnnouncement: AnnouncementAttributes) => {
      setAnnouncements((announcements) => [...announcements, newAnnouncement]);
    };
    const failedListener = (failedAnnouncement: AnnouncementAttributes) => {
      setFailure(true);
    };

    auth?.socket?.on("message_provider", providerListener);
    auth?.socket?.on("message_subscriber", subscriberListener);
    auth?.socket?.on("message_failed", failedListener);

    return () => {
      auth?.socket?.off("message_provider", providerListener);
      auth?.socket?.off("message_subscriber", subscriberListener);
      auth?.socket?.off("message_failed", failedListener);
      if (selectedChannel) {
        auth?.socket?.emit("leave_room", { channelName: selectedChannel.name });
      }
    };
  }, [selectedChannel]);

  const handleSend = () => {
    if (message && selectedChannel?.id && auth?.user?.id && auth?.socket) {
      const newAnnouncement: AnnouncementAttributes = {
        body: message,
        sender: auth?.user,
        senderId: auth?.user?.id ?? 0,
        channelId: selectedChannel.id ?? 0,
        createdAt: new Date(),
      };

      auth?.socket?.emit("message_sent", newAnnouncement);
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
        value={selectedChannelName}
        setValue={setSelectedChannelName}
        items={channels.map((channel) => {
          return {
            label: channel.name,
            value: channel.name,
          };
        })}
        style={{}}
        onChangeValue={handleChannelChange}
      />

      <View style={styles.messageList}>
        <FlatList
          data={announcements}
          keyExtractor={(item, idx) =>
            item.id ? item.id.toString() : uuidv4()
          }
          renderItem={({ item }) => (
            <>
              <View style={styles.announcementContainer}>
                <View style={styles.announcementHeader}>
                  <Text
                    style={styles.announcementName}
                  >{`${item.sender?.username}`}</Text>
                  <Text style={styles.announcementDate}>
                    {parseAnnouncmentDate(new Date(item.createdAt ?? ""))}
                  </Text>
                </View>
                <Text style={styles.announcementBody}>{item.body}</Text>
              </View>
            </>
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
