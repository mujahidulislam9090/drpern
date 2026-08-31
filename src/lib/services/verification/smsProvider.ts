import {
  VerificationProvider,
  VerificationSendParams,
  VerificationSendResult,
  VerificationChannel,
} from "./types";

export class SmsVerificationProvider implements VerificationProvider {
  getChannel(): VerificationChannel {
    return "SMS";
  }

  getProviderName(): string {
    if (process.env.TWILIO_ACCOUNT_SID) return "Twilio";
    return "unconfigured";
  }

  isConfigured(): boolean {
    return Boolean(
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_FROM_NUMBER
    );
  }

  private normalizePhoneNumber(phone: string): string {
    const cleaned = phone.replace(/[^\d+]/g, "");
    if (cleaned.startsWith("+")) return cleaned;
    return `+${cleaned}`;
  }

  async sendVerification(
    params: VerificationSendParams
  ): Promise<VerificationSendResult> {
    const { destination, code, expiresInMinutes = 5, appName = "DropEarn" } = params;

    if (!this.isConfigured()) {
      return {
        success: false,
        channel: "SMS",
        provider: "unconfigured",
        error:
          "SMS provider is not configured. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_FROM_NUMBER.",
      };
    }

    const normalizedTo = this.normalizePhoneNumber(destination);
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_FROM_NUMBER;

    try {
      const authHeader = Buffer.from(`${sid}:${token}`).toString("base64");
      const bodyParams = new URLSearchParams();
      bodyParams.append("To", normalizedTo);
      bodyParams.append("From", from!);
      bodyParams.append(
        "Body",
        `[${appName}] Your verification code is ${code}. It expires in ${expiresInMinutes} minutes. Never share this code.`
      );

      const res = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${authHeader}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: bodyParams.toString(),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || `Twilio error HTTP ${res.status}`);
      }

      return {
        success: true,
        channel: "SMS",
        provider: "Twilio",
        messageId: data.sid,
      };
    } catch (err: any) {
      console.error("[SmsVerificationProvider] Twilio sending error:", err);
      return {
        success: false,
        channel: "SMS",
        provider: "Twilio",
        error: err.message || "Failed to send SMS through Twilio",
      };
    }
  }
}
