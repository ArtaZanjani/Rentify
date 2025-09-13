"use client";
import { useWishlist } from "@/context/WishlistProvider";
import { HomeType } from "@/types/types";
import HomeCard from "@/components/common/HomeCard";
import useSWR from "swr";
import HomeCardSkeleton from "@/components/skeleton/HomeCardSkeleton";
import { useEffect, useState } from "react";
import ErrorUi from "@/components/ErrorUi";
import { swrConfig } from "@/configs/swrConfig";
import { Messages } from "@/utils/messages";
import { navHeader } from "@/utils/path";

const WishListComp = () => {
  const { wishlist } = useWishlist();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data, isValidating, error, mutate } = useSWR<HomeType[]>(`/api/home?ids=${wishlist.join(",")}`, swrConfig.fetcher, swrConfig);

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
          {Array.from({ length: wishlist.length - 1 || 3 }).map((_, i) => (
            <HomeCardSkeleton key={i} />
          ))}
        </div>
      </>
    );

  if (!data || data.length === 0)
    return (
      <ErrorUi
        title={Messages.wishList.title}
        description={Messages.wishList.description}
        btn={{
          label: Messages.wishList.btnLabel,
          action: {
            path: navHeader[0].path,
          },
        }}
        img={{ src: "/images/illustrations/wish-list.png", alt: Messages.wishList.title }}
      />
    );

  return (
    <div className={`w-full grid grid-cols-[repeat(auto-fit,minmax(320px,auto))] justify-center ${data.length >= 4 ? "min-[720px]:justify-between" : "min-[720px]:justify-start"} gap-10`}>
      {data.map((e) => (
        <HomeCard key={String(e._id)} border {...e} />
      ))}
    </div>
  );
};

export default WishListComp;
