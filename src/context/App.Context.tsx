import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";

interface UserInfo {
  id: string;
  email: string;
  role: string;
  [key: string]: string | number | boolean; // Add other properties as per your token structure
}
interface AppContextProps {
  authToken: string | null;
  userInfo: UserInfo | null;
  setAuthToken: (token: string | null) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authToken, setAuthTokenState] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // Function to set token and decode user info
  const setAuthToken = (token: string | null) => {
    setAuthTokenState(token);
    if (token) {
      localStorage.setItem("authToken", token);
      try {
        const decoded: UserInfo = jwtDecode<UserInfo>(token);
        setUserInfo(decoded); // Store decoded user info
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
    // Clear token and user info from local storage and state
    localStorage.removeItem("token");
    setAuthToken(null);
    setUserInfo(null);
  };

  // Load token and user info from localStorage on initial load
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      setAuthToken(savedToken);
    }
  }, []);

  return (
    <AppContext.Provider value={{ authToken, userInfo, setAuthToken, logout }}>
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
