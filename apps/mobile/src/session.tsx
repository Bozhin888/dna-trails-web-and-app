// Signed-in state for the app: the user, their passes and the API client.
// The session token is kept in the phone's secure storage.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { createClient, type Pass, type User } from '@dna/api-client';

const TOKEN = 'dna_token';
export const API_URL: string = process.env.EXPO_PUBLIC_API_URL || (Constants.expoConfig?.extra as { apiUrl?: string } | undefined)?.apiUrl || 'http://localhost:3000';
let token: string | null = null;
export const api = createClient(API_URL, { getToken: () => token });

interface Ctx {
  ready: boolean; user: User | null; passes: Pass[];
  signedIn(t: string | undefined, u: User, p: Pass[]): Promise<void>;
  signOut(): Promise<void>; refresh(): Promise<void>;
  setUser(u: User): void; upsertPass(p: Pass): void;
}
const C = createContext<Ctx>(null as never);
export const useSession = () => useContext(C);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [passes, setPasses] = useState<Pass[]>([]);
  const refresh = useCallback(async () => {
    if (!token) return;
    try { const d = await api.me(); setUser(d.user); setPasses(d.passes.filter(p => p.stage !== 'pending')); }
    catch { /* offline: keep what we have */ }
  }, []);
  useEffect(() => { (async () => { token = await SecureStore.getItemAsync(TOKEN).catch(() => null); await refresh(); setReady(true); })(); }, [refresh]);
  const v = useMemo<Ctx>(() => ({
    ready, user, passes, refresh, setUser,
    async signedIn(t, u, p) { if (t) { token = t; await SecureStore.setItemAsync(TOKEN, t).catch(() => {}); } setUser(u); setPasses(p.filter(x => x.stage !== 'pending')); },
    async signOut() { api.signOut().catch(() => {}); token = null; await SecureStore.deleteItemAsync(TOKEN).catch(() => {}); setUser(null); setPasses([]); },
    upsertPass(p) { setPasses(ps => [p, ...ps.filter(x => x.code !== p.code)]); },
  }), [ready, user, passes, refresh]);
  return <C.Provider value={v}>{children}</C.Provider>;
}
