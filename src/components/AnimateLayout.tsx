"use client";
import { AnimatePresence, motion } from "motion/react";
import { springTransition } from "@/utils/Animations";

type AnimateLayoutPropsType = {
  heading?: string;
  className?: string;
  children: React.ReactNode;
};

const AnimateLayout = ({ heading, className, children }: AnimateLayoutPropsType) => {
  return (
    <AnimatePresence>
      <motion.div className={`flex-1 ${className}`} initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }} transition={springTransition}>
        {heading?.length ? <h1 className="text-h4 max-[720px]:text-center">{heading}</h1> : null}

        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimateLayout;
