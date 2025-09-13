"use client";
import { Call, Messages3, Add, Calendar as CalendarIcon, Clock, User } from "iconsax-react";
import Link from "next/link";
import Button from "@/components/common/Button";
import type { UserType, ReservationDateTypes } from "@/types/types";
import Dialog from "../common/Dialog";
import { useEffect, useState, useMemo } from "react";
import { Calendar, DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { ArrowDown } from "../Icons/Icons";
import { toast } from "sonner";
import { validateDate } from "@/utils/validation";
import useSWR from "swr";
import Spinner from "../common/Spinner";
import { motion } from "motion/react";
import { dialogVariants } from "@/utils/Animations";
import Image from "next/image";
import { swrConfig } from "@/configs/swrConfig";
import { ROLES } from "@/utils/countOccurrences";

type PostedByPropsType = { isLoading: true; userData?: never; homeId?: never } | { isLoading: false; userData: UserType; homeId: string };

const weekDays = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

const PostedBy = ({ userData, homeId, isLoading: LoadingStatus }: PostedByPropsType) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [value, setValue] = useState<DateObject>(new DateObject());
  const [activeClock, setActiveClock] = useState<string>("");
  const [BtnLabel, setBtnLabel] = useState<string>("ثبت درخواست بازدید");
  const [openSuccess, setOpenSuccess] = useState<boolean>(false);
  const { data: dataClock, error, isValidating, mutate } = useSWR<ReservationDateTypes | undefined>(openDialog && homeId ? `/api/reservation-date/${homeId}` : null, swrConfig.fetcher, swrConfig);

  const date = `${value.year}/${String(value.month).padStart(2, "0")}/${String(value.day).padStart(2, "0")}`;

  const handleClose = () => {
    setActiveClock("");
    setBtnLabel("ثبت درخواست بازدید");
    setOpenSuccess(false);
  };

  useEffect(() => {
    let timeOut: ReturnType<typeof setTimeout>;

    if (BtnLabel !== "ثبت درخواست بازدید") {
      timeOut = setTimeout(() => {
        setBtnLabel("ثبت درخواست بازدید");
      }, 5000);
    }

    return () => {
      clearTimeout(timeOut);
    };
  }, [BtnLabel]);

  const handleSend = async () => {
    if (LoadingStatus) {
      toast.error("در حال بارگذاری… لطفاً صبر کنید");
      return;
    }

    if (BtnLabel !== "آیا مطمئن هستید؟") {
      setBtnLabel("آیا مطمئن هستید؟");
      return;
    }

    if (!activeClock) {
      toast.error("ساعت بازدید خود را انتخاب کنید");
      return;
    }

    try {
      const result = validateDate(homeId, date, activeClock);

      if (result.status !== 200) {
        toast.error(result.message);
        return;
      }

      const response = await fetch("/api/reservation-date", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: homeId,
          date: date,
          clock: activeClock,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message);
        return;
      }

      setOpenDialog(false);
      setOpenSuccess(true);
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (openDialog) {
      mutate();
    }
  }, [openDialog, mutate]);

  useEffect(() => {
    setBtnLabel("ثبت درخواست بازدید");
    setActiveClock("");
  }, [value]);

  const clocks = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];

  const pickedDate = useMemo(() => {
    return dataClock?.pickedDate ?? [];
  }, [dataClock]);

  const isDateFullyBooked = useMemo(() => {
    return pickedDate.filter((e) => e.date === date).length >= clocks.length;
  }, [pickedDate, date, clocks.length]);

  const disabledRule = !value || !activeClock;

  useEffect(() => {
    if (isDateFullyBooked && dataClock) {
      let nextAvailableDate = new DateObject(value).add(1, "day");
      const maxDate = new DateObject().add(1, "month");

      while (nextAvailableDate.toDate() <= maxDate.toDate()) {
        const nextDateFormatted = `${nextAvailableDate.year}/${String(nextAvailableDate.month).padStart(2, "0")}/${String(nextAvailableDate.day).padStart(2, "0")}`;
        const nextDateBookedTimes = pickedDate.filter((e) => e.date === nextDateFormatted).length;
        const isNextDateFullyBooked = nextDateBookedTimes >= clocks.length;

        if (!isNextDateFullyBooked) {
          setValue(nextAvailableDate);
          break;
        }

        nextAvailableDate = nextAvailableDate.add(1, "day");
      }
    }
  }, [isDateFullyBooked, dataClock, value, pickedDate, clocks.length]);

  const [imgError, setImgError] = useState<boolean>(false);

  return (
    <>
      <div className="w-full min-[450px]:w-98 h-[272px] min-[450px]:mx-auto bg-white border border-g9 rounded-xl flex flex-col items-center p-6">
        <div className="flex items-center gap-x-3">
          <div className="relative flex items-center justify-center overflow-hidden rounded-full size-22 bg-g9">{LoadingStatus || imgError || !userData?.logo ? <User className="size-10 stroke-g7" /> : <Image onError={() => setImgError(true)} className="object-cover" src={userData?.logo} alt={`${userData?.name} ${userData?.last_name}`} sizes="100%" fill />}</div>
          <div>
            {LoadingStatus ? (
              <>
                <div className="w-24 h-5 rounded-lg bg-g9"></div>
                <div className="w-20 h-5 mt-2 rounded-lg bg-g9"></div>
              </>
            ) : (
              <>
                <p className="text-g1 text-h6">
                  {userData?.name ?? "کاربر ناشناس"} {userData?.last_name ?? ""}
                </p>
                <p className="text-g5 text-body-1xs">{userData?.role === ROLES[2] ? `املاک ${userData?.office_name}` : "شخصی"}</p>
              </>
            )}
          </div>
        </div>

        <div className="grid w-full grid-cols-2 gap-2 mt-auto">
          {LoadingStatus ? (
            <>
              <div className="flex items-center justify-center w-full h-10 col-span-1 py-1 rounded-lg bg-g9 gap-x-1 text-button-s"></div>
              <div className="flex items-center justify-center w-full h-10 col-span-1 py-1 rounded-lg bg-g9 gap-x-1 text-button-s"></div>
              <div className="h-12 col-span-2 row-start-2 rounded-lg bg-g9"></div>
            </>
          ) : (
            <>
              <Link href={`tel:${userData?.phone_number}`} className="flex items-center justify-center w-full h-10 col-span-1 py-1 border rounded-lg border-g9 hover:bg-g9 text-primary gap-x-1 text-button-s">
                <Call className="size-5 stroke-primary" />
                تماس
              </Link>
              <Link href={`sms:${userData?.phone_number}`} className="flex items-center justify-center w-full h-10 col-span-1 py-1 border rounded-lg border-g9 hover:bg-g9 text-primary gap-x-1 text-button-s">
                <Messages3 className="size-5 stroke-primary" />
                پیام
              </Link>

              <Button width="w-full" height="h-12" variant="fill" className="col-span-2 row-start-2" onClick={() => setOpenDialog(true)}>
                درخواست بازدید
              </Button>
            </>
          )}
        </div>
      </div>

      <Dialog open={openDialog} close={() => setOpenDialog(false)}>
        <motion.div variants={dialogVariants} initial="hidden" animate={openDialog ? "visible" : "hidden"} exit="exit" className="w-[1160px] h-[740px] max-w-[95%] max-h-[95%] rounded-2xl bg-gray flex flex-col gap-y-10 p-2 min-[850px]:px-20 min-[850px]:pt-12 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="w-full px-6 py-8 bg-white max-[850px]:shadow-2xl rounded-2xl flex justify-between items-center sticky top-0 z-[101]">
            <p className="text-lg xs:text-2xl min-[850px]:text-[32px] font-bold">درخواست بازدید</p>

            <button className="rounded-full hover:bg-g8" onClick={() => setOpenDialog(false)}>
              <Add className="rotate-45 size-6 xs:size-9 stroke-black" />
            </button>
          </div>
          <div className="relative min-h-[391px] min-[850px]:bg-g2 flex max-[850px]:flex-col w-full max-[850px]:items-center rounded-2xl">
            {error ? (
              <div className="flex flex-col items-center m-auto gap-y-3">
                <p className="text-white text-h4">{error?.message ?? "خطا در دریافت اطلاعات"}</p>
                <Button width="w-full" height="h-12" variant="fill" onClick={() => mutate()}>
                  تلاش دوباره
                </Button>
              </div>
            ) : (
              <>
                {isValidating && (
                  <div className="absolute w-full bg-black/10 h-full top-0 left-0 z-[101] backdrop-blur-2xl flex justify-center items-center">
                    <Spinner className="size-16 fill-primary" />
                  </div>
                )}
                <Calendar
                  renderButton={(direction: "right" | "left", handleClick: () => void, disabled: boolean) => (
                    <i onClick={handleClick} className={`${disabled ? "cursor-not-allowed opacity-20" : "cursor-pointer"} size-6`}>
                      <ArrowDown fill="var(--color-black)" width="24px" height="24px" className={`${direction === "right" ? "rotate-90" : "-rotate-90"}`} />
                    </i>
                  )}
                  showOtherDays
                  className="!rounded-2xl !shadow-none !p-0 PostedBy max-[450px]:!w-full max-[850px]:!shadow-2xl"
                  minDate={new DateObject()}
                  maxDate={new DateObject().add(1, "month")}
                  value={value}
                  onChange={(selectedDate) => {
                    if (selectedDate) setValue(selectedDate);
                  }}
                  calendar={persian}
                  locale={persian_fa}
                  weekDays={weekDays}
                  mapDays={({ date }) => {
                    const formatted = `${date.year}/${String(date.month).padStart(2, "0")}/${String(date.day).padStart(2, "0")}`;
                    const bookedTimes = pickedDate.filter((e) => e.date === formatted).length ?? 0;
                    const fullyBooked = bookedTimes >= clocks.length;

                    if (fullyBooked) {
                      return { disabled: true };
                    }
                    return {};
                  }}
                />

                <div className="flex-1 pb-2 min-[850px]:p-6 pt-10 flex flex-col w-full">
                  <p className="min-[850px]:text-white text-button-s">ساعت بازدید خود را انتخاب کنید</p>

                  <div className="grid w-full grid-cols-3 gap-6 mt-8" dir="ltr">
                    {clocks.map((clock, index) => {
                      const isPicked = pickedDate.some((e) => e.date === date && e.clock === clock) ?? false;
                      const disabled = isPicked || isDateFullyBooked;
                      return (
                        <button className={`h-10.5 rounded-sm duration-200 max-[850px]:shadow-2xl ${isPicked ? "opacity-20 bg-white cursor-not-allowed" : `${activeClock === clock ? "bg-primary text-white" : "bg-white min-[850px]:bg-white hover:bg-primary hover:text-white"}`}`} onClick={() => !disabled && setActiveClock(clock)} disabled={disabled} key={index}>
                          {clock}
                        </button>
                      );
                    })}
                  </div>

                  <Button width="w-full" height="h-12" variant="fill" disabled={disabledRule} className="sticky bottom-0 mt-10" onClick={() => (disabledRule ? null : handleSend())}>
                    {BtnLabel}
                  </Button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </Dialog>

      <Dialog open={openSuccess} close={() => handleClose()}>
        <motion.div className="w-[450px] max-w-[95%] h-84.5 bg-white rounded-2xl p-4 flex flex-col gap-y-3" variants={dialogVariants} initial="hidden" animate={openSuccess ? "visible" : "hidden"} exit="exit" onClick={(e) => e.stopPropagation()}>
          <button className="mr-auto rounded-full hover:bg-g8 w-fit" onClick={handleClose}>
            <Add className="rotate-45 size-6 xs:size-9 stroke-black" />
          </button>
          <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" height="80px" viewBox="0 -960 960 960" width="80px" fill="var(--color-primary)">
              <path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
            </svg>

            <p className="mt-2 text-button-s">درخواست بازدید شما با موفقیت ثبت شد</p>

            <div className="flex flex-col items-start mt-8 gap-y-4">
              <div className="flex items-center gap-x-2">
                <CalendarIcon className="size-6 stroke-g5" />
                <p>
                  {value.day} {value.month.name}, {value.year}
                </p>
              </div>
              <div className="flex items-center gap-x-2">
                <Clock className="size-6 stroke-g5" />
                <p>{activeClock}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </Dialog>
    </>
  );
};

export default PostedBy;
