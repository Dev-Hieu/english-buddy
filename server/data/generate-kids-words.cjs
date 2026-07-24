#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const https = require("https");

const API_KEY = "sk-e2c99bc4e1ee44ea8c918edcc2ef9bac";
const WORD_BANK_DIR = path.join(__dirname, "word-bank");

async function callDeepSeek(systemPrompt, userPrompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.5,
      max_tokens: 8000,
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
          reject(new Error("Parse error: " + data.slice(0, 300)));
        }
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

function extractJSON(text) {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (match) return match[1].trim();
  const arrMatch = text.match(/\[[\s\S]*\]/);
  if (arrMatch) return arrMatch[0];
  return text.trim();
}

const KIDS_WORD_CATEGORIES = [
  { cat: "animals_and_nature", words: "cat, dog, bird, fish, rabbit, horse, cow, pig, duck, bee, flower, tree, sun, moon, star, rain, grass, leaf, butterfly, frog, snake, lion, elephant, monkey, turtle" },
  { cat: "colours_and_shapes", words: "red, blue, green, yellow, pink, orange, purple, white, black, brown, circle, square, triangle, star, heart, rectangle, oval, diamond, big, small, round, long, short, tall, wide" },
  { cat: "daily_life", words: "hello, bye, eat, sleep, play, go, come, sit, stand, run, wash, brush, wake, drink, talk, walk, smile, open, close, help" },
  { cat: "education", words: "teacher, school, book, pen, pencil, eraser, ruler, paper, class, desk, learn, read, write, draw, color, count, study, bag, crayon, scissors" },
  { cat: "family_and_friends", words: "mom, dad, sister, brother, friend, baby, grandma, grandpa, uncle, aunt, family, love, hug, kiss, child, boy, girl, son, daughter, cousin" },
  { cat: "food_and_drink", words: "apple, milk, water, cake, bread, rice, egg, juice, banana, cookie, orange, grape, candy, soup, pizza, noodle, fish, meat, carrot, ice cream" },
  { cat: "health_and_body", words: "head, hand, eye, nose, mouth, ear, leg, foot, arm, finger, happy, sad, sick, cry, laugh, smile, tired, hungry, thirsty, sleep" },
  { cat: "hobbies_and_leisure", words: "play, run, jump, swim, sing, dance, draw, paint, game, toy, ball, bike, kite, puzzle, book, music, TV, park, garden, fun" },
  { cat: "house_and_home", words: "bed, door, table, chair, window, room, kitchen, bathroom, sofa, lamp, floor, wall, roof, garden, stairs, toilet, bath, cup, plate, spoon" },
  { cat: "measurements_and_numbers", words: "one, two, three, four, five, six, seven, eight, nine, ten, big, small, tall, short, many, few, long, heavy, light, full" },
  { cat: "clothes_and_accessories", words: "shirt, shoes, hat, pants, dress, socks, bag, coat, gloves, scarf, jacket, skirt, boots, sandals, button, zip, pocket, sleeve, hood, uniform" },
  { cat: "weather_and_seasons", words: "hot, cold, rain, sun, cloud, wind, snow, warm, umbrella, rainbow, storm, fog, spring, summer, autumn, winter, sunny, rainy, windy, cool" },
];

const SYSTEM_PROMPT = `You are creating a children's English vocabulary list for ages 5-8 (Pre-A1/Kids level).
Return ONLY a valid JSON array. No markdown, no explanation, no extra text.
Keep sentences very short (4-6 words). Use "con" in Vietnamese where a child speaks.`;

async function generateCategory({ cat, words }) {
  const outFile = path.join(WORD_BANK_DIR, `kids_${cat}.json`);
  if (fs.existsSync(outFile)) {
    const existing = JSON.parse(fs.readFileSync(outFile, "utf8"));
    console.log(`[SKIP] kids_${cat}.json (${existing.length} words)`);
    return existing.length;
  }

  const wordList = words.split(", ");
  const n = wordList.length;

  const prompt = `Create a vocabulary list for children aged 5-8 for the category "${cat}".
Use exactly these ${n} words (in this order): ${words}

Return a JSON array of ${n} objects. Each object:
{
  "id": "wb_kids_${cat}_001",
  "word": "cat",
  "phonetic": "/kæt/",
  "meaning_vi": "con mèo",
  "meaning_en": "a small pet animal",
  "pos": "noun",
  "level": "kids",
  "categories": ["${cat}"],
  "frequency": 1,
  "examples": [{"en": "I see a cat.", "vi": "Con thấy một con mèo."}],
  "word_family": [],
  "collocations": ["a cat", "my cat"],
  "synonyms": [],
  "antonyms": [],
  "common_mistakes": [],
  "grammar_patterns": ["a cat", "the cat"],
  "image": "",
  "audio": "",
  "created_at": 1721433600000
}

IDs: wb_kids_${cat}_001 to wb_kids_${cat}_${String(n).padStart(3,"0")}
Return ONLY the JSON array. No markdown. No extra text.`;

  console.log(`Generating ${n} words for: ${cat}...`);
  const raw = await callDeepSeek(SYSTEM_PROMPT, prompt);
  const jsonStr = extractJSON(raw);
  const parsed = JSON.parse(jsonStr);
  fs.writeFileSync(outFile, JSON.stringify(parsed, null, 2));
  console.log(`  [OK] kids_${cat}.json — ${parsed.length} words`);
  return parsed.length;
}

async function main() {
  let total = 0;
  for (const item of KIDS_WORD_CATEGORIES) {
    try {
      const count = await generateCategory(item);
      total += count;
    } catch (e) {
      console.error(`  [ERR] ${item.cat}: ${e.message.slice(0, 100)}`);
    }
    await new Promise(r => setTimeout(r, 800));
  }
  console.log(`\nTotal words generated: ${total}`);
}

main().catch(console.error);
