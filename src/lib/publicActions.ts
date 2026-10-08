"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mailer";
import { ADMIN_EMAILS } from "@/lib/admin";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (v: FormDataEntryValue | null, max = 200) => String(v ?? "").trim().slice(0, max);

export async function subscribe(_: unknown, form: FormData): Promise<{ ok: boolean; message: string }> {
  const email = clean(form.get("email")).toLowerCase();
  if (!EMAIL.test(email)) return { ok: false, message: "Please enter a valid email." };
  await prisma.lead.upsert({ where: { email }, create: { email, source: "newsletter" }, update: { status: "new" } });
  return { ok: true, message: "You're on the list — thank you!" };
}

export async function contact(_: unknown, form: FormData): Promise<{ ok: boolean; message: string }> {
  const name = clean(form.get("name"), 80);
  const email = clean(form.get("email")).toLowerCase();
  const phone = clean(form.get("phone"), 20) || null;
  const subject = clean(form.get("subject"), 120) || "General question";
  const body = clean(form.get("message"), 4000);
  const orderRef = clean(form.get("order"), 40) || null;
  if (!name || !EMAIL.test(email) || body.length < 5) return { ok: false, message: "Please fill in your name, email and message." };

  const session = await getServerSession(authOptions);
  await prisma.supportTicket.create({
    data: {
      userId: (session?.user as { id?: string } | undefined)?.id ?? null,
      name, email, phone, subject, orderRef,
      messages: { create: { body } },
    },
  });
  await prisma.lead.upsert({ where: { email }, create: { email, name, phone, source: "contact" }, update: { name, phone: phone ?? undefined } });
  await sendMail(ADMIN_EMAILS[0], `New message: ${subject}`, `${name} <${email}>${phone ? ` · ${phone}` : ""}\n\n${body}\n\nReply from /admin/inbox`);
  return { ok: true, message: "Thanks! We usually reply within a working day." };
}
