"use server";
import { Messages, mongooseDuplicateError } from "@/utils/messages";
import connectToDB from "@/configs/connectToDB";
import { ActionState } from "@/types/types";
import { validateBlog } from "@/utils/validation";
import BlogModel from "@/models/BlogModel";
import { isValidObjectId } from "mongoose";
import { uploadImage, removeImage } from "@/utils/CDN";

export const uploadBlog = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
  try {
    await connectToDB();
    const title = String(formData.get("title")).trim();
    const shortDesciption = String(formData.get("shortDesciption")).trim();
    const mainContent = String(formData.get("mainContent")).trim();
    const imageEntry = formData.get("image");
    const image: File | undefined = imageEntry instanceof File ? imageEntry : undefined;

    const validation = validateBlog(title, shortDesciption, mainContent, image);

    if (validation.error) {
      return {
        message: validation.message,
        error: true,
      };
    }

    const isDuplicate = await BlogModel.find({ title, shortDesciption, mainContent });

    if (isDuplicate.length > 0) {
      return {
        message: "این بلاگ قبلاً ثبت شده است",
        error: true,
      };
    }

    const blog = await BlogModel.create({ title, shortDesciption, mainContent });

    if (image) {
      const uploadStatus = await uploadImage(image, "blogs", String(blog._id));

      if (uploadStatus.error) return uploadStatus;

      blog.image = uploadStatus.message;
      await blog.save();
    }

    return {
      message: "بلاگ با موفقیت ثبت شد",
      error: false,
    };
  } catch {
    return { message: Messages.unknownError.description, error: true };
  }
};

export const removeBlog = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
  try {
    const id = String(formData.get("id"));
    if (!id) {
      return {
        message: mongooseDuplicateError.id,
        error: true,
      };
    }

    if (!isValidObjectId(id)) {
      return {
        message: mongooseDuplicateError.isValidObjectId,
        error: true,
      };
    }

    await connectToDB();

    const blog = await BlogModel.findById(id);

    if (!blog) {
      return {
        message: Messages["404_Blog"].title,
        error: true,
      };
    }

    if (blog.image) {
      const statusRemove = await removeImage(blog.image);

      if (statusRemove.error) return statusRemove;
    }

    await BlogModel.findByIdAndDelete(id);

    return {
      message: "مقاله با موفقیت حذف شد.",
      error: false,
    };
  } catch {
    return { message: Messages.unknownError.description, error: true };
  }
};
