import axios from "axios";
import "core-js/stable/atob";
import { createContext, useContext, useEffect, useState } from "react";
import config from "../config";
import UserInformation from "@shared/src/interfaces/UserInformationAttributes";
import { Alert } from "react-native";
import { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import ShiftRequestUpdate from "@shared/src/interfaces/ShiftRequestUpdate";
import { getToken, setToken } from "../utils/token";
import { jwtDecode } from "jwt-decode";
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

/**
 * Handles login/logout authentication
 *
 * @returns
 */
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
    const tokens = await getUser(username, password, isMobile);
    // store tokens
    setToken("accessToken", tokens.access);
    setToken("refreshToken", tokens.refresh);

    const userInfo = jwtDecode(tokens.access) as UserInformation;

    if (userInfo) {
      loginUser(userInfo);
      return Promise.resolve(true);
    }

    return Promise.resolve(false);
  };
  const loginUser = (userInfo: UserInformation) => {
    setUser(userInfo);
    setIsLoggedIn(true);
    const randomUUID = uuidv4();
    const newSocket = io(config.apiUrl);

    // Event handler for when admin user
    // accepts shift request
    newSocket.on("shift_update", (arg: ShiftRequestUpdate) => {
      console.log(`isAccepted: ${arg.isAccepted}`);
      Alert.alert("Shift Request Update", `${arg.message}`);
    });
    newSocket?.emit("add_user", {
      username: userInfo.username,
      uuid: randomUUID,
    });
    setSocket(newSocket);
    setUserUUID(randomUUID);
  };

  /**
   * Logs out user, removes them from socket map
   * @returns
   */
  const logout = (): Promise<boolean> => {
    socket?.emit("remove_user", { username: user?.username, uuid: userUUID });
    setIsLoggedIn(false);
    setUser({} as UserInformation);
    setSocket(undefined);
    setUserUUID(undefined);
    return Promise.resolve(true);
  };

  /**
   * Used to retreive user info when logging in
   * @param username
   * @param password
   * @returns
   */
  const getUser = async (username: string, password: string, isMobile: string) => {
    try {
      const url = config.apiUrl;
      const response = await axios({
        method: "POST",
        url: `${url}/login`,
        responseType: "json",
        data: {
          username: username,
          password: password,
          isMobile,
        },
      });
      const data = await response.data;
      return data;
    } catch (err) {
      console.error(err);
    }
    return null;
  };

  const refreshUser = async () => {
    try {
      const refreshToken = await getToken("refreshToken");
      if (refreshToken != undefined || refreshToken != null) {
        const userInfo = jwtDecode(refreshToken) as UserInformation;
        if (userInfo) {
          loginUser(userInfo);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const refreshAccessToken = async (): Promise<string | null> => {
      try {
        const refreshToken = getToken("refreshToken");
        if (!refreshToken) return null;

        // Send refresh token to server to get new access token
        const url = config.apiUrl;
        const response = await axios.post(`${url}/refresh-token`, {
          refreshToken,
        });
        const { accessToken } = response.data;
        if (accessToken) {
          // Update access token in cookies
          setToken("accessToken", accessToken);
          return accessToken;
        }
      } catch (error) {
        console.error("Error refreshing access token", error);
      }
      return null;
    };
    const axiosInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response &&
          error.response.status === 401 &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          try {
            // Attempt to refresh token
            const refreshedToken = await refreshAccessToken();
            if (refreshedToken) {
              // Retry original request with new access token
              originalRequest.headers[
                "Authorization"
              ] = `Bearer ${refreshedToken}`;
              return axios(originalRequest);
            } else {
              // If refresh fails, logout user
              await logout();
            }
          } catch (error) {
            console.error("Error refreshing token", error);
            // If refresh fails, logout user
            await logout();
          }
        }
        return Promise.reject(error);
      }
    );
    // Sign the user back in on refresh/navigating back to admin portal from other site
    // refreshUser();
    return () => {
      axios.interceptors.response.eject(axiosInterceptor);
    };
  }, []);
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
