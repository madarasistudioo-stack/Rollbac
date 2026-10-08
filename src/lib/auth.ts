import type { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { hashOtp, normalizePhone, OTP_MAX_ATTEMPTS } from "@/lib/otp";
import { isAdminEmail } from "@/lib/admin";
import { mailConfigured, sendMail } from "@/lib/mailer";

const providers: AuthOptions["providers"] = [];

// --- Google -----------------------------------------------------------
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Google verifies emails, so a user an admin added by email can sign in with Google.
      allowDangerousEmailAccountLinking: true,
    })
  );
}

// --- Apple --------------------------------------------------------------
if (process.env.APPLE_CLIENT_ID && process.env.APPLE_CLIENT_SECRET) {
  providers.push(
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID,
      clientSecret: process.env.APPLE_CLIENT_SECRET,
    })
  );
}

// --- Email magic link (sent through Resend's API) ------------------------
if (mailConfigured()) {
  providers.push(
    EmailProvider({
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest({ identifier, url }) {
        const sent = await sendMail(
          identifier,
          "Your sign-in link for Rollbac",
          `Sign in to Rollbac Studio:\n\n${url}\n\nThis link expires in 24 hours. If you didn't ask for it, you can ignore this email.`,
          `<p>Sign in to Rollbac Studio:</p><p><a href="${url}" style="background:#5C6B3E;color:#F8F5EC;padding:10px 18px;border-radius:6px;text-decoration:none">Sign in</a></p><p style="color:#888">This link expires in 24 hours. If you didn't ask for it, you can ignore this email.</p>`
        );
        if (!sent) throw new Error("Could not send the sign-in email.");
      },
    })
  );
}

// --- Phone OTP (credentials-based) --------------------------------------
providers.push(
  CredentialsProvider({
    id: "phone",
    name: "Phone",
    credentials: {
      phone: { label: "Phone", type: "text" },
      code: { label: "Code", type: "text" },
    },
    async authorize(credentials) {
      if (!credentials?.phone || !credentials?.code) return null;
      const phone = normalizePhone(credentials.phone);

      const record = await prisma.phoneOtp.findFirst({
        where: { phone },
        orderBy: { createdAt: "desc" },
      });
      if (!record) return null;
      if (record.expiresAt < new Date()) return null;
      if (record.attempts >= OTP_MAX_ATTEMPTS) return null;

      const expectedHash = hashOtp(phone, credentials.code);
      if (expectedHash !== record.codeHash) {
        await prisma.phoneOtp.update({
          where: { id: record.id },
          data: { attempts: { increment: 1 } },
        });
        return null;
      }

      // Correct code — clean up the OTP and find-or-create the user.
      await prisma.phoneOtp.delete({ where: { id: record.id } });
      const user = await prisma.user.upsert({
        where: { phone },
        update: {},
        create: { phone },
      });

      return { id: user.id, name: user.name, email: user.email, phone: user.phone };
    },
  })
);

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    // Blocked accounts can't sign in.
    async signIn({ user }) {
      const existing = user.email
        ? await prisma.user.findUnique({ where: { email: user.email }, select: { blocked: true } })
        : user.id
          ? await prisma.user.findUnique({ where: { id: user.id }, select: { blocked: true } })
          : null;
      return !existing?.blocked;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        const u = session.user as { id?: string; isAdmin?: boolean };
        u.id = token.sub;
        u.isAdmin = isAdminEmail(session.user.email);
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account }) {
      await prisma.event
        .create({ data: { type: "signin", detail: account?.provider ?? "unknown", userId: user.id } })
        .catch(() => undefined);
    },
  },
};
