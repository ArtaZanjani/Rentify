"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Location, Heart } from "iconsax-react";
import type { HomeType } from "@/types/types";
import { useWishlist } from "@/context/WishlistProvider";
import { useCompare } from "@/context/CompareProvider";

interface HomeCardPropsType extends HomeType {
  statusUi?: boolean;
  border?: boolean;
}

const HomeCard = ({ _id, propertyType, city, neighborhood, deposit, rent, images, information, status, statusUi = false, border = false }: HomeCardPropsType) => {
  const [imgError, setImgError] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const { area, bedroom } = information;
  const { wishlist, toggleWishlist } = useWishlist();
  const { selectedIds, searching, toggleId } = useCompare();
  useEffect(() => {
    setMounted(true);
  }, []);

  const dataShow = [
    {
      label: "رهن",
      value: deposit.toLocaleString(),
    },
    {
      label: "اجاره",
      value: rent.toLocaleString(),
    },
  ];

  const statusObject = {
    active: {
      label: "تا‌ٔیید شده",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="currentcolor">
          <path d="m382-354 339-339q12-12 28-12t28 12q12 12 12 28.5T777-636L410-268q-12 12-28 12t-28-12L182-440q-12-12-11.5-28.5T183-497q12-12 28.5-12t28.5 12l142 143Z" />
        </svg>
      ),
      className: "text-states-success",
    },
    pending: {
      label: "در انتظار تأیید",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="currentcolor">
          <path d="M109-120q-11 0-20-5.5T75-140q-5-9-5.5-19.5T75-180l370-640q6-10 15.5-15t19.5-5q10 0 19.5 5t15.5 15l370 640q6 10 5.5 20.5T885-140q-5 9-14 14.5t-20 5.5H109Zm69-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm0-120q17 0 28.5-11.5T520-400v-120q0-17-11.5-28.5T480-560q-17 0-28.5 11.5T440-520v120q0 17 11.5 28.5T480-360Zm0-100Z" />
        </svg>
      ),
      className: "text-states-warning1",
    },
    rejected: {
      label: "رد شده",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="currentcolor">
          <path d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z" />
        </svg>
      ),
      className: "text-states-error1",
    },
  };

  return (
    <div className="relative w-80 h-89">
      <Link href={`/property-detail/${String(_id)}`} className={`block rounded-2xl overflow-hidden w-full h-full bg-white ${selectedIds.includes(String(_id)) && searching ? "border-3 border-primary" : border && "border border-g9"}`}>
        <div className={`relative ${imgError || !images?.length ? "bg-g9 flex justify-center items-center" : ""} h-54`}>
          {imgError || !images?.length ? (
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="size-24" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--color-g7)">
                <path d="M880-680v400q0 20-12.5 30T840-240q-15 0-27.5-10.5T800-281v-399H673q-17 0-32.5-6.5T614-706l-49-54H395l-10 11q-11 13-28.5 13T327-748q-11-11-11.5-27t10.5-28l10-11q11-12 26.5-19t32.5-7h170q17 0 32.5 7t26.5 19l50 54h126q33 0 56.5 23.5T880-680ZM160-120q-33 0-56.5-23.5T80-200v-480q0-33 23.5-56.5T160-760h41l80 80H160v480h601l80 80H160Zm466-215q-25 34-62.5 54.5T480-260q-75 0-127.5-52.5T300-440q0-46 20.5-83.5T375-586l58 58q-24 13-38.5 36T380-440q0 42 29 71t71 29q29 0 52-14.5t36-38.5l58 58Zm-18-233q25 24 38.5 57t13.5 71v12q0 6-1 12L456-619q6-1 12-1h12q38 0 71 13.5t57 38.5ZM791-57 55-792q-12-12-12-28.5T55-849q12-12 28.5-12t28.5 12l736 736q12 12 12 28t-12 28q-12 12-28.5 12T791-57ZM407-440Zm171-57Z" />
              </svg>
            </div>
          ) : (
            <Image onError={() => setImgError(true)} src={`/api/image-proxy?url=${images[0]}`} alt={`${propertyType} - ${city} - ${neighborhood} - ${area} - ${bedroom}`} fill sizes="100%" className="object-cover" />
          )}
        </div>

        <div className="w-full p-4 space-y-3">
          <div className="flex items-center gap-x-2">
            <div className={`text-sm font-medium text-white py-1 px-2.5 rounded-full ${propertyType === "آپارتمان" ? "bg-states-success" : propertyType === "خانه ویلایی" ? "bg-[#D67114]" : "bg-shade-2"}`}>{propertyType}</div>

            <div className="flex items-center gap-x-2">
              <Location className="size-5 stroke-g3" />

              <p className="text-caption-md text-g3">
                {city} - {neighborhood}
              </p>
            </div>
          </div>

          <p className="text-body-xxs text-g1">
            {area} متری {bedroom} خوابه
          </p>

          <div className="w-full min-h-9 flex gap-x-6.5 px-1 items-center bg-g10 rounded-lg">
            {dataShow.map((e, index) => (
              <div className="flex items-center flex-1 h-full gap-x-1" key={index}>
                <p className="text-g1 text-body-3xs">{e.label}</p>

                <div className="flex items-center justify-center flex-1 h-full p-1 bg-white rounded-md">
                  <p className="translate-y-px text-body-3xs text-g1">{e.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Link>

      {mounted &&
        (searching ? (
          <button className={`absolute size-8 flex items-center justify-center rounded-full border top-4 right-4 ${selectedIds.includes(String(_id)) ? "bg-primary border-primary" : "bg-white border-g6"}`} onClick={() => toggleId(String(_id))}>
            {selectedIds.includes(String(_id)) && (
              <svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 20 20" fill="var(--color-white)" stroke="var(--color-white)" strokeWidth="1">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
            )}
          </button>
        ) : statusUi ? (
          <div className="absolute flex items-center px-4 py-2 bg-white shadow-2xl border border-g9 rounded-lg gap-x-1 top-2 right-2">
            <p className={`text-sm font-medium ${statusObject[status].className}`}>{statusObject[status]?.label}</p>
            <div className={statusObject[status].className}>{statusObject[status].icon}</div>
          </div>
        ) : (
          <button aria-label={wishlist.includes(String(_id)) ? "حذف از اگهی های ذخیره شده" : "اضافه به اگهی های ذخیره شده"} className="absolute z-10 flex items-center justify-center rounded-full size-6 bg-g11 top-4 right-4" onClick={() => toggleWishlist(String(_id))}>
            <Heart className={`size-4 ${wishlist.includes(String(_id)) ? "fill-states-error1" : "fill-g8"}`} variant="Bold" />
          </button>
        ))}
    </div>
  );
};

export default HomeCard;
