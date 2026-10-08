import crypto from "crypto";

const OTP_TTL_MINUTES = 10;
const MAX_ATTEMPTS = 5;

export function hashOtp(phone: string, code: string): string {
  const secret = process.env.NEXTAUTH_SECRET ?? "dev-only-secret";
  return crypto.createHash("sha256").update(`${phone}:${code}:${secret}`).digest("hex");
}

export function generateOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export function otpExpiry(): Date {
  return new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
}

export function normalizePhone(raw: string): string {
  // Keep a leading + and digits only, e.g. "+91 98765 43210" -> "+919876543210"
  const trimmed = raw.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  return hasPlus ? `+${digits}` : digits;
}

export const OTP_MAX_ATTEMPTS = MAX_ATTEMPTS;
