// Statistics page of the BOND site: reads the aggregated counts from the site's own counter (a Cloudflare Worker,
// address in <html data-counter>) with a private key typed once and kept in this browser only.
(function () {
  var root = document.getElementById('stats'), base = document.documentElement.getAttribute('data-counter') || '';
  if (!root) return;
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) base = 'http://127.0.0.1:8788';
  var el = function (tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  var fmt = function (n) { return Number(n || 0).toLocaleString('en-GB'); };
  var key = ''; try { key = localStorage.getItem('bond-stats-key') || ''; } catch (e) {}
  var note = function (msg) { root.textContent = ''; root.appendChild(el('p', 'stats-note', msg)); };

  function gate(message) {
    root.textContent = '';
    var f = el('form', 'stats-gate'), l = el('label', '', 'Key of the statistics'), i = el('input'), b = el('button', 'btn btn-fill', 'Show');
    i.type = 'password'; i.autocomplete = 'off'; i.required = true; i.id = 'stats-key'; l.htmlFor = 'stats-key'; b.type = 'submit';
    f.appendChild(l); f.appendChild(i); f.appendChild(b);
    if (message) f.appendChild(el('p', 'stats-note', message));
    f.addEventListener('submit', function (ev) { ev.preventDefault(); key = i.value.trim(); try { localStorage.setItem('bond-stats-key', key); } catch (e) {} load(); });
    root.appendChild(f); i.focus();
  }

  function load() {
    if (!base) return note('The counter is not connected yet.');
    if (!key) return gate();
    note('Loading…');
    fetch(base + '/stats?days=90&key=' + encodeURIComponent(key)).then(function (r) {
      if (r.status === 403) { key = ''; try { localStorage.removeItem('bond-stats-key'); } catch (e) {} gate('That key is not the right one.'); return null; }
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).then(function (d) { if (d) render(d); }).catch(function () { note('The counter does not answer. Try again later.'); });
  }

  var sum = function (series, n, field) { return series.slice(-n).reduce(function (a, d) { return a + d[field]; }, 0); };
  var dayLabel = function (iso) { return new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }); };

  function tiles(d) {
    var box = el('div', 'stats-tiles');
    [[sum(d.series, 7, 'visitors'), 'visitors, last 7 days'], [sum(d.series, 30, 'visitors'), 'visitors, last 30 days'],
     [sum(d.series, 30, 'views'), 'pages viewed, last 30 days'], [d.total.visitors, 'visitors since ' + (d.since ? dayLabel(d.since) : 'the start')]]
      .forEach(function (t) { var c = el('div', 'stats-tile'); c.appendChild(el('b', '', fmt(t[0]))); c.appendChild(el('span', '', t[1])); box.appendChild(c); });
    return box;
  }

  // visitors per day: thin columns on one axis, a tooltip on hover or focus, the same numbers as a table below
  function chart(d) {
    var W = 900, H = 240, L = 40, B = 26, T = 12, n = d.series.length, step = (W - L) / n, bw = Math.max(2, step - 2);
    var max = Math.max(4, Math.max.apply(null, d.series.map(function (x) { return x.visitors; })));
    var nice = [4, 5, 8, 10, 20, 40, 50, 80, 100, 200, 400, 500, 800, 1000, 2000, 4000, 5000, 10000].filter(function (v) { return v >= max; })[0] || max;
    var y = function (v) { return T + (H - T - B) * (1 - v / nice); }, ns = 'http://www.w3.org/2000/svg';
    var s = function (tag, attrs) { var e = document.createElementNS(ns, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); return e; };
    var wrap = el('figure', 'stats-chart'), svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Visitors per day, last ' + n + ' days' });
    [0, nice / 2, nice].forEach(function (v) {
      svg.appendChild(s('line', { x1: L, x2: W, y1: y(v), y2: y(v), class: 'grid' }));
      var t = s('text', { x: L - 8, y: y(v) + 4, 'text-anchor': 'end', class: 'tick' }); t.textContent = fmt(v); svg.appendChild(t);
    });
    var tip = el('div', 'stats-tip'); tip.hidden = true;
    d.series.forEach(function (p, k) {
      var x = L + k * step + 1, h = Math.max(p.visitors ? 2 : 0, H - B - y(p.visitors)), r = Math.min(3, bw / 2, h);
      if (p.day.slice(8) === '01' || k === 0) { var t = s('text', { x: x, y: H - 8, class: 'tick' }); t.textContent = new Date(p.day + 'T00:00:00Z').toLocaleDateString('en-GB', { month: 'short', day: k === 0 && p.day.slice(8) !== '01' ? 'numeric' : undefined, timeZone: 'UTC' }); svg.appendChild(t); }
      var bar = s('path', { class: 'bar', d: 'M' + x + ' ' + (H - B) + 'v' + (-(h - r)) + 'q0 ' + (-r) + ' ' + r + ' ' + (-r) + 'h' + (bw - 2 * r) + 'q' + r + ' 0 ' + r + ' ' + r + 'v' + (h - r) + 'z' });
      if (h) svg.appendChild(bar);
      var hitbox = s('rect', { x: L + k * step, y: T, width: step, height: H - T - B, class: 'hit', tabindex: 0, 'aria-label': dayLabel(p.day) + ': ' + p.visitors + ' visitors, ' + p.views + ' pages' });
      var show = function () { bar.classList.add('on'); tip.hidden = false; tip.textContent = dayLabel(p.day) + ' · ' + fmt(p.visitors) + ' visitors · ' + fmt(p.views) + ' pages'; tip.style.left = Math.min(92, Math.max(8, (L + k * step + step / 2) / W * 100)) + '%'; };
      var hide = function () { bar.classList.remove('on'); tip.hidden = true; };
      hitbox.addEventListener('mouseenter', show); hitbox.addEventListener('focus', show); hitbox.addEventListener('mouseleave', hide); hitbox.addEventListener('blur', hide);
      svg.appendChild(hitbox);
    });
    wrap.appendChild(el('h2', 'stats-h', 'Visitors per day'));
    var plot = el('div', 'stats-plot'); plot.appendChild(svg); plot.appendChild(tip); wrap.appendChild(plot);
    var det = el('details', 'stats-table'), tb = el('table'), su = el('summary', '', 'The same numbers as a table');
    tb.innerHTML = '<thead><tr><th scope="col">Day</th><th scope="col">Visitors</th><th scope="col">Pages viewed</th></tr></thead>';
    var body = el('tbody'); d.series.slice().reverse().forEach(function (p) { var tr = el('tr'); tr.appendChild(el('td', '', dayLabel(p.day))); tr.appendChild(el('td', '', fmt(p.visitors))); tr.appendChild(el('td', '', fmt(p.views))); body.appendChild(tr); });
    tb.appendChild(body); det.appendChild(su); det.appendChild(tb); wrap.appendChild(det);
    return wrap;
  }

  // ranked lists: name, a bar on a common scale, the count
  function ranked(title, unit, items, label) {
    var box = el('section', 'stats-list'); box.appendChild(el('h2', 'stats-h', title));
    if (!items.length) { box.appendChild(el('p', 'stats-note', 'No data yet.')); return box; }
    var max = Math.max.apply(null, items.map(function (i) { return i.count; })), tb = el('table'), body = el('tbody');
    tb.innerHTML = '<thead><tr><th scope="col">' + title + '</th><th scope="col"><span class="vh">Share</span></th><th scope="col">' + unit + '</th></tr></thead>';
    items.forEach(function (i) {
      var tr = el('tr'), bar = el('td', 'b'), fill = el('i'); fill.style.width = Math.max(1, 100 * i.count / max) + '%'; bar.appendChild(fill);
      tr.appendChild(el('th', '', label ? label(i.name) : i.name)).scope = 'row'; tr.appendChild(bar); tr.appendChild(el('td', 'n', fmt(i.count))); body.appendChild(tr);
    });
    tb.appendChild(body); box.appendChild(tb); return box;
  }
  var ordered = function (obj, order) { return order.filter(function (k) { return obj[k]; }).map(function (k) { return { name: k, count: obj[k] }; }); };
  var country = function (code) { try { return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code; } catch (e) { return code; } };
  var pageName = function (p) { return p === '/' || p === '/index.html' ? 'Home' : p.replace(/^\/|\.html$/g, ''); };
  var eventName = function (e) { return { mail_contact: 'Click on a contact email', ask_rowlandbench: 'Click on "Ask for RowlandBench"' }[e] || e; };

  function render(d) {
    root.textContent = '';
    root.appendChild(el('p', 'stats-updated', 'Last 90 days. Read on ' + new Date(d.updated).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) + '. A visitor is counted once a day.'));
    root.appendChild(tiles(d)); root.appendChild(chart(d));
    var grid = el('div', 'stats-grid');
    [ranked('Pages', 'Views', d.pages, pageName), ranked('Institutions and networks', 'Visitors', d.networks), ranked('Countries', 'Visitors', d.countries, country),
     ranked('Coming from', 'Visitors', d.referrers), ranked('Time on the page', 'Pages', ordered(d.time, ['<10s', '10-30s', '30-60s', '1-3min', '3-10min', '>10min'])),
     ranked('How far down the page', 'Pages', ordered(d.scroll, ['<25%', '25%', '50%', '75%', '100%'])), ranked('Clicks', 'Clicks', d.events, eventName),
     ranked('Devices', 'Visitors', d.devices), ranked('Browsers', 'Visitors', d.browsers), ranked('Systems', 'Visitors', d.systems), ranked('Languages', 'Visitors', d.languages)]
      .forEach(function (b) { grid.appendChild(b); });
    root.appendChild(grid);
    // as on the DICEFLOW counter, the owner is not counted: opening this page with the right key marks this browser,
    // and the pages of the site then send no beacons from it; the choice can be reversed here
    var mine = '1'; try { mine = localStorage.getItem('bond-no-count'); if (mine === null) { mine = '1'; localStorage.setItem('bond-no-count', '1'); } } catch (e) {}
    var own = el('p', 'stats-own'), toggle = el('button', 'stats-forget', ''); toggle.type = 'button';
    var paint = function () {
      own.textContent = mine === '1' ? 'Your visits from this browser are not counted. ' : 'Your visits from this browser are counted. ';
      toggle.textContent = mine === '1' ? 'Count them' : 'Do not count them'; own.appendChild(toggle);
    };
    toggle.addEventListener('click', function () { mine = mine === '1' ? '0' : '1'; try { localStorage.setItem('bond-no-count', mine); } catch (e) {} paint(); });
    paint(); root.appendChild(own);
    var out = el('button', 'stats-forget', 'Forget the key on this computer'); out.type = 'button';
    out.addEventListener('click', function () { key = ''; try { localStorage.removeItem('bond-stats-key'); } catch (e) {} gate(); });
    root.appendChild(out);
  }
  load();
})();
