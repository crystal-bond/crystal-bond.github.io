// Local preview server: node src/serve.js (bond-web)  ->  http://localhost:8767
// Missing files get 404.html with status 404, as the real host should do. Byte ranges are served, as a film needs them to loop.
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const T = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2', '.mp4': 'video/mp4' };
http.createServer((q, r) => {
  let p = decodeURIComponent(q.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, path.normalize(p));
  if (!f.startsWith(ROOT)) { r.writeHead(403); return r.end(); }
  fs.readFile(f, (e, d) => {
    if (e) return fs.readFile(path.join(ROOT, '404.html'), (e2, nf) => { r.writeHead(404, { 'Content-Type': T['.html'] }); r.end(e2 ? 'not found' : nf); });
    const type = T[path.extname(f)] || 'application/octet-stream';
    const m = /^bytes=(\d*)-(\d*)$/.exec(q.headers.range || '');
    if (m && (m[1] || m[2])) {
      const a = m[1] ? +m[1] : Math.max(0, d.length - +m[2]), b = m[1] && m[2] ? Math.min(+m[2], d.length - 1) : d.length - 1;
      if (a > b || a >= d.length) { r.writeHead(416, { 'Content-Range': `bytes */${d.length}` }); return r.end(); }
      r.writeHead(206, { 'Content-Type': type, 'Content-Length': b - a + 1, 'Content-Range': `bytes ${a}-${b}/${d.length}`, 'Accept-Ranges': 'bytes' });
      return r.end(d.subarray(a, b + 1));
    }
    r.writeHead(200, { 'Content-Type': type, 'Content-Length': d.length, 'Accept-Ranges': 'bytes' }); r.end(d);
  });
}).listen(8767, '127.0.0.1', () => console.log('http://localhost:8767'));
