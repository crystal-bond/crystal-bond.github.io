// Local preview server: node src/serve.js (bond-web)  ->  http://localhost:8767
// Missing files get 404.html with status 404, as the real host should do.
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const T = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2' };
http.createServer((q, r) => {
  let p = decodeURIComponent(q.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, path.normalize(p));
  if (!f.startsWith(ROOT)) { r.writeHead(403); return r.end(); }
  fs.readFile(f, (e, d) => {
    if (e) return fs.readFile(path.join(ROOT, '404.html'), (e2, nf) => { r.writeHead(404, { 'Content-Type': T['.html'] }); r.end(e2 ? 'not found' : nf); });
    r.writeHead(200, { 'Content-Type': T[path.extname(f)] || 'application/octet-stream', 'Content-Length': d.length }); r.end(d);
  });
}).listen(8767, '127.0.0.1', () => console.log('http://localhost:8767'));
