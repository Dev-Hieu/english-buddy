# Phase 1: Word Bank Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a CEFR-standard vocabulary bank of ~8000 words across 24 Cambridge categories and 5 levels (A1-C1), replacing the current 35-topic/5601-word system.

**Architecture:** New DB schema `word_bank` with enriched fields (word_family, collocations, synonyms, antonyms, common_mistakes, grammar_patterns). New `categories` table replaces `topics`. AI (DeepSeek) generates content in batches per level per category. Frontend migrates from SEED_VOCABULARY to new API. Old `vocabulary` + `topics` tables preserved for rollback.

**Tech Stack:** SQLite (better-sqlite3), DeepSeek API, TypeScript, Node.js scripts

## Global Constraints

- DB: SQLite via better-sqlite3, WAL mode
- AI: DeepSeek API (`deepseek-chat` model), max 4000 tokens/response, rate limit 1 req/sec
- Levels: `a1`, `a2`, `b1`, `b2`, `c1` (no `kids` — merged into `a1`)
- Categories: exactly 24 Cambridge-standard IDs using snake_case (e.g., `daily_life`, `food_and_drink`)
- All Vietnamese translations required for every word
- Phonetic: IPA format (e.g., `/ˈbrek.fəst/`)
- Source wordlists: Oxford 3000, Cambridge A2 Key, Cambridge B1 Preliminary
- Server: Express, files in `server/src/`
- Frontend: React+TS, files in `src/`
- Deploy: `ssh oracle-vps` → git pull → build → pm2 reload
- Existing data NOT deleted — new tables created alongside old ones

---

### Task 1: Create new DB schema

**Files:**
- Modify: `server/src/db.ts` — add `categories` and `word_bank` table definitions
- Create: `server/src/migrations/001-word-bank.ts` — migration script

**Interfaces:**
- Consumes: nothing
- Produces: `categories` table, `word_bank` table — used by all subsequent tasks

- [ ] **Step 1: Create migration directory and script**

```bash
mkdir -p server/src/migrations
```

Create `server/src/migrations/001-word-bank.ts`:

```typescript
import { db } from "../db.js";

export function migrate001WordBank(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      name_vi TEXT NOT NULL,
      "order" INTEGER NOT NULL,
      sub_topics TEXT DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS word_bank (
      id TEXT PRIMARY KEY,
      word TEXT NOT NULL,
      phonetic TEXT DEFAULT '',
      meaning_vi TEXT NOT NULL,
      meaning_en TEXT DEFAULT '',
      pos TEXT DEFAULT '',
      level TEXT NOT NULL,
      categories TEXT NOT NULL DEFAULT '[]',
      frequency INTEGER DEFAULT 0,
      examples TEXT DEFAULT '[]',
      word_family TEXT DEFAULT '[]',
      collocations TEXT DEFAULT '[]',
      synonyms TEXT DEFAULT '[]',
      antonyms TEXT DEFAULT '[]',
      common_mistakes TEXT DEFAULT '[]',
      grammar_patterns TEXT DEFAULT '[]',
      image TEXT DEFAULT '',
      audio TEXT DEFAULT '',
      created_at INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_wb_level ON word_bank(level);
    CREATE INDEX IF NOT EXISTS idx_wb_word ON word_bank(word);
  `);

  console.log("Migration 001: word_bank + categories tables created");
}
```

- [ ] **Step 2: Add migration call to db.ts**

In `server/src/db.ts`, after `initSchema()` function, add:

```typescript
import { migrate001WordBank } from "./migrations/001-word-bank.js";

// Call after initSchema in index.ts or seed.ts
export function runMigrations(): void {
  migrate001WordBank();
}
```

- [ ] **Step 3: Seed 24 categories**

Create `server/data/seed-categories.cjs`:

```javascript
const Database = require("better-sqlite3");
const path = require("path");
const db = new Database(path.join(__dirname, "..", "data.db"));
db.pragma("journal_mode = WAL");

const CATEGORIES = [
  { id: "animals_and_nature", name: "Animals and Nature", name_vi: "Động vật & Thiên nhiên", order: 1, sub_topics: ["Animals", "Pets", "Natural world"] },
  { id: "clothes_and_accessories", name: "Clothes and Accessories", name_vi: "Quần áo & Phụ kiện", order: 2, sub_topics: ["Clothing", "Fashion"] },
  { id: "colours_and_shapes", name: "Colours and Shapes", name_vi: "Màu sắc & Hình dạng", order: 3, sub_topics: ["Colours", "Shapes", "Descriptions"] },
  { id: "communication_and_technology", name: "Communication and Technology", name_vi: "Giao tiếp & Công nghệ", order: 4, sub_topics: ["Devices", "Internet", "Media"] },
  { id: "daily_life", name: "Daily Life", name_vi: "Sinh hoạt hàng ngày", order: 5, sub_topics: ["Routines", "Greetings", "Common actions"] },
  { id: "education", name: "Education", name_vi: "Giáo dục", order: 6, sub_topics: ["School", "University", "Studying"] },
  { id: "entertainment_and_media", name: "Entertainment and Media", name_vi: "Giải trí & Truyền thông", order: 7, sub_topics: ["Film", "Music", "TV", "Games"] },
  { id: "environment", name: "Environment", name_vi: "Môi trường", order: 8, sub_topics: ["Countryside", "Pollution", "Climate"] },
  { id: "family_and_friends", name: "Family and Friends", name_vi: "Gia đình & Bạn bè", order: 9, sub_topics: ["Family", "Relationships", "People"] },
  { id: "feelings_and_opinions", name: "Feelings and Opinions", name_vi: "Cảm xúc & Ý kiến", order: 10, sub_topics: ["Emotions", "Personality", "Attitudes"] },
  { id: "food_and_drink", name: "Food and Drink", name_vi: "Đồ ăn & Thức uống", order: 11, sub_topics: ["Food", "Cooking", "Restaurant"] },
  { id: "health_and_body", name: "Health and Body", name_vi: "Sức khỏe & Cơ thể", order: 12, sub_topics: ["Body parts", "Medicine", "Exercise"] },
  { id: "hobbies_and_leisure", name: "Hobbies and Leisure", name_vi: "Sở thích & Giải trí", order: 13, sub_topics: ["Sports", "Free time", "Interests"] },
  { id: "house_and_home", name: "House and Home", name_vi: "Nhà ở", order: 14, sub_topics: ["Rooms", "Furniture", "Housework"] },
  { id: "measurements_and_numbers", name: "Measurements and Numbers", name_vi: "Số & Đo lường", order: 15, sub_topics: ["Numbers", "Time", "Units", "Money"] },
  { id: "places", name: "Places", name_vi: "Địa điểm", order: 16, sub_topics: ["Buildings", "Town", "City", "Countryside"] },
  { id: "services", name: "Services", name_vi: "Dịch vụ", order: 17, sub_topics: ["Bank", "Post", "Restaurant", "Hospital"] },
  { id: "shopping", name: "Shopping", name_vi: "Mua sắm", order: 18, sub_topics: ["Shops", "Prices", "Buying"] },
  { id: "society_and_community", name: "Society and Community", name_vi: "Xã hội & Cộng đồng", order: 19, sub_topics: ["Social issues", "Politics", "Economy"] },
  { id: "sport", name: "Sport", name_vi: "Thể thao", order: 20, sub_topics: ["Games", "Competition", "Fitness"] },
  { id: "science_and_research", name: "Science and Research", name_vi: "Khoa học & Nghiên cứu", order: 21, sub_topics: ["Scientific topics", "Academic"] },
  { id: "travel_and_transport", name: "Travel and Transport", name_vi: "Du lịch & Giao thông", order: 22, sub_topics: ["Vehicles", "Airport", "Tourism"] },
  { id: "weather_and_seasons", name: "Weather and Seasons", name_vi: "Thời tiết & Mùa", order: 23, sub_topics: ["Climate", "Seasons", "Forecasts"] },
  { id: "work_and_jobs", name: "Work and Jobs", name_vi: "Công việc & Nghề nghiệp", order: 24, sub_topics: ["Occupations", "Office", "Career"] },
];

const insert = db.prepare("INSERT OR REPLACE INTO categories (id, name, name_vi, \"order\", sub_topics) VALUES (?, ?, ?, ?, ?)");
const tx = db.transaction(() => {
  for (const c of CATEGORIES) {
    insert.run(c.id, c.name, c.name_vi, c.order, JSON.stringify(c.sub_topics));
  }
});
tx();
console.log(`Seeded ${CATEGORIES.length} categories`);
db.close();
```

- [ ] **Step 4: Run migration + seed on VPS**

```bash
ssh oracle-vps "cd ~/english-buddy && git pull && node server/src/migrations/001-word-bank.ts && node server/data/seed-categories.cjs"
```

Expected: `Migration 001: word_bank + categories tables created` + `Seeded 24 categories`

- [ ] **Step 5: Commit**

```bash
git add server/src/migrations/ server/src/db.ts server/data/seed-categories.cjs
git commit -m "feat: word_bank + categories DB schema (Phase 1 Task 1)"
```

---

### Task 2: Generate A1 word bank (~1000 words) via DeepSeek

**Files:**
- Create: `server/data/generate-word-bank.cjs` — AI generation script
- Create: `server/data/word-bank/a1.json` — generated A1 words

**Interfaces:**
- Consumes: `categories` table (24 categories), Cambridge A2 Key wordlist as reference
- Produces: `server/data/word-bank/a1.json` — ~1000 words with all fields, used by Task 4

- [ ] **Step 1: Create generation script**

Create `server/data/generate-word-bank.cjs`:

```javascript
#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const API_KEY = process.env.DEEPSEEK_API_KEY || "sk-e2c99bc4e1ee44ea8c918edcc2ef9bac";
const LEVEL = process.argv[2] || "a1";
const OUTPUT_DIR = path.join(__dirname, "word-bank");
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const CATEGORIES = [
  "animals_and_nature", "clothes_and_accessories", "colours_and_shapes",
  "communication_and_technology", "daily_life", "education",
  "entertainment_and_media", "environment", "family_and_friends",
  "feelings_and_opinions", "food_and_drink", "health_and_body",
  "hobbies_and_leisure", "house_and_home", "measurements_and_numbers",
  "places", "services", "shopping", "society_and_community", "sport",
  "science_and_research", "travel_and_transport", "weather_and_seasons",
  "work_and_jobs",
];

// Words per category per level
const WORDS_PER_CAT = {
  a1: { default: 40, daily_life: 60, family_and_friends: 50, food_and_drink: 50,
        measurements_and_numbers: 60, animals_and_nature: 50 },
  a2: { default: 60 },
  b1: { default: 80 },
  b2: { default: 80 },
  c1: { default: 60 },
};

const PROMPT = `You are a CEFR vocabulary expert. Generate exactly {count} English words for level {level}, category "{category}".

For EACH word, provide ALL fields as JSON:
- word: the English word
- phonetic: IPA pronunciation (e.g., "/ˈbrek.fəst/")
- meaning_vi: Vietnamese translation (concise, accurate)
- meaning_en: English definition (1 sentence)
- pos: part of speech (noun/verb/adjective/adverb/preposition/pronoun/conjunction/interjection)
- examples: [{en: "example sentence", vi: "Vietnamese translation"}] (2 examples)
- word_family: related word forms, e.g., ["teach (v)", "teacher (n)", "teaching (n)"]
- collocations: common word combinations, e.g., ["have breakfast", "eat breakfast"]
- synonyms: 1-3 synonyms at same level
- antonyms: 1-2 antonyms if applicable
- common_mistakes: [{wrong, correct, explain_vi}] — mistakes Vietnamese learners make
- grammar_patterns: patterns this word uses, e.g., ["enjoy + V-ing"]

Requirements:
- ONLY {level} level words (based on Cambridge English Vocabulary Profile)
- Frequency-ordered (most common first)
- Include mix of nouns, verbs, adjectives, adverbs
- Vietnamese translations must be natural, not literal
- Common mistakes specific to Vietnamese speakers

Return ONLY a JSON array of word objects. No markdown, no explanation.`;

async function generateCategory(category, count) {
  const outFile = path.join(OUTPUT_DIR, `${LEVEL}_${category}.json`);
  if (fs.existsSync(outFile)) {
    console.log(`SKIP: ${category} (exists)`);
    return JSON.parse(fs.readFileSync(outFile, "utf-8"));
  }

  const prompt = PROMPT
    .replace(/{level}/g, LEVEL.toUpperCase())
    .replace(/{category}/g, category.replace(/_/g, " "))
    .replace(/{count}/g, String(count));

  const body = JSON.stringify({
    model: "deepseek-chat",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    max_tokens: 4000,
    response_format: { type: "json_object" },
  });

  const resp = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
    body,
  });

  const result = await resp.json();
  const content = result.choices[0].message.content;
  let words;
  try {
    const parsed = JSON.parse(content);
    words = Array.isArray(parsed) ? parsed : parsed.words || parsed.vocabulary || Object.values(parsed)[0];
  } catch (e) {
    console.error(`PARSE ERROR: ${category}`, e.message);
    return [];
  }

  // Add metadata
  words = words.map((w, i) => ({
    ...w,
    id: `wb_${LEVEL}_${category}_${String(i).padStart(3, "0")}`,
    level: LEVEL,
    categories: [category],
    frequency: i + 1,
    image: "",
    audio: "",
    created_at: Date.now(),
  }));

  fs.writeFileSync(outFile, JSON.stringify(words, null, 2));
  console.log(`OK: ${category} — ${words.length} words`);
  return words;
}

async function main() {
  const allWords = [];
  const catCounts = WORDS_PER_CAT[LEVEL] || { default: 40 };

  for (const cat of CATEGORIES) {
    const count = catCounts[cat] || catCounts.default;
    const words = await generateCategory(cat, count);
    allWords.push(...words);
    await new Promise((r) => setTimeout(r, 1500)); // rate limit
  }

  // Save combined
  const combined = path.join(OUTPUT_DIR, `${LEVEL}.json`);
  fs.writeFileSync(combined, JSON.stringify(allWords, null, 2));
  console.log(`\nTotal: ${allWords.length} words saved to ${combined}`);
}

main().catch(console.error);
```

- [ ] **Step 2: Run for A1**

```bash
cd server && node data/generate-word-bank.cjs a1
```

Expected: 24 category files + `a1.json` combined (~1000 words). Takes ~40 seconds (24 API calls × 1.5s).

- [ ] **Step 3: Validate output quality**

```bash
node -e "
const words = require('./data/word-bank/a1.json');
console.log('Total:', words.length);
const byCat = {};
words.forEach(w => w.categories.forEach(c => byCat[c] = (byCat[c]||0)+1));
Object.entries(byCat).sort((a,b) => a[0].localeCompare(b[0])).forEach(([c,n]) => console.log(c, n));
// Check completeness
const missing = words.filter(w => !w.phonetic || !w.meaning_vi || !w.examples?.length);
console.log('Missing fields:', missing.length);
"
```

Expected: ~1000 words, 24 categories, 0 missing fields.

- [ ] **Step 4: Commit**

```bash
git add server/data/generate-word-bank.cjs server/data/word-bank/
git commit -m "feat: A1 word bank — ~1000 words × 24 categories (Phase 1 Task 2)"
```

---

### Task 3: Generate A2-C1 word banks (~7000 words)

**Files:**
- Create: `server/data/word-bank/a2.json`, `b1.json`, `b2.json`, `c1.json`

**Interfaces:**
- Consumes: `generate-word-bank.cjs` from Task 2
- Produces: 4 JSON files (~7000 words total), used by Task 4

- [ ] **Step 1: Generate A2**

```bash
node data/generate-word-bank.cjs a2
```

Expected: ~1500 words

- [ ] **Step 2: Generate B1**

```bash
node data/generate-word-bank.cjs b1
```

Expected: ~2000 words

- [ ] **Step 3: Generate B2**

```bash
node data/generate-word-bank.cjs b2
```

Expected: ~2000 words

- [ ] **Step 4: Generate C1**

```bash
node data/generate-word-bank.cjs c1
```

Expected: ~1500 words

- [ ] **Step 5: Validate all levels**

```bash
for level in a1 a2 b1 b2 c1; do
  echo "$level: $(node -e "console.log(require('./data/word-bank/$level.json').length)")"
done
```

Expected: a1:~1000, a2:~1500, b1:~2000, b2:~2000, c1:~1500

- [ ] **Step 6: Commit**

```bash
git add server/data/word-bank/
git commit -m "feat: A2-C1 word banks — ~7000 words (Phase 1 Task 3)"
```

---

### Task 4: Import word bank to DB + API endpoint

**Files:**
- Create: `server/data/import-word-bank.cjs` — import script
- Modify: `server/src/app.ts` — add `/api/word-bank` and `/api/categories` endpoints

**Interfaces:**
- Consumes: `word-bank/*.json` files from Tasks 2-3, `word_bank` + `categories` tables from Task 1
- Produces: `/api/word-bank?level=a1&category=daily_life` endpoint, `/api/categories` endpoint — used by Task 5

- [ ] **Step 1: Create import script**

Create `server/data/import-word-bank.cjs`:

```javascript
const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const db = new Database(path.join(__dirname, "..", "data.db"));
db.pragma("journal_mode = WAL");

const insert = db.prepare(`
  INSERT OR REPLACE INTO word_bank
  (id, word, phonetic, meaning_vi, meaning_en, pos, level, categories,
   frequency, examples, word_family, collocations, synonyms, antonyms,
   common_mistakes, grammar_patterns, image, audio, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

let total = 0;
const tx = db.transaction(() => {
  for (const level of ["a1", "a2", "b1", "b2", "c1"]) {
    const file = path.join(__dirname, "word-bank", `${level}.json`);
    if (!fs.existsSync(file)) { console.log(`SKIP: ${level}`); continue; }
    const words = JSON.parse(fs.readFileSync(file, "utf-8"));
    for (const w of words) {
      insert.run(
        w.id, w.word, w.phonetic || "", w.meaning_vi, w.meaning_en || "",
        w.pos || "", w.level, JSON.stringify(w.categories || []),
        w.frequency || 0, JSON.stringify(w.examples || []),
        JSON.stringify(w.word_family || []), JSON.stringify(w.collocations || []),
        JSON.stringify(w.synonyms || []), JSON.stringify(w.antonyms || []),
        JSON.stringify(w.common_mistakes || []), JSON.stringify(w.grammar_patterns || []),
        w.image || "", w.audio || "", w.created_at || Date.now()
      );
      total++;
    }
    console.log(`${level}: ${words.length} words`);
  }
});
tx();
console.log(`Total imported: ${total} words`);
db.close();
```

- [ ] **Step 2: Add API endpoints to app.ts**

Add to `server/src/app.ts` (after existing vocabulary endpoint):

```typescript
// ── Word Bank API ──
app.get("/api/categories", (_req, res) => {
  const rows = db.prepare('SELECT * FROM categories ORDER BY "order"').all();
  rows.forEach((r: any) => { r.sub_topics = JSON.parse(r.sub_topics || "[]"); });
  res.json(rows);
});

app.get("/api/word-bank", (req, res) => {
  const { level, category } = req.query;
  let sql = "SELECT * FROM word_bank WHERE 1=1";
  const params: any[] = [];
  if (level) { sql += " AND level = ?"; params.push(level); }
  if (category) { sql += " AND categories LIKE ?"; params.push(`%${category}%`); }
  sql += " ORDER BY frequency ASC";
  const rows = db.prepare(sql).all(...params);
  // Parse JSON fields
  const JSON_FIELDS = ["categories", "examples", "word_family", "collocations", "synonyms", "antonyms", "common_mistakes", "grammar_patterns"];
  rows.forEach((r: any) => {
    for (const f of JSON_FIELDS) {
      try { r[f] = JSON.parse(r[f] || "[]"); } catch { r[f] = []; }
    }
  });
  res.json(rows);
});
```

- [ ] **Step 3: Run import + deploy**

```bash
ssh oracle-vps "cd ~/english-buddy && git pull && node server/data/import-word-bank.cjs && pm2 reload english-buddy"
```

Expected: `Total imported: ~8000 words`

- [ ] **Step 4: Test API**

```bash
curl -s "https://en.vev.vn/api/categories" | python3 -c "import json,sys; d=json.load(sys.stdin); print(len(d), 'categories')"
curl -s "https://en.vev.vn/api/word-bank?level=a1&category=daily_life" | python3 -c "import json,sys; d=json.load(sys.stdin); print(len(d), 'words')"
```

Expected: `24 categories`, `~60 words`

- [ ] **Step 5: Commit**

```bash
git add server/data/import-word-bank.cjs server/src/app.ts
git commit -m "feat: word bank import + API endpoints (Phase 1 Task 4)"
```

---

### Task 5: Frontend — replace SEED_TOPICS with categories API

**Files:**
- Create: `src/services/wordBankService.ts` — fetch categories + word bank
- Modify: `src/data/seedTopics.ts` — update to use 24 categories
- Modify: `src/app/App.tsx` — load categories on startup
- Modify: `src/pages/TopicListPage.tsx` — use new categories

**Interfaces:**
- Consumes: `/api/categories`, `/api/word-bank` endpoints from Task 4
- Produces: `getCategories()`, `getWordBank(level, category)` functions — used by all pages

- [ ] **Step 1: Create wordBankService**

Create `src/services/wordBankService.ts`:

```typescript
import { apiRequest } from "./api";

export interface Category {
  id: string;
  name: string;
  name_vi: string;
  order: number;
  sub_topics: string[];
}

export interface BankWord {
  id: string;
  word: string;
  phonetic: string;
  meaning_vi: string;
  meaning_en: string;
  pos: string;
  level: string;
  categories: string[];
  frequency: number;
  examples: { en: string; vi: string }[];
  word_family: string[];
  collocations: string[];
  synonyms: string[];
  antonyms: string[];
  common_mistakes: { wrong: string; correct: string; explain_vi: string }[];
  grammar_patterns: string[];
  image: string;
  audio: string;
}

let cachedCategories: Category[] | null = null;
const wordCache = new Map<string, BankWord[]>();

export async function getCategories(): Promise<Category[]> {
  if (cachedCategories) return cachedCategories;
  const data = await apiRequest<Category[]>("/api/categories");
  cachedCategories = data;
  return data;
}

export async function getWordBank(level?: string, category?: string): Promise<BankWord[]> {
  const key = `${level || "all"}_${category || "all"}`;
  if (wordCache.has(key)) return wordCache.get(key)!;
  const params = new URLSearchParams();
  if (level) params.set("level", level);
  if (category) params.set("category", category);
  const data = await apiRequest<BankWord[]>(`/api/word-bank?${params}`);
  wordCache.set(key, data);
  return data;
}
```

- [ ] **Step 2: Update seedTopics.ts — map old IDs to new**

Replace `src/data/seedTopics.ts` with a mapping file that supports both old topic IDs and new category IDs, so existing pages don't break:

```typescript
import type { Topic } from "../types";

// Old topic ID → new category ID mapping
export const TOPIC_TO_CATEGORY: Record<string, string> = {
  topic_greetings: "daily_life",
  topic_people: "family_and_friends",
  topic_numbers: "measurements_and_numbers",
  topic_family: "family_and_friends",
  topic_colors: "colours_and_shapes",
  topic_house: "house_and_home",
  topic_daily: "daily_life",
  topic_body: "health_and_body",
  topic_animals: "animals_and_nature",
  topic_food: "food_and_drink",
  topic_shopping: "shopping",
  topic_hobbies: "hobbies_and_leisure",
  topic_school: "education",
  topic_transport: "travel_and_transport",
  topic_city: "places",
  topic_weather: "weather_and_seasons",
  topic_sports: "sport",
  topic_feelings: "feelings_and_opinions",
  topic_clothes: "clothes_and_accessories",
  topic_travel: "travel_and_transport",
  topic_jobs: "work_and_jobs",
  topic_entertainment: "entertainment_and_media",
  topic_environment: "environment",
  topic_technology: "communication_and_technology",
  topic_health: "health_and_body",
  topic_communication: "communication_and_technology",
  topic_community: "society_and_community",
  topic_education: "education",
  topic_work: "work_and_jobs",
  topic_society: "society_and_community",
  topic_politics: "society_and_community",
  topic_science: "science_and_research",
  topic_culture: "entertainment_and_media",
  topic_academic: "science_and_research",
  topic_global: "society_and_community",
};

// Keep SEED_TOPICS for backward compatibility — will be removed in Phase 6
export const SEED_TOPICS: Topic[] = [
  // ... existing 24 topics mapped to new categories
  // This array is auto-generated from categories API at build time
];
```

- [ ] **Step 3: Verify build**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/services/wordBankService.ts src/data/seedTopics.ts src/app/App.tsx src/pages/TopicListPage.tsx
git commit -m "feat: frontend word bank service + category mapping (Phase 1 Task 5)"
```

---

### Task 6: Quality assurance — validate & fix word bank

**Files:**
- Create: `server/data/validate-word-bank.cjs` — validation script

**Interfaces:**
- Consumes: `word-bank/*.json` files
- Produces: validated, cleaned word bank data

- [ ] **Step 1: Create validation script**

Create `server/data/validate-word-bank.cjs`:

```javascript
const fs = require("fs");
const path = require("path");

const REQUIRED = ["word", "phonetic", "meaning_vi", "pos", "examples"];

for (const level of ["a1", "a2", "b1", "b2", "c1"]) {
  const file = path.join(__dirname, "word-bank", `${level}.json`);
  if (!fs.existsSync(file)) { console.log(`SKIP: ${level}`); continue; }
  const words = JSON.parse(fs.readFileSync(file, "utf-8"));

  const issues = [];
  const seen = new Set();
  for (const w of words) {
    // Duplicate check
    const key = w.word.toLowerCase();
    if (seen.has(key)) { issues.push(`DUPLICATE: ${w.word}`); continue; }
    seen.add(key);

    // Required fields
    for (const f of REQUIRED) {
      if (!w[f] || (Array.isArray(w[f]) && w[f].length === 0)) {
        issues.push(`MISSING ${f}: ${w.word}`);
      }
    }

    // Phonetic format
    if (w.phonetic && !w.phonetic.startsWith("/")) {
      issues.push(`BAD PHONETIC: ${w.word} → ${w.phonetic}`);
    }
  }

  console.log(`${level}: ${words.length} words, ${issues.length} issues`);
  if (issues.length > 0) {
    issues.slice(0, 10).forEach((i) => console.log(`  ${i}`));
    if (issues.length > 10) console.log(`  ... +${issues.length - 10} more`);
  }
}
```

- [ ] **Step 2: Run validation**

```bash
node data/validate-word-bank.cjs
```

Expected: 0 issues per level. If issues found, re-generate affected categories.

- [ ] **Step 3: Fix any issues with targeted re-generation**

For categories with issues, delete the category file and re-run:

```bash
rm data/word-bank/a1_daily_life.json
node data/generate-word-bank.cjs a1
```

- [ ] **Step 4: Re-import and verify**

```bash
node data/import-word-bank.cjs
```

- [ ] **Step 5: Commit**

```bash
git add server/data/validate-word-bank.cjs server/data/word-bank/
git commit -m "feat: word bank validation + fixes (Phase 1 Task 6)"
```

---

### Task 7: Deploy + end-to-end test

**Files:**
- No new files — deployment and testing only

**Interfaces:**
- Consumes: all previous tasks
- Produces: working word bank on production

- [ ] **Step 1: Full deploy**

```bash
ssh oracle-vps "cd ~/english-buddy && git pull && npm run build && sudo restorecon -Rv ~/english-buddy/dist/ && pm2 reload english-buddy"
```

- [ ] **Step 2: Verify API**

```bash
# Categories
curl -s "https://en.vev.vn/api/categories" | python3 -c "
import json,sys; cats=json.load(sys.stdin)
print(f'{len(cats)} categories')
for c in cats: print(f'  {c[\"id\"]}: {c[\"name_vi\"]}')
"

# Word bank per level
for level in a1 a2 b1 b2 c1; do
  count=$(curl -s "https://en.vev.vn/api/word-bank?level=$level" | python3 -c "import json,sys; print(len(json.load(sys.stdin)))")
  echo "$level: $count words"
done
```

Expected: 24 categories, ~1000/1500/2000/2000/1500 words per level.

- [ ] **Step 3: Verify sample word quality**

```bash
curl -s "https://en.vev.vn/api/word-bank?level=a1&category=daily_life" | python3 -c "
import json,sys
words = json.load(sys.stdin)
for w in words[:5]:
    print(f'{w[\"word\"]} ({w[\"pos\"]}) — {w[\"meaning_vi\"]}')
    print(f'  IPA: {w[\"phonetic\"]}')
    print(f'  Ex: {w[\"examples\"][0][\"en\"] if w[\"examples\"] else \"N/A\"}')
    print(f'  Collocations: {w[\"collocations\"]}')
    print(f'  Mistakes: {w[\"common_mistakes\"]}')
    print()
"
```

Expected: 5 words with all fields populated, natural Vietnamese, IPA phonetic.

- [ ] **Step 4: Commit tag**

```bash
git tag phase1-word-bank-complete
git push --tags
```
