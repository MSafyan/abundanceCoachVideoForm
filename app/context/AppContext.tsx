"use client";

// context/AppContext.tsx
import React, { createContext, useState, useContext } from "react";

type AppContextType = {
  isVimeoAuthenticated: boolean;
  setIsVimeoAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isVimeoAuthenticated, setIsVimeoAuthenticated] = useState(false);

  return (
    <AppContext.Provider
      value={{ isVimeoAuthenticated, setIsVimeoAuthenticated }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
