// Storage behind one interface: Postgres when DATABASE_URL is set, memory otherwise.
import postgres from 'postgres';
import { env } from './config';
import type { Otp, Pass, User } from './types';

export interface Store {
  getUser(id: string): Promise<User | null>;
  findUserByContact(contact: string): Promise<User | null>;
  saveUser(u: User): Promise<void>;
  deleteUser(id: string): Promise<void>;
  putOtp(o: Otp): Promise<void>;
  getOtp(contact: string): Promise<Otp | null>;
  dropOtp(contact: string): Promise<void>;
  passesOf(owner: string): Promise<Pass[]>;
  getPass(code: string): Promise<Pass | null>;
  savePass(p: Pass): Promise<void>;
  carsBooked(trail: string, date: string): Promise<number>;
}

class MemoryStore implements Store {
  users = new Map<string, User>(); otps = new Map<string, Otp>(); passes = new Map<string, Pass>();
  async getUser(id: string) { return this.users.get(id) ?? null; }
  async findUserByContact(c: string) { return [...this.users.values()].find(u => u.contact === c) ?? null; }
  async saveUser(u: User) { this.users.set(u.id, u); }
  async deleteUser(id: string) { this.users.delete(id); for (const [k, p] of this.passes) if (p.owner === id) this.passes.delete(k); }
  async putOtp(o: Otp) { this.otps.set(o.contact, o); }
  async getOtp(c: string) { return this.otps.get(c) ?? null; }
  async dropOtp(c: string) { this.otps.delete(c); }
  async passesOf(owner: string) { return [...this.passes.values()].filter(p => p.owner === owner); }
  async getPass(code: string) { return this.passes.get(code) ?? null; }
  async savePass(p: Pass) { this.passes.set(p.code, p); }
  async carsBooked(trail: string, date: string) { return [...this.passes.values()].filter(p => p.trail === trail && p.date === date && p.stage !== 'pending' && !p.refunded).length; }
}

class PgStore implements Store {
  sql = postgres(env.databaseUrl, { max: 3, idle_timeout: 20 });
  ready: Promise<unknown> | null = null;
  init() {
    return (this.ready ??= this.sql`
      create table if not exists users (id text primary key, contact text unique not null, doc jsonb not null);
      create table if not exists otps (contact text primary key, doc jsonb not null);
      create table if not exists passes (code text primary key, owner text not null, trail text, date text, stage text, doc jsonb not null);
      create index if not exists passes_owner on passes(owner);
      create index if not exists passes_trail_date on passes(trail, date);`.simple());
  }
  async q<T>(f: () => Promise<T>) { await this.init(); return f(); }
  getUser(id: string) { return this.q(async () => ((await this.sql`select doc from users where id=${id}`)[0]?.doc as User) ?? null); }
  findUserByContact(c: string) { return this.q(async () => ((await this.sql`select doc from users where contact=${c}`)[0]?.doc as User) ?? null); }
  saveUser(u: User) { return this.q(async () => { await this.sql`insert into users ${this.sql({ id: u.id, contact: u.contact, doc: this.sql.json(u as never) } as never)} on conflict (id) do update set contact=excluded.contact, doc=excluded.doc`; }); }
  deleteUser(id: string) { return this.q(async () => { await this.sql`delete from passes where owner=${id}`; await this.sql`delete from users where id=${id}`; }); }
  putOtp(o: Otp) { return this.q(async () => { await this.sql`insert into otps (contact, doc) values (${o.contact}, ${this.sql.json(o as never)}) on conflict (contact) do update set doc=excluded.doc`; }); }
  getOtp(c: string) { return this.q(async () => ((await this.sql`select doc from otps where contact=${c}`)[0]?.doc as Otp) ?? null); }
  dropOtp(c: string) { return this.q(async () => { await this.sql`delete from otps where contact=${c}`; }); }
  passesOf(owner: string) { return this.q(async () => (await this.sql`select doc from passes where owner=${owner} order by date`).map(r => r.doc as Pass)); }
  getPass(code: string) { return this.q(async () => ((await this.sql`select doc from passes where code=${code}`)[0]?.doc as Pass) ?? null); }
  savePass(p: Pass) { return this.q(async () => { await this.sql`insert into passes (code, owner, trail, date, stage, doc) values (${p.code}, ${p.owner}, ${p.trail}, ${p.date}, ${p.stage}, ${this.sql.json(p as never)}) on conflict (code) do update set owner=excluded.owner, stage=excluded.stage, doc=excluded.doc`; }); }
  carsBooked(trail: string, date: string) { return this.q(async () => Number((await this.sql`select count(*)::int as n from passes where trail=${trail} and date=${date} and stage<>'pending' and coalesce((doc->>'refunded')::boolean,false)=false`)[0].n)); }
}

const g = globalThis as unknown as { __dnaStore?: Store };
export const store: Store = (g.__dnaStore ??= env.databaseUrl ? new PgStore() : new MemoryStore());
