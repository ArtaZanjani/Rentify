"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useEffect, useRef, useState } from "react";

type Tab = {
  label: string;
  value: string;
};

type UnderlineTabsProps = {
  className?: string;
  tabs: Tab[];
  paramsValue: string;
};

const UnderlineTabs = ({ className, tabs, paramsValue, ...rest }: UnderlineTabsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const currentFilter = searchParams.get(paramsValue);
  const [underlineStyle, setUnderlineStyle] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });

  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const activeButton = containerRef.current.querySelector<HTMLButtonElement>(`button[data-value="${currentFilter || tabs[0]?.value}"]`);

    if (activeButton) {
      setUnderlineStyle({
        left: activeButton.offsetLeft,
        width: activeButton.offsetWidth,
      });
    }
  }, [currentFilter, tabs]);

  const handleChange = (value: string) => {
    if (isTransitioning || value === currentFilter) return;

    setIsTransitioning(true);

    const params = new URLSearchParams(searchParams.toString());
    params.set(paramsValue, value);

    startTransition(() => {
      replace(`?${params.toString()}`, { scroll: false });

      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    });
  };

  return (
    <div ref={containerRef} className={`flex items-center gap-x-6 border-b border-g9 w-fit relative max-[720px]:mx-auto ${className} ${isTransitioning ? "opacity-80" : ""}`} {...rest}>
      {tabs.map((tab, index) => (
        <button key={index} data-value={tab.value} className={`${tab.value === currentFilter ? "text-primary" : "text-g6"} pb-2 transition-colors duration-200 hover:text-primary/70 disabled:opacity-50 disabled:cursor-not-allowed`} onClick={() => handleChange(tab.value)} disabled={isTransitioning}>
          {tab.label}
        </button>
      ))}

      <span
        className="absolute bottom-0 h-[3px] bg-primary rounded-t-sm transition-all duration-300 ease-in-out"
        style={{
          left: underlineStyle.left,
          width: underlineStyle.width,
        }}
      />
    </div>
  );
};

export default UnderlineTabs;
