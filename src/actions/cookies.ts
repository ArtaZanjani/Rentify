"use server";

import { cookies } from "next/headers";

const generateCookie = async (accessToken: string, refreshToken: string) => {
  (await cookies()).set("accessToken", accessToken, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60,
  });

  (await cookies()).set("refreshToken", refreshToken, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 24 * 60 * 60,
  });
};

export { generateCookie };
