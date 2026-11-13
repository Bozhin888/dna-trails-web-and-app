import { trailById } from '@dna/data';
import { today } from '@/lib/config';
import { body, fail, json } from '@/lib/http';
import { carsLeft, newCode, priceFor } from '@/lib/passes';
import { payments } from '@/lib/payments';
import { currentUser } from '@/lib/session';
import { store } from '@/lib/store';
import type { Pass } from '@/lib/types';

// Buy a pass: once per car. Creates a pending pass, then hands over to the
// payment provider. With the mock provider it is paid at once.
export async function POST(req: Request) {
  const u = await currentUser(); if (!u) return fail(401, 'Sign in first.');
  const b = await body<{ trail?: string; date?: string; car?: Pass['car']; people?: number; method?: string; composed?: unknown; keepCard?: boolean }>(req);
  const composed = !!b.composed; const trail = composed ? 'composed' : String(b.trail || '');
  if (!composed && !trailById(trail)) return fail(404, 'No such trail.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(b.date || '')) return fail(400, 'Pick a date.');
  if (!composed && (await carsLeft(trail, b.date!)) < 1) return fail(409, 'That day is full. Pick another date.');
  const eur = priceFor(trail, composed)!;
  const method = ['saved', 'card', 'wallet'].includes(b.method || '') ? b.method! : 'card';
  const p: Pass = { code: await newCode(), owner: u.id, trail, date: b.date!, car: b.car || u.car, people: Math.min(9, Math.max(1, Number(b.people) || u.people)),
    stage: 'pending', at: 0, got: [], bought: today(), paid: null, ...(composed ? { composed: b.composed } : {}) };
  await store.savePass(p);
  const origin = new URL(req.url).origin;
  const r = await payments().createCheckout(p, eur, { method, returnUrl: `${origin}/#pass-${p.code}` });
  if (r.status === 'paid') {
    p.stage = 'booked'; p.paid = { method, eur, at: today(), ref: r.ref }; await store.savePass(p);
    if (method === 'card' && b.keepCard && !u.card) { u.card = true; await store.saveUser(u); }
    return json({ pass: p, user: u });
  }
  return json({ pass: p, redirect: r.url });
}
