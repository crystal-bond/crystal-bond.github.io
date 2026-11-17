// Physics diagrams for the research-line pages, drawn at build time as inline SVG.
// Schematic and not to scale: angles are exaggerated so the geometry can be seen. Colours come from site.css (.fig …).
const f1 = n => Math.round(n * 10) / 10;
const pts = a => a.map(([x, y]) => `${f1(x)},${f1(y)}`).join(' ');
const range = (a, b, n) => Array.from({ length: n + 1 }, (_, k) => a + (b - a) * k / n);
const head = (id, title, desc, h = 320) => `<svg class="fig" viewBox="0 0 560 ${h}" role="img" aria-labelledby="${id}-t ${id}-d">
<title id="${id}-t">${title}</title><desc id="${id}-d">${desc}</desc>
<defs><marker id="${id}-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="tip" d="M0 0L10 5L0 10z"/></marker>
<marker id="${id}-b" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="tip2" d="M0 0L10 5L0 10z"/></marker></defs>`;
const text = (x, y, s, cls = 'lbl', anchor = 'start') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" text-anchor="${anchor}">${s}</text>`;
const arc = (cx, cy, r, a0, a1, n = 24) => range(a0, a1, n).map(a => [cx + r * Math.cos(a), cy + r * Math.sin(a)]);

// Beam steering: planar channeling and volume reflection in a bent crystal
function steering() {
  const C = [150, -380], phiMax = 0.42;
  const onArc = (r, p) => [C[0] + r * Math.sin(p), C[1] + r * Math.cos(p)];
  const planes = [520, 536, 552, 568, 584].map(r => `<polyline class="plane" points="${pts(range(0, phiMax, 40).map(p => onArc(r, p)))}"/>`).join('');
  const body = [...range(0, phiMax, 40).map(p => onArc(510, p)), ...range(phiMax, 0, 40).map(p => onArc(594, p))];
  // channeled particle: oscillates between two planes and leaves along the last tangent
  const ch = range(0, phiMax, 160).map(p => onArc(544 + 5 * Math.sin(2 * Math.PI * 3 * p / phiMax), p));
  const exit = onArc(544, phiMax), dir = [Math.cos(phiMax), -Math.sin(phiMax)];
  const chEnd = [exit[0] + 165 * dir[0], exit[1] + 165 * dir[1]];
  // volume reflection: tangent to a plane inside the crystal, kicked to the side opposite to the bend
  const T = onArc(568, 0.21), din = [Math.cos(0.21), -Math.sin(0.21)], dout = [Math.cos(0.12), -Math.sin(0.12)];
  const tin = (T[0] - 20) / din[0], vrStart = [20, T[1] + 0.2085 * tin];
  const tout = (540 - T[0]) / dout[0], vrEnd = [540, T[1] + dout[1] * tout];
  const thetaArc = arc(exit[0], exit[1], 55, 0, -phiMax);
  return head('fig-steer', 'Planar channeling and volume reflection in a bent crystal',
    'A bent crystal is drawn as curved atomic planes. One particle enters parallel to the planes, oscillates between two of them and leaves deflected by the bending angle. A second particle enters at a larger angle, meets a plane tangentially inside the crystal and is reflected to the opposite side by a small angle.') +
    `<polygon class="body" points="${pts(body)}"/>${planes}
<polyline class="ray" points="${pts([[20, 164], ...ch])}"/>
<line class="ray" x1="${f1(exit[0])}" y1="${f1(exit[1])}" x2="${f1(chEnd[0])}" y2="${f1(chEnd[1])}" marker-end="url(#fig-steer-a)"/>
<polyline class="ray2" points="${pts([vrStart, T, vrEnd])}" marker-end="url(#fig-steer-b)"/>
<line class="ref" x1="${f1(exit[0])}" y1="${f1(exit[1])}" x2="${f1(exit[0] + 110)}" y2="${f1(exit[1])}"/>
<polyline class="ref" points="${pts(thetaArc)}"/>
${text(exit[0] + 62, exit[1] - 10, 'θ', 'lbl strong')}
${text(24, 154, 'beam')}
${text(548, 26, 'channeling: deflected by θ = L/R', 'lbl blue', 'end')}
${text(548, vrEnd[1] + 26, 'volume reflection', 'lbl orange', 'end')}
${text(150, 246, 'bent crystal: atomic planes,')}
${text(150, 274, 'length L, bending radius R')}
${text(548, 312, 'not to scale', 'note', 'end')}</svg>`;
}

// Positron source: conventional, hybrid and single oriented crystal targets
function positrons() {
  const rows = [55, 162, 269];
  const dots = (x0, x1, y0, y1, seed) => { // amorphous: scattered atoms, fixed pseudo-random pattern
    let s = seed, out = '';
    const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    for (let k = 0; k < Math.round((x1 - x0) * (y1 - y0) / 70); k++) out += `<circle class="atom" cx="${f1(x0 + 3 + rnd() * (x1 - x0 - 6))}" cy="${f1(y0 + 3 + rnd() * (y1 - y0 - 6))}" r="1.7"/>`;
    return out;
  };
  const lattice = (x0, x1, y0, y1) => { let out = ''; for (let x = x0 + 5; x < x1; x += 10) for (let y = y0 + 5; y < y1; y += 10) out += `<circle class="atom" cx="${x}" cy="${y}" r="1.9"/>`; return out; };
  const fan = (x0, y, len, cls, mk) => [-24, 0, 24].map(dy => `<line class="${cls}" x1="${x0}" y1="${y}" x2="${x0 + len}" y2="${y + dy}" marker-end="url(#${mk})"/>`).join('');
  const wave = (x0, x1, y) => `<polyline class="photon" points="${pts(range(x0, x1, 60).map(x => [x, y + 5 * Math.sin((x - x0) / 5)]))}"/>`;
  const beam = y => `<line class="ray" x1="20" y1="${y}" x2="112" y2="${y}" marker-end="url(#fig-pos-a)"/>${text(22, y - 7, 'e⁻', 'lbl blue')}`;
  const [a, b, c] = rows;
  return head('fig-pos', 'Three ways to make positrons from an electron beam',
    'Top: electrons hit a thick amorphous tungsten target and produce positrons, with a lot of heat. Middle, hybrid scheme: a thin oriented tungsten crystal radiates photons, and an amorphous target downstream converts them into positrons. Bottom: a single thick oriented crystal both radiates and converts.', 330) +
    `${text(20, a - 32, 'Conventional', 'lbl strong')}${beam(a)}
<rect class="block" x="120" y="${a - 24}" width="80" height="48"/>${dots(120, 200, a - 24, a + 24, 7)}
${fan(204, a, 84, 'ray2', 'fig-pos-b')}${text(296, a + 6, 'e⁺', 'lbl orange')}
${text(120, a + 46, 'Thick amorphous target: heat limits the beam power', 'note')}
${text(20, b - 32, 'Hybrid', 'lbl strong')}${beam(b)}
<rect class="block xtal" x="120" y="${b - 24}" width="22" height="48"/>${lattice(120, 142, b - 24, b + 24)}
${wave(146, 246, b - 9)}${wave(146, 246, b + 9)}${text(190, b - 21, 'γ', 'lbl', 'middle')}
<rect class="block" x="252" y="${b - 24}" width="44" height="48"/>${dots(252, 296, b - 24, b + 24, 11)}
${fan(300, b, 70, 'ray2', 'fig-pos-b')}${text(378, b + 6, 'e⁺', 'lbl orange')}
${text(120, b + 46, 'Aligned crystal radiates, amorphous target converts', 'note')}
${text(20, c - 32, 'Single oriented crystal', 'lbl strong')}${beam(c)}
<rect class="block xtal" x="120" y="${c - 24}" width="60" height="48"/>${lattice(120, 180, c - 24, c + 24)}
${fan(184, c, 84, 'ray2', 'fig-pos-b')}${text(276, c + 6, 'e⁺', 'lbl orange')}
${text(120, c + 46, 'One aligned crystal radiates and converts: less heat', 'note')}</svg>`;
}

// Laue lens: crystals on rings diffract parallel γ rays to a common focus
function laue() {
  const ax = 160, lens = 150, F = [500, ax], ys = [60, 110, 210, 260];
  const rays = ys.map(y => `<line class="ray" x1="20" y1="${y}" x2="${lens - 6}" y2="${y}" marker-end="url(#fig-laue-a)"/><rect class="tile" x="${lens - 4}" y="${y - 13}" width="8" height="26"/><line class="ray2" x1="${lens + 4}" y1="${y}" x2="${F[0] - 4}" y2="${F[1] + (y - ax) * 0.012}"/>`).join('');
  const ang = Math.atan2(ax - ys[0], F[0] - lens - 4);
  return head('fig-laue', 'Principle of a Laue lens',
    'Parallel γ rays from a distant source reach crystals arranged on concentric rings. Each crystal diffracts the photons by twice the Bragg angle towards a common focus on the lens axis, where a small detector sits.') +
    `<line class="ref" x1="20" y1="${ax}" x2="545" y2="${ax}"/><line class="ref" x1="${lens}" y1="40" x2="${lens}" y2="280"/>${rays}
<line class="ref" x1="${lens + 4}" y1="${ys[0]}" x2="${lens + 120}" y2="${ys[0]}"/>
<polyline class="ref" points="${pts(arc(lens + 4, ys[0], 62, 0, ang))}"/>${text(lens + 72, ys[0] + 20, '2θ<tspan class="sub" dy="4">B</tspan>', 'lbl strong')}
<rect class="det" x="${F[0]}" y="${ax - 16}" width="12" height="32"/>
${text(F[0] + 6, ax - 26, 'focus', 'lbl', 'middle')}${text(F[0] + 6, ax + 38, 'detector', 'lbl', 'middle')}
${text(24, ax - 8, 'γ rays', 'lbl blue')}
${text(lens, 28, 'crystals on concentric rings', 'lbl', 'middle')}
<line class="dim" x1="${lens}" y1="300" x2="${F[0]}" y2="300" marker-start="url(#fig-laue-a)" marker-end="url(#fig-laue-a)"/>${text((lens + F[0]) / 2, 292, 'focal length f', 'note', 'middle')}
${text(548, 22, 'not to scale', 'note', 'end')}</svg>`;
}

// Bent crystal analyzer: sample, crystal and detector on the Rowland circle (Johann geometry)
function analyzer() {
  const O = [280, 185], r = 115, C0 = [O[0], O[1] - r], Cc = [O[0], O[1] + r];
  const onRow = deg => [O[0] + r * Math.cos(deg * Math.PI / 180), O[1] + r * Math.sin(deg * Math.PI / 180)];
  const S = onRow(130), D = onRow(50);
  const onX = (R, p) => [Cc[0] + R * Math.sin(p), Cc[1] - R * Math.cos(p)];
  const xtal = [...range(-0.32, 0.32, 30).map(p => onX(2 * r, p)), ...range(0.32, -0.32, 30).map(p => onX(2 * r + 9, p))];
  const hits = [-0.22, 0, 0.22].map(p => onX(2 * r, p));
  const thetaArc = arc(C0[0], C0[1], 36, Math.PI, Math.atan2(S[1] - C0[1], S[0] - C0[0]));
  return head('fig-xray', 'A bent crystal analyser on the Rowland circle',
    'Sample, curved crystal and detector lie on a circle, the Rowland circle. The crystal is bent to twice the circle radius, so X-rays from the sample reflected anywhere on its surface at the Bragg angle reach the detector.', 330) +
    `<circle class="ref" cx="${O[0]}" cy="${O[1]}" r="${r}"/>
<line class="ray" x1="70" y1="304" x2="${f1(S[0] - 10)}" y2="${f1(S[1] + 3)}" marker-end="url(#fig-xray-a)"/>
${hits.map(h => `<polyline class="ray2" points="${pts([S, h, D])}"/>`).join('')}
<polygon class="body xtal-fill" points="${pts(xtal)}"/>
<circle class="sample" cx="${f1(S[0])}" cy="${f1(S[1])}" r="7"/><rect class="det" x="${f1(D[0] - 7)}" y="${f1(D[1] - 7)}" width="14" height="14"/>
<polyline class="ref" points="${pts(thetaArc)}"/>${text(C0[0] - 48, C0[1] + 30, 'θ<tspan class="sub" dy="4">B</tspan>', 'lbl strong')}
${text(C0[0], 40, 'bent crystal analyser (radius 2r)', 'lbl', 'middle')}
${text(S[0], S[1] + 30, 'sample', 'lbl', 'middle')}${text(D[0], D[1] + 30, 'detector', 'lbl', 'middle')}
${text(O[0] + r + 10, O[1] + 4, 'Rowland circle', 'note')}${text(O[0] + r + 10, O[1] + 26, '(radius r)', 'note')}
${text(20, 322, 'incident X-rays', 'note')}${text(548, 322, 'Johann geometry', 'note', 'end')}</svg>`;
}

// Oriented calorimeter: longitudinal shower profiles, dE/dt ∝ t^(a−1) e^(−bt) (Longo's parametrisation), same area = same energy.
// Illustrative shapes, not measurements: the aligned crystal peaks earlier and contains the shower in a shorter depth.
function shower() {
  const X = [70, 530], Y = [270, 50], tMax = 20; // plot box in px; depth axis in radiation lengths of the misaligned crystal
  const gamma = (a, b) => t => Math.pow(b * t, a - 1) * Math.exp(-b * t);
  const curves = [[gamma(5.4, 0.5), 'ray2', 'misaligned crystal'], [gamma(3.4, 0.8), 'ray', 'aligned crystal']];
  const ts = range(0, tMax, 200);
  const area = f => ts.reduce((s, t) => s + f(t), 0);
  const norm = curves.map(([f]) => 1 / area(f));
  const peak = Math.max(...curves.map(([f], k) => Math.max(...ts.map(t => f(t) * norm[k]))));
  const px = t => X[0] + (X[1] - X[0]) * t / tMax, py = v => Y[0] - (Y[0] - Y[1]) * v / (peak * 1.08);
  const paths = curves.map(([f, cls], k) => {
    const p = ts.map(t => [px(t), py(f(t) * norm[k])]);
    return `<polygon class="area ${cls}-area" points="${pts([[X[0], Y[0]], ...p, [X[1], Y[0]]])}"/><polyline class="${cls}" points="${pts(p)}"/>`;
  }).join('');
  return head('fig-shower', 'Longitudinal profile of an electromagnetic shower in a misaligned and in an aligned crystal',
    'Energy deposited per unit depth against depth, for the same high-energy electron, positron or photon. In the misaligned crystal the curve rises slowly and peaks deep inside. In the crystal aligned with the beam it peaks much earlier and falls to zero within a shorter depth. The two curves enclose the same area, the same energy.') +
    `${paths}
<line class="axis" x1="${X[0]}" y1="${Y[0]}" x2="${X[1] + 10}" y2="${Y[0]}" marker-end="url(#fig-shower-a)"/>
<line class="axis" x1="${X[0]}" y1="${Y[0]}" x2="${X[0]}" y2="${Y[1] - 18}" marker-end="url(#fig-shower-a)"/>
${text(X[1] + 10, Y[0] + 26, 'depth in the crystal', 'lbl', 'end')}
<text class="lbl" text-anchor="middle" transform="translate(${X[0] - 18} ${(Y[0] + Y[1]) / 2}) rotate(-90)">energy deposited per unit depth</text>
${text(px(4.6), py(0.97 * peak) - 8, 'aligned crystal', 'lbl blue')}
${text(px(10.4), py(0.5 * peak), 'misaligned crystal', 'lbl orange')}
${text(X[1], 22, 'e⁺/e⁻ or γ of the same energy · illustrative shapes', 'note', 'end')}</svg>`;
}

// Crystalline undulator: channeled particle following periodically bent planes, photons emitted forward
function undulator() {
  const x0 = 60, x1 = 500, lam = 88, A = 12;
  const wav = (y0, extra = () => 0) => range(x0, x1, 220).map(x => [x, y0 + A * Math.sin(2 * Math.PI * (x - x0) / lam) + extra(x)]);
  const planes = [110, 130, 150, 170, 190].map(y => `<polyline class="plane" points="${pts(wav(y))}"/>`).join('');
  const body = [...wav(98), ...wav(202).reverse()];
  const path = wav(140, x => 3 * Math.sin(2 * Math.PI * (x - x0) / 23));
  const ph = [-14, 0, 14].map(dy => `<polyline class="photon" points="${pts(range(504, 544, 30).map(x => [x, 140 + dy * (x - 500) / 44 + 3 * Math.sin((x - 504) / 3)]))}"/>`).join('');
  return head('fig-und', 'A crystalline undulator',
    'Atomic planes bent along a sine wave with a sub-millimetre period. A channeled electron or positron follows the planes, oscillates with the same period and emits hard photons in a narrow forward cone.', 300) +
    `<polygon class="body" points="${pts(body)}"/>${planes}
<polyline class="ray" points="${pts([[20, 140], ...path])}"/>${ph}${text(548, 112, 'γ', 'lbl strong', 'end')}
<line class="dim" x1="${x0}" y1="72" x2="${x0 + lam}" y2="72" marker-start="url(#fig-und-a)" marker-end="url(#fig-und-a)"/>${text(x0 + lam / 2, 62, 'λ<tspan class="sub" dy="4">u</tspan><tspan dy="-4"> &lt; 1 mm</tspan>', 'lbl', 'middle')}
${text(22, 128, 'e⁺/e⁻', 'lbl blue')}
${text(x0, 238, 'periodically bent atomic planes (amplitude of a few nm)', 'lbl')}
${text(548, 292, 'not to scale', 'note', 'end')}</svg>`;
}

// Crystal bonding: a flat crystal bonded anodically to a figured glass substrate takes its shape
function bonding() {
  const arcTop = (cx, half, top, base) => range(-half, half, 40).map(dx => [cx + dx, top + (base - top) * (dx / half) ** 2]);
  const sub = (cx) => { const top = arcTop(cx, 100, 186, 204); return `<polygon class="block" points="${pts([[cx - 100, 262], ...top, [cx + 100, 262]])}"/>`; };
  const bonded = arcTop(400, 100, 178, 198.7); // as long as the substrate
  // both ion currents of anodic bonding (BOND site only): Na⁺ drifts down to the cathode, the oxygen anions it leaves behind drift up to the silicon
  const surf = x => 186 + 18 * ((x - 400) / 100) ** 2;
  const ions = [330, 410].map(x => `<line class="ray2" x1="${x}" y1="${f1(surf(x) + 14)}" x2="${x}" y2="${f1(surf(x) + 50)}" marker-end="url(#fig-bond-b)"/>${text(x + 6, surf(x) + 38, 'Na⁺', 'note')}`).join('') +
    [370, 450].map(x => `<line class="ray" x1="${x}" y1="${f1(surf(x) + 50)}" x2="${x}" y2="${f1(surf(x) + 14)}" marker-end="url(#fig-bond-a)"/>${text(x + 6, surf(x) + 38, 'O²⁻', 'note')}`).join('');
  return head('fig-bond', 'Anodic bonding of a crystal to a figured substrate',
    'Left: a flat crystal plate above a glass substrate whose surface has been figured to the wanted curvature. Right: heated and under a voltage, with the crystal positive, sodium ions in the glass drift away from the interface towards the cathode, oxygen ions drift towards the silicon and bond to it, and the crystal takes the shape of the substrate.') +
    `${text(30, 34, '1  crystal and substrate', 'lbl strong')}${text(310, 34, '2  bonded, with its shape', 'lbl strong')}
<rect class="block xtal" x="40" y="140" width="200" height="9"/>${sub(140)}
${text(140, 128, 'crystal plate', 'lbl', 'middle')}${text(140, 290, 'glass figured to shape', 'note', 'middle')}
<line class="ray" x1="250" y1="190" x2="286" y2="190" marker-end="url(#fig-bond-a)"/>${text(270, 176, 'heat', 'note', 'middle')}${text(270, 214, 'voltage', 'note', 'middle')}
${sub(400)}<polyline class="xtal-line" points="${pts(bonded.map(([x, y]) => [x, y - 4.5]))}"/>
${text(400, 152, '+  crystal (anode)', 'lbl', 'middle')}${text(400, 290, '−  cathode', 'lbl', 'middle')}${ions}
${text(548, 72, 'Si–O–Si bonds at the interface,', 'note', 'end')}${text(548, 94, 'no glue layer', 'note', 'end')}</svg>`;
}

// X-ray multi-projection imaging: thin crystals split one beam into several views of the same sample
function splitter() {
  const S = [430, 160], s1 = [150, 160], s2 = [220, 160], c1 = [282, 70], c2 = [302, 252];
  const ext = (a, b, x) => { const k = (b[1] - a[1]) / (b[0] - a[0]); return [x, b[1] + k * (x - b[0])]; };
  const beam = (pp, cls = 'ray') => `<polyline class="${cls}" points="${pts(pp)}"/>`;
  const xtal = ([x, y], rot) => `<rect class="tile" x="${x - 3}" y="${y - 14}" width="6" height="28" transform="rotate(${rot} ${x} ${y})"/>`;
  const d1 = ext(c1, S, 532), d2 = ext(c2, S, 532);
  return head('fig-split', 'X-ray multi-projection imaging with crystal beam splitters',
    'An X-ray beam crosses two thin crystals. Each diffracts part of the beam and lets the rest through; two more crystals send the diffracted beams back towards the sample, which is reached from three directions at the same time. Behind it, three detectors record three views in a single shot.') +
    `${beam([[20, 160], s1, s2, S, [532, 160]])}${beam([s1, c1, S, d1], 'ray2')}${beam([s2, c2, S, d2], 'ray2')}
${xtal(s1, 0)}${xtal(s2, 0)}${xtal(c1, 34)}${xtal(c2, -34)}
<circle class="sample" cx="${S[0]}" cy="${S[1]}" r="11"/>
${[d1, [532, 160], d2].map(([x, y]) => `<rect class="det" x="${x}" y="${f1(y - 16)}" width="10" height="32"/>`).join('')}
${text(22, 148, 'X-ray beam', 'lbl blue')}${text(185, 198, 'thin crystal splitters', 'note', 'middle')}
${text(S[0], 196, 'sample', 'lbl', 'middle')}${text(548, 22, 'three views, one shot', 'lbl strong', 'end')}${text(548, 312, 'not to scale', 'note', 'end')}</svg>`;
}

// Cryogenic detector: a particle hits a silicon cube; phonons reach the KID, whose resonance moves to lower frequency
function kid() {
  const cubes = [0, 1, 2, 3, 4].map(k => 40 + k * 56);
  const kidMeander = x => `<polyline class="kid" points="${pts(range(0, 6, 6).flatMap(k => [[x + 8 + k * 6, 264], [x + 8 + k * 6, 270]]))}"/>`;
  const hit = [180, 196];
  const phonons = [[150, 236], [176, 246], [200, 244], [214, 222], [160, 214]].map(([x, y]) => {
    const n = 18, p = range(0, 1, n).map(t => [hit[0] + (x - hit[0]) * t + 2.5 * Math.sin(t * 18), hit[1] + (y - hit[1]) * t]);
    return `<polyline class="photon" points="${pts(p)}"/>`;
  }).join('');
  const X = [370, 540], Y = [250, 90];
  const dip = (f0, cls) => `<polyline class="${cls}" points="${pts(range(0, 1, 120).map(u => { const f = u, d = 0.82 / (1 + ((f - f0) / 0.045) ** 2); return [X[0] + (X[1] - X[0]) * u, Y[1] + 12 + (Y[0] - Y[1] - 24) * d]; }))}"/>`;
  return head('fig-kid', 'A phonon-mediated kinetic inductance detector array',
    'Left: a silicon wafer carved into cubes that stay joined to a thin common disk; superconducting resonators on the disk sit under each cube. A particle hits one cube and the phonons it creates reach the resonator. Right: the resonance dip in microwave transmission moves to lower frequency after the hit.') +
    `${cubes.map(x => `<rect class="block xtal" x="${x}" y="160" width="48" height="96"/>`).join('')}<rect class="block xtal" x="36" y="254" width="284" height="10"/>
${cubes.map(kidMeander).join('')}
<line class="ray2" x1="150" y1="64" x2="${hit[0] - 2}" y2="${hit[1] - 4}" marker-end="url(#fig-kid-b)"/>${phonons}
${text(140, 56, 'particle', 'lbl orange', 'end')}
${text(36, 140, 'silicon cubes carved in one wafer', 'lbl')}${text(36, 302, 'phonons reach aluminium resonators (KIDs) on the disk', 'note')}
<line class="axis" x1="${X[0]}" y1="${Y[0]}" x2="${X[1] + 8}" y2="${Y[0]}" marker-end="url(#fig-kid-a)"/><line class="axis" x1="${X[0]}" y1="${Y[0]}" x2="${X[0]}" y2="${Y[1] - 8}" marker-end="url(#fig-kid-a)"/>
${dip(0.8, 'ray')}${dip(0.68, 'ray2')}
${text(X[1] + 8, Y[0] + 22, 'frequency', 'note', 'end')}${text(X[0] + 6, Y[1] - 12, 'transmission', 'note')}
${text(X[0] + 10, Y[1] + 40, 'before', 'note blue')}${text(X[0] + 10, Y[1] + 64, 'after a hit', 'note orange')}</svg>`;
}

// Birefringence mapping: polarised laser light through a silicon sample, scanned point by point
function polarimeter() {
  const y = 150;
  const ellipse = (x, rx, ry, rot) => `<ellipse class="pol" cx="${x}" cy="${y - 62}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${x} ${y - 62})"/>`;
  return head('fig-pol', 'Mapping birefringence with a polarimeter',
    'A laser beam passes a polariser, crosses a silicon sample and then an analyser before reaching a detector. Birefringence in the sample turns the linear polarisation slightly elliptical; scanning the sample point by point gives a map of the birefringence and of its axes.', 280) +
    `<rect class="det" x="20" y="${y - 16}" width="56" height="32" rx="3"/>${text(48, y + 40, 'laser', 'lbl', 'middle')}
<line class="ray" x1="76" y1="${y}" x2="536" y2="${y}" marker-end="url(#fig-pol-a)"/>
<rect class="tile" x="128" y="${y - 30}" width="5" height="60"/>${text(130, y + 54, 'polariser', 'lbl', 'middle')}
<line class="ray" x1="180" y1="${y - 82}" x2="180" y2="${y - 42}" marker-start="url(#fig-pol-a)" marker-end="url(#fig-pol-a)"/>${text(180, y - 94, 'linear', 'note', 'middle')}
<rect class="block xtal" x="236" y="${y - 70}" width="34" height="140"/>${text(253, y + 92, 'silicon sample', 'lbl', 'middle')}
<path class="dim" d="M 278 ${y - 70} v 140" marker-start="url(#fig-pol-a)" marker-end="url(#fig-pol-a)"/>${text(286, y - 34, 'scan', 'note')}
${ellipse(330, 7, 22, 12)}${text(330, y - 94, 'slightly elliptical', 'note', 'middle')}
<rect class="tile" x="398" y="${y - 30}" width="5" height="60"/>${text(400, y + 54, 'analyser', 'lbl', 'middle')}
<rect class="det" x="484" y="${y - 16}" width="40" height="32" rx="3"/>${text(504, y + 40, 'detector', 'lbl', 'middle')}</svg>`;
}

// Planar channeling seen as motion in the continuous potential of the planes
function potential() {
  const X0 = 70, d = 150, Yb = 232, Yt = 72, U0px = Yb - Yt;
  const U = x => { const c = X0 + d * (Math.floor((x - X0) / d) + 0.5); return U0px * (2 * (x - c) / d) ** 2; };
  const curve = range(X0, X0 + 3 * d, 300).map(x => [x, Yb - Math.min(U(x), U0px)]);
  const eCh = 0.5, half = (d / 2) * Math.sqrt(eCh), c = X0 + 1.5 * d, yCh = Yb - eCh * U0px;
  return head('fig-pot', 'Planar channeling in the continuous potential of the crystal planes',
    'The transverse potential energy of a positive particle between atomic planes forms wells, highest at each plane. A particle whose transverse energy is below the well depth is trapped and oscillates inside one channel: it is channeled. One with more transverse energy crosses the planes: it is over the barrier.', 330) +
    `${[0, 1, 2, 3].map(k => `<line class="ref" x1="${X0 + k * d}" y1="${Yt - 10}" x2="${X0 + k * d}" y2="${Yb}"/>`).join('')}
<line class="ref" x1="40" y1="${Yt}" x2="${X0}" y2="${Yt}"/>
<line class="axis" x1="40" y1="${Yb}" x2="548" y2="${Yb}"/>
<polyline class="curve" points="${pts(curve)}"/>
<line class="ray" x1="${f1(c - half)}" y1="${f1(yCh)}" x2="${f1(c + half)}" y2="${f1(yCh)}" marker-start="url(#fig-pot-a)" marker-end="url(#fig-pot-a)"/>
<line class="ray2" x1="${X0}" y1="44" x2="${X0 + 3 * d}" y2="44" marker-end="url(#fig-pot-b)"/>
<line class="dim" x1="48" y1="${Yb}" x2="48" y2="${Yt}" marker-start="url(#fig-pot-a)" marker-end="url(#fig-pot-a)"/>
${text(40, (Yb + Yt) / 2 + 6, 'U<tspan class="sub" dy="4">0</tspan>', 'lbl strong', 'end')}
${text(X0 + 3 * d, 28, 'over the barrier: E⊥ &gt; U₀', 'lbl orange', 'end')}
${text(c, Yb + 30, 'channeled: E⊥ &lt; U₀', 'lbl blue', 'middle')}
${text(548, Yb + 30, 'x', 'lbl', 'end')}
${text(X0 + 3 * d, Yb + 58, 'dashed: atomic planes', 'note', 'end')}
${text(20, Yb + 86, 'U₀ ≈ 20 eV for silicon (110) planes', 'note')}</svg>`;
}

module.exports = { steering, positrons, laue, analyzer, shower, undulator, bonding, splitter, kid, polarimeter, potential };
