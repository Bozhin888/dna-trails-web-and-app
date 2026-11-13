import { env } from '@/lib/config';
import { body, fail, json } from '@/lib/http';
import { issueCode, normContact, validContact } from '@/lib/otp';
import { sendCode } from '@/lib/notify';

export async function POST(req: Request) {
  const b = await body<{ name?: string; contact?: string }>(req);
  const name = (b.name || '').trim().slice(0, 80); const contact = normContact(b.contact || '');
  if (!validContact(contact)) return fail(400, 'Enter an email or a mobile number.');
  const code = await issueCode(contact);
  try { await sendCode(contact, code, name); } catch { return fail(502, 'We could not send the code. Try again in a minute.'); }
  return json({ ok: true, ...(env.demo ? { devCode: code } : {}) });
}
