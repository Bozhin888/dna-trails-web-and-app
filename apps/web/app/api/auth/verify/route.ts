import { randomUUID } from 'node:crypto';
import { today } from '@/lib/config';
import { body, fail, json } from '@/lib/http';
import { checkCode, normContact } from '@/lib/otp';
import { signToken, startSession } from '@/lib/session';
import { store } from '@/lib/store';
import type { User } from '@/lib/types';

export async function POST(req: Request) {
  const b = await body<{ contact?: string; code?: string; name?: string; car?: User['car']; people?: number }>(req);
  const contact = normContact(b.contact || '');
  if (!(await checkCode(contact, b.code || ''))) return fail(401, 'That code did not match, or it has expired.');
  let u = await store.findUserByContact(contact);
  if (!u) {
    u = { id: randomUUID(), name: (b.name || '').trim().slice(0, 80) || 'Traveller', contact, car: b.car || 'regular',
      people: Math.min(9, Math.max(1, Number(b.people) || 2)), lang: 'en', since: today(), card: false };
    await store.saveUser(u);
  }
  await startSession(u.id);
  const app = req.headers.get('x-dna-client') === 'app';
  return json({ user: u, passes: await store.passesOf(u.id), ...(app ? { token: await signToken(u.id) } : {}) });
}
