"use client";
import { HomeType } from "@/types/types";
import HomeCard from "@/components/common/HomeCard";
import useSWR from "swr";
import HomeCardSkeleton from "@/components/skeleton/HomeCardSkeleton";
import { useEffect, useState } from "react";
import ErrorUi from "@/components/ErrorUi";
import { useAuth } from "@/context/AuthProvider";
import { swrConfig } from "@/configs/swrConfig";
import { Messages } from "@/utils/messages";
import { path_user } from "@/utils/path";

const MyAdsComp = () => {
  const { user } = useAuth();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data, isValidating, error, mutate } = useSWR<HomeType[]>(`/api/home?userId=${user?._id}`, swrConfig.fetcher, swrConfig);

  if (!isClient) return null;

  if (error)
    return (
      <ErrorUi
        title={Messages.unknownError.title}
        description={Messages.unknownError.description}
        img={null}
        btn={{
          label: Messages.unknownError.btnLabel,
          action: {
            onClick: () => mutate(),
          },
        }}
      />
    );

  if (isValidating)
    return (
      <>
        <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(320px,auto))] rounded-2xl min-[1128px]:bg-white min-[1128px]:p-6 justify-center min-[720px]:justify-between gap-10">
          {Array.from({ length: 3 }).map((_, i) => (
            <HomeCardSkeleton key={i} />
          ))}
        </div>
      </>
    );

  if (!data || data.length === 0)
    return (
      <ErrorUi
        title={Messages.myAds.title}
        description={Messages.myAds.description}
        btn={{
          label: Messages.myAds.btnLabel,
          action: {
            path: path_user[1].pathname,
          },
        }}
        img={{ src: "/images/illustrations/no-ads.png", alt: Messages.myAds.title }}
      />
    );

  return (
    <div className={`w-full mt-8 grid grid-cols-[repeat(auto-fit,minmax(320px,auto))] justify-center rounded-2xl min-[1128px]:bg-white min-[1128px]:p-6 ${data.length >= 4 ? "min-[720px]:justify-between" : "min-[720px]:justify-start"} gap-10`}>
      {data.map((e) => (
        <HomeCard key={String(e._id)} border statusUi {...e} />
      ))}
    </div>
  );
};

export default MyAdsComp;
