import { shahr } from "iran-cities-json";
import type { LatLngTuple } from "leaflet";
import { navHeader } from "./path";

export const ClearSearchParams = (): string => {
  if (typeof window === "undefined") return navHeader[0].path;
  const params = new URLSearchParams(window.location.search);
  const filter = params.get("filter");
  const limit = params.get("limit");
  Array.from(params.keys()).forEach((key) => {
    if (key !== "filter" && key !== "limit") params.delete(key);
  });
  if (filter) params.set("filter", filter);
  if (limit) params.set("limit", limit);
  return `${navHeader[0].path}?${params.toString()}`;
};

export const cancleCode = async (phone_number: string) => {
  await fetch("/api/otp/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone_number: phone_number }),
  });
};

export const returnCity = (filterShahr: string): string[] => {
  return Array.from(new Set(shahr.filter((e) => e.name.includes(filterShahr) && !/\d/.test(e.name)).map((e) => e.name)));
};

export const centerMap: LatLngTuple = [35.70012188169109, 51.338024913086606];
