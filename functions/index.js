// Firebase Functions — proxy giấu API key (TECH_SPEC §8.5 / DECISIONS D-003, D-005).
// Endpoints: /image (Pexels, fallback Unsplash) và /translate (MyMemory en->vi).
// Node 20: dùng global fetch. Key đặt qua functions config / env, KHÔNG để ở frontend.
const { onRequest } = require("firebase-functions/v2/https");

const PEXELS_KEY = process.env.PEXELS_KEY || "";
const UNSPLASH_KEY = process.env.UNSPLASH_KEY || ""; // tùy chọn, fallback

// CORS đơn giản (web app + localhost dev).
function cors(res) {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
}

async function fromPexels(query) {
  if (!PEXELS_KEY) return [];
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5`;
  const r = await fetch(url, { headers: { Authorization: PEXELS_KEY } });
  if (!r.ok) return [];
  const data = await r.json();
  return (data.photos || []).map((p) => ({
    id: String(p.id),
    url: p.src.large,
    thumbUrl: p.src.tiny,
    photographer: p.photographer,
    sourceUrl: p.url,
  }));
}

async function fromUnsplash(query) {
  if (!UNSPLASH_KEY) return [];
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5`;
  const r = await fetch(url, { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } });
  if (!r.ok) return [];
  const data = await r.json();
  return (data.results || []).map((p) => ({
    id: p.id,
    url: p.urls.regular,
    thumbUrl: p.urls.thumb,
    photographer: p.user.name,
    sourceUrl: p.links.html,
  }));
}

exports.image = onRequest({ cors: true }, async (req, res) => {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).send("");
  const query = String(req.query.query || "").trim();
  if (!query) return res.status(400).json({ error: "thiếu query" });
  try {
    let images = await fromPexels(query);
    if (images.length === 0) images = await fromUnsplash(query); // ảnh seed không phù hợp -> dự phòng
    return res.json(images);
  } catch (e) {
    return res.status(502).json({ error: "image proxy lỗi" });
  }
});

// Cache theo instance để giảm gọi lặp (đủ cho app gia đình). Persistent cache: nâng cấp sau.
const translateCache = new Map();

exports.translate = onRequest({ cors: true }, async (req, res) => {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).send("");
  const text = String(req.query.text || "").trim();
  if (!text) return res.status(400).json({ error: "thiếu text" });
  if (translateCache.has(text)) return res.json({ translation: translateCache.get(text) });
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|vi`;
    const r = await fetch(url);
    const data = await r.json();
    const translation = data?.responseData?.translatedText || "";
    translateCache.set(text, translation);
    return res.json({ translation });
  } catch (e) {
    return res.status(502).json({ error: "translate proxy lỗi" });
  }
});
