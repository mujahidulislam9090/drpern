export type VerificationChannel = "EMAIL" | "SMS" | "WHATSAPP";

export type VerificationPurpose =
  | "SIGNUP_VERIFICATION"
  | "LOGIN_2FA"
  | "PASSWORD_RESET"
  | "WITHDRAWAL_CONFIRM";

export interface VerificationSendParams {
  destination: string;
  code: string;
  purpose: VerificationPurpose;
  expiresInMinutes?: number;
  appName?: string;
}

export interface VerificationSendResult {
  success: boolean;
  channel: VerificationChannel;
  messageId?: string;
  error?: string;
  provider: string;
}

export interface VerificationProvider {
  sendVerification(params: VerificationSendParams): Promise<VerificationSendResult>;
  isConfigured(): boolean;
  getProviderName(): string;
  getChannel(): VerificationChannel;
}
