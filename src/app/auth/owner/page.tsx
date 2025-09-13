"use client";
import Input from "@/components/common/Input";
import { useEffect, useState, useActionState } from "react";
import { User, Call } from "iconsax-react";
import type { InputTypes } from "@/types/types";
import { handleInputChange, resetInputValue } from "@/utils/form";
import CheckBox from "@/components/common/CheckBox";
import Link from "next/link";
import { Login_SignUp, checkCode } from "@/actions/actions";
import BtnForm from "@/components/auth/BtnForms";
import { toast } from "sonner";
import AuthLayout from "@/components/auth/AuthLayout";
import InputOtp from "@/components/auth/InputOtp";
import { cancleCode } from "@/utils/utils";

const Owner = () => {
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

  const [state, formAction] = useActionState(Login_SignUp, {
    message: "",
    error: false,
  });

  const [stateCode, setStateCode] = useActionState(checkCode, {
    message: "",
    error: false,
  });

  const [check, setCheck] = useState<boolean>(false);
  const [showOTP, setShowOTP] = useState<boolean>(false);

  const checkValue = inputs.every((e) => e.value.length && !e.error.length) && check;

  useEffect(() => {
    if (state.message.length) {
      if (state.error) {
        toast.error(state.message);
      } else {
        toast.success(state.message);
        if (!showOTP) {
          setShowOTP(true);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    if (stateCode.message.length) {
      if (stateCode.error) {
        toast.error(stateCode.message);
      } else {
        toast.success(stateCode.message);
      }
    }
  }, [stateCode]);

  return (
    <AuthLayout isOTP={showOTP} label={showOTP ? "کد تأیید" : "ورود | ثبت نام"}>
      {showOTP ? (
        <form noValidate action={setStateCode} className="flex flex-col items-center">
          <p className="text-center text-body-1xs text-g1">کد ارسال شده به شماره موبایل {inputs[2].value} را وارد کنید</p>
          <button
            type="button"
            className="mt-2 text-primary text-body-1xs"
            onClick={async () => {
              await cancleCode(inputs[2].value);

              setShowOTP(false);
            }}
          >
            ویرایش شماره موبایل
          </button>
          <InputOtp />

          {inputs.map((e, index) => (
            <input type="hidden" name={e.name} value={e.value} key={index} />
          ))}

          <input type="hidden" name="methodCheckCode" value="LOGIN" />

          <BtnForm label="ورود" check={checkValue} />
        </form>
      ) : (
        <>
          <div className="flex flex-col items-center pb-2">
            <p className="select-text text-gray-700">
              در صورت مشاهده پنل ادمین <br /> از این اطلاعات استفاده کنید
            </p>
            <p className="mt-1 select-text">نام: admin</p>
            <p className="select-text">نام خانوادگی: admin</p>
            <p className="select-text">تلفن همراه: 09351234567</p>
          </div>

          <form noValidate action={formAction}>
            <div className="grid w-full grid-cols-2 gap-x-4 gap-y-6">
              {inputs.map((e, index) => (
                <Input key={index} inputClassName="h-12 w-full" divClassName={`${e.name === "phone_number" && "col-span-2 w-full"}`} Icon={e.icon} label={e.label} id={e.id} name={e.name} type={e.type} value={e.value} onChange={(i) => handleInputChange(inputs, setInputs, e.name, i.target.value, e.type === "tel" ? "just_number" : "any")} error={e.error} ResetValue={() => resetInputValue(inputs, setInputs, e.name)} />
              ))}

              <input type="hidden" name="method" value="USER" />
            </div>

            <CheckBox
              id="accept_rules"
              checked={check}
              label={
                <>
                  با قوانین{" "}
                  <span className="text-primary">
                    <Link href="/">رنتی فای</Link>
                  </span>{" "}
                  موافق هستم
                </>
              }
              className="mt-4"
              onChange={() => setCheck((prev) => !prev)}
            />

            <BtnForm label="تا‌ٔیید و دریافت کد" check={checkValue} />
          </form>
        </>
      )}
    </AuthLayout>
  );
};

export default Owner;
