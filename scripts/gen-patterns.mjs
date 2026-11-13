import { contours } from 'd3-contour';
import { writeFileSync } from 'node:fs';
const T = 120; // grid cells per tile
function field(seed, terms) {
  let s = seed; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const W = []; for (let i = 0; i < terms; i++) { const kx = Math.floor(rnd() * 4) + 1 - (rnd() < .5 ? 0 : 0), ky = Math.floor(rnd() * 4) - 1; W.push([kx * (rnd() < .5 ? 1 : -1), ky, rnd() * 6.28, 1 / Math.hypot(kx, ky || 1)]); }
  const v = new Float64Array((T + 1) * (T + 1));
  for (let y = 0; y <= T; y++) for (let x = 0; x <= T; x++) { let a = 0; for (const [kx, ky, p, w] of W) a += w * Math.sin(2 * Math.PI * (kx * x + ky * y) / T + p); v[y * (T + 1) + x] = a; }
  return v;
}
function paths(v, n) {
  let min = Infinity, max = -Infinity; for (const a of v) { if (a < min) min = a; if (a > max) max = a; }
  const th = Array.from({ length: n }, (_, i) => min + (max - min) * (i + .5) / n);
  return contours().size([T + 1, T + 1]).smooth(true).thresholds(th)(Array.from(v)).map((c, i) => ({ i, d: c.coordinates.map(poly => poly.map(ring => { const edge = ([x, y]) => x < .01 || y < .01 || x > T - .01 || y > T - .01; let d = '', pen = false; for (const pt of ring) { if (edge(pt)) { pen = false; continue; } d += (pen ? 'L' : 'M') + Math.round(pt[0] * 5) + ',' + Math.round(pt[1] * 5); pen = true; } return d; }).join('')).join('') }));
}
const S = T * 5; // 600px tile
// mint: classic topo contours, every 5th an index line
const m = paths(field(7, 7), 22);
const mint = `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}"><g fill="none" stroke="#1C562B" stroke-linejoin="round">${m.map(c => `<path d="${c.d}" stroke-opacity="${c.i % 5 === 2 ? .16 : .085}" stroke-width="${c.i % 5 === 2 ? 1.4 : .9}"/>`).join('')}</g></svg>`;
// peach: survey sheet: graticule + dashed contours + spot heights
const p = paths(field(31, 5), 9);
let grid = ''; for (let k = 0; k <= S; k += 100) grid += `M${k},0V${S}M0,${k}H${S}`;
let marks = ''; let s2 = 99; const r = () => (s2 = (s2 * 48271) % 2147483647) / 2147483647;
for (let i = 0; i < 7; i++) { const x = (r() * S).toFixed(0), y = (r() * S).toFixed(0); marks += `<path d="M${x},${+y - 5}l4.5,8h-9z"/>`; }
const peach = `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}"><path d="${grid}" stroke="#B3602A" stroke-opacity=".07" stroke-width="1" fill="none"/><g fill="none" stroke="#B3602A" stroke-opacity=".13" stroke-width="1" stroke-dasharray="5 4">${p.map(c => `<path d="${c.d}"/>`).join('')}</g><g fill="#B3602A" fill-opacity=".16">${marks}</g></svg>`;
writeFileSync('topo-mint.svg', mint); writeFileSync('topo-peach.svg', peach);
console.log(mint.length, peach.length);
