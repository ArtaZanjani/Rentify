"use server";
import { cookies } from "next/headers";
import { generateToken } from "@/utils/auth/auth";
import { generateCookie } from "./cookies";
import connectToDB from "@/configs/connectToDB";
import { verifyTokenAndGetUser } from "@/utils/helpers";
import { redirect } from "next/navigation";

export const refreshTokens = async () => {
  try {
    await connectToDB();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    let user = null;

    if (accessToken) {
      user = await verifyTokenAndGetUser(accessToken);
    } else if (refreshToken) {
      user = await verifyTokenAndGetUser(refreshToken);
    }

    if (!user) return { success: false };

    const newAccessToken = generateToken(user.phone_number, "accessToken");
    const newRefreshToken = generateToken(user.phone_number, "refreshToken");

    await generateCookie(newAccessToken, newRefreshToken);

    user.refreshToken = newRefreshToken;
    await user.save();

    return { success: true };
  } catch {
    return { success: false };
  }
};

export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  redirect("/auth/owner");
};
