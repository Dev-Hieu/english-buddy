#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const https = require("https");

const API_KEY = "sk-e2c99bc4e1ee44ea8c918edcc2ef9bac";
const WORD_BANK_DIR = path.join(__dirname, "word-bank");
const PHRASE_BANK_DIR = path.join(__dirname, "phrase-bank");
const CONV_BANK_DIR = path.join(__dirname, "conversation-bank");

async function callDeepSeek(systemPrompt, userPrompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    });

    const options = {
      hostname: "api.deepseek.com",
      path: "/chat/completions",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) return reject(new Error(parsed.error.message));
          resolve(parsed.choices[0].message.content);
        } catch (e) {
          reject(new Error("Parse error: " + data.slice(0, 200)));
        }
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

function extractJSON(text) {
  // Extract JSON array from markdown code blocks or raw text
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (match) return match[1].trim();
  // Try to find a JSON array directly
  const arrMatch = text.match(/\[[\s\S]*\]/);
  if (arrMatch) return arrMatch[0];
  return text.trim();
}

const KIDS_WORD_CATEGORIES = [
  "animals_and_nature",
  "colours_and_shapes",
  "daily_life",
  "education",
  "family_and_friends",
  "food_and_drink",
  "health_and_body",
  "hobbies_and_leisure",
  "house_and_home",
  "measurements_and_numbers",
  "clothes_and_accessories",
  "weather_and_seasons",
];

const KIDS_PHRASE_CATEGORIES = [
  "daily_life",
  "education",
  "family_and_friends",
  "food_and_drink",
  "health_and_body",
  "hobbies_and_leisure",
  "animals_and_nature",
  "colours_and_shapes",
  "house_and_home",
  "clothes_and_accessories",
];

const WORD_SYSTEM_PROMPT = `You are an expert English teacher creating vocabulary for very young children aged 5-8 (Pre-A1 level).
Your job is to generate simple English vocabulary words with Vietnamese translations suitable for young children.
Rules:
- Words must be very simple, familiar to 5-8 year olds
- Vietnamese uses "con" (child-friendly) where appropriate
- Examples must be very short (3-5 words)
- Return ONLY a valid JSON array, no markdown, no explanation`;

function wordUserPrompt(category) {
  const examples = {
    animals_and_nature: "cat, dog, bird, fish, tree, flower, sun, rain",
    colours_and_shapes: "red, blue, circle, star, green, yellow, square, triangle",
    daily_life: "hello, bye, eat, sleep, play, go, come, sit, stand, run",
    education: "teacher, school, book, pen, learn, read, write, draw, class",
    family_and_friends: "mom, dad, sister, brother, friend, baby, grandma, grandpa",
    food_and_drink: "apple, milk, water, cake, bread, rice, egg, juice, banana, cookie",
    health_and_body: "head, hand, eye, nose, mouth, ear, leg, foot, happy, sad, sick, cry",
    hobbies_and_leisure: "play, run, jump, swim, sing, dance, draw, paint, game, toy",
    house_and_home: "bed, door, table, chair, window, room, kitchen, toilet, sofa, lamp",
    measurements_and_numbers: "one, two, three, big, small, tall, short, many, few, long",
    clothes_and_accessories: "shirt, shoes, hat, pants, dress, socks, bag, coat, gloves",
    weather_and_seasons: "hot, cold, rain, sun, cloud, wind, snow, warm, umbrella",
  };
  return `Generate exactly 25 vocabulary words for young children (age 5-8, Pre-A1) in the category: ${category}
Example words for this category: ${examples[category] || "simple, common words"}

Return a JSON array of 25 objects. Each object must follow this EXACT structure:
[
  {
    "id": "wb_kids_${category}_001",
    "word": "cat",
    "phonetic": "/kæt/",
    "meaning_vi": "con mèo",
    "meaning_en": "a small pet animal",
    "pos": "noun",
    "level": "kids",
    "categories": ["${category}"],
    "frequency": 1,
    "examples": [{"en": "I have a cat.", "vi": "Con có một con mèo."}],
    "word_family": [],
    "collocations": ["pet cat", "black cat"],
    "synonyms": ["kitty"],
    "antonyms": [],
    "common_mistakes": [{"wrong": "a cats", "correct": "a cat", "explain_vi": "Sau 'a' dùng danh từ số ít"}],
    "grammar_patterns": ["a cat", "the cat"],
    "image": "",
    "audio": "",
    "created_at": 1721433600000
  }
]

Rules:
- 25 unique, simple words a child age 5-8 would know
- Meaning_vi uses "con" (child form) where natural
- Examples: very short sentences (3-5 words), child-friendly
- IDs: wb_kids_${category}_001 through wb_kids_${category}_025
- Return ONLY the JSON array`;
}

const PHRASE_SYSTEM_PROMPT = `You are an expert English teacher creating phrases for very young children aged 5-8 (Pre-A1 level).
Rules:
- Phrases must be very simple, ones a 5-8 year old would use daily
- Vietnamese uses "con" for child speaking to adult, "bạn" for child to child
- Example sentences: very short, 3-6 words
- Return ONLY a valid JSON array, no markdown, no explanation`;

function phraseUserPrompt(category) {
  return `Generate exactly 10 simple English phrases for young children (age 5-8, Pre-A1) in the category: ${category}

Return a JSON array of 10 objects with this EXACT structure:
[
  {
    "phrase": "Good morning",
    "meaning_vi": "Chào buổi sáng",
    "type": "expression",
    "level": "kids",
    "category": "${category}",
    "examples": [{"en": "Good morning, teacher!", "vi": "Chào buổi sáng, cô giáo!"}],
    "collocations": [],
    "response": "Good morning!",
    "example_dialogue": [
      {"speaker": "A", "text": "Good morning!"},
      {"speaker": "B", "text": "Good morning! How are you?"}
    ]
  }
]

Rules:
- 10 unique, simple phrases a child age 5-8 would use
- Types: "expression", "question", "request", "greeting"
- Keep it child-friendly and practical
- Return ONLY the JSON array`;
}

const CONV_SYSTEM_PROMPT = `You are an expert English teacher creating conversation scenarios for very young children aged 5-8 (Pre-A1 level).
Rules:
- Very simple dialogues, 4-6 turns
- Sentences: 3-6 words max
- Vietnamese uses "con" for child speaking to adult
- Return ONLY a valid JSON array`;

const CONV_SCENARIOS = [
  { scenario: "Greeting a friend at school", scenario_vi: "Chào bạn ở trường", category: "education", roles: ["Child A", "Child B"] },
  { scenario: "Asking the teacher a question", scenario_vi: "Hỏi cô giáo", category: "education", roles: ["Child", "Teacher"] },
  { scenario: "Talking with mom at home", scenario_vi: "Nói chuyện với mẹ ở nhà", category: "family_and_friends", roles: ["Child", "Mom"] },
  { scenario: "Playing with friends", scenario_vi: "Chơi với bạn bè", category: "hobbies_and_leisure", roles: ["Child A", "Child B"] },
  { scenario: "Eating lunch", scenario_vi: "Ăn trưa", category: "food_and_drink", roles: ["Child", "Mom"] },
  { scenario: "At the park", scenario_vi: "Ở công viên", category: "hobbies_and_leisure", roles: ["Child", "Dad"] },
  { scenario: "Going to bed", scenario_vi: "Đi ngủ", category: "daily_life", roles: ["Child", "Mom"] },
  { scenario: "Shopping with mom", scenario_vi: "Đi mua sắm với mẹ", category: "food_and_drink", roles: ["Child", "Mom"] },
  { scenario: "At the zoo", scenario_vi: "Ở vườn thú", category: "animals_and_nature", roles: ["Child", "Dad"] },
  { scenario: "Birthday party", scenario_vi: "Tiệc sinh nhật", category: "daily_life", roles: ["Birthday Child", "Friend"] },
];

async function generateWordBank() {
  console.log("\n=== Generating Kids Word Bank ===");
  for (const category of KIDS_WORD_CATEGORIES) {
    const outFile = path.join(WORD_BANK_DIR, `kids_${category}.json`);
    if (fs.existsSync(outFile)) {
      console.log(`[SKIP] kids_${category}.json already exists`);
      continue;
    }
    console.log(`Generating words for: ${category}...`);
    try {
      const raw = await callDeepSeek(WORD_SYSTEM_PROMPT, wordUserPrompt(category));
      const jsonStr = extractJSON(raw);
      const words = JSON.parse(jsonStr);
      fs.writeFileSync(outFile, JSON.stringify(words, null, 2));
      console.log(`  [OK] kids_${category}.json — ${words.length} words`);
    } catch (e) {
      console.error(`  [ERR] ${category}: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 1000)); // rate limit
  }
}

async function generatePhraseBank() {
  console.log("\n=== Generating Kids Phrase Bank ===");
  for (const category of KIDS_PHRASE_CATEGORIES) {
    const outFile = path.join(PHRASE_BANK_DIR, `kids_${category}.json`);
    if (fs.existsSync(outFile)) {
      console.log(`[SKIP] kids_${category}.json already exists`);
      continue;
    }
    console.log(`Generating phrases for: ${category}...`);
    try {
      const raw = await callDeepSeek(PHRASE_SYSTEM_PROMPT, phraseUserPrompt(category));
      const jsonStr = extractJSON(raw);
      const phrases = JSON.parse(jsonStr);
      fs.writeFileSync(outFile, JSON.stringify(phrases, null, 2));
      console.log(`  [OK] kids_${category}.json — ${phrases.length} phrases`);
    } catch (e) {
      console.error(`  [ERR] ${category}: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 1000));
  }
}

async function generateConversationBank() {
  console.log("\n=== Generating Kids Conversation Bank ===");

  const convPrompt = `Generate 10 simple conversation scenarios for young children (age 5-8, Pre-A1).
Each scenario has 4-6 dialogue turns, very simple sentences (3-6 words each).

The scenarios (in order) are:
${CONV_SCENARIOS.map((s, i) => `${i+1}. ${s.scenario}`).join("\n")}

Return a JSON array of 10 objects with this EXACT structure:
[
  {
    "scenario": "Greeting a friend at school",
    "scenario_vi": "Chào bạn ở trường",
    "category": "education",
    "level": "kids",
    "roles": ["Child A", "Child B"],
    "dialogue": [
      {"role": "Child A", "en": "Hello! What is your name?", "vi": "Xin chào! Bạn tên gì?"},
      {"role": "Child B", "en": "My name is Tom.", "vi": "Tên mình là Tom."},
      {"role": "Child A", "en": "Nice to meet you, Tom!", "vi": "Rất vui được gặp bạn, Tom!"},
      {"role": "Child B", "en": "Nice to meet you too!", "vi": "Mình cũng vậy!"}
    ],
    "key_phrases": ["Hello!", "What is your name?", "My name is...", "Nice to meet you!"],
    "key_vocab": ["hello", "name", "nice", "meet"],
    "grammar_points": ["My name is...", "What is your...?"]
  }
]

Rules:
- Sentences: very short, 3-7 words max
- Child speaking to adult uses "con" in Vietnamese
- Child speaking to child uses "mình/bạn" in Vietnamese
- Return ONLY the JSON array`;

  const outFile = path.join(CONV_BANK_DIR, "kids_scenarios.json");
  if (fs.existsSync(outFile)) {
    console.log("[SKIP] kids_scenarios.json already exists");
    return;
  }

  try {
    const raw = await callDeepSeek(CONV_SYSTEM_PROMPT, convPrompt);
    const jsonStr = extractJSON(raw);
    const scenarios = JSON.parse(jsonStr);

    // Save as individual category files for import script compatibility
    const byCategory = {};
    for (const s of scenarios) {
      const cat = s.category || "daily_life";
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(s);
    }

    for (const [cat, list] of Object.entries(byCategory)) {
      const f = path.join(CONV_BANK_DIR, `kids_${cat}.json`);
      // If file already exists, append
      let existing = [];
      if (fs.existsSync(f)) existing = JSON.parse(fs.readFileSync(f, "utf8"));
      fs.writeFileSync(f, JSON.stringify([...existing, ...list], null, 2));
      console.log(`  [OK] kids_${cat}.json — ${list.length} scenarios`);
    }

    // Also save combined for reference
    fs.writeFileSync(outFile, JSON.stringify(scenarios, null, 2));
    console.log(`[OK] Total: ${scenarios.length} scenarios`);
  } catch (e) {
    console.error(`[ERR] conversation bank: ${e.message}`);
  }
}

async function main() {
  await generateWordBank();
  await generatePhraseBank();
  await generateConversationBank();
  console.log("\n=== Done! ===");
}

main().catch(console.error);
