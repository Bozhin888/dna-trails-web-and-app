import { body, fail, json } from '@/lib/http';
import { normContact, validContact } from '@/lib/otp';
import { currentUser, endSession } from '@/lib/session';
import { store } from '@/lib/store';
export const dynamic = 'force-dynamic';

export async function GET() {
  const u = await currentUser();
  return json({ user: u, passes: u ? await store.passesOf(u.id) : [] });
}
export async function PATCH(req: Request) {
  const u = await currentUser(); if (!u) return fail(401, 'Sign in first.');
  const b = await body<Partial<typeof u>>(req);
  if (typeof b.name === 'string' && b.name.trim()) u.name = b.name.trim().slice(0, 80);
  if (typeof b.contact === 'string') {
    const c = normContact(b.contact);
    if (c !== u.contact) {
      // Changing where we reach you: a new address must not belong to another profile.
      if (!validContact(c)) return fail(400, 'Enter an email or a mobile number.');
      if (await store.findUserByContact(c)) return fail(409, 'Another profile already uses that address.');
      u.contact = c;
    }
  }
  if (b.car === 'small' || b.car === 'regular' || b.car === 'suv') u.car = b.car;
  if (b.lang === 'en' || b.lang === 'mk') u.lang = b.lang;
  if (typeof b.people === 'number') u.people = Math.min(9, Math.max(1, b.people));
  if (b.card === false) u.card = false;
  await store.saveUser(u);
  return json({ user: u });
}
export async function DELETE() {
  const u = await currentUser(); if (!u) return fail(401, 'Sign in first.');
  await store.deleteUser(u.id); await endSession();
  return json({ ok: true });
}
