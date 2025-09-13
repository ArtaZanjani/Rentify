"use client";
import PostedBy from "@/components/PropertyDetail/PostedBy";
import PropertyDetail from "@/components/PropertyDetail/PropertyDetail";
import CardSlider from "@/components/CardSlider";
import Slider from "@/components/PropertyDetail/Slider";
import SectionBase from "@/components/common/SectionBase";
import { navHeader } from "@/utils/path";

const loading = () => {
  return (
    <>
      <div className="flex flex-col w-full pt-12 bg-white padding-body gap-y-10 pb-14 animate-pulse">
        <Slider isLoading />

        <div className="w-full flex max-[1082px]:flex-col-reverse items-start gap-6">
          <PropertyDetail isLoading />

          <PostedBy isLoading />
        </div>
      </div>

      <SectionBase href={navHeader[0].path} title="خانه هایی با ارزش مشابه" element="h3">
        <CardSlider isLoading homes={[0, 1, 2, 3]} />
      </SectionBase>
    </>
  );
};

export default loading;
