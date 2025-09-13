"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import HomeCard from "@/components/common/HomeCard";
import type { HomeType } from "@/types/types";
import { useMediaQuery } from "usehooks-ts";
import HomeCardSkeleton from "./skeleton/HomeCardSkeleton";

type homesPropsType = { isLoading: true; homes: number[] } | { isLoading: false; homes: HomeType[] };

const CardSlider = ({ homes, isLoading }: homesPropsType) => {
  const matches = useMediaQuery("(min-width: 420px)");
  return (
    <div id="SliderSpaceBetween" className="w-full">
      <Swiper className="w-full !justify-between !p-0" slidesPerView="auto" spaceBetween={matches ? 28 : 5}>
        {isLoading
          ? homes.map((e) => (
              <SwiperSlide className={`!w-fit ${e === homes.length - 1 ? "!ml-0" : ""}`} key={e}>
                <HomeCardSkeleton />
              </SwiperSlide>
            ))
          : homes.map((e: HomeType, index: number) => (
              <SwiperSlide className={`!w-fit ${index === homes.length - 1 ? "!ml-0" : ""}`} key={index}>
                <HomeCard {...e} />
              </SwiperSlide>
            ))}
      </Swiper>
    </div>
  );
};

export default CardSlider;
