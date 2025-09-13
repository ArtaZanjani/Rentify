"use client";
import { JSX, useState, useEffect, useRef, useActionState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Add, User } from "iconsax-react";
import type { UserType } from "@/types/types";
import { logout } from "@/actions/auth";
import { AnimatePresence, motion } from "motion/react";
import { dialogVariants, springTransition } from "@/utils/Animations";
import { useCompare } from "@/context/CompareProvider";
import { navHeader } from "@/utils/path";
import Dialog from "../common/Dialog";
import Button from "../common/Button";
import { removeUser } from "@/actions/actions";
import { toast } from "sonner";
import { mongooseDuplicateError } from "@/utils/messages";
import type { Metadata } from "next";

type DashboardSideBarPropsType = {
  path: { icon: JSX.Element; pathname: string; metaData: Pick<Metadata, "title" | "description"> }[];
  userData: UserType | undefined;
};

const DashboardSideBar = ({ userData, path }: DashboardSideBarPropsType) => {
  const pathname = usePathname();
  const [imgError, setImgError] = useState<boolean>(false);
  const { isConfirm } = useCompare();

  const linkRefs = useRef<HTMLAnchorElement[]>([]);
  const [indicatorY, setIndicatorY] = useState<number>(0);
  const [indicatorHeight, setIndicatorHeight] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  useEffect(() => {
    const index = path.findIndex((p) => p.pathname === pathname);
    if (index !== -1 && linkRefs.current[index]) {
      const el = linkRefs.current[index];
      setIndicatorY(el.offsetTop);
      setIndicatorHeight(el.offsetHeight);
    }
  }, [pathname, path]);

  const actionButton = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor">
          <path d="M680-600h160q17 0 28.5 11.5T880-560q0 17-11.5 28.5T840-520H680q-17 0-28.5-11.5T640-560q0-17 11.5-28.5T680-600ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-240v-32q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v32q0 33-23.5 56.5T600-160H120q-33 0-56.5-23.5T40-240Zm80 0h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z" />
        </svg>
      ),
      label: "حذف حساب",
      action: () => setOpenDialog(true),
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentcolor">
          <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h240q17 0 28.5 11.5T480-800q0 17-11.5 28.5T440-760H200v560h240q17 0 28.5 11.5T480-160q0 17-11.5 28.5T440-120H200Zm487-320H400q-17 0-28.5-11.5T360-480q0-17 11.5-28.5T400-520h287l-75-75q-11-11-11-27t11-28q11-12 28-12.5t29 11.5l143 143q12 12 12 28t-12 28L669-309q-12 12-28.5 11.5T612-310q-11-12-10.5-28.5T613-366l74-74Z" />
        </svg>
      ),
      label: "خروج از حساب کاربری",
      action: () => logout(),
    },
  ];

  const [stateCode, formActionCode] = useActionState(removeUser, {
    message: "",
    error: false,
  });

  useEffect(() => {
    if (stateCode.message.trim().length) {
      if (stateCode.error) {
        toast.error(stateCode.message);
      } else {
        toast.success(stateCode.message);
      }
    }
  }, [stateCode]);

  const handleRemove = async () => {
    if (!userData?._id) {
      toast.error(mongooseDuplicateError.id);
      return;
    }

    const formData = new FormData();

    formData.append("id", userData?._id);

    await formActionCode(formData);
  };

  if ((pathname === "/dashboard/user/compare" && isConfirm) || pathname === navHeader[4].path || pathname === "/dashboard/admin/add-blog") {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={springTransition} className="w-full md:w-[288px] min-h-[362px] relative">
          <div className="flex items-center mr-2 gap-x-2">
            <div className="relative flex items-center justify-center overflow-hidden rounded-full size-16 bg-g9">
              {!userData?.logo || imgError ? (
                <div>
                  <User className="size-8 stroke-g7" />
                </div>
              ) : (
                <Image onError={() => setImgError(true)} src={userData?.logo} alt="پروفایل" className="object-cover" fill sizes="100%" />
              )}
            </div>
            <div className="space-y-1">
              <p className="text-body-1xs">{userData?.role === "OFFICE" ? `املاک ${userData?.office_name}` : `${userData?.name} ${userData?.last_name}`}</p>
              <p className="text-body-xxs text-g2">{userData?.phone_number}</p>
            </div>
          </div>

          <div className="relative mt-8 space-y-2">
            <motion.div className="absolute right-0 w-1 h-5 rounded-l-full pointer-events-none bg-primary" animate={{ top: indicatorY + indicatorHeight / 2 - 10 }} transition={springTransition} />

            {path.map((e, index) => (
              <Link
                href={e.pathname}
                key={index}
                ref={(el) => {
                  if (el) linkRefs.current[index] = el;
                }}
                className={`flex items-center h-12.5 rounded-lg cursor-pointer duration-200 ${pathname === e.pathname ? "bg-white shadow-[0px_2px_4px_0px_rgba(0,_0,_0,_0.1)]" : "hover:bg-white hover:shadow-[0px_2px_4px_0px_rgba(0,_0,_0,_0.1)] group"}`}
              >
                <span className={`mr-5.5 duration-500 ${pathname === e.pathname ? "text-primary" : "text-g2"}`}>{e.icon}</span>
                <p className="mr-4 text-black">{String(e.metaData.title)}</p>
              </Link>
            ))}

            {actionButton
              .filter((e) => e.label !== "حذف حساب" || userData?.role !== "ADMIN")
              .map((e, index) => (
                <button onClick={e.action} key={index} className="flex items-center h-12.5 rounded-lg duration-200 hover:bg-white hover:shadow-[0px_2px_4px_0px_rgba(0,_0,_0,_0.1)] group w-full mt-4">
                  <span className="mr-5.5 text-states-error1">{e.icon}</span>
                  <span className="mr-4 text-states-error1">{e.label}</span>
                </button>
              ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <Dialog open={openDialog} close={() => setOpenDialog(false)}>
        <motion.form action={handleRemove} variants={dialogVariants} initial="hidden" animate={openDialog ? "visible" : "hidden"} exit="exit" className="w-[95%] overflow-hidden sm:w-[600px] min-h-fit flex flex-col bg-white rounded-xl" onClick={(e) => e.stopPropagation()}>
          <div className="sticky top-0 z-10 flex items-center justify-between w-full p-6 pb-4 bg-white border-b">
            <p className="text-lg font-bold truncate w-[80%]">حذف حساب</p>
            <button type="button" onClick={() => setOpenDialog(false)} className="rounded-full hover:bg-g8">
              <Add className="rotate-45 size-9 stroke-black" />
            </button>
          </div>

          <div className="w-full flex flex-col p-6">
            <p className="font-medium text-g1">آیا مطمئن هستید که می‌خواهید حساب خود را حذف کنید؟</p>

            <div className="mt-6 xl:mt-10 flex items-center gap-3 justify-end">
              <button onClick={() => setOpenDialog(false)} type="button" className="duration-200 px-4 flex items-center justify-center gap-x-2 h-10 w-fit rounded-lg text-button-s border border-states-error text-states-error hover:bg-states-error hover:text-white">
                انصراف
              </button>
              <Button width="w-fit" height="h-10" variant="fill">
                تایید
              </Button>
            </div>
          </div>
        </motion.form>
      </Dialog>
    </>
  );
};

export default DashboardSideBar;
