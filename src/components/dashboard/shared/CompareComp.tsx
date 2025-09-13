"use client";

import { useCompare } from "@/context/CompareProvider";
import AnimateLayout from "@/components/AnimateLayout";
import { useEffect, useState, useMemo, useCallback } from "react";
import WishListComp from "./WishListComp";
import CardSlider from "@/components/CardSlider";
import ErrorUi from "@/components/ErrorUi";
import { Messages } from "@/utils/messages";
import useSWR from "swr";
import { swrConfig } from "@/configs/swrConfig";
import { HomeType } from "@/types/types";
import Spinner from "@/components/common/Spinner";
import { Add } from "iconsax-react";
import HomeCard from "@/components/common/HomeCard";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Equipment_Facilities, INFORMATION_OPTIONS } from "@/utils/Equipment_Facilities";
import Table from "./table";
import { path_user } from "@/utils/path";

const CompareComp = () => {
  const { selectedIds, isConfirm, searching, resetAll, toggleSearching } = useCompare();
  const [activeBtn, setActiveBtn] = useState<string[]>([]);
  const router = useRouter();

  const { data, isValidating, error, mutate } = useSWR<HomeType[]>(isConfirm ? `/api/home?ids=${selectedIds.join(",")}` : null, swrConfig.fetcher, swrConfig);

  const allButtons = useMemo(
    () => [
      ...INFORMATION_OPTIONS.map((option) => ({
        type: "information",
        key: option.key,
        label: option.label,
        unit: option.unit,
      })),
      ...Equipment_Facilities.map((amenity) => ({
        type: "amenity",
        key: amenity.enLabel,
        label: amenity.label,
        unit: "",
      })),
    ],
    []
  );

  const comparisonData = useMemo(() => {
    if (!data || !activeBtn.length) return [];

    return activeBtn.map((btn) => {
      const infoOption = INFORMATION_OPTIONS.find((item) => item.key === btn);
      if (infoOption) {
        const infoKey = infoOption.key as keyof HomeType["information"];
        return {
          title: infoOption.label,
          array: data.map((e) => e.information[infoKey]),
          unit: infoOption.unit,
        };
      }

      const amenity = Equipment_Facilities.find((item) => item.enLabel === btn);
      if (amenity) {
        const amenityKey = btn as keyof HomeType["amenities"];
        return {
          title: amenity.label,
          array: data.map((e) => (e.amenities[amenityKey] ? "✓" : "✗")),
          unit: "",
        };
      }

      return { title: btn, array: [], unit: "" };
    });
  }, [data, activeBtn]);

  const handleButtonToggle = useCallback((buttonKey: string) => {
    setActiveBtn((prev) => {
      const arr = prev ?? [];
      return arr.includes(buttonKey) ? arr.filter((item) => item !== buttonKey) : [...arr, buttonKey];
    });
  }, []);

  const handleReset = useCallback(() => {
    resetAll();
    router.push("/dashboard/user");
  }, [resetAll, router]);

  useEffect(() => {
    toggleSearching(!isConfirm);
  }, [selectedIds, isConfirm, toggleSearching]);

  if (error) {
    return (
      <ErrorUi
        className="m-auto"
        title={Messages.unknownError.title}
        description={Messages.unknownError.description}
        img={null}
        btn={{
          label: Messages.unknownError.btnLabel,
          action: { onClick: () => mutate() },
        }}
      />
    );
  }

  const renderSearchingState = () => (
    <>
      <p className="text-g5 text-caption-lg mt-1 max-[720px]:text-center">(حداقل ۲ کارت و حداکثر ۳ کارت را برای مقایسه انتخاب کنید)</p>
      <div className="min-[1128px]:bg-white min-[1128px]:p-6 mt-8 rounded-2xl">{data?.length ? data.map((e) => <HomeCard key={String(e._id)} border {...e} />) : <WishListComp />}</div>
    </>
  );

  const renderComparisonState = () => (
    <>
      <div className="flex flex-col w-full px-6 py-8 bg-white rounded-2xl gap-y-6">
        <h1 className="text-h3">{path_user[4].metaData.title}</h1>

        <div>
          <Swiper className="w-full" slidesPerView="auto" freeMode spaceBetween={12}>
            {allButtons.map((button, index) => (
              <SwiperSlide onClick={() => handleButtonToggle(button.key)} className={`!w-fit !flex items-center justify-center gap-x-2 cursor-pointer px-4 !h-10 rounded-[10px] border text-button-s ${activeBtn?.includes(button.key) ? "bg-tint-6 border-tint-6 text-primary" : "border-g9 text-g6"}`} key={`button-${index}`}>
                {button.label}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <button className="mt-10 mb-8 mr-auto rounded-full size-18 bg-g7" onClick={handleReset}>
        <Add className="rotate-45 size-full stroke-white" />
      </button>

      {isValidating ? <Spinner className="size-7 fill-primary" /> : <CardSlider isLoading={false} homes={data ?? []} />}

      <Table itemLength={comparisonData.length}>
        <thead className="border-b-2 border-g9">
          <tr>
            <th className="h-24 px-8">
              <p className="text-h5">فیلتر</p>
            </th>
            {Array.from({ length: selectedIds.length }, (_, index) => (
              <th className="h-24 px-8" key={index}>
                <p className="text-lg text-g2">خانه {index + 1}</p>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {comparisonData.map((row, index) => (
            <tr key={index} className="border-b border-g9 last:border-0">
              <td className="h-24 px-8 bg-white">
                <p className="text-h6">{row.title}</p>
              </td>
              {row.array?.map((value, idx) => (
                <td key={idx} className="h-24 px-8">
                  <p className="text-lg text-g2">
                    {value} {row.unit}
                  </p>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );

  return (
    <AnimateLayout className="overflow-x-hidden" heading={!isConfirm ? path_user[4].metaData.title : ""}>
      {!isConfirm && searching ? renderSearchingState() : renderComparisonState()}
    </AnimateLayout>
  );
};

export default CompareComp;
