"use client";

import axios from "axios";
import { createContext, useContext, useState } from "react";
import config from "web/src/config";
import UserInformation from "@shared/src/interfaces/UserInformationAttributes";

interface AuthDetails {
  authenticated: boolean;
  user: UserInformation | null;
  login: (username: string, password: string) => Promise<boolean>;
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

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    const userInfo = await getUser(username, password);

    if (userInfo) {
      setUser(userInfo);
      setIsLoggedIn(true);
      return Promise.resolve(true);
    }

    return Promise.resolve(false);
  };

  const logout = (): Promise<boolean> => {
    setIsLoggedIn(false);
    setUser({} as UserInformation);
    return Promise.resolve(true);
  };

  const getUser = async (
    username: string,
    password: string
  ): Promise<UserInformation | undefined> => {
    try {
      const response = await axios({
        method: "GET",
        url: `${config.apiUrl}/user/?username=${username}&password=${password}`,
        responseType: "json",
      });
      return response.data;
    } catch (err) {
      console.error(err);
    }
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
