import { revalidatePath } from "next/cache";
import { navHeader } from "./path";

export const DASHBOARD_PATHS = {
  user: ["/dashboard/user", "/dashboard/user/my-ads", navHeader[4].path, "/dashboard/user/wishlist"],
  // office: ["/dashboard/office", "/dashboard/office/my-ads", "/dashboard/office/register-ads", "/dashboard/office/wishlist"],
  admin: ["/dashboard/admin"],
  auth: ["/auth/owner", "/auth/agency"],
};

export const revalidatePaths = (paths: string[]) => {
  paths.forEach((path) => {
    try {
      revalidatePath(path);
    } catch {
      return null;
    }
  });
};
