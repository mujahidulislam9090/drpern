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
import os from "node:os";
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
  private fallbackDir: string;

  constructor(customDir?: string) {
    this.fallbackDir = path.join(os.tmpdir(), "dropearn", "uploads");
    
    const isServerless = Boolean(
      process.env.NETLIFY ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.LAMBDA_TASK_ROOT ||
      process.env.VERCEL
    );

    const configuredDir = customDir || process.env.LOCAL_STORAGE_DIR;

    if (isServerless && (!configuredDir || configuredDir.startsWith("./") || configuredDir.startsWith("storage/"))) {
      this.baseDir = this.fallbackDir;
    } else {
      const targetDir = configuredDir || path.join(process.cwd(), "storage", "uploads");
      this.baseDir = path.isAbsolute(targetDir)
        ? targetDir
        : path.join(process.cwd(), targetDir);
    }

    try {
      if (!fs.existsSync(this.baseDir)) {
        fs.mkdirSync(this.baseDir, { recursive: true });
      }
    } catch {
      // In read-only serverless bundles, switch baseDir to writable /tmp
      this.baseDir = this.fallbackDir;
      try {
        if (!fs.existsSync(this.baseDir)) {
          fs.mkdirSync(this.baseDir, { recursive: true });
        }
      } catch (e) {
        console.warn("[LocalStorageProvider] Failed to create tmp dir:", e);
      }
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

  private resolveFallbackPath(key: string): string {
    const safeKey = key.replace(/\.\./g, "").replace(/^\/+/, "");
    return path.join(this.fallbackDir, safeKey);
  }

  async uploadFile(key: string, buffer: Buffer): Promise<string> {
    let filePath = this.resolvePath(key);
    try {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        await fs.promises.mkdir(dir, { recursive: true });
      }
      await fs.promises.writeFile(filePath, buffer);
      return key;
    } catch (primaryErr: any) {
      // If primary path failed due to read-only filesystem, retry using writable /tmp
      try {
        filePath = this.resolveFallbackPath(key);
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
          await fs.promises.mkdir(dir, { recursive: true });
        }
        await fs.promises.writeFile(filePath, buffer);
        this.baseDir = this.fallbackDir;
        return key;
      } catch (fallbackErr: any) {
        console.error("[LocalStorageProvider] Upload write error:", fallbackErr);
        throw new Error("Upload failed. Storage disk is unavailable. Please try again.");
      }
    }
  }

  async exists(key: string): Promise<boolean> {
    const primary = this.resolvePath(key);
    if (fs.existsSync(primary)) return true;
    const fallback = this.resolveFallbackPath(key);
    return fs.existsSync(fallback);
  }

  async getFileStream(key: string): Promise<Readable> {
    const primary = this.resolvePath(key);
    if (fs.existsSync(primary)) {
      return fs.createReadStream(primary);
    }
    const fallback = this.resolveFallbackPath(key);
    if (fs.existsSync(fallback)) {
      return fs.createReadStream(fallback);
    }
    throw new Error(`File not found in local storage: ${key}`);
  }

  async getDownloadUrl(key: string, originalFilename?: string): Promise<string> {
    const filenameParam = originalFilename
      ? `&filename=${encodeURIComponent(originalFilename)}`
      : "";
    return `/api/v1/storage/download?key=${encodeURIComponent(key)}${filenameParam}`;
  }

  async deleteFile(key: string): Promise<void> {
    const paths = [this.resolvePath(key), this.resolveFallbackPath(key)];
    for (const p of paths) {
      try {
        if (fs.existsSync(p)) {
          await fs.promises.unlink(p);
        }
      } catch (err) {
        console.warn(`[LocalStorageProvider] Warning deleting ${p}:`, err);
      }
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
      throw new Error("Upload failed. Cloud storage service is currently unavailable.");
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
