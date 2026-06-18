# Tài liệu Thiết kế Kỹ thuật — English Buddy (MVP)

> Ứng dụng học tiếng Anh cá nhân hóa cho **Bảo Ngọc** (lớp 7) và **Bảo Nam** (lớp 5).
> Phiên bản: **v0.2 MVP** · Nguồn gốc: viết lại từ `Tài Liệu Thiết Kế Kỹ Thuật MVP.pdf` (v0.1) sau review.
> Tài liệu này là **source of truth về thiết kế**. Mọi thay đổi lớn phải ghi vào [DECISIONS.md](./DECISIONS.md).

---

## 0. Tóm tắt thay đổi so với v0.1

Bản v0.2 giữ nguyên tinh thần MVP của v0.1 và bổ sung 6 quyết định kỹ thuật từ vòng review:

| # | Vấn đề trong v0.1 | Quyết định v0.2 |
|---|-------------------|-----------------|
| 1 | Dictionary API không trả nghĩa tiếng Việt, nhưng UI cần `meaning_vi` | Quick Lookup gọi thêm **API dịch free qua Firebase Functions**; 100 từ seed soạn nghĩa VN tay |
| 2 | Ảnh Pexels có thể không an toàn cho trẻ + lộ API key ở frontend | **Ảnh seed duyệt sẵn**; chỉ gọi Pexels **live cho Lookup**, bắt buộc **proxy qua Functions** (giấu key) |
| 3 | Web Speech TTS chất lượng không đều giữa trình duyệt | **Ưu tiên `audioUrl` từ Dictionary**, Web Speech chỉ là fallback |
| 4 | Multi-tenant/auth nhiều user là thừa cho 2 bé | **1 tài khoản phụ huynh + 2 profile cứng**; security rules tối giản |
| 5 | Chia ngang FE/BE dễ block nhau | **Contracts-first**, chia theo **ownership thư mục** (xem §13) |
| 6 | `fish` trùng ở 2 chủ đề, schema chỉ 1 `topicId` | Đổi `topicId` → **`topicIds: string[]`** |

---

## 1. Mục tiêu MVP

MVP giải quyết 5 nhu cầu cốt lõi:

1. Hai bé học từ vựng tiếng Anh theo chủ đề.
2. Tra từ mới: nghĩa, phiên âm, ví dụ, nghe phát âm ngay trong app.
3. Mỗi từ có hình ảnh minh họa để nhớ lâu.
4. Sau khi học có ôn tập, mini test và trò chơi.
5. Phụ huynh xem được tiến độ của từng bé.

**Vòng học cốt lõi** (phải chạy thật mượt trước khi mở rộng):

```
Học từ mới → Xem ảnh → Nghe phát âm → Hiểu nghĩa → Làm game → Làm test → Lưu tiến độ → Ôn lại từ yếu
```

Chưa làm trong MVP: hội thoại AI, chấm phát âm bằng AI, ngữ pháp đầy đủ, làm đề nâng cao, xếp hạng nhiều người, native app.

---

## 2. Đối tượng người dùng

**Học sinh** (2 profile cứng): Bảo Ngọc (grade 7), Bảo Nam (grade 5). Cả hai bắt đầu ở `level: beginner`, dùng chung 100 từ seed; cá nhân hóa nằm ở **tiến độ**, không phải ở vốn từ.

Mỗi profile lưu: từ đã học, từ đang yếu, lịch sử tra từ, kết quả test, XP/điểm thưởng, streak, chủ đề yêu thích, mức độ hiện tại.

**Phụ huynh/giáo viên** (1 tài khoản — anh Hiếu): xem tiến độ từng bé, từ hay sai, thời gian học, kết quả test, và (giai đoạn sau) điều chỉnh lộ trình.

---

## 3. Phạm vi MVP

**Có trong MVP:** Đăng nhập + chọn profile · Học từ vựng theo chủ đề · Quick Lookup · Chi tiết từ · Nghe phát âm · Ảnh minh họa · Flashcard · Game (Match / Pick Picture / Listen & Choose / Word Builder) · Quiz/Test · Điểm thưởng · Theo dõi tiến độ · Parent Dashboard.

**Để giai đoạn sau:** Nói chuyện với AI · Chấm phát âm AI · Chatbot hội thoại dài · Ngữ pháp đầy đủ · Làm đề nâng cao · Ranking nhiều user · Native app.

---

## 4. Kiến trúc tổng thể

```
[Trình duyệt: PC / iPad / Điện thoại]
        |
        v
[React Web App (Vite + TS + Tailwind + shadcn/ui)]
        |
        |-- Firebase Auth (1 tài khoản phụ huynh)
        |-- Firestore (dữ liệu học + tiến độ)
        |-- Firebase Hosting (deploy web)
        |
        |-- Free Dictionary API   (gọi trực tiếp, không cần key)
        |-- Web Speech API        (TTS fallback, chạy ở client)
        |
        v
[Firebase Functions — proxy giấu key & gom logic server]
        |-- /image   -> Pexels API (key ở server) + fallback Unsplash
        |-- /translate -> MyMemory/LibreTranslate (nghĩa VN cho Lookup)
        |
        v
[Learning Engine (client-side, src/utils + src/services)]
        |-- Spaced Repetition (Review Scheduler)
        |-- Quiz Generator
        |-- Progress Service
        |-- Game logic
```

**Nguyên tắc:** mọi API cần key đi qua Functions. API không key (Dictionary) và Web Speech chạy thẳng ở client.

---

## 5. Tech stack đã chốt

| Lớp | Lựa chọn | Lý do |
|-----|----------|-------|
| Frontend | React + Vite + TypeScript | Triển khai nhanh, responsive, dễ chạy với agent code |
| UI | Tailwind CSS + shadcn/ui | Tạo card/button/modal/progress nhanh, gọn, dễ bảo trì |
| Backend | Firebase (Auth + Firestore + Hosting + Functions) | Đồng bộ đa thiết bị, ít quản server, phù hợp app gia đình |
| Dictionary | Free Dictionary API | Miễn phí, không cần key |
| Image | Pexels (chính) + Unsplash (dự phòng) qua **Functions** | Giấu key, kiểm soát safe-search |
| Dịch VN | MyMemory hoặc LibreTranslate qua **Functions** | Nghĩa VN cho từ tra ngoài seed |
| TTS | `audioUrl` (Dictionary) ưu tiên → Web Speech API fallback | Giọng người thật khi có, máy đọc khi không |

---

## 6. Mô hình dữ liệu (Firestore)

> Quy ước: prose tiếng Việt, mọi field/identifier tiếng Anh. Type chính thức nằm ở [CONTRACTS.md](./CONTRACTS.md) và `src/types/**`.

### 6.1 `users` (1 document — phụ huynh)
```json
{ "uid": "parent_uid", "name": "Lê Tiến Hiếu", "email": "example@gmail.com", "role": "parent", "createdAt": "timestamp" }
```

### 6.2 `students` (2 documents cứng)
```json
{ "id": "student_001", "parentId": "parent_uid", "name": "Bảo Ngọc", "grade": 7,
  "level": "beginner", "avatar": "girl_avatar_01", "dailyGoal": 10,
  "xp": 0, "streak": 0, "createdAt": "timestamp" }
```
(`student_002` = Bảo Nam, grade 5, `boy_avatar_01`.)

### 6.3 `topics`
```json
{ "id": "topic_food", "name": "Food", "name_vi": "Đồ ăn", "level": "beginner", "order": 1 }
```

### 6.4 `vocabulary`
```json
{ "id": "word_apple", "word": "apple", "phonetic": "/ˈæp.əl/",
  "meaning_vi": "quả táo", "meaning_en": "a round fruit",
  "example": "I eat an apple.", "example_vi": "Con ăn một quả táo.",
  "topicIds": ["topic_food"], "level": "beginner",
  "imageUrl": "https://...", "audioUrl": "https://...",
  "source": "seed", "createdAt": "timestamp" }
```
> **Thay đổi:** `topicId` (string) → `topicIds` (string[]) để từ như `fish` thuộc nhiều chủ đề mà không trùng `id`.

### 6.5 `student_vocabulary_progress`
```json
{ "studentId": "student_001", "wordId": "word_apple", "status": "learning",
  "mastery": 2, "correctCount": 3, "wrongCount": 1,
  "lastReviewedAt": "timestamp", "nextReviewAt": "timestamp" }
```

### 6.6 `quiz_results`
```json
{ "studentId": "student_001", "topicId": "topic_food", "score": 80,
  "totalQuestions": 10, "correctAnswers": 8, "wrongAnswers": 2,
  "wrongWordIds": ["word_banana"], "durationSeconds": 180, "createdAt": "timestamp" }
```

### 6.7 `lookup_history`
```json
{ "studentId": "student_001", "query": "apple", "type": "word",
  "saved": true, "createdAt": "timestamp" }
```

### 6.8 Security rules (tối giản)
- Chỉ user đã đăng nhập (parent) đọc/ghi được dữ liệu thuộc `parentId == request.auth.uid`.
- `vocabulary` và `topics` chỉ-đọc với client; ghi qua seed script/console.

---

## 7. Các module chính

### 7.1 Authentication
1 tài khoản phụ huynh, bên trong 2 profile cứng (Bảo Ngọc / Bảo Nam). Cho phép chuyển nhanh giữa 2 profile. **Không** có đăng ký / nhiều parent ở MVP.

### 7.2 Vocabulary Learning
Học từ theo chủ đề. 10 chủ đề đầu: Family, School, Food, Animals, Sports, Daily Activities, Feelings, House, Clothes, Travel. Mỗi chủ đề 10–20 từ. Mỗi từ: ảnh, từ EN, phiên âm, nút nghe, nghĩa VN, ví dụ.

### 7.3 Quick Dictionary (Lookup)
Bé nhập từ → app gọi Dictionary API (nghĩa EN, phiên âm, audio) → gọi **Functions `/translate`** lấy nghĩa VN → gọi **Functions `/image`** lấy ảnh → hiển thị Word Card → cho "Save to My Words" (lưu `lookup_history.saved=true` + tạo progress).

Xử lý input:
- 1 từ → Dictionary API + translate + image.
- Nhiều từ/câu → đọc câu bằng Web Speech (dịch câu để giai đoạn sau).

### 7.4 Pronunciation
MVP: nút nghe từ + nút nghe câu ví dụ. **Ưu tiên phát `audioUrl`, fallback Web Speech (`lang="en-US"`).** Chấm phát âm bằng nhận dạng giọng nói để giai đoạn 2.

### 7.5 Flashcard
2 mặt. Trước: ảnh + từ EN + nút nghe. Sau: nghĩa VN + phiên âm + ví dụ + nút "I know" / "Need review".
- "I know" → tăng mastery, đẩy `nextReviewAt` xa hơn.
- "Need review" → giữ mastery thấp, đưa vào danh sách ôn gần.

### 7.6 Review Scheduler (Spaced Repetition)
`mastery`: 0 chưa học · 1 mới học · 2 nhớ tạm · 3 khá nhớ · 4 nhớ tốt · 5 thành thạo.

Quy tắc ôn MVP (đơn giản hóa Leitner):
- Sai nhiều → ôn lại ngay trong ngày.
- Đúng 1 lần → +1 ngày · Đúng 2 lần → +3 ngày · Đúng 3 lần → +7 ngày · Thành thạo → +14 ngày.

Logic nằm ở `src/utils/spacedRepetition.ts` (thuần, dễ test).

### 7.7 Quiz / Test
5 loại: chọn nghĩa đúng · chọn ảnh đúng · nghe & chọn từ · điền chữ thiếu · ghép từ với nghĩa.
**Distractor** (đáp án sai) lấy từ các từ khác **cùng chủ đề** với từ đang hỏi. Sau mỗi chủ đề → bài test 10 câu, lưu `quiz_results`.

### 7.8 Game
Match Word · Pick the Picture · Listen and Choose · Word Builder.
Điểm: đúng +10XP · đúng liên tiếp 5 câu +20XP · hoàn thành bài +50XP · đủ mục tiêu ngày +100XP.

### 7.9 Parent Dashboard
Mỗi bé: hôm nay đã học chưa, số từ đã học/cần ôn, từ hay sai, điểm test gần nhất, chủ đề tốt/yếu, thời gian học trong tuần, streak, đề xuất bài tiếp theo.

---

## 8. Tích hợp API & Services

> Service do **Claude** sở hữu (`src/services/**`). UI gọi service, **không** gọi API trực tiếp.

### 8.1 `dictionaryService.ts`
```ts
getWordDefinition(word: string): Promise<DictionaryResult>
```
Chuẩn hóa output Free Dictionary API về `DictionaryResult` (xem CONTRACTS.md).

### 8.2 `imageService.ts`
```ts
getWordImages(query: string): Promise<ImageResult[]>
```
Gọi **Functions `/image`** (không gọi Pexels trực tiếp ở client). Trả `id, url, thumbUrl, photographer, sourceUrl` (giữ attribution).

### 8.3 `translateService.ts`  *(mới)*
```ts
translateToVi(text: string): Promise<string>
```
Gọi **Functions `/translate`**. Chỉ dùng cho Quick Lookup từ ngoài seed.

### 8.4 `speechService.ts`
```ts
speakText(text: string, audioUrl?: string, lang = "en-US"): void
```
Có `audioUrl` → phát file đó; không → `SpeechSynthesisUtterance`.

### 8.5 Firebase Functions
- `/image?query=` → Pexels (key ở server, safe-search ON) → fallback Unsplash.
- `/translate?text=` → MyMemory/LibreTranslate, cache kết quả vào Firestore để tiết kiệm quota.

---

## 9. Logic cá nhân hóa
- Bé hay sai một từ → tự đưa vào phần ôn hôm sau.
- Bé học tốt một chủ đề → đề xuất chủ đề tiếp theo.
- Bé bỏ học nhiều ngày → giảm số từ cần học hôm sau (tránh áp lực).
- Bé hoàn thành mục tiêu → thưởng XP + badge.

---

## 10. Nguyên tắc giao diện & gamification
- Cảm giác vui, nhẹ, không áp lực. Nền sáng, màu chính xanh dương/tím nhẹ, nút hành động rõ, ít chữ.
- Card từ vựng: ảnh chiếm 40–50%, từ EN rõ, nút nghe nổi bật, nghĩa VN ngắn, ví dụ đơn giản.
- Gamification: XP, Streak, Badge, Level, Daily goal, Progress bar. Badge ví dụ: First 10 Words, 3-Day Streak, Food Master, Great Listener, Quiz Star.

---

## 11. Cấu trúc thư mục & ranh giới ownership

> Chi tiết quy tắc phối hợp ở [AGENT_PROTOCOL.md](./AGENT_PROTOCOL.md). Tóm tắt ownership:

```
english-buddy/
  src/
    app/            # Codex  (App.tsx, routes.tsx)
    components/      # Codex  (common, vocabulary, quiz, games, dashboard)
    pages/           # Codex  (HomePage, LoginPage, TopicListPage, LessonPage, ...)
    services/        # Claude (firebase, dictionary, image, translate, speech, progress, quiz)
    utils/           # Claude (spacedRepetition, quizGenerator, normalizeWord)
    data/            # Claude (seedTopics, seedVocabulary)
    types/           # SHARED — Claude là steward, đổi phải báo qua MESSAGES.md
  functions/         # Claude (image proxy, translate proxy)
  docs/              # cả hai
```

| Thư mục | Owner | Quy tắc |
|---------|-------|---------|
| `src/services`, `src/utils`, `src/data`, `functions` | **Claude** | Codex không sửa trực tiếp |
| `src/components`, `src/pages`, `src/app` | **Codex** | Claude không sửa trực tiếp |
| `src/types`, `docs/CONTRACTS.md` | **Shared** | Đổi type = mở REQUEST trong MESSAGES.md trước |
| `package.json`, config, `docs/` | **Shared** | Báo trước khi đổi dependency |

---

## 12. Seed data & nội dung (đây là phần tốn công thật)
- ~100 từ, 10 chủ đề, mỗi chủ đề 10 từ.
- Với **mỗi từ seed phải có tay**: `meaning_vi`, `example_vi`, và **ảnh đã duyệt** (URL cố định, an toàn cho trẻ).
- `fish` thuộc cả Food và Animals → `topicIds: ["topic_food","topic_animals"]`, 1 document duy nhất.
- Việc soạn nội dung làm **song song** với code, coi là một hạng mục riêng trong [BACKLOG.md](./BACKLOG.md).

---

## 13. Chiến lược triển khai: lát cắt dọc trước
Làm trọn **1 chủ đề Food chạy end-to-end** trước (seed → lesson → flashcard → nghe → 1 game → test → lưu tiến độ), nghiệm thu theo §15, rồi mới nhân ra 9 chủ đề còn lại + Lookup + Dashboard. Tránh làm xong hết UI rồi mới ghép service.

Thứ tự sprint: xem [BACKLOG.md](./BACKLOG.md).

---

## 14. Điều kiện hoàn thành MVP (Definition of Done)
1. Chọn được Bảo Ngọc / Bảo Nam.
2. ≥100 từ theo 10 chủ đề, mỗi từ có nghĩa, ảnh, phát âm.
3. Học được flashcard.
4. Tra được từ mới (có nghĩa VN).
5. Làm được ≥3 dạng game.
6. Làm được bài test sau chủ đề.
7. Lưu tiến độ riêng từng bé.
8. Phụ huynh xem được dashboard.
9. Chạy được trên PC và điện thoại qua trình duyệt.
10. Mỗi phiên 5–10 phút, có phản hồi tích cực, giao diện vui & ít chữ.

---

## 15. Roadmap sau MVP
- **GĐ2 Luyện phát âm:** ghi âm, nhận dạng từ bé đọc, chấm cơ bản.
- **GĐ3 Hội thoại AI:** chatbot theo tình huống, sửa lỗi câu.
- **GĐ4 Ngữ pháp:** bài học ngắn, bài tập chọn/điền/sắp xếp.
- **GĐ5 Làm đề:** đề theo trình độ/lớp, phân tích lỗi sai.
