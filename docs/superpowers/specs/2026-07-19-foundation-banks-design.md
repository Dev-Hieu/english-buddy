# English Buddy — Foundation Banks Redesign

## Overview

Xây dựng 4 ngân hàng nội dung nền tảng chuẩn CEFR làm cốt lõi cho toàn bộ app. Mọi kỹ năng (Nghe, Nói, Đọc, Viết), video bổ trợ, và thi chứng chỉ đều dùng chung ngân hàng này.

### Nguyên tắc

- **Hai con đường học, một hồ sơ thống nhất**: Lộ trình nền tảng (core) + Video bổ trợ (BBC/Little Fox), gộp vào 1 hồ sơ cá nhân
- **24 categories chuẩn Cambridge**: thay thế 35 topics hiện tại
- **Tuần tự A → B → C → D**: mỗi ngân hàng dùng output ngân hàng trước
- **AI curate**: DeepSeek kiểm tra chất lượng mỗi mục

---

## Ngân hàng A: Từ vựng (Word Bank)

### Nguồn

English Vocabulary Profile + Oxford 3000/5000 + Cambridge A2 Key/B1 Preliminary wordlists + AI curate.

### Quy mô

~8000 từ × 5 levels:

| Level | Số từ |
|-------|-------|
| A1 | ~1000 |
| A2 | ~1500 |
| B1 | ~2000 |
| B2 | ~2000 |
| C1 | ~1500 |

### 24 Categories

| # | Category | Sub-topics |
|---|----------|-----------|
| 1 | Animals and Nature | Animals, Pets, Natural world |
| 2 | Clothes and Accessories | Clothing, Fashion |
| 3 | Colours and Shapes | Colours, Shapes, Descriptions |
| 4 | Communication and Technology | Devices, Internet, Media |
| 5 | Daily Life | Routines, Greetings, Common actions |
| 6 | Education | School, University, Studying |
| 7 | Entertainment and Media | Film, Music, TV, Games |
| 8 | Environment | Countryside, Pollution, Climate |
| 9 | Family and Friends | Family, Relationships, People |
| 10 | Feelings and Opinions | Emotions, Personality, Attitudes |
| 11 | Food and Drink | Food, Cooking, Restaurant |
| 12 | Health and Body | Body parts, Medicine, Exercise |
| 13 | Hobbies and Leisure | Sports, Free time, Interests |
| 14 | House and Home | Rooms, Furniture, Housework |
| 15 | Measurements and Numbers | Numbers, Time, Units, Money |
| 16 | Places | Buildings, Town, City, Countryside |
| 17 | Services | Bank, Post, Restaurant, Hospital |
| 18 | Shopping | Shops, Prices, Buying |
| 19 | Society and Community | Social issues, Politics, Economy |
| 20 | Sport | Games, Competition, Fitness |
| 21 | Science and Research | Scientific topics, Academic |
| 22 | Travel and Transport | Vehicles, Airport, Tourism |
| 23 | Weather and Seasons | Climate, Seasons, Forecasts |
| 24 | Work and Jobs | Occupations, Office, Career |

### Cấu trúc mỗi từ

```typescript
interface Word {
  id: string;                    // "word_breakfast"
  word: string;                  // "breakfast"
  phonetic: string;              // "/ˈbrek.fəst/"
  meaning_vi: string;            // "bữa sáng"
  meaning_en: string;            // "the first meal of the day"
  pos: string;                   // "noun"
  level: Level;                  // "a1"
  categories: string[];          // ["daily_life", "food_and_drink"]
  frequency: number;             // 4500 (BNC/COCA rank)
  examples: {en: string; vi: string}[];
  word_family: string[];         // ["break (v)", "breakable (adj)"]
  collocations: string[];        // ["have breakfast", "eat breakfast"]
  synonyms: string[];            // ["morning meal"]
  antonyms: string[];            // []
  common_mistakes: {wrong: string; correct: string; explain_vi: string}[];
  grammar_patterns: string[];    // ["have + breakfast (no article)"]
  image: string;
  audio: string;
  sources: ("core" | "video" | "personal")[];
  skills: {listening: number; speaking: number; reading: number; writing: number};
  srs_next_review: number | null;
}
```

---

## Ngân hàng B: Cụm từ (Phrase Bank)

### Quy mô

~1400 cụm từ × 5 levels:

| Level | Số lượng |
|-------|---------|
| A1 | ~200 |
| A2 | ~300 |
| B1 | ~400 |
| B2 | ~300 |
| C1 | ~200 |

### Loại cụm từ

- `phrasal_verb` — get up, look after, turn on
- `collocation` — have breakfast, make a mistake, do homework
- `expression` — have a good time, take a break, make friends

### Cấu trúc mỗi cụm từ

```typescript
interface Phrase {
  id: string;                    // "phrase_get_up"
  phrase: string;                // "get up"
  meaning_vi: string;            // "thức dậy"
  type: "phrasal_verb" | "collocation" | "expression";
  level: Level;
  category: string;              // "daily_life"
  examples: {en: string; vi: string}[];
  collocations: string[];        // ["get up early", "get up late"]
  response: string;              // câu đáp lại (nếu là cụm giao tiếp)
  example_dialogue: {speaker: string; text: string}[];
}
```

---

## Ngân hàng C: Câu giao tiếp (Conversation Bank)

### Quy mô

~80 scenarios × 5 levels:

| Level | Scenarios |
|-------|-----------|
| A1 | ~20 |
| A2 | ~25 |
| B1 | ~20 |
| B2 | ~10 |
| C1 | ~5 |

### Cấu trúc mỗi scenario

```typescript
interface ConversationScenario {
  id: string;                    // "conv_restaurant_01"
  scenario: string;              // "Ordering food at a restaurant"
  scenario_vi: string;           // "Gọi món ở nhà hàng"
  level: Level;
  category: string;              // "food_and_drink"
  roles: string[];               // ["Customer", "Waiter"]
  dialogue: {role: string; en: string; vi: string}[];
  key_phrases: string[];         // links to Phrase Bank
  key_vocab: string[];           // links to Word Bank
  grammar_points: string[];      // links to Grammar Bank
}
```

---

## Ngân hàng D: Ngữ pháp (Grammar Bank)

### Quy mô

~70 topics × 5 levels:

| Level | Topics | Ví dụ |
|-------|--------|-------|
| A1 | ~15 | To be, Present simple, There is/are, Articles, Possessives |
| A2 | ~15 | Past simple, Present continuous, Comparatives, Will/Going to |
| B1 | ~15 | Present perfect, Conditionals 1-2, Passive, Modals |
| B2 | ~15 | Conditional 3, Reported speech, Relative clauses, Wish |
| C1 | ~10 | Inversion, Cleft sentences, Mixed conditionals |

### Grammar categories

1. Tenses (15 topics)
2. Modals (5)
3. Articles & Determiners (4)
4. Pronouns (4)
5. Prepositions (4)
6. Sentence structure (8)
7. Word formation (5)
8. Connectors (5)

### Cấu trúc mỗi topic

```typescript
interface GrammarTopic {
  id: string;                    // "gram_present_simple"
  title: string;                 // "Present Simple"
  title_vi: string;              // "Thì hiện tại đơn"
  level: Level;
  category: string;              // "tenses"
  description_vi: string;
  rules: {
    rule: string;
    example_en: string;
    example_vi: string;
  }[];
  common_mistakes: {
    wrong: string;
    correct: string;
    explain_vi: string;
  }[];
  related_vocab: string[];       // links to Word Bank
  related_phrases: string[];     // links to Phrase Bank
  exercises: Exercise[];
}
```

---

## Hệ thống luyện 4 kỹ năng

### Nghe (Listening) — 5 modes

1. Nghe từ → chọn nghĩa/ảnh (Ngân hàng A)
2. Nghe cụm từ → chọn đáp án (Ngân hàng B)
3. Nghe câu → hiểu ý (Ngân hàng C)
4. Nghe video → comprehension (BBC / Little Fox)
5. Dictation (Ngân hàng A + B)

### Nói (Speaking) — 6 modes

1. Phát âm từ (Ngân hàng A)
2. Phát âm cụm từ (Ngân hàng B)
3. Nói câu giao tiếp (Ngân hàng C)
4. Shadowing BBC (A1→C1)
5. Shadowing Little Fox (Kids→A2)
6. Minimal Pairs (Ngân hàng A)

### Đọc (Reading) — 4 modes

1. Đọc từ trong context (Ngân hàng A)
2. Đọc hội thoại (Ngân hàng C)
3. Đọc truyện (Stories)
4. Đọc ngữ pháp (Ngân hàng D)

### Viết (Writing) — 4 modes

1. Viết từ — dictation (Ngân hàng A)
2. Viết câu (Ngân hàng B + C)
3. Viết đoạn văn — AI chấm (Ngân hàng C + D)
4. Sửa lỗi ngữ pháp (Ngân hàng D)

---

## Video bổ trợ

### Nguồn

| Nguồn | Đối tượng | Số video |
|-------|----------|---------|
| BBC Learning English | A1→C1 | ~1200 |
| Little Fox | Kids→A2 | ~500 |

### Vai trò (không phải nguồn chính)

1. **Củng cố** — gặp lại từ đã học trong ngữ cảnh thực
2. **Mở rộng** — học thêm từ hữu ích đúng trình độ
3. **Luyện kỹ năng** — shadowing, comprehension, dictation

### AI pipeline xử lý video

```
Subtitle → Tách từ/cụm → Đối chiếu hồ sơ HS → Phân loại:
  Loại 1: Từ cốt lõi chưa học → ưu tiên ôn tập
  Loại 2: Từ đã học → đánh dấu "gặp lại"
  Loại 3: Từ mới hữu ích → đưa vào "từ mở rộng"
  Loại 4: Từ hiếm / tên riêng → bỏ qua
```

---

## Hồ sơ ngôn ngữ cá nhân

### 3 nhóm từ vựng trong 1 bản ghi

- **Nhóm A (Core)**: từ lộ trình nền tảng → HS phải biết
- **Nhóm B (Video)**: AI trích xuất từ video → HS nên học
- **Nhóm C (Personal)**: tự thêm, GV giao → HS muốn học

### Mastery tracking per word

```typescript
interface StudentWordProgress {
  studentId: number;
  wordId: string;
  status: "new" | "learning" | "mastered";
  sources: {type: "core" | "video" | "personal"; ref: string}[];
  mastery: {
    listening: number;   // 0-100%
    speaking: number;
    reading: number;
    writing: number;
  };
  encounters: number;
  mistakes: {skill: string; detail: string}[];
  srs: {interval: number; ease: number; next_review: number};
}
```

### Quy tắc status

- `new`: chưa học
- `learning`: bất kỳ kỹ năng nào < 80%
- `mastered`: cả 4 kỹ năng ≥ 80%

---

## Thi chứng chỉ

5 sections theo chuẩn Cambridge KET/PET/FCE:

1. **Listening** — nghe chọn/viết đáp án
2. **Speaking** — đọc to + trả lời + mô tả
3. **Reading** — đọc hiểu + điền từ + matching
4. **Writing** — viết email/thư/essay
5. **Vocabulary & Grammar** — trắc nghiệm + điền từ

Mỗi level (A1→C1) có đề thi riêng dùng nội dung từ 4 ngân hàng.

---

## Thứ tự triển khai

| Phase | Nội dung | Phụ thuộc |
|-------|---------|-----------|
| Phase 1 | Ngân hàng Từ vựng (A) | Không |
| Phase 2 | Ngân hàng Cụm từ (B) | Phase 1 |
| Phase 3 | Ngân hàng Câu giao tiếp (C) | Phase 1 + 2 |
| Phase 4 | Ngân hàng Ngữ pháp (D) | Phase 1 + 2 + 3 |
| Phase 5 | Hồ sơ cá nhân + SRS | Phase 1-4 |
| Phase 6 | Cập nhật UI (24 categories, pages) | Phase 5 |
| Phase 7 | Thi chứng chỉ (cập nhật đề thi) | Phase 6 |

### So với app hiện tại

| Thành phần | Hiện tại | Sau redesign |
|---|---|---|
| Topics | 35 lộn xộn | 24 chuẩn Cambridge |
| Từ vựng | 5601 từ thiếu cấu trúc | ~8000 từ đầy đủ fields |
| Cụm từ | 500 cơ bản | ~1400 có response + dialogue |
| Câu giao tiếp | 18 scenarios | ~80 scenarios |
| Ngữ pháp | 54 topics | ~70 topics chuẩn Cambridge |
| Mastery | XP + streak | 4 skills × per-word |
| SRS | Chưa liên kết | Thống nhất mọi nguồn |
| Video | 101 rời rạc | BBC + Little Fox + AI pipeline |
| Thi | 448 câu | 5 sections × 5 levels |

---

## Tech stack (giữ nguyên)

- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: Express + SQLite (better-sqlite3)
- **AI**: DeepSeek API (curate + chấm bài)
- **Speech**: FastAPI + wav2vec2
- **TTS**: Edge TTS (Microsoft)
- **Deploy**: Oracle VPS + Caddy + PM2
