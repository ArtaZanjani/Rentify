"use client";
import Image from "next/image";
import { useState, useMemo, useActionState, useEffect, startTransition } from "react";
import Button from "@/components/common/Button";
import { ArrowLeft } from "iconsax-react";
import Step1 from "../RegisterAdsInputs/Step1";
import Step2 from "../RegisterAdsInputs/Step2";
import Step5 from "../RegisterAdsInputs/Step5";
import Step4 from "../RegisterAdsInputs/Step4";
import Step3 from "../RegisterAdsInputs/Step3";
import Step6 from "../RegisterAdsInputs/Step6";
import { newHome } from "@/actions/newHome";
import { toast } from "sonner";
import BtnForm from "@/components/auth/BtnForms";
import { useAuth } from "@/context/AuthProvider";
import Success from "../RegisterAdsInputs/Success";
import { path_user } from "@/utils/path";

const RegisterAdsComp = () => {
  const { user } = useAuth();
  const [activePage, setActivePage] = useState<number>(0);
  const [disabledNext, setDisabledNext] = useState<boolean[]>([false, false, false, false, false, false]);
  const [images, setImages] = useState<File[]>([]);

  const stepSetters = useMemo(
    () =>
      Array.from({ length: 6 }, (_, index) => (status: boolean) => {
        setDisabledNext((prev) => {
          const updated = [...prev];
          updated[index] = status;
          return updated;
        });
      }),
    []
  );

  const steps = [
    {
      label: "نوع معامله و نوع ملک",
      component: <Step1 setDisabledNext={stepSetters[0]} />,
    },
    {
      label: "موقعیت ملک",
      component: <Step2 activePage={activePage === 1} setDisabledNext={stepSetters[1]} />,
    },
    {
      label: "مشخصات ملک",
      component: <Step3 setDisabledNext={stepSetters[2]} />,
    },
    {
      label: "تجهیزات وامکانات",
      component: <Step4 />,
    },
    {
      label: "توضیحات تکمیلی",
      component: <Step5 />,
    },
    {
      label: "عکس‌ها و ویدیو‌‌ها",
      component: <Step6 images={images} setImages={setImages} />,
    },
    {
      label: "اتمام",
      component: <Success />,
    },
  ];

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (activePage < steps.length - 1) {
      setActivePage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activePage > 0) {
      setActivePage((prev) => prev - 1);
    }
  };

  const [stateSend, setStateSend] = useActionState(newHome, {
    message: "",
    error: false,
  });

  useEffect(() => {
    if (stateSend.message.trim().length) {
      if (stateSend.error) {
        toast.error(stateSend.message);
      } else {
        setActivePage(6);
      }
    }
  }, [stateSend]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const validImages = images.filter((file) => file && file.size > 0 && file.name !== "undefined");

    validImages.forEach((file) => formData.append("images", file));

    formData.append("postedBy", String(user?._id));

    startTransition(() => {
      setStateSend(formData);
    });
  };

  return (
    <div className="relative flex items-start justify-between w-full bg-white rounded-2xl max-lg:flex-col">
      <div className="w-full lg:w-[574px] sm:h-[610px] flex">
        <div className="flex flex-col items-center flex-1 h-full px-5 pt-12 pb-6 gap-y-10 sm:gap-y-4">
          <h1 className="text-h3">{path_user[1].metaData.title}</h1>
          <p className="text-center text-g5 text-body-1xs">آگهی ملکت رو اینجا ثبت کن و به راحتی مستأجر پیدا کن!</p>

          <div className="relative size-62.5 mt-auto">
            <Image src="/images/illustrations/register-ads.png" alt={path_user[1].metaData.title} sizes="100%" priority quality={100} fill className="object-contain" />
          </div>
        </div>

        <div className="flex flex-col h-full px-10 max-sm:hidden max-lg:flex-1 lg:w-71 rounded-l-2xl bg-shade-2 py-11 gap-y-2">
          {steps
            .filter((e) => e.label !== "اتمام")
            .map((e, index) => (
              <div className="flex flex-col gap-y-2" key={index}>
                <div className="flex items-center w-full gap-x-5">
                  <p className={`${activePage >= index ? "text-white" : "text-g9"} text-button-s mr-auto duration-200`}>{e.label}</p>

                  <div className={`size-10 rounded-full border flex items-center justify-center text-sm font-medium duration-200 ${activePage >= index ? "bg-white border-white" : "border-g8 text-g8"}`}>{index + 1}</div>
                </div>

                {index !== steps.length - 2 && <div className={`w-px h-10 mr-auto ml-5 duration-200 ${activePage >= index ? "bg-white" : "bg-g6"}`}></div>}
              </div>
            ))}
        </div>
      </div>

      <form noValidate onSubmit={handleSubmit} className="w-full flex-1 max-lg:min-h-90 lg:min-h-[610px] flex flex-col p-5 sm:p-10 pb-3">
        {steps.map((e, index) => (
          <div className={`flex-1 ${activePage === index ? `${e.label === "اتمام" ? "flex" : "block"}` : "hidden"}`} key={index}>
            {e.component}
          </div>
        ))}

        {activePage !== 6 && (
          <div className="flex items-center justify-center w-full mt-5 sm:justify-end gap-x-2">
            {activePage !== 0 && (
              <Button type="button" width="w-fit" height="h-12" variant="normal" onClick={handlePrev}>
                <ArrowLeft className="rotate-180 size-5 stroke-primary" />
                مرحله قبل
              </Button>
            )}

            {activePage === 5 ? (
              <BtnForm label="ثبت نهایی" className="" check={activePage === 5} width="w-fit" />
            ) : (
              <Button type="button" width="w-fit" height="h-12" variant="fill" onClick={handleNext} disabled={disabledNext[activePage]}>
                ادامه
                <ArrowLeft className={`size-5 duration-200 ${disabledNext[activePage] ? "stroke-g6" : "stroke-white"}`} />
              </Button>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default RegisterAdsComp;
