"use server";

import type { ActionState, roleTypes } from "@/types/types";
import connectToDB from "@/configs/connectToDB";
import UserModel from "@/models/UserModel";
import { isValidObjectId } from "mongoose";
import { Messages, mongooseDuplicateError } from "@/utils/messages";
import { ROLES, banTimes, translateRole } from "@/utils/countOccurrences";

export const BanUser = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
  try {
    await connectToDB();
    const method = String(formData.get("method") || "");
    const userId = String(formData.get("userId") || "");
    const value = String(formData.get("value") || "");

    const methodArr = ["BAN", "CHANGE_ROLE"];
    if (!methodArr.includes(method)) {
      return {
        message: "متد نامعتبر است.",
        error: true,
      };
    }

    if (!userId) {
      return {
        message: "شناسه کاربر ارسال نشده است.",
        error: true,
      };
    }

    if (!isValidObjectId(userId)) {
      return {
        message: mongooseDuplicateError.isValidObjectId,
        error: true,
      };
    }

    if (method === "CHANGE_ROLE" && !ROLES.includes(value as (typeof ROLES)[number])) {
      return {
        message: "نقش نامعتبر است.",
        error: true,
      };
    }

    if (method === "BAN" && !banTimes.includes(value)) {
      return {
        message: "مدت زمان بن نامعتبر است.",
        error: true,
      };
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return {
        message: "کاربر مورد نظر یافت نشد.",
        error: true,
      };
    }

    if (method === "BAN") {
      type BanTime = (typeof banTimes)[number];
      let message = "";

      switch (value as BanTime) {
        case "حذف از بن":
          user.isBanned = undefined;
          user.banTime = undefined;
          message = "کاربر با موفقیت از بن خارج شد.";
          break;

        case "دائمی":
          user.isBanned = true;
          user.banTime = undefined;
          message = "کاربر به صورت دائمی بن شد.";
          break;

        default:
          const days = parseInt(value);
          if (isNaN(days)) {
            return { message: "مدت زمان بن نامعتبر است.", error: true };
          }
          const expireDate = new Date();
          expireDate.setDate(expireDate.getDate() + days);
          user.banTime = expireDate;
          user.isBanned = undefined;
          message = `کاربر به مدت ${value} بن شد.`;
          break;
      }

      await user.save();

      return {
        message,
        error: false,
      };
    }

    user.role = value as roleTypes;
    await user.save();

    return {
      message: `نقش کاربر با موفقیت به ${translateRole[value as keyof typeof translateRole]} تغییر کرد`,
      error: false,
    };
  } catch {
    return {
      message: Messages.unknownError.description,
      error: true,
    };
  }
};
