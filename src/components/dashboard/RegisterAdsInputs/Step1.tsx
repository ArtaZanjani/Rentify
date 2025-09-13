"use client";
import type { InputTypes, StepCompPropsType } from "@/types/types";
import { useEffect, useState } from "react";
import { Home2, CardCoin, Money } from "iconsax-react";
import Input from "@/components/common/Input";
import { areInputsValid, handleInputChange, resetInputValue, normalize } from "@/utils/form";
import { HOUSE_TYPES, TRANSACTION_TYPES } from "@/utils/countOccurrences";
import CheckBox from "@/components/common/CheckBox";

const Step1 = ({ setDisabledNext }: StepCompPropsType) => {
  const [inputs, setInputs] = useState<InputTypes[]>([
    {
      label: "نوع ملک",
      name: "propertyType",
      id: "property-type",
      type: "text",
      icon: Home2,
      value: "",
      error: "",
      DropDown: HOUSE_TYPES.map((h) => ({
        label: h,
        onClick: () => {
          handleInputChange(inputs, setInputs, "propertyType", h, "any");
        },
      })),
    },
    {
      label: "نوع معامله",
      name: "transactionType",
      id: "transaction-type",
      type: "text",
      icon: CardCoin,
      value: "",
      error: "",
      DropDown: TRANSACTION_TYPES.map((t) => ({
        label: t,
        onClick: () => {
          handleInputChange(inputs, setInputs, "transactionType", t, "any");
        },
      })),
    },
    {
      label: "رهن",
      name: "deposit",
      id: "deposit",
      type: "tel",
      icon: Money,
      value: "",
      error: "",
    },
    {
      label: "اجاره",
      name: "rent",
      id: "rent",
      type: "tel",
      icon: Money,
      value: "",
      error: "",
    },
  ]);

  useEffect(() => {
    setDisabledNext(!areInputsValid(inputs));
  }, [inputs, setDisabledNext]);

  return (
    <>
      <p className="text-h6">لطفا اطلاعات زیر را کامل کنید</p>

      <div className="w-full grid min-[450px]:grid-cols-[repeat(auto-fit,minmax(320px,auto))] gap-4 lg:gap-y-14 mt-10">
        {inputs.map((e, index) => {
          const filterValue = e.DropDown?.filter((i) => normalize(i.label).toLowerCase().includes(normalize(e.value).toLowerCase()));
          const notFound = e.DropDown && e.value.length > 0 && filterValue?.length === 0;

          return <Input key={index} DropDown={notFound ? [] : filterValue} inputClassName="h-12 w-full" Icon={e.icon} label={e.label} id={e.id} name={e.name} type={e.type} value={e.value} onChange={(i) => handleInputChange(inputs, setInputs, e.name, i.target.value, e.type === "tel" ? "just_number" : "any")} error={notFound ? "موردی یافت نشد" : e.error} ResetValue={() => resetInputValue(inputs, setInputs, e.name)} />;
        })}
      </div>

      <CheckBox id="isConvertible" label="قابل تبدیل" className="mt-4" />
    </>
  );
};

export default Step1;
