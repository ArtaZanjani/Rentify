import AnimateLayout from "@/components/AnimateLayout";
import RegisterAdsComp from "@/components/dashboard/shared/RegisterAdsComp";
import { path_user } from "@/utils/path";
import type { Metadata } from "next";
export const metadata: Metadata = path_user[1].metaData;
export const dynamic = "force-dynamic";

const RegisterAds = () => {
  return (
    <AnimateLayout>
      <RegisterAdsComp />
    </AnimateLayout>
  );
};

export default RegisterAds;
