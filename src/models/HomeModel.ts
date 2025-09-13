import mongoose, { Document, Model } from "mongoose";
import type { HomeType } from "@/types/types";

export interface IHome extends Omit<HomeType, "_id">, Document {}

const InformationSchema = new mongoose.Schema(
  {
    bedroom: { type: Number, required: [true, "لطفاً تعداد اتاق خواب را وارد کنید."], min: [0, "تعداد اتاق خواب نمی‌تواند منفی باشد."] },
    bathroom: { type: Number, required: [true, "لطفاً تعداد سرویس بهداشتی را وارد کنید."], min: [0, "تعداد سرویس بهداشتی نمی‌تواند منفی باشد."] },
    buildingAge: { type: Number, required: [true, "لطفاً سن بنا را وارد کنید."], min: [0, "سن بنا نمی‌تواند منفی باشد."] },
    landArea: { type: Number, required: [true, "لطفاً مساحت زمین را وارد کنید."], min: [0, "مساحت زمین نمی‌تواند منفی باشد."] },
    area: { type: Number, required: [true, "لطفاً زیر بنا را وارد کنید."], min: [0, "زیر بنا نمی‌تواند منفی باشد."] },
    floor: { type: Number, required: [true, "لطفاً طبقه را وارد کنید."], min: [0, "طبقه نمی‌تواند منفی باشد."] },
    totalFloors: { type: Number, required: [true, "لطفاً تعداد طبقات را وارد کنید."], min: [0, "تعداد طبقات نمی‌تواند منفی باشد."] },
    unitsPerFloor: { type: Number, required: [true, "لطفاً تعداد واحد هر طبقه را وارد کنید."], min: [0, "تعداد واحد هر طبقه نمی‌تواند منفی باشد."] },
  },
  { _id: false }
);

const AmenitiesSchema = new mongoose.Schema(
  {
    elevator: { type: Boolean, default: false },
    parking: { type: Boolean, default: false },
    warehouse: { type: Boolean, default: false },
    builtInCloset: { type: Boolean, default: false },
    painting: { type: Boolean, default: false },
    terrace: { type: Boolean, default: false },
    securityDoor: { type: Boolean, default: false },
    videoIntercom: { type: Boolean, default: false },
    cctv: { type: Boolean, default: false },
    westernToilet: { type: Boolean, default: false },
    wallpaper: { type: Boolean, default: false },
    gasStove: { type: Boolean, default: false },
    hood: { type: Boolean, default: false },
    masterBathroom: { type: Boolean, default: false },
    swimmingPool: { type: Boolean, default: false },
    sauna: { type: Boolean, default: false },
    jacuzzi: { type: Boolean, default: false },
    lobby: { type: Boolean, default: false },
    roofGarden: { type: Boolean, default: false },
    gym: { type: Boolean, default: false },
    chiller: { type: Boolean, default: false },
    evaporativeCooler: { type: Boolean, default: false },
    heater: { type: Boolean, default: false },
    packageUnit: { type: Boolean, default: false },
    radiator: { type: Boolean, default: false },
    waterHeater: { type: Boolean, default: false },
    airConditioner: { type: Boolean, default: false },
    centralHeating: { type: Boolean, default: false },
    underfloorHeating: { type: Boolean, default: false },
    airHandler: { type: Boolean, default: false },
  },
  { _id: false }
);

const schema = new mongoose.Schema<IHome>(
  {
    propertyType: {
      type: String,
      required: [true, "لطفاً نوع ملک را انتخاب کنید."],
      enum: ["ویلا", "آپارتمان", "خانه ویلایی"],
      trim: true,
    },
    transactionType: {
      type: String,
      required: [true, "لطفاً نوع معامله را انتخاب کنید."],
      enum: ["خرید", "فروش", "رهن", "اجاره"],
      trim: true,
    },
    deposit: { type: Number, required: [true, "لطفاً مبلغ رهن را وارد کنید."], min: [0, "رهن نمی‌تواند منفی باشد."] },
    rent: { type: Number, required: [true, "لطفاً مبلغ اجاره را وارد کنید."], min: [0, "اجاره نمی‌تواند منفی باشد."] },
    isConvertible: { type: Boolean, default: false },
    city: { type: String, required: [true, "لطفاً شهر ملک را وارد کنید."], trim: true },
    subStreet: { type: String, required: [true, "لطفاً خیابان فرعی یا کوچه ملک را وارد کنید."], trim: true },
    neighborhood: { type: String, required: [true, "لطفاً محله ملک را وارد کنید."], trim: true },
    fullAddress: { type: String, required: [true, "لطفاً محله، آدرس دقیق و پلاک ملک را وارد کنید."], trim: true },
    map: {
      type: [Number],
      required: [true, "لطفاً مختصات جغرافیایی ملک را وارد کنید."],
      validate: {
        validator: function (v: number[]) {
          return v.length === 2;
        },
        message: "مختصات باید شامل عرض و طول جغرافیایی باشد.",
      },
    },
    information: { type: InformationSchema, required: true },
    amenities: { type: AmenitiesSchema, required: true },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    viewCount: { type: Number, default: 0 },
    description: {
      type: String,
      default: undefined,
    },
    images: { type: [String], default: undefined },
    status: {
      type: String,
      enum: ["active", "pending", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const model: Model<IHome> = mongoose.models.Home ?? mongoose.model<IHome>("Home", schema);
export default model;
