import {
  VerificationProvider,
  VerificationSendParams,
  VerificationSendResult,
  VerificationChannel,
} from "./types";

export class EmailVerificationProvider implements VerificationProvider {
  getChannel(): VerificationChannel {
    return "EMAIL";
  }

  getProviderName(): string {
    if (process.env.RESEND_API_KEY) return "Resend";
    if (process.env.SENDGRID_API_KEY) return "SendGrid";
    if (process.env.SMTP_HOST) return "SMTP";
    return "unconfigured";
  }

  isConfigured(): boolean {
    return Boolean(
      process.env.RESEND_API_KEY ||
      process.env.SENDGRID_API_KEY ||
      (process.env.SMTP_HOST && process.env.SMTP_USER)
    );
  }

  async sendVerification(
    params: VerificationSendParams
  ): Promise<VerificationSendResult> {
    const { destination, code, purpose, expiresInMinutes = 5, appName = "DropEarn" } = params;

    if (!this.isConfigured()) {
      console.warn(
        `[EmailVerificationProvider] Email provider is unconfigured. Code for ${destination}: [PROTECTED] (${purpose})`
      );
      return {
        success: false,
        channel: "EMAIL",
        provider: "unconfigured",
        error:
          "Email provider credentials are not configured. Please set RESEND_API_KEY or SMTP variables.",
      };
    }

    const subjectMap: Record<string, string> = {
      SIGNUP_VERIFICATION: `${appName} — Verify your email address`,
      LOGIN_2FA: `${appName} — Your two-factor verification code`,
      PASSWORD_RESET: `${appName} — Password reset verification code`,
      WITHDRAWAL_CONFIRM: `${appName} — Confirm your payout withdrawal`,
    };

    const subject = subjectMap[purpose] || `${appName} — Your verification code`;

    // 1. Resend API Integration
    if (process.env.RESEND_API_KEY) {
      try {
        const fromEmail = process.env.EMAIL_FROM || "security@dropearn.com";
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: `${appName} Security <${fromEmail}>`,
            to: [destination],
            subject,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #090d16; color: #f1f5f9; border-radius: 16px; border: 1px solid #1e293b;">
                <div style="text-align: center; margin-bottom: 24px;">
                  <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 0;">${appName}</h1>
                  <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Security Verification</p>
                </div>
                <div style="background: #0f172a; border-radius: 12px; padding: 24px; text-align: center; border: 1px solid #334155;">
                  <p style="font-size: 14px; color: #cbd5e1; margin-bottom: 16px;">Use the verification code below to complete your request:</p>
                  <div style="font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #3b82f6; background: #1e293b; padding: 16px 24px; border-radius: 8px; display: inline-block; font-family: monospace;">
                    ${code}
                  </div>
                  <p style="font-size: 12px; color: #64748b; margin-top: 16px; margin-bottom: 0;">
                    ⏱ This code expires in <strong>${expiresInMinutes} minutes</strong>. Do not share this code with anyone.
                  </p>
                </div>
                <p style="font-size: 11px; color: #475569; text-align: center; margin-top: 24px;">
                  If you did not request this verification, you can safely ignore this email or change your account password.
                </p>
              </div>
            `,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || `Resend HTTP error ${res.status}`);
        }

        return {
          success: true,
          channel: "EMAIL",
          provider: "Resend",
          messageId: data.id,
        };
      } catch (err: any) {
        console.error("[EmailVerificationProvider] Resend error:", err);
        return {
          success: false,
          channel: "EMAIL",
          provider: "Resend",
          error: err.message || "Failed to deliver email through Resend",
        };
      }
    }

    return {
      success: false,
      channel: "EMAIL",
      provider: this.getProviderName(),
      error: "Configured email provider driver could not complete sending.",
    };
  }
}
