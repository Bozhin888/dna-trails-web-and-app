// Shared trail, host and place data. Generated JSON comes from `pnpm data`
// (scripts/build-data.mjs). Hosts, call notes and road notes are SAMPLE content
// until a team member has driven each trail.
import raw from './dna.json';

export type CarClass = 'small' | 'regular' | 'suv';
export type TrailType = 'quest' | 'pack' | 'long' | 'composed';

export interface Stop {
  id: string; where: string; lat: number; lon: number; host?: string;
  closed?: number[]; minCar?: CarClass; spend?: number; [k: string]: unknown;
}
export interface TrailDay { t: string; sleep?: string | null; stops: Stop[] }
export interface Trail {
  id: string; type: TrailType; title: string; sub: string; img: string; region: string;
  cap: number; km: number; days: TrailDay[]; [k: string]: unknown;
}
export interface Host { name: string; role: string; where: string; line: string; [k: string]: unknown }

const D = raw as unknown as {
  TRAILS: Trail[]; HOSTS: Record<string, Host>; PLACES: unknown[]; REGIONS: unknown[];
  CARS: Record<CarClass, { label: string; hint: string }>;
  TYPES: Record<TrailType, { label: string; len: string; price: number }>;
  MAPCATS: Record<string, [string, string]>; FAQS?: unknown; [k: string]: unknown;
};

export const TRAILS = D.TRAILS;
export const HOSTS = D.HOSTS;
export const PLACES = D.PLACES;
export const REGIONS = D.REGIONS;
export const CARS = D.CARS;
export const TYPES = D.TYPES;
export const MAPCATS = D.MAPCATS;
export const FAQS = D.FAQS;

export const trailById = (id: string) => TRAILS.find(t => t.id === id);
/** Price in whole euros, once per car. */
export const priceOf = (t: Pick<Trail, 'type'>) => TYPES[t.type].price;
export const stopsOf = (t: Trail) => t.days.flatMap(d => d.stops);
export const hostsOf = (t: Trail) => stopsOf(t).filter(s => s.host).map(s => HOSTS[s.host as string]);
