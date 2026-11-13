import { env } from '@/lib/config';
export const dynamic = 'force-dynamic';
export function GET() { return Response.json({ demo: env.demo, payments: env.payments, db: !!env.databaseUrl }); }
