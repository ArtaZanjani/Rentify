"use client";
import { useState } from "react";
import Dialog from "./common/Dialog";
import { dialogVariants } from "@/utils/Animations";
import { motion } from "motion/react";
import { Add } from "iconsax-react";
import Button from "./common/Button";

const Alert = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(true);
  return (
    <Dialog open={openDialog} close={() => null}>
      <motion.div variants={dialogVariants} initial="hidden" animate={openDialog ? "visible" : "hidden"} exit="exit" className="w-[95%] overflow-hidden sm:w-[600px] min-h-fit flex flex-col bg-white rounded-xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-center justify-between w-full p-6 pb-4 bg-white border-b">
          <p className="text-lg font-bold truncate w-[80%]">هشدار</p>
          <button type="button" onClick={() => setOpenDialog(false)} className="rounded-full hover:bg-g8">
            <Add className="rotate-45 size-9 stroke-black" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-gray-700">
          <p className="text-sm">
            این <span className="font-bold">نمونه کار</span> به منظور نمایش <span className="font-bold">طراحی و عملکرد واقعی اپلیکیشن</span> ساخته شده است. شما می‌توانید برخی قابلیت‌ها مانند <span className="font-bold">ورود با شماره تلفن</span>، <span className="font-bold">رزرو</span> و <span className="font-bold">مشاهده اطلاعات</span> را تجربه کنید.
          </p>
          <p className="text-sm">
            با این حال، لطفاً توجه داشته باشید که این پروژه صرفاً <span className="font-bold">نمونه‌ای برای ارائه مهارت‌ها</span> و قابلیت‌های طراحی و توسعه است و به عنوان یک <span className="font-bold">محصول رسمی</span> عرضه نشده است.
          </p>
          <p className="text-sm">
            هدف این نمونه کار این است که <span className="font-bold">عملکرد واقعی سیستم</span> و <span className="font-bold">رابط کاربری حرفه‌ای</span> را نشان دهد، بدون اینکه داده‌های حساس یا اطلاعات کاربران واقعی مورد استفاده قرار گیرد.
          </p>
          <p className="text-sm">
            تجربه این اپلیکیشن به شما کمک می‌کند تا با <span className="font-bold">قابلیت‌های آن</span> آشنا شوید و <span className="font-bold">نحوه تعامل با سیستم</span> را مشاهده کنید.
          </p>
        </div>

        <div className="p-2">
          <Button onClick={() => setOpenDialog(false)} width="w-full" height="h-12" variant="fill">
            متوجه شدم
          </Button>
        </div>
      </motion.div>
    </Dialog>
  );
};

export default Alert;
