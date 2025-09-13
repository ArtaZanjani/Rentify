import connectToDB from "@/configs/connectToDB";
import type { Metadata } from "next";
import HomeModel from "@/models/HomeModel";
import HomeCard from "@/components/common/HomeCard";
import type { HomeType, ParamsProps } from "@/types/types";
import ErrorUi from "@/components/ErrorUi";
import LimitBtn from "@/components/common/LimitBtn";
import { Messages } from "@/utils/messages";
import { path_admin } from "@/utils/path";

export const metadata: Metadata = path_admin[2].metaData;

export const dynamic = "force-dynamic";
const UsersList = async ({ searchParams }: ParamsProps) => {
  await connectToDB();
  const limit = (await searchParams)?.limit;
  const parsedLimit = Number(limit) || 4;
  const homes = await HomeModel.find({ status: "pending" }).sort({ _id: 1 }).limit(parsedLimit);
  const parsedData: HomeType[] = JSON.parse(JSON.stringify(homes));
  const totalHomesCount = await HomeModel.countDocuments({ status: "pending" });

  return (
    <>
      {parsedData && homes.length ? (
        <div className="w-full mt-8 rounded-2xl min-[1128px]:bg-white pb-5">
          <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(320px,auto))] min-[1128px]:p-6 justify-center min-[720px]:justify-between gap-10">
            {parsedData.map((e) => (
              <HomeCard key={String(e._id)} statusUi border {...e} />
            ))}
          </div>

          {parsedLimit < totalHomesCount && <LimitBtn limit={parsedLimit} label="نمایش آگهی‌های بیشتر" />}
        </div>
      ) : (
        <div className="min-[1128px]:bg-white min-[1128px]:p-6 mt-8 rounded-2xl flex-1">
          <ErrorUi
            title={Messages.noPendingAds.title}
            description={Messages.noPendingAds.description}
            btn={{
              label: Messages.noPendingAds.btnLabel,
              action: { path: "/" },
            }}
            img={{
              src: "/images/illustrations/wish-list.png",
              alt: "صفحه اصلی",
            }}
          />
        </div>
      )}
    </>
  );
};

export default UsersList;
