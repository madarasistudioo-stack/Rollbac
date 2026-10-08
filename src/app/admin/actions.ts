"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdminEmail, requireAdmin } from "@/lib/admin";
import { getProductBySlug } from "@/lib/products";

function int(value: FormDataEntryValue | null): number | null {
  const s = String(value ?? "").trim();
  if (s === "") return null;
  const n = Math.round(Number(s));
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export async function saveProductSetting(form: FormData) {
  await requireAdmin();
  const slug = String(form.get("slug"));
  if (!getProductBySlug(slug)) return;
  const data = {
    price: int(form.get("price")),
    compareAt: int(form.get("compareAt")),
    stock: int(form.get("stock")),
    hidden: form.get("visible") !== "on",
  };
  await prisma.productSetting.upsert({ where: { slug }, create: { slug, ...data }, update: data });
  revalidatePath("/", "layout");
}

export async function resetProductSetting(form: FormData) {
  await requireAdmin();
  await prisma.productSetting.deleteMany({ where: { slug: String(form.get("slug")) } });
  revalidatePath("/", "layout");
}

export async function setUserBlocked(form: FormData) {
  await requireAdmin();
  const id = String(form.get("id"));
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || isAdminEmail(user.email)) return; // never lock the owner out
  await prisma.user.update({ where: { id }, data: { blocked: form.get("blocked") === "true" } });
  revalidatePath("/admin/users");
}

export async function deleteUser(form: FormData) {
  await requireAdmin();
  if (form.get("confirm") !== "on") return;
  const id = String(form.get("id"));
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || isAdminEmail(user.email)) return;
  await prisma.user.delete({ where: { id } }); // orders are kept, detached from the account
  revalidatePath("/admin/users");
}

export async function addUser(form: FormData) {
  await requireAdmin();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const name = String(form.get("name") ?? "").trim() || null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
  await prisma.user.upsert({ where: { email }, create: { email, name }, update: { name: name ?? undefined } });
  revalidatePath("/admin/users");
}

export async function setOrderStatus(form: FormData) {
  await requireAdmin();
  const status = String(form.get("status"));
  if (!ORDER_STATUSES.includes(status)) return;
  await prisma.order.update({ where: { id: String(form.get("id")) }, data: { status } });
  revalidatePath("/admin/orders");
}

const ORDER_STATUSES = ["created", "paid", "printing", "shipped", "delivered", "cancelled", "refunded", "failed"];

// --- CRM --------------------------------------------------------------------

export async function addNote(form: FormData) {
  await requireAdmin();
  const userId = String(form.get("userId"));
  const body = String(form.get("body") ?? "").trim().slice(0, 2000);
  if (body) await prisma.customerNote.create({ data: { userId, body } });
  revalidatePath(`/admin/users/${userId}`);
}

export async function deleteNote(form: FormData) {
  await requireAdmin();
  const note = await prisma.customerNote.delete({ where: { id: String(form.get("id")) } });
  revalidatePath(`/admin/users/${note.userId}`);
}

export async function setTags(form: FormData) {
  await requireAdmin();
  const userId = String(form.get("userId"));
  const tags = Array.from(new Set(String(form.get("tags") ?? "").split(",").map((t) => t.trim()).filter(Boolean))).slice(0, 12);
  await prisma.user.update({ where: { id: userId }, data: { tags } });
  revalidatePath(`/admin/users/${userId}`);
}

export async function setLeadStatus(form: FormData) {
  await requireAdmin();
  const status = String(form.get("status"));
  if (!["new", "contacted", "converted", "unsubscribed"].includes(status)) return;
  await prisma.lead.update({ where: { id: String(form.get("id")) }, data: { status, note: String(form.get("note") ?? "") || undefined } });
  revalidatePath("/admin/leads");
}

export async function deleteLead(form: FormData) {
  await requireAdmin();
  await prisma.lead.delete({ where: { id: String(form.get("id")) } });
  revalidatePath("/admin/leads");
}

export async function replyTicket(form: FormData) {
  await requireAdmin();
  const id = String(form.get("id"));
  const body = String(form.get("body") ?? "").trim().slice(0, 4000);
  if (!body) return;
  const ticket = await prisma.supportTicket.update({
    where: { id },
    data: { status: "replied", messages: { create: { body, fromAdmin: true } } },
  });
  const { sendMail } = await import("@/lib/mailer");
  await sendMail(ticket.email, `Re: ${ticket.subject}`, `Hi ${ticket.name},\n\n${body}\n\n— Rollbac`);
  revalidatePath(`/admin/inbox/${id}`);
}

export async function setTicketStatus(form: FormData) {
  await requireAdmin();
  const id = String(form.get("id"));
  const status = String(form.get("status"));
  if (!["open", "replied", "closed"].includes(status)) return;
  await prisma.supportTicket.update({ where: { id }, data: { status } });
  revalidatePath(`/admin/inbox/${id}`);
  revalidatePath("/admin/inbox");
}

// Rebuilds the site so inventory edits (prices, stock, hidden products) reach
// the pre-built shop pages. Uses the Cloudflare deploy hook in DEPLOY_HOOK_URL.
export async function publishSite(): Promise<{ ok: boolean; message: string }> {
  await requireAdmin();
  const hook = process.env.DEPLOY_HOOK_URL;
  if (!hook) return { ok: false, message: "Publishing isn't set up yet (DEPLOY_HOOK_URL is missing)." };
  const res = await fetch(hook, { method: "POST" });
  return res.ok
    ? { ok: true, message: "Publishing — your changes will be live in about 3–5 minutes." }
    : { ok: false, message: `Couldn't start publishing (error ${res.status}). Try again in a minute.` };
}
