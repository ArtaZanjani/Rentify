import UnderlineTabs from "@/components/common/UnderlineTabs";
import connectToDB from "@/configs/connectToDB";
import HomeModel from "@/models/HomeModel";
import UserModel from "@/models/UserModel";
import type { HomeType, ParamsProps, UserType } from "@/types/types";
import { isValidObjectId } from "mongoose";
import { sortArr } from "@/utils/countOccurrences";
import ErrorUi from "@/components/ErrorUi";
import HomesShow from "@/components/shared/HomesShow/HomesShow";
import { Metadata } from "next";
import { Messages } from "@/utils/messages";
import SetSort from "@/base/SetSort";
export const dynamic = "force-dynamic";

const fetchAgentById = async (id: string): Promise<UserType | null> => {
  if (!id || !isValidObjectId(id)) return null;

  await connectToDB();

  const user = await UserModel.findOne({ _id: id, role: "OFFICE" }, "-__v -refreshToken");

  if (!user) return null;

  return JSON.parse(JSON.stringify(user));
};

const Agent = async ({ params, searchParams }: ParamsProps) => {
  const id = (await params)?.id ?? "";
  const user = await fetchAgentById(id);

  if (!user) {
    return (
      <ErrorUi
        title={Messages["404_Agent"].title}
        description={Messages["404_Agent"].description}
        btn={{
          label: Messages["404_Agent"].btnLabel,
          action: { path: "/agents", navigate: "replace" },
        }}
        img={{ src: "/images/illustrations/404.png", alt: "404" }}
      />
    );
  }

  const { limit, sort } = (await searchParams) ?? {};
  const parsedLimit = Number(limit) || 4;

  const sortOption: Record<string, 1 | -1> = {};

  if (sort === sortArr[0].value) {
    sortOption._id = -1;
  } else if (sort === sortArr[1].value) {
    sortOption.rent = 1;
  } else if (sort === sortArr[2].value) {
    sortOption.rent = -1;
  } else {
    sortOption._id = -1;
  }

  const homes = await HomeModel.find({ postedBy: id }).sort(sortOption).limit(parsedLimit);
  const totalHomesCount = await HomeModel.countDocuments({ postedBy: id });
  const parsedData: HomeType[] = JSON.parse(JSON.stringify(homes));

  return (
    <>
      <SetSort sort={Array.isArray(sort) ? sort[0] : sort} pathname={`?sort=${sortArr[0].value}`} />

      <h1 className="font-bold text-3xl max-[720px]:text-center max-[420px]:text-[28px]">{user?.office_name}</h1>

      <UnderlineTabs tabs={sortArr} paramsValue="sort" className="mt-10" />

      {parsedData && parsedData.length ? (
        <HomesShow parsedData={parsedData} limit={parsedLimit} totalHomesCount={totalHomesCount} label="نمایش آگهی‌های بیشتر" />
      ) : (
        <ErrorUi
          title={Messages.noBlogs.title}
          description={Messages.noBlogs.description}
          btn={{
            label: Messages.noBlogs.btnLabel,
            action: {
              path: "/agents",
            },
          }}
          img={{ src: "/images/illustrations/Empty-cuate.png", alt: "خانه‌ای یافت نشد!" }}
        />
      )}
    </>
  );
};

export default Agent;

export const generateMetadata = async ({ params }: ParamsProps): Promise<Metadata> => {
  const id = (await params)?.id ?? "";
  const user = await fetchAgentById(id);

  if (!user) {
    return {
      title: Messages["404_Agent"].title,
    };
  }

  return {
    title: user?.office_name,
  };
};
