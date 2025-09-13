import connectToDB from "@/configs/connectToDB";
import { cookies } from "next/headers";
import { verifyTokenAndGetUser } from "@/utils/helpers";
import type { authenticateType } from "@/types/types";

const authenticate = async (): Promise<authenticateType> => {
  try {
    await connectToDB();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (accessToken) {
      const user = await verifyTokenAndGetUser(accessToken);
      if (user) return { isLogin: true, user };
    }

    if (refreshToken) {
      const user = await verifyTokenAndGetUser(refreshToken);
      if (user) return { isLogin: true, user };
    }

    return { isLogin: false };
  } catch {
    return { isLogin: false };
  }
};

export { authenticate };
