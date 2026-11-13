export type CarClass = 'small' | 'regular' | 'suv';
export type Stage = 'pending' | 'booked' | 'confirmed' | 'road' | 'done';

export interface User {
  id: string; name: string; contact: string; car: CarClass; people: number;
  lang: 'en' | 'mk'; since: string; card: boolean;
}
export interface Pass {
  code: string; owner: string; trail: string; date: string; car: CarClass; people: number;
  stage: Stage; at: number; got: string[]; bought: string;
  paid: { method: string; eur: number; at: string; ref?: string } | null;
  refunded?: boolean; composed?: unknown;
}
export interface Otp { contact: string; hash: string; expires: number; tries: number }
