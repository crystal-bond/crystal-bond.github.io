// Builds the BOND project site (Crystal BOND, INFN CSN5, 2025-2027): node src/build.js
// Own design on the header and type of the Crystal Lab Ferrara site: base.css (type, palette, header, footer), bond.css (pages), bond.js.
// The content (devices, units, milestones, results) is in content.js; the diagrams in figures.js (from the lab) and figures-bond.js.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ROOT = path.join(__dirname, '..');
const FIG = { ...require('./figures'), ...require('./figures-bond') };
const { DEVICES, UNITS, WPS, month, MILESTONES, STATUS, SUPPORT, P2026, P2025, RADIUS } = require('./content');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const nw = s => esc(s).replace(/(\S+-\S+)/g, '<span class="nw">$1</span>');
const V = Object.fromEntries(['base.css', 'bond.css', 'bond.js'].map(f => [f, crypto.createHash('md5').update(fs.readFileSync(path.join(ROOT, f))).digest('hex').slice(0, 8)]));
const CONTACT = 'andrea.mazzolari@unife.it';

const NAV = [['./', 'Home'], ['project.html', 'Project'], ['devices.html', 'Devices'], ['technology.html', 'Technology'], ['progress.html', 'Progress'], ['rowlandbench.html', 'RowlandBench'], ['team.html', 'Team']];

const nav = current => `<a class="skip" href="#main">Skip to content</a>
<header class="nav">
  <div class="wrap nav-in">
    <a class="brand" href="./"><img src="img/logos/infn-white.svg" alt="INFN" width="65" height="34"><span>Crystal BOND<small>CSN5 project · 2025–2027</small></span></a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu" aria-label="Menu"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
    <nav class="nav-main" aria-label="Main">
      <ul class="nav-links" id="menu">
${NAV.map(([h, l]) => `        <li><a href="${h}"${h === current || (h === './' && current === 'index.html') ? ' aria-current="page"' : ''}>${l}</a></li>`).join('\n')}
      </ul>
    </nav>
  </div>
</header>`;

const footer = `<footer class="footer">
  <div class="wrap">
    <div class="foot-top">
      <div>
        <p class="foot-lead">Samples, tests, collaborations: write to the project coordinator.</p>
        <a class="mail" href="mailto:${CONTACT}">${CONTACT}</a>
      </div>
      <div class="foot-logos">
        <img src="img/logos/infn.svg" alt="INFN" width="107" height="56" loading="lazy">
      </div>
    </div>
  </div>
  <div class="foot-bar">
    <div class="wrap foot-bottom">
      <p>Crystal BOND, a research project of INFN National Scientific Committee 5 · INFN Ferrara (coordination), Laboratori Nazionali di Legnaro, INFN Trieste, Laboratori Nazionali di Frascati</p>
      <p>Ferrara unit: <a href="https://crystalab.unife.it/">Crystal Lab Ferrara</a> · Visits are counted anonymously, without cookies</p>
    </div>
  </div>
</footer>
<script src="bond.js?v=${V['bond.js']}" defer onerror="document.documentElement.classList.replace('js', 'no-js')"></script>`;

// photos ship as WebP with the JPG as fallback
const webp = html => html.replace(/<img src="(img\/photos\/[^"]+)\.jpg"([^>]*)>/g, (m, base, rest) =>
  fs.existsSync(path.join(ROOT, base + '.webp')) ? `<picture><source srcset="${base}.webp" type="image/webp"><img src="${base}.jpg"${rest}></picture>` : m);

// soft hyphens in justified text (Chrome on Windows does not hyphenate by itself); same rules as crystalab-web
const PREFIX = /^(electro|micro|ultra|inter|multi|semi|super|thermo|mono|nano|radio|under|over)(?=[a-mo-z][a-z]{3})/i;
const HYPH = Object.fromEntries(require('./hyphen').map(h => [h.replace(/-/g, '').toLowerCase(), h]));
const hyphWord = w => {
  const known = HYPH[w.toLowerCase()];
  if (known) { let k = 0; return [...known].map(ch => ch === '-' ? '­' : w[k++]).join(''); }
  if (w.length < 9 || /[^A-Za-z]/.test(w)) return w;
  let s = w.replace(PREFIX, '$1­');
  s = s.replace(/([a-z]{3})(tions?|sions?|ments?|ness|cally)$/i, '$1­$2');
  if (!/thing$/i.test(s)) s = s.replace(/([a-z]{3})([b-df-hj-np-tv-z])\2ing$/i, '$1$2­$2ing');
  if (!/thing$|[b-df-hj-np-tv-z][lr]ing$/i.test(s)) s = s.replace(/([a-z]{4}[b-df-hj-np-tv-z])ing$/i, '$1­ing');
  return s;
};
const hyphText = html => html.replace(/>([^<]+)</g, (m, t) => '>' + t.replace(/[A-Za-z]+/g, hyphWord) + '<');
// justified blocks are marked "just" and hold only paragraphs
const hyphPage = body => body.replace(/<div class="[^"]*\bjust\b[^"]*">[\s\S]*?<\/div>/g, m => m.replace(/<p>[\s\S]*?<\/p>/g, hyphText));

function page(file, title, desc, body, cls = '') {
  body = hyphPage(body)
    .replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener"')
    .replace(/>([^<]*)</g, (m, t) => '>' + t.replace(/ · /g, ' · ') + '<');
  const html = `<!doctype html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<script>document.documentElement.classList.replace('no-js', 'js');</script>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#0e0e0f">
<link rel="icon" href="img/logo.svg" type="image/svg+xml">
<link rel="preload" href="fonts/ibm-plex-sans-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="base.css?v=${V['base.css']}">
<link rel="stylesheet" href="bond.css?v=${V['bond.css']}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Crystal BOND">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
</head>
<body${cls ? ` class="${cls}"` : ''}>
${webp(`${nav(file)}\n<main id="main">\n${body}\n</main>\n${footer}`)}
</body>
</html>
`;
  fs.writeFileSync(path.join(ROOT, file), html);
}

// page header: navy band with crumb, title and lead; a photo of the project beside it
const pHead = (crumb, title, lead, img, alt) => `<section class="p-head on-dark">
  <div class="p-head-text">
    <p class="crumbs"><a href="./">Crystal BOND</a> / ${crumb}</p>
    <h1>${title}</h1>
    <p>${lead}</p>
  </div>
  <div class="p-head-photo"><img src="img/photos/${img}" alt="${esc(alt)}" fetchpriority="high"></div>
</section>`;
const figcard = (svg, caption) => `<figure class="figcard">${svg}<figcaption>${caption}</figcaption></figure>`;
const doi = (d, label) => `<a href="https://doi.org/${d}">${label}</a>`;
const sheet = rows => `<dl class="sheet">${rows.map(([a, b]) => `<dt>${esc(a)}</dt><dd>${esc(b)}</dd>`).join('')}</dl>`;

// ---------------------------------------------------------------- home
// dated news for the home page, newest first; each links to the Progress page
const NEWS = [
  ['2026', 'Cylindrical silicon crystals prepared for SOLEIL', 'Two silicon (111) crystals, 0.3 mm thick, bonded on glass and aluminium cylinders of 1 m radius and checked by X-ray diffraction, for deflection tests with synchrotron light.', 'si111-glass-r1m.jpg', 'A silicon (111) crystal bonded on a cylindrical glass substrate of 1 m radius'],
  ['February 2026', 'Bonding equipment: tender completed', 'The tender for the anodic and thermo-compression bonder was awarded to SUSS MicroTec, after successful demonstrations on curved substrates.', 'demo-bonded.jpg', 'A silicon crystal bonded to a cylindrical glass substrate in a maker demonstration'],
  ['December 2025', 'Design of crystals and substrates completed', 'Finite-element and analytical models of crystals bonded to glass agree and fix the geometry of the figured substrates.', null, ''],
  ['2025', 'First quartz analyser: 1.4 eV at ESRF', 'Quartz crystals bonded on a glass spherical cap of 1 m radius resolved 1.4 eV at the BM20 beamline, comparable to a silicon (111) analyser.', 'quartz-analyser.jpg', 'Quartz crystals bonded on a glass spherical cap of 1 m radius'],
];
const LOGOS = [['cern.png', 'CERN'], ['esrf.png', 'ESRF'], ['xfel.png', 'European XFEL'], ['elettra.jpg', 'Elettra Sincrotrone Trieste'], ['inaf.png', 'INAF']];

page('index.html', 'Crystal BOND · INFN research project on bonded bent crystals', 'BOND is a research project of INFN National Scientific Committee 5 (2025–2027) on bent crystals bonded to figured substrates, for the LHC, X-ray spectroscopy and imaging, and Laue lenses.', `
<section class="i-hero on-dark" aria-label="Crystal BOND">
  <div class="i-hero-text">
    <p class="kicker rise">Istituto Nazionale di Fisica Nucleare · National Scientific Committee 5</p>
    <h1 class="rise d1">Crystal BOND</h1>
    <p class="i-sub rise d1">Bonded bent crystals for particle accelerators, synchrotron <span class="nw">X-ray</span> optics and γ-ray astronomy</p>
    <p class="i-lead rise d2">A three-year INFN research project, 2025–2027, carried out by the Ferrara, Legnaro, Trieste and Frascati units and coordinated by INFN Ferrara.</p>
    <div class="actions rise d3"><a class="btn btn-white" href="project.html">The project</a><a class="btn btn-ghost" href="progress.html">Results</a></div>
  </div>
  <div class="i-hero-photo"><img src="img/photos/hero-cleanroom-people.jpg" alt="Researchers at work in the Ferrara cleanroom" fetchpriority="high"></div>
</section>
<section class="ticker" aria-label="BOND in figures">
  <div class="wrap">
    <ul>
      <li><b>4</b><span>INFN units: Ferrara, Legnaro, Trieste, Frascati</span></li>
      <li><b>36 months</b><span>January 2025 to December 2027</span></li>
      <li><b>4</b><span>crystal assemblies to deliver, with bending radii from 0.1 to 20 m</span></li>
      <li><b>1.4 eV</b><span>energy resolution of the first quartz analyser, measured at ESRF</span></li>
    </ul>
  </div>
</section>

<section class="sec white">
  <div class="wrap about">
    <div class="just">
      <h2 class="h2 ruled">The project</h2>
      <p>Bent crystals steer charged particle beams by channeling and select or focus X-rays and γ rays by diffraction. Their performance depends on how precisely the crystal is bent and held. Today crystals are bent by mechanical holders or glued, which leaves shape errors and adds bulk.</p>
      <p>BOND develops a single technology for all these uses: thin crystals are joined, by anodic and thermo-compression bonding, to substrates figured with optical precision. The crystal takes the shape of the substrate and keeps it. The project will deliver bonded crystals for the Large Hadron Collider, for synchrotron spectroscopy and imaging, and for Laue lenses.</p>
      <p class="about-more"><a class="arrow" href="project.html">Goals, work packages and timeline</a></p>
    </div>
    <dl class="factsheet" aria-label="Project data">
      <dt>Acronym</dt><dd>BOND</dd>
      <dt>Title</dt><dd>Crystal BOND</dd>
      <dt>Funding body</dt><dd>INFN, National Scientific Committee 5</dd>
      <dt>Research area</dt><dd>Accelerators</dd>
      <dt>Duration</dt><dd>January 2025 – December 2027</dd>
      <dt>National coordinator</dt><dd>Andrea Mazzolari, INFN Ferrara</dd>
      <dt>Units</dt><dd>INFN Ferrara, Laboratori Nazionali di Legnaro, INFN Trieste, Laboratori Nazionali di Frascati</dd>
    </dl>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head">
      <h2 class="h2 ruled">Research objectives</h2>
      <p>Four bonded crystal assemblies, each designed for a different application.</p>
    </div>
    <div class="objs">
${DEVICES.map(d => `      <article class="obj"><img src="img/photos/${d.photo}" alt="" loading="lazy"><div class="obj-body"><p class="obj-code">Assembly ${d.code}</p><h3><a href="devices.html#${d.id}">${nw(d.name)}</a></h3><p>${esc(d.short)}</p></div></article>`).join('\n')}
    </div>
  </div>
</section>

<section class="sec white">
  <div class="wrap">
    <div class="sec-head">
      <h2 class="h2 ruled">News</h2>
      <p><a class="arrow" href="progress.html">All results, 2025 and 2026</a></p>
    </div>
    <ol class="news-list">
${NEWS.map(([date, t, p, img, alt]) => `      <li><p class="news-date">${date}</p><div><h3><a href="progress.html">${esc(t)}</a></h3><p>${esc(p)}</p></div>${img ? `<img src="img/photos/${img}" alt="${esc(alt)}" loading="lazy">` : '<span></span>'}</li>`).join('\n')}
    </ol>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head">
      <h2 class="h2 ruled">Consortium</h2>
      <p><a class="arrow" href="team.html">People and work-package leaders</a></p>
    </div>
    <ul class="consortium">
${UNITS.map(u => `      <li><h3>${esc(u.name)}</h3><p class="c-role">${esc(u.role)}</p><p class="c-lead">Local coordinator: ${esc(u.lead)}</p></li>`).join('\n')}
    </ul>
    <div class="logo-strip">
      <p>With the support of</p>
      <ul>${LOGOS.map(([f, n]) => `<li><img src="img/logos/${f}" alt="${esc(n)}" loading="lazy"></li>`).join('')}</ul>
    </div>
  </div>
</section>

<section class="contact on-dark">
  <div class="wrap contact-in">
    <div>
      <h2>Contact</h2>
      <p>For samples, tests on beamlines and collaborations, please write to the national coordinator.</p>
    </div>
    <address>
      <b>Andrea Mazzolari</b>
      <span>INFN Ferrara and University of Ferrara</span>
      <span>Via Saragat 1, 44122 Ferrara, Italy</span>
      <a href="mailto:${CONTACT}">${CONTACT}</a>
    </address>
  </div>
</section>`, 'home');

// ---------------------------------------------------------------- project
const NOW = 22 + 17 / 30; // months since 1 January 2025, on 17 November 2026
const at = m => (m / 36 * 100).toFixed(2);
page('project.html', 'Project · Crystal BOND', 'Goals, work packages and timeline of BOND, the INFN project on bonded bent crystals, 2025–2027.', `
${pHead('Project', 'The project', 'BOND, Crystal BOND, is a research project of INFN National Scientific Committee 5, in the accelerator area, from 2025 to 2027. It is coordinated by INFN Ferrara.', 'cleanroom.jpg', 'The Ferrara cleanroom', 'The Ferrara cleanroom, where the project is coordinated.')}
<section class="sec white">
  <div class="wrap split">
    <div class="just">
      <h2 class="h2 ruled">Motivation and goals</h2>
      <p>Bent crystals steer charged particles by channeling and select or focus X-rays by diffraction. How well they do it depends less and less on the lattice and more and more on <b>how the crystal is bent and held</b>. Mechanical holders leave anticlastic curvature and torsion and add mass; glue layers creep and change with temperature.</p>
      <p>Each field feels it differently. At accelerators, metal benders make deformation hard to control and weigh on the goniometers. In X-ray spectroscopy, quartz and germanium beat silicon but are glued, and lose their advantage to shape errors. In spectral imaging, bent Laue crystals need motorised benders to correct their shape. Above 100 keV, astronomy still lacks focusing optics.</p>
      <p>BOND joins the crystal directly to a substrate figured with optical precision, by <b>anodic</b> and <b>thermo-compression</b> bonding, techniques of silicon micromachining. The crystal takes the shape of the substrate: compact, light assemblies with almost no form error. They have to be adapted from thin wafers to substrates a few centimetres thick and crystals from below a millimetre to a few millimetres.</p>
      <p>The goal is to make INFN a reference for crystals that manipulate radiation, with one platform and the know-how to design, make and test them.</p>
    </div>
    ${figcard(FIG.bonding(), 'A flat crystal bonded anodically to a figured glass substrate takes its curvature: sodium ions leave a depletion layer under the interface, where oxygen ions oxidise the silicon. Curvature and thicknesses are exaggerated.')}
  </div>
</section>
<section class="sec">
  <div class="wrap">
    <div class="sec-head">
      <h2 class="h2 ruled">Planned assemblies</h2>
      <p>Four assemblies, each for its own job, from the same bonding platform.</p>
    </div>
    <div class="table-wrap"><table class="spec-table">
      <thead><tr><th scope="col">Assembly</th><th scope="col">Purpose</th><th scope="col">Radius</th><th scope="col">Shape</th><th scope="col">Miscut</th><th scope="col">Materials</th></tr></thead>
      <tbody>
        <tr><th scope="row"><a href="devices.html#steer">A1</a></th><td>Steering charged particle beams of about 1 TeV</td><td>10 m</td><td>rectangular, convex, about 70 × 20 × 3 mm</td><td>&lt; 100 µrad</td><td>silicon</td></tr>
        <tr><th scope="row"><a href="devices.html#analyse">A2.1</a></th><td>Bonded bent crystal analysers</td><td>0.1–1 m</td><td>spherical or cylindrical, concave, Ø ≈ 100 mm</td><td>not critical</td><td>germanium, quartz, lithium niobate</td></tr>
        <tr><th scope="row"><a href="devices.html#image">A2.2</a></th><td>Spectral imaging</td><td>0.1–0.5 m</td><td>cylindrical, concave</td><td>not critical</td><td>silicon, germanium</td></tr>
        <tr><th scope="row"><a href="devices.html#focus">A3</a></th><td>Concentrator for hard X-rays above 100 keV</td><td>20 m</td><td>about 10 convex tiles, 30 × 20 × 2 mm each</td><td>uniform within a few µrad</td><td>silicon, germanium</td></tr>
      </tbody>
    </table></div>
  </div>
</section>
<section class="sec white">
  <div class="wrap">
    <div class="sec-head">
      <h2 class="h2 ruled">Work packages</h2>
      <p>Design, two lines of bonded assemblies, verification on beams, and the management that holds them together.</p>
    </div>
    <ol class="wps">
${WPS.map(([n, t, lead, unit, tasks]) => `      <li class="wp"><span class="wp-n"><small>WP</small>${n.slice(2)}</span><h3>${nw(t)}</h3><p class="wp-lead">${esc(lead)} · ${esc(unit)}</p><ul>${tasks.map(x => `<li>${esc(x)}</li>`).join('')}</ul></li>`).join('\n')}
    </ol>
  </div>
</section>
<section class="sec" id="timeline">
  <div class="wrap">
    <div class="sec-head">
      <h2 class="h2 ruled">Milestones and deliverables</h2>
      <p>Thirty-six months, January 2025 to December 2027. Status as given in the 2025 activity report.</p>
    </div>
    <div class="gantt" role="table" aria-label="Milestones and deliverables with due date and status">
      <div class="g-row g-head" role="row"><span class="g-code" role="columnheader">Code</span><span class="g-what" role="columnheader">Milestone or deliverable</span><div class="g-track" role="columnheader"><div class="g-years"><span>2025</span><span>2026</span><span>2027</span></div><i class="g-now" style="left:${at(NOW)}%"></i></div></div>
${MILESTONES.map(([c, t, m, st, note]) => `      <div class="g-row" role="row"><span class="g-code" role="cell">${c}</span><span class="g-what" role="cell">${esc(t)}<small>Due ${month(m)} · ${STATUS[st]}${note ? `. ${esc(note)}` : ''}</small></span><div class="g-track" role="cell" aria-hidden="true"><i class="g-now" style="left:${at(NOW)}%"></i><i class="g-mark ${st || 'plan'}" style="left:${at(m - 0.5)}%"></i></div></div>`).join('\n')}
    </div>
    <p class="g-legend"><span><i class="g-mark done"></i>Done</span><span><i class="g-mark part"></i>In progress</span><span><i class="g-mark"></i>Planned</span><span><i class="g-now" style="position:static;display:inline-block;width:2px;height:16px;margin:0"></i>Today</span></p>
  </div>
</section>`);

// ---------------------------------------------------------------- devices
page('devices.html', 'Devices · Crystal BOND', 'The four bonded crystal assemblies of BOND: crystals for the LHC, X-ray analysers, crystals for spectral imaging and Laue-lens building blocks.', `
${pHead('Devices', 'Devices', 'Four assemblies, from TeV proton beams to hard X-rays from space. Each one asks the crystal for a different shape, material and precision.', 'quartz-analyser.jpg', 'Quartz crystals bonded on a glass spherical cap: the first BOND analyser prototype', 'The first BOND analyser: quartz on a glass spherical cap of 1 m radius.')}
<nav class="dev-index" aria-label="Devices"><div class="wrap"><ul class="dev-tabs">${DEVICES.map(d => `<li><a href="#${d.id}"><span class="code">${d.code}</span> ${nw(d.name)}</a></li>`).join('')}</ul></div></nav>
${DEVICES.map((d, k) => `<section class="sec${k % 2 ? '' : ' white'} dev" id="${d.id}">
  <div class="wrap dev-grid">
    <div class="dev-side">
      <p class="dev-code">Assembly ${d.code}</p>
      <h2>${nw(d.name)}</h2>
      <p class="short">${esc(d.short)}</p>
      ${sheet([...d.specs, ['Work package', d.wp]])}
    </div>
    <div class="dev-main">
      ${figcard(FIG[d.fig](), d.caption)}
      <div class="just">
      ${d.text.join('\n      ')}
      </div>
      <figure class="photo"><img src="img/photos/${d.photo}" alt="${esc(d.alt)}" loading="lazy"><figcaption>${esc(d.alt)}.</figcaption></figure>
    </div>
  </div>
</section>`).join('\n')}`);

// ---------------------------------------------------------------- technology
const TECH = [
  { svg: FIG.bonding(), plot: 'fem-radius', alt: 'Bending radius of a silicon-glass bilayer versus bonding temperature, analytical model and FEM', wide: true, id: 'anodic', title: 'Anodic bonding', cap: 'Left: sodium ions drift to the cathode and leave a depletion layer, where oxygen ions oxidise the silicon. Right: simulations of anodic bonding, the bending radius of a silicon–glass bilayer after bonding and cooling, for 2 and 3 mm silicon on Hoya SD2 and Borofloat 33 glass; analytical model and FEM agree (LNL).',
    text: 'Silicon and an alkali-containing glass are heated to a few hundred degrees and a voltage of a few hundred volts is applied, with the crystal positive. Sodium ions in the glass drift away from the interface, leaving an oxygen-rich layer that the electric field pulls against the silicon; the two seal with Si–O–Si bonds, with no organic layer to creep or outgas. The mismatch of thermal expansion between silicon and glass leaves a curvature on cooling, which models predict: tens of metres with Borofloat 33, hundreds of metres or more with Hoya SD2. We will bond silicon to glass, Grade 5 titanium and 316LN steel, and work on lower temperatures to reduce the thermal stress.',
    specs: [['Materials', 'silicon on glass, titanium, steel'], ['For', 'A1, A2.2, A3']] },
  { svg: FIG.thermo(), id: 'thermo', title: 'Thermo-compression bonding',
    text: 'Two thin metal layers are pressed together while hot until they soften and interdiffuse into one joint. A gold–germanium eutectic joins germanium crystals to gold-coated germanium; suitable films for quartz and lithium niobate are being developed in Legnaro, where films are deposited by sputtering and evaporation and calibrated by Rutherford backscattering.',
    specs: [['Materials', 'germanium, quartz, lithium niobate'], ['Films', 'sputtering, e-beam evaporation (LNL)'], ['For', 'A2.1, A3']],
    cap: 'Crystal and substrate each carry a thin metal film; pressed together hot, the two films become one joint.' },
  { img: 'epoxy-uniform', alt: 'A uniform epoxy film spin-coated on a silicon wafer', id: 'adhesive', title: 'Thin adhesive films',
    text: 'While the bonding equipment was being procured we developed an interim route: spin-coating a thin epoxy film on the curved substrate, then laying the cut crystal on it. The first films dewetted into droplets seconds after spinning; after tests on six adhesives of different viscosity, on speed, acceleration, time, volume and plasma or UV surface activation, Epotek 301 gave films 2 µm thick and uniform within 150 nm, measured by interferometry. The first quartz and lithium niobate analysers were made this way.',
    specs: [['Adhesive', 'Epotek 301'], ['Film', '2 µm, uniform within 150 nm'], ['For', 'first A2.1 prototypes']], cap: 'A uniform epoxy film on a silicon wafer, measured by optical interferometry.' },
  { img: 'linbo3-cubes', alt: 'A lithium niobate plate diced into 3 mm cubes', id: 'shape', title: 'Crystal preparation',
    text: 'Silicon for the LHC must be dislocation-free with a miscut below 100 µrad; commercial wafers start near 8000 µrad, so the miscut is corrected by magnetorheological polishing. Wafers are diced, ground and polished to remove the damaged layer that would start fractures during bending. Quartz and lithium niobate wear the diamond blade fast: a matrix of blade speed, feed, depth, coolant flow and mounting tape gave a recipe that cuts them cleanly.',
    specs: [['Miscut', 'magnetorheological polishing, < 100 µrad'], ['Dicing', 'Disco blade dicers, Ferrara'], ['Wafers', 'up to 150 mm']], cap: 'A 3 mm lithium niobate plate cut into 3 mm cubes, the basis of lithium niobate analysers.' },
  { img: 'verifire', alt: 'The Zygo Verifire HDX Fizeau interferometer', id: 'measure', title: 'Characterisation',
    text: 'Bond strength is measured with standard tensile tests in Ferrara. The shape of every bent crystal is mapped by Fizeau interferometry and its lattice by high-resolution X-ray diffraction; cross-sections of the interface are studied by SEM, EDX and EBSD in Legnaro, and crystals by X-ray computed tomography in Frascati. Then come synchrotrons, ESRF and Elettra, and particle beams at CERN.',
    specs: [['Shape', 'Fizeau interferometry, profilometry'], ['Lattice', 'high-resolution XRD, X-ray topography at ESRF'], ['Interface', 'SEM, EDX, EBSD, ion milling, RBS (LNL)'], ['Volume', 'X-ray CT (LNF)']], cap: 'The Zygo Verifire HDX Fizeau interferometer in Ferrara.' },
  { svg: FIG.bonder(), wide: true, side: true, id: 'equipment', title: 'The bonding equipment',
    text: 'A commercial bonder for anodic and thermo-compression bonding, with controlled temperature, force, voltage and atmosphere, adapted to crystals and substrates with cylindrical and spherical surfaces. Demonstrations by two makers on curved substrates were successful; the tender, completed in February 2026, was awarded to SUSS MicroTec. It is meant for the Ferrara cleanroom.',
    specs: [['Bonding', 'anodic, thermo-compression'], ['Maker', 'SUSS MicroTec'], ['Where', 'Ferrara cleanroom']], cap: 'Scheme of the bonder: a press and two heaters hold the stack of ceramic, silicon and glass in a chamber; the high voltage is applied between silicon and glass, while thermocouples and a force sensor follow the process.' },
];
const media = t => t.svg && t.plot ? `<div class="media plot pair">${t.svg}<img src="img/fig/${t.plot}.png" alt="${esc(t.alt)}" loading="lazy"></div>`
  : t.svg ? `<div class="media plot">${t.svg}</div>`
  : t.plot ? `<div class="media plot"><img src="img/fig/${t.plot}.png" alt="${esc(t.alt)}" loading="lazy"></div>`
  : `<div class="media"><img src="img/photos/${t.img}.jpg" alt="${esc(t.alt)}" loading="lazy"></div>`;
page('technology.html', 'Technology · Crystal BOND', 'How BOND bends crystals: anodic and thermo-compression bonding on figured substrates, thin adhesive films, crystal preparation and characterisation.', `
${pHead('Technology', 'Technology', 'Optical-grade substrates, bonding techniques from silicon micromachining, and the metrology to check the result.', 'interf-red2.jpg', 'A crystal on its mount, lit for interferometry')}
<section class="sec">
  <div class="wrap tech">
${TECH.map(t => `    <article class="tpanel${t.wide ? ' wide' : ''}${t.side ? ' side' : ''}" id="${t.id}">
      ${media(t)}
      <div class="body">
        <h2>${nw(t.title)}</h2>
        <div class="just"><p>${esc(t.text)}</p></div>
        <p class="cap">${esc(t.cap)}</p>
        <div class="sheet-wrap">${sheet(t.specs)}</div>
      </div>
    </article>`).join('\n')}
  </div>
</section>`);

// ---------------------------------------------------------------- progress
const tlItem = ([img, t, p, alt], tag = '', key = false) => `      <li class="tl-item${img ? '' : ' noimg'}${key ? ' key' : ''}"><div class="tl-card">${img ? (img.startsWith('fig:') ? `<img class="figimg" src="img/fig/${img.slice(4)}.png" alt="${esc(alt)}" loading="lazy">` : `<img src="img/photos/${img}" alt="${esc(alt)}" loading="lazy">`) : ''}<div>${tag ? `<span class="unit-tag">${tag}</span>` : ''}<h3>${esc(t)}</h3><p>${esc(p)}</p></div></div></li>`;
page('progress.html', 'Progress · Crystal BOND', 'What BOND has achieved: cylindrical Si(111) crystals for SOLEIL in 2026; in 2025 the first quartz analyser at 1.4 eV, thin adhesive films, silicon for the LHC and FEM models.', `
${pHead('Progress', 'Progress', 'The first bonded analysers on a synchrotron, cylindrical silicon crystals ready for the next one, the models to design them and the bonding equipment.', 'wafer-objective2.jpg', 'A wafer under a microscope objective')}
<section class="sec white">
  <div class="wrap">
    <div class="tl">
      <div class="tl-year"><b>2026</b><span>Ferrara, from the lab notes. Updated November 2026.</span></div>
      <ol class="tl-list">
${P2026.map((x, k) => tlItem(x, 'Ferrara', k === 0)).join('\n')}
      </ol>
    </div>
  </div>
</section>
<section class="sec tint">
  <div class="wrap glance">
    <div>
      <h2 class="h2 ruled">2025 against the plan</h2>
      <p class="lead">The milestones on silicon wafers for the LHC and on the FEM-assisted design of substrates were fully achieved. The procurement of the bonding equipment took longer than planned, as makers of microelectronics equipment were saturated by demand: it reached 75% by the end of the year and the tender was completed in February 2026. Meanwhile an interim adhesive route produced the first X-ray analysers.</p>
      <p style="margin-top:22px"><a class="arrow" href="project.html#timeline">Milestones and deliverables</a></p>
    </div>
    <ul class="bars">
      <li><span>Silicon wafers for the LHC</span><b>100%</b><span class="bar"><i style="width:100%"></i></span></li>
      <li><span>FEM-assisted design of the substrates</span><b>100%</b><span class="bar"><i style="width:100%"></i></span></li>
      <li><span>Bonding equipment (tender completed February 2026)</span><b>75%</b><span class="bar"><i class="part" style="width:75%"></i></span></li>
    </ul>
  </div>
</section>
<section class="sec white">
  <div class="wrap">
    <div class="tl">
      <div class="tl-year"><b>2025</b><span>All four units, from the 2025 activity report.</span></div>
      <ol class="tl-list">
${P2025.flatMap(([unit, items]) => items.map((x, k) => tlItem(x, unit, unit === 'Ferrara' && k === 0))).join('\n')}
      </ol>
    </div>
  </div>
</section>
<section class="sec">
  <div class="wrap">
    <div class="sec-head">
      <h2 class="h2 ruled">Publications and talks</h2>
    </div>
    <ol class="pubs">
      <li><b>${doi('10.1140/epjc/s10052-025-15092-y', 'Performance of short and long bent crystals for the TWOCRYST experiment at the Large Hadron Collider')}</b><span>Bandiera L. et al. · <i>European Physical Journal C 85 (2025)</i> · includes the first crystal bent by anodic bonding, tested at the CERN SPS</span></li>
      <li><b>${doi('10.1117/12.2665894', 'Anodic bonding to manufacture Laue lenses for high-energy astrophysics')}</b><span>Mazzolari A., Frontera F., Romagnoni M., Guidi V. et al. · <i>Proc. SPIE 12576, 125760F (2023)</i></span></li>
      <li><b>Bonded bent crystals for accelerators, synchrotron X-ray optics and Laue lenses</b><span>A. Mazzolari on behalf of the BOND Collaboration · conference talk</span></li>
    </ol>
  </div>
</section>`);

// ---------------------------------------------------------------- rowlandbench
// Text from the draft of the reference article (A. Mazzolari, "RowlandBench: design and simulation of bent-crystal X-ray
// analyzer spectrometers", in preparation); figures 1-4 of the same draft.
const RB_FIGS = [
  ['rb-budget', 'Resolution budget of a run', 'The same rays traced with one effect added at a time: geometry with a point source, source size, intrinsic reflectivity curve, in-plane strain of the bent wafer, shape error. Here a 1 m spherically bent Si(555) analyser at 9982 eV.'],
  ['rb-rays', 'Ray paths', 'The Rowland plane to scale with the sampled rays, shaded by their energy shift, and the reflected bundle near the detector in the dispersive and sagittal directions.'],
  ['rb-maps', 'Maps over the crystal', 'Over the 100 mm face of the analyser: energy shift from the in-plane strain of the ideally bent wafer, a synthetic shape error, the strain with the shape error, and the mean reflected energy with all effects.'],
];
page('rowlandbench.html', 'RowlandBench · Crystal BOND', 'RowlandBench, a desktop program for the design and simulation of X-ray spectrometers based on bent-crystal analysers: ray tracing, Takagi–Taupin reflectivity, bending strain, shape errors and tolerances.', `
${pHead('RowlandBench', 'RowlandBench', 'A desktop program for the design and simulation of <span class="nw">X-ray</span> spectrometers based on bent-crystal analysers, written in Ferrara.', 'rb-head.jpg', 'The instrument response computed by RowlandBench for a spherically bent silicon analyser')}
<section class="sec white">
  <div class="wrap split">
    <div class="just">
      <h2 class="h2 ruled">What it does</h2>
      <p>The energy resolution of a bent-crystal analyser comes from several effects of comparable size: the size of the source, the Johann aberration, the reflectivity curve of the bent crystal, the strain left by bending, the errors of shape and the pixels of the detector. Choosing a design means weighing them together.</p>
      <p>RowlandBench does these calculations in one place. It traces rays from an extended source to the analyser and the detector, and combines them with the <b>Takagi–Taupin reflectivity</b> of the bent crystal, the <b>in-plane strain</b> of the bonded wafer computed by finite elements, and <b>shape errors</b> taken from synthetic or measured interferometer maps. Integrating and position-resolving detectors with finite pixels are modelled.</p>
      <p>For each design it reports the energy resolution with its statistical uncertainty, a budget of the contributions, and how resolution and efficiency respond to fabrication and alignment tolerances. A model of the incident-beam monochromator gives the elastic line of resonant inelastic <span class="nw">X-ray</span> scattering.</p>
      <p>For BOND it is the tool to design the bonded analysers in quartz, lithium niobate and germanium, and to see how much of their resolution is lost to the shape of the bonded crystal.</p>
    </div>
    <figure class="figcard"><img src="img/fig/rb-window.webp" alt="Main window of RowlandBench: settings on the left, instrument response and reflectivity curve on the right" loading="lazy"><figcaption>The main window after a run: the settings pages and the sketch of the Rowland geometry on the left; on the right the instrument response, with and without the shape error, and the reflectivity curve of the bent crystal.</figcaption></figure>
  </div>
</section>
<section class="sec">
  <div class="wrap">
    <div class="sec-head">
      <h2 class="h2 ruled">What it covers</h2>
      <p>Analysers, materials and readouts that can be simulated.</p>
    </div>
    <div class="table-wrap"><table class="spec-table" style="min-width:560px">
      <tbody>
        <tr><th scope="row">Analysers</th><td>Johann (cylindrical, spherical, toroidal), Johansson, diced, strip-bent, sliced, von Hámos; asymmetric reflections</td></tr>
        <tr><th scope="row">Arrays</th><td>up to 72 crystals (12 columns, 8 rows), with a common or separate focus and individual misalignments</td></tr>
        <tr><th scope="row">Materials</th><td>Si, Ge, α-quartz, sapphire, GaAs, LiF, diamond, InSb, LiNbO₃</td></tr>
        <tr><th scope="row">Imperfections</th><td>in-plane bending strain, finite-element contact of the wafer pressed on its substrate, synthetic or interferometric shape-error maps</td></tr>
        <tr><th scope="row">Detectors</th><td>integrating or position-resolving, with finite pixels</td></tr>
        <tr><th scope="row">Studies</th><td>parameter sweeps with response surfaces, tolerance studies, ranking of the analysers that reach a working energy</td></tr>
        <tr><th scope="row">Output</th><td>energy resolution (FWHM) with uncertainty, acceptance, spot on the detector, resolution budget; export as CSV, JSON, PNG, HTML and PDF</td></tr>
      </tbody>
    </table></div>
  </div>
</section>
<section class="sec white">
  <div class="wrap">
    <div class="sec-head">
      <h2 class="h2 ruled">Results of a run</h2>
      <p>Three of the result views, for the same analyser.</p>
    </div>
    <div class="rb-figs">
${RB_FIGS.map(([f, t, c]) => `      <figure class="figcard"><img src="img/fig/${f}.webp" alt="${esc(t)}" loading="lazy"><figcaption><b>${esc(t)}.</b> ${esc(c)}</figcaption></figure>`).join('\n')}
    </div>
  </div>
</section>
<section class="sec">
  <div class="wrap about">
    <div class="just">
      <h2 class="h2 ruled">Implementation and availability</h2>
      <p>RowlandBench is written in Python, with a Qt interface (PySide6), plots in Matplotlib and a three-dimensional view in PyVista. Crystal data come from xraylib, the reflectivity of bent crystals from the Takagi–Taupin solver pyTTE, <span class="nw">X-ray</span> tube spectra from SpekPy. Its results are compared with published measurements and calculations for strip-bent, diced and asymmetric spherically bent analysers.</p>
      <p>The program is distributed as an installer for 64-bit Windows, under a free academic licence for universities and public research institutions. The article that describes it is in preparation.</p>
      <p class="about-more"><a class="arrow" href="mailto:${CONTACT}?subject=RowlandBench">Ask for RowlandBench</a></p>
    </div>
    <dl class="factsheet" aria-label="RowlandBench data">
      <dt>Author</dt><dd>Andrea Mazzolari, University of Ferrara and INFN Ferrara</dd>
      <dt>Language</dt><dd>Python, Qt 6 interface</dd>
      <dt>Platform</dt><dd>Windows, 64 bit</dd>
      <dt>Licence</dt><dd>free academic licence</dd>
      <dt>Reference</dt><dd>article in preparation</dd>
    </dl>
  </div>
</section>`);

// ---------------------------------------------------------------- team
page('team.html', 'Team · Crystal BOND', 'The four INFN units of BOND, its people, work-package leaders and the institutions that support the project.', `
${pHead('Team', 'Consortium and people', 'Physicists, engineers and technicians of four INFN units, with the universities of Ferrara, Padova and Trieste.', 'hero-cleanroom-people.jpg', 'Work in the Ferrara cleanroom')}
<section class="sec">
  <div class="wrap">
    <div class="coord"><span>National coordinator</span><b>Andrea Mazzolari</b><span>INFN and University of Ferrara · <a href="mailto:${CONTACT}">${CONTACT}</a></span></div>
    <div class="units">
${UNITS.map(u => `      <article class="unit" id="${u.id}"><div class="unit-top"><span class="unit-city">${esc(u.city.split(' (')[0])}</span><span class="unit-name">${esc(u.name)}</span></div><p class="unit-role">${esc(u.role)}</p><p class="unit-text">${esc(u.text)}</p><div class="unit-who"><dl><dt>Local coordinator</dt><dd class="lead-name">${esc(u.lead)}</dd><dt>With</dt><dd>${u.people.map(esc).join(', ')}</dd></dl></div></article>`).join('\n')}
    </div>
  </div>
</section>
<section class="sec white">
  <div class="wrap">
    <div class="sec-head">
      <h2 class="h2 ruled">Work-package leaders</h2>
      <p><a class="arrow" href="project.html">The work packages in detail</a></p>
    </div>
    <div class="table-wrap"><table class="spec-table" style="min-width:560px">
      <thead><tr><th scope="col">WP</th><th scope="col">Topic</th><th scope="col">Leader</th><th scope="col">Unit</th></tr></thead>
      <tbody>
${WPS.map(([n, t, lead, unit]) => `        <tr><th scope="row">${n}</th><td>${esc(t)}</td><td><b>${esc(lead)}</b></td><td>${esc(unit)}</td></tr>`).join('\n')}
      </tbody>
    </table></div>
  </div>
</section>
<section class="sec">
  <div class="wrap">
    <div class="sec-head">
      <h2 class="h2 ruled">Supporting institutions</h2>
      <p>Laboratories, universities and a company that wrote in support of the project and are interested in its crystals.</p>
    </div>
    <ul class="supp">
${SUPPORT.map(([logo, name, city, text]) => `      <li><div class="logo">${logo ? `<img src="img/logos/${logo}" alt="" loading="lazy">` : `<span class="wordmark">${esc(name)}</span>`}</div><h3>${esc(name)} <span>· ${esc(city)}</span></h3><p>${esc(text)}</p></li>`).join('\n')}
    </ul>
  </div>
</section>`);

console.log('built', fs.readdirSync(ROOT).filter(f => f.endsWith('.html')).join(' '));
