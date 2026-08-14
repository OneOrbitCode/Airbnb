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
  phone?: string;
  bio?: string;
  location?: string;
  joinedDate?: string;
}

export const DEMO_ACCOUNTS: UserProfile[] = [
  {
    id: 3,
    name: "Arun (Guest)",
    email: "arun.guest@airbnb.clone",
    phone: "+91 98765 43210",
    role: "guest",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    isVerified: true,
    bio: "Passionate traveler exploring culture, mountains, and heritage stays across India.",
    location: "Varanasi, India",
    joinedDate: "Member since 2023",
  },
  {
    id: 1,
    name: "John Doe (Host)",
    email: "john.host@airbnb.clone",
    phone: "+91 91234 56789",
    role: "host",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
    isVerified: true,
    isSuperhost: true,
    bio: "Superhost with 5+ heritage villas in Jaipur and Goa. Dedicated to top hospitality.",
    location: "Jaipur, India",
    joinedDate: "Hosting since 2021",
  },
  {
    id: 2,
    name: "Priya Sharma (VIP Guest)",
    email: "priya.vip@airbnb.clone",
    phone: "+91 99887 76655",
    role: "guest",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    isVerified: true,
    bio: "Remote designer seeking beachfront villas, luxury stays, and quiet workspaces.",
    location: "Mumbai, India",
    joinedDate: "Member since 2022",
  },
];

export const MOCK_USERS = DEMO_ACCOUNTS;

interface AuthContextType {
  currentUser: UserProfile;
  switchUser: (role: "guest" | "host") => void;
  loginAsUser: (user: UserProfile) => void;
  loginWithEmail: (email: string) => boolean;
  logout: () => void;
  verifyIdentity: () => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: DEMO_ACCOUNTS[0],
  switchUser: () => {},
  loginAsUser: () => {},
  loginWithEmail: () => false,
  logout: () => {},
  verifyIdentity: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_ACCOUNTS[0]);

  useEffect(() => {
    const saved = localStorage.getItem("airbnb_active_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const match = DEMO_ACCOUNTS.find((u) => u.id === parsed.id || u.email === parsed.email) || parsed;
        setCurrentUser(match);
      } catch {}
    }
  }, []);

  const switchUser = (role: "guest" | "host") => {
    const user = role === "host" ? DEMO_ACCOUNTS[1] : DEMO_ACCOUNTS[0];
    setCurrentUser(user);
    localStorage.setItem("airbnb_active_user", JSON.stringify(user));
  };

  const loginAsUser = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem("airbnb_active_user", JSON.stringify(user));
  };

  const loginWithEmail = (email: string): boolean => {
    const clean = email.trim().toLowerCase();
    const match = DEMO_ACCOUNTS.find((u) => u.email.toLowerCase() === clean);
    if (match) {
      loginAsUser(match);
      return true;
    }
    // Create new temporary guest profile if email doesn't exist
    const customUser: UserProfile = {
      id: Date.now(),
      name: email.split("@")[0] || "Guest User",
      email: email,
      role: "guest",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      isVerified: true,
      joinedDate: "Member since today",
    };
    loginAsUser(customUser);
    return true;
  };

  const logout = () => {
    loginAsUser(DEMO_ACCOUNTS[0]);
  };

  const verifyIdentity = () => {
    setCurrentUser((prev) => {
      const updated = { ...prev, isVerified: true };
      localStorage.setItem("airbnb_active_user", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        switchUser,
        loginAsUser,
        loginWithEmail,
        logout,
        verifyIdentity,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
