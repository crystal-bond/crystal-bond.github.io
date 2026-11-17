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

// Anonymous visit statistics, no cookies: beacons to the site's own counter (address in <html data-counter>, set by
// src/build.js). One per page load, one per click on a contact link, one when the page is left (active seconds, deepest
// scroll). Sent only from the published site; the statistics are read in stats.html.
(function () {
  var base = document.documentElement.getAttribute('data-counter');
  if (!base || location.hostname !== 'crystal-bond.github.io' || navigator.webdriver) return;
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
