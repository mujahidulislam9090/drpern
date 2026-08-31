export type Role = "USER" | "ADMIN";
export type UserStatus = "ACTIVE" | "SUSPENDED" | "BANNED";

export interface SessionUser {
  id: string;
  firebaseUid: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: Role;
  status: UserStatus;
  referralCode: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  phoneNumber?: string | null;
  onboardingCompleted?: boolean;
  preferences?: any;
  lastLoginAt?: string | null;
  createdAt?: string;
}

export interface FileMetadata {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string;
  tags: string[];
  originalName: string;
  mimeType: string;
  sizeBytes: string;
  hasPassword: boolean;
  downloadLimit: number | null;
  downloadCount: number;
  qualifiedDownloadCount: number;
  isPublic: boolean;
  isEnabled: boolean;
  expiresAt: string | null;
  uploaderId: string;
  uploader?: {
    displayName: string | null;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserBalanceSummary {
  availableBalance: string;
  pendingBalance: string;
  lifetimeEarnings: string;
  totalWithdrawn: string;
  currency: string;
}

export interface UserDownloadStats {
  today: number;
  last7Days: number;
  last30Days: number;
  lifetime: number;
  totalQualified: number;
}

export interface UserDashboardData {
  user: SessionUser;
  balances: UserBalanceSummary;
  downloads: UserDownloadStats;
  totalFiles: number;
  recentFiles: FileMetadata[];
}

export interface AdminDashboardMetrics {
  revenue: {
    today: string;
    yesterday: string;
    last7Days: string;
    last30Days: string;
    lifetime: string;
    grossToday: string;
    uploaderShareToday: string;
    platformShareToday: string;
  };
  visitors: {
    today: number;
    yesterday: number;
    last7Days: number;
    last30Days: number;
    uniqueSessionsToday: number;
    downloadStartsToday: number;
    configured: boolean;
  };
  files: {
    total: number;
    uploadedToday: number;
    uploadedThisWeek: number;
    uploadedThisMonth: number;
    active: number;
    disabled: number;
  };
  downloads: {
    total: number;
    qualified: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  users: {
    total: number;
    newToday: number;
    newThisWeek: number;
    newThisMonth: number;
    active: number;
  };
}

export interface AdminRevenueBreakdown {
  period: "today" | "7d" | "30d" | "90d" | "custom" | "all";
  grossRevenue: string;
  uploaderShare: string;
  platformShare: string;
  pendingRevenue: string;
  confirmedRevenue: string;
  timeSeries: {
    date: string;
    gross: number;
    uploaderShare: number;
    platformShare: number;
    eventCount: number;
  }[];
}

export interface AdminVisitorAnalytics {
  period: "today" | "7d" | "30d" | "all";
  totalPageViews: number;
  uniqueSessions: number;
  downloadPageVisits: number;
  downloadStarts: number;
  qualifiedDownloads: number;
  conversionRate: number;
  timeSeries: {
    date: string;
    pageViews: number;
    downloadVisits: number;
    downloads: number;
    qualified: number;
  }[];
}

export interface SiteSettingsMap {
  siteName: string;
  siteDescription: string;
  logoUrl: string;
  maintenanceMode: boolean;
  uploaderRevenuePercent: number;
  platformRevenuePercent: number;
  minWithdrawal: number;
  maxFileSizeMb: number;
  allowedMimeTypes: string[];
  adProviderEnabled: boolean;
  adProviderKey: string;
  adSensePublisherId: string;
  registrationEnabled: boolean;
}
