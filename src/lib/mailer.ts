// Sends email through Resend's HTTP API (Cloudflare Workers can't open SMTP
// connections). Uses the same Resend key that's stored as EMAIL_SERVER_PASSWORD.
// Returns false when email isn't set up yet, so callers can carry on without it.
const apiKey = () => process.env.RESEND_API_KEY ?? process.env.EMAIL_SERVER_PASSWORD;

export const mailConfigured = () => Boolean(apiKey() && process.env.EMAIL_FROM);

export async function sendMail(to: string, subject: string, text: string, html?: string): Promise<boolean> {
  if (!mailConfigured()) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey()}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        text,
        html,
        reply_to: process.env.EMAIL_REPLY_TO || undefined,
      }),
    });
    if (!res.ok) console.error("Email failed:", res.status, await res.text());
    return res.ok;
  } catch (err) {
    console.error("Email failed:", err);
    return false;
  }
}
