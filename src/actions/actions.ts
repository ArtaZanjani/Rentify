"use server";
import connectToDB from "@/configs/connectToDB";
import UserModel from "@/models/UserModel";
import OTPModel from "@/models/OTPModel";
import { isPhoneNumber, uploadLogoValidation } from "@/utils/validation";
import { hashData, verifyHash, generateToken } from "@/utils/auth/auth";
import { redirect } from "next/navigation";
import type { UserType, roleTypes, ActionState } from "@/types/types";
import { revalidatePaths, DASHBOARD_PATHS } from "@/utils/revalidate";
import { generateCookie } from "./cookies";
import { Messages, mongooseDuplicateError } from "@/utils/messages";
import { ROLES } from "@/utils/countOccurrences";
import { logout } from "./auth";
import { formatBanTime } from "@/utils/dayjs";
import { isValidObjectId } from "mongoose";
import { removeImage, uploadImage } from "@/utils/CDN";

const SendCode = async (phone_number: string): Promise<ActionState> => {
  const code = Math.floor(1000 + Math.random() * 9000);
  try {
    await connectToDB();

    const find = await OTPModel.findOne({ phone_number });
    const now = new Date();

    if (find) {
      const expireTime = new Date(find.updatedAt.getTime() + 2 * 60 * 1000);

      if (now < expireTime) {
        return {
          message: `کد ارسال شده به شماره موبایل ${phone_number} را وارد کنید`,
          error: false,
        };
      } else {
        await OTPModel.findOneAndDelete({ phone_number });
      }
    }

    const res = await fetch(process.env.SMS_URL as string, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        op: "pattern",
        user: process.env.SMS_USER as string,
        pass: process.env.SMS_PASS as string,
        fromNum: process.env.SMS_FROM_NUM as string,
        toNum: phone_number,
        patternCode: process.env.SMS_PATTERN as string,
        inputData: [{ "verification-code": code }],
      }),
    });

    if (!res.ok) throw new Error("خطا در ارسال پیامک");

    const hashedCode = await hashData(String(code));
    await OTPModel.create({ phone_number, code: hashedCode });
    return {
      message: `کد ارسال شده به شماره موبایل ${phone_number} را وارد کنید`,
      error: false,
    };
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : "ارتباط با سرور پیامک برقرار نشد",
      error: true,
    };
  }
};

export const checkCode = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
  try {
    await connectToDB();
    const code = String(formData.get("OTPCode") || "");
    const name = String(formData.get("name") || "");
    const last_name = String(formData.get("last_name") || "");
    const office_name = formData.get("office_name") || undefined;
    const methodCheckCode = String(formData.get("methodCheckCode") || "");
    const phone_number = String(formData.get("phone_number") || "");
    const newPhoneNumber = String(formData.get("newPhoneNumber") || "");

    if (methodCheckCode !== "EDIT" && methodCheckCode !== "LOGIN") {
      return { message: "مقدار ارسال‌شده برای حالت معتبر نیست.", error: true };
    }

    if (!/^\d{4}$/.test(code)) {
      return {
        message: "کد باید ۴ رقم باشد",
        error: true,
      };
    }

    const phoneRule = methodCheckCode === "LOGIN" ? phone_number : newPhoneNumber;

    const find = await OTPModel.findOne({ phone_number: phoneRule });

    if (!find) {
      return {
        message: "کدی به این شماره ارسال نشده",
        error: true,
      };
    }

    const now = new Date();

    if (find.banUntil && now < find.banUntil) {
      return {
        message: "شما 24 ساعت بن شده‌اید",
        error: true,
      };
    }

    const isValidCode = await verifyHash(code, find.code);

    if (!isValidCode) {
      if (find.retry + 1 >= 5) {
        const banTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        await OTPModel.findOneAndUpdate({ phone_number: find.phone_number }, { $set: { retry: 0, banUntil: banTime } });

        return {
          message: "شما 24 ساعت بن شده‌اید",
          error: true,
        };
      }

      await OTPModel.findOneAndUpdate({ phone_number: find.phone_number }, { $inc: { retry: 1 } });
      return {
        message: "کد وارد شده اشتباه است",
        error: true,
      };
    }

    const expireTime = new Date(find.updatedAt.getTime() + 2 * 60 * 1000);

    if (now > expireTime) {
      await OTPModel.findOneAndDelete({ phone_number: find.phone_number });
      return {
        message: "کد منقضی شده",
        error: true,
      };
    }

    await OTPModel.findOneAndDelete({ phone_number: find.phone_number });
    const accessToken = generateToken(find.phone_number, "accessToken");
    const refreshToken = generateToken(find.phone_number, "refreshToken");

    if (methodCheckCode === "LOGIN") {
      const newRole = office_name ? "OFFICE" : "USER";
      const userData = { name, last_name, office_name, phone_number, role: newRole };
      const user = await UserModel.findOne(userData);

      if (!user) {
        await UserModel.create({ ...userData, refreshToken });
      } else {
        await UserModel.findOneAndUpdate({ phone_number }, { $set: { refreshToken } });
      }

      await generateCookie(accessToken, refreshToken);

      redirect("/dashboard/user");
    }

    const user = await UserModel.findOne({ phone_number });

    if (!user) {
      return {
        message: "شماره تلفن پیدا نشد",
        error: true,
      };
    }

    await UserModel.findByIdAndUpdate(user._id, { phone_number: newPhoneNumber });
    await logout();
    return {
      message: "شماره تلفن با موفقیت تغییر کرد",
      error: false,
    };
  } catch {
    return { message: Messages.unknownError.description, error: true };
  }
};

type ValidateDuplicateParams = {
  phone_number: string;
  name: string;
  last_name: string;
  office_name?: string | undefined;
  way: "LOGIN" | "EDIT";
  method: Exclude<roleTypes, "ADMIN">;
  userId?: string | undefined;
};
const validateDuplicate = async (params: ValidateDuplicateParams) => {
  const { phone_number, name, last_name, office_name, way, userId } = params;

  try {
    await connectToDB();

    const isValidPhone = isPhoneNumber(phone_number);

    if (!isValidPhone) {
      return {
        message: "شماره تلفن وارد شده معتبر نیست.",
        error: true,
      };
    }

    if (way !== "EDIT" && way !== "LOGIN") {
      return { message: "مقدار ارسال‌شده برای حالت معتبر نیست.", error: true };
    }

    const user = await UserModel.findOne({ phone_number });

    const checks = async (): Promise<ActionState> => {
      // چک ترکیب نام و نام خانوادگی (نادیده گرفتن خودش)
      const findNames = await UserModel.findOne({
        name,
        last_name,
        ...(userId ? { _id: { $ne: userId } } : {}),
      });
      if (findNames) {
        return { message: "این ترکیب نام و نام خانوادگی قبلاً ثبت شده است.", error: true };
      }

      // چک office_name (اگر وجود دارد) و نادیده گرفتن خودش
      if (office_name) {
        const findOffice = await UserModel.findOne({
          office_name,
          ...(userId ? { _id: { $ne: userId } } : {}),
        });
        if (findOffice) {
          return { message: "این دفتر قبلاً ثبت شده است.", error: true };
        }
      }

      // چک شماره تلفن، اگر کاربر دیگری با همین شماره باشد
      if (user && user._id.toString() !== userId) {
        return { message: "این شماره تلفن قبلاً در سیستم ثبت شده است.", error: true };
      }

      return { message: "معتبر است.", error: false };
    };

    if (way === "EDIT") {
      const checkResult = await checks();
      if (checkResult.error) {
        return checkResult;
      }

      return { message: "معتبر است.", error: false };
    }

    if (way === "LOGIN") {
      const { method } = params;

      if (!user) {
        return await checks();
      }

      if (user.role === "ADMIN") {
        const accessToken = generateToken(user.phone_number, "accessToken");
        const refreshToken = generateToken(user.phone_number, "refreshToken");

        await UserModel.findOneAndUpdate({ phone_number }, { $set: { refreshToken } });

        await generateCookie(accessToken, refreshToken);

        redirect("/");
      }

      if (!ROLES.includes(method)) {
        return { message: "مقدار ارسال‌شده برای متد معتبر نیست.", error: true };
      }

      if (user?.role !== method) {
        return {
          message: "این شماره تلفن قبلاً با نقش دیگری ثبت شده است.",
          error: true,
        };
      }

      if (user.name !== name || user.last_name !== last_name || (office_name && user.office_name !== office_name)) {
        return {
          message: "اطلاعات اشتباه است",
          error: true,
        };
      }

      if (user.banTime) {
        return { message: `شما ${formatBanTime(user?.banTime, user?.isBanned)} انبن میشید`, error: true };
      }

      if (user.isBanned) {
        return { message: `شما ${formatBanTime(user?.banTime, user?.isBanned)} شدید`, error: true };
      }
    }

    return { message: "معتبر است.", error: false };
  } catch {
    return { message: Messages.unknownError.description, error: true };
  }
};

export const Login_SignUp = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
  try {
    await connectToDB();
    const name = String(formData.get("name") || "");
    const last_name = String(formData.get("last_name") || "");
    const phone_number = String(formData.get("phone_number") || "");
    const method = formData.get("method") as Exclude<roleTypes, "ADMIN">;
    const office_name = method === "OFFICE" ? String(formData.get("office_name") || "") : undefined;

    const validation = await validateDuplicate({
      phone_number,
      way: "LOGIN",
      method,
      name,
      last_name,
      office_name,
    });

    if (validation.error) {
      return validation;
    }

    return SendCode(phone_number);
  } catch {
    return { message: Messages.unknownError.description, error: true };
  }
};

export const EditPersonalInformation = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
  try {
    await connectToDB();
    const id = String(formData.get("id") || "");
    const name = String(formData.get("name") || "");
    const last_name = String(formData.get("last_name") || "");
    const phone_number = String(formData.get("phone_number") || "");
    const method = formData.get("method") as Exclude<roleTypes, "ADMIN">;
    const office_name = method === "OFFICE" ? String(formData.get("office_name") || "") : undefined;
    const logoFile = formData.get("logo");
    const validLogoFile = logoFile instanceof File && logoFile.size > 0 ? logoFile : undefined;

    if (!id) {
      return { message: "شناسه کاربر موجود نیست. عملیات ناموفق بود.", error: true };
    }

    const user = await UserModel.findById(id);

    if (!user) {
      return { message: "کاربری با این شناسه یافت نشد.", error: true };
    }
    const validation = await validateDuplicate({
      phone_number,
      way: "EDIT",
      method,
      name,
      last_name,
      office_name,
      userId: id,
    });

    if (validation.error) return validation;

    const updateData: Partial<Pick<UserType, "name" | "last_name" | "phone_number" | "logo">> = {};
    if (name) updateData.name = name;
    if (last_name) updateData.last_name = last_name;
    if (phone_number) updateData.phone_number = phone_number;

    if (validLogoFile) {
      const isValid = uploadLogoValidation(validLogoFile);
      if (isValid.statusCode !== 200) {
        return { message: isValid.message, error: true };
      }

      if (user.logo) {
        const statusRemove = await removeImage(user.logo);

        if (statusRemove.error) return statusRemove;
      }

      const uploadStatus = await uploadImage(validLogoFile, "logos", id);

      if (uploadStatus.error) return uploadStatus;

      updateData.logo = uploadStatus.message;
    }

    if (user.phone_number === phone_number) {
      await UserModel.findByIdAndUpdate(id, updateData);
      revalidatePaths([...DASHBOARD_PATHS.user]);
      return { message: "اطلاعات با موفقیت ویرایش شد", error: false };
    } else {
      return SendCode(phone_number);
    }
  } catch {
    return { message: Messages.unknownError.description, error: true };
  }
};

export const removeUser = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
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

    const user = await UserModel.findById(id);

    if (!user) {
      return {
        message: "کاربر یافت نشد",
        error: true,
      };
    }

    if (user.logo) {
      const statusRemove = await removeImage(user.logo);

      if (statusRemove.error) return statusRemove;
    }

    await UserModel.findByIdAndDelete(id);

    await logout();
    return {
      message: "حساب شما با موفقیت حذف شد",
      error: false,
    };
  } catch {
    return { message: Messages.unknownError.description, error: true };
  }
};
