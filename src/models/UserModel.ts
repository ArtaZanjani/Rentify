import mongoose, { Document, Model, Types } from "mongoose";
import { UserType } from "@/types/types";
import { ROLES } from "@/utils/countOccurrences";
import { mongooseDuplicateError } from "@/utils/messages";


type UserTypeWithoutId = Omit<UserType, "_id">;

interface UserDocument extends UserTypeWithoutId, Document {
  _id: Types.ObjectId;
}

const schema = new mongoose.Schema<UserDocument>({
  name: {
    type: String,
    required: [true, mongooseDuplicateError.name],
  },
  last_name: {
    type: String,
    required: [true, mongooseDuplicateError.last_name],
  },
  office_name: {
    type: String,
    default: undefined,
  },
  phone_number: {
    type: String,
    required: [true, mongooseDuplicateError.phone_number],
  },
  role: {
    type: String,
    enum: ROLES,
    default: "USER",
  },
  logo: {
    type: String,
    default: undefined,
  },
  refreshToken: {
    type: String,
    required: [true, "وارد کردن رفرش توکن الزامی است"],
  },
  banTime: {
    type: Date,
    default: undefined,
  },
  isBanned: {
    type: Boolean,
    default: undefined,
  },
});

const model: Model<UserDocument> = mongoose.models.User ?? mongoose.model<UserDocument>("User", schema);

export default model;
