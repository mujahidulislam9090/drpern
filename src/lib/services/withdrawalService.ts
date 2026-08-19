import Decimal from "decimal.js";
import { prisma } from "../db";
import { getUserBalances, getRevenueShareSettings } from "./ledgerService";
import { PayoutMethod, WithdrawalStatus } from "@prisma/client";

export async function requestWithdrawal(params: {
  userId: string;
  amount: number | string;
  payoutMethod: PayoutMethod;
  payoutDetails: Record<string, unknown>;
}) {
  const reqAmount = new Decimal(params.amount.toString());
  const { minWithdrawal } = await getRevenueShareSettings();

  if (reqAmount.lt(minWithdrawal)) {
    throw new Error(`Minimum withdrawal amount is $${minWithdrawal.toFixed(2)}`);
  }

  const balances = await getUserBalances(params.userId);
  const currentAvailable = new Decimal(balances.availableBalance);

  if (reqAmount.gt(currentAvailable)) {
    throw new Error("Insufficient available balance");
  }

  // Check for existing pending withdrawal
  const pendingCount = await prisma.withdrawal.count({
    where: {
      userId: params.userId,
      status: { in: ["PENDING", "APPROVED", "PROCESSING"] },
    },
  });

  if (pendingCount > 0) {
    throw new Error("You already have an active withdrawal in progress");
  }

  return prisma.$transaction(async (tx) => {
    // 1. Create Withdrawal record
    const withdrawal = await tx.withdrawal.create({
      data: {
        userId: params.userId,
        amount: reqAmount.toFixed(4),
        currency: "USD",
        payoutMethod: params.payoutMethod,
        payoutDetails: (params.payoutDetails as any) || {},
        status: "PENDING",
      },
    });

    // 2. Fetch latest ledger balance
    const latestLedger = await tx.earningsLedger.findFirst({
      where: { userId: params.userId },
      orderBy: { createdAt: "desc" },
    });

    const currentBal = latestLedger
      ? new Decimal(latestLedger.runningBalance.toString())
      : new Decimal(0);
    const newBal = currentBal.sub(reqAmount);

    // 3. Create Debit ledger entry
    await tx.earningsLedger.create({
      data: {
        userId: params.userId,
        withdrawalId: withdrawal.id,
        type: "DEBIT_WITHDRAWAL",
        amount: reqAmount.neg().toFixed(4), // Negative amount for debit
        runningBalance: newBal.toFixed(4),
        status: "LOCKED",
        description: `Withdrawal request #${withdrawal.id.slice(-6)} (${params.payoutMethod})`,
      },
    });

    return withdrawal;
  });
}

export async function getUserWithdrawals(
  userId: string,
  options: { page?: number; limit?: number } = {}
) {
  const page = options.page || 1;
  const limit = options.limit || 20;
  const skip = (page - 1) * limit;

  const [withdrawals, totalCount] = await Promise.all([
    prisma.withdrawal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.withdrawal.count({ where: { userId } }),
  ]);

  return {
    withdrawals: withdrawals.map((w) => ({
      id: w.id,
      amount: w.amount.toString(),
      currency: w.currency,
      payoutMethod: w.payoutMethod,
      payoutDetails: w.payoutDetails,
      status: w.status,
      adminNote: w.adminNote,
      rejectionReason: w.rejectionReason,
      requestedAt: w.requestedAt.toISOString(),
      processedAt: w.processedAt ? w.processedAt.toISOString() : null,
    })),
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
  };
}

export async function processAdminWithdrawalAction(params: {
  withdrawalId: string;
  adminId: string;
  action: "APPROVE" | "START_PROCESSING" | "MARK_PAID" | "REJECT" | "CANCEL";
  note?: string;
  rejectionReason?: string;
}) {
  const { withdrawalId, adminId, action, note, rejectionReason } = params;

  const withdrawal = await prisma.withdrawal.findUnique({
    where: { id: withdrawalId },
  });

  if (!withdrawal) {
    throw new Error("Withdrawal record not found");
  }

  return prisma.$transaction(async (tx) => {
    let newStatus: WithdrawalStatus = withdrawal.status;

    if (action === "APPROVE") {
      if (withdrawal.status !== "PENDING") {
        throw new Error("Can only approve PENDING withdrawals");
      }
      newStatus = "APPROVED";
    } else if (action === "START_PROCESSING") {
      newStatus = "PROCESSING";
    } else if (action === "MARK_PAID") {
      newStatus = "PAID";
      // Update ledger entry to PAID
      await tx.earningsLedger.updateMany({
        where: { withdrawalId },
        data: { status: "PAID" },
      });
    } else if (action === "REJECT" || action === "CANCEL") {
      newStatus = action === "REJECT" ? "REJECTED" : "CANCELLED";

      // Refund the debited funds back to user's running balance
      const refundAmount = new Decimal(withdrawal.amount.toString());

      const latestLedger = await tx.earningsLedger.findFirst({
        where: { userId: withdrawal.userId },
        orderBy: { createdAt: "desc" },
      });

      const currentBal = latestLedger
        ? new Decimal(latestLedger.runningBalance.toString())
        : new Decimal(0);
      const newBal = currentBal.add(refundAmount);

      await tx.earningsLedger.create({
        data: {
          userId: withdrawal.userId,
          withdrawalId: withdrawal.id,
          type: "ADJUSTMENT",
          amount: refundAmount.toFixed(4),
          runningBalance: newBal.toFixed(4),
          status: "AVAILABLE",
          description: `Refund for ${newStatus.toLowerCase()} withdrawal #${withdrawal.id.slice(-6)}`,
        },
      });

      // Update original debit ledger entry to CANCELLED
      await tx.earningsLedger.updateMany({
        where: { withdrawalId },
        data: { status: "CANCELLED" },
      });
    }

    const updated = await tx.withdrawal.update({
      where: { id: withdrawalId },
      data: {
        status: newStatus,
        adminNote: note !== undefined ? note : withdrawal.adminNote,
        rejectionReason: rejectionReason || withdrawal.rejectionReason,
        processedAt: newStatus === "PAID" ? new Date() : withdrawal.processedAt,
      },
    });

    // Create Audit Log
    await tx.auditLog.create({
      data: {
        adminId,
        action: `WITHDRAWAL_${action}`,
        targetType: "Withdrawal",
        targetId: withdrawalId,
        details: {
          previousStatus: withdrawal.status,
          newStatus,
          amount: withdrawal.amount.toString(),
          note,
          rejectionReason,
        },
      },
    });

    return updated;
  });
}
