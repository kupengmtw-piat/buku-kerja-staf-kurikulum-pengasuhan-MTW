// Service worker kecil: menyimpan "kulit" aplikasi (halaman pembuka & ikon) supaya bisa dipasang
// dan tetap terbuka cepat. Isi Buku Kerja sendiri selalu diambil langsung dari Google (tidak di-cache).
const CACHE = 'buku-kerja-v4';
const KULIT = ['./', 'index.html', 'manifest.webmanifest', 'ikon-toska-192.png', 'ikon-toska-512.png', 'ikon-toska-180.png', 'ikon-toska-48.png', 'tajawal-regular.woff2'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(KULIT)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;   // Buku Kerja (Google) tidak disentuh
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
});
