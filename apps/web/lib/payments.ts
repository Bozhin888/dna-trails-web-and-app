// Payments sit behind one interface, because the provider is not chosen yet.
// Card numbers never touch DNA Trails: a real provider shows its own hosted form
// (redirect or embedded) and confirms the payment by webhook.
import { env } from './config';
import type { Pass } from './types';

export interface CheckoutResult { status: 'paid' | 'redirect'; url?: string; ref: string }
export interface PaymentProvider {
  name: string;
  /** Start a payment for a pending pass. */
  createCheckout(p: Pass, eur: number, opts: { method: string; returnUrl: string }): Promise<CheckoutResult>;
  /** Verify a webhook and return the pass code it confirms, or null. */
  verifyWebhook(req: Request): Promise<{ code: string; ref: string } | null>;
  refund(p: Pass): Promise<void>;
}

const mock: PaymentProvider = {
  name: 'mock',
  async createCheckout(p) { return { status: 'paid', ref: 'mock_' + p.code }; },
  async verifyWebhook() { return null; },
  async refund() {},
};

const providers: Record<string, PaymentProvider> = { mock };
export const payments = (): PaymentProvider => {
  const p = providers[env.payments];
  if (!p) throw new Error(`Payment provider "${env.payments}" is not set up yet`);
  return p;
};
