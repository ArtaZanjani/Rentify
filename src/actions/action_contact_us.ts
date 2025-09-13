"use server";
import connectToDB from "@/configs/connectToDB";
import ContactUsModel from "@/models/ContactUsModel";
import { contactUsMessage } from "@/constants/blogValidationErrors";
import { ActionState } from "@/types/types";
import { Messages, mongooseDuplicateError } from "@/utils/messages";
import { isPhoneNumber } from "@/utils/validation";
import { isValidObjectId } from "mongoose";

export const newMessage = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
  try {
    await connectToDB();

    const fieldValues = {
      name: String(formData.get("name") || "").trim(),
      last_name: String(formData.get("last_name") || "").trim(),
      phone_number: String(formData.get("phone_number") || "").trim(),
      message: String(formData.get("message") || "").trim(),
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const missingField = Object.entries(fieldValues).find(([_, value]) => !value);

    if (missingField) {
      const [fieldName] = missingField;
      return {
        message: contactUsMessage[fieldName as keyof typeof contactUsMessage],
        error: true,
      };
    }

    if (!isPhoneNumber(fieldValues.phone_number)) {
      return {
        message: "شماره تلفن معتبر نیست.",
        error: true,
      };
    }

    const data = { name: fieldValues.name, last_name: fieldValues.last_name, phone_number: fieldValues.phone_number, message: fieldValues.message };

    const duplicateMessage = await ContactUsModel.findOne(data);

    if (duplicateMessage) {
      return {
        message: "این پیام قبلاً ارسال شده است",
        error: true,
      };
    }

    await ContactUsModel.create(data);
    return {
      message: "پیام با موفقیت ارسال شد",
      error: false,
    };
  } catch {
    return { message: Messages.unknownError.description, error: true };
  }
};

export const delleteMessage = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
  try {
    await connectToDB();
    const id = String(formData.get("id") || "");

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

    await ContactUsModel.findByIdAndDelete(id);

    return {
      message: "پیام با موفقیت حذف شد",
      error: false,
    };
  } catch {
    return { message: Messages.unknownError.description, error: true };
  }
};
