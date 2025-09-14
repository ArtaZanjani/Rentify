"use client";
import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import { Image as ImageIcon } from "iconsax-react";
import { KeyboardBackspace } from "../Icons/Icons";
import Image from "next/image";

type SliderPropsType = { isLoading: true; media?: never } | { isLoading: false; media: string[] };

const Slider = ({ isLoading, media }: SliderPropsType) => {
  const swiperRef = useRef<SwiperClass | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const totalSlides = 5;
  type Slide = { type: "media"; src: string; key: number } | { type: "placeholder"; key: number };

  const slides: Slide[] = isLoading
    ? Array.from({ length: totalSlides }).map((_, index) => ({ type: "placeholder", key: index }))
    : [
        ...media.map((src, index) => (src ? { type: "media" as const, src, key: index } : { type: "placeholder" as const, key: index })),

        ...Array.from({ length: totalSlides - media.length }).map((_, index) => ({
          type: "placeholder" as const,
          key: media.length + index,
        })),
      ];
  return (
    <div id="SliderSpaceBetween" className={`w-full relative`}>
      <Swiper
        slidesPerView="auto"
        className="w-full h-[403px] rounded-xl"
        spaceBetween={8}
        loop={false}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={() => {
          if (!swiperRef.current) return;
          setIsBeginning(swiperRef.current.isBeginning);
          setIsEnd(swiperRef.current.isEnd);
        }}
      >
        {isLoading
          ? Array.from({ length: 5 }).map((_, index, arr) => (
              <SwiperSlide key={index} className={`h-full max-[450px]:!w-full !w-[402px] bg-g9 ${index === arr.length - 1 ? "!ml-0" : ""}`}>
                <div className="flex items-center justify-center w-full h-full">
                  <ImageIcon className="size-15 stroke-g8" />
                </div>
              </SwiperSlide>
            ))
          : slides.map((e, index) => (
              <SwiperSlide key={e.key} className={`h-full max-[450px]:!w-full !w-[402px] bg-g9 relative ${index === slides.length - 1 ? "!ml-0" : ""}`}>
                {e.type === "media" ? (
                  <Image src={`/api/image-proxy?url=${e.src}`} alt={`slide-${index}`} fill sizes="100%" className="object-cover" priority />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <ImageIcon className="size-15 stroke-g8" />
                  </div>
                )}
              </SwiperSlide>
            ))}
      </Swiper>

      <div className="absolute z-10 flex items-center justify-between w-full px-4 -translate-y-1/2 opacity-50 pointer-events-none top-1/2">
        {[
          { direction: "قبلی", isDisabled: isBeginning, rotate: true },
          { direction: "بعدی", isDisabled: isEnd, rotate: false },
        ].map((btn, index) => (
          <button aria-label={btn.direction} key={index} className={`w-12 h-12 rounded-full flex justify-center items-center pointer-events-auto bg-black/80 ${btn.isDisabled ? "opacity-50 cursor-not-allowed" : ""}`} onClick={() => swiperRef.current && !btn.isDisabled && (btn.direction === "قبلی" ? swiperRef.current.slidePrev() : swiperRef.current.slideNext())} disabled={btn.isDisabled}>
            <KeyboardBackspace className={btn.rotate ? "rotate-180" : ""} width="24px" height="24px" fill="var(--color-white)" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Slider;
