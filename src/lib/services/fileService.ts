import { customAlphabet } from "nanoid";
import bcrypt from "bcryptjs";
import { prisma } from "../db";
import { storage } from "../storage";
import { FileMetadata } from "../../types";

const generateSlug = customAlphabet(
  "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
  7
);

// Default Free/Development Quotas (can be overridden via SiteSettings)
export const DEFAULT_STORAGE_LIMITS = {
  MAX_FILE_SIZE_BYTES: 100 * 1024 * 1024, // 100 MB max per file
  MAX_USER_STORAGE_BYTES: 1024 * 1024 * 1024, // 1 GB (1024 MB) per user
  MAX_USER_FILES_COUNT: 500, // 500 files per user
};

export async function getUserStorageUsage(userId: string) {
  const files = await prisma.file.findMany({
    where: { uploaderId: userId, isDeleted: false },
    select: { sizeBytes: true },
  });

  const totalBytes = files.reduce(
    (acc, f) => acc + BigInt(f.sizeBytes.toString()),
    BigInt(0)
  );

  const usedMb = Number(totalBytes / BigInt(1024 * 1024));
  const limitMb = Math.round(DEFAULT_STORAGE_LIMITS.MAX_USER_STORAGE_BYTES / (1024 * 1024));

  return {
    usedBytes: totalBytes.toString(),
    usedMb,
    limitMb,
    count: files.length,
    maxCount: DEFAULT_STORAGE_LIMITS.MAX_USER_FILES_COUNT,
  };
}

export async function createFile(params: {
  uploaderId: string;
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  originalName: string;
  mimeType: string;
  sizeBytes: number | bigint;
  buffer: Buffer;
  password?: string;
  downloadLimit?: number;
  expiresAt?: Date | null;
  isPublic?: boolean;
}) {
  const sizeBigInt = BigInt(params.sizeBytes);

  // 1. Validate Single File Size
  if (sizeBigInt > BigInt(DEFAULT_STORAGE_LIMITS.MAX_FILE_SIZE_BYTES)) {
    const maxMb = DEFAULT_STORAGE_LIMITS.MAX_FILE_SIZE_BYTES / (1024 * 1024);
    throw new Error(`File size exceeds maximum allowed limit of ${maxMb} MB`);
  }

  // 2. Validate User Storage Quota
  const usage = await getUserStorageUsage(params.uploaderId);
  const currentBytes = BigInt(usage.usedBytes);
  const maxUserBytes = BigInt(DEFAULT_STORAGE_LIMITS.MAX_USER_STORAGE_BYTES);

  if (currentBytes + sizeBigInt > maxUserBytes) {
    const currentMb = usage.usedMb;
    const limitMb = usage.limitMb;
    throw new Error(
      `Storage quota exceeded. Your current usage is ${currentMb} MB / ${limitMb} MB. Please delete existing files to upload more.`
    );
  }

  if (usage.count >= DEFAULT_STORAGE_LIMITS.MAX_USER_FILES_COUNT) {
    throw new Error(
      `Maximum file count reached (${usage.count} / ${DEFAULT_STORAGE_LIMITS.MAX_USER_FILES_COUNT} files).`
    );
  }

  const slug = generateSlug();
  const storageKey = `files/${params.uploaderId}/${slug}-${Date.now()}`;

  // 3. Step 1: Upload to Storage Provider
  await storage.uploadFile(storageKey, params.buffer, params.mimeType);

  let passwordHash: string | null = null;
  if (params.password && params.password.trim().length > 0) {
    passwordHash = await bcrypt.hash(params.password.trim(), 10);
  }

  // 4. Step 2: Create Database Record with Compensating Rollback
  try {
    const file = await prisma.file.create({
      data: {
        slug,
        title: params.title.trim() || params.originalName,
        description: params.description?.trim() || null,
        category: params.category || "General",
        tags: params.tags || [],
        originalName: params.originalName,
        mimeType: params.mimeType,
        sizeBytes: sizeBigInt,
        storageKey,
        storageBucket: storage.getProviderName(),
        passwordHash,
        downloadLimit: params.downloadLimit || null,
        expiresAt: params.expiresAt || null,
        isPublic: params.isPublic ?? true,
        uploaderId: params.uploaderId,
      },
    });

    return file;
  } catch (dbError: any) {
    console.error(
      "[FileService] Database record creation failed, cleaning up orphaned storage object:",
      dbError
    );
    // Compensating rollback: delete uploaded file so no orphaned data is left behind
    await storage.deleteFile(storageKey);
    throw new Error(`File creation failed: ${dbError.message || "Database error"}`);
  }
}

export async function getFileBySlug(slug: string, includePrivate = false) {
  const file = await prisma.file.findUnique({
    where: { slug },
    include: {
      uploader: {
        select: {
          id: true,
          displayName: true,
          email: true,
          avatarUrl: true,
        },
      },
    },
  });

  if (!file) return null;
  if (file.isDeleted) return null;
  if (!includePrivate && !file.isEnabled) return null;

  // Check expiration
  if (file.expiresAt && new Date() > file.expiresAt) {
    return { ...file, isExpired: true };
  }

  // Check download limit
  if (file.downloadLimit && file.downloadCount >= file.downloadLimit) {
    return { ...file, isLimitReached: true };
  }

  return file;
}

export async function verifyFilePassword(slug: string, passwordAttempt: string): Promise<boolean> {
  const file = await prisma.file.findUnique({
    where: { slug },
    select: { passwordHash: true },
  });

  if (!file || !file.passwordHash) return true;
  return bcrypt.compare(passwordAttempt, file.passwordHash);
}

export async function getUserFiles(
  uploaderId: string,
  options: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
  } = {}
) {
  const page = options.page || 1;
  const limit = options.limit || 20;
  const skip = (page - 1) * limit;

  const where = {
    uploaderId,
    isDeleted: false,
    ...(options.search
      ? {
          OR: [
            { title: { contains: options.search, mode: "insensitive" as const } },
            { originalName: { contains: options.search, mode: "insensitive" as const } },
            { description: { contains: options.search, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(options.category && options.category !== "All"
      ? { category: options.category }
      : {}),
  };

  const [files, totalCount, usage] = await Promise.all([
    prisma.file.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        uploader: {
          select: {
            displayName: true,
            email: true,
          },
        },
      },
    }),
    prisma.file.count({ where }),
    getUserStorageUsage(uploaderId),
  ]);

  const formatted: FileMetadata[] = files.map((f) => ({
    id: f.id,
    slug: f.slug,
    title: f.title,
    description: f.description,
    category: f.category,
    tags: f.tags,
    originalName: f.originalName,
    mimeType: f.mimeType,
    sizeBytes: f.sizeBytes.toString(),
    hasPassword: Boolean(f.passwordHash),
    downloadLimit: f.downloadLimit,
    downloadCount: f.downloadCount,
    qualifiedDownloadCount: f.qualifiedDownloadCount,
    isPublic: f.isPublic,
    isEnabled: f.isEnabled,
    expiresAt: f.expiresAt ? f.expiresAt.toISOString() : null,
    uploaderId: f.uploaderId,
    uploader: f.uploader
      ? {
          displayName: f.uploader.displayName,
          email: f.uploader.email,
        }
      : undefined,
    createdAt: f.createdAt.toISOString(),
    updatedAt: f.updatedAt.toISOString(),
  }));

  return {
    files: formatted,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
    storageUsage: usage,
  };
}

export async function deleteUserFile(fileId: string, uploaderId: string) {
  const file = await prisma.file.findFirst({
    where: { id: fileId, uploaderId },
  });

  if (!file) {
    throw new Error("File not found or unauthorized");
  }

  // Soft delete record
  await prisma.file.update({
    where: { id: fileId },
    data: { isDeleted: true, isEnabled: false },
  });

  // Attempt storage removal
  try {
    await storage.deleteFile(file.storageKey);
  } catch (err) {
    console.warn("[FileService] Storage deletion warning:", err);
  }

  return true;
}

export async function toggleFileStatus(fileId: string, uploaderId: string) {
  const file = await prisma.file.findFirst({
    where: { id: fileId, uploaderId, isDeleted: false },
  });

  if (!file) {
    throw new Error("File not found or unauthorized");
  }

  return prisma.file.update({
    where: { id: fileId },
    data: { isEnabled: !file.isEnabled },
  });
}
