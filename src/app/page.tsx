import connectToDB from "@/configs/connectToDB";
import HomeModel from "@/models/HomeModel";
import SectionBase from "@/components/common/SectionBase";
import HomeCard from "@/components/common/HomeCard";
import SectionMain from "@/components/home/SectionMain";
import Services from "@/components/home/Services";
import How from "@/components/home/How";
import Button from "@/components/common/Button";
import Image from "next/image";
import type { HomeType } from "@/types/types";
import { navHeader } from "@/utils/path";

export const revalidate = 3600;

const Home = async () => {
  await connectToDB();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const data = await HomeModel.find({ updatedAt: { $gte: oneWeekAgo }, status: "active" }, "-__v")
    .sort({ viewCount: -1 })
    .limit(8);
  const parsedData: HomeType[] = JSON.parse(JSON.stringify(data));

  const dataMap = [
    {
      img: "villa.webp",
      title: "ویلا",
      value: data.filter((e) => e.propertyType === "ویلا").length ?? 0,
    },
    {
      img: "apartment.webp",
      title: "آپارتمان",
      value: data.filter((e) => e.propertyType === "آپارتمان").length ?? 0,
    },
    {
      img: "house.webp",
      title: "خانه ویلایی",
      value: data.filter((e) => e.propertyType === "خانه ویلایی").length ?? 0,
    },
  ];

  return (
    <>
      <SectionMain dataMap={dataMap} />

      <SectionBase href={navHeader[0].path} title="پر بازدید ترین‌های هفته‌ی گذشته" element="h2" className="mt-20">
        <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(320px,auto))] justify-center min-[720px]:justify-between gap-10">
          {parsedData.map((e) => (
            <HomeCard key={String(e._id)} {...e} />
          ))}
        </div>
      </SectionBase>

      <Services />

      <How />

      <div className="w-full padding-body">
        <div className="flex flex-col items-center justify-between w-full px-6 py-6 xl:h-80 bg-g1 rounded-2xl xl:flex-row xl:px-14 xl:py-0">
          <div className="flex flex-col items-center flex-1 text-center xl:items-start xl:text-left">
            <h5 className="text-[clamp(16px,calc(2.5vw+10px),32px)] font-bold text-white">برای دریافت وام رهن خانه کلیک کنید</h5>

            <strong className="text-[clamp(12px,calc(1vw+5px),20px)] text-g7 mt-2">دریافت وام با کم‌ترین بهره و سریع ترین زمان ممکن</strong>

            <Button href="/" width="w-fit" height="h-12" variant="fill" className="mt-6 xl:mt-10">
              اطلاعات بیشتر...
            </Button>
          </div>

          <div className="w-[570px] h-full relative max-xl:hidden">
            <Image src="/images/idk.png" alt="دریافت وام با کم‌ترین بهره و سریع ترین زمان ممکن" fill sizes="100%" className="object-contain" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
