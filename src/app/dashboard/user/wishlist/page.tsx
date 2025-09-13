import AnimateLayout from "@/components/AnimateLayout";
import WishListComp from "@/components/dashboard/shared/WishListComp";
import { path_user } from "@/utils/path";
import type { Metadata } from "next";
export const metadata: Metadata = path_user[2].metaData;
export const dynamic = "force-dynamic";

const WishList = () => {
  return (
    <>
      <AnimateLayout heading={path_user[2].metaData.title}>
        <div className="min-[1128px]:bg-white min-[1128px]:p-6 mt-8 rounded-2xl">
          <WishListComp />
        </div>
      </AnimateLayout>
    </>
  );
};

export default WishList;
