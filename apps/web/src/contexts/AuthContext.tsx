"use client";

import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import config from "../config";
import UserInformation from "@shared/src/interfaces/UserInformationAttributes";
import CustomJWTPayload from "@shared/src/interfaces/CustomJWTPayload";
import { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { BannerContext, BannerContextProps } from "./BannerContext";
import { jwtDecode, JwtPayload } from "jwt-decode";
import Cookies from "universal-cookie";
// import CustomJWTPayload from
interface AuthDetails {
  authenticated: boolean;
  user: UserInformation | null;
  socket: Socket | null | undefined;
  login: (username: string, password: string, role: string) => Promise<boolean>;
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
  const cookies = new Cookies();

  const loginUser = (userInfo: UserInformation) => {
    setUser(userInfo);
    setIsLoggedIn(true);
    const randomUUID = uuidv4();
    const newSocket = io(config.apiUrl);

    newSocket.on("schedule_upload_complete", () => {
      bannerContext?.showBanner("Upload schedule complete", "success");
    });
    newSocket?.emit("add_user", {
      username: userInfo.username,
      uuid: randomUUID,
      isAdmin: true,
    });
    setSocket(newSocket);
    setUserUUID(randomUUID);
  };

  const login = async (
    username: string,
    password: string,
    role: string
  ): Promise<boolean> => {
    try {
      const tokens = await getUser(username, password, role); // JWT token from server
      const accessToken: CustomJWTPayload = jwtDecode(tokens.access);
      const refreshToken: CustomJWTPayload = jwtDecode(tokens.refresh);
      const user: UserInformation | undefined = accessToken.user;

      if (user) {
        cookies.set("accessToken", tokens.access, {
          path: "/",
          expires: accessToken.exp
            ? new Date(accessToken.exp * 1000)
            : new Date(60 * 1000),
        });
        cookies.set("refreshToken", tokens.refresh, {
          path: "/",
          expires: refreshToken.exp
            ? new Date(refreshToken.exp * 1000)
            : new Date(259200 * 1000),
        });
        loginUser(user);
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  };

  const logout = (): Promise<boolean> => {
    socket?.emit("remove_user", {
      username: user?.username,
      uuid: userUUID,
      isAdmin: true,
    });
    cookies.remove("accessToken", { path: "/" });
    cookies.remove("refreshToken", { path: "/" });
    setIsLoggedIn(false);
    setUser({} as UserInformation);
    setSocket(undefined);
    setUserUUID(undefined);
    return Promise.resolve(true);
  };

  const getUser = async (username: string, password: string, role: string) => {
    try {
      const url = config.apiUrl;
      const response = await axios({
        method: "POST",
        url: `${url}/login`,
        responseType: "json",
        data: {
          username: username,
          password: password,
          isMobile: role,
        },
      });
      const data = await response.data;
      return data;
    } catch (err) {
      console.error(err);
    }
  };
  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      const refreshToken = cookies.get("refreshToken");
      if (!refreshToken) return null;
      const decodedToken: CustomJWTPayload = jwtDecode(refreshToken);
      // Send refresh token to server to get new access token
      const url = config.apiUrl;
      const response = await axios.post(`${url}/refresh-token`, {
        refreshToken: refreshToken,
        user: decodedToken.user,
      });
      const accessToken = jwtDecode(response.data);
      if (accessToken) {
        // Update access token in cookies
        cookies.set("accessToken", response.data, {
          path: "/",
          expires: accessToken.exp
            ? new Date(accessToken.exp * 1000)
            : new Date(60 * 1000),
        });
        return response.data;
      }
    } catch (error) {
      console.error("Error refreshing access token", error);
    }
    return null;
  };
  const refreshUser = async (): Promise<void> => {
    try {
      const refreshToken: string = cookies.get("refreshToken");
      if (refreshToken) {
        const decodedToken: CustomJWTPayload = jwtDecode(refreshToken);
        const userInfo = decodedToken.user;
        if (userInfo) {
          loginUser(userInfo);
          return;
        }
      }
      await logout();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    /**
     * Intercepts any unauthorized (status 401) Axios response
     * and attempts to resend request with new access token
     */
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
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

    // Sign the user back in on refresh/navigating back to admin portal from other site
    refreshUser();
    return () => {
      axios.interceptors.response.eject(interceptor);
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
