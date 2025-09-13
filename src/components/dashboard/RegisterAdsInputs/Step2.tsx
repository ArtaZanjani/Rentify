"use client";
import type { InputTypes, StepCompPropsType } from "@/types/types";
import { useEffect, useState } from "react";
import { Home2 } from "iconsax-react";
import Input from "@/components/common/Input";
import { areInputsValid, handleInputChange, resetInputValue, normalize } from "@/utils/form";
import { returnCity } from "@/utils/utils";
import dynamic from "next/dynamic";
import { LatLngTuple } from "leaflet";

const Map = dynamic(() => import("@/components/map/Map"), {
  ssr: false,
});

interface Step2PropsType extends StepCompPropsType {
  activePage: boolean;
}

const Step2 = ({ setDisabledNext, activePage }: Step2PropsType) => {
  const [inputs, setInputs] = useState<InputTypes[]>([
    {
      label: "شهر",
      name: "city",
      id: "city",
      type: "text",
      icon: Home2,
      value: "",
      error: "",
      DropDown: returnCity("").map((h) => ({
        label: h,
        onClick: () => {
          handleInputChange(inputs, setInputs, "city", h, "any");
        },
      })),
    },
    {
      label: "خیابان فرعی یا کوچه",
      name: "subStreet",
      id: "subStreet",
      type: "text",
      icon: Home2,
      value: "",
      error: "",
    },
    {
      label: "خیابان یا محله‌ی اصلی",
      name: "neighborhood",
      id: "neighborhood",
      type: "text",
      icon: Home2,
      value: "",
      error: "",
    },
    {
      label: "آدرس دقیق و پلاک",
      name: "fullAddress",
      id: "fullAddress",
      type: "text",
      icon: Home2,
      value: "",
      error: "",
    },
  ]);

  const [mapPosition, setMapPosition] = useState<LatLngTuple | null>(null);

  useEffect(() => {
    setDisabledNext(!areInputsValid(inputs) || !mapPosition);
  }, [inputs, setDisabledNext, mapPosition]);

  return (
    <>
      <p className="text-h6">لطفا اطلاعات زیر را کامل کنید</p>

      <div className="w-full grid min-[450px]:grid-cols-[repeat(auto-fit,minmax(320px,auto))] gap-4 lg:gap-y-14 mt-10">
        {inputs.map((e, index) => {
          const dropDownList =
            e.name === "city"
              ? returnCity(e.value).map((h) => ({
                  label: h,
                  onClick: () => {
                    handleInputChange(inputs, setInputs, "city", h, "any");
                  },
                }))
              : e.DropDown;

          const filterValue = dropDownList?.filter((i) => normalize(i.label).toLowerCase().includes(normalize(e.value).toLowerCase()));
          const notFound = dropDownList && e.value.length > 0 && filterValue?.length === 0;

          return (
            <Input
              key={index}
              DropDown={notFound ? [] : filterValue}
              inputClassName="h-12 w-full"
              Icon={e.icon}
              label={e.label}
              id={e.id}
              name={e.name}
              type={e.type}
              value={e.value}
              onChange={(i) => {
                handleInputChange(inputs, setInputs, e.name, i.target.value, "any");
              }}
              error={notFound ? "موردی یافت نشد" : e.error}
              ResetValue={() => resetInputValue(inputs, setInputs, e.name)}
            />
          );
        })}

        <input type="hidden" name="map" value={String(mapPosition)} />
      </div>

      {activePage && (
        <div className="w-full mt-10 overflow-hidden h-80 bg-g9 rounded-2xl">
          <Map onChange={setMapPosition} enableDragUpdates />
        </div>
      )}
    </>
  );
};

export default Step2;
