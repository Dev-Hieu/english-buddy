// Service worker tối giản cho English Buddy (PWA installable + offline app-shell).
// Chiến lược: API/pronounce -> network (không cache); điều hướng -> network-first (fallback index đã cache);
// tài nguyên cùng origin (JS/CSS/ảnh hashed) -> cache-first.
const CACHE = "eb-cache-v1";
const APP_SHELL = ["/", "/index.html", "/manifest.webmanifest", "/favicon.svg"];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(APP_SHELL)).catch(() => {}));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // bỏ qua cross-origin (fonts, ảnh Pexels...)
  if (url.pathname.startsWith("/api") || url.pathname.startsWith("/pronounce")) return; // luôn lấy mạng

  // Điều hướng (mở trang) -> network-first, lỗi mạng thì trả index đã cache (chạy offline).
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).catch(() => caches.match("/index.html").then((r) => r || caches.match("/"))));
    return;
  }

  // Tài nguyên tĩnh -> cache-first, nền tự cập nhật.
  e.respondWith(
    caches.match(req).then((cached) => {
      const net = fetch(req).then((res) => {
        if (res && res.status === 200) caches.open(CACHE).then((c) => c.put(req, res.clone()));
        return res;
      }).catch(() => cached);
      return cached || net;
    }),
  );
});
