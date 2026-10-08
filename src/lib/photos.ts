import { getCloudflareContext } from "@opennextjs/cloudflare";

// Customer photos live in a Cloudflare KV namespace bound as PHOTOS
// (see wrangler.jsonc). Free plan: 1 GB total, 1,000 writes a day.
type KV = {
  put(key: string, value: ArrayBuffer, options?: { metadata?: Record<string, string> }): Promise<void>;
  getWithMetadata(key: string, type: "arrayBuffer"): Promise<{ value: ArrayBuffer | null; metadata: Record<string, string> | null }>;
};

export async function photoStore(): Promise<KV | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return ((env as Record<string, unknown>).PHOTOS as KV | undefined) ?? null;
  } catch {
    return null;
  }
}
