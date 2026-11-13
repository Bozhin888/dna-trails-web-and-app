import { body, fail, json } from '@/lib/http';
import { currentUser } from '@/lib/session';
import { store } from '@/lib/store';

// A code from a rental desk, a hotel card or the person who bought the trail.
// Wholesale desk codes will be issued as unowned passes ("owner" = "desk:<partner>").
export async function POST(req: Request) {
  const u = await currentUser(); if (!u) return fail(401, 'Sign in first.');
  let code = String((await body<{ code?: string }>(req)).code || '').toUpperCase().replace(/\s+/g, '');
  if (code && !code.startsWith('DNA-')) code = 'DNA-' + code.replace(/^DNA/, '');
  const p = await store.getPass(code);
  if (!p || p.stage === 'pending') return fail(404, 'No pass with that code.');
  if (p.owner.startsWith('desk:')) { p.owner = u.id; await store.savePass(p); }
  else if (p.owner !== u.id) return fail(403, 'That pass belongs to another profile. Ask its owner to share the trail.');
  return json({ pass: p });
}
