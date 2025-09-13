"use client";

import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { cn } from "@/lib/utils";

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) {
  return <OTPInput data-slot="input-otp" containerClassName={cn("flex items-center gap-2 has-disabled:opacity-50", containerClassName)} className={cn("disabled:cursor-not-allowed", className)} {...props} />;
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div dir="ltr" data-slot="input-otp-group" className={cn("flex mt-6 w-full justify-between xs:justify-center items-center gap-x-6", className)} {...props} />;
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number;
}) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div data-slot="input-otp-slot" data-active={isActive} className={cn("aria-invalid:border-destructive border-input relative flex size-17 xs:size-20 items-center rounded-xl justify-center border text-body-xl outline-none", className)} {...props}>
      {char}
      {hasFakeCaret && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-px h-4 animate-caret-blink bg-foreground" />
        </div>
      )}
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot };
