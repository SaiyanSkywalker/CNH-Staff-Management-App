"use client"
import { createContext, useContext, useState } from "react";

interface AuthDetails {
  authenticated: boolean;
  user: {} | null;
  login: (username: string, password: string) => boolean;
  logout: () => boolean;
}

interface IAuthContext {
  auth: AuthDetails
  setAuth: (auth: boolean) => void
}

const AuthContext = createContext<Partial<IAuthContext>>({});

export default function AuthProvider ({ children,
}: {
  children: React.ReactNode;
}) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    const login = (username: string, password: string): boolean => {
      // Perform validation and authentication logic here
      if (username === "example" && password === "password") {
          setIsLoggedIn(true);
          return true;
      }
      
      return false;
    }

    const logout = (): boolean => {
      setIsLoggedIn(false);
      //window.location.reload();
      return true;
    }

    const setAuthDetails = (auth: boolean): void => {
        if (auth !== undefined) {
            setIsLoggedIn(auth);
        }
    }

    return (
        <AuthContext.Provider value={{auth: {authenticated: isLoggedIn, user, login, logout,}, setAuth: setAuthDetails}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext)