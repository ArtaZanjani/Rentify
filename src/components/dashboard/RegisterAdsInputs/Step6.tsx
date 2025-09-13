"use client";
import { useState } from "react";
import { Image as ImageIcon, Add } from "iconsax-react";
import { IMAGE_EXTENSIONS } from "@/utils/countOccurrences";
import { validateFiles } from "@/utils/validation";
import Image from "next/image";
import { toast } from "sonner";

interface Step6Props {
  images: File[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
}

const Step6 = ({ images, setImages }: Step6Props) => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const result = validateFiles(fileArray);

    if (result.status === 200) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }

    const selected = result.files.slice(0, 5 - images.length);
    setImages((prev) => [...prev, ...selected]);
    setImagePreviews((prev) => [...prev, ...selected.map((f) => URL.createObjectURL(f))]);
  };

  const FileUploadBox = ({ index }: { index?: number }) => {
    const preview = imagePreviews[index!];
    const onRemove = () => removeImage(index!);

    return (
      <div className="relative">
        {preview && (
          <div onClick={onRemove} className="absolute z-10 flex items-center justify-center rounded-full cursor-pointer -top-2 -left-2 size-7 bg-states-error1">
            <Add className="rotate-45 size-6 stroke-white" />
          </div>
        )}
        <label className="relative flex items-center justify-center overflow-hidden rounded-lg InputFile max-[446px]:aspect-square min-[446px]:h-36 cursor-pointer">
          {preview ? <Image fill sizes="100%" priority src={preview} className="object-cover w-full h-full" alt={`preview-${index}`} /> : <ImageIcon className="size-11 stroke-g5" />}
          <input name="input_images" type="file" className="hidden" multiple accept={IMAGE_EXTENSIONS.join(",")} onChange={(e) => handleFiles(e)} />
        </label>
      </div>
    );
  };

  return (
    <>
      <p className="text-h6">عکس‌‌ها و ویدیٔو ملک خود را بارگذاری کنید</p>
      <div className="w-full grid max-[446px]:grid-cols-2 grid-cols-[repeat(auto-fit,minmax(175px,auto))] gap-4 mt-6">
        {Array.from({ length: 5 }, (_, i) => (
          <FileUploadBox key={i} index={i} />
        ))}
      </div>

      <div className="mt-6 space-y-3">
        <p className="text-caption-lg text-g2">فرمت عکس‌ها باید webp، jpg، jpeg یا png باشد. </p>
      </div>
    </>
  );
};

export default Step6;
