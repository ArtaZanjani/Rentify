"use client";
import { useCompare } from "@/context/CompareProvider";
import { AnimatePresence, motion } from "motion/react";
import { springTransition } from "@/utils/Animations";
import { usePathname, useRouter } from "next/navigation";
import Button from "./common/Button";
import { SearchNormal1, Add } from "iconsax-react";
import { navHeader } from "@/utils/path";

const CompareSearch = () => {
  const { searching, isConfirm, selectedIds, toggleSearching, toggleConfirm, resetAll } = useCompare();
  const pathname = usePathname();

  const pathnameArray = [navHeader[0].path, "/dashboard/user/wishlist", "/dashboard/user/my-ads"];
  const isValidPath = pathnameArray.some((p) => pathname.startsWith(p));
  const alwaysShow = pathname.startsWith("/dashboard/user/compare") && !isConfirm;
  const router = useRouter();

  return (
    <AnimatePresence>
      {(searching && isValidPath) || alwaysShow ? (
        <>
          <motion.div initial={{ y: 200 }} animate={{ y: 0 }} exit={{ y: 200 }} transition={springTransition} className="fixed h-24 bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent z-[200]" />
          <motion.div initial={{ y: 200 }} animate={{ y: 0 }} exit={{ y: 200 }} transition={springTransition} className="fixed min-h-19.5 bottom-0 left-0 w-full bg-white z-[200] flex items-center justify-center gap-x-1">
            <button
              onClick={() => {
                resetAll();
                if (alwaysShow) {
                  router.push("/dashboard/user");
                }
              }}
              className="absolute -top-8.5 border-b-0 left-8 bg-white border rounded-t-xl"
            >
              <Add className="rotate-45 size-8 stroke-black" />
            </button>

            <Button width="w-fit" height="h-12" variant="normal" href={`${pathname.startsWith(pathnameArray[0]) ? "/dashboard/user/wishlist" : pathnameArray[0]}`} onClick={() => toggleSearching(true)}>
              {pathname.startsWith(pathnameArray[0]) ? (
                "بازگشت به آگهی‌های ذخیره شده"
              ) : (
                <>
                  <SearchNormal1 className="size-6 stroke-primary" />
                  جستجو
                </>
              )}
            </Button>

            <div className={`${pathname.startsWith(pathnameArray[0]) ? "w-73" : "w-39"}`}>
              <Button
                width="w-full"
                height="h-12"
                variant="fill"
                disabled={selectedIds.length < 2}
                href="/dashboard/user/compare"
                onClick={() => {
                  toggleSearching(false);
                  toggleConfirm(true);
                }}
              >
                تأیید
              </Button>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
};

export default CompareSearch;
