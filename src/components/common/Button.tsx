import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type CommonProps = {
  variant: "fill" | "outline" | "normal";
  width: "w-8" | "w-10" | "w-12" | "w-14" | "w-fit" | "w-full";
  height: "h-8" | "h-10" | "h-12" | "h-14" | "h-fit" | "h-full";
  roundedFull?: boolean;
  className?: string;
  disabled?: boolean;
  children: ReactNode;
};

type ButtonProps = CommonProps & {
  href?: undefined;
} & ButtonHTMLAttributes<HTMLButtonElement>;

type LinkProps = CommonProps & {
  href: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

type ButtonPropsType = ButtonProps | LinkProps;

const Button = ({ variant, width, height, roundedFull, href, className, disabled, children, ...rest }: ButtonPropsType) => {
  const paddingMap = {
    "h-8": `${roundedFull ? "rounded-full" : "rounded-sm"} text-button-s`,
    "h-10": `${roundedFull ? "rounded-full" : "rounded-lg"} text-button-s`,
    "h-12": `${roundedFull ? "rounded-full" : "rounded-xl"} text-button-s`,
    "h-14": `${roundedFull ? "rounded-full" : "rounded-2xl"} text-button-MD`,
    "h-fit": "",
    "h-full": "",
  };

  const StyleMap = {
    fill: `${disabled ? "bg-g10 text-g6" : "bg-primary hover:bg-shade-1 active:bg-shade-2 text-white"}`,
    outline: `border ${disabled ? "border-g9 text-g6" : "border-primary hover:border-shade-1 active:border-shade-2 text-primary hover:text-shade-1 active:text-shade-2"}`,
    normal: `${disabled ? "text-g6" : "hover:bg-tint-6 active:bg-tint-5 text-primary"}`,
  };

  const commonClasses = `duration-200 ${width === "w-fit" ? "px-4" : ""} flex items-center justify-center gap-x-2 ${height} ${width} ${paddingMap[height]} ${StyleMap[variant]} ${disabled ? "cursor-not-allowed" : ""} ${className}`;

  return (
    <>
      {href?.length ? (
        <Link href={href} className={commonClasses} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
          {children}
        </Link>
      ) : (
        <button className={commonClasses} disabled={disabled} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
          {children}
        </button>
      )}
    </>
  );
};

export default Button;
