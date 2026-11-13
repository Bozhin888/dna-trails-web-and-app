// Sends the sign-in code. Email via Resend when configured; otherwise logs it.
// SMS/Viber delivery for mobile numbers is still to be chosen.
import { env } from './config';

export async function sendCode(contact: string, code: string, name: string) {
  if (contact.includes('@') && env.resendKey) {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { Authorization: `Bearer ${env.resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: env.mailFrom, to: contact, subject: `Your DNA Trails code: ${code}`,
        text: `Hi ${name.split(' ')[0] || 'there'},\n\nYour DNA Trails sign-in code is ${code}. It works for 10 minutes.\n\nGo where you're expected.\nDNA Trails` }),
    });
    if (!r.ok) throw new Error('Email could not be sent');
    return { delivered: true };
  }
  console.log(`[dna-trails] sign-in code for ${contact}: ${code}`);
  return { delivered: false };
}
