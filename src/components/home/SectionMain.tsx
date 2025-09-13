"use client";
import Image from "next/image";
import Button from "../common/Button";
import { KeyboardBackspace } from "@/components/Icons/Icons";
import { useMediaQuery } from "usehooks-ts";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { springTransition } from "@/utils/Animations";
import { navHeader } from "@/utils/path";

type SectionMainPropsType = {
  dataMap: { img: string; title: string; value: number }[];
};

const SectionMain = ({ dataMap }: SectionMainPropsType) => {
  const isDesktop: boolean = useMediaQuery("(min-width: 1280px)");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const HomeLength = () => {
    return (
      <div className={`w-full z-10 ${isDesktop && mounted ? "absolute top-[370px] left-1/2 -translate-x-1/2" : "flex-wrap"} flex gap-10 justify-center xl:justify-between items-center padding-body`}>
        {dataMap.map((e, index) => (
          <motion.div initial={{ opacity: 0, y: 100 }} animate={mounted ? { opacity: 1, y: 0 } : {}} exit={{ opacity: 0, y: 100 }} transition={{ ...springTransition, delay: mounted ? 0.3 : 0 }} className="relative flex items-end p-2 overflow-hidden w-98 h-72 rounded-2xl" key={index}>
            <Image src={`/images/category/${e.img}`} alt={e.title} fill sizes="100%" priority loading="eager" className="absolute inset-0 object-cover h-full -z-10" />

            <div className="z-10 flex items-center justify-between w-full h-20 px-4 bg-white rounded-lg">
              <div className="flex flex-col">
                <p className="text-black text-h6">{e.title}</p>
                <p className="text-body-1xs text-g3">{e.value} ملک</p>
              </div>

              <Button aria-label={`مشاهده بیشتر ${e.title}`} width="w-12" height="h-12" roundedFull href={`${navHeader[0].path}?house=${e.title}`} variant="fill">
                <KeyboardBackspace fill="var(--color-white)" width="24px" height="24px" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <AnimatePresence>
      <div className="w-full aspect-video max-h-96 xl:max-h-[576px] relative">
        <Image src="/images/RentifyHomeSection.png" alt="RentifyHomeSection" fill priority quality={100} sizes="100%" className="object-cover -z-10" />

        <motion.h1 key="motion_h1" initial={{ width: 0 }} animate={{ width: "fit-content" }} exit={{ width: 0 }} transition={springTransition} className="text-white overflow-hidden text-nowrap font-bold text-2xl xs:text-3xl sm:text-[40px] leading-[140%] text-center absolute z-20 -translate-x-1/2 top-[55%] xl:top-52 left-1/2 w-full">
          در <span className="text-primary font-bold text-2xl xs:text-3xl sm:text-[40px] leading-[140%]">رنتی‌فای</span> دنبال چه ملکی هستید؟
        </motion.h1>

        {isDesktop && mounted && <HomeLength key="HomeLength_Desktop" />}
      </div>

      {(!isDesktop || !mounted) && <HomeLength key="HomeLength_Mobile" />}
    </AnimatePresence>
  );
};

export default SectionMain;
