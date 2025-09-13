import AnimateLayout from "@/components/AnimateLayout";
import MyAdsComp from "@/components/dashboard/shared/MyAdsComp";
import { path_user } from "@/utils/path";
import { Metadata } from "next";

export const metadata: Metadata = path_user[3].metaData;
export const dynamic = "force-dynamic";

const MyAds = () => {
  return (
    <AnimateLayout heading={path_user[3].metaData.title}>
      <MyAdsComp />
    </AnimateLayout>
  );
};

export default MyAds;
