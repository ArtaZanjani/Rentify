"use client";
import { Equipment_Facilities } from "@/utils/Equipment_Facilities";
import CheckBox from "@/components/common/CheckBox";

const Step3 = () => {
  return (
    <>
      <p className="text-h6">تجهیزات و امکانت</p>

      <div className="w-full grid grid-cols-[auto_auto] min-[416px]:grid-cols-[repeat(auto-fit,minmax(128px,1fr))] lg:grid-cols-2 min-[1030px]:grid-cols-[repeat(auto-fit,minmax(128px,1fr))] gap-y-4 max-[416px]:justify-between min-[416px]:gap-x-20 mt-10">
        {Equipment_Facilities.map((e, index) => (
          <CheckBox key={index} id={e.enLabel} label={e.label} />
        ))}
      </div>
    </>
  );
};

export default Step3;
