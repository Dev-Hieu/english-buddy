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
const OUTPUT_DIR = path.join(__dirname, "word-bank");
const RATE_LIMIT_MS = 1500;

// Words per category; generated in batches of BATCH_SIZE to stay within token limits
const WORDS_PER_CATEGORY = { a1: 40, a2: 60, b1: 80, b2: 80, c1: 60 };
const BATCH_SIZE = 20; // max words per single API call

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

// ---------------------------------------------------------------------------
// Sleep
// ---------------------------------------------------------------------------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------------------
// Build prompt for a batch
// ---------------------------------------------------------------------------
function buildPrompt(level, categoryName, batchCount, batchIndex, totalBatches, alreadyGenerated) {
  const levelDescriptions = {
    a1: "absolute beginner (CEFR A1) — very basic everyday words",
    a2: "elementary (CEFR A2) — simple words used in familiar situations",
    b1: "intermediate (CEFR B1) — words for everyday conversations",
    b2: "upper-intermediate (CEFR B2) — broader vocabulary for complex topics",
    c1: "advanced (CEFR C1) — sophisticated, idiomatic and academic vocabulary",
  };

  const avoidClause =
    alreadyGenerated.length > 0
      ? `\nDo NOT repeat these words already generated: ${alreadyGenerated.join(", ")}.`
      : "";

  return `You are an expert English vocabulary teacher for Vietnamese learners.

Generate exactly ${batchCount} English vocabulary words for the topic "${categoryName}" at ${levelDescriptions[level]} level. This is batch ${batchIndex + 1} of ${totalBatches}.${avoidClause}

REQUIREMENTS:
- CEFR level must be strictly ${level.toUpperCase()}
- Order by frequency (most common/useful first)
- Vietnamese translations must be natural and idiomatic
- Common mistakes must be specific to Vietnamese speakers
- Phonetics must use IPA format (e.g. /ˈbrek.fəst/)
- No duplicate words

Return a JSON object with key "words" containing an array. Each element MUST have ALL these fields:
{
  "word": "breakfast",
  "phonetic": "/ˈbrek.fəst/",
  "meaning_vi": "bữa sáng",
  "meaning_en": "the first meal of the day",
  "pos": "noun",
  "examples": [{"en": "I have breakfast at seven.", "vi": "Tôi ăn sáng lúc 7 giờ."}],
  "word_family": ["break (v)"],
  "collocations": ["have breakfast", "eat breakfast", "skip breakfast"],
  "synonyms": ["morning meal"],
  "antonyms": [],
  "common_mistakes": [{"wrong": "I eat breakfast", "correct": "I have breakfast", "explain_vi": "Dùng 'have' thay vì 'eat' với breakfast"}],
  "grammar_patterns": ["have + breakfast (no article)"]
}

Return ONLY valid JSON with exactly ${batchCount} words.`;
}

// ---------------------------------------------------------------------------
// Single API call for a batch (with one retry)
// ---------------------------------------------------------------------------
async function callDeepSeekBatch(level, catName, batchCount, batchIndex, totalBatches, alreadyGenerated) {
  const body = {
    model: "deepseek-chat",
    messages: [
      {
        role: "user",
        content: buildPrompt(level, catName, batchCount, batchIndex, totalBatches, alreadyGenerated),
      },
    ],
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
  if (parsed.words && Array.isArray(parsed.words)) return parsed.words;
  const arrayKey = Object.keys(parsed).find((k) => Array.isArray(parsed[k]));
  if (arrayKey) return parsed[arrayKey];
  throw new Error(`Unexpected response shape: ${JSON.stringify(parsed).slice(0, 200)}`);
}

async function callWithRetry(level, catName, batchCount, batchIndex, totalBatches, alreadyGenerated) {
  try {
    return await callDeepSeekBatch(level, catName, batchCount, batchIndex, totalBatches, alreadyGenerated);
  } catch (err) {
    console.warn(`    [WARN] Batch ${batchIndex + 1} failed: ${err.message}. Retrying in 3s…`);
    await sleep(3000);
    return await callDeepSeekBatch(level, catName, batchCount, batchIndex, totalBatches, alreadyGenerated);
  }
}

// ---------------------------------------------------------------------------
// Generate one category (batched, resumable at category level)
// ---------------------------------------------------------------------------
async function generateCategory(level, cat, totalWords) {
  const filePath = path.join(OUTPUT_DIR, `${level}_${cat.id}.json`);

  if (fs.existsSync(filePath)) {
    const existing = JSON.parse(fs.readFileSync(filePath, "utf8"));
    console.log(`  [SKIP] ${level}_${cat.id}.json (${existing.length} words)`);
    return existing;
  }

  // Split into batches
  const batches = [];
  let remaining = totalWords;
  while (remaining > 0) {
    batches.push(Math.min(BATCH_SIZE, remaining));
    remaining -= BATCH_SIZE;
  }

  console.log(`  [GEN]  ${level}_${cat.id} (${totalWords} words in ${batches.length} batch(es))…`);

  const allWords = [];

  for (let i = 0; i < batches.length; i++) {
    const batchCount = batches[i];
    const alreadyGenerated = allWords.map((w) => w.word);

    try {
      const words = await callWithRetry(level, cat.name, batchCount, i, batches.length, alreadyGenerated);
      console.log(`    batch ${i + 1}/${batches.length}: ${words.length} words`);
      allWords.push(...words);
    } catch (err) {
      console.error(`    [ERR]  Batch ${i + 1} failed permanently: ${err.message}`);
      // Continue with what we have
    }

    if (i < batches.length - 1) await sleep(RATE_LIMIT_MS);
  }

  fs.writeFileSync(filePath, JSON.stringify(allWords, null, 2), "utf8");
  console.log(`  [OK]   ${level}_${cat.id}.json — ${allWords.length} words saved`);
  return allWords;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const level = (process.argv[2] || "").toLowerCase();
  if (!WORDS_PER_CATEGORY[level]) {
    console.error(`Usage: node generate-word-bank.cjs <level>`);
    console.error(`  level must be one of: ${Object.keys(WORDS_PER_CATEGORY).join(", ")}`);
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const wordsPerCat = WORDS_PER_CATEGORY[level];
  console.log(`\n=== Generating ${level.toUpperCase()} word bank (~${wordsPerCat} words/category, ${CATEGORIES.length} categories) ===\n`);

  const allWords = [];

  for (const cat of CATEGORIES) {
    const words = await generateCategory(level, cat, wordsPerCat);
    allWords.push(...words);
    await sleep(RATE_LIMIT_MS);
  }

  const combinedPath = path.join(OUTPUT_DIR, `${level}.json`);
  fs.writeFileSync(combinedPath, JSON.stringify(allWords, null, 2), "utf8");
  console.log(`\n=== Done: ${allWords.length} total words → ${combinedPath} ===\n`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
