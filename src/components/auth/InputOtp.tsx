import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useState } from "react";

const InputOtp = () => {
  const [value, setValue] = useState<string>("");
  const onChange = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, "");
    setValue(onlyNumbers);
  };
  return (
    <InputOTP name="OTPCode" maxLength={4} value={value} onChange={onChange}>
      <InputOTPGroup>
        {Array.from({ length: 4 }).map((_, index) => (
          <InputOTPSlot className={`${value.length >= index ? "data-[active=true]:border-primary" : ""}`} index={index} key={index} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
};

export default InputOtp;
