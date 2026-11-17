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

// Anonymous visit counter: GoatCounter (no cookies, no personal data), one hit per page view, sent by this code rather
// than GoatCounter's script, as on the Crystal Lab site. Only the published site counts, not local previews.
// Statistics: https://<COUNTER>.goatcounter.com
(function () {
  var COUNTER = 'crystal-bond';
  if (location.hostname !== 'crystal-bond.github.io' || navigator.webdriver) return;
  var url = 'https://' + COUNTER + '.goatcounter.com/count' +
    '?p=' + encodeURIComponent(location.pathname + location.search) +
    '&t=' + encodeURIComponent(document.title) +
    '&r=' + encodeURIComponent(document.referrer) +
    '&s=' + [screen.width, screen.height, window.devicePixelRatio || 1].join(',') +
    '&rnd=' + Math.random().toString(36).slice(2);
  if (!(navigator.sendBeacon && navigator.sendBeacon(url))) new Image().src = url;
})();
