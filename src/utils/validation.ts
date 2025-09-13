import { ActionState } from "@/types/types";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "./countOccurrences";
import { mongooseDuplicateError } from "./messages";
import { blogValidationErrors } from "@/constants/blogValidationErrors";

type validateDateType = {
  message: string;
  status: number;
};

export const isPhoneNumber = (phoneNumber: string): boolean => {
  const mobileRegex = /^09(0[1-5]|[1 3]\d|2[0-2]|98)\d{7}$/g;
  return mobileRegex.test(phoneNumber);
};

export const isPersian = (text: string): boolean => {
  const persianOrNumberRegex = /^[\u0600-\u06FF0-9۰-۹\s]+$/g;
  return persianOrNumberRegex.test(text);
};

export const validateDate = (homeId: string, date: string, clock: string): validateDateType => {
  if (!homeId) {
    return { message: "شناسه ملک ارسال نشده است", status: 400 };
  }

  if (!date) {
    return { message: "تاریخ انتخاب نشده است", status: 400 };
  }

  if (!clock) {
    return { message: "ساعت انتخاب نشده است", status: 400 };
  }

  const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/;
  if (!dateRegex.test(date)) {
    return { message: "فرمت تاریخ باید YYYY-MM-DD باشد", status: 400 };
  }

  return { message: "تاریخ معتبر است", status: 200 };
};

export const uploadLogoValidation = (logo: File | null): { statusCode: number; message: string } => {
  if (!(logo instanceof File)) {
    return { statusCode: 400, message: "هیچ فایلی انتخاب نشده است." };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(logo.type)) {
    return { statusCode: 415, message: mongooseDuplicateError?.ImageType };
  }

  if (logo.size > MAX_IMAGE_SIZE) {
    return { statusCode: 413, message: mongooseDuplicateError?.maxImageSize };
  }

  return { statusCode: 200, message: "فایل معتبر است و می‌توان آپلود کرد." };
};

type returnValidate = {
  files: File[] | [];
  message: string;
  status: number;
};

export const validateFiles = (files: File[]): returnValidate => {
  const allowedTypes = ALLOWED_IMAGE_TYPES;
  const maxSize = MAX_IMAGE_SIZE;

  let validFiles = files.filter((file) => allowedTypes.includes(file.type));

  if (validFiles.length !== files.length) {
    return {
      files: validFiles,
      message: "فرمت فایل‌های انتخابی مجاز نیست",
      status: 400,
    };
  }

  const oversizedFiles = validFiles.filter((file) => file.size >= maxSize);
  if (oversizedFiles.length) {
    validFiles = validFiles.filter((file) => file.size <= maxSize);
    return {
      files: validFiles,
      message: "عکس‌های بالای 100kb پاک می‌شوند",
      status: 400,
    };
  }

  return {
    files: validFiles,
    message: `فایل ${validFiles.length > 1 ? "های" : ""} مورد نظر با موفقیت اپلود شد`,
    status: 200,
  };
};

export const validateBlog = (title: string, shortDesciption: string, mainContent: string, image: File | undefined): ActionState => {
  const trimmedTitle = title.trim();
  const trimmedShortDesciption = shortDesciption.trim();
  const trimmedMainContent = mainContent.trim();

  if (image) {
    const result = uploadLogoValidation(image);

    if (result.statusCode !== 200) {
      return { error: true, message: result.message };
    }
  }

  if (!trimmedTitle) {
    return { error: true, message: blogValidationErrors.title.required };
  }
  if (trimmedTitle.length < 5) {
    return { error: false, message: blogValidationErrors.title.minLength };
  }

  if (trimmedTitle.length > 100) {
    return { error: true, message: blogValidationErrors.title.maxLength };
  }

  if (!trimmedShortDesciption) {
    return { error: true, message: blogValidationErrors.shortDesciption.required };
  }
  if (trimmedShortDesciption.length < 10) {
    return { error: true, message: blogValidationErrors.shortDesciption.minLength };
  }
  if (trimmedShortDesciption.length > 200) {
    return { error: true, message: blogValidationErrors.shortDesciption.maxLength };
  }

  if (!trimmedMainContent) {
    return { error: true, message: blogValidationErrors.mainContent.required };
  }

  return { error: false, message: "ok" };
};
