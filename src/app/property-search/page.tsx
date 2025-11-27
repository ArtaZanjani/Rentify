import connectToDB from "@/configs/connectToDB";
import HomeModel from "@/models/HomeModel";
import type { HomeType, ParamsProps } from "@/types/types";
import type { FilterQuery } from "mongoose";
import UserModel from "@/models/UserModel";
import type { Metadata } from "next";
import { ROLES, sortArr } from "@/utils/countOccurrences";
import ErrorUi from "@/components/ErrorUi";
import { Messages } from "@/utils/messages";
import { ClearSearchParams } from "@/utils/utils";
import HomesShow from "@/components/shared/HomesShow/HomesShow";
import { navHeader } from "@/utils/path";
import SetSort from "@/base/SetSort";
export const dynamic = "force-dynamic";

export const metadata: Metadata = navHeader[0].metaData;

const Rent = async ({ searchParams }: ParamsProps) => {
  await connectToDB();

  const body = (await searchParams) ?? {};

  const filter = body.filter as string | undefined;
  const sortOption: Record<string, 1 | -1> = {};

  if (filter === sortArr[0].value) {
    sortOption._id = -1;
  } else if (filter === sortArr[1].value) {
    sortOption.rent = 1;
  } else if (filter === sortArr[2].value) {
    sortOption.rent = -1;
  } else {
    sortOption._id = -1;
  }

  const houseParam = body.house;
  const cityParam = body.city;
  const depositMin = body.depositMin ? Number(body.depositMin) : undefined;
  const depositMax = body.depositMax ? Number(body.depositMax) : undefined;
  const rentMin = body.rentMin ? Number(body.rentMin) : undefined;
  const rentMax = body.rentMax ? Number(body.rentMax) : undefined;
  const areaMin = body.areaMin ? Number(body.areaMin) : undefined;
  const areaMax = body.areaMax ? Number(body.areaMax) : undefined;
  const bedroomParam = body.rooms;
  const limit = body.limit ? Math.max(Number(body.limit), 4) : 4;

  const houseFilter = houseParam ? (Array.isArray(houseParam) ? houseParam : [houseParam]) : [];

  const cityFilter = cityParam ? (Array.isArray(cityParam) ? cityParam : [cityParam]) : [];

  const query: FilterQuery<HomeType> = {
    status: "active",
  };
  if (houseFilter.length) query.propertyType = { $in: houseFilter };
  if (cityFilter.length) query.city = { $in: cityFilter };

  if (depositMin !== undefined || depositMax !== undefined) {
    query.deposit = {};
    if (depositMin !== undefined) query.deposit.$gte = depositMin;
    if (depositMax !== undefined) query.deposit.$lte = depositMax;
  }

  if (rentMin !== undefined || rentMax !== undefined) {
    query.rent = {};
    if (rentMin !== undefined) query.rent.$gte = rentMin;
    if (rentMax !== undefined) query.rent.$lte = rentMax;
  }

  if (areaMin !== undefined || areaMax !== undefined) {
    query["information.area"] = {};
    if (areaMin !== undefined) query["information.area"].$gte = areaMin;
    if (areaMax !== undefined) query["information.area"].$lte = areaMax;
  }

  if (bedroomParam) {
    const bedroomFilter = Array.isArray(bedroomParam) ? bedroomParam.map(Number) : [Number(bedroomParam)];
    query["information.bedroom"] = { $in: bedroomFilter };
  }

  const booleanFilters: Record<string, string> = {
    elevator: "amenities.elevator",
    parking: "amenities.parking",
    warehouse: "amenities.warehouse",
    onlyAgency: "postedBy",
    hasImage: "images",
  };

  let agencyIds: string[] | null = null;

  if (body.onlyAgency === "true") {
    const agencyUsers = await UserModel.find({ role: ROLES[2] }, "-__v -refreshToken").select("_id");
    agencyIds = agencyUsers.map((u) => String(u._id));
  }

  for (const key in booleanFilters) {
    const value = body[key];
    if (value === "true") {
      const field = booleanFilters[key];
      if (key === "onlyAgency" && agencyIds) {
        query[field] = { $in: agencyIds };
      } else if (key === "hasImage") {
        query[field] = { $exists: true, $ne: [] };
      } else {
        query[field] = true;
      }
    }
  }

  const homes = await HomeModel.find(query).sort(sortOption).limit(limit);
  const parsedData: HomeType[] = JSON.parse(JSON.stringify(homes));
  const totalHomesCount = await HomeModel.countDocuments(query);

  const searchParamsString = new URLSearchParams(Object.entries(body).flatMap(([key, value]) => (Array.isArray(value) ? value.map((v) => [key, v]) : [[key, value!]]))).toString();

  return (
    <>
      <SetSort sort={filter} pathname={`?filter=${sortArr[0].value}&${searchParamsString}`} />
      {parsedData && parsedData.length ? (
        <HomesShow parsedData={parsedData} limit={limit} totalHomesCount={totalHomesCount} label="نمایش آگهی‌های بیشتر" />
      ) : (
        <ErrorUi
          title={Messages.noHomesFound.title}
          description={Messages.noHomesFound.description}
          btn={{
            label: Messages.noHomesFound.btnLabel,
            action: {
              path: ClearSearchParams(),
              navigate: "replace",
            },
          }}
          img={{ src: "/images/illustrations/Empty-cuate.png", alt: "خانه ای یافت نشد!" }}
        />
      )}
    </>
  );
};

export default Rent;
