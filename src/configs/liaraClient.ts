import { S3Client } from "@aws-sdk/client-s3";

if (!process.env.LIARA_ACCESS_KEY || !process.env.LIARA_SECRET_KEY || !process.env.LIARA_ENDPOINT) {
  throw new Error("Missing Liara S3 environment variables");
}

export const liaraClient = new S3Client({
  region: "default",
  endpoint: process.env.LIARA_ENDPOINT,
  credentials: {
    accessKeyId: process.env.LIARA_ACCESS_KEY,
    secretAccessKey: process.env.LIARA_SECRET_KEY,
  },
});
