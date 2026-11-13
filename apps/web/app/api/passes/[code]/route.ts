import { body, fail, json } from '@/lib/http';
import { currentUser } from '@/lib/session';
import { store } from '@/lib/store';
import type { Pass } from '@/lib/types';

// Progress on the road: stage, current stop and collected stamps.
export async function PATCH(req: Request, ctx: { params: Promise<{ code: string }> }) {
  const u = await currentUser(); if (!u) return fail(401, 'Sign in first.');
  const p = await store.getPass((await ctx.params).code); if (!p || p.owner !== u.id) return fail(404, 'No such pass.');
  if (p.stage === 'pending') return fail(409, 'This pass is not paid yet.');
  const b = await body<Partial<Pass>>(req);
  if (b.stage === 'road' || b.stage === 'done' || (b.stage === 'confirmed' && p.stage === 'booked')) p.stage = b.stage;
  if (typeof b.at === 'number') p.at = Math.max(0, Math.floor(b.at));
  if (Array.isArray(b.got)) p.got = [...new Set(b.got.filter(x => typeof x === 'string'))].slice(0, 200);
  if (typeof b.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(b.date) && p.stage === 'booked') p.date = b.date;
  await store.savePass(p);
  return json({ pass: p });
}
