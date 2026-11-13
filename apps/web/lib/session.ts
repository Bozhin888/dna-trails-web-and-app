import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { env } from './config';
import { store } from './store';

const COOKIE = 'dna_session';
const key = () => { if (!env.secret) throw new Error('SESSION_SECRET is not set'); return new TextEncoder().encode(env.secret); };

export async function startSession(uid: string) {
  const token = await new SignJWT({ uid }).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('90d').sign(key());
  (await cookies()).set(COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 90 });
}
export async function endSession() { (await cookies()).delete(COOKIE); }
export async function currentUser() {
  const t = (await cookies()).get(COOKIE)?.value; if (!t) return null;
  try { const { payload } = await jwtVerify(t, key()); return await store.getUser(String(payload.uid)); } catch { return null; }
}
