import { TRAILS, HOSTS, TYPES, CARS, trailById, priceOf, stopsOf, type Trail, type Stop } from '@dna/data';
export { TRAILS, HOSTS, TYPES, CARS, trailById, priceOf, stopsOf };
export type { Trail, Stop };
const M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const parse = (s: string) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
export const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const addDays = (s: string, n: number) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
export const dShort = (s: string) => { const d = parse(s); return `${WD[d.getDay()]} ${d.getDate()} ${M[d.getMonth()]}`; };
export const dStamp = (s: string) => { const d = parse(s); return `${d.getDate()} ${M[d.getMonth()].toUpperCase()}`; };
export const today = () => iso(new Date());
export const typeLabel = (t: Trail) => `${TYPES[t.type].label} · ${t.days.length === 1 ? '1 day' : t.days.length + ' days'}`;
export const hostIds = (t: Trail) => [...new Set(stopsOf(t).map(s => s.host).filter(Boolean) as string[])];
export const stageLabel = (stage: string, date: string) =>
  stage === 'booked' ? `Calls go out ${dShort(addDays(date, -1))}` : stage === 'confirmed' ? 'Hosts confirmed' : stage === 'road' ? 'On the road' : stage === 'done' ? 'Finished' : 'Waiting for payment';
