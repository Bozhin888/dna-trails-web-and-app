export const env = {
  demo: process.env.DEMO_MODE === '1' || (!process.env.DATABASE_URL && process.env.NODE_ENV !== 'production'),
  secret: process.env.SESSION_SECRET || (process.env.NODE_ENV === 'production' && process.env.DEMO_MODE !== '1' ? '' : 'dev-only-secret-change-me-0123456789'),
  databaseUrl: process.env.DATABASE_URL || '',
  resendKey: process.env.RESEND_API_KEY || '',
  mailFrom: process.env.MAIL_FROM || 'DNA Trails <hello@dnatrails.mk>',
  payments: process.env.PAYMENTS_PROVIDER || 'mock',
};
export const today = () => new Date().toISOString().slice(0, 10);
