import mongoose, { Document, Model } from "mongoose";
import type { OTPType } from "@/types/types";
import { mongooseDuplicateError } from "@/utils/messages";

interface OTPDocument extends OTPType, Document {}

const schema = new mongoose.Schema<OTPDocument>(
  {
    phone_number: {
      type: String,
      required: [true, mongooseDuplicateError.phone_number],
    },
    code: {
      type: String,
      required: [true, "وارد کردن کد الزامی است"],
    },
    retry: {
      type: Number,
      default: 0,
    },
    banUntil: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const model: Model<OTPDocument> = mongoose.models.OTP ?? mongoose.model<OTPDocument>("OTP", schema);

export default model;
