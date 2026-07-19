#!/usr/bin/env node
"use strict";

const https = require("https");
const fs = require("fs");
const path = require("path");

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const DEEPSEEK_API_KEY = "sk-e2c99bc4e1ee44ea8c918edcc2ef9bac";
const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";
const OUTPUT_DIR = path.join(__dirname, "phrase-bank");
const RATE_LIMIT_MS = 1500;

// Phrases per category per level
const PHRASES_PER_CATEGORY = { a1: 8, a2: 12, b1: 16, b2: 12, c1: 8 };

const CATEGORIES = [
  { id: "animals_and_nature",           name: "Animals and Nature" },
  { id: "clothes_and_accessories",      name: "Clothes and Accessories" },
  { id: "colours_and_shapes",           name: "Colours and Shapes" },
  { id: "communication_and_technology", name: "Communication and Technology" },
  { id: "daily_life",                   name: "Daily Life" },
  { id: "education",                    name: "Education" },
  { id: "entertainment_and_media",      name: "Entertainment and Media" },
  { id: "environment",                  name: "Environment" },
  { id: "family_and_friends",           name: "Family and Friends" },
  { id: "feelings_and_opinions",        name: "Feelings and Opinions" },
  { id: "food_and_drink",               name: "Food and Drink" },
  { id: "health_and_body",              name: "Health and Body" },
  { id: "hobbies_and_leisure",          name: "Hobbies and Leisure" },
  { id: "house_and_home",               name: "House and Home" },
  { id: "measurements_and_numbers",     name: "Measurements and Numbers" },
  { id: "places",                       name: "Places" },
  { id: "services",                     name: "Services" },
  { id: "shopping",                     name: "Shopping" },
  { id: "society_and_community",        name: "Society and Community" },
  { id: "sport",                        name: "Sport" },
  { id: "science_and_research",         name: "Science and Research" },
  { id: "travel_and_transport",         name: "Travel and Transport" },
  { id: "weather_and_seasons",          name: "Weather and Seasons" },
  { id: "work_and_jobs",                name: "Work and Jobs" },
];

// ---------------------------------------------------------------------------
// HTTP helper
// ---------------------------------------------------------------------------
function httpsPost(url, headers, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const data = JSON.stringify(body);
    const req = https.request(
      {
        hostname: u.hostname,
        path: u.pathname + u.search,
        method: "POST",
        headers: { ...headers, "Content-Length": Buffer.byteLength(data) },
      },
      (res) => {
        let raw = "";
        res.on("data", (c) => (raw += c));
        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try { resolve(JSON.parse(raw)); }
            catch (e) { reject(new Error(`JSON parse error: ${raw.slice(0, 300)}`)); }
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${raw.slice(0, 300)}`));
          }
        });
      }
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------------------
// Build prompt
// ---------------------------------------------------------------------------
function buildPrompt(level, categoryName, count) {
  const levelDescriptions = {
    a1: "absolute beginner (CEFR A1) — very simple, high-frequency phrases used every day",
    a2: "elementary (CEFR A2) — simple phrases for familiar everyday situations",
    b1: "intermediate (CEFR B1) — phrases for everyday conversations and common topics",
    b2: "upper-intermediate (CEFR B2) — broader range of phrases for complex topics",
    c1: "advanced (CEFR C1) — sophisticated, idiomatic and nuanced phrases",
  };

  return `You are an expert English teacher specializing in phrases for Vietnamese learners.

Generate exactly ${count} English phrases for the topic "${categoryName}" at ${levelDescriptions[level]} level.

REQUIREMENTS:
- CEFR level must be strictly ${level.toUpperCase()}
- Each phrase must be a phrasal_verb, collocation, or expression
- Vietnamese translations must be natural and idiomatic (not word-for-word)
- "response" field: only fill for conversational/greeting phrases (e.g. "How are you?" → "I'm fine, thanks."); leave empty string "" for non-conversational phrases
- example_dialogue must have 2-4 lines, realistic and natural
- examples must have exactly 2 sentences with both English and Vietnamese
- collocations: 2-4 related collocations or variations
- Focus on phrases most useful and common for Vietnamese English learners
- No duplicate phrases

Return a JSON object with key "phrases" containing an array. Each element MUST have ALL these fields:
{
  "phrase": "get up",
  "meaning_vi": "thức dậy",
  "type": "phrasal_verb",
  "examples": [
    {"en": "I get up at 6 every morning.", "vi": "Tôi thức dậy lúc 6 giờ mỗi sáng."},
    {"en": "What time do you get up?", "vi": "Bạn thức dậy lúc mấy giờ?"}
  ],
  "collocations": ["get up early", "get up late", "get up on time"],
  "response": "",
  "example_dialogue": [
    {"speaker": "A", "text": "What time do you usually get up?"},
    {"speaker": "B", "text": "I usually get up at seven."}
  ]
}

type must be exactly one of: "phrasal_verb", "collocation", "expression"

Return ONLY valid JSON with exactly ${count} phrases.`;
}

// ---------------------------------------------------------------------------
// Single API call (with one retry)
// ---------------------------------------------------------------------------
async function callDeepSeek(level, catName, count) {
  const body = {
    model: "deepseek-chat",
    messages: [{ role: "user", content: buildPrompt(level, catName, count) }],
    response_format: { type: "json_object" },
    temperature: 0.7,
    max_tokens: 6000,
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
  };

  const res = await httpsPost(DEEPSEEK_URL, headers, body);
  const content = res.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty response from DeepSeek");

  const parsed = JSON.parse(content);
  if (Array.isArray(parsed)) return parsed;
  if (parsed.phrases && Array.isArray(parsed.phrases)) return parsed.phrases;
  const arrayKey = Object.keys(parsed).find((k) => Array.isArray(parsed[k]));
  if (arrayKey) return parsed[arrayKey];
  throw new Error(`Unexpected response shape: ${JSON.stringify(parsed).slice(0, 200)}`);
}

async function callWithRetry(level, catName, count) {
  try {
    return await callDeepSeek(level, catName, count);
  } catch (err) {
    console.warn(`    [WARN] Failed: ${err.message}. Retrying in 3s…`);
    await sleep(3000);
    return await callDeepSeek(level, catName, count);
  }
}

// ---------------------------------------------------------------------------
// Generate one category (resumable)
// ---------------------------------------------------------------------------
async function generateCategory(level, cat, count) {
  const filePath = path.join(OUTPUT_DIR, `${level}_${cat.id}.json`);

  if (fs.existsSync(filePath)) {
    const existing = JSON.parse(fs.readFileSync(filePath, "utf8"));
    console.log(`  [SKIP] ${level}_${cat.id}.json (${existing.length} phrases)`);
    return existing;
  }

  console.log(`  [GEN]  ${level}_${cat.id} (${count} phrases)…`);

  try {
    const phrases = await callWithRetry(level, cat.name, count);
    fs.writeFileSync(filePath, JSON.stringify(phrases, null, 2), "utf8");
    console.log(`  [OK]   ${level}_${cat.id}.json — ${phrases.length} phrases saved`);
    return phrases;
  } catch (err) {
    console.error(`  [ERR]  ${level}_${cat.id} failed permanently: ${err.message}`);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const level = (process.argv[2] || "").toLowerCase();
  if (!PHRASES_PER_CATEGORY[level]) {
    console.error(`Usage: node generate-phrase-bank.cjs <level>`);
    console.error(`  level must be one of: ${Object.keys(PHRASES_PER_CATEGORY).join(", ")}`);
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const phrasesPerCat = PHRASES_PER_CATEGORY[level];
  const totalTarget = phrasesPerCat * CATEGORIES.length;
  console.log(`\n=== Generating ${level.toUpperCase()} phrase bank (~${phrasesPerCat} phrases/category, ${CATEGORIES.length} categories, ~${totalTarget} total) ===\n`);

  const allPhrases = [];

  for (const cat of CATEGORIES) {
    const phrases = await generateCategory(level, cat, phrasesPerCat);
    allPhrases.push(...phrases);
    await sleep(RATE_LIMIT_MS);
  }

  const combinedPath = path.join(OUTPUT_DIR, `${level}.json`);
  fs.writeFileSync(combinedPath, JSON.stringify(allPhrases, null, 2), "utf8");
  console.log(`\n=== Done: ${allPhrases.length} total phrases → ${combinedPath} ===\n`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
