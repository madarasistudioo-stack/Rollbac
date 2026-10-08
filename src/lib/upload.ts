// Shrinks a photo in the browser to print quality (longest side 2400px, which
// prints sharp up to about 8 inches) before uploading it, then returns its URL.
const MAX_SIDE = 2400;

async function shrink(file: File): Promise<Blob> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size < 1.5 * 1024 * 1024) return file;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.88));
    return blob ?? file;
  } catch {
    return file;
  }
}

export async function uploadPhoto(file: File): Promise<string> {
  const small = await shrink(file);
  const form = new FormData();
  form.append("file", small instanceof File ? small : new File([small], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" }));
  const res = await fetch("/api/upload", { method: "POST", body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.url) throw new Error(data.error ?? "Upload failed.");
  return data.url as string;
}
