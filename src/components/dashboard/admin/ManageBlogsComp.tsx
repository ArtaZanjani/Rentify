"use client";
import BlogCard from "@/components/common/BlogCard";
import LimitBtn from "@/components/common/LimitBtn";
import type { BlogType } from "@/types/types";
import { useActionState, useEffect, useState } from "react";
import Dialog from "@/components/common/Dialog";
import { Add } from "iconsax-react";
import { dialogVariants } from "@/utils/Animations";
import { motion } from "motion/react";
import Button from "@/components/common/Button";
import { removeBlog } from "@/actions/action_upload_blog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ManageBlogsComp = ({ parsedData, parsedLimit, totalBlogsCount }: { parsedData: BlogType[]; parsedLimit: number; totalBlogsCount: number }) => {
  const [id, setId] = useState<string | null>("");
  const find = parsedData.find((e) => e._id === id);
  const { refresh } = useRouter();

  const [stateCode, formActionCode] = useActionState(removeBlog, {
    message: "",
    error: false,
  });

  useEffect(() => {
    if (stateCode.message.trim().length) {
      if (stateCode.error) {
        toast.error(stateCode.message);
      } else {
        toast.success(stateCode.message);
        setId(null);
        refresh();
      }
    }
  }, [stateCode, refresh]);

  return (
    <>
      <div className="grid grid-cols-1 xs:grid-cols-[repeat(auto-fit,minmax(392px,auto))] justify-center min-[1208px]:justify-between md:justify-start gap-6">
        {parsedData.map((e) => (
          <BlogCard key={e._id} border adminPanel={{ status: true, onClick: setId }} {...e} />
        ))}
      </div>

      {parsedLimit < totalBlogsCount && <LimitBtn limit={parsedLimit} label="نمایش مقاله های بیشتر" />}

      <Dialog open={find !== undefined} close={() => setId(null)}>
        <motion.form action={formActionCode} variants={dialogVariants} initial="hidden" animate={find !== undefined ? "visible" : "hidden"} exit="exit" className="w-[95%] overflow-hidden sm:w-[600px] min-h-fit flex flex-col bg-white rounded-xl" onClick={(e) => e.stopPropagation()}>
          <div className="sticky top-0 z-10 flex items-center justify-between w-full p-6 pb-4 bg-white border-b">
            <p className="text-lg font-bold truncate w-[80%]">{find?.title}</p>
            <button type="button" onClick={() => setId(null)} className="rounded-full hover:bg-g8">
              <Add className="rotate-45 size-9 stroke-black" />
            </button>
          </div>

          <div className="w-full flex flex-col p-6">
            <p className="font-medium text-g1">آیا مطمئن هستید که می‌خواهید این مقاله را حذف کنید؟</p>

            <div className="mt-6 xl:mt-10 flex items-center gap-3 justify-end">
              <button onClick={() => setId(null)} type="button" className="duration-200 px-4 flex items-center justify-center gap-x-2 h-10 w-fit rounded-lg text-button-s border border-states-error text-states-error hover:bg-states-error hover:text-white">
                انصراف
              </button>
              <Button width="w-fit" height="h-10" variant="fill">
                تایید
              </Button>
            </div>
          </div>

          <input type="hidden" name="id" value={String(id)} />
        </motion.form>
      </Dialog>
    </>
  );
};

export default ManageBlogsComp;
