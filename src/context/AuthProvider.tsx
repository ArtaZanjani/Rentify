"use client";

import { createContext, useContext, ReactNode } from "react";
import type { UserType } from "@/types/types";

type AuthContextType = {
  user: UserType | null;
};

const AuthContext = createContext<AuthContextType>({ user: null });

type AuthProviderProps = {
  children: ReactNode;
  user: UserType | null;
};

export const AuthProvider = ({ children, user }: AuthProviderProps) => {
  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
