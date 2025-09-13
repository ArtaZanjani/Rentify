import type { roleTypes } from "@/types/types";

const HOUSE_TYPES: string[] = ["آپارتمان", "ویلا", "خانه ویلایی"] as const;
const TRANSACTION_TYPES: string[] = ["خرید", "فروش", "رهن", "اجاره"] as const;
const ROLES: roleTypes[] = ["ADMIN", "USER", "OFFICE"] as const;
const ALLOWED_IMAGE_TYPES: string[] = ["image/jpeg", "image/jpg", "image/png", "image/webp"] as const;
const MAX_IMAGE_SIZE: number = 100 * 1024;
const IMAGE_EXTENSIONS = ALLOWED_IMAGE_TYPES.map((type) => type.replace(/^image\//, "."));
const banTimes = ["حذف از بن", "1 روز", "3 روز", "7 روز", "14 روز", "30 روز", "90 روز", "120 روز", "دائمی"];
const STATUS = ["active", "pending", "rejected"];
const translateRole = {
  ADMIN: "ادمین",
  USER: "کاربر عادی",
  OFFICE: "آژانس املاک",
};

const sortArr = [
  { label: "بروزترین", value: "latest" },
  { label: "ارزان ترین", value: "cheapest" },
  { label: "گران ترین", value: "most-expensive" },
];

const agentSortArr = [
  { label: "جدید ترین", value: "latest" },
  { label: "قدیمی ترین", value: "oldest" },
  { label: "بیشترین آگهی", value: "most-ads" },
];

export { HOUSE_TYPES, TRANSACTION_TYPES, ROLES, ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE, IMAGE_EXTENSIONS, banTimes, STATUS, translateRole, sortArr, agentSortArr };
