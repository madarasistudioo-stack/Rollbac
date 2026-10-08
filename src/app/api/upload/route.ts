import { NextResponse } from "next/server";
import { photoStore } from "@/lib/photos";

const MAX_BYTES = 15 * 1024 * 1024;

export async function POST(req: Request) {
  const store = await photoStore();
  if (!store) return NextResponse.json({ error: "Photo storage isn't connected yet." }, { status: 503 });

  const form = await req.formData();
  const file = form.get("file");
  if (!file || !(file instanceof File)) return NextResponse.json({ error: "No file provided." }, { status: 400 });
  if (!file.type.startsWith("image/")) return NextResponse.json({ error: "Only image files are accepted." }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Please upload an image under 15MB." }, { status: 400 });

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const key = `p/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${ext}`;
  try {
    await store.put(key, await file.arrayBuffer(), { metadata: { type: file.type, name: file.name.slice(0, 100) } });
    return NextResponse.json({ url: `/api/photo/${key}` });
  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json({ error: "Upload failed. Try again." }, { status: 502 });
  }
}
