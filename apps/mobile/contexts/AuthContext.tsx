/**
 * File: AuthContext.tsx
 * Purpose: Context object used to maintain user login state
 */
import axios from "axios";
import "core-js/stable/atob";
import { createContext, useContext, useEffect, useState } from "react";
import config from "../config";
import UserInformation from "@shared/src/interfaces/UserInformationAttributes";
import CustomJWTPayload from "@shared/src/interfaces/CustomJWTPayload";
import { Alert } from "react-native";
import { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import ShiftRequestUpdate from "@shared/src/interfaces/ShiftRequestUpdate";
import { getToken, removeToken, setToken } from "../utils/token";
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
export const useAuth = () => useContext(AuthContext);
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
    if (tokens) {
      // store tokens
      setToken("accessToken", tokens.access);
      setToken("refreshToken", tokens.refresh);

      const decodedToken: CustomJWTPayload = jwtDecode(tokens.access);
      const userInfo: UserInformation | undefined = decodedToken.user;
      if (userInfo) {
        loginUser(userInfo);
        return true;
      }
    }
    return false;
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
  const logout = async (): Promise<boolean> => {
    socket?.emit("remove_user", { username: user?.username, uuid: userUUID });
    removeToken("accessToken");
    removeToken("refreshToken");
    setIsLoggedIn(false);
    setUser({} as UserInformation);
    setSocket(undefined);
    setUserUUID(undefined);
    return true;
  };

  /**
   * Used to retreive user info when logging in
   * @param username
   * @param password password (unhashed)
   * @returns
   */
  const getUser = async (
    username: string,
    password: string,
    isMobile: string
  ) => {
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

  useEffect(() => {
    /**
     * Fetches new access token (from server) after it expires
     * @returns access token (wrapped in promise)
     */
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

    // Interceptor that runs before every axios request and resends
    // request with new access token if response is forbidden or unauthorized
    const axiosInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        // resend request with new access token if response is forbidden or unauthorized
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403) &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          try {
            const refreshedToken = await refreshAccessToken();
            if (refreshedToken) {
              originalRequest.headers[
                "Authorization"
              ] = `Bearer ${refreshedToken}`;
              return axios(originalRequest);
            } else {
              await logout();
            }
          } catch (error) {
            console.error("Error refreshing token", error);
            await logout();
          }
        }
        return Promise.reject(error);
      }
    );
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
