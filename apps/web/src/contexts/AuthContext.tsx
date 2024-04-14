"use client";

import axios from "axios";
import { createContext, useContext, useState } from "react";
import config from "../config";
import UserInformation from "@shared/src/interfaces/UserInformationAttributes";
import { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { BannerContext, BannerContextProps } from "./BannerContext";

interface AuthDetails {
  authenticated: boolean;
  user: UserInformation | null;
  socket: Socket | null | undefined;
  login: (
    username: string,
    password: string,
    isMobile: string
  ) => Promise<boolean>;
  logout: () => Promise<boolean>;
}

interface IAuthContext {
  auth: AuthDetails;
}

const AuthContext = createContext<Partial<IAuthContext>>({});

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserInformation>({} as UserInformation);
  const [socket, setSocket] = useState<Socket | null | undefined>(undefined);
  const [userUUID, setUserUUID] = useState<string | undefined>(undefined);
  const bannerContext: BannerContextProps | undefined =
    useContext(BannerContext);
  const login = async (
    username: string,
    password: string,
    isMobile: string
  ): Promise<boolean> => {
    const userInfo = await getUser(username, password, isMobile);
    if (userInfo) {
      setUser(userInfo);
      setIsLoggedIn(true);
      const randomUUID = uuidv4();
      console.log(randomUUID);
      const newSocket = io(config.apiUrl);
      // Add new socket event for notifcations
      newSocket.on("schedule_upload_complete", () => {
        bannerContext?.showBanner("Upload schedule complete", "false");
      });
      newSocket?.emit("add_user", {
        username,
        uuid: randomUUID,
        isAdmin: true,
      });
      setSocket(newSocket);
      setUserUUID(randomUUID);
      return Promise.resolve(true);
    }

    return Promise.resolve(false);
  };

  const logout = (): Promise<boolean> => {
    socket?.emit("remove_user", { username: user?.username, uuid: userUUID });
    setIsLoggedIn(false);
    setUser({} as UserInformation);
    setSocket(undefined);
    setUserUUID(undefined);
    return Promise.resolve(true);
  };

  const getUser = async (
    username: string,
    password: string,
    isMobile: string
  ) => {
    try {
      const url = config.apiUrl;
      const response = await axios({
        method: "GET",
        url: `${url}/user/?username=${username}&password=${password}&isMobile=${isMobile}`,
        responseType: "json",
      });
      const data = await response.data;
      return data;
    } catch (err) {
      console.error(err);
    }

    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        auth: {
          authenticated: isLoggedIn,
          user: user,
          login: login,
          logout: logout,
          socket: socket,
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
