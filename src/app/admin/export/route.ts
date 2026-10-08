import { requireAdmin } from "@/lib/admin";
import { segmentRows, toCsv } from "@/lib/segments";

// CSV download of any segment, for WhatsApp / email campaigns.
export async function GET(req: Request) {
  await requireAdmin();
  const id = new URL(req.url).searchParams.get("segment") ?? "subscribers";
  return new Response(toCsv(await segmentRows(id)), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="rollbac-${id}-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
