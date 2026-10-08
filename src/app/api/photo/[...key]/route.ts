import { photoStore } from "@/lib/photos";

// Serves an uploaded photo. Photos never change once uploaded, so browsers and
// Cloudflare's edge may cache them for a year.
export async function GET(_: Request, props: { params: Promise<{ key: string[] }> }) {
  const { key } = await props.params;
  const store = await photoStore();
  if (!store) return new Response("Not found", { status: 404 });
  const { value, metadata } = await store.getWithMetadata(key.join("/"), "arrayBuffer");
  if (!value) return new Response("Not found", { status: 404 });
  return new Response(value, {
    headers: {
      "Content-Type": metadata?.type ?? "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
