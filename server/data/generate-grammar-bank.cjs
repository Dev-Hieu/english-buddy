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
const OUTPUT_DIR = path.join(__dirname, "grammar-bank");

// Grammar topics per level
const TOPICS_BY_LEVEL = {
  a1: [
    { title: "To Be", title_vi: "Động từ 'to be'", category: "tenses" },
    { title: "Present Simple", title_vi: "Thì hiện tại đơn", category: "tenses" },
    { title: "Present Continuous", title_vi: "Thì hiện tại tiếp diễn", category: "tenses" },
    { title: "There Is / There Are", title_vi: "There is / There are", category: "sentence_structure" },
    { title: "Imperatives", title_vi: "Câu mệnh lệnh", category: "sentence_structure" },
    { title: "Possessives", title_vi: "Sở hữu cách", category: "pronouns" },
    { title: "Articles: A / An / The", title_vi: "Mạo từ a / an / the", category: "articles_determiners" },
    { title: "Plural Nouns", title_vi: "Danh từ số nhiều", category: "word_formation" },
    { title: "Demonstratives: This / That / These / Those", title_vi: "Từ chỉ định: This / That / These / Those", category: "pronouns" },
    { title: "Can (Ability)", title_vi: "Can – diễn đạt khả năng", category: "modals" },
    { title: "Prepositions of Place", title_vi: "Giới từ chỉ nơi chốn", category: "prepositions" },
    { title: "Prepositions of Time", title_vi: "Giới từ chỉ thời gian", category: "prepositions" },
    { title: "Have Got", title_vi: "Have got – sở hữu", category: "tenses" },
    { title: "Countable and Uncountable Nouns", title_vi: "Danh từ đếm được và không đếm được", category: "articles_determiners" },
    { title: "Question Words (Wh-)", title_vi: "Từ để hỏi (Wh-)", category: "sentence_structure" },
  ],
  a2: [
    { title: "Past Simple (Regular & Irregular)", title_vi: "Thì quá khứ đơn", category: "tenses" },
    { title: "Past Continuous", title_vi: "Thì quá khứ tiếp diễn", category: "tenses" },
    { title: "Going To (Future)", title_vi: "Going to – kế hoạch tương lai", category: "tenses" },
    { title: "Will (Future)", title_vi: "Will – tương lai đơn", category: "tenses" },
    { title: "Comparatives", title_vi: "So sánh hơn", category: "word_formation" },
    { title: "Superlatives", title_vi: "So sánh nhất", category: "word_formation" },
    { title: "Adverbs of Frequency", title_vi: "Trạng từ chỉ tần suất", category: "sentence_structure" },
    { title: "First Conditional", title_vi: "Câu điều kiện loại 1", category: "sentence_structure" },
    { title: "Could / Couldn't", title_vi: "Could / Couldn't – khả năng trong quá khứ", category: "modals" },
    { title: "Should / Shouldn't", title_vi: "Should / Shouldn't – lời khuyên", category: "modals" },
    { title: "Have To / Don't Have To", title_vi: "Have to / Don't have to – bắt buộc", category: "modals" },
    { title: "Present Perfect (Basic)", title_vi: "Thì hiện tại hoàn thành (cơ bản)", category: "tenses" },
    { title: "Too / Enough", title_vi: "Too / Enough", category: "sentence_structure" },
    { title: "So / Because", title_vi: "So / Because – liên từ nguyên nhân – kết quả", category: "connectors" },
    { title: "Object Pronouns", title_vi: "Đại từ tân ngữ", category: "pronouns" },
  ],
  b1: [
    { title: "Present Perfect vs Past Simple", title_vi: "Hiện tại hoàn thành vs Quá khứ đơn", category: "tenses" },
    { title: "Present Perfect Continuous", title_vi: "Thì hiện tại hoàn thành tiếp diễn", category: "tenses" },
    { title: "Past Perfect", title_vi: "Thì quá khứ hoàn thành", category: "tenses" },
    { title: "Second Conditional", title_vi: "Câu điều kiện loại 2", category: "sentence_structure" },
    { title: "Passive Voice (Present & Past)", title_vi: "Câu bị động (hiện tại & quá khứ)", category: "sentence_structure" },
    { title: "Modals of Obligation (Must / Have To)", title_vi: "Modal bắt buộc: Must / Have To", category: "modals" },
    { title: "Modals of Possibility (May / Might / Could)", title_vi: "Modal khả năng: May / Might / Could", category: "modals" },
    { title: "Relative Clauses (Who / Which / That)", title_vi: "Mệnh đề quan hệ (Who / Which / That)", category: "sentence_structure" },
    { title: "Reported Speech (Basic)", title_vi: "Lời nói gián tiếp (cơ bản)", category: "sentence_structure" },
    { title: "Used To", title_vi: "Used to – thói quen trong quá khứ", category: "tenses" },
    { title: "Gerund vs Infinitive", title_vi: "Danh động từ vs Động từ nguyên thể", category: "word_formation" },
    { title: "Wish + Past Simple", title_vi: "Wish + quá khứ đơn (ước muốn hiện tại)", category: "sentence_structure" },
    { title: "Quantifiers (Some / Any / Much / Many / A lot of)", title_vi: "Từ chỉ số lượng", category: "articles_determiners" },
    { title: "Phrasal Verb Patterns", title_vi: "Cấu trúc động từ ghép (phrasal verbs)", category: "word_formation" },
    { title: "Linking Words (However / Although / Despite)", title_vi: "Từ nối (tương phản)", category: "connectors" },
  ],
  b2: [
    { title: "Third Conditional", title_vi: "Câu điều kiện loại 3", category: "sentence_structure" },
    { title: "Mixed Conditionals", title_vi: "Câu điều kiện hỗn hợp", category: "sentence_structure" },
    { title: "Passive Voice (All Tenses)", title_vi: "Câu bị động (tất cả thì)", category: "sentence_structure" },
    { title: "Reported Speech (Advanced)", title_vi: "Lời nói gián tiếp (nâng cao)", category: "sentence_structure" },
    { title: "Relative Clauses (Advanced)", title_vi: "Mệnh đề quan hệ nâng cao (Non-defining / Reduced)", category: "sentence_structure" },
    { title: "Wish / If Only (All Forms)", title_vi: "Wish / If Only (tất cả dạng)", category: "sentence_structure" },
    { title: "Causative: Have / Get Something Done", title_vi: "Cấu trúc nhờ vả: Have / Get Something Done", category: "sentence_structure" },
    { title: "Future Perfect", title_vi: "Thì tương lai hoàn thành", category: "tenses" },
    { title: "Future Continuous", title_vi: "Thì tương lai tiếp diễn", category: "tenses" },
    { title: "Inversion (Basic)", title_vi: "Đảo ngữ cơ bản", category: "sentence_structure" },
    { title: "Cleft Sentences", title_vi: "Câu tách (It is... that...)", category: "sentence_structure" },
    { title: "Participle Clauses", title_vi: "Mệnh đề phân từ", category: "sentence_structure" },
    { title: "Narrative Tenses", title_vi: "Thì tường thuật (Past Simple / Past Continuous / Past Perfect)", category: "tenses" },
    { title: "Emphasis Structures", title_vi: "Cấu trúc nhấn mạnh", category: "sentence_structure" },
    { title: "Formal vs Informal Register", title_vi: "Văn phong trang trọng và thân mật", category: "connectors" },
  ],
  c1: [
    { title: "Inversion (Advanced)", title_vi: "Đảo ngữ nâng cao (Not only... but also, Rarely, Never)", category: "sentence_structure" },
    { title: "Cleft Sentences (Advanced)", title_vi: "Câu tách nâng cao", category: "sentence_structure" },
    { title: "Mixed Conditionals (Advanced)", title_vi: "Điều kiện hỗn hợp phức tạp", category: "sentence_structure" },
    { title: "Subjunctive Mood", title_vi: "Thức giả định (Subjunctive)", category: "sentence_structure" },
    { title: "Nominal Clauses", title_vi: "Mệnh đề danh ngữ", category: "sentence_structure" },
    { title: "Ellipsis and Substitution", title_vi: "Tỉnh lược và thay thế", category: "connectors" },
    { title: "Advanced Passive Structures", title_vi: "Cấu trúc bị động nâng cao", category: "sentence_structure" },
    { title: "Discourse Markers", title_vi: "Từ nối diễn ngôn (Discourse Markers)", category: "connectors" },
    { title: "Hedging Language", title_vi: "Ngôn ngữ dè dặt / không chắc chắn", category: "connectors" },
    { title: "Advanced Modal Verbs", title_vi: "Modal nâng cao (Must have / Should have / Needn't have)", category: "modals" },
  ],
};

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
// Build prompt for a batch of topics
// ---------------------------------------------------------------------------
function buildPrompt(level, topics) {
  const levelDescriptions = {
    a1: "absolute beginner (CEFR A1)",
    a2: "elementary (CEFR A2)",
    b1: "intermediate (CEFR B1)",
    b2: "upper-intermediate (CEFR B2)",
    c1: "advanced (CEFR C1)",
  };

  const topicList = topics
    .map((t, i) => `${i + 1}. "${t.title}" (${t.title_vi}) [category: ${t.category}]`)
    .join("\n");

  return `You are an expert English grammar teacher specializing in teaching Vietnamese learners.

Generate grammar bank data for the following ${topics.length} grammar topics at ${levelDescriptions[level]} level:

${topicList}

CRITICAL REQUIREMENTS:
- common_mistakes MUST be specific to Vietnamese learners (e.g., missing articles because Vietnamese has none, wrong tense due to Vietnamese being tenseless, word order errors, confusion between similar structures)
- rules: 3-5 clear grammar rules with English + Vietnamese examples
- exercises: include ALL 3 types: fill_in, multiple_choice, error_correction (3-5 total)
- Vietnamese translations must be natural, not word-for-word
- Examples must be realistic and practical

Return a JSON object with key "topics" containing an array of exactly ${topics.length} objects. Each object MUST follow this exact schema:

{
  "title": "Present Simple",
  "title_vi": "Thì hiện tại đơn",
  "level": "${level}",
  "category": "tenses",
  "description_vi": "Dùng để nói về thói quen, sự thật hiển nhiên, lịch trình cố định",
  "rules": [
    {
      "rule": "S + V(s/es) + O (khẳng định)",
      "example_en": "She gets up at 7 every day.",
      "example_vi": "Cô ấy thức dậy lúc 7 giờ mỗi ngày."
    }
  ],
  "common_mistakes": [
    {
      "wrong": "She get up early.",
      "correct": "She gets up early.",
      "explain_vi": "Ngôi thứ 3 số ít (he/she/it) phải thêm -s/-es vào động từ"
    }
  ],
  "related_vocab": ["always", "usually", "sometimes", "never", "every day"],
  "related_phrases": ["get up", "go to school", "have breakfast"],
  "exercises": [
    {
      "type": "fill_in",
      "question": "She ___ (go) to school every day.",
      "answer": "goes",
      "explain_vi": "Ngôi thứ 3 số ít → thêm -es (go → goes)"
    },
    {
      "type": "multiple_choice",
      "question": "They ___ English very well.",
      "options": ["speaks", "speak", "speaking", "is speak"],
      "answer": 1,
      "explain_vi": "They là ngôi thứ 3 số nhiều → dùng nguyên thể 'speak'"
    },
    {
      "type": "error_correction",
      "question": "He don't like fish.",
      "answer": "He doesn't like fish.",
      "explain_vi": "Ngôi thứ 3 số ít dùng 'doesn't' thay vì 'don't'"
    }
  ]
}

IMPORTANT:
- Return all ${topics.length} topics in the "topics" array
- Each topic must have: rules (3-5), common_mistakes (2-4), exercises (3-5 with all 3 types), related_vocab (4-6 words), related_phrases (3-5 phrases)
- For multiple_choice exercises: "answer" is the 0-based index of the correct option
- Return ONLY valid JSON, no markdown code blocks`;
}

// ---------------------------------------------------------------------------
// Single API call with retry
// ---------------------------------------------------------------------------
async function callDeepSeek(level, topics) {
  const body = {
    model: "deepseek-chat",
    messages: [{ role: "user", content: buildPrompt(level, topics) }],
    response_format: { type: "json_object" },
    temperature: 0.7,
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
  if (parsed.topics && Array.isArray(parsed.topics)) return parsed.topics;
  const arrayKey = Object.keys(parsed).find((k) => Array.isArray(parsed[k]));
  if (arrayKey) return parsed[arrayKey];
  throw new Error(`Unexpected response shape: ${JSON.stringify(parsed).slice(0, 200)}`);
}

async function callWithRetry(level, topics, attempt = 0) {
  try {
    return await callDeepSeek(level, topics);
  } catch (err) {
    if (attempt >= 2) throw err;
    console.warn(`  [WARN] Attempt ${attempt + 1} failed: ${err.message}. Retrying in 5s...`);
    await sleep(5000);
    return callWithRetry(level, topics, attempt + 1);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const level = (process.argv[2] || "").toLowerCase();
  const topics = TOPICS_BY_LEVEL[level];

  if (!topics) {
    console.error(`Usage: node generate-grammar-bank.cjs <level>`);
    console.error(`  level must be one of: ${Object.keys(TOPICS_BY_LEVEL).join(", ")}`);
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const outFile = path.join(OUTPUT_DIR, `${level}.json`);
  if (fs.existsSync(outFile)) {
    const existing = JSON.parse(fs.readFileSync(outFile, "utf8"));
    console.log(`[SKIP] ${outFile} already exists (${existing.length} topics). Delete to regenerate.`);
    return;
  }

  console.log(`\n=== Generating ${level.toUpperCase()} grammar bank (${topics.length} topics) ===\n`);

  // Split into 2 batches to avoid hitting token limits
  const mid = Math.ceil(topics.length / 2);
  const batches = [topics.slice(0, mid), topics.slice(mid)];
  const allTopics = [];

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`  [BATCH ${i + 1}/${batches.length}] Generating ${batch.length} topics: ${batch.map(t => t.title).join(", ")}`);
    try {
      const result = await callWithRetry(level, batch);
      // Merge category from our topic list since AI might get it wrong
      const merged = result.map((t, idx) => ({
        ...t,
        level,
        category: batch[idx]?.category || t.category,
        title: batch[idx]?.title || t.title,
        title_vi: batch[idx]?.title_vi || t.title_vi,
      }));
      allTopics.push(...merged);
      console.log(`  [OK] Batch ${i + 1}: got ${result.length} topics`);
    } catch (err) {
      console.error(`  [ERR] Batch ${i + 1} failed permanently: ${err.message}`);
    }
    if (i < batches.length - 1) await sleep(2000);
  }

  fs.writeFileSync(outFile, JSON.stringify(allTopics, null, 2), "utf8");
  console.log(`\n=== Done: ${allTopics.length} topics saved to ${outFile} ===\n`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
