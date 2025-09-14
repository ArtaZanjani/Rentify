"use client";
import { useAuth } from "@/context/AuthProvider";
import { InputTypes } from "@/types/types";
import { useActionState, useEffect, useState } from "react";
import { User, Call, Refresh } from "iconsax-react";
import Input from "@/components/common/Input";
import { handleInputChange, resetInputValue } from "@/utils/form";
import Image from "next/image";
import { uploadLogoValidation, isPhoneNumber } from "@/utils/validation";
import { toast } from "sonner";
import { EditPersonalInformation, checkCode } from "@/actions/actions";
import { useRouter } from "next/navigation";
import Dialog from "@/components/common/Dialog";
import InputOtp from "@/components/auth/InputOtp";
import BtnForm from "@/components/auth/BtnForms";
import { motion } from "motion/react";
import { dialogVariants } from "@/utils/Animations";
import { cancleCode } from "@/utils/utils";
const PersonalInformation = () => {
  const { user } = useAuth();

  const [inputs, setInputs] = useState<InputTypes[]>([
    {
      label: "نام",
      name: "name",
      id: "input_name",
      type: "text",
      icon: User,
      value: "",
      error: "",
    },
    {
      label: "نام خانوادگی",
      name: "last_name",
      id: "input_last_name",
      type: "text",
      icon: User,
      value: "",
      error: "",
    },
    {
      label: "تلفن همراه",
      name: "phone_number",
      id: "input_phone_number",
      type: "tel",
      icon: Call,
      value: "",
      error: "",
    },
  ]);
  const [logo, setLogo] = useState<File | undefined>(undefined);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [imgError, setImgError] = useState<boolean>(false);
  const [openOTP, setOpenOTP] = useState<boolean>(false);
  const router = useRouter();

  const setInputsValue = () => {
    if (!user) return;

    handleInputChange(inputs, setInputs, "name", user?.name ?? "", "any");
    handleInputChange(inputs, setInputs, "last_name", user?.last_name ?? "", "any");
    handleInputChange(inputs, setInputs, "phone_number", user?.phone_number ?? "", "just_number");
  };

  useEffect(() => {
    setInputsValue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetLogo = () => {
    setLogo(undefined);
    setPreviewUrl(undefined);
  };

  useEffect(() => {
    if (logo) {
      const isValidLogo = uploadLogoValidation(logo);
      if (isValidLogo.statusCode !== 200) {
        resetLogo();
        toast.error(isValidLogo.message);
        return;
      }
      const objectUrl = URL.createObjectURL(logo);
      setPreviewUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewUrl(undefined);
    }
  }, [logo]);

  const [state, formAction] = useActionState(EditPersonalInformation, {
    message: "",
    error: false,
  });

  const [stateCode, formActionCode] = useActionState(checkCode, {
    message: "",
    error: false,
  });

  const disabledRules = (user?.name === inputs[0].value && user?.last_name === inputs[1].value && user?.phone_number === inputs[2].value && logo === undefined) || !inputs[0].value.trim() || !inputs[1].value.trim() || !inputs[2].value.trim() || !isPhoneNumber(inputs[2].value);

  useEffect(() => {
    if (state.error) {
      toast.error(state.message);
    } else if (!state.error && state.message.trim().length) {
      toast.success(state.message);
      if (user?.phone_number !== inputs[2].value) {
        setOpenOTP(true);
      } else {
        router.refresh();
      }

      resetLogo();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, router]);

  useEffect(() => {
    if (stateCode.error) {
      toast.error(stateCode.message);
    } else if (!stateCode.error && stateCode.message.trim().length) {
      toast.success(stateCode.message);
      resetLogo();
      router.refresh();
    }
  }, [stateCode, router]);

  return (
    <>
      <form
        noValidate
        {...(user?.role !== "ADMIN"
          ? { action: formAction }
          : {
              onSubmit: (e) => {
                e.preventDefault();

                toast.error("اطلاعات ادمین عوض نمیشه");
              },
            })}
        className="mt-8"
      >
        <div className="w-full py-6 bg-white rounded-2xl">
          <div className="flex max-[718px]:flex-col items-center min-[718px]:items-end gap-5 px-6">
            <div className="size-[123px] rounded-full flex justify-center items-center bg-conic-90 bg-g9 overflow-hidden relative">{previewUrl ? <Image src={previewUrl} alt="پروفایل" priority fill sizes="100%" className="object-cover" /> : !user?.logo || imgError ? <User className="size-13 stroke-g5" /> : <Image onError={() => setImgError(true)} src={`/api/image-proxy?url=${user?.logo}`} alt="پروفایل" priority fill sizes="100%" className="object-cover" />}</div>
            <label htmlFor="file-upload" className="px-6 py-1.5 border rounded-lg border-g8 hover:bg-g8 cursor-pointer">
              تغییر عکس
            </label>
            <input type="file" className="hidden" id="file-upload" name="logo" onChange={(e) => setLogo(e.target.files?.[0] ?? undefined)} />
          </div>

          <hr className="w-full mt-6 border-g9" />

          <button
            aria-label="ریست به حالت دیفالت"
            type="button"
            className="m-6 group"
            onClick={() => {
              setInputsValue();
              resetLogo();
            }}
          >
            <Refresh className="size-7 stroke-black group-hover:animate-spin group-hover:stroke-g6" />
          </button>

          <div className="flex flex-wrap justify-between w-full px-6 mt-6 gap-x-4 gap-y-6">
            {inputs.map((e, index) => (
              <Input key={index} inputClassName={`h-12 w-full ${user?.role === "ADMIN" && "cursor-not-allowed"}`} readOnly={user?.role === "ADMIN"} divClassName={`w-full min-[986px]:w-[261px] ${user?.role === "ADMIN" && "opacity-50"}`} Icon={e.icon} label={e.label} id={e.id} name={e.name} type={e.type} value={e.value} onChange={(i) => (user?.role === "ADMIN" ? null : handleInputChange(inputs, setInputs, e.name, i.target.value, e.type === "tel" ? "just_number" : "any"))} error={e.error} ResetValue={() => (user?.role === "ADMIN" ? null : resetInputValue(inputs, setInputs, e.name))} />
            ))}

            <input type="hidden" name="id" value={user?._id} />
          </div>
        </div>

        <div className="mt-4 mr-auto w-fit">
          <BtnForm width="w-fit" label="ثبت تغییرات" check={!disabledRules} />
        </div>
      </form>

      <Dialog
        open={openOTP}
        close={async () => {
          await cancleCode(inputs[2].value);
          setOpenOTP(false);
          setInputsValue();
        }}
      >
        <motion.form variants={dialogVariants} initial="hidden" animate={openOTP ? "visible" : "hidden"} exit="exit" onClick={(e) => e.stopPropagation()} noValidate action={formActionCode} className="w-[600px] max-w-[95%] max-h-[95%] bg-white rounded-2xl p-4 xs:p-6 flex flex-col justify-center items-center">
          <p className="text-center text-body-1xs text-g1">کد ارسال شده به شماره موبایل {inputs[2].value} را وارد کنید</p>
          <button
            type="button"
            className="cursor-pointer text-primary text-body-1xs"
            onClick={async () => {
              await cancleCode(inputs[2].value);
              setOpenOTP(false);
              setInputsValue();
            }}
          >
            ویرایش شماره موبایل
          </button>
          <InputOtp />

          <BtnForm label="ورود" check />

          <input type="hidden" name="methodCheckCode" value="EDIT" />
          <input type="hidden" name="phone_number" value={user?.phone_number} />
          <input type="hidden" name="newPhoneNumber" value={inputs[2].value} />
        </motion.form>
      </Dialog>
    </>
  );
};

export default PersonalInformation;
