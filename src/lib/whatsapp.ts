/**
 * Official CodeInIndia WhatsApp Channel URL
 * Used across the entire registration and post-payment follow-up flow.
 */
export const CODEININDIA_WHATSAPP_CHANNEL_URL = "https://whatsapp.com/channel/0029VbDYRr50gcfQYB4x650C";

/**
 * Returns the official WhatsApp Channel URL.
 * URL is immutable and strictly preserved: https://whatsapp.com/channel/0029VbDYRr50gcfQYB4x650C
 */
export function getWhatsappChannelUrl(): string {
  return CODEININDIA_WHATSAPP_CHANNEL_URL;
}

/**
 * Helper utility to fetch the configured WhatsApp phone number.
 * Defaults to the placeholder number if not provided in env.
 */
export function getWhatsappNumber(): string {
  const envNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
  if (envNumber && envNumber.trim() !== "") {
    // Strip out all non-numeric characters (spaces, +, -, brackets)
    return envNumber.replace(/\D/g, "");
  }
  // Default placeholder number (can be replaced by user in the Settings tab)
  return "919999999999";
}

/**
 * Checks if the configured WhatsApp number is the default placeholder number.
 */
export function isPlaceholderNumber(): boolean {
  return getWhatsappNumber() === "919999999999";
}

/**
 * Legacy compatibility helper - returns the official WhatsApp Channel URL.
 */
export function getWhatsappGroupUrl(_name?: string, _phone?: string, _email?: string): string {
  return CODEININDIA_WHATSAPP_CHANNEL_URL;
}

