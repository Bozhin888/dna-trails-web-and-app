import { SignJWT, jwtVerify } from 'jose';
import { cookies, headers } from 'next/headers';
import { env } from './config';
import { store } from './store';

const COOKIE = 'dna_session';
const key = () => { if (!env.secret) throw new Error('SESSION_SECRET is not set'); return new TextEncoder().encode(env.secret); };

export const signToken = (uid: string) => new SignJWT({ uid }).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('90d').sign(key());
export async function startSession(uid: string) {
  const token = await new SignJWT({ uid }).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('90d').sign(key());
  (await cookies()).set(COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 90 });
}
export async function endSession() { (await cookies()).delete(COOKIE); }
export async function currentUser() {
  // The website uses an httpOnly cookie; the mobile app sends the same token as a Bearer header.
  const auth = (await headers()).get('authorization') || '';
  const t = (auth.startsWith('Bearer ') ? auth.slice(7) : '') || (await cookies()).get(COOKIE)?.value; if (!t) return null;
  try { const { payload } = await jwtVerify(t, key()); return await store.getUser(String(payload.uid)); } catch { return null; }
}
