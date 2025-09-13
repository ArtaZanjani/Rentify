"use client";
import { navHeader } from "@/utils/path";
import Link from "next/link";
import Image from "next/image";
import Button from "../common/Button";
import { Add, Login } from "iconsax-react";
import { useSidebar } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { roleTypes } from "@/types/types";

type HeaderPropsType = {
  isLogin: boolean;
  role: roleTypes;
};

const Header = ({ isLogin, role }: HeaderPropsType) => {
  const { toggleSidebar } = useSidebar();
  const [activeHeader, setActiveHeader] = useState<boolean>(false);
  const pathname = usePathname();
  const isMainPath = pathname === "/";
  const [logoSrc, setLogoSrc] = useState("/images/Logo.webp");

  useEffect(() => {
    const showScroll = () => {
      if (window.scrollY) {
        setActiveHeader(true);
      } else {
        setActiveHeader(false);
      }
    };

    document.addEventListener("scroll", showScroll, { passive: true });

    return () => {
      document.removeEventListener("scroll", showScroll);
    };
  }, []);

  useEffect(() => {
    if (pathname === "/" || activeHeader) {
      setLogoSrc("/images/Logo2.webp");
    } else {
      setLogoSrc("/images/Logo.webp");
    }
  }, [pathname, activeHeader]);

  if (pathname.startsWith("/auth")) {
    return null;
  }

  return (
    <header className={`fixed w-full padding-body left-0 z-50 transition-all ${activeHeader ? "backdrop-blur-3xl bg-black/20 top-0 py-5" : "top-10"}`}>
      <nav className="flex items-center justify-between">
        <button aria-label="منو" onClick={toggleSidebar} className="flex-1 lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M3 7h18M3 12h18M3 17h18" stroke={isMainPath || activeHeader ? "#fff" : "#000"} strokeWidth="1.5" strokeLinecap="round"></path>
          </svg>
        </button>

        <div className="lg:flex-1">
          <Link className="relative block w-33 h-13" href="/">
            <Image src={logoSrc} alt="Logo" fill sizes="100%" quality={100} priority className="object-contain" />
          </Link>
        </div>

        <ul className="items-center hidden lg:flex gap-x-6">
          {navHeader
            .filter((e) => e.path !== navHeader[4].path)
            .map((e, index) => (
              <li key={index} className="relative group h-fit">
                <Link className={`text-h6 ${pathname === e.path ? "text-primary" : `${isMainPath || activeHeader ? "text-white" : "text-black"} group-hover:text-primary`}`} href={e.path}>
                  {e.metaData.title}
                </Link>

                <div className={`w-0 transition-all h-0.5 bg-primary -bottom-2 left-1/2 -translate-x-1/2 absolute ${pathname === e.path ? "w-full" : "group-hover:w-full"}`}></div>
              </li>
            ))}
        </ul>

        <div className="flex items-center justify-end flex-1 gap-x-4">
          {isLogin ? (
            <Link aria-label="حساب کاربری" href={`/dashboard/${role !== "ADMIN" ? "user" : "admin"}`} className={`text-button-s flex justify-center items-center gap-x-1 ${isMainPath || activeHeader ? "text-white" : "text-black"} hover:text-primary max-2xl:hidden group`}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" width="24px" viewBox="0 -960 960 960" fill="currentcolor" className={`${isMainPath || activeHeader ? "text-white" : "text-black"} group-hover:text-primary`}>
                <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" />
              </svg>
              <p>حساب من</p>
            </Link>
          ) : (
            <Link aria-label="ورود | ثبت‌نام" href="/auth/owner" className={`text-button-s flex justify-center items-center gap-x-1 ${isMainPath || activeHeader ? "text-white" : "text-black"} hover:text-primary max-2xl:hidden group`}>
              <Login className={`size-8 ${isMainPath || activeHeader ? "stroke-white" : "stroke-black"} group-hover:stroke-primary block 2xl:hidden`} />
              <p>ورود | ثبت‌نام</p>
            </Link>
          )}

          {isLogin ? (
            <Button aria-label="حساب کاربری" variant="fill" width="w-12" height="h-12" href={`/dashboard/${role !== "ADMIN" ? "user" : "admin"}`} className="2xl:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" width="24px" viewBox="0 -960 960 960" fill="var(--color-white)">
                <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" />
              </svg>
            </Button>
          ) : (
            <Button aria-label="ورود | ثبت‌نام" variant="fill" width="w-12" height="h-12" href="/auth/owner" className="2xl:hidden">
              <Login className="block size-6 stroke-white 2xl:hidden" />
            </Button>
          )}

          {role !== "ADMIN" && (
            <Button aria-label={navHeader[4].metaData.title} variant="fill" width="w-fit" height="h-12" href={navHeader[4].path} className="max-xl:hidden">
              <Add className="size-6 stroke-white" />

              <p className="text-sm">{navHeader[4].metaData.title}</p>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
