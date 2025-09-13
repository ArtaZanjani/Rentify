import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

type DialogPropsType = {
  open: boolean;
  close: () => void;
  children: React.ReactNode;
};

const Dialog = ({ open, close, children }: DialogPropsType) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.touchAction = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.touchAction = "auto";
    };
  }, [open]);

  const overlayVariants = {
    hidden: { opacity: 0, pointerEvents: "none" },
    visible: { opacity: 1, pointerEvents: "auto" },
    exit: { opacity: 0, pointerEvents: "none" },
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div variants={overlayVariants} initial="hidden" animate="visible" exit="exit" onClick={close} className="w-full h-full fixed z-[999] top-0 left-0 bg-black/50 flex justify-center items-center">
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Dialog;
