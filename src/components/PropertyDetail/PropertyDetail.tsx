"use client";
import type { HomeType, Amenities } from "@/types/types";
import { Location, Clock, Flag } from "iconsax-react";
import { Fragment } from "react";
import dayjs from "@/utils/dayjs";
import SectionChildren from "./SectionChildren";
import dynamic from "next/dynamic";
import ActionButtons from "./ActionButtons";
import { Equipment_Facilities } from "@/utils/Equipment_Facilities";

const Map = dynamic(() => import("@/components/map/Map"), {
  ssr: false,
});

type PropertyDetailPropsType = { isLoading: true; parsedData?: never } | { isLoading: false; parsedData: HomeType };

const PropertyDetail = ({ parsedData, isLoading }: PropertyDetailPropsType) => {
  const Info = [
    {
      icon: Location,
      text: `${parsedData?.city} - ${parsedData?.neighborhood}`,
    },
    {
      icon: Clock,
      text: dayjs(parsedData?.createdAt).fromNow(),
    },
  ];

  const payInfo = [
    {
      label: "رهن",
      value: parsedData?.deposit.toLocaleString(),
    },
    {
      label: "اجاره",
      value: parsedData?.rent.toLocaleString(),
    },
  ];

  const mainInfo = [
    {
      label: "مساحت زیر بنا:",
      value: `${parsedData?.information.area} متر`,
    },
    {
      label: "مساحت زمین:",
      value: `${parsedData?.information.landArea} متر`,
    },
    {
      label: "طبقات:",
      value: parsedData?.information.totalFloors,
    },
    {
      label: "خواب:",
      value: `${parsedData?.information.bedroom} خوابه`,
    },
    {
      label: "سرویس بهداشتی:",
      value: `${parsedData?.information.bathroom} عدد`,
    },
    {
      label: "طبقه:",
      value: parsedData?.information.floor,
    },
    {
      label: "هر طبقه:",
      value: parsedData?.information.unitsPerFloor,
    },
  ];

  return (
    <div className="max-[1082px]:w-full min-[1082px]:flex-1 flex flex-col">
      <div className="w-full flex max-[550px]:flex-col-reverse justify-between items-start gap-x-10 gap-y-5">
        <h1 className="max-[550px]:w-full min-[413px]:text-xl sm:text-2xl font-medium flex-1 leading-[160%]">
          {isLoading ? (
            <div className="max-[550px]:w-full min-[600px]:w-[446px] h-12 bg-g9 rounded-lg"></div>
          ) : (
            <>
              {parsedData?.propertyType} {parsedData?.information.area} متری {parsedData?.information.bedroom} خوابه _ {parsedData?.city} {parsedData?.neighborhood}
            </>
          )}
        </h1>

        {isLoading ? <ActionButtons isLoading /> : parsedData ? <ActionButtons isLoading={false} id={String(parsedData._id)} message={`${parsedData.propertyType} ${parsedData.information.area} متری ${parsedData.information.bedroom} خوابه ${parsedData.city} محله ${parsedData.neighborhood.replace("محله", "")}`} /> : null}
      </div>

      <div className="flex max-[550px]:flex-col w-fit items-center justify-start gap-x-5 gap-y-2 mt-2">
        {Info.map((e, index) => (
          <Fragment key={index}>
            <div className="flex justify-center items-center gap-x-1 max-[550px]:w-full">
              <e.icon className="size-6 stroke-g6" />
              {isLoading ? <div className="w-20 h-5 rounded-md bg-g9"></div> : <p className="text-body-1xs text-g6 max-[550px]:ml-auto">{e.text}</p>}
            </div>

            {index !== 1 && <div className="w-px h-9 bg-g9 max-[550px]:hidden"></div>}
          </Fragment>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {isLoading ? (
          <>
            <div className="w-32 h-5 min-[550px]:w-64 min-[550px]:h-8 rounded-md min-[550px]:rounded-lg bg-g9"></div>
            <div className="w-32 h-5 min-[550px]:w-64 min-[550px]:h-8 rounded-md min-[550px]:rounded-lg bg-g9"></div>
          </>
        ) : (
          payInfo.map((e, index) => (
            <div className="flex items-center gap-x-1.5" key={index}>
              <p className="min-[550px]:text-2xl font-bold text-g1">
                {e.label} {e.value}
              </p>
              <svg width="25" height="12" viewBox="0 0 25 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.4551 6.94449H22.3488C23.312 6.94449 23.7936 6.62186 23.7936 5.97661C23.7936 5.72412 23.7468 5.34538 23.6533 4.8404C23.5691 4.32606 23.4709 3.82576 23.3587 3.33948L24.4248 3.05893C24.537 3.53586 24.6399 4.05954 24.7334 4.62999C24.8363 5.20043 24.8877 5.64463 24.8877 5.96258C24.8877 6.35534 24.7942 6.72473 24.6072 7.07074C24.4201 7.40739 24.1349 7.68326 23.7515 7.89835C23.3681 8.10408 22.9005 8.20695 22.3488 8.20695H20.4551V6.94449ZM21.0863 0.000976562H22.489V1.40371H21.0863V0.000976562ZM23.5972 0.000976562H24.9999V1.40371H23.5972V0.000976562Z" fill="#73767C" />
                <path d="M16.2414 10.4924C16.896 10.4924 17.401 10.4129 17.7563 10.2539C18.121 10.1043 18.3735 9.87049 18.5138 9.55254C18.6541 9.23459 18.7242 8.81377 18.7242 8.29008V8.20592H17.1812C16.3957 8.20592 15.7598 7.97213 15.2735 7.50455C14.7966 7.03698 14.5581 6.38237 14.5581 5.54073C14.5581 4.97029 14.6656 4.45128 14.8807 3.9837C15.1052 3.51612 15.4138 3.14674 15.8065 2.87554C16.2087 2.60435 16.6622 2.46875 17.1672 2.46875C17.7002 2.46875 18.1678 2.59967 18.5699 2.86151C18.972 3.12336 19.2806 3.48807 19.4957 3.95564C19.7108 4.41387 19.8183 4.94223 19.8183 5.54073V6.94346H20.6039L20.688 7.58872L20.6039 8.20592H19.8183V8.29008C19.8183 9.35616 19.5331 10.1978 18.9627 10.815C18.4016 11.4416 17.4945 11.7548 16.2414 11.7548H14.7405V10.4924H16.2414ZM15.6522 5.54073C15.6522 6.05506 15.7738 6.41977 16.0169 6.63486C16.2601 6.84059 16.6482 6.94346 17.1812 6.94346H18.7242V5.54073C18.7242 4.97029 18.5933 4.52609 18.3315 4.20814C18.0696 3.88083 17.6815 3.71718 17.1672 3.71718C16.6903 3.71718 16.3162 3.88551 16.045 4.22216C15.7832 4.54947 15.6522 4.98899 15.6522 5.54073Z" fill="#73767C" />
                <path d="M7.17041 10.4286H7.56317C8.0027 10.4286 8.27389 10.2323 8.37676 9.83949L8.82563 8.22635C9.03137 7.49693 9.34932 6.92649 9.77949 6.51502C10.2097 6.0942 10.7287 5.88379 11.3365 5.88379C11.8228 5.88379 12.253 6.02874 12.627 6.31864C13.0011 6.59918 13.291 6.98259 13.4967 7.46887C13.7025 7.9458 13.8053 8.46481 13.8053 9.02591C13.8053 9.71792 13.7071 10.2884 13.5108 10.7372C13.3144 11.1768 13.0572 11.4947 12.7393 11.6911C12.4306 11.8968 12.1033 11.9997 11.7573 11.9997C11.402 11.9997 11.0466 11.9296 10.6913 11.7893C10.3359 11.6584 9.77481 11.3965 9.00799 11.0038C8.82096 11.2188 8.6012 11.3872 8.3487 11.5087C8.09621 11.6303 7.83437 11.6911 7.56317 11.6911H7.17041V10.4286ZM9.527 9.88157C10.2003 10.2276 10.6772 10.4567 10.9578 10.5689C11.2383 10.6811 11.5048 10.7372 11.7573 10.7372C12.0753 10.7372 12.3138 10.6203 12.4727 10.3866C12.6317 10.1434 12.7112 9.68987 12.7112 9.02591C12.7112 8.43676 12.5943 7.97853 12.3605 7.65123C12.1267 7.31457 11.7854 7.14625 11.3365 7.14625C10.9999 7.14625 10.7053 7.26314 10.4528 7.49693C10.2097 7.73072 10.0226 8.08608 9.89171 8.56301L9.527 9.88157Z" fill="#73767C" />
                <path d="M7.09869 11.6897C6.17289 11.6897 5.53231 11.4419 5.17695 10.9462C4.82159 10.4412 4.64391 9.70247 4.64391 8.72991L4.62988 7.26172H5.72401L5.73804 8.72991C5.73804 9.23489 5.76609 9.5996 5.8222 9.82404C5.88766 10.0485 6.00923 10.2075 6.18691 10.301C6.37394 10.3851 6.67787 10.4272 7.09869 10.4272H7.3091L7.37923 11.0725L7.3091 11.6897H7.09869Z" fill="#73767C" />
                <path d="M2.36648 1.14499C1.84279 2.21107 1.58095 3.20233 1.58095 4.11878C1.58095 4.96977 1.78668 5.65244 2.19815 6.16677C2.61897 6.69046 3.25487 6.9523 4.10586 6.9523H5.60678C6.24269 6.9523 6.73832 6.87749 7.09368 6.72786C7.44904 6.58759 7.70153 6.35848 7.85115 6.04052C8.00078 5.73192 8.07559 5.30643 8.07559 4.76404V0.359465H9.16972V4.76404C9.16972 5.84882 8.8845 6.69513 8.31405 7.30298C7.74361 7.91083 6.84119 8.21476 5.60678 8.21476H4.10586C3.32968 8.21476 2.6704 8.02305 2.12801 7.63964C1.58562 7.25622 1.17415 6.75124 0.893608 6.12469C0.622414 5.49814 0.486816 4.8295 0.486816 4.11878C0.486816 2.9779 0.804769 1.8183 1.44067 0.640011L2.36648 1.14499ZM4.47057 0.317383H5.8733V1.72011H4.47057V0.317383Z" fill="#73767C" />
              </svg>
            </div>
          ))
        )}
      </div>

      <div className="flex items-center justify-between w-full py-3 mt-6 border-t border-g9">
        {isLoading ? (
          <>
            <div className="w-20 rounded-lg h-7 bg-g9"></div>
            <div className="w-20 rounded-lg h-7 bg-g9"></div>
          </>
        ) : (
          <>
            <p className="min-[550px]:text-lg text-g2">شناسه آگهی: {String(parsedData?._id).replace(/\D/g, "").slice(-4)}</p>
            <button className="min-[550px]:text-lg text-g2 flex items-center gap-x-1">
              <Flag className="size-4.5 stroke-g2" />
              گزارش
            </button>
          </>
        )}
      </div>

      <SectionChildren title="اطلاعات اصلی">
        <div className="w-full grid grid-cols-[auto_auto] xs:grid-cols-[auto_auto_auto] justify-between gap-8">
          {isLoading
            ? Array.from({ length: 7 }).map((_, index) => <div className="w-20 h-10 rounded-lg bg-g9" key={index}></div>)
            : mainInfo.map((e, index) => (
                <p key={index} className="text-g3 text-body-1xs">
                  {e.label} <span className="text-g1">{e.value}</span>
                </p>
              ))}
        </div>
      </SectionChildren>

      <SectionChildren title="تجهیزات و امکانات">
        <div className="w-full grid grid-cols-[auto_auto] xs:grid-cols-[auto_auto_auto] justify-between gap-8">
          {isLoading
            ? Array.from({ length: 7 }).map((_, index) => <div className="w-20 h-10 rounded-lg bg-g9" key={index}></div>)
            : (() => {
                const filteredAmenities = Equipment_Facilities.filter((e) => parsedData?.amenities[e.enLabel as keyof Amenities]);

                if (!filteredAmenities.length) {
                  return <p className="text-error text-sm col-span-full">هیچ تجهیزاتی برای این ملک ثبت نشده است.</p>;
                }

                return filteredAmenities.map((e, index) => (
                  <div className="flex items-center gap-x-2" key={index}>
                    {e.icon}
                    {e.label}
                  </div>
                ));
              })()}
        </div>
      </SectionChildren>

      <SectionChildren title="توضیحات">
        {isLoading ? (
          <div className="space-y-3">
            <div className="w-[60%] h-6 bg-g9 rounded-lg"></div>
            <div className="w-[70%] h-6 bg-g9 rounded-lg"></div>
            <div className="w-[80%] h-6 bg-g9 rounded-lg"></div>
          </div>
        ) : (
          <p>{parsedData?.description ?? "هیچ توضیحاتی برای این ملک ثبت نشده است."}</p>
        )}
      </SectionChildren>

      <div className="mt-8 overflow-hidden h-80 bg-g9 rounded-2xl">
        <Map center={parsedData?.map && parsedData?.map} />
      </div>
    </div>
  );
};

export default PropertyDetail;
