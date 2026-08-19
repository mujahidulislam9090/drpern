import { prisma } from "../db";
import { redis } from "../redis";
import { storage } from "../storage";
import { evaluateDownloadQualification } from "./antiFraudService";
import { recordQualifiedRevenueEvent } from "./ledgerService";
import { QUALIFICATION_RULES } from "../constants";
import { customAlphabet } from "nanoid";

const generateToken = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 32);

export async function createDownloadToken(params: {
  fileId: string;
  slug: string;
  ipAddress: string;
  visitorSessionId: string;
}) {
  const token = generateToken();
  const tokenKey = `dl_tok:${token}`;

  await redis.set(
    tokenKey,
    JSON.stringify({
      fileId: params.fileId,
      slug: params.slug,
      ipAddress: params.ipAddress,
      visitorSessionId: params.visitorSessionId,
      createdAt: Date.now(),
    }),
    "EX",
    300 // 5 minutes validity
  );

  return token;
}

export async function processDownload(params: {
  slug: string;
  token?: string | null;
  ipAddress: string;
  visitorSessionId: string;
  userAgent?: string | null;
  currentUserId?: string | null;
  timeOnPageSeconds?: number;
}) {
  const file = await prisma.file.findUnique({
    where: { slug: params.slug },
    include: { uploader: true },
  });

  if (!file || file.isDeleted || !file.isEnabled) {
    throw new Error("File not found or disabled");
  }

  if (file.expiresAt && new Date() > file.expiresAt) {
    throw new Error("File has expired");
  }

  if (file.downloadLimit && file.downloadCount >= file.downloadLimit) {
    throw new Error("File download limit reached");
  }

  // Evaluate Qualification
  const qualification = await evaluateDownloadQualification({
    fileId: file.id,
    uploaderId: file.uploaderId,
    ipAddress: params.ipAddress,
    visitorSessionId: params.visitorSessionId,
    currentUserId: params.currentUserId,
    userAgent: params.userAgent,
    timeOnPageSeconds: params.timeOnPageSeconds,
  });

  // Record FileDownload event in DB
  const downloadRecord = await prisma.fileDownload.create({
    data: {
      fileId: file.id,
      visitorSessionId: params.visitorSessionId,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent || null,
      isQualified: qualification.isQualified,
      qualificationReason: qualification.reason,
      downloadStartedAt: new Date(),
    },
  });

  // Increment general download count
  await prisma.file.update({
    where: { id: file.id },
    data: { downloadCount: { increment: 1 } },
  });

  // If qualified, record revenue event & update ledger!
  if (qualification.isQualified) {
    await recordQualifiedRevenueEvent({
      fileId: file.id,
      uploaderId: file.uploaderId,
      grossAmount: QUALIFICATION_RULES.BASE_QUALIFIED_REVENUE_PER_DOWNLOAD,
      currency: "USD",
      provider: "qualified_download",
      metadata: {
        downloadId: downloadRecord.id,
        ipAddress: params.ipAddress,
        session: params.visitorSessionId,
      },
    });
  }

  // Get download URL or stream
  const downloadUrl = await storage.getDownloadUrl(file.storageKey, file.originalName);

  return {
    downloadUrl,
    isS3: storage.isS3(),
    storageKey: file.storageKey,
    originalName: file.originalName,
    mimeType: file.mimeType,
    sizeBytes: file.sizeBytes.toString(),
    isQualified: qualification.isQualified,
  };
}
