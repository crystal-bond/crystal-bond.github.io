// Crystal BOND: navigation state, phone menu, reveal on scroll, the bonding animation of the home page.
(function () {
  // "Skip to content" moves focus to the main content in place (on the 404 page a <base> would otherwise send it home)
  var skip = document.querySelector('.skip');
  var main = document.getElementById('main');
  if (skip && main) skip.addEventListener('click', function (e) {
    e.preventDefault(); main.setAttribute('tabindex', '-1'); main.focus(); main.scrollIntoView();
  });

  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('solid', window.scrollY > 24); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    var btn = nav.querySelector('.menu-btn');
    var icons = {
      open: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
      close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
    };
    var setMenu = function (open) {
      nav.classList.toggle('open', open);
      if (!btn) return;
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
      btn.innerHTML = open ? icons.close : icons.open;
    };
    if (btn) btn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
    // Escape closes the phone menu and hands focus back to its button; choosing a link or tapping outside closes it too
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); if (btn) btn.focus(); }
    });
    // a tap on the icon replaces it (menu ↔ close), so a target no longer in the page counts as inside
    document.addEventListener('click', function (e) { if (nav.classList.contains('open') && e.target.isConnected && !nav.contains(e.target)) { e.preventDefault(); e.stopPropagation(); setMenu(false); } }, true);
    [].forEach.call(nav.querySelectorAll('.nav-links a'), function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    // while it is open, Tab cycles through the menu button and the links
    nav.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !btn || !nav.classList.contains('open')) return;
      var f = [btn].concat([].slice.call(nav.querySelectorAll('.nav-links a[href]')));
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  // Home carousel: crossfade every 6 s, dots, pause; stops when reduced motion is requested.

  // sections fade in once as they reach the viewport
  var rv = [].slice.call(document.querySelectorAll('.reveal'));
  if (rv.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add('in'); });

  // home: the bonding animation runs once on load (the static drawing is its last frame), and again on request
  var anim = document.querySelector('.bond-anim');
  if (anim) {
    var run = function () { [].forEach.call(anim.querySelectorAll('animate'), function (a) { if (a.beginElement) a.beginElement(); }); };
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) run();
    anim.classList.add('play');
    var replay = anim.querySelector('.bond-replay');
    if (replay) replay.addEventListener('click', run);
  }
})();

// Home: a light field of slowly drifting points joined by thin lines, behind the title in the black band. The canvas is
// made here, so the page is unchanged without scripts; with reduced motion it is one still frame; it stops while the
// header is off screen or the tab is hidden.
(function () {
  var hero = document.querySelector('.i-hero');
  if (!hero || !window.requestAnimationFrame) return;
  var cv = document.createElement('canvas'), ctx = cv.getContext && cv.getContext('2d');
  if (!ctx) return;
  cv.className = 'dust'; cv.setAttribute('aria-hidden', 'true'); hero.insertBefore(cv, hero.firstChild);
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var W = 0, H = 0, pts = [], LINK = 130, raf = 0, last = 0, seen = true;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = 1;
    for (var i = 0; i < pts.length; i++) for (var j = i + 1; j < pts.length; j++) {
      var dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.sqrt(dx * dx + dy * dy);
      if (d >= LINK) continue;
      ctx.strokeStyle = 'rgba(255,255,255,' + (0.24 * (1 - d / LINK)).toFixed(3) + ')';
      ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
    }
    pts.forEach(function (p) {
      ctx.fillStyle = p.red ? 'rgba(200,16,46,.9)' : 'rgba(255,255,255,.36)';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
    });
  }
  function size() {
    var r = cv.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
    if (!r.width || !r.height) return;
    W = r.width; H = r.height; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.max(14, Math.min(56, Math.round(W * H / 13000)));
    while (pts.length < n) {
      var a = Math.random() * 6.2832, v = 5 + 7 * Math.random(), k = pts.length;
      pts.push({ x: Math.random() * W, y: Math.random() * H, vx: v * Math.cos(a), vy: v * Math.sin(a), r: 1.1 + 0.8 * Math.random(), red: k % 12 === 5 });
    }
    pts.length = n;
    pts.forEach(function (p) { p.x = Math.min(p.x, W); p.y = Math.min(p.y, H); });
    draw();
  }
  function step(t) {
    var dt = Math.min(0.05, (t - last) / 1000 || 0); last = t;
    pts.forEach(function (p) {
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.x < 0 || p.x > W) { p.vx = -p.vx; p.x = Math.max(0, Math.min(W, p.x)); }
      if (p.y < 0 || p.y > H) { p.vy = -p.vy; p.y = Math.max(0, Math.min(H, p.y)); }
    });
    draw();
    raf = requestAnimationFrame(step);
  }
  function run() {
    cancelAnimationFrame(raf); raf = 0;
    if (!still && seen && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(step); }
  }
  size();
  if ('ResizeObserver' in window) new ResizeObserver(size).observe(cv); else window.addEventListener('resize', size);
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { seen = es[es.length - 1].isIntersecting; run(); }).observe(hero);
  document.addEventListener('visibilitychange', run);
  run();
})();

// Anonymous visit statistics, no cookies: beacons to the site's own counter (address in <html data-counter>, set by
// src/build.js). One per page load, one per click on a contact link, one when the page is left (active seconds, deepest
// scroll). Sent only from the published site and its copy on the INFN GitLab; the statistics are read in stats.html.
(function () {
  var base = document.documentElement.getAttribute('data-counter');
  if (!base || ['crystal-bond.github.io', 'bond.baltig-pages.infn.it'].indexOf(location.hostname) < 0 || navigator.webdriver) return;
  // the owner's browser is left out: the flag is set by the statistics page once the key has been accepted
  try { if (localStorage.getItem('bond-no-count') === '1') return; } catch (e) {}
  var send = function (data) {
    var payload = JSON.stringify(data);
    try { if (navigator.sendBeacon && navigator.sendBeacon(base + '/hit', payload)) return; } catch (e) {}
    try { fetch(base + '/hit', { method: 'POST', body: payload, keepalive: true, credentials: 'omit' }).catch(function () {}); } catch (e) {}
  };
  if (/stats\.html$/.test(location.pathname)) return;
  send({ t: 'view', p: location.pathname, r: document.referrer || '' });
  [].forEach.call(document.querySelectorAll('a[href^="mailto:"]'), function (a) {
    a.addEventListener('click', function () { send({ t: 'event', e: /RowlandBench/.test(a.getAttribute('href')) ? 'ask_rowlandbench' : 'mail_contact' }); });
  });
  var since = document.visibilityState === 'visible' ? Date.now() : 0, activeMs = 0, depth = 0, sent = false;
  var measure = function () { var d = document.documentElement, h = d.scrollHeight - innerHeight; depth = Math.max(depth, h > 0 ? Math.round(100 * scrollY / h) : 100); };
  addEventListener('scroll', measure, { passive: true }); measure();
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') { since = Date.now(); return; }
    if (since) { activeMs += Date.now() - since; since = 0; }
    if (!sent) { sent = true; send({ t: 'engagement', s: Math.round(activeMs / 1000), d: Math.min(100, depth) }); }
  });
})();
