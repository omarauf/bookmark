import type { Readable } from "node:stream";
import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { env } from "@/config/env";
import { safe } from "@/utils/safe";

const s3 = new S3Client({
  region: env.S3_REGION,
  endpoint: env.S3_ENDPOINT,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY,
    secretAccessKey: env.S3_SECRET_KEY,
  },
  forcePathStyle: false,
});

async function upload(key: string, body: Buffer | string) {
  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    Key: key,
    Body: body,
    ACL: "public-read",
  });

  return await safe(s3.send(command));
}

async function get(key: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: key,
    });

    const response = await s3.send(command);

    return response.Body;
  } catch {
    return undefined;
  }
}

async function readText(key: string): Promise<string | undefined> {
  try {
    const command = new GetObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: key,
    });

    const response = await s3.send(command);

    if (!response.Body) return undefined;

    const stream = response.Body as Readable;

    const chunks: Buffer[] = [];

    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    return Buffer.concat(chunks).toString("utf-8");
  } catch {
    return undefined;
  }
}

async function exists(key: string): Promise<boolean> {
  try {
    const command = new HeadObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: key,
    });

    await s3.send(command);
    return true;
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null) {
      const awsError = error as { name?: string; $metadata?: { httpStatusCode?: number } };

      if (awsError.name === "NotFound" || awsError.$metadata?.httpStatusCode === 404) {
        return false;
      }
    }

    return false;
  }
}

async function stream(stream: Readable, key: string) {
  try {
    // 1. Pipe the stream directly to S3
    const parallelUploads3 = new Upload({
      client: s3,
      params: {
        Bucket: env.S3_BUCKET_NAME,
        Key: key,
        Body: stream,
        ACL: "public-read",
      },
      // Optional: You can configure chunk sizes and concurrency here
      queueSize: 4,
      partSize: 1024 * 1024 * 5, // 5 MB
    });

    // Optional: Track progress
    // parallelUploads3.on("httpUploadProgress", (progress) => {
    //   console.log(`Uploaded ${progress.loaded} of ${progress.total || "unknown"} bytes`);
    // });

    // 2. Wait for the upload to finish
    await parallelUploads3.done();
    return true;
  } catch {
    return false;
  }
}

export const s3Client = {
  upload,
  get,
  readText,
  exists,
  stream,
};
