import { FC, SVGProps } from "react";
import type { LatLngTuple } from "leaflet";

export type Amenities = {
  elevator: boolean; // آسانسور
  parking: boolean; // پارکینگ
  warehouse: boolean; // انباری
  builtInCloset: boolean; // کمد دیواری
  painting: boolean; // نقاشی
  terrace: boolean; // تراس
  securityDoor: boolean; // درب ضد سرقت
  videoIntercom: boolean; // آیفون تصویری
  cctv: boolean; // دوربین مدار بسته
  westernToilet: boolean; // سرویس فرنگی
  wallpaper: boolean; // کاغذ دیواری
  gasStove: boolean; // گاز رو میزی
  hood: boolean; // هود
  masterBathroom: boolean; // حمام مستر
  swimmingPool: boolean; // استخر
  sauna: boolean; // سونا
  jacuzzi: boolean; // جکوزی
  lobby: boolean; // لابی
  roofGarden: boolean; // روف گاردن
  gym: boolean; // سالن ورزش
  chiller: boolean; // چیلر
  evaporativeCooler: boolean; // کولر آبی
  heater: boolean; // بخاری
  packageUnit: boolean; // پکیج
  radiator: boolean; // رادیاتور
  waterHeater: boolean; // آبگرم کن
  airConditioner: boolean; // کولر گازی
  centralHeating: boolean; // شوفاژ
  underfloorHeating: boolean; // گرمایش از کف
  airHandler: boolean; // هواساز
};

type Information = {
  bedroom: number; // تعداد اتاق خواب
  bathroom: number; // سرویس بهداشتی
  buildingAge: number; // سن بنا
  landArea: number; // مساحت زمین
  area: number; // زیر بنا (متر)
  floor: number; // طبقه
  totalFloors: number; // تعداد طبقات
  unitsPerFloor: number; // تعداد واحد هر طبقه
};

export type HomeType = {
  _id: string;
  propertyType: "ویلا" | "آپارتمان" | "خانه ویلایی";
  transactionType: "خرید" | "فروش" | "رهن" | "اجاره";
  deposit: number;
  rent: number;
  isConvertible: boolean;
  city: string;
  subStreet: string;
  neighborhood: string;
  fullAddress: string;
  map: LatLngTuple;
  information: Information;
  amenities: Amenities;
  postedBy: UserType;
  description: string | undefined;
  viewCount: number;
  images?: string[] | undefined;
  status: "active" | "pending" | "rejected";
  createdAt: Date;
  updatedAt: Date;
};

export type roleTypes = "ADMIN" | "USER" | "OFFICE";

export type UserType = {
  _id: string;
  name: string;
  last_name: string;
  office_name: string | undefined;
  phone_number: string;
  role: roleTypes;
  logo: string;
  refreshToken: string;
  banTime: Date | undefined;
  isBanned: boolean | undefined;
};

export type DropDownItem = {
  label: string;
  onClick: () => void;
};
export type InputTypes = {
  label: string;
  name: string;
  id: string;
  type: string;
  icon: FC<SVGProps<SVGSVGElement>>;
  value: string;
  error: string;
  DropDown?: DropDownItem[];
};

export type OTPType = {
  phone_number: string;
  code: string;
  retry: number;
  banUntil: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type BlogType = {
  _id: string;
  image: string | undefined;
  title: string;
  shortDesciption: string;
  mainContent: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ContactUsTypes = {
  _id: string;
  name: UserType["name"];
  last_name: UserType["last_name"];
  phone_number: UserType["phone_number"];
  message: string;
};

export type ReservationDateTypes = {
  _id: string;
  pickedDate: { date: string; clock: string }[];
};

export type ParamsProps = {
  params?: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export type AuthTypes = {
  user?: UserType;
  isLogin: boolean;
  status?: number;
};

export type authenticateType = {
  user?: UserType;
  isLogin: boolean;
};

export type StepCompPropsType = {
  disabledNext?: boolean;
  setDisabledNext: (status: boolean) => void;
};

export type ActionState = {
  message: string;
  error: boolean;
};
