import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";

export interface StorageProvider {
  uploadFile(key: string, buffer: Buffer, mimeType: string): Promise<string>;
  getFileStream(key: string): Promise<Readable>;
  getDownloadUrl(key: string, originalFilename?: string): Promise<string>;
  deleteFile(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  isS3(): boolean;
  getProviderName(): string;
}

export class LocalStorageProvider implements StorageProvider {
  private baseDir: string;

  constructor(customDir?: string) {
    const targetDir =
      customDir ||
      process.env.LOCAL_STORAGE_DIR ||
      path.join(process.cwd(), "storage", "uploads");
    this.baseDir = path.isAbsolute(targetDir)
      ? targetDir
      : path.join(process.cwd(), targetDir);

    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  isS3(): boolean {
    return false;
  }

  getProviderName(): string {
    return "local";
  }

  private resolvePath(key: string): string {
    // Sanitize key to prevent directory traversal
    const safeKey = key.replace(/\.\./g, "").replace(/^\/+/, "");
    return path.join(this.baseDir, safeKey);
  }

  async uploadFile(key: string, buffer: Buffer): Promise<string> {
    try {
      const filePath = this.resolvePath(key);
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        await fs.promises.mkdir(dir, { recursive: true });
      }
      await fs.promises.writeFile(filePath, buffer);
      return key;
    } catch (err: any) {
      console.error("[LocalStorageProvider] Upload write error:", err);
      throw new Error("Upload failed. Storage service is currently unavailable. Please try again later.");
    }
  }

  async exists(key: string): Promise<boolean> {
    const filePath = this.resolvePath(key);
    try {
      await fs.promises.access(filePath, fs.constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  async getFileStream(key: string): Promise<Readable> {
    const filePath = this.resolvePath(key);
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found in local storage: ${key}`);
    }
    return fs.createReadStream(filePath);
  }

  async getDownloadUrl(key: string, originalFilename?: string): Promise<string> {
    const filenameParam = originalFilename
      ? `&filename=${encodeURIComponent(originalFilename)}`
      : "";
    return `/api/v1/storage/download?key=${encodeURIComponent(key)}${filenameParam}`;
  }

  async deleteFile(key: string): Promise<void> {
    const filePath = this.resolvePath(key);
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch (err) {
      console.warn(`[LocalStorageProvider] Warning deleting ${key}:`, err);
    }
  }
}

export class CloudStorageProvider implements StorageProvider {
  private client: S3Client;
  private bucket: string;

  constructor() {
    this.bucket = process.env.S3_BUCKET || "dropearn-files";
    this.client = new S3Client({
      region: process.env.S3_REGION || "auto",
      endpoint: process.env.S3_ENDPOINT || undefined,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || process.env.S3_ACCESS_KEY || "",
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || process.env.S3_SECRET_KEY || "",
      },
      forcePathStyle:
        process.env.S3_FORCE_PATH_STYLE === "true" || !!process.env.S3_ENDPOINT,
    });
  }

  isS3(): boolean {
    return true;
  }

  getProviderName(): string {
    return "cloud";
  }

  async uploadFile(key: string, buffer: Buffer, mimeType: string): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
      });
      await this.client.send(command);
      return key;
    } catch (err: any) {
      console.error("[CloudStorageProvider] S3 upload error:", err);
      throw new Error("Upload failed. Storage service is currently unavailable. Please try again later.");
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });
      await this.client.send(command);
      return true;
    } catch {
      return false;
    }
  }

  async getFileStream(key: string): Promise<Readable> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    const response = await this.client.send(command);
    if (!response.Body) {
      throw new Error("Empty response body from cloud storage");
    }
    return response.Body as unknown as Readable;
  }

  async getDownloadUrl(key: string, originalFilename?: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ResponseContentDisposition: originalFilename
        ? `attachment; filename="${encodeURIComponent(originalFilename)}"`
        : "attachment",
    });
    return getSignedUrl(this.client, command, { expiresIn: 3600 });
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });
      await this.client.send(command);
    } catch (err) {
      console.warn(`[CloudStorageProvider] Warning deleting ${key}:`, err);
    }
  }
}

function initializeStorageProvider(): StorageProvider {
  const providerType = (process.env.STORAGE_PROVIDER || "local").toLowerCase();
  const hasCloudKeys =
    (process.env.S3_ACCESS_KEY_ID || process.env.S3_ACCESS_KEY) &&
    (process.env.S3_SECRET_ACCESS_KEY || process.env.S3_SECRET_KEY);

  if ((providerType === "cloud" || providerType === "s3") && hasCloudKeys) {
    return new CloudStorageProvider();
  }

  return new LocalStorageProvider();
}

export const storage: StorageProvider = initializeStorageProvider();
export default storage;
