// Typed client for the DNA Trails API (apps/web/app/api). Used by the mobile app.
// The website UI talks to the same endpoints from apps/web/public/api.js.
export type CarClass = 'small' | 'regular' | 'suv';
export type Stage = 'pending' | 'booked' | 'confirmed' | 'road' | 'done';
export interface User { id: string; name: string; contact: string; car: CarClass; people: number; lang: 'en' | 'mk'; since: string; card: boolean }
export interface Pass {
  code: string; owner: string; trail: string; date: string; car: CarClass; people: number;
  stage: Stage; at: number; got: string[]; bought: string;
  paid: { method: string; eur: number; at: string; ref?: string } | null; refunded?: boolean;
}

export class ApiError extends Error { constructor(msg: string, public status: number) { super(msg); } }

export function createClient(base: string, opts: { getToken?: () => Promise<string | null> | string | null } = {}) {
  const call = async <T>(path: string, method = 'GET', body?: unknown): Promise<T> => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json', 'X-DNA-Client': 'app' };
    const tok = opts.getToken ? await opts.getToken() : null; if (tok) headers.Authorization = `Bearer ${tok}`;
    const r = await fetch(base.replace(/\/$/, '') + '/api/' + path, { method, headers, credentials: 'include', body: body ? JSON.stringify(body) : undefined });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new ApiError((d as { error?: string }).error || 'Something went wrong. Try again.', r.status);
    return d as T;
  };
  return {
    config: () => call<{ demo: boolean; payments: string }>('config'),
    startSignIn: (name: string, contact: string) => call<{ ok: true; devCode?: string }>('auth/start', 'POST', { name, contact }),
    verify: (contact: string, code: string, name?: string) => call<{ user: User; passes: Pass[]; token?: string }>('auth/verify', 'POST', { contact, code, name }),
    signOut: () => call<{ ok: true }>('auth/signout', 'POST'),
    me: () => call<{ user: User | null; passes: Pass[] }>('me'),
    updateMe: (patch: Partial<User>) => call<{ user: User }>('me', 'PATCH', patch),
    deleteMe: () => call<{ ok: true }>('me', 'DELETE'),
    passes: () => call<{ passes: Pass[] }>('passes'),
    updatePass: (code: string, patch: Partial<Pass>) => call<{ pass: Pass }>('passes/' + encodeURIComponent(code), 'PATCH', patch),
    redeem: (code: string) => call<{ pass: Pass }>('passes/redeem', 'POST', { code }),
    availability: (trail: string, date: string) => call<{ left: number; cap: number }>(`trails/${trail}/availability?date=${date}`),
    checkout: (o: { trail: string; date: string; car: CarClass; people: number; method: string; keepCard?: boolean }) =>
      call<{ pass: Pass; user?: User; redirect?: string }>('checkout', 'POST', o),
  };
}
export type DnaClient = ReturnType<typeof createClient>;
