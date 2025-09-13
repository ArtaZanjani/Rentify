import mongoose, { Document, Model } from "mongoose";
import type { BlogType } from "@/types/types";
import { blogValidationErrors } from "@/constants/blogValidationErrors";

type BlogTypeWithoutId = Omit<BlogType, "_id" | "createdAt" | "updatedAt">;

export interface IBlog extends BlogTypeWithoutId, Document {}

const schema = new mongoose.Schema(
  {
    image: {
      type: String,
      default: undefined,
      trim: true,
    },
    title: {
      type: String,
      required: [true, blogValidationErrors.title.required!],
      trim: true,
      minlength: [5, blogValidationErrors.title.minLength!],
      maxlength: [100, blogValidationErrors.title.maxLength!],
    },
    shortDesciption: {
      type: String,
      required: [true, blogValidationErrors.shortDesciption.required!],
      trim: true,
      minlength: [10, blogValidationErrors.shortDesciption.minLength!],
      maxlength: [200, blogValidationErrors.shortDesciption.maxLength!],
    },
    mainContent: {
      type: String,
      required: [true, blogValidationErrors.mainContent.required!],
      trim: true,
    },
  },
  { timestamps: true }
);

const model: Model<IBlog> = mongoose.models.Blog ?? mongoose.model<IBlog>("Blog", schema);
export default model;
