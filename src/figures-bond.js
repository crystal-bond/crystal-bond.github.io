// Diagrams drawn only for the BOND site, in the same style as src/figures.js (copied from the Crystal Lab site).
// Schematic and not to scale.
const f1 = n => Math.round(n * 10) / 10;
const pts = a => a.map(([x, y]) => `${f1(x)},${f1(y)}`).join(' ');
const range = (a, b, n) => Array.from({ length: n + 1 }, (_, k) => a + (b - a) * k / n);
const head = (id, title, desc, h = 320) => `<svg class="fig" viewBox="0 0 560 ${h}" role="img" aria-labelledby="${id}-t ${id}-d">
<title id="${id}-t">${title}</title><desc id="${id}-d">${desc}</desc>
<defs><marker id="${id}-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="tip" d="M0 0L10 5L0 10z"/></marker>
<marker id="${id}-b" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="tip2" d="M0 0L10 5L0 10z"/></marker></defs>`;
const text = (x, y, s, cls = 'lbl', anchor = 'start') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" text-anchor="${anchor}">${s}</text>`;

// Spectral imaging (assembly A2.2). Geometry computed, angles exaggerated:
// a plate bent to a cylinder of radius R, centre of curvature C downstream; in symmetric Laue geometry the diffracting planes
// lie along the radii, so a ray parallel to the axis that meets the plate at a distance d from the axis makes the Bragg angle
// a = asin(d/R) with them and leaves at 2a: all rays cross near the axis at R/2 from the plate (the focus, where the sample is).
// Larger d means a larger Bragg angle, hence a lower energy: past the focus the energies are sorted along the detector.
// The inset magnifies the plate: the planes across its thickness are themselves curved (quasi-mosaic effect).
function spectral() {
  const R = 440, C = [542.7, 120], T = 7, xd = 468;
  const on = (d, r = R) => { const a = Math.asin(d / R); return [C[0] - r * Math.cos(a), C[1] + r * Math.sin(a)]; };
  const out = d => { const a = 2 * Math.asin(d / R); return [Math.cos(a), -Math.sin(a)]; };
  const ray = (d, x) => { const p = on(d), v = out(d); return [x, p[1] + (x - p[0]) * v[1] / v[0]]; };
  const D = [60, 70, 80, 90, 100];
  // focus: where the two outer rays cross
  const [p1, v1, p2, v2] = [on(60), out(60), on(100), out(100)];
  const t = ((p2[0] - p1[0]) * v2[1] - (p2[1] - p1[1]) * v2[0]) / (v1[0] * v2[1] - v1[1] * v2[0]);
  const F = [p1[0] + t * v1[0], p1[1] + t * v1[1]];
  // energy colours: gold for the lowest energy, navy for the highest
  const mix = k => `var(--e${Math.round(k * 4)})`;
  const col = d => mix((100 - d) / 40);
  const plate = [...range(36, 124, 24).map(d => on(d, R + T)), ...range(124, 36, 24).map(d => on(d))];
  // the substrate, in section: on the convex side of the plate, open where the beam comes in
  const jaw = (d0, d1) => `<polygon class="block" points="${pts([...range(d0, d1, 8).map(d => on(d, R + T + 24)), ...range(d1, d0, 8).map(d => on(d, R + T))])}"/>`;
  const hitLo = ray(100, xd), hitHi = ray(60, xd);
  // inset: a piece of the plate, magnified
  const I = [452, 302], r = 70, half = 26;
  const face = (s, y) => I[0] + s * half + y * y / 620;
  const planes = range(-80, 80, 10).map(y => { const xl = face(-1, y), xr = face(1, y - 6); return `<path class="plane" d="M${f1(xl)} ${f1(I[1] + y)} Q${f1((xl + xr) / 2)} ${f1(I[1] + y - 12)} ${f1(xr)} ${f1(I[1] + y - 6)}"/>`; }).join('');
  const slab = [...range(-80, 80, 20).map(y => [face(-1, y), I[1] + y]), ...range(80, -80, 20).map(y => [face(1, y), I[1] + y])];
  return head('fig-spec', 'Spectral imaging with a bent Laue crystal', 'A polychromatic X-ray beam crosses a thin crystal plate bent to a cylinder. Along the plate the Bragg angle changes, so each height diffracts a different energy; all the diffracted rays cross at a focus, where the sample sits, then spread out again and reach an area detector sorted by energy, the lowest at the top. The straight-through beam is stopped. The plate is bonded on a substrate with an opening for the incoming beam. An inset magnifies the plate: the diffracting planes that cross its thickness are themselves curved, the quasi-mosaic effect.', 400) +
    `<defs><linearGradient id="fig-spec-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--e0)"/><stop offset="1" style="stop-color:var(--e4)"/></linearGradient><clipPath id="fig-spec-c"><circle cx="${I[0]}" cy="${I[1]}" r="${r}"/></clipPath></defs>
<polygon class="area ray-area" points="${pts([[20, 180], on(60, R + T), on(100, R + T), [20, 220]])}"/>
${D.map(d => `<line class="ray" stroke-width="1.6" x1="20" y1="${f1(on(d, R + T)[1])}" x2="${f1(on(d, R + T)[0])}" y2="${f1(on(d, R + T)[1])}"/>`).join('')}
<line class="ref" x1="${f1(on(80)[0] + 4)}" y1="${f1(on(80)[1])}" x2="236" y2="${f1(on(80)[1])}"/><rect class="det" x="236" y="172" width="8" height="56"/>
<polygon class="area ray2-area" points="${pts([on(60), on(100), F])}"/><polygon class="area ray2-area" points="${pts([F, hitHi, hitLo])}"/>
${D.map(d => `<line x1="${f1(on(d)[0])}" y1="${f1(on(d)[1])}" x2="${xd}" y2="${f1(ray(d, xd)[1])}" stroke="${col(d)}" stroke-width="1.8" stroke-linecap="round"/>`).join('')}
${jaw(36, 55)}${jaw(105, 124)}<polygon class="body xtal-fill" points="${pts(plate)}"/>
<circle class="sample" cx="${f1(F[0])}" cy="${f1(F[1])}" r="7"/>
<rect x="${xd - 5}" y="${f1(hitLo[1] - 3)}" width="5" height="${f1(hitHi[1] - hitLo[1] + 6)}" fill="url(#fig-spec-g)"/><rect class="det" x="${xd}" y="${f1(hitLo[1] - 14)}" width="11" height="${f1(hitHi[1] - hitLo[1] + 28)}"/>
${text(20, 128, 'polychromatic', 'note')}${text(20, 146, 'X-ray beam', 'note')}${text(20, 272, 'bent Laue crystal', 'lbl')}${text(20, 292, 'on a substrate with an opening', 'note')}
${text(252, 205, 'beam stop', 'note')}${text(f1(F[0] + 14), f1(F[1] + 30), 'sample at the focus', 'lbl')}
${text(xd + 5, f1(hitLo[1] - 24), 'area detector', 'lbl', 'middle')}${text(xd + 20, f1(hitLo[1] + 6), 'low E', 'note')}${text(xd + 20, f1(hitHi[1] + 4), 'high E', 'note')}
<line class="dim" x1="${f1(on(124)[0] + 2)}" y1="${f1(on(124)[1] + 2)}" x2="${f1(I[0] - r * 0.93)}" y2="${f1(I[1] - r * 0.37)}"/>
<g clip-path="url(#fig-spec-c)"><rect x="${I[0] - r}" y="${I[1] - r}" width="${2 * r}" height="${2 * r}" fill="var(--surface)"/>
<polygon class="body xtal-fill" points="${pts(slab)}"/>${planes}
<line class="ray" stroke-width="2" x1="${I[0] - r}" y1="${I[1] + 14}" x2="${I[0]}" y2="${I[1] + 14}"/>
<line x1="${I[0]}" y1="${I[1] + 14}" x2="${I[0] + r}" y2="${f1(I[1] + 14 - r * Math.tan(0.366))}" stroke="${mix(0.5)}" stroke-width="2.2" stroke-linecap="round"/>
<line class="ref" x1="${I[0]}" y1="${I[1] + 14}" x2="${I[0] + r}" y2="${I[1] + 14}"/></g>
<circle cx="${I[0]}" cy="${I[1]}" r="${r}" fill="none" stroke="var(--line-2)" stroke-width="1.5"/>
${text(I[0] - r - 12, I[1] + 8, 'quasi-mosaic effect', 'lbl strong', 'end')}${text(I[0] - r - 12, I[1] + 30, 'the diffracting planes', 'note', 'end')}${text(I[0] - r - 12, I[1] + 48, 'are curved too', 'note', 'end')}</svg>`;
}

// Assembly A1, redrawn from the figure of the BOND proposal (CAD views of the Ferrara holder and of the bonded crystal):
// (a) the mechanical holder, a U-shaped base with the crystal plate clamped along its two long edges by two bars with screws;
// (b) the same crystal bonded to a substrate figured to the wanted curvature. Isometric views, the beam runs along z.
// Curvature exaggerated in (b); in (a) it is too small to be seen, as in the original drawing.
function assembly() {
  const c = Math.cos(Math.PI / 6), s = 0.5;
  const proj = (o, k = 1) => (x, y, z) => [o[0] + (z - x) * c * k, o[1] + (z + x) * s * k - y * k];
  const poly = (p, fill, extra = '') => `<polygon points="${pts(p)}" fill="${fill}" stroke="#5f6b7a" stroke-width="0.8" stroke-linejoin="round"${extra}/>`;
  // a box drawn with its three visible faces: top (+y), left (+x), right (+z)
  const box = (P, [x0, x1], [y0, y1], [z0, z1], [top, left, right]) =>
    poly([P(x0, y1, z0), P(x0, y1, z1), P(x1, y1, z1), P(x1, y1, z0)], top) +
    poly([P(x1, y0, z0), P(x1, y0, z1), P(x1, y1, z1), P(x1, y1, z0)], left) +
    poly([P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)], right);
  const metal = ['#e3e7ec', '#b9c1cb', '#cdd3db'], bar = ['#eef1f4', '#c6cdd6', '#d9dee5'], shim = ['#f7f8fa', '#dfe3e8', '#eceff2'];
  const xtal = ['var(--xtal-1)', 'var(--xtal-2)', 'var(--xtal-3)'];
  const beam = (a, b) => `<line class="ray2" stroke-width="1.7" x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}" marker-end="url(#fig-asm-b)"/>`;

  // (a) holder
  const A = proj([110, 138]), L = 170, W = 96, H = 46, w = 28, fl = 20, t = 6;
  const hole = (x, z) => { const [X, Y] = A(x, H + t + 16, z); return `<ellipse cx="${f1(X)}" cy="${f1(Y)}" rx="6.1" ry="3.5" fill="#8b96a4" stroke="#5f6b7a" stroke-width="0.8"/>`; };
  const a = [
    poly([A(w, fl, 0), A(w, fl, L), A(w, H, L), A(w, H, 0)], '#aeb7c2'),                                   // inner face of the far wall
    poly([A(w, fl, 0), A(w, fl, L), A(W - w, fl, L), A(W - w, fl, 0)], '#c3cad3'),                            // floor of the channel
    poly([A(0, H, 0), A(0, H, L), A(w, H, L), A(w, H, 0)], metal[0]),                                       // top of the far wall
    poly([A(W - w, H, 0), A(W - w, H, L), A(W, H, L), A(W, H, 0)], metal[0]),                               // top of the near wall
    poly([A(W, 0, 0), A(W, 0, L), A(W, H, L), A(W, H, 0)], metal[1]),                                       // long side
    poly([A(0, 0, L), A(W, 0, L), A(W, H, L), A(W - w, H, L), A(W - w, fl, L), A(w, fl, L), A(w, H, L), A(0, H, L)], metal[2]), // U-shaped end
    ...[[0, w], [W - w, W]].flatMap(X => [[0, 20], [L - 20, L]].map(Z => box(A, X, [H, H + t], Z, shim))),  // shims under the bar ends
    box(A, [8, W - 8], [H, H + t], [24, L - 24], xtal),                                                      // crystal plate
    box(A, [0, w - 2], [H + t, H + t + 16], [-5, L + 5], bar), hole(13, 8), hole(13, L - 8),                 // far bar and its screws
    box(A, [W - w + 2, W], [H + t, H + t + 16], [-5, L + 5], bar), hole(W - 13, 8), hole(W - 13, L - 8),     // near bar and its screws
    beam(A(48, H + t + 6, -62), A(48, H + t + 6, -8)), beam(A(48, H + t + 6, L + 2), A(48, H + t + 6, L + 72)),
  ].join('');

  // (b) bonded crystal
  const B = proj([338, 150]), W2 = 40, T = 8, sag = 14, h0 = 30;
  const yb = z => h0 + sag * (1 - ((z - L / 2) / (L / 2)) ** 2);
  const zs = range(0, L, 34), rz = zs.slice().reverse();
  const slope = 4 * sag / L, yc = yb(0) + T / 2;
  const b = [
    poly([B(W2, 0, 0), B(W2, 0, L), ...rz.map(z => B(W2, yb(z), z))], '#c4cbd4'),                           // long side of the substrate
    poly([B(0, 0, L), B(W2, 0, L), B(W2, yb(L), L), B(0, yb(L), L)], '#d9dee5'),                             // its end
    poly([...zs.map(z => B(W2, yb(z), z)), ...rz.map(z => B(W2, yb(z) + T, z))], xtal[1]),                   // crystal, long side
    poly([B(0, yb(L), L), B(W2, yb(L), L), B(W2, yb(L) + T, L), B(0, yb(L) + T, L)], xtal[2]),               // crystal, end
    poly([...zs.map(z => B(W2, yb(z) + T, z)), ...rz.map(z => B(0, yb(z) + T, z))], xtal[0]),                // crystal, top
    `<polyline points="${pts([...zs.map(z => B(W2, yb(z), z)), B(0, yb(L), L)])}" fill="none" stroke="var(--gold)" stroke-width="2"/>`, // bond line
    beam(B(W2 / 2, yc - slope * 64, -64), B(W2 / 2, yc - slope * 6, -6)), beam(B(W2 / 2, yc - slope * 4, L + 4), B(W2 / 2, yc - slope * 70, L + 70)),
  ].join('');
  const lead = (p, q) => `<line class="dim" x1="${f1(p[0])}" y1="${f1(p[1])}" x2="${f1(q[0])}" y2="${f1(q[1])}"/>`;
  const pa1 = A(13, H + t + 16, 60), pa2 = A(48, H + t, 110), pb1 = B(W2 / 2, yb(60) + T, 60), pb2 = B(W2, 12, 120);
  return head('fig-asm', 'A crystal bent by a mechanical holder, and the same crystal bonded to a figured substrate',
    'Two isometric views. Left: the mechanical holder, a U-shaped metal base with the crystal plate laid across it and clamped along its two long edges by two bars held by screws; the beam runs along the channel, through the crystal. Right: the BOND assembly, the same crystal bonded on a narrow substrate whose top is figured to the wanted curvature, with nothing else around it; the beam enters one end of the crystal and leaves the other, deflected.', 330) +
    `${text(24, 34, 'Mechanical holder', 'lbl strong')}${text(300, 34, 'Bonded crystal (BOND)', 'lbl strong')}
${a}${b}
${lead([pa1[0], pa1[1] - 2], [pa1[0] + 16, 70])}${text(pa1[0] + 20, 68, 'clamping bars', 'note')}
${lead([pa2[0], pa2[1]], [pa2[0] + 46, pa2[1] - 34])}${text(pa2[0] + 50, pa2[1] - 34, 'crystal', 'note')}
${text(A(48, H + t + 6, -62)[0] + 14, A(48, H + t + 6, -62)[1] - 6, 'beam', 'note')}
${lead([pb1[0], pb1[1] - 2], [pb1[0] + 12, pb1[1] - 30])}${text(pb1[0] + 16, pb1[1] - 32, 'crystal', 'note')}
${lead(pb2, [pb2[0] - 16, pb2[1] + 34])}${text(pb2[0] - 20, pb2[1] + 50, 'figured substrate', 'note', 'middle')}
${text(140, 300, 'curvature set by the clamps', 'note', 'middle')}${text(140, 320, 'heavy holder', 'note', 'middle')}
${text(420, 300, 'curvature set by the substrate', 'note', 'middle')}${text(420, 320, 'no holder, compact and light', 'note', 'middle')}</svg>`;
}

// Anodic bonding of a crystal to a figured glass substrate (BOND version of the lab diagram), after the scheme of the proposal:
// with the crystal positive, Na⁺ drifts to the cathode and leaves a depletion layer under the interface; there the oxygen
// anions reach the silicon and oxidise it, Si + 2O²⁻ → SiO₂ + 4e⁻.
function bonding() {
  const base = 282;
  const arcTop = (cx, half, top, edge) => range(-half, half, 40).map(dx => [cx + dx, top + (edge - top) * (dx / half) ** 2]);
  const sub = cx => `<polygon class="block" points="${pts([[cx - 100, base], ...arcTop(cx, 100, 186, 204), [cx + 100, base]])}"/>`;
  const surf = x => 186 + 18 * ((x - 400) / 100) ** 2;
  const bonded = arcTop(400, 100, 178, 198.7);
  const dep = range(-100, 100, 40).map(dx => [400 + dx, surf(400 + dx) + 26]);
  const ions = [330, 410].map(x => `<line class="ray2" x1="${x}" y1="${f1(surf(x) + 34)}" x2="${x}" y2="${f1(surf(x) + 62)}" marker-end="url(#fig-bond-b)"/>${text(x + 7, surf(x) + 54, 'Na⁺', 'note')}`).join('') +
    [370, 450].map(x => `<line class="ray" x1="${x}" y1="${f1(surf(x) + 23)}" x2="${x}" y2="${f1(surf(x) + 7)}" marker-end="url(#fig-bond-a)"/>${text(x + 7, surf(x) + 20, 'O²⁻', 'note')}`).join('');
  return head('fig-bond', 'Anodic bonding of a crystal to a figured substrate',
    'Left: a flat crystal plate above a glass substrate whose surface has been figured to the wanted curvature. Right: heated and under a voltage, with the crystal positive, sodium ions in the glass drift towards the cathode and leave a depletion layer under the interface; oxygen ions in that layer drift to the silicon and oxidise it, and the crystal, now bonded, keeps the shape of the substrate.', 350) +
    `${text(30, 34, '1  crystal and substrate', 'lbl strong')}${text(310, 34, '2  bonded, with its shape', 'lbl strong')}
<rect class="block xtal" x="40" y="140" width="200" height="9"/>${sub(140)}
${text(140, 128, 'crystal plate', 'lbl', 'middle')}${text(140, 308, 'glass figured to shape', 'note', 'middle')}
<line class="ray" x1="250" y1="190" x2="286" y2="190" marker-end="url(#fig-bond-a)"/>${text(270, 176, 'heat', 'note', 'middle')}${text(270, 214, 'voltage', 'note', 'middle')}
${sub(400)}<polyline class="xtal-line" points="${pts(bonded.map(([x, y]) => [x, y - 4.5]))}"/>
<polyline class="ref" points="${pts(dep)}"/>
${text(400, 152, '+  crystal (anode)', 'lbl', 'middle')}${text(400, 308, '−  cathode', 'lbl', 'middle')}${ions}
<line class="ref" x1="338" y1="327" x2="366" y2="327"/>${text(374, 332, 'depletion layer', 'note')}
${text(548, 72, 'Si + 2O²⁻ → SiO₂ + 4e⁻', 'note', 'end')}${text(548, 94, 'at the interface, no glue layer', 'note', 'end')}</svg>`;
}

// Bent crystal analyser (assembly A2.1), after the scheme of the proposal: monochromator, focusing optics, sample,
// analyser and detector. Sample, analyser and detector sit on the Rowland circle of radius r; the crystal, bonded on a
// spherical substrate, is bent to 2r (Johann geometry). Drawn close to backscattering, Bragg angle 80°.
function analyzer() {
  const O = [392, 172], r = 112, R = 2 * r, Cc = [O[0] + r - R, O[1]], rad = Math.PI / 180;
  const on = deg => [O[0] + r * Math.cos(deg * rad), O[1] + r * Math.sin(deg * rad)];
  const S = on(160), D = on(200);
  const onX = (q, a) => [Cc[0] + q * Math.cos(a), Cc[1] + q * Math.sin(a)];
  const A = 0.25, T = 5;
  const crystal = [...range(-A, A, 30).map(a => onX(R - T, a)), ...range(A, -A, 30).map(a => onX(R, a))];
  const substrate = [...range(-A, A, 30).map(a => onX(R, a)), [O[0] + r + 28, onX(R, A)[1]], [O[0] + r + 28, onX(R, -A)[1]]];
  const cuts = range(-A, A, 12).slice(1, -1).map(a => `<line x1="${f1(onX(R - T, a)[0])}" y1="${f1(onX(R - T, a)[1])}" x2="${f1(onX(R, a)[0])}" y2="${f1(onX(R, a)[1])}" stroke="var(--fig-1)" stroke-width="0.6"/>`).join('');
  const hits = [-0.2, 0, 0.2].map(a => onX(R - T, a));
  const m1 = [78, 246], m2 = [100, S[1]], tilt = Math.atan2(m2[1] - m1[1], m2[0] - m1[0]) / 2 / rad;
  const mono = ([x, y], sgn) => { const n = (tilt + 90) * rad, cx = x + sgn * 5 * Math.cos(n), cy = y + sgn * 5 * Math.sin(n); return `<rect class="block xtal" x="${f1(cx - 23)}" y="${f1(cy - 4.5)}" width="46" height="9" transform="rotate(${f1(tilt)} ${f1(cx)} ${f1(cy)})"/>`; };
  const dAng = Math.atan2(hits[1][1] - D[1], hits[1][0] - D[0]) / rad;
  return head('fig-ana', 'A bent crystal analyser in a spectrometer',
    'X-rays pass a two-crystal monochromator and a focusing optic and reach the sample. The radiation scattered by the sample spreads towards a crystal bonded on a concave spherical substrate, which reflects one energy, selected by its Bragg angle, and focuses it on a detector next to the sample. Sample, crystal and detector lie on the Rowland circle, whose radius is half the bending radius of the crystal.', 350) +
    `<circle class="ref" cx="${O[0]}" cy="${O[1]}" r="${r}"/>
<polyline class="ray" stroke-width="1.8" points="${pts([[20, m1[1]], m1, m2, [190, S[1]]])}"/>
<polygon class="area ray-area" points="${pts([[190, S[1] - 7], S, [190, S[1] + 7]])}"/><line class="ray" stroke-width="1.2" x1="190" y1="${f1(S[1] - 7)}" x2="${f1(S[0])}" y2="${f1(S[1])}"/><line class="ray" stroke-width="1.2" x1="190" y1="${f1(S[1] + 7)}" x2="${f1(S[0])}" y2="${f1(S[1])}"/>
${mono(m1, 1)}${mono(m2, -1)}<ellipse class="block" cx="190" cy="${f1(S[1])}" rx="6" ry="22"/>
<polygon class="area ray-area" points="${pts([S, hits[0], hits[2]])}"/><polygon class="area ray2-area" points="${pts([D, hits[0], hits[2]])}"/>
${hits.map(h => `<line class="ray" stroke-width="1.4" x1="${f1(S[0])}" y1="${f1(S[1])}" x2="${f1(h[0])}" y2="${f1(h[1])}"/><line class="ray2" stroke-width="1.4" x1="${f1(h[0])}" y1="${f1(h[1])}" x2="${f1(D[0])}" y2="${f1(D[1])}"/>`).join('')}
<polygon class="block" points="${pts(substrate)}"/><polygon class="body xtal-fill" points="${pts(crystal)}"/>${cuts}
<circle class="sample" cx="${f1(S[0])}" cy="${f1(S[1])}" r="7"/>
<rect class="det" x="${f1(D[0] - 12)}" y="${f1(D[1] - 15)}" width="10" height="30" transform="rotate(${f1(dAng)} ${f1(D[0])} ${f1(D[1])})"/>
${text(20, m1[1] - 10, 'X-rays', 'note')}${text(24, 292, 'monochromator', 'note')}${text(190, S[1] - 32, 'focusing optics', 'note', 'middle')}
${text(S[0], S[1] + 28, 'sample', 'lbl', 'middle')}${text(D[0] - 6, D[1] - 26, 'detector', 'lbl', 'middle')}
${text(O[0], O[1] - r - 10, 'Rowland circle, radius r', 'note', 'middle')}
${text(548, 316, 'bent crystal analyser', 'lbl strong', 'end')}${text(548, 338, 'crystal bonded on a spherical substrate, radius 2r', 'note', 'end')}</svg>`;
}

// Building block of a Laue lens (assembly A3): bent tiles bonded side by side on one substrate. γ rays cross the tiles
// (Laue geometry) and each tile diffracts them towards the focus. The substrate is drawn with the profile that sends every
// ray exactly to the focus: the planes of a tile at a distance d from the axis are tilted by half of atan(d/f), and the
// surface is perpendicular to them; near the axis this is a circle of radius 2f.
function laue() {
  const ax = 70, x0 = 112, f = 338, F = [x0 + f, ax];
  const tilt = d => Math.atan(d / f) / 2;
  const xs = d => { let x = 0; const n = 60; for (let k = 0; k < n; k++) x += Math.tan(tilt(d * (k + 0.5) / n)) * d / n; return x0 + x; };
  const strip = (d0, d1, a, b) => [...range(d0, d1, 8).map(d => [xs(d) + a, ax + d]), ...range(d1, d0, 8).map(d => [xs(d) + b, ax + d])];
  const tiles = range(0, 9, 9).map(k => 51 + 14 * k);
  return head('fig-laue', 'A building block of a Laue lens',
    'Parallel γ rays from a distant source cross a row of about ten bent crystal tiles bonded side by side on one substrate, whose surface is figured to a curve. Each tile diffracts the rays that cross it by twice its Bragg angle; because the tiles follow the shape of the substrate, all the diffracted rays meet at the focus on the lens axis, where a detector sits.', 330) +
    `<line class="ref" x1="20" y1="${ax}" x2="545" y2="${ax}"/>
${tiles.map(d => `<line class="ray" stroke-width="1.3" x1="20" y1="${ax + d + 6.3}" x2="${f1(xs(d + 6.3) - 7)}" y2="${ax + d + 6.3}"/><line class="ray2" stroke-width="1.3" x1="${f1(xs(d + 6.3))}" y1="${ax + d + 6.3}" x2="${F[0]}" y2="${F[1]}"/>`).join('')}
<polygon class="block" points="${pts(strip(44, 198, 0, 13))}"/>
${tiles.map(d => `<polygon class="body xtal-fill" points="${pts(strip(d, d + 12.6, -7, 0))}"/>`).join('')}
<rect class="det" x="${F[0]}" y="${ax - 16}" width="12" height="32"/>
${text(20, ax - 10, 'lens axis', 'note')}${text(20, ax + 40, 'γ rays', 'lbl blue')}${text(F[0] + 6, ax - 26, 'focus', 'lbl', 'middle')}${text(F[0] + 6, ax + 38, 'detector', 'lbl', 'middle')}
${text(xs(198) + 26, ax + 196, 'bent tiles bonded on one substrate', 'lbl')}${text(xs(198) + 26, ax + 218, 'figured to R = 20 m, aligned within 50 µrad', 'note')}
${text(548, 22, 'not to scale', 'note', 'end')}</svg>`;
}

// The bonder, after the scheme of the proposal: in a chamber, a press pushes the stack ceramic / silicon / glass between
// two heaters; the pedestal below carries the force sensor and the high-voltage electrode that reaches the glass.
// Leads on the right: heater power, thermocouples in the glass, force sensor, high voltage (to the silicon and to the electrode).
function bonder() {
  const cx = 170, m = 'stroke="#5f6b7a" stroke-width="0.9"';
  const zig = s => range(0, 8, 8).map(k => [cx + s * (k % 2 ? 12 : 20), 80 + k * 5.5]);
  const layer = (y, h, fill, label) => `<rect x="100" y="${y}" width="140" height="${h}" fill="${fill}" ${m}/>${text(cx, y + h / 2 + 5, label, 'note', 'middle')}`;
  const wire = (d, stroke, w = 1.6, dash = '') => `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
  const dot = (x, y, fill) => `<circle cx="${x}" cy="${y}" r="3" fill="${fill}"/>`;
  const navy = 'var(--navy)', gold = 'var(--gold)', grey = '#6b7686';
  return head('fig-bonder', 'Scheme of a bonder for anodic bonding',
    'Inside a chamber, a press with a bellows pushes down on a stack made of a ceramic plate, the silicon crystal and the glass substrate, held between an upper and a lower heater. Under the stack a pedestal carries a force sensor and a high-voltage electrode that reaches the glass. Leads leave the chamber for the heater power supply, the thermocouples in the glass, the force sensor and the high voltage, which is applied between the silicon and the glass.', 350) +
    `<path d="M152 70 H40 V330 H300 V70 H188" fill="none" stroke="var(--ink)" stroke-width="7" stroke-linejoin="miter"/>
<rect x="146" y="12" width="48" height="42" fill="var(--xtal-3)" ${m}/><rect x="164" y="54" width="12" height="76" fill="var(--xtal-3)" ${m}/>
<rect x="146" y="76" width="48" height="5" fill="#fff" ${m}/><rect x="146" y="123" width="48" height="5" fill="#fff" ${m}/>
<polyline points="${pts(zig(-1))}" fill="none" ${m}/><polyline points="${pts(zig(1))}" fill="none" ${m}/>
<rect x="148" y="128" width="44" height="8" fill="var(--ink)"/>
<rect x="92" y="136" width="156" height="6" fill="${navy}"/><rect x="92" y="220" width="156" height="6" fill="${navy}"/>
${layer(142, 26, '#f3f4f6', 'ceramic')}${layer(168, 26, 'var(--si)', 'silicon')}${layer(194, 26, '#ffffff', 'glass')}
<rect x="116" y="226" width="108" height="80" fill="#dde2e8" ${m}/><rect x="116" y="306" width="108" height="16" fill="#8d99a8" ${m}/>
<rect x="132" y="236" width="76" height="8" fill="#f1f3f5" ${m}/><rect x="154" y="244" width="32" height="52" fill="#f1f3f5" ${m}/>
<rect x="140" y="296" width="60" height="10" fill="#c9a45c" ${m}/>
<rect x="166" y="218" width="8" height="100" fill="${gold}" stroke="#7a5d1a" stroke-width="0.8"/>
${wire('M248 139 C292 139 292 112 334 112 L392 112', grey)}
${wire('M214 204 C270 204 286 168 340 168 L392 168', navy, 1.4)}${wire('M226 212 C282 212 296 176 344 176 L392 176', navy, 1.4)}${dot(214, 204, navy)}${dot(226, 212, navy)}
${wire('M200 301 C254 301 254 240 320 240 L392 240', grey, 1.6, '5 4')}
${wire('M232 181 C272 181 262 296 334 296 L392 296', gold, 2)}${wire('M174 314 C236 314 250 304 334 304 L392 304', gold, 2)}${dot(232, 181, gold)}
<line class="dim" x1="98" y1="34" x2="144" y2="34"/>${text(92, 39, 'press', 'note', 'end')}
<line class="dim" x1="78" y1="174" x2="92" y2="141"/><line class="dim" x1="78" y1="192" x2="92" y2="222"/>${text(46, 188, 'heaters', 'note')}
${text(48, 96, 'chamber', 'note')}
${text(398, 117, 'heater power', 'note')}${text(398, 177, 'thermocouples', 'note')}${text(398, 245, 'force sensor', 'note')}${text(398, 305, 'high voltage', 'note')}</svg>`;
}

// Thermo-compression bonding, after the scheme in the proposal's figures: crystal and substrate each carry a thin metal film;
// pressed together hot between the pressure plate and the heating stage of the bonder, the two films become one joint.
function thermo() {
  const m = 'stroke="#5f6b7a" stroke-width="0.9"', gold = 'var(--gold)';
  const slab = (x, y, w, h, fill, label) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${m}/>${label ? text(x + w / 2, y + h / 2 + 5, label, 'note', 'middle') : ''}`;
  return head('fig-thermo', 'Thermo-compression bonding',
    'Left: a crystal and a substrate, each coated with a thin metal film, face each other between the pressure plate and the heating stage of the bonder, which presses them together while hot. Right: after bonding the two films have merged into a single metal joint between crystal and substrate.', 330) +
    `${text(30, 34, '1  films face to face', 'lbl strong')}${text(350, 34, '2  one joint', 'lbl strong')}
<line class="ray" x1="150" y1="58" x2="150" y2="88" marker-end="url(#fig-thermo-a)"/>${text(162, 76, 'pressure and heat', 'note')}
${slab(60, 96, 180, 22, '#d6dce4', 'pressure plate')}
${slab(70, 124, 160, 26, 'var(--si)', 'crystal')}<rect x="70" y="150" width="160" height="5" fill="${gold}"/>
<rect x="70" y="165" width="160" height="5" fill="${gold}"/>${slab(70, 170, 160, 40, '#eef0f3', 'substrate')}
${slab(60, 216, 180, 22, '#d6dce4', 'heating stage')}
<line class="dim" x1="232" y1="160" x2="246" y2="160"/>${text(250, 156, 'metal', 'note')}${text(250, 174, 'films', 'note')}
<line class="ray" x1="296" y1="200" x2="334" y2="200" marker-end="url(#fig-thermo-a)"/>
${slab(350, 134, 160, 26, 'var(--si)', 'crystal')}<rect x="350" y="160" width="160" height="8" fill="${gold}"/>${slab(350, 168, 160, 40, '#eef0f3', 'substrate')}
<polyline class="dim" fill="none" points="512,164 526,164 526,226"/>${text(540, 244, 'one metal joint', 'note', 'end')}
${text(280, 296, 'for example a gold–germanium eutectic, for germanium crystals', 'note', 'middle')}</svg>`;
}

module.exports = { spectral, assembly, bonding, analyzer, laue, bonder, thermo };
