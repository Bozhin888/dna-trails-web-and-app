import { randomInt } from 'node:crypto';
import { trailById, priceOf, TYPES } from '@dna/data';
import { store } from './store';

const AL = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export async function newCode() {
  for (;;) { const c = 'DNA-' + Array.from({ length: 4 }, () => AL[randomInt(AL.length)]).join(''); if (!(await store.getPass(c))) return c; }
}
export async function carsLeft(trailId: string, date: string) {
  const t = trailById(trailId); if (!t) return 0;
  return Math.max(0, t.cap - (await store.carsBooked(trailId, date)));
}
export function priceFor(trailId: string, composed: boolean) {
  if (composed) return TYPES.composed.price;
  const t = trailById(trailId); return t ? priceOf(t) : null;
}
