import axios from "axios";
import { createContext, useContext, useState } from "react";
import config from "../config";
import UserInformation from "@shared/src/interfaces/UserInformationAttributes";
import { Platform } from "react-native";
import { Socket } from "socket.io-client";
import { io } from "socket.io-client";

interface AuthDetails {
  authenticated: boolean;
  user: {} | null;
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
  const [user, setUser] = useState<UserInformation[]>([]);
  const [socket, setSocket] = useState<Socket | null | undefined>(undefined);

  const login = async (
    username: string,
    password: string,
    isMobile: string
  ): Promise<boolean> => {
    const userInfo = await getUser(username, password, isMobile);
    if (userInfo) {
      setUser(userInfo);
      setIsLoggedIn(true);
      const newSocket = io(config.apiUrl);
      newSocket?.emit("user", {username, password});
      setSocket(newSocket);
      return Promise.resolve(true);
    }

    return Promise.resolve(false);
  };

  const logout = (): Promise<boolean> => {
    setIsLoggedIn(false);
    setUser([]);
    socket?.disconnect();
    setSocket(undefined);
    return Promise.resolve(true);
  };

  const getUser = async (
    username: string,
    password: string,
    isMobile: string
  ) => {
    try {
      const androidURL = "http://10.0.2.2:3003"; // android doesn't allow you to use localhost (idk why, it's weird)
      const url = Platform.OS === "android" ? androidURL : config.apiUrl;
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
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
