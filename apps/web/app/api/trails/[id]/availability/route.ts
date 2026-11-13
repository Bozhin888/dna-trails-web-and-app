import { trailById } from '@dna/data';
import { fail, json } from '@/lib/http';
import { carsLeft } from '@/lib/passes';
export const dynamic = 'force-dynamic';
export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const id = (await ctx.params).id; const t = trailById(id); if (!t) return fail(404, 'No such trail.');
  const date = new URL(req.url).searchParams.get('date') || '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return fail(400, 'Give a date as YYYY-MM-DD.');
  return json({ trail: id, date, cap: t.cap, left: await carsLeft(id, date) });
}
