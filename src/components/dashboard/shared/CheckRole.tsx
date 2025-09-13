"use client";
import { useAuth } from "@/context/AuthProvider";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const CheckRole = () => {
  const { user } = useAuth();
  const pathname = usePathname();
  const { replace } = useRouter();
  useEffect(() => {
    if (!user) return;

    if (user.role === "ADMIN" && !pathname.startsWith("/dashboard/admin")) {
      replace("/dashboard/admin");
    }

    if ((user.role === "USER" || user.role === "OFFICE") && !pathname.startsWith("/dashboard/user")) {
      replace("/dashboard/user");
    }
  }, [pathname, replace, user]);
  return null;
};

export default CheckRole;
