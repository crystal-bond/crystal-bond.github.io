// Content of the BOND site: devices, units, work packages, milestones, supporters, results.
// Sources: CALL CSNV 2024 proposal "Crystal BOND", activity report "Consuntivi BOND 2025", lab notes 2026 on Drive.
// The four assemblies of the proposal (Table 1)
const DEVICES = [
  { id: 'steer', code: 'A1', name: 'Bent crystals for the LHC', short: 'Silicon crystals bonded to figured substrates, to deflect TeV beams by several milliradians.',
    photo: 'abc-cern.jpg', alt: 'The first anodically bonded crystal made in Ferrara for CERN: silicon on a glass substrate figured to a cylinder of 5.2 m radius', fig: 'assembly', wp: 'WP2',
    caption: 'Left, the mechanical holder: the crystal lies across a U-shaped base and is clamped along its two long edges by two bars with screws. Right, the same crystal bonded to a figured substrate. The beam runs along the crystal. Curvature exaggerated on the right; in the holder it is too small to be seen.',
    text: [
      '<p>A bent crystal steers positive particles that enter it nearly parallel to its atomic planes: they are trapped between the planes (<b>planar channeling</b>) and follow their curvature. Silicon crystals made in Ferrara have collimated the LHC beams since 2023. Deflecting TeV beams by <b>several milliradians</b>, instead of the tens of microradians used for collimation, would open fixed-target experiments at the LHC, such as measuring the magnetic and electric dipole moments of short-lived charmed and strange baryons.</p>',
      '<p>Large angles need long, thick crystals with a very uniform curvature. Today crystals are bent by metal holders: the curvature is hard to control, clamps twist the crystal, and the heavy holder burdens the goniometers that align it to the beam and adds impedance to the machine.</p>',
      '<p>In BOND the crystal, 2 to 5 mm thick, is <b>anodically bonded</b> to a substrate machined to a radius of about 10 m, in glass, Grade 5 titanium or 316LN steel, materials suited to the LHC vacuum. Anodic bonding is routine for thin wafers in microelectronics; here it has to work on crystals ten times thicker, with a miscut below 100 µrad and much tighter control of the shape.</p>',
      '<p>A first <b>anodically bonded crystal</b> has already been to CERN: silicon bonded to a glass substrate figured to a cylinder of 5.2 m radius, tested on the H8 beamline of the SPS for the TWOCRYST study. Its curvature along the beam is considerably more uniform than that of a crystal clamped in a holder.</p>',
    ],
    specs: [['Material', 'Silicon (110), dislocation-free'], ['Size', 'about 70 × 20 × 3 mm'], ['Bending radius', 'about 10 m, convex'], ['Miscut', '< 100 µrad'], ['Goal', 'two crystals ready for the LHC']] },
  { id: 'analyse', code: 'A2.1', name: 'Bent crystal analysers', short: 'Spherical analysers in quartz, lithium niobate and germanium for high-resolution X-ray spectroscopy.',
    photo: 'quartz-analyser.jpg', alt: 'Quartz crystals bonded on a glass spherical cap: the first BOND analyser prototype', fig: 'analyzer', wp: 'WP3, WP4',
    caption: 'After a monochromator and a focusing optic, the X-rays reach the sample. The crystal, bonded on a spherical substrate, reflects one energy of the scattered radiation and focuses it on the detector. Sample, crystal and detector lie on the Rowland circle; the crystal is bent to twice its radius.',
    text: [
      '<p>Resonant inelastic X-ray scattering, X-ray Raman and emission spectroscopy measure small energy changes of photons scattered by a sample. A <b>bent crystal analyser</b> selects the energy by Bragg diffraction, 2d sin θ<sub>B</sub> = λ, and focuses the photons on the detector from its whole surface. Its resolution follows ΔE/E = cot θ<sub>B</sub> · Δθ: every shape error of the crystal widens Δθ.</p>',
      '<p>Analysers are mostly silicon wafers bonded to glass. Silicon limits the photon energy, the reflectivity and the angles available close to backscattering. <b>Quartz, lithium niobate and germanium</b> do better, but are hard to machine and today are glued, which leaves shape errors that spoil their advantage.</p>',
      '<p>BOND bonds these crystals, 0.2 to 0.5 mm thick, to substrates figured as spherical or cylindrical concave surfaces with radii from 0.1 to 1 m, aiming at an energy resolution around 10 meV. Two spherical samples are planned for each material.</p>',
    ],
    specs: [['Materials', 'quartz, lithium niobate, germanium'], ['Shape', 'spherical or cylindrical, concave, Ø ≈ 100 mm'], ['Radius', '0.1–1 m'], ['Geometry', 'Bragg (reflection)'], ['Goal', '≈ 10 meV resolution']] },
  { id: 'image', code: 'A2.2', name: 'Crystals for spectral imaging', short: 'Cylindrically bent Laue crystals that spread a synchrotron beam by energy, for K-edge imaging.',
    photo: 'xrd-stage.jpg', alt: 'A crystal on the stage of the X-ray diffractometer', fig: 'spectral', wp: 'WP4',
    caption: 'A crystal plate bent to a cylinder, bonded on a substrate with an opening for the beam, diffracts each energy of a polychromatic beam at a different height and sends them all to a common focus, where the sample sits; past it the energies are sorted along the detector. Inset: across the thickness of the plate the diffracting planes are curved too, the quasi-mosaic effect. Angles exaggerated.',
    text: [
      '<p>In <b>spectral K-edge subtraction imaging</b> a thin crystal bent to a cylinder diffracts a polychromatic synchrotron beam in Laue geometry. Each part of the crystal sends a slightly different energy to a common focus, where the sample sits; behind it the energies spread out across an area detector. Images just below and just above the absorption edge of a contrast agent separate it from soft tissue and bone.</p>',
      '<p>Small bending radii, below 30 cm, widen the energy band enough to use several edges at once, such as iodine (33.17 keV), xenon (34.56 keV) and barium (37.44 keV), and to try gadolinium (50.2 keV) and gold nanoparticles (80.7 keV). Today the crystals are bent by mechanical, motorised benders that correct torsion and anticlastic bending: bulky, and never quite exact.</p>',
      '<p>Bonded to a substrate with an opening for the beam, the crystal keeps a clean cylindrical shape without torsion. The Trieste unit has simulated the optimum: silicon (110) with an asymmetry towards (1-11), for 15–40 keV. Tests are planned at Elettra (SYRMEP), the Canadian Light Source and ESRF.</p>',
    ],
    specs: [['Materials', 'silicon, germanium'], ['Shape', 'cylindrical, concave, open for the beam'], ['Radius', '0.1–0.5 m'], ['Geometry', 'Laue (transmission)'], ['Goal', 'two crystals in Si, two in Ge']] },
  { id: 'focus', code: 'A3', name: 'Building blocks for Laue lenses', short: 'Rows of aligned bent tiles that focus hard X-rays and γ rays above 100 keV.',
    photo: 'interf-lens.jpg', alt: 'A crystal lens lit for interferometry', fig: 'laue', wp: 'WP3, WP4',
    caption: 'A building block of a Laue lens: bent tiles bonded side by side on one figured substrate. The γ rays from a distant source cross the tiles, and each tile diffracts them onto the common focus.',
    text: [
      '<p>Above 100 keV no mirror can focus photons, and γ-ray telescopes still rely on collimators and coded masks, with limited sensitivity. A <b>Laue lens</b> focuses them by diffraction in many crystals arranged on concentric rings; a focusing lens would let us study, for example, the nuclear lines of radioisotopes made in Type Ia supernovae.</p>',
      '<p>Curved crystals diffract a wider band and with higher efficiency than flat ones, but every tile must have the same curvature and be aligned with its neighbours to a few tens of microradians.</p>',
      '<p>BOND bonds about ten tiles, 30 × 20 × 2 mm each, onto one substrate figured to a radius of 20 m, all aligned within 50 µrad: a demonstrator of the building block of a lens for future space missions. The miscut of the silicon and germanium wafers is made uniform beforehand.</p>',
    ],
    specs: [['Materials', 'silicon, germanium'], ['Tiles', 'about 10, each 30 × 20 × 2 mm'], ['Radius', '20 m, convex'], ['Alignment', 'within 50 µrad'], ['Energy', '> 100 keV']] },
];

const UNITS = [
  { id: 'fe', name: 'INFN Ferrara', city: 'Ferrara', role: 'Coordination, crystal shaping, bonding and metrology',
    text: 'The Ferrara group makes crystals for channeling, X-ray and γ-ray optics in a 130 m² cleanroom; its bent silicon crystals collimate the LHC beams. It buys and runs the bonding equipment, prepares the crystals and characterises the bent assemblies.',
    lead: 'Andrea Mazzolari', people: ['Vincenzo Guidi', 'Piero Rosati', 'Francesco Mollica', 'Lorenzo Malagutti', 'Marco Romagnoni', 'Melissa Tamisari', 'Lisa Ferro', 'Arianna Rossi', 'Muhammad Hamza'] },
  { id: 'lnl', name: 'INFN Laboratori Nazionali di Legnaro', city: 'Legnaro (Padova)', role: 'FEM design, thin films, interface analysis',
    text: 'Semiconductor microfabrication, especially germanium, with the Physics and Astronomy Department of the University of Padova. Sputtering and e-beam deposition of the films for thermo-compression bonding, Rutherford backscattering, SEM and a new ion mill for cross-sections of the bonded interface; finite-element models of bonded crystals.',
    lead: 'Davide De Salvador', people: ['Enrico Napolitani', 'Francesco Sgarbossa', 'Enrico Di Russo', 'Stefano Bertoldo', 'Davide Valzani', 'Sara Carturan', 'Gianluigi Maggioni'] },
  { id: 'ts', name: 'INFN Trieste', city: 'Trieste', role: 'Synchrotron tests and spectral imaging',
    text: 'Phase-contrast and spectral imaging with synchrotron light since 1997, mainly at the SYRMEP beamline of Elettra and the INFN PEPI lab. It designs the Laue crystals for imaging, the alignment mechanics and the phantoms, and runs the beam tests.',
    lead: 'Fulvia Arfelli', people: ['Ralf Hendrik Menk', 'Luigi Rigon', 'Luca Brombal', 'Luca Sbuelz'] },
  { id: 'lnf', name: 'INFN Laboratori Nazionali di Frascati', city: 'Frascati (Roma)', role: 'Crystal design, X-ray optics and tomography',
    text: 'Channeling of beams and radiation and X-ray optics at the XlabF laboratory, with its polycapillary optics unit. It leads the design of crystals and substrates and characterises crystals by X-ray computed tomography.',
    lead: 'Sultan Dabagov', people: ['Dariush Hampai', 'Augusto Marcelli', 'Zeinab Ebrahimpour', 'Alessandro Curcio', 'Florin Sirghi', 'Alessandro Scordo'] },
];

const WPS = [
  ['WP1', 'Design of crystals and substrates', 'Sultan Dabagov', 'LNF', ['Crystal design for each application (Fe, LNF, TS)', 'FEM-assisted design of the substrates (LNL, Fe)', 'Software for imaging simulation and spectral analysis (TS)']],
  ['WP2', 'Crystal assemblies for particle beam steering', 'Andrea Mazzolari', 'Ferrara', ['Incoming silicon wafers and miscut reduction', 'Shaping, bending and bonding', 'Characterisation in the lab and with synchrotron light', 'Stress tests']],
  ['WP3', 'Crystal assemblies for X-ray concentrators', 'Davide De Salvador', 'LNL', ['Quality of incoming crystals, uniform miscut for Laue tiles', 'Films for thermo-compression bonding and their characterisation', 'Shaping, bending and bonding of A2 and A3']],
  ['WP4', 'Verification of bonded crystals for X-ray applications', 'Fulvia Arfelli', 'Trieste', ['Characterisation with synchrotron light', 'Focusing tests of Laue-lens building blocks', 'Mechanics and phantoms; spectral imaging with bonded crystals']],
  ['WP5', 'Management and dissemination', 'Andrea Mazzolari', 'Ferrara', ['Procurement of the bonding equipment', 'Workshops and conferences (LNF)', 'Risk management, publications, contacts with industry']],
];

// milestones and deliverables of the proposal; month 1 = January 2025. Status only where the 2025 report states it.
const month = m => new Date(Date.UTC(2025, m - 1, 1)).toLocaleString('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' });
const MILESTONES = [
  ['—', 'Silicon wafers for LHC applications acquired', 6, 'done', 'Completed in 2025, with magnetorheological polishing of the miscut.'],
  ['M1.1', 'Design of crystals and figured substrates', 11, 'done', 'FEM-assisted design of the substrates completed in December 2025.'],
  ['M5.1', 'Bonding equipment acquired and set up', 12, 'part', 'Tender completed in February 2026 (75% at the end of 2025).'],
  ['M3.1', 'Wafers with uniform miscut angle', 14, '', ''],
  ['D1.1', 'Software for imaging simulation, acquisition and spectral analysis', 18, '', ''],
  ['M2.1', 'Geometry of the shaped crystals', 20, '', ''],
  ['M2.2', 'Prototype bent crystals for the LHC', 24, '', ''],
  ['M3.2', 'Recipe for films for thermo-compression bonding', 24, '', ''],
  ['M3.3', 'Lab characterisation of the X-ray crystals', 32, '', ''],
  ['D4.1', 'Bent crystal analysers for X-ray applications', 32, '', ''],
  ['D2.1', 'Bent silicon crystals ready for the LHC', 36, '', ''],
  ['D3.2', 'Synchrotron tests of the crystals', 36, '', ''],
  ['D4.2', 'Building blocks for Laue lenses', 36, '', ''],
  ['D4.3', 'Crystals for spectral imaging', 36, '', ''],
];
const STATUS = { done: 'Done', part: 'In progress', '': 'Planned' };

const SUPPORT = [
  ['cern.png', 'CERN', 'Geneva', 'The TWOCRYST study at the LHC: bent crystals that deflect TeV beams for fixed-target and dipole-moment experiments.'],
  ['esrf.png', 'ESRF', 'Grenoble', 'The crystal and crystal-analyser laboratories, makers of bonded silicon analysers, on new materials for analysers.'],
  ['xfel.png', 'European XFEL', 'Schenefeld', 'Optics for imaging and beam steering at X-ray free-electron lasers.'],
  ['elettra.jpg', 'Elettra Sincrotrone Trieste', 'Trieste', 'The optics group; synchrotron tests at the SYRMEP beamline.'],
  ['inaf.png', 'INAF', 'Italy', 'Hard X-ray and γ-ray astronomy: Laue lenses for future missions.'],
  [null, 'Lund University', 'Lund', 'Efficient focusing optics for low-energy X-rays, for faster X-ray imaging.'],
  [null, 'University of Saskatchewan', 'Saskatoon', 'Bent Laue crystals for spectral and phase-contrast imaging at the Canadian Light Source.'],
  [null, 'University of Trieste', 'Trieste', 'Astroparticle physics and γ-ray astronomy.'],
  [null, 'CINEL Strumenti Scientifici', 'Vigonza (Padova)', 'Synchrotron instrumentation: a route from prototypes to beamlines worldwide.'],
];
// 2026: lab notes on Drive by L. Malagutti (BOND_Si111_R1000_P1 / _R1 folders, "Perminex", "06-07-2026 Aluminum Lens & Si 111")
const P2026 = [
  ['si111-glass-r1m.jpg', 'Cylindrical Si(111) crystals, R = 1 m', 'Two silicon (111) crystals, 0.3 mm thick, bonded on cylindrical substrates of 1 m radius: one on glass (72 × 24 mm), one on aluminium (70 × 30 mm). X-ray diffraction confirmed the orientation, a (111) surface with (110) and (211) edges, with rocking curves of the (111) and (333) reflections and of the asymmetric (331), (422) and (440). Both are prepared for X-ray deflection tests at the SOLEIL synchrotron.', 'A silicon (111) crystal bonded on a cylindrical glass substrate of 1 m radius'],
  ['si111-alu-r1m.jpg', 'Silicon on a metal substrate', 'An aluminium substrate machined to a 1 m radius carries the second crystal. Both surfaces are cleaned with a peelable polymer film that lifts the dust, an epoxy film (Araldite 2020) is spin-coated on the substrate, and the crystal is pressed on it at 2 bar under vacuum for 24 hours, then checked on the interferometric microscope.', 'A silicon (111) crystal bonded on an aluminium substrate of 1 m radius'],
  [null, 'A bonding polymer instead of glue', 'PermiNex 1005, a photo-patternable bonding polymer, is spin-coated to about 7 µm, soft-baked, exposed to UV and bonded hot under pressure; the glass-substrate crystal was made this way. UV activation of the wafer lowered the edge bead from 13 to 9 µm. The remaining edge effect points to bonding where the polymer starts to flow, around 60–70 °C, and to working in the cleanroom to avoid trapped dust.', ''],
  [null, 'Whole wafers in spherical lenses', 'The next step is a Ø 100 mm silicon wafer bonded into a concave glass lens of 0.5 m radius with a UV-curing adhesive. Models of the stress in the wafer and in the adhesive set the pressing pressure, about 1.5–2 bar, and how large a trapped void may be; a manual membrane press with a 365 nm LED source below the lens has been designed for this step.', ''],
];
const P2025 = [
  ['Ferrara', [
    ['quartz-analyser.jpg', 'First analysers in quartz and lithium niobate', 'Quartz and lithium niobate crystals bonded with thin epoxy films onto glass spherical caps of 1 m radius. At the ESRF BM20 beamline the quartz (006) prototype gave an energy resolution of 1.4 eV FWHM, comparable to a silicon (111) analyser: a first attempt, and a very encouraging one. The lithium niobate analyser was scheduled for ESRF next.', 'Quartz crystals bonded on a glass spherical cap, R = 1 m'],
    ['fig:esrf-quartz', 'The spectrum behind the 1.4 eV', 'The line measured with the quartz analyser prototype at ESRF BM20, around 6.94 keV.', 'Spectrum measured with the quartz analyser at ESRF BM20: FWHM 1.4 eV'],
    ['demo-bonded.jpg', 'Bonding on a curved substrate, demonstrated', 'During the tender, makers ran demonstrations on our geometries: a silicon crystal bonded to a cylindrical glass substrate of 500 mm radius. The tender closed in February 2026 with SUSS MicroTec.', 'A silicon crystal bonded to a cylindrical glass substrate, R = 500 mm (maker demonstration)'],
    ['epoxy-dewetting.jpg', 'From droplets to a 2 µm film', 'Spin-coated epoxy first broke into droplets seconds after spinning. Six adhesives and a systematic study of the spin parameters and of surface activation later, Epotek 301 gave 2 µm films uniform within 150 nm.', 'Left of the study: an epoxy film that dewetted into droplets'],
    ['linbo3-cubes.jpg', 'Dicing quartz and lithium niobate', 'A process recipe for materials that wear the diamond blade fast, found by varying blade speed, feed, depth, coolant flow and tape.', 'Lithium niobate cut into 3 mm cubes'],
    ['diced-wafer.jpg', 'Silicon wafers for the LHC', 'Ø 100 mm, 2 and 5 mm thick, (110), intrinsic, dislocation-free, polished on both sides, with an off-axis angle specified at 0.02°: far from standard stock. Magnetorheological polishing brings the miscut below 100 µrad.', 'A diced silicon wafer'],
  ]],
  ['Legnaro', [
    ['fig:fem-bilayer', 'Models of a crystal bonded to glass', 'FEM simulations of silicon bonded to glass at high temperature and cooled, and an analytical model that extends the classical bilayer to anisotropic crystals. They agree for Hoya SD2 and Borofloat 33 glass and for 2 and 3 mm crystals.', 'FEM model of a silicon crystal bonded to glass: mesh and deformation after cooling'],
    ['fig:fem-transient', 'Laying a thin crystal on a cylinder', 'Transient FEM of a 200 µm silicon layer bent onto a cylinder of 0.2 m radius: stress concentrates in the lamella at first contact, a guide for the substrate geometry and the mounting sequence.', 'Von Mises stress in a 200 µm silicon layer bent onto a 0.2 m cylinder'],
    ['sem-interface.jpg', 'A look at the interface', 'SEM images of a bonded Si/glass sample show a very flat interface and a band about 350 nm wide, probably SiO₂ formed during anodic bonding. The new ion mill will open cross-sections on our own samples.', 'SEM image of a silicon–glass interface, with a 350 nm band'],
  ]],
  ['Trieste', [
    [null, 'Crystals designed for imaging', 'A simulation tool for bent Laue crystals in biomedical imaging: silicon (110) with a 20° asymmetry towards (1-11) gives the wide band needed for multiple K-edge imaging between 15 and 40 keV. Motorised goniometers, test objects and contrast-agent phantoms were bought for the Elettra beamtimes.', ''],
  ]],
  ['Frascati', [
    [null, 'Sharper X-ray tomography', 'Two high-precision linear stages from Physik Instrumente upgrade the CT setup: better positioning gives higher resolution and reproducibility, enough to resolve phases, defects and inclusions in the crystals.', ''],
  ]],
];

// bending radius of each assembly, in metres (proposal, Table 1), for the radius scale on the home page
const RADIUS = { steer: { at: 10, label: '≈ 10 m' }, analyse: { from: 0.1, to: 1, label: '0.1–1 m' }, image: { from: 0.1, to: 0.5, label: '0.1–0.5 m' }, focus: { at: 20, label: '20 m' } };

module.exports = { DEVICES, UNITS, WPS, month, MILESTONES, STATUS, SUPPORT, P2026, P2025, RADIUS };
