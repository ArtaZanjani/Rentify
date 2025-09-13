import { Transition } from "motion/react";

export const springTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  delay: 0.1,
  ease: [0.5, 0.2, 0.9, 0.4],
};

export const dialogVariants = {
  hidden: { scale: 3, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: springTransition,
  },
  exit: { scale: 1, opacity: 0, transition: { ...springTransition, delay: 0 } },
};
