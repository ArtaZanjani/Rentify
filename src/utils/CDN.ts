import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { liaraClient } from "@/configs/liaraClient";
import type { ActionState } from "@/types/types";

export const uploadImage = async (image: File, folder: string, customFileName: string | undefined = undefined): Promise<ActionState> => {
  if (!image) {
    return {
      message: "هیچ تصویری برای آپلود ارائه نشده است",
      error: true,
    };
  }

  const buffer = Buffer.from(await image.arrayBuffer());

  const safeName = image.name.replace(/[^a-zA-Z0-9.-]+/g, "_");
  const extension = image.name.split(".").pop();
  const fileName = `${folder}/${customFileName ? `${customFileName}.${extension}` : `${Date.now()}_${safeName}`}`;

  const params = {
    Body: buffer,
    Bucket: process.env.LIARA_BUCKET_NAME!,
    Key: fileName,
    ContentType: image.type,
  };

  try {
    await liaraClient.send(new PutObjectCommand(params));

    const permanentUrl = `${process.env.LIARA_URL}/${fileName}`;
    return {
      message: permanentUrl,
      error: false,
    };
  } catch (error) {
    return {
      message: `خطا در اپلود عکس ${error}`,
      error: true,
    };
  }
};

export const removeImage = async (url: string): Promise<ActionState> => {
  const Key = url.replace(/^https?:\/\/[^/]+\/?/, "");
  const params = {
    Bucket: process.env.LIARA_BUCKET_NAME,
    Key,
  };
  try {
    await liaraClient.send(new DeleteObjectCommand(params));

    return {
      message: "فایل با موفقیت حذف شد",
      error: false,
    };
  } catch (error) {
    return {
      message: `خطا در حذف عکس ${error}`,
      error: true,
    };
  }
};
