"use client";
import { usePathname } from "next/navigation";

const MarginTop = () => {
  const pathname = usePathname();
  const pathnames = ["/", `${pathname.startsWith("/auth")}`];
  const isAuthPath = pathname.startsWith("/auth");
  if (pathnames.includes(pathname) || isAuthPath) return null;
  return <div className="mt-47"></div>;
};

export default MarginTop;
