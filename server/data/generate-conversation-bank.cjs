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
const OUTPUT_DIR = path.join(__dirname, "conversation-bank");
const RATE_LIMIT_MS = 2000;

// Scenarios per level: { category: count }
const LEVEL_PLANS = {
  a1: [
    { category: "daily_life",           name: "Daily Life",            count: 3 },
    { category: "food_and_drink",        name: "Food and Drink",        count: 2 },
    { category: "shopping",             name: "Shopping",              count: 2 },
    { category: "family_and_friends",   name: "Family and Friends",    count: 2 },
    { category: "education",            name: "Education",             count: 2 },
    { category: "travel_and_transport", name: "Travel and Transport",  count: 2 },
    { category: "health_and_body",      name: "Health and Body",       count: 1 },
    { category: "hobbies_and_leisure",  name: "Hobbies and Leisure",   count: 2 },
    { category: "services",             name: "Services",              count: 2 },
    { category: "places",              name: "Places",               count: 2 },
  ],
  a2: [
    { category: "daily_life",           name: "Daily Life",            count: 3 },
    { category: "food_and_drink",        name: "Food and Drink",        count: 3 },
    { category: "shopping",             name: "Shopping",              count: 2 },
    { category: "family_and_friends",   name: "Family and Friends",    count: 2 },
    { category: "education",            name: "Education",             count: 2 },
    { category: "travel_and_transport", name: "Travel and Transport",  count: 3 },
    { category: "health_and_body",      name: "Health and Body",       count: 2 },
    { category: "hobbies_and_leisure",  name: "Hobbies and Leisure",   count: 2 },
    { category: "services",             name: "Services",              count: 2 },
    { category: "work_and_jobs",        name: "Work and Jobs",         count: 2 },
    { category: "communication_and_technology", name: "Communication and Technology", count: 2 },
  ],
  b1: [
    { category: "work_and_jobs",        name: "Work and Jobs",         count: 4 },
    { category: "services",             name: "Services",              count: 3 },
    { category: "education",            name: "Education",             count: 3 },
    { category: "travel_and_transport", name: "Travel and Transport",  count: 3 },
    { category: "health_and_body",      name: "Health and Body",       count: 2 },
    { category: "entertainment_and_media", name: "Entertainment and Media", count: 2 },
    { category: "communication_and_technology", name: "Communication and Technology", count: 3 },
  ],
  b2: [
    { category: "work_and_jobs",        name: "Work and Jobs",         count: 3 },
    { category: "society_and_community", name: "Society and Community", count: 2 },
    { category: "education",            name: "Education",             count: 2 },
    { category: "science_and_research", name: "Science and Research",  count: 1 },
    { category: "communication_and_technology", name: "Communication and Technology", count: 2 },
  ],
  c1: [
    { category: "society_and_community", name: "Society and Community", count: 2 },
    { category: "science_and_research", name: "Science and Research",  count: 1 },
    { category: "work_and_jobs",        name: "Work and Jobs",         count: 1 },
    { category: "communication_and_technology", name: "Communication and Technology", count: 1 },
  ],
};

const DIALOGUE_LINES = { a1: "6-8", a2: "8-10", b1: "10-12", b2: "10-14", c1: "12-16" };

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
    a1: "absolute beginner (CEFR A1) — very simple vocabulary, short sentences, basic present tense",
    a2: "elementary (CEFR A2) — simple past and future tenses, familiar everyday topics",
    b1: "intermediate (CEFR B1) — varied tenses, opinions, some idiomatic language",
    b2: "upper-intermediate (CEFR B2) — complex grammar, nuanced expressions, abstract topics",
    c1: "advanced (CEFR C1) — sophisticated, idiomatic, nuanced discussions on complex topics",
  };

  const lines = DIALOGUE_LINES[level];

  return `You are an expert English teacher creating conversation scenarios for Vietnamese learners.

Generate exactly ${count} realistic conversation scenario(s) about "${categoryName}" at ${levelDescriptions[level]} level.

REQUIREMENTS:
- Each scenario must be a DIFFERENT real-life situation within the category
- Dialogue must be ${lines} lines long (alternating speakers)
- Language must be natural and colloquial — NOT textbook-stilted
- Vietnamese translations must be natural and idiomatic (not word-for-word)
- key_phrases: 3-5 important phrases from the dialogue
- key_vocab: 3-6 key vocabulary words (nouns, verbs, adjectives)
- grammar_points: 1-3 grammar structures highlighted in the dialogue
- roles: 2 speaker roles (e.g. ["Customer", "Waiter"], ["Student", "Teacher"])
- scenario: short English description (5-10 words)
- scenario_vi: Vietnamese translation of scenario

Return a JSON object with key "scenarios" containing an array. Each element MUST have ALL these fields:
{
  "scenario": "Ordering food at a restaurant",
  "scenario_vi": "Gọi món ở nhà hàng",
  "category": "${categoryName.toLowerCase().replace(/ /g, '_')}",
  "roles": ["Customer", "Waiter"],
  "dialogue": [
    {"role": "Waiter", "en": "Good evening! Are you ready to order?", "vi": "Chào buổi tối! Quý khách đã sẵn sàng gọi món chưa ạ?"},
    {"role": "Customer", "en": "Yes, I'd like the grilled chicken, please.", "vi": "Vâng, cho tôi món gà nướng ạ."}
  ],
  "key_phrases": ["Are you ready to order?", "I'd like...", "Could I have the bill?"],
  "key_vocab": ["menu", "order", "bill", "recommend"],
  "grammar_points": ["would like + noun", "Could I have...?"]
}

IMPORTANT:
- The "category" field must be the snake_case version: "${categoryName.toLowerCase().replace(/ /g, '_')}"
- All ${count} scenarios must be DISTINCT situations (not variations of the same scene)
- Return ONLY valid JSON with exactly ${count} scenario(s) in the "scenarios" array`;
}

// ---------------------------------------------------------------------------
// Single API call (with one retry)
// ---------------------------------------------------------------------------
async function callDeepSeek(level, catName, count) {
  const body = {
    model: "deepseek-chat",
    messages: [{ role: "user", content: buildPrompt(level, catName, count) }],
    response_format: { type: "json_object" },
    temperature: 0.8,
    max_tokens: 8000,
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
  if (parsed.scenarios && Array.isArray(parsed.scenarios)) return parsed.scenarios;
  const arrayKey = Object.keys(parsed).find((k) => Array.isArray(parsed[k]));
  if (arrayKey) return parsed[arrayKey];
  throw new Error(`Unexpected response shape: ${JSON.stringify(parsed).slice(0, 200)}`);
}

async function callWithRetry(level, catName, count) {
  try {
    return await callDeepSeek(level, catName, count);
  } catch (err) {
    console.warn(`    [WARN] Failed: ${err.message}. Retrying in 4s...`);
    await sleep(4000);
    return await callDeepSeek(level, catName, count);
  }
}

// ---------------------------------------------------------------------------
// Generate one category batch (resumable)
// ---------------------------------------------------------------------------
async function generateCategoryBatch(level, cat) {
  const filePath = path.join(OUTPUT_DIR, `${level}_${cat.category}.json`);

  if (fs.existsSync(filePath)) {
    const existing = JSON.parse(fs.readFileSync(filePath, "utf8"));
    console.log(`  [SKIP] ${level}_${cat.category}.json (${existing.length} scenarios)`);
    return existing;
  }

  console.log(`  [GEN]  ${level}_${cat.category} (${cat.count} scenarios)...`);

  try {
    const scenarios = await callWithRetry(level, cat.name, cat.count);
    // Inject level into each scenario
    scenarios.forEach((s) => {
      s.level = level;
      if (!s.category) s.category = cat.category;
    });
    fs.writeFileSync(filePath, JSON.stringify(scenarios, null, 2), "utf8");
    console.log(`  [OK]   ${level}_${cat.category}.json — ${scenarios.length} scenarios saved`);
    return scenarios;
  } catch (err) {
    console.error(`  [ERR]  ${level}_${cat.category} failed permanently: ${err.message}`);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const level = (process.argv[2] || "").toLowerCase();
  if (!LEVEL_PLANS[level]) {
    console.error(`Usage: node generate-conversation-bank.cjs <level>`);
    console.error(`  level must be one of: ${Object.keys(LEVEL_PLANS).join(", ")}`);
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const plan = LEVEL_PLANS[level];
  const totalTarget = plan.reduce((s, c) => s + c.count, 0);
  console.log(`\n=== Generating ${level.toUpperCase()} conversation bank (~${totalTarget} scenarios across ${plan.length} categories) ===\n`);

  const allScenarios = [];

  for (const cat of plan) {
    const scenarios = await generateCategoryBatch(level, cat);
    allScenarios.push(...scenarios);
    await sleep(RATE_LIMIT_MS);
  }

  const combinedPath = path.join(OUTPUT_DIR, `${level}.json`);
  fs.writeFileSync(combinedPath, JSON.stringify(allScenarios, null, 2), "utf8");
  console.log(`\n=== Done: ${allScenarios.length} total scenarios → ${combinedPath} ===\n`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
