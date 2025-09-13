import { hash, compare } from "bcryptjs";
import { sign, verify, JwtPayload } from "jsonwebtoken";

const hashData = async (data: string) => {
  return hash(data, 10);
};

const verifyHash = async (data: string, hashedData: string) => {
  return compare(data, hashedData);
};

const generateToken = (phoneNumber: string, type: "accessToken" | "refreshToken") => {
  return sign({ phoneNumber }, process.env.JWT_SECRET as string, {
    expiresIn: type === "accessToken" ? "15m" : "60d",
  });
};

const verifyToken = (token: string): JwtPayload | null => {
  try {
    const data = verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    return data;
  } catch {
    return null;
  }
};

export { hashData, verifyHash, generateToken, verifyToken };
