import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  birthday: string;
  phone?: string;
}

interface LonelySignal {
  id: string;
  userId: string;
  timestamp: number;
  responses: Array<{
    id: string;
    userId: string;
    userName: string;
    timestamp: number;
  }>;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
  lonelySignal: LonelySignal | null;
  setLonelySignal: (signal: LonelySignal | null) => void;
  nearbySignals: LonelySignal[];
  setNearbySignals: (signals: LonelySignal[]) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [lonelySignal, setLonelySignal] = useState<LonelySignal | null>(null);
  const [nearbySignals, setNearbySignals] = useState<LonelySignal[]>([]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn,
        setLoggedIn,
        lonelySignal,
        setLonelySignal,
        nearbySignals,
        setNearbySignals,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};