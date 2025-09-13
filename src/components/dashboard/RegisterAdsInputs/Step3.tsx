"use client";
import type { InputTypes, StepCompPropsType } from "@/types/types";
import { useEffect, useState } from "react";
import { Home2 } from "iconsax-react";
import Input from "@/components/common/Input";
import { areInputsValid, handleInputChange, resetInputValue } from "@/utils/form";
import { INFORMATION_OPTIONS } from "@/utils/Equipment_Facilities";

const Step3 = ({ setDisabledNext }: StepCompPropsType) => {
  const [inputs, setInputs] = useState<InputTypes[]>(
    INFORMATION_OPTIONS.map((opt) => ({
      label: opt.label,
      name: opt.key,
      id: opt.key,
      type: "tel",
      icon: Home2,
      value: "",
      error: "",
    }))
  );

  useEffect(() => {
    const hasNegative = inputs.some((inp) => inp.value !== "" && Number(inp.value) < 0);

    setDisabledNext(!areInputsValid(inputs) || hasNegative);
  }, [inputs, setDisabledNext]);

  return (
    <>
      <p className="text-h6">لطفا اطلاعات زیر را کامل کنید</p>

      <div className="w-full grid min-[450px]:grid-cols-[repeat(auto-fit,minmax(320px,auto))] gap-4 lg:gap-y-14 mt-10">
        {inputs.map((e, index) => (
          <Input key={index} inputClassName="h-12 w-full" Icon={e.icon} label={e.label} id={e.id} name={e.name} type={e.type} value={e.value} onChange={(i) => handleInputChange(inputs, setInputs, e.name, i.target.value, "just_number")} error={""} ResetValue={() => resetInputValue(inputs, setInputs, e.name)} />
        ))}
      </div>
    </>
  );
};

export default Step3;
