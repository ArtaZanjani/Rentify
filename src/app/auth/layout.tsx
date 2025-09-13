import Image from "next/image";
import Link from "next/link";
import { Add } from "iconsax-react";
import type { Metadata } from "next";
import { authenticate } from "@/utils/auth/authenticate";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "رنتیفای - ورود | ثبت نام",
};

type LayoutPropsType = {
  children: React.ReactNode;
};

const Layout = async ({ children }: LayoutPropsType) => {
  const result = await authenticate();

  if (result.isLogin) {
    redirect(`/dashboard/${result.user?.role !== "ADMIN" ? "user" : "admin"}`);
  }

  return (
    <>
      <div className="flex flex-row-reverse items-center justify-center w-screen h-screen p-0 xl:justify-between bg-tint-5 xs:p-4">
        <div className="items-center justify-center flex-1 hidden h-full xl:flex">
          <div className="relative w-[636px] h-[392px]">
            <Image src="/images/illustrations/Auth.png" alt="ورود | ثبت نام" fill sizes="100%" priority quality={100} />
          </div>
        </div>

        <div className="w-full min-[588px]:w-[588px] h-full bg-white xs:rounded-2xl overflow-y-auto pb-2 flex flex-col justify-center items-center relative">
          <Link href="/" className="absolute rounded-full top-5 right-5 hover:bg-g9" aria-label="خانه">
            <Add className="rotate-45 size-8 stroke-g1" />
            <span className="sr-only">خانه</span>
          </Link>

          <div className="flex flex-col items-center w-full px-3 xs:w-98">
            <Link href="/" className="relative h-20 w-51">
              <Image src="/images/Logo.webp" alt="لوگو" fill sizes="100%" priority quality={100} className="object-contain" />
            </Link>

            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
