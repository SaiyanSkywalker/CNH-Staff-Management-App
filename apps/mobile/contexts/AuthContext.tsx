import axios from "axios";
import { createContext, useContext, useState } from "react";
import config from "../config";
import UserInformation from "@shared/src/interfaces/UserInformationAttributes";
import { Alert, Platform } from "react-native";
import { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

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
      newSocket.on("shift_update", () => {
        Alert.alert("the shift has been updated!!!!!")
      })
      newSocket?.emit("add_user", { username, uuid: randomUUID });
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
          socket: socket,
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
