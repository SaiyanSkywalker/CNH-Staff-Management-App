"use client";

import React, {
  useState,
  useContext,
  useRef,
  useEffect,
  FormEvent,
} from "react";
import page from "@webSrc/styles/Chat.module.css";
import {
  BannerContext,
  BannerContextProps,
} from "@webSrc/contexts/BannerContext";
import axios from "axios";
import config from "@webSrc/config";
import {
  LoadingContext,
  LoadingContextProps,
} from "@webSrc/contexts/LoadingContext";
import AnnouncementAttributes from "@shared/src/interfaces/AnnouncementAttributes";
import ChannelAttributes from "@shared/src/interfaces/ChannelAttributes";
import { useAuth } from "@webSrc/contexts/AuthContext";

export default function ChatPage() {
    const [channels, setChannels] = useState<ChannelAttributes[]>([]);
    const [selectedChannel, setSelectedChannel] = useState<ChannelAttributes | undefined>(undefined);
    const [announcements, setAnnouncements] = useState<AnnouncementAttributes[]>([]);
    const [newChannel, setNewChannel] = useState<string>("");
    const [message, setMessage] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const bannerContext: BannerContextProps | undefined =
    useContext(BannerContext);
    const loadingContext: LoadingContextProps | undefined =
    useContext(LoadingContext);
    const { auth } = useAuth();

    const getChannels = async () => {
        try {
          const response = await axios({
            method: "GET",
            url: `${config.apiUrl}/channel`,
            responseType: "json",
          });
          const data = await response.data;
          if (data) {
            setChannels(data);
          }
        } catch (err) {
          console.error(err);
        }
    };

    const getAnnouncements = async () => {
        try {
          const response = await axios({
            method: "GET",
            url: `${config.apiUrl}/channel/${selectedChannel?.id}`,
            responseType: "json",
          });
          const data = await response.data;
          if (data) {
            setAnnouncements(data);
          }
        } catch (err) {
          console.error(err);
        }
    };

    async function newChannelOnSubmit(event: FormEvent<HTMLFormElement>) {
        try {
            event.preventDefault();
            if (Object.keys(newChannel).length === 0) {
                bannerContext?.showBanner("Please define the name of the channel before saving", true);
            } else {
                let newChannelRequest: ChannelAttributes = {
                    name: newChannel,
                };

                loadingContext?.showLoader();

                const res = await fetch(`${config.apiUrl}/channel`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(newChannelRequest),
                });

                loadingContext?.hideLoader();

                if (res.status === 200) {
                    bannerContext?.showBanner(`Success, the new channel ${newChannel} successfully saved`, false);
                } else {
                    bannerContext?.showBanner(`Error in saving the new channel ${newChannel}`, true);
                }
                
                setNewChannel("");
            }
        } catch (error) {
            loadingContext?.hideLoader();
            bannerContext?.showBanner(`Error in saving in saving the new channel ${newChannel} + ${error}`, true);

            setNewChannel("");
        }
    }

    useEffect(() => {
        getChannels();
    }, [channels, selectedChannel]);

    useEffect(() => {
        getAnnouncements();
    }, [announcements, selectedChannel]);

    const handleChatSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        
        if (!message || !selectedChannel || !auth?.user?.id) {
            return;
        }

        const newAnnouncement: AnnouncementAttributes = {
            body: message,
            senderId: auth?.user?.id ?? 0,
            channelId: selectedChannel.id ?? 0,
        };
    
        setAnnouncements((announcements) => [...announcements, newAnnouncement]);
    
        auth?.socket?.emit("message_sent", newAnnouncement);
    };

    return (
        <>
            <div className={page["new-channel-container"]}>
                <h1>New Channel:</h1>
                <form onSubmit={newChannelOnSubmit}>
                    <input
                        type="text"
                        value={newChannel}
                        onChange={(e) => setNewChannel(e.target.value)}
                        placeholder="Channel name"
                    />
                    <button type="submit">+ Add channel</button>
                </form>
            </div>
            <div className={page["content-container"]}>
                <div className="flex w-full">
                    <div className={page["channels-container"]}>
                        <h1>Channels</h1>
                        <ul>
                            {channels.map((channel) => (
                                <li key={channel.id}>
                                    <button onClick={() => {
                                            setSelectedChannel(channel);
                                        }}>
                                        {channel.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={page["announcements-wrapper"]}>
                        <div className={page["announcements-container"]}>
                            <h1>{selectedChannel?.name} Announcements</h1>
                            <div
                                ref={containerRef}
                                className={page["announcements-list"]}>
                                <ul>
                                    {announcements.map((announcement) => (
                                        <li key={announcement.senderId}>
                                            {announcement.senderId + ":"} {announcement.body}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className={page["announcements-input"]}>
                            <form onSubmit={handleChatSubmit}>
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type your message here..."
                                />
                                <button type="submit">Send</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
