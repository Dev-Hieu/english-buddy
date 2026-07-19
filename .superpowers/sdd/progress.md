# Foundation Banks — Progress Ledger

| Task | Status | Commits | Notes |
|------|--------|---------|-------|
| 1. DB schema | ✅ complete | 3de5807 | 24 categories + word_bank table |
| 2. Generate A1 | ✅ complete | agent | 960 words |
| 3. Generate A2-C1 | ✅ complete | agent | 6630 words (total 7590) |
| 4. Import + API | ✅ complete | agent | 7590 imported, /api/categories + /api/word-bank |
| 5. Frontend | ✅ complete | agent | wordBankService + TOPIC_TO_CATEGORY |
| 6. Validate | ✅ complete | — | 0 missing, 0 bad IPA, 5010 unique words |
| 7. Deploy + E2E | ✅ complete | — | 24 cats, 7590 words, API OK |

## Phase 2: Phrase Bank

| Task | Status | Notes |
|------|--------|-------|
| Generate A1 | ✅ | 192 phrases |
| Generate A2 | ✅ | 288 phrases |
| Generate B1 | ✅ | 384 phrases |
| Generate B2 | ✅ | 288 phrases |
| Generate C1 | ✅ | 192 phrases |
| Import DB | ✅ | 1344 phrases imported |
| API endpoint | ✅ | /api/phrase-bank working |

## Phase 3: Conversation Bank

| Task | Status | Notes |
|------|--------|-------|
| A1 scenarios | ✅ | 20 scenarios |
| A2 scenarios | ✅ | 25 scenarios |
| B1 scenarios | ✅ | 20 scenarios |
| B2 scenarios | ✅ | 10 scenarios |
| C1 scenarios | ✅ | 5 scenarios |
| Import + API | ✅ | 80 total, /api/conversation-bank |

## Phase 4: Grammar Bank

| Task | Status | Notes |
|------|--------|-------|
| A1 topics | ✅ | 15 topics |
| A2 topics | ✅ | 15 topics |
| B1 topics | ✅ | 15 topics |
| B2 topics | ✅ | 15 topics |
| C1 topics | ✅ | 10 topics |
| Import + API | ✅ | 70 total, /api/grammar-bank |

## Phase 5: Student Profile + SRS

| Task | Status | Notes |
|------|--------|-------|
| DB table student_word_progress | ✅ | Per-skill mastery + SRS fields |
| API: GET word-progress | ✅ | Filter by status, due |
| API: POST word-progress | ✅ | SM-2 SRS, per-skill mastery update |
| API: GET summary | ✅ | Dashboard stats + avg mastery |
| Deploy + test | ✅ | All endpoints working |
