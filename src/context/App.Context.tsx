import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { RecordDataInterface } from "../types/record.data.interface";

interface UserInfo {
  id: string;
  email: string;
  role: string;
  [key: string]: string | number | boolean; // Add other properties as per your token structure
}
interface AppContextProps {
  authToken: string | null;
  userRecords: RecordDataInterface[];
  setUserRecords: React.Dispatch<React.SetStateAction<RecordDataInterface[]>>;
  userInfo: UserInfo | null;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo | null>>;
  isAuthenticated: boolean;
  setAuthToken: (token: string | null) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authToken, setAuthTokenState] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRecords, setUserRecords] = useState<RecordDataInterface[]>([]);

  const setAuthToken = (token: string | null) => {
    setAuthTokenState(token);
    if (token) {
      localStorage.setItem("authToken", token);
      setIsAuthenticated(true);
      try {
        const decoded: UserInfo = jwtDecode<UserInfo>(token);
        setUserInfo(decoded);
      } catch (error) {
        console.error("Invalid token:", error);
        setUserInfo(null);
      }
    } else {
      localStorage.removeItem("authToken");
      setUserInfo(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    setUserInfo(null);
  };

  // Load token and user info from localStorage on initial load
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      setAuthToken(savedToken);
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        authToken,
        userInfo,
        setUserInfo,
        setAuthToken,
        logout,
        isAuthenticated,
        userRecords,
        setUserRecords,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
