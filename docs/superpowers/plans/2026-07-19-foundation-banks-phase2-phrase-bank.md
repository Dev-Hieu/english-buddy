# Phase 2: Phrase Bank Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a CEFR-standard phrase bank of ~1400 phrases (phrasal verbs, collocations, expressions) across 24 categories and 5 levels, with response + example dialogue fields.

**Architecture:** New DB table `phrase_bank` alongside `word_bank`. DeepSeek generates phrases per level per category. API endpoint `/api/phrase-bank`. Phrases link to Word Bank vocabulary.

**Tech Stack:** SQLite (better-sqlite3), DeepSeek API, TypeScript, Node.js scripts

## Global Constraints

- DB: SQLite, WAL mode, file `server/data.db`
- AI: DeepSeek `deepseek-chat`, max 4000 tokens, 1.5s rate limit
- Levels: a1, a2, b1, b2, c1
- Categories: 24 Cambridge IDs (same as Phase 1)
- Phrase types: `phrasal_verb`, `collocation`, `expression`
- All Vietnamese translations required
- Deploy: `ssh oracle-vps` → git pull → build → pm2 reload

---

### Task 1: Create phrase_bank DB table + generate script

**Files:**
- Create: `server/src/migrations/002-phrase-bank.ts`
- Create: `server/data/generate-phrase-bank.cjs`

- [ ] **Step 1: Create migration**

Create `server/src/migrations/002-phrase-bank.ts`:

```typescript
import { db } from "../db.js";

export function migrate002PhraseBank(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS phrase_bank (
      id TEXT PRIMARY KEY,
      phrase TEXT NOT NULL,
      meaning_vi TEXT NOT NULL,
      type TEXT NOT NULL,
      level TEXT NOT NULL,
      category TEXT NOT NULL,
      examples TEXT DEFAULT '[]',
      collocations TEXT DEFAULT '[]',
      response TEXT DEFAULT '',
      example_dialogue TEXT DEFAULT '[]',
      created_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_pb_level ON phrase_bank(level);
    CREATE INDEX IF NOT EXISTS idx_pb_category ON phrase_bank(category);
  `);
  console.log("Migration 002: phrase_bank table created");
}
```

- [ ] **Step 2: Create generation script**

Create `server/data/generate-phrase-bank.cjs`:

The script should:
- Take level as argument: `node generate-phrase-bank.cjs a1`
- Generate phrases per category using DeepSeek
- Phrases per category per level: A1:8, A2:12, B1:16, B2:12, C1:8
- Save to `server/data/phrase-bank/a1_daily_life.json` etc.
- Combine to `server/data/phrase-bank/a1.json`
- Skip existing files (resumable)

DeepSeek prompt should request for each phrase:
- phrase, meaning_vi, type (phrasal_verb/collocation/expression)
- examples [{en, vi}] (2 examples)
- collocations (related phrases)
- response (natural response if conversational, e.g., "How are you?" → "I'm fine, thanks.")
- example_dialogue [{speaker, text}] (short 2-4 line dialogue using the phrase)
- Vietnamese-specific: natural translations, common usage contexts

- [ ] **Step 3: Run migration on VPS**

```bash
ssh oracle-vps "cd ~/english-buddy && git pull && node -e \"
const db=require('better-sqlite3')('server/data.db');
db.exec('CREATE TABLE IF NOT EXISTS phrase_bank (id TEXT PRIMARY KEY, phrase TEXT NOT NULL, meaning_vi TEXT NOT NULL, type TEXT NOT NULL, level TEXT NOT NULL, category TEXT NOT NULL, examples TEXT DEFAULT \\\"[]\\\", collocations TEXT DEFAULT \\\"[]\\\", response TEXT DEFAULT \\\"\\\", example_dialogue TEXT DEFAULT \\\"[]\\\", created_at INTEGER NOT NULL)');
db.exec('CREATE INDEX IF NOT EXISTS idx_pb_level ON phrase_bank(level)');
db.exec('CREATE INDEX IF NOT EXISTS idx_pb_category ON phrase_bank(category)');
console.log('phrase_bank table created');
db.close();
\""
```

- [ ] **Step 4: Commit**

```bash
git add server/src/migrations/002-phrase-bank.ts server/data/generate-phrase-bank.cjs
git commit -m "feat: phrase_bank schema + generation script (Phase 2 Task 1)"
```

---

### Task 2: Generate all phrases (~1400) via DeepSeek

- [ ] **Step 1: Generate A1 (~200 phrases)**

```bash
cd server && node data/generate-phrase-bank.cjs a1
```

- [ ] **Step 2: Generate A2 (~300)**

```bash
node data/generate-phrase-bank.cjs a2
```

- [ ] **Step 3: Generate B1 (~400)**

```bash
node data/generate-phrase-bank.cjs b1
```

- [ ] **Step 4: Generate B2 (~300)**

```bash
node data/generate-phrase-bank.cjs b2
```

- [ ] **Step 5: Generate C1 (~200)**

```bash
node data/generate-phrase-bank.cjs c1
```

- [ ] **Step 6: Verify counts**

```bash
for level in a1 a2 b1 b2 c1; do
  echo "$level: $(node -e "console.log(require('./data/phrase-bank/$level.json').length)") phrases"
done
```

- [ ] **Step 7: Commit**

```bash
git add server/data/phrase-bank/
git commit -m "feat: generate phrase bank A1-C1 (~1400 phrases) (Phase 2 Task 2)"
```

---

### Task 3: Import + API endpoint + deploy

- [ ] **Step 1: Create import script**

Create `server/data/import-phrase-bank.cjs` — reads phrase-bank/*.json, inserts into phrase_bank table.

- [ ] **Step 2: Add API endpoint**

Add to `server/src/app.ts`:

```typescript
app.get("/api/phrase-bank", (req, res) => {
  const { level, category, type } = req.query;
  let sql = "SELECT * FROM phrase_bank WHERE 1=1";
  const params: any[] = [];
  if (level && typeof level === "string") { sql += " AND level = ?"; params.push(level); }
  if (category && typeof category === "string") { sql += " AND category = ?"; params.push(category); }
  if (type && typeof type === "string") { sql += " AND type = ?"; params.push(type); }
  sql += " ORDER BY phrase ASC";
  const rows = db.prepare(sql).all(...params);
  ["examples", "collocations", "example_dialogue"].forEach(f => {
    rows.forEach((r: any) => { try { r[f] = JSON.parse(r[f] || "[]"); } catch { r[f] = []; } });
  });
  res.json(rows);
});
```

- [ ] **Step 3: Deploy + test**

```bash
git push
ssh oracle-vps "cd ~/english-buddy && git fetch origin --force && git reset --hard origin/main && node server/data/import-phrase-bank.cjs && npm run build && sudo restorecon -Rv ~/english-buddy/dist/ && pm2 reload english-buddy"
```

Test:
```bash
curl -s "https://en.vev.vn/api/phrase-bank?level=a1" | python3 -c "import json,sys; print(len(json.load(sys.stdin)), 'phrases')"
curl -s "https://en.vev.vn/api/phrase-bank?level=a1&category=daily_life" | python3 -c "import json,sys; d=json.load(sys.stdin); [print(p['phrase'],'→',p['meaning_vi']) for p in d[:5]]"
```

- [ ] **Step 4: Commit + tag**

```bash
git add server/data/import-phrase-bank.cjs server/src/app.ts
git commit -m "feat: phrase bank import + API (Phase 2 Task 3)"
git tag phase2-phrase-bank-complete
git push --tags
```
