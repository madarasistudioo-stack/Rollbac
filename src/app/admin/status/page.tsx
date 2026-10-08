import { prisma } from "@/lib/prisma";
import { ADMIN_EMAILS } from "@/lib/admin";
import { mailConfigured } from "@/lib/mailer";
import { photoStore } from "@/lib/photos";
import { Panel, Row } from "@/components/admin/Panel";

const has = (...keys: string[]) => keys.every((k) => Boolean(process.env[k]));

export default async function StatusPage() {
  let dbMs: number | null = null;
  let counts: Record<string, number> = {};
  try {
    const t = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbMs = Date.now() - t;
    const [users, orders, events, settings] = await Promise.all([
      prisma.user.count(), prisma.order.count(), prisma.event.count(), prisma.productSetting.count(),
    ]);
    counts = { users, orders, events, settings };
  } catch {
    dbMs = null;
  }

  const features = [
    { name: "Database", ok: dbMs !== null, note: dbMs !== null ? `responding in ${dbMs} ms` : "not reachable — check DATABASE_URL" },
    { name: "Google sign-in", ok: has("GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET") },
    { name: "Email (Resend)", ok: mailConfigured() },
    { name: "Phone sign-in (OTP)", ok: has("TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_VERIFY_SERVICE_SID") },
    { name: "Apple sign-in", ok: has("APPLE_CLIENT_ID", "APPLE_CLIENT_SECRET") },
    { name: "Photo uploads (Cloudflare KV)", ok: Boolean(await photoStore()) },
    { name: "Payments (Razorpay)", ok: has("RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET") },
  ];
  const sha = process.env.VERCEL_GIT_COMMIT_SHA;

  return (
    <div>
      <h1 className="font-display text-3xl text-pine">Site status</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Features">
          {features.map((f) => (
            <Row
              key={f.name}
              left={<span><span className={f.ok ? "text-sage" : "text-rust"}>●</span> {f.name}</span>}
              right={f.note ?? (f.ok ? "configured" : "not set up")}
            />
          ))}
        </Panel>
        <Panel title="Live version">
          <Row left="Environment" right={process.env.VERCEL_ENV ?? "local"} />
          <Row left="Commit" right={sha ? sha.slice(0, 7) : "—"} />
          <Row left="Message" right={process.env.VERCEL_GIT_COMMIT_MESSAGE?.split("\n")[0] ?? "—"} />
          <Row left="Admins" right={ADMIN_EMAILS.join(", ")} />
          {Object.entries(counts).map(([k, v]) => <Row key={k} left={`Rows: ${k}`} right={v} />)}
        </Panel>
      </div>
      <p className="mt-6 text-sm text-pine/55">
        Deploy logs: <a className="text-olive hover:underline" href="https://dash.cloudflare.com" target="_blank" rel="noreferrer">Cloudflare</a>
        {" · "}Database: <a className="text-olive hover:underline" href="https://console.neon.tech" target="_blank" rel="noreferrer">Neon</a>
      </p>
    </div>
  );
}
