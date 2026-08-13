"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: "guest" | "host";
  avatar: string;
  isVerified: boolean;
  isSuperhost?: boolean;
}

export const MOCK_USERS: UserProfile[] = [
  {
    id: 3,
    name: "Arun (Guest)",
    email: "arun.guest@airbnb.clone",
    role: "guest",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    isVerified: true,
  },
  {
    id: 1,
    name: "John Doe (Host)",
    email: "john.host@airbnb.clone",
    role: "host",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
    isVerified: true,
    isSuperhost: true,
  },
];

interface AuthContextType {
  currentUser: UserProfile;
  switchUser: (role: "guest" | "host") => void;
  verifyIdentity: () => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: MOCK_USERS[0],
  switchUser: () => {},
  verifyIdentity: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile>(MOCK_USERS[0]);

  useEffect(() => {
    const saved = localStorage.getItem("airbnb_active_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const match = MOCK_USERS.find((u) => u.id === parsed.id) || parsed;
        setCurrentUser(match);
      } catch {}
    }
  }, []);

  const switchUser = (role: "guest" | "host") => {
    const user = role === "host" ? MOCK_USERS[1] : MOCK_USERS[0];
    setCurrentUser(user);
    localStorage.setItem("airbnb_active_user", JSON.stringify(user));
  };

  const verifyIdentity = () => {
    setCurrentUser((prev) => {
      const updated = { ...prev, isVerified: true };
      localStorage.setItem("airbnb_active_user", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ currentUser, switchUser, verifyIdentity }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
