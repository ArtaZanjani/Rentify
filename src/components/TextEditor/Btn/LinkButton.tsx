"use client";
import type { Editor } from "@tiptap/react";
import ToggleButton from "./ToggleButton";
import { useLinkPopover } from "@/components/tiptap-ui/link-popover";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { Trash, TickSquare } from "iconsax-react";
import { AnimatePresence, motion } from "motion/react";
import { springTransition } from "@/utils/Animations";

type LinkButtonType = {
  editor: Editor | null;
  openPopUp: boolean;
  setOpenPopUp: Dispatch<SetStateAction<boolean>>;
};

const LinkButton = ({ editor, openPopUp, setOpenPopUp }: LinkButtonType) => {
  const { isVisible, canSet, isActive, url, setUrl, setLink, removeLink, label, Icon } = useLinkPopover({
    editor,
    hideWhenUnavailable: true,
  });
  const popUpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popUpRef.current && !popUpRef.current.contains(event.target as Node)) {
        setOpenPopUp(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [setOpenPopUp]);

  return (
    <div className="relative" ref={popUpRef}>
      <ToggleButton editor={editor} isVisible={isVisible} isActive={isActive} canToggle={canSet} onToggle={() => setOpenPopUp((prev) => !prev)} label={label} Icon={Icon} />

      <AnimatePresence>
        {openPopUp && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} transition={{ ...springTransition, delay: 0 }} className="w-max h-12 z-10 right-0 top-10 rounded-xl bg-white border border-g9 shadow-2xl absolute flex items-center gap-x-2">
            <div className="h-full p-1">
              <input type="url" placeholder="لینک خود را وارد کنید" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full h-full border border-g9 rounded-md px-2 text-sm placeholder:text-right" />
            </div>

            <div className="flex items-center border-l border-g9 h-full pl-2 pr-1">
              <button
                type="button"
                className="hover:bg-states-success/20 p-1 rounded-md size-fit"
                onClick={() => {
                  setLink();
                  setOpenPopUp(false);
                }}
              >
                <TickSquare className="size-6 stroke-states-success" />
              </button>

              <button
                type="button"
                className="hover:bg-states-error/20 p-1 rounded-md size-fit"
                onClick={() => {
                  removeLink();
                  setOpenPopUp(false);
                }}
              >
                <Trash className="size-6 stroke-states-error" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LinkButton;
