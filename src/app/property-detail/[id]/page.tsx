import mongoose, { isValidObjectId } from "mongoose";
import connectToDB from "@/configs/connectToDB";
import HomeModel from "@/models/HomeModel";
import type { HomeType, ParamsProps } from "@/types/types";
import PropertyDetail from "@/components/PropertyDetail/PropertyDetail";
import CardSlider from "@/components/CardSlider";
import PostedBy from "@/components/PropertyDetail/PostedBy";
import "@/models/UserModel";
import Slider from "@/components/PropertyDetail/Slider";
import SectionBase from "@/components/common/SectionBase";
import { authenticate } from "@/utils/auth/authenticate";
import AdminStatus from "@/components/PropertyDetail/AdminStatus";
import { Metadata } from "next";
import { navHeader } from "@/utils/path";
import { Messages } from "@/utils/messages";
import ErrorUi from "@/components/ErrorUi";

export const dynamic = "force-dynamic";

export const fetchHomeById = async (id: string): Promise<HomeType | null> => {
  if (!id || !isValidObjectId(id)) return null;

  await connectToDB();

  const home = await HomeModel.findById(id, "-v").populate("postedBy", "-v -refreshToken");
  if (!home) return null;

  return JSON.parse(JSON.stringify(home));
};

const Property_Detail = async ({ params }: ParamsProps) => {
  const id = (await params)?.id ?? "";
  const parsedData = await fetchHomeById(id);
  const result = await authenticate();

  if (!parsedData || (parsedData.status !== "active" && result?.user?.role !== "ADMIN")) {
    return (
      <ErrorUi
        title={Messages["404_Home"].title}
        description={Messages["404_Home"].description}
        btn={{
          label: Messages["404_Home"].btnLabel,
          action: { path: "/property-search", navigate: "replace" },
        }}
        img={{ src: "/images/illustrations/404.png", alt: "404" }}
      />
    );
  }

  parsedData.viewCount = (parsedData.viewCount ?? 0) + 1;
  await HomeModel.findByIdAndUpdate(id, { viewCount: parsedData.viewCount });

  const sameHome = await HomeModel.aggregate([
    {
      $match: {
        _id: { $ne: new mongoose.Types.ObjectId(parsedData._id) },
        city: parsedData.city,
      },
    },
    {
      $addFields: {
        depositDiff: { $abs: { $subtract: ["$deposit", parsedData.deposit] } },
        rentDiff: { $abs: { $subtract: ["$rent", parsedData.rent] } },
      },
    },
    {
      $addFields: {
        totalDiff: { $add: ["$depositDiff", "$rentDiff"] },
      },
    },
    {
      $sort: { totalDiff: 1, _id: -1 },
    },
    {
      $limit: 4,
    },
  ]);

  const sameHomeArr: HomeType[] = JSON.parse(JSON.stringify(sameHome));

  return (
    <>
      <div className="flex flex-col w-full pt-12 bg-white padding-body gap-y-10 pb-14">
        {result?.user?.role === "ADMIN" && parsedData.status === "pending" && <AdminStatus homeId={parsedData._id} />}
        {parsedData.images?.length ? <Slider isLoading={false} media={parsedData.images} /> : <Slider isLoading />}

        <div className="w-full flex max-[1082px]:flex-col-reverse items-start gap-6">
          <PropertyDetail isLoading={false} parsedData={parsedData} />
          <PostedBy isLoading={false} userData={parsedData.postedBy} homeId={parsedData._id} />
        </div>
      </div>

      <SectionBase href={navHeader[0].path} title="خانه هایی با ارزش مشابه" element="h3">
        <CardSlider isLoading={false} homes={sameHomeArr} />
      </SectionBase>
    </>
  );
};

export default Property_Detail;

export const generateMetadata = async ({ params }: ParamsProps): Promise<Metadata> => {
  const id = (await params)?.id ?? "";
  const parsedData: HomeType | null = await fetchHomeById(id);

  if (!parsedData) {
    return {
      title: Messages["404_Home"].title,
    };
  }

  return {
    title: `${parsedData.propertyType} ${parsedData.information.area} متری ${parsedData.city} محله ${parsedData.neighborhood.replace("محله", "")}`,
    ...(parsedData.description?.length ? { description: parsedData.description } : {}),
  };
};
