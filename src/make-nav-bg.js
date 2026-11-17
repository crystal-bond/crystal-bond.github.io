// Header picture of the BOND site, in the manner of the OTELLO poster head: computed, dark, no dependencies.
// A bent crystal seen from the side: its atoms on planes that follow the curvature, and three channeled particles that
// oscillate between two planes and follow them (planar channeling), each drawn as a bright head with its track behind.
// node src/make-nav-bg.js  ->  img/nav-bg.png (then ffmpeg to JPEG, see the end of the file)
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const W = 3840, H = 136;                      // 1920 x 68 CSS px at 2x
const D = 19, A = 19, SAG = 46, Y00 = -40;    // plane spacing, atom spacing along the plane, sag over the half width, first plane
const BG = [11, 11, 13];
const sag = x => SAG * ((x - W / 2) / (W / 2)) ** 2;
const planeY = (k, x) => Y00 + k * D + sag(x);
// channeled particles: channel index (between plane k and k+1), head position, phase; wavelength and amplitude in px
const TRACKS = [{ k: 4, head: 0.50 * W, ph: 0.4 }, { k: 6, head: 0.74 * W, ph: 2.1 }, { k: 3, head: 0.93 * W, ph: 4.0 }];
const LAMBDA = 168, AMP = 0.30 * D, TAIL = 0.42 * W;
const trackY = (t, x) => planeY(t.k, x) + D / 2 + AMP * Math.sin(2 * Math.PI * x / LAMBDA + t.ph);

function pixel(x, y) {
  const c = [BG[0], BG[1], BG[2]];
  // atoms: nearest sites on the three nearest planes; rows shifted by half a spacing on alternate planes
  const kf = (y - sag(x) - Y00) / D, k0 = Math.round(kf);
  let atom = 0;
  for (let k = k0 - 1; k <= k0 + 1; k++) {
    const off = (k & 1) ? 0.5 : 0, j = Math.round(x / A - off);
    for (let jj = j - 1; jj <= j + 1; jj++) {
      const xa = (jj + off) * A, ya = planeY(k, xa), r2 = (x - xa) ** 2 + (y - ya) ** 2;
      atom += Math.exp(-r2 / (2 * 2.1 ** 2)) + 0.16 * Math.exp(-r2 / (2 * 5.5 ** 2));
    }
  }
  // dimmer towards the left, where the name of the project is written
  const fade = 0.28 + 0.72 * Math.min(1, Math.max(0, (x / W - 0.16) / 0.5));
  const a = Math.min(1, atom) * 0.62 * fade;
  c[0] += 150 * a; c[1] += 156 * a; c[2] += 168 * a;
  // particles
  for (const t of TRACKS) {
    if (x > t.head + 40) continue;
    const dy = y - trackY(t, x), dx = t.head - x;
    const along = dx >= 0 ? Math.exp(-dx / TAIL) : Math.exp(-(dx * dx) / (2 * 5 ** 2));
    const core = Math.exp(-(dy * dy) / (2 * 1.5 ** 2)), halo = Math.exp(-(dy * dy) / (2 * 6.5 ** 2));
    const headGlow = Math.exp(-((dx * dx) + (y - trackY(t, t.head)) ** 2) / (2 * 9 ** 2));
    const i = along * (0.95 * core + 0.30 * halo) + 0.9 * headGlow;
    c[0] += 236 * i; c[1] += 34 * i + 150 * Math.max(0, i - 0.75); c[2] += 48 * i + 130 * Math.max(0, i - 0.75);
  }
  return c.map(v => Math.max(0, Math.min(255, v)));
}

const SS = 2, raw = Buffer.alloc(H * (W * 3 + 1));
for (let py = 0; py < H; py++) {
  raw[py * (W * 3 + 1)] = 0;
  for (let px = 0; px < W; px++) {
    const acc = [0, 0, 0];
    for (let a = 0; a < SS; a++) for (let b = 0; b < SS; b++) { const c = pixel(px + (a + 0.5) / SS, py + (b + 0.5) / SS); acc[0] += c[0]; acc[1] += c[1]; acc[2] += c[2]; }
    raw.set(acc.map(v => Math.round(v / (SS * SS))), py * (W * 3 + 1) + 1 + px * 3);
  }
}
const crcT = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc = buf => { let c = 0xffffffff; for (const v of buf) c = crcT[(c ^ v) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
const chunk = (type, data) => { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([len, td, c]); };
const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4); ihdr[8] = 8; ihdr[9] = 2;
const png = Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
fs.writeFileSync(path.join(__dirname, '..', 'img', 'nav-bg.png'), png);
console.log('img/nav-bg.png', W, 'x', H);
// then: ffmpeg -y -i img/nav-bg.png -q:v 2 img/nav-bg.jpg
