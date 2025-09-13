import UserModel from "@/models/UserModel";
import { verifyToken } from "@/utils/auth/auth";
import { JwtPayload } from "jsonwebtoken";

export const verifyTokenAndGetUser = async (token: string) => {
  try {
    if (!token) return null;

    const decoded = verifyToken(token) as JwtPayload;
    if (!decoded || !decoded.phoneNumber) return null;

    const user = await UserModel.findOne({ phone_number: decoded.phoneNumber }, "-__v -refreshToken");
    if (!user) return null;

    return user;
  } catch {
    return null;
  }
};
