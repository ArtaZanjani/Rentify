import Link from "next/link";
import { createElement } from "react";
import { KeyboardBackspace } from "@/components/Icons/Icons";

type SectionBasePropsType = {
  title: string;
  href: string | null;
  className?: string;
  element: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children: React.ReactNode;
};

const SectionBase = ({ title, href, className, element, children }: SectionBasePropsType) => {
  const renderTitle = () => {
    const parts = title.split("رنتی‌فای");
    return createElement(
      element,
      { className: "font-bold text-2xl min-[1000px]:text-4xl" },
      parts.length > 1 ? (
        <>
          {parts[0]}
          <span className="text-primary">رنتی‌فای</span>
          {parts[1]}
        </>
      ) : (
        title
      )
    );
  };

  return (
    <div className={`flex flex-col gap-y-10 w-full padding-body ${className ?? ""}`}>
      <div className={`w-full flex max-[651px]:flex-col gap-y-3 ${href ? "justify-between" : "justify-center"} items-center`}>
        {renderTitle()}

        {href !== null && (
          <Link href={href} className="text-shade-1 flex items-center gap-x-2.5 font-medium">
            مشاهده همه
            <KeyboardBackspace fill="var(--color-shade-1)" width="24px" height="24px" />
          </Link>
        )}
      </div>

      {children}
    </div>
  );
};

export default SectionBase;
