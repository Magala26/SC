import { ENV } from "./env";

export type WhatsAppMessagePayload = {
  to: string; // Phone number in format: +27665884466
  message: string;
};

/**
 * Sends a WhatsApp message to the specified phone number
 * Uses Twilio WhatsApp API
 */
export async function sendWhatsAppMessage(
  payload: WhatsAppMessagePayload
): Promise<boolean> {
  const { to, message } = payload;

  // Validate inputs
  if (!to || !message) {
    console.error("[WhatsApp] Missing required fields: to or message");
    return false;
  }

  // Check if Twilio credentials are configured
  if (!ENV.twilioAccountSid || !ENV.twilioAuthToken || !ENV.twilioPhoneNumber) {
    console.warn(
      "[WhatsApp] Twilio credentials not configured. Skipping WhatsApp notification."
    );
    return false;
  }

  try {
    // Format phone number to E.164 format if needed
    let formattedPhone = to;
    if (!formattedPhone.startsWith("+")) {
      // Assume South African number
      if (formattedPhone.startsWith("0")) {
        formattedPhone = "+27" + formattedPhone.substring(1);
      } else {
        formattedPhone = "+" + formattedPhone;
      }
    }

    // Construct Twilio API endpoint
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${ENV.twilioAccountSid}/Messages.json`;

    // Create form data for Twilio
    const formData = new URLSearchParams();
    formData.append("From", `whatsapp:${ENV.twilioPhoneNumber}`);
    formData.append("To", `whatsapp:${formattedPhone}`);
    formData.append("Body", message);

    // Send request to Twilio
    const response = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${ENV.twilioAccountSid}:${ENV.twilioAuthToken}`
        ).toString("base64")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error(
        `[WhatsApp] Failed to send message (${response.status} ${response.statusText}): ${errorText}`
      );
      return false;
    }

    const result = await response.json();
    console.log(`[WhatsApp] Message sent successfully. SID: ${result.sid}`);
    return true;
  } catch (error) {
    console.error("[WhatsApp] Error sending WhatsApp message:", error);
    return false;
  }
}
