import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOtp, hashOtp, normalizePhone, otpExpiry } from "@/lib/otp";

// Basic in-memory throttle per phone number to slow down abuse between
// server restarts. For real protection, put this behind Vercel's rate
// limiting or a service like Upstash Ratelimit.
const lastSentAt = new Map<string, number>();
const MIN_INTERVAL_MS = 30_000;

export async function POST(req: Request) {
  const { phone: rawPhone } = await req.json();
  if (!rawPhone || typeof rawPhone !== "string") {
    return NextResponse.json({ error: "Phone number is required." }, { status: 400 });
  }

  const phone = normalizePhone(rawPhone);
  if (phone.replace(/\D/g, "").length < 8) {
    return NextResponse.json({ error: "Enter a valid phone number." }, { status: 400 });
  }

  const last = lastSentAt.get(phone);
  if (last && Date.now() - last < MIN_INTERVAL_MS) {
    return NextResponse.json(
      { error: "Please wait a few seconds before requesting another code." },
      { status: 429 }
    );
  }

  const code = generateOtp();
  await prisma.phoneOtp.create({
    data: { phone, codeHash: hashOtp(phone, code), expiresAt: otpExpiry() },
  });
  lastSentAt.set(phone, Date.now());

  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SERVICE_SID } = process.env;

  if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_VERIFY_SERVICE_SID) {
    // Sends the code as a plain SMS via Twilio. Swap this block for
    // Twilio Verify or MSG91 (common for Indian DLT-registered sender IDs)
    // if you'd rather not manage OTP storage yourself — see README.
    const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64");
    const body = new URLSearchParams({
      To: phone,
      MessagingServiceSid: TWILIO_VERIFY_SERVICE_SID,
      Body: `${code} is your Rollbac sign-in code. It expires in 10 minutes.`,
    });

    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      }
    );

    if (!res.ok) {
      const detail = await res.text();
      console.error("Twilio send failed:", detail);
      return NextResponse.json({ error: "Could not send the code. Try again shortly." }, { status: 502 });
    }
  } else {
    // No SMS provider configured yet — log so you can still test locally.
    console.warn(`[dev only] OTP for ${phone}: ${code}`);
  }

  return NextResponse.json({ ok: true });
}
