"use client";
import { InputTypes } from "@/types/types";
import Input from "../common/Input";
import { Dispatch, SetStateAction, useState } from "react";
import { Add } from "iconsax-react";
import { handleInputChange, resetInputValue } from "@/utils/form";
import { IMAGE_EXTENSIONS } from "@/utils/countOccurrences";
import { uploadLogoValidation } from "@/utils/validation";
import Image from "next/image";
import { toast } from "sonner";

type InputsDataPropsType = {
  inputs: InputTypes[];
  setInputs: Dispatch<SetStateAction<InputTypes[]>>;
  setImage: Dispatch<SetStateAction<File | undefined>>;
};

const InputsData = ({ inputs, setInputs, setImage }: InputsDataPropsType) => {
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isValid = uploadLogoValidation(file);
      if (isValid.statusCode !== 200) {
        toast.error(isValid.message);
        setImagePreview(undefined);
        setImage(undefined);
      } else {
        setImage(file);
        const objectUrl = URL.createObjectURL(file);
        setImagePreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
      }
    } else {
      setImagePreview(undefined);
      setImage(undefined);
    }
  };
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col items-center md:flex-row gap-5">
        {inputs.map((e, index) => (
          <Input key={index} inputClassName="h-12 w-full" divClassName={`${e.name === "shortDesciption" ? "flex-1 max-md:w-full" : "w-full md:w-80"}`} labelBgColor="bg-gray" Icon={e.icon} label={e.label} id={e.id} name={e.name} type={e.type} value={e.value} onChange={(i) => handleInputChange(inputs, setInputs, e.name, i.target.value, e.type === "tel" ? "just_number" : "any")} error={e.error} ResetValue={() => resetInputValue(inputs, setInputs, e.name)} />
        ))}
      </div>

      {imagePreview ? (
        <div className="mt-6 relative w-fit bg-g9 rounded-2xl">
          <button
            onClick={() => {
              setImagePreview(undefined);
              setImage(undefined);
            }}
            type="button"
            className="p-0.5 rounded-full flex items-center justify-center bg-states-error absolute -top-3 -left-3 z-10"
          >
            <Add className="size-8 stroke-white rotate-45" />
          </button>
          <div className="size-40 rounded-2xl overflow-hidden relative">
            <Image src={imagePreview} alt="Preview" className="object-cover" fill sizes="100%" priority />
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <label htmlFor="BlogBanner" className="px-4 py-3 border rounded-2xl border-g8 hover:bg-g8 cursor-pointer">
            اپلود عکس
          </label>
          <input type="file" className="hidden" id="BlogBanner" name="BlogBanner" accept={IMAGE_EXTENSIONS.join(",")} onChange={handleImageChange} />{" "}
        </div>
      )}
    </div>
  );
};

export default InputsData;
