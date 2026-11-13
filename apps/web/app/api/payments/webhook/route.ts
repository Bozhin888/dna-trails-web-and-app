import { today } from '@/lib/config';
import { fail, json } from '@/lib/http';
import { priceFor } from '@/lib/passes';
import { payments } from '@/lib/payments';
import { store } from '@/lib/store';

// The provider calls this when a hosted payment succeeds.
export async function POST(req: Request) {
  const ok = await payments().verifyWebhook(req); if (!ok) return fail(400, 'Not verified.');
  const p = await store.getPass(ok.code); if (!p) return fail(404, 'No such pass.');
  if (p.stage === 'pending') { p.stage = 'booked'; p.paid = { method: 'card', eur: priceFor(p.trail, !!p.composed) || 0, at: today(), ref: ok.ref }; await store.savePass(p); }
  return json({ ok: true });
}
