"use client";
import { FC, SVGProps, useEffect, useRef, useState } from "react";
import { Add } from "iconsax-react";
import { isPersian } from "@/utils/validation";
import { AnimatePresence, motion } from "motion/react";
import { springTransition } from "@/utils/Animations";
import type { DropDownItem } from "@/types/types";

type InputPropsType = {
  label: string;
  value: string;
  Icon: FC<SVGProps<SVGSVGElement>>;
  name: string;
  id: string;
  error: string;
  inputClassName?: string;
  divClassName?: string;
  DropDown?: DropDownItem[];
  labelBgColor?: "bg-white" | "bg-gray";
  ResetValue: () => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = ({ label, value, Icon, name, id, error, inputClassName, divClassName, DropDown, labelBgColor = "bg-white", ResetValue, ...rest }: InputPropsType) => {
  const [activeFocus, setActiveFocus] = useState<boolean>(false);

  const Active = activeFocus || value.length > 0;
  const icon_empty = `${value.length && `${error.length ? "!stroke-states-error1" : "!stroke-primary"}`} ${Active ? `stroke-g1` : `${!value.length && !error.length && "stroke-g8 group-hover:stroke-g1"}`}`;

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setActiveFocus(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={`flex flex-col gap-y-2 relative ${divClassName}`}>
      <div className={`w-full relative group`}>
        <Icon className={`size-6 duration-200 ${icon_empty} pointer-events-none absolute top-1/2 -translate-y-1/2 right-2`} />
        <label htmlFor={id} className={`absolute -translate-y-1/2 pointer-events-none duration-200 ${labelBgColor} px-2 ${value.length ? `${error.length ? "!text-states-error1" : "!text-primary"}` : "text-g4"} ${Active ? "top-0 right-4 scale-90" : `top-1/2 right-9`}`}>
          {label}
        </label>
        <input dir={!value.length ? "rtl" : isPersian(value) ? "rtl" : "ltr"} className={`${inputClassName?.toString().length ? inputClassName : "w-64 h-12"} duration-200 border rounded-2xl px-9 text-sm pt-1 font-medium ${value.length ? `${error.length ? "text-states-error1 !border-states-error1" : "text-primary !border-primary"}` : ""} ${Active ? `border-g1` : `${!value.length && "border-g8 group-hover:border-g1"}`}`} id={id} name={name} {...rest} value={value} onFocus={() => setActiveFocus(true)} />

        <div
          className="absolute -translate-y-1/2 cursor-pointer top-1/2 left-2"
          onClick={() => {
            ResetValue();
            setActiveFocus(false);
          }}
        >
          <Add className={`size-7 duration-200 ${icon_empty} rotate-45`} />
        </div>
      </div>

      {!DropDown && error.length > 0 && <p className="text-sm text-states-error1">{error}</p>}

      <AnimatePresence>
        {DropDown && activeFocus ? (
          <motion.div className="absolute top-0 right-0 z-20 flex flex-col w-full overflow-hidden overflow-x-hidden overflow-y-auto bg-white border shadow-2xl min-h-12 max-h-60 border-g8 rounded-2xl" initial={{ y: 200, opacity: 0 }} animate={{ y: 55, opacity: 1 }} exit={{ y: 200, opacity: 0 }} transition={{ ...springTransition, delay: 0 }}>
            {DropDown.length ? (
              DropDown.map((item, index) => (
                <button
                  type="button"
                  key={index}
                  className={`w-full text-start hover:bg-primary hover:text-white p-3 ${index !== DropDown.length - 1 && "border-b border-g8"}`}
                  onClick={() => {
                    item.onClick();
                    setActiveFocus(false);
                  }}
                >
                  {item.label}
                </button>
              ))
            ) : (
              <p className="p-3 text-sm translate-y-px text-g5">{error}</p>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default Input;
