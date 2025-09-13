"use server";
import connectToDB from "@/configs/connectToDB";
import HomeModel from "@/models/HomeModel";
import { ActionState } from "@/types/types";
import { Equipment_Facilities, INFORMATION_OPTIONS } from "@/utils/Equipment_Facilities";
import { HOUSE_TYPES, TRANSACTION_TYPES, STATUS } from "@/utils/countOccurrences";
import { returnCity } from "@/utils/utils";
import { isValidObjectId } from "mongoose";
import { validateFiles } from "@/utils/validation";
import { Messages, mongooseDuplicateError } from "@/utils/messages";
import { uploadImage } from "@/utils/CDN";
export const newHome = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
  try {
    await connectToDB();

    const propertyType = formData.get("propertyType") as string;
    const transactionType = formData.get("transactionType") as string;
    const deposit = Number(formData.get("deposit") || 0);
    const rent = Number(formData.get("rent") || 0);
    const isConvertible = formData.get("isConvertible") === "on";
    const city = formData.get("city") as string;
    const subStreet = formData.get("subStreet") as string;
    const neighborhood = formData.get("neighborhood") as string;
    const fullAddress = formData.get("fullAddress") as string;
    const description = (formData.get("description") as string) ?? "";
    const postedBy = (formData.get("postedBy") as string) ?? "";
    const mapRaw = (formData.get("map") as string) ?? [];
    const map = mapRaw.split(",").map(Number) as [number, number];

    if (!HOUSE_TYPES.includes(propertyType)) {
      return {
        message: "نوع ملک معتبر نیس",
        error: true,
      };
    }

    if (!TRANSACTION_TYPES.includes(transactionType)) {
      return {
        message: "نوع معامله معتبر نیس",
        error: true,
      };
    }

    if (isNaN(deposit) || isNaN(rent)) {
      return {
        message: "مقادیر ودیعه و اجاره باید عدد معتبر باشند.",
        error: true,
      };
    }

    if (typeof isConvertible !== "boolean") {
      return {
        message: "وضعیت تبدیل‌پذیری باید صحیح باشد.",
        error: true,
      };
    }

    if ([city, subStreet, neighborhood, fullAddress, map].every((e) => !e || !e.length)) {
      return {
        message: "لطفا بخش 'موقعیت ملک' کامل پر کنید",
        error: true,
      };
    }

    if (!returnCity(city).length) {
      return {
        message: "شهر وارد شده معتبر نیست. لطفا یک شهر صحیح انتخاب کنید.",
        error: true,
      };
    }

    const information = INFORMATION_OPTIONS.reduce((acc, opt) => {
      const value = Number(formData.get(opt.key));
      acc[opt.key] = isNaN(value) ? 0 : value;
      return acc;
    }, {} as Record<string, number>);

    if (Object.values(information).some((value) => value < 0)) {
      return {
        message: "مقادیر وارد شده برای اطلاعات ملک نمی‌توانند منفی باشند.",
        error: true,
      };
    }

    if (!postedBy) {
      return {
        message: "اطلاعات کاربر ارسال‌کننده معتبر نیست.",
        error: true,
      };
    }

    if (!isValidObjectId(postedBy)) {
      return {
        message: mongooseDuplicateError.isValidObjectId,
        error: true,
      };
    }

    const amenities = Equipment_Facilities.reduce((acc, e) => {
      const value = formData.get(e.enLabel);
      acc[e.enLabel] = value === "on" ? true : false;
      return acc;
    }, {} as Record<string, boolean>);

    const rawImages = formData.getAll("images");
    const images = rawImages.filter((file): file is File => file instanceof File && file.size > 0 && file.name !== "undefined");

    const result = validateFiles(images);

    if (result.status !== 200) {
      return {
        message: result.message,
        error: true,
      };
    }

    const newHome = await HomeModel.create({
      propertyType,
      transactionType,
      deposit,
      rent,
      isConvertible,
      city,
      subStreet,
      neighborhood,
      fullAddress,
      map,
      information,
      amenities,
      postedBy,
      description: description.length ? description : undefined,
    });

    const imagePaths: string[] = [];

    if (images.length > 0) {
      try {
        const uploadResults = await Promise.all(images.map((img) => uploadImage(img, `homes/${newHome._id}`)));

        for (const res of uploadResults) {
          if (res.error) return res;
          imagePaths.push(res.message);
        }

        newHome.images = imagePaths;
        await newHome.save();
      } catch (error) {
        return { message: `خطا در آپلود تصاویر: ${error}`, error: true };
      }
    }

    if (!newHome) {
      return {
        message: Messages.unknownError.description,
        error: true,
      };
    }

    return {
      message: "ok",
      error: false,
    };
  } catch (error) {
    return {
      message: String(error),
      error: true,
    };
  }
};

export const editStatus = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
  try {
    await connectToDB();
    const homeId = String(formData.get("homeId"));
    const status = String(formData.get("status"));

    if (!homeId) {
      return {
        message: "شناسه خانه مشخص نشده است.",
        error: true,
      };
    }

    if (!isValidObjectId(homeId)) {
      return {
        message: mongooseDuplicateError.isValidObjectId,
        error: true,
      };
    }

    if (!STATUS.includes(status)) {
      return {
        message: "وضعیت نامعتبر است.",
        error: true,
      };
    }

    await HomeModel.findByIdAndUpdate(homeId, { status });

    return {
      message: "وضعیت اگهی با موفقیت تغییر کرد",
      error: false,
    };
  } catch (error) {
    return {
      message: String(error),
      error: true,
    };
  }
};
