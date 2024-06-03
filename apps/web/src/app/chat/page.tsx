/**
 * File: page.tsx
 * Purpose: Component for /chat page; Contains functionality for chat feature
 */
"use client";

import React, {
  useState,
  useContext,
  useRef,
  useEffect,
  FormEvent,
} from "react";
import styles from "@webSrc/styles/Chat.module.css";
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
import { getAccessToken } from "@webSrc/utils/token";
import { v4 as uuidv4 } from "uuid";
import ProtectedRoute from "@webSrc/components/ProtectedRoute";

const Page = () => {
  const [channels, setChannels] = useState<ChannelAttributes[]>([]);
  const [channelMap, setChannelMap] = useState<Map<string, ChannelAttributes>>(
    new Map<string, ChannelAttributes>()
  );
  const [prevSelectedChannel, setPrevSelectedChannel] = useState<
    ChannelAttributes | undefined
  >(undefined);
  const [selectedChannel, setSelectedChannel] = useState<
    ChannelAttributes | undefined
  >(undefined);
  const [announcements, setAnnouncements] = useState<AnnouncementAttributes[]>(
    []
  );
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
    borderColor: "#C6373C",
  };

  /**
   * Get channels for chat
   */
  const getChannels = async () => {
    try {
      const accessToken = getAccessToken();
      const response = await axios({
        method: "GET",
        url: `${config.apiUrl}/channel`,
        responseType: "json",
        headers: {
          unitId: auth?.user?.unitId,
          roleId: auth?.user?.roleId,
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response && response.data) {
        const data: ChannelAttributes[] = await response.data;
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
    } catch (err: any) {
      if (!err.response) {
        bannerContext?.showBanner(
          "Error retrieivng channels from server",
          "error"
        );
      }
      // console.error(err);
    }
  };

  /**
   * Convert date for chat into user-friendly format
   * @param date datetime chat was posted
   * @returns formatted date string
   */
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

  /**
   * Gets chat announcements for a particular channel
   * @returns list of announcements
   */
  const getAnnouncements = async () => {
    try {
      if (!selectedChannel) {
        return;
      }
      const accessToken = getAccessToken();
      const response = await axios({
        method: "GET",
        url: `${config.apiUrl}/channel/${selectedChannel?.id}`,
        responseType: "json",
        headers: {
          unitId: auth?.user?.unitId,
          roleId: auth?.user?.roleId,
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.data;
      if (data) {
        auth?.socket?.emit("join_room", {
          prevSelectedChannel: prevSelectedChannel?.name,
          selectedChannel: selectedChannel?.name,
        });
        setAnnouncements(data);
      }
    } catch (err: any) {
      if (!err.response) {
        bannerContext?.showBanner("Error, server is currently down!", "error");
      }
      // console.error(err);
    }
  };

  /**
   * Sends request for new chat channel to be created in db
   * @param event
   */
  async function newChannelOnSubmit(event: FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault();
      if (Object.keys(newChannel).length === 0) {
        bannerContext?.showBanner(
          "Please define the name of the channel before saving",
          "error"
        );
      } else {
        let newChannelRequest: ChannelAttributes = {
          name: newChannel,
        };

        loadingContext?.showLoader();
        const accessToken = getAccessToken();
        const res = await axios.post(
          `${config.apiUrl}/channel`,
          JSON.stringify(newChannelRequest),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // const res = await fetch(`${config.apiUrl}/channel`, {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //     Authorization: `Bearer ${accessToken}`,
        //   },
        //   body: JSON.stringify(newChannelRequest),
        // });

        loadingContext?.hideLoader();

        if (res.status === 201) {
          let jsonData: any = res;
          bannerContext?.showBanner(
            `Success, the new channel ${newChannel} successfully saved`,
            "success"
          );
          setChannels((prevSelectedChannels) => [
            ...prevSelectedChannels,
            newChannelRequest,
          ]);
          const newChannelMap = new Map(channelMap);
          newChannelRequest.id = jsonData.id;
          newChannelMap.set(newChannelRequest.name, newChannelRequest);
          setChannelMap(newChannelMap);
          await getAnnouncements();
        } else {
          bannerContext?.showBanner(
            `Error in saving the new channel ${newChannel}`,
            "error"
          );
        }

        setNewChannel("");
      }
    } catch (error) {
      loadingContext?.hideLoader();
      bannerContext?.showBanner(
        `Error in saving the new channel ${newChannel} + ${error}`,
        "error"
      );

      setNewChannel("");
    }
  }

  useEffect(() => {
    getChannels();
  }, []);

  useEffect(() => {
    getAnnouncements();

    // Event listeners for sockets that allow for real-time updates
    // to the message forum
    const providerListener = (newAnnouncement: AnnouncementAttributes) => {
      setAnnouncements((announcements) => [...announcements, newAnnouncement]);
      changeChatMessage("");
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

  /**
   * Emits a socket event once user posts a message in the chat
   * @param event
   * @returns
   */
  const handleChatSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!message || !selectedChannel || !auth?.user?.id) {
      return;
    }
    const newAnnouncement: AnnouncementAttributes = {
      body: message,
      sender: auth?.user,
      senderId: auth?.user?.id ?? 0,
      channelId: selectedChannel.id ?? 0,
      createdAt: new Date(),
    };

    auth?.socket?.emit("message_sent", newAnnouncement);
  };

  /**
   * Handles user input when entering a new channel name
   * @param event
   */
  const handleNewChannel = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newChannelName = event.target.value;

    // Disables channel names with more than 51 characters
    let channelDisabled =
      newChannelName.length == 0 || newChannelName.length > 51 ? true : false;
    setIsChannelDisabled(channelDisabled);
    setNewChannel(newChannelName);
  };

  /**
   * Enables/disables send button based on chat input   (255 char limit)
   * @param chatMessage
   */
  const changeChatMessage = (chatMessage: string) => {
    let chatDisabled =
      chatMessage.length == 0 || chatMessage.length > 255 || !selectedChannel
        ? true
        : false;
    setIsChatDisabled(chatDisabled);
    setMessage(chatMessage);
  };

  /**
   * Handling user typing messsage
   * @param event 
   */
  const handleChangeChat = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    let chatMessage = event.target.value;
    changeChatMessage(chatMessage);
  };

  // Handles user selecting a different channel
  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPrevSelectedChannel((prevChannel) => selectedChannel);
    setSelectedChannel((prevChannel) => channelMap.get(event.target.value));
  };

  // Handles user clicking out of error
  const handleClickTextArea = (
    event: React.MouseEvent<HTMLTextAreaElement>
  ) => {
    setFailure(false);
  };

  return (
    <>
      <section className={styles["chat-section"]}>
        <div className={styles["new-channel-container"]}>
          <h1>New Channel:</h1>
          <form onSubmit={newChannelOnSubmit}>
            <input
              type="text"
              value={newChannel}
              onChange={handleNewChannel}
              placeholder="Enter channel name"
            />
            <button
              type="submit"
              disabled={isChannelDisabled}
              className={
                isChannelDisabled ? styles["disabled-button"] : undefined
              }
            >
              + Add channel
            </button>
          </form>
        </div>
        <div className={`${styles["content-container"]} max-h-[952px]`}>
          <div className={`flex w-full h-full`}>
            <div className={styles["channels-container"]}>
              <h1>Channels</h1>
              <select
                className={styles["channels-select"]}
                onChange={handleOptionChange}
              >
                <option defaultValue={undefined}>-- Select Channel --</option>
                {channels.map((channel) => (
                  <option key={uuidv4()} value={channel.name}>
                    {channel.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles["announcements-wrapper"]}>
              <div className={styles["announcements-container"]}>
                <h1>{selectedChannel?.name} Announcements</h1>
                <div
                  ref={containerRef}
                  className={styles["announcements-list"]}
                >
                  <ul className={styles["announcements-ul"]}>
                    {announcements.map((announcement) => (
                      <li key={uuidv4()}>
                        <div className={styles["announcements-info"]}>
                          <h3>{announcement.sender?.username}&nbsp;</h3>
                          <small>
                            {parseAnnouncmentDate(
                              new Date(announcement.createdAt ?? "")
                            )}
                          </small>
                        </div>
                        <p>{announcement.body}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className={styles["announcements-input"]}>
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
                    <small
                      style={!failure ? { display: "none" } : { color: "red" }}
                    >
                      Error occurred on server. Please try again!
                    </small>
                  </section>
                  <button
                    type="submit"
                    disabled={isChatDisabled}
                    className={
                      isChatDisabled ? styles["disabled-button"] : undefined
                    }
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProtectedRoute(Page);
