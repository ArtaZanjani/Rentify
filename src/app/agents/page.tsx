import { navHeader } from "@/utils/path";
import AgentCard from "@/components/common/AgentCard";
import connectToDB from "@/configs/connectToDB";
import UserModel from "@/models/UserModel";
import { ParamsProps, UserType } from "@/types/types";
import LimitBtn from "@/components/common/LimitBtn";
import { Metadata } from "next";
import { agentSortArr } from "@/utils/countOccurrences";
import SetSort from "@/base/SetSort";

export const metadata: Metadata = navHeader[1].metaData;

export const dynamic = "force-dynamic";

const Agents = async ({ searchParams }: ParamsProps) => {
  await connectToDB();
  const { sort, limit } = (await searchParams) ?? {};
  const sortOption: Record<string, 1 | -1> = {};
  const parsedLimit = Number(limit) || 4;

  if (sort === agentSortArr[0].value) {
    sortOption._id = -1;
  } else if (sort === agentSortArr[1].value) {
    sortOption._id = 1;
  } else if (sort === agentSortArr[2].value) {
    sortOption.homeCount = -1;
  } else {
    sortOption._id = 1;
  }

  const users = await UserModel.aggregate([
    { $match: { role: "OFFICE" } },
    {
      $lookup: {
        from: "homes",
        localField: "_id",
        foreignField: "postedBy",
        as: "homes",
      },
    },
    {
      $addFields: {
        homeCount: { $size: "$homes" },
      },
    },
    {
      $project: {
        logo: 1,
        office_name: 1,
        phone_number: 1,
        homeCount: 1,
      },
    },
    { $sort: sortOption },
    { $limit: parsedLimit },
  ]);

  const userCount = await UserModel.countDocuments({ role: "OFFICE" });
  const parsedData: Pick<UserType, "_id" | "phone_number" | "office_name" | "logo">[] = JSON.parse(JSON.stringify(users));

  return (
    <>
      <SetSort sort={Array.isArray(sort) ? sort[0] : sort} pathname={`?sort=${agentSortArr[1].value}`} />
      <div className={`w-full grid grid-cols-[repeat(auto-fit,minmax(268,auto))] justify-center ${parsedData.length >= 4 ? "min-[720px]:justify-between" : "min-[720px]:justify-start"} gap-10 mt-7`}>
        {parsedData.map((e) => (
          <AgentCard key={e._id} {...e} />
        ))}
      </div>

      {parsedLimit < userCount && <LimitBtn limit={parsedLimit} label="نمایش مشاورین املاک بیشتر" />}
    </>
  );
};

export default Agents;
