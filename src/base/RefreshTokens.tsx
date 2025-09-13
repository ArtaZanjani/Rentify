"use client";
import { refreshTokens } from "@/actions/auth";
import { useEffect } from "react";

const RefreshTokens = () => {
  useEffect(() => {
    const refresh = async () => {
      await refreshTokens();
    };

    refresh();
  }, []);
  return null;
};

export default RefreshTokens;
