/*
Things to work on:
1) Update UI to be more responsive. -> (DONE)
2) Create message component. -> (NOT NEEDED)
4) Change from announcement.senderId to get UserInformation with id = announcement.senderId and get name. Need to send user's name
5) Be able to lazily load in messages when I go to the top and icon refreshes to load more? -> (NOT NEEDED)
6) Input should be cleared at the end. -> (DONE)
7) Need a way to update UI on message_receive -> (DONE)
8) Change UI a bit. Make Channels a dropdown. -> (DONE)
9) Left align all messages. -> (DONE)
10) What if I highlight the message field red and say error was raised? -> (DONE)
11) Says key for all child props aren't unique.
12) Need screen directly to point at last message while navbar hasn't been scrolled. Else don't but write new message?
13) Limit number of characters for new channel. -> 255 (DONE)
14) Limit number of characters for new message. -> 51 (DONE)
15) Make it so if an extremely long message takes up a line, it goes on to next line. -> (DONE)
16) Use textarea instead of input. -> (DONE)
17) Add date to message. -> (DONE)
18) Once user selects a channel, make sure input can be processed. Disable textarea until channel is selected. -> (DONE)
19) How to ensure all announcement messages are deleted when a particular channel is deleted?
20) Make text area go to next line when reached limit for line, even if only one word. -> (DONE)
21) Need to handle different locations and languages
22) Test behavior when server is off. -> (DONE)
23) Text area should not have it's size movable. -> (DONE)
*/


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
import axios, { AxiosError } from "axios";
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
    const [channelMap, setChannelMap] = useState<Map<string, ChannelAttributes>>(new Map<string, ChannelAttributes>());
    const [prevSelectedChannel, setPrevSelectedChannel] = useState<ChannelAttributes | undefined>(undefined);
    const [selectedChannel, setSelectedChannel] = useState<ChannelAttributes | undefined>(undefined);
    const [announcements, setAnnouncements] = useState<AnnouncementAttributes[]>([]);
    const [newChannel, setNewChannel] = useState<string>("");
    const [message, setMessage] = useState("");
    const [isChannelDisabled, setIsChannelDisabled] = useState<boolean>(true);
    const [isChatDisabled, setIsChatDisabled] = useState<boolean>(true);
    const [failure, setFailure] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const bannerContext: BannerContextProps | undefined =
    useContext(BannerContext);
    const loadingContext: LoadingContextProps | undefined =
    useContext(LoadingContext);
    const { auth } = useAuth();

    const textAreaStyle = {
        backgroundColor: "#FFD6D7",
        borderColor: "#C6373C"
    };

    const getChannels = async () => {
        try {
          const response = await axios({
            method: "GET",
            url: `${config.apiUrl}/channel`,
            responseType: "json",
            data: {
                unitId: auth?.user?.unitId
            }
          });
          const data: ChannelAttributes[] = await response.data;
          if (data) {
            setChannels(data);
            const newChannelMap: Map<string, ChannelAttributes> = new Map<string, ChannelAttributes>();
            data.forEach(channel => {
                newChannelMap.set(channel.name, channel);
            })
            setChannelMap(newChannelMap);
          }
        } catch (err: any) {
            if(!err.response) {
                bannerContext?.showBanner("Error, server is currently down!", true);   
            }
            console.error(err);
        }
    };

    const parseAnnouncmentDate = (date: Date) => {
        if(!date) {
            return "";
        }
        const militaryHour: number = Number(date.toString().substring(16,18));
        const hour: number = militaryHour % 12;
        const period: string = militaryHour >= 12 ? "PM" : "AM"; 
        return date.toString().substring(4, 16) + hour + date.toString().substring(18, 21) + " " + period;
    }

    const getAnnouncements = async () => {
        try {
            if(!selectedChannel) {
                return;
            }
            const response = await axios({
                method: "GET",
                url: `${config.apiUrl}/channel/${selectedChannel?.id}`,
                responseType: "json",
                data: {
                    unitId: auth?.user?.unitId,
                }
            });
            const data = await response.data;
            if (data) {
                auth?.socket?.emit("join_room", {prevSelectedChannel: prevSelectedChannel?.name, selectedChannel: selectedChannel?.name});
                setAnnouncements(data);
            }
        } catch (err: any) {
            if(!err.response) {
                bannerContext?.showBanner("Error, server is currently down!", true);   
            }
            console.log("err is: ")
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

                //should remove user if they're in a channel when creating a new one
                if(selectedChannel) {
                    auth?.socket?.emit("leave_room", {channelName: selectedChannel.name});
                }

                loadingContext?.showLoader();

                const res = await fetch(`${config.apiUrl}/channel`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(newChannelRequest),
                });

                loadingContext?.hideLoader();

                if (res.status === 201) {
                    bannerContext?.showBanner(`Success, the new channel ${newChannel} successfully saved`, false);
                    await getAnnouncements();
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
    }, []);

    useEffect(() => {
        getAnnouncements();
        const providerListener = (newAnnouncement: AnnouncementAttributes) => {
            console.log("Message provider received message!")
            setAnnouncements((announcements) => [...announcements, newAnnouncement]);
            changeChatMessage("");
        };
        const subscriberListener = (newAnnouncement: AnnouncementAttributes) => {
            console.log("Message subscriber received message!")
            setAnnouncements((announcements) => [...announcements, newAnnouncement]);
        };
        const failedListener = (failedAnnouncement: AnnouncementAttributes) => {
            console.log("message_failed");
            setFailure(true);
        }

        auth?.socket?.on("message_provider", providerListener);
        auth?.socket?.on("message_subscriber", subscriberListener);
        auth?.socket?.on("message_failed", failedListener);

        return () => {
            auth?.socket?.off("message_provider", providerListener);
            auth?.socket?.off("message_subscriber", subscriberListener);
            auth?.socket?.off("message_failed", failedListener);
            if(selectedChannel) {
                auth?.socket?.emit("leave_room", {channelName: selectedChannel.name});
            }
        }
    }, [selectedChannel]);

    const handleChatSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        
        if (!message || !selectedChannel || !auth?.user?.id) {
            return;
        }

        const newAnnouncement: AnnouncementAttributes = {
            body: message,
            senderId: auth?.user?.id ?? 0,
            channelId: selectedChannel.id ?? 0,
            createdAt: new Date(),
        };

        auth?.socket?.emit("message_sent", newAnnouncement);
    };

    const handleNewChannel = (event: React.ChangeEvent<HTMLInputElement>) => {
        let newChannelName = event.target.value;
        let channelDisabled = (newChannelName.length == 0 || newChannelName.length > 51) ? true : false;
        setIsChannelDisabled(channelDisabled);
        setNewChannel(newChannelName);
    }

    const changeChatMessage = (chatMessage: string) => {
        let chatDisabled = ((chatMessage.length == 0 || chatMessage.length > 255) || (!selectedChannel)) ? true : false;
        setIsChatDisabled(chatDisabled);
        setMessage(chatMessage);
    }

    const handleChangeChat = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        let chatMessage = event.target.value;
        changeChatMessage(chatMessage);
    }

    const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPrevSelectedChannel(prevChannel => selectedChannel);
        setSelectedChannel(prevChannel => channelMap.get(event.target.value));
    }

    const handleClickTextArea = (event: React.MouseEvent<HTMLTextAreaElement>) => {
        setFailure(false);
    }

    return (
        <>
            <section className={page["chat-section"]}>
                <div className={page["new-channel-container"]}>
                    <h1>New Channel:</h1>
                    <form onSubmit={newChannelOnSubmit}>
                        <input
                            type="text"
                            value={newChannel}
                            onChange={handleNewChannel}
                            placeholder="Channel name"
                        />
                        <button type="submit" disabled={isChannelDisabled} className={isChannelDisabled ? page["disabled-button"] : undefined}>+ Add channel</button>
                    </form>
                </div>
                <div className={page["content-container"]}>
                    <div className="flex w-full h-full">
                        <div className={page["channels-container"]}>
                            <h1>Channels</h1>
                            <select onChange={handleOptionChange}>
                                <option disabled selected>-- Select Channel --</option>
                                {channels.map((channel) => (
                                    <option key={channel.id} value={channel.name}>
                                        {channel.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={page["announcements-wrapper"]}>
                            <div className={page["announcements-container"]}>
                                <h1>{selectedChannel?.name} Announcements</h1>
                                <div
                                    ref={containerRef}
                                    className={page["announcements-list"]}>
                                    <ul className={page["announcements-ul"]}>
                                        {announcements.map((announcement) => (
                                            <li key={announcement.id}>
                                                <div className={page["announcements-info"]}>
                                                    <h3>{announcement.senderId + " "}</h3>
                                                    <small>{parseAnnouncmentDate(new Date(announcement.createdAt ?? ""))}</small>
                                                </div>
                                                <p>{announcement.body}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className={page["announcements-input"]}>
                                <form onSubmit={handleChatSubmit}>
                                    <section>
                                        <textarea
                                            value={message}
                                            onClick={handleClickTextArea}
                                            onChange={handleChangeChat}
                                            placeholder="Type your message here..."
                                            cols={51}
                                            rows={5}
                                            disabled={!selectedChannel ? true : false}
                                            style={failure ? textAreaStyle : undefined}
                                        />
                                        <small style={!failure ? {display: "none"} : {color: "red"}}>Error occurred on server. Please try again!</small>
                                    </section>
                                    <button type="submit" disabled={isChatDisabled} className={isChatDisabled ? page["disabled-button"] : undefined}>Send</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}