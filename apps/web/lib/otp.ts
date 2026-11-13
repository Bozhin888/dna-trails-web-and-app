// Six-digit sign-in codes. Stored hashed, valid 10 minutes, 5 tries.
import { createHash, randomInt } from 'node:crypto';
import { env } from './config';
import { store } from './store';

const hash = (contact: string, code: string) => createHash('sha256').update(env.secret + '|' + contact + '|' + code).digest('hex');
export const normContact = (c: string) => { c = c.trim(); return c.includes('@') ? c.toLowerCase() : c.replace(/[^\d+]/g, ''); };
export const validContact = (c: string) => /^\S+@\S+\.\S+$/.test(c) || c.replace(/\D/g, '').length >= 8;

export async function issueCode(contact: string) {
  const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
  await store.putOtp({ contact, hash: hash(contact, code), expires: Date.now() + 10 * 60_000, tries: 0 });
  return code;
}
export async function checkCode(contact: string, code: string) {
  const o = await store.getOtp(contact); if (!o) return false;
  if (o.expires < Date.now() || o.tries >= 5) { await store.dropOtp(contact); return false; }
  if (o.hash !== hash(contact, code.replace(/\D/g, ''))) { o.tries++; await store.putOtp(o); return false; }
  await store.dropOtp(contact); return true;
}
