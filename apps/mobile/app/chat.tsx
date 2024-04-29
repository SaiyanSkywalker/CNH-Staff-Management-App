import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext'; 
import config from "../config"
import ChannelAttributes from '@shared/src/interfaces/ChannelAttributes'; 
import AnnouncementAttributes from '@shared/src/interfaces/AnnouncementAttributes'; 


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  channelList: {
    flex: 1,
  },
  messageList: {
    flex: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginRight: 10,
  },
});

export default function ChatPage() {
  const [channels, setChannels] = useState<ChannelAttributes[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<ChannelAttributes | null>(null);
  const [announcements, setAnnouncements] = useState<AnnouncementAttributes[]>([]);
  const [message, setMessage] = useState('');
  const {auth} = useAuth();

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}`);
        setChannels(response.data);
      } catch (error) {
        console.error('Failed to fetch channels', error);
      }
    };
    fetchChannels();
  }, []);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (selectedChannel) {
        try {
          const response = await axios.get(`${config.apiUrl}/channel/${selectedChannel.id}`);
          setAnnouncements(response.data);
        } catch (error) {
          console.error('Failed to fetch announcements', error);
        }
      }
    };
    fetchAnnouncements();
  }, [selectedChannel]);

  const handleSend = async () => {
    if (message && selectedChannel?.id && auth?.user?.id) {
      try {
        const newAnnouncement : AnnouncementAttributes = {
          body: message,
          senderId: auth.user?.id,
          channelId: selectedChannel.id,
        };
        const response = await axios.post(`${config.apiUrl}/announcements`, newAnnouncement);
        if (response.status === 200) {
          setAnnouncements([...announcements, newAnnouncement]);
          setMessage('');
        }
      } catch (error) {
        console.error('Failed to send message', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={channels}
        keyExtractor={item => item.id ? item.id.toString() : 'undefined-id'}
        renderItem={({ item }) => (
          <Button title={item.name} onPress={() => setSelectedChannel(item)} />
        )}
        style={styles.channelList}
      />
      <View style={styles.messageList}>
        <FlatList
          data={announcements}
          keyExtractor={item => item.id ? item.id.toString() : 'undefined-id'}
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
        <Button title="Send" onPress={handleSend} />
      </View>
    </View>
  );
}
