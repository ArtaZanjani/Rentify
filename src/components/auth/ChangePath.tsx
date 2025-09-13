"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const option = [
  {
    label: "مالک | مستاجر",
    path: "/auth/owner",
  },
  {
    label: "آژانس املاک",
    path: "/auth/agency",
  },
];

const ChangePath = () => {
  const pathname = usePathname();

  return (
    <div className="w-full bg-g10 rounded-2xl h-12 mt-12.5 flex items-center relative overflow-hidden p-1 gap-x-2">
      {option.map((e, index) => (
        <Link className={`flex-1 h-full flex justify-center items-center z-10 duration-200 rounded-xl ${pathname === e.path ? "bg-white" : "hover:bg-g9"}`} href={e.path} key={index}>
          {e.label}
        </Link>
      ))}
    </div>
  );
};

export default ChangePath;
