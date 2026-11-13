// Extracts the trail, host and place data from the web prototype files into
// packages/data/src/*.json, so the website backend and the mobile app share one source.
import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';
const pub = new URL('../apps/web/public/', import.meta.url);
const ctx = { window: {} }; vm.createContext(ctx);
for (const f of ['base.js', 'trails.js']) vm.runInContext(readFileSync(new URL(f, pub), 'utf8'), ctx);
const D = ctx.window.DNA;
const out = new URL('../packages/data/src/', import.meta.url);
const pick = ['REGIONS','TOWNS','MAPCATS','PLACES','CARS','TYPES','APPETITES','HOSTS','TRAILS'];
for (const k of Object.keys(D)) if (!pick.includes(k) && !['MONTHS','MONTHS_FULL','TEAM'].includes(k)) pick.push(k);
const data = Object.fromEntries(pick.filter(k => D[k] !== undefined && typeof D[k] !== 'function').map(k => [k, D[k]]));
writeFileSync(new URL('dna.json', out), JSON.stringify(data, null, 1));
console.log('wrote dna.json with', Object.keys(data).join(', '), '| trails:', (D.TRAILS||[]).length);
