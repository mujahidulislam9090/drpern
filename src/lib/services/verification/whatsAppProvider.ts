import {
  VerificationProvider,
  VerificationSendParams,
  VerificationSendResult,
  VerificationChannel,
} from "./types";

export class WhatsAppVerificationProvider implements VerificationProvider {
  getChannel(): VerificationChannel {
    return "WHATSAPP";
  }

  getProviderName(): string {
    if (process.env.WHATSAPP_PHONE_NUMBER_ID) return "Meta WhatsApp Cloud API";
    return "unconfigured";
  }

  isConfigured(): boolean {
    return Boolean(
      process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_ACCESS_TOKEN
    );
  }

  private normalizePhoneNumber(phone: string): string {
    return phone.replace(/[^\d]/g, "");
  }

  async sendVerification(
    params: VerificationSendParams
  ): Promise<VerificationSendResult> {
    const { destination, code, expiresInMinutes = 5, appName = "DropEarn" } = params;

    if (!this.isConfigured()) {
      return {
        success: false,
        channel: "WHATSAPP",
        provider: "unconfigured",
        error:
          "WhatsApp provider is not configured. Please set WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN.",
      };
    }

    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const token = process.env.WHATSAPP_ACCESS_TOKEN;
    const to = this.normalizePhoneNumber(destination);

    try {
      const res = await fetch(
        `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to,
            type: "text",
            text: {
              preview_url: false,
              body: `🔐 *${appName} Security Code*\n\nYour verification code is: *${code}*\n\nThis code expires in ${expiresInMinutes} minutes. Never share this code with anyone.`,
            },
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || `WhatsApp API error HTTP ${res.status}`);
      }

      return {
        success: true,
        channel: "WHATSAPP",
        provider: "Meta WhatsApp Cloud API",
        messageId: data.messages?.[0]?.id,
      };
    } catch (err: any) {
      console.error("[WhatsAppVerificationProvider] WhatsApp sending error:", err);
      return {
        success: false,
        channel: "WHATSAPP",
        provider: "Meta WhatsApp Cloud API",
        error: err.message || "Failed to send message via WhatsApp Business API",
      };
    }
  }
}
