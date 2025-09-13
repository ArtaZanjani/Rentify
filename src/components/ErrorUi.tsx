"use client";

import Image from "next/image";
import Button from "@/components/common/Button";
import { useRouter } from "next/navigation";

type BtnType = {
  onClick: () => void;
};

type PathType = {
  path: string;
  navigate?: "push" | "replace";
  scroll?: boolean;
};

type ErrorUiPropsType = {
  img?: { src: string; alt: string } | null;
  title: string;
  description: string;
  btn: { label: string; action?: PathType | BtnType };
  className?: string;
};

const ErrorUi = ({ img, title, description, btn, className }: ErrorUiPropsType) => {
  const router = useRouter();

  const handleClick = () => {
    if (btn.action) {
      if ("path" in btn.action) {
        const { path, navigate = "push", scroll = true } = btn.action;
        if (navigate === "replace") {
          router.replace(path, { scroll });
        } else {
          router.push(path, { scroll });
        }
      } else if ("onClick" in btn.action) {
        btn.action.onClick();
      }
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {img && (
        <div className="w-full h-[300px] sm:max-w-[651px] sm:h-[430px] relative pointer-events-none">
          <Image src={img.src} alt={img.alt} fill sizes="100%" className="object-contain" quality={100} priority />
        </div>
      )}

      <p className="mt-4 text-black text-h5">{title}</p>
      <p className="mt-1 text-center text-g5 text-body-1xs padding-body">{description}</p>

      <Button variant="fill" width="w-fit" height="h-12" onClick={handleClick} className="mt-4">
        {btn.label}
      </Button>
    </div>
  );
};

export default ErrorUi;
