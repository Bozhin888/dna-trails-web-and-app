import { fail, json } from '@/lib/http';
import { currentUser } from '@/lib/session';
import { store } from '@/lib/store';
export const dynamic = 'force-dynamic';
export async function GET() {
  const u = await currentUser(); if (!u) return fail(401, 'Sign in first.');
  return json({ passes: await store.passesOf(u.id) });
}
