import SectionBase from "../common/SectionBase";
import Image from "next/image";
import Button from "../common/Button";
import { navHeader } from "@/utils/path";

const servicesArray = [
  {
    src: "1.webp",
    title: "مشاور املاک هستید؟",
    description: "رنتی فای باعث توسعه کسب و کار بیش از۱۵۰۰ مشاور املاک متخصص شده.شانش تون رو در پیوستن به این مجموعه و توسعه کسب و کارتون امتحان کنید.",
    btnLabel: "مشاهده خدمات",
    href: "/",
  },
  {
    src: "2.webp",
    title: "مالک هستید؟",
    description: "با چند کلیک ساده ، ملک تون رو به صورت رایگان در رنتی فای آگهی و در سریع ترین زمان ممکن در یک فضای امن معامله کنید. ",
    btnLabel: "ثبت رایگان آگهی",
    href: navHeader[4].path,
  },
  {
    src: "3.webp",
    title: "خانه مورد علاقه تان را اجاره کنید!",
    description: "با چند کلیک ساده ، ملک تون رو به صورت رایگان در رنتی فای آگهی و در سریع ترین زمان ممکن در یک فضای امن معامله کنید. ",
    btnLabel: "اجاره خانه",
    href: navHeader[0].path,
  },
];

const Services = () => {
  return (
    <SectionBase href={null} element="h3" title="با خدمات رنتی‌فای آشنا شوید">
      <div className="w-full flex flex-row justify-center min-[1178px]:justify-between items-center flex-wrap gap-10">
        {servicesArray.map((e, index) => (
          <div className={`${e.title === "مالک هستید؟" ? "w-98 h-[501px]" : "w-98 h-[501px] min-[1178px]:w-93 min-[1178px]:h-115.5"} p-4 flex relative flex-col items-center bg-white rounded-2xl`} key={index}>
            <div className="relative w-full h-50.5 rounded-lg overflow-hidden">
              <Image src={`/images/services/${e.src}`} alt={e.title} fill sizes="100%" className="object-cover" />
            </div>
            <strong className="mt-6 text-black text-h6">{e.title}</strong>
            <p className="mt-3 text-center text-g3 text-body-1xs">{e.description}</p>
            <Button href={e.href} variant="fill" width="w-full" height="h-12" className="mt-auto">
              {e.btnLabel}
            </Button>
          </div>
        ))}
      </div>
    </SectionBase>
  );
};

export default Services;
