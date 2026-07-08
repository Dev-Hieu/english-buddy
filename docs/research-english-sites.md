# Research Report: English Learning Websites & Apps

> Date: 2026-07-09
> Purpose: Content ideas and feature inspiration for English Buddy app
> Method: Live website analysis + domain knowledge of each platform

---

## 1. Duolingo (duolingo.com)

### Content Types
- **Reading**: Short passages, sentence translation, fill-in-the-blank
- **Listening**: Audio comprehension, "type what you hear" exercises
- **Writing**: Sentence construction, translation from L1 to L2
- **Speaking**: Repeat-after-me pronunciation exercises (app only)

### What Makes It Effective
- Bite-sized lessons (5-10 minutes) reduce friction for daily practice
- Spaced repetition algorithm automatically resurfaces weak words
- Strong habit loop: streaks, hearts/lives, XP, leaderboards
- Progressive difficulty within each skill tree node

### Key Features to Consider
- **Skill tree / learning path**: Visual map showing progress through topics
- **Hearts system**: Limited mistakes per session forces focus (or pay to continue)
- **Stories**: Short narrative-based lessons that teach vocabulary in context
- **Daily streak**: Powerful motivator -- Duolingo's #1 retention driver
- **XP and leaderboards**: Weekly leagues with promotion/demotion
- **Tips before lessons**: Short grammar explanations before practice begins
- **Personalized review**: "Practice" mode targets words you got wrong

### Content Structure
- Organized by **skill units** in a linear path
- Each unit has multiple lessons (3-8 lessons per unit)
- Units grouped into sections by difficulty
- CEFR level mapping (A1 through B2)
- Topics: Greetings, Food, Travel, Family, Work, etc.

### Relevance for English Buddy
English Buddy already has XP, streaks, and topic-based vocabulary. The main takeaway is the **story-based contextual learning** -- short narratives where kids encounter words in natural situations rather than isolated flashcards. Also consider the **visual skill tree** to give kids a sense of journey/progress.

---

## 2. ELSA Speak (elsaspeak.com)

### Content Types
- **Speaking** (primary focus): Pronunciation drills, conversation practice
- **Listening**: Listen and repeat, dictation
- **Reading**: Dialogue scripts, sentence reading
- **Vocabulary**: Topic-based word lists with pronunciation focus
- **Grammar**: Contextual grammar in conversations

### What Makes It Effective
- AI-powered pronunciation scoring analyzes 5 factors: pronunciation, intonation, fluency, grammar, vocabulary
- Instant feedback on each phoneme -- shows exactly which sounds are wrong
- Proprietary speech recognition ranked top 5 globally
- Personalized learning path based on diagnostic test results

### Key Features to Consider
- **AI pronunciation scoring**: Real-time feedback on individual sounds
- **Phoneme-level analysis**: Highlights specific sounds that need work (e.g., /th/, /r/)
- **Pronunciation dictionary**: Look up any word and practice saying it
- **Conversation simulations**: Guided dialogues with AI responses
- **Diagnostic assessment**: Entry test that customizes the entire curriculum
- **Progress tracking**: Detailed analytics on pronunciation improvement over time
- **9,000+ lessons** across 200+ topics

### Content Structure
- Organized by **topics** (travel, business, daily life, etc.)
- Also organized by **skill level** (beginner to advanced)
- Lessons combine listening + speaking + vocabulary
- Each lesson is short (3-5 minutes)
- Study path personalized per user after diagnostic

### Relevance for English Buddy
English Buddy's `speech-eval/` module already explores pronunciation evaluation. ELSA's approach of **scoring individual phonemes** and showing visual feedback (green/yellow/red for each sound) is the gold standard. For kids, this could be simplified to "Great!", "Almost!", "Try again!" with animated feedback. The **diagnostic test at onboarding** is also valuable -- it prevents boredom by skipping content the child already knows.

---

## 3. Cake (mycake.me)

### Content Types
- **Listening** (primary): Short video clips from real YouTube content
- **Speaking**: Repeat-after-me with recording and playback
- **Reading**: Subtitled video transcripts
- **Vocabulary**: Key expressions extracted from video clips

### What Makes It Effective
- Uses **real-world video content** (YouTube clips, movies, TV shows) -- learners hear authentic English, not textbook recordings
- Short-form format (15-60 second clips) matches attention spans
- "Speak" mode lets users record themselves and compare with the original
- Content feels entertaining, not academic

### Key Features to Consider
- **YouTube clip library**: Curated short clips organized by topic, difficulty, and interest
- **Expression-based learning**: Instead of single words, teaches phrases and expressions in context
- **Speak & compare**: Record your voice, hear it back alongside the native speaker
- **Daily updated content**: New clips added daily keeps content fresh
- **Subtitle highlighting**: Synced subtitles that highlight word-by-word as audio plays
- **Bookmark expressions**: Save useful phrases for review
- **Class/course structure**: Guided courses alongside free browsing

### Content Structure
- **Daily content feed**: New videos every day
- **Courses**: Structured sequences (e.g., "Travel English", "Business English")
- **Categories**: Sorted by topic (entertainment, music, education, news)
- **Difficulty levels**: Beginner, Intermediate, Advanced
- **Expression library**: Searchable database of saved expressions

### Relevance for English Buddy
This is highly relevant. English Buddy could incorporate **short video clips with synced subtitles** where kids learn expressions in context. For grade 5-7 students, clips from age-appropriate YouTube content (cartoons, educational channels, kid-friendly vlogs) would be far more engaging than textbook audio. The **speak-and-compare** feature is also implementable with Web Speech API.

---

## 4. ShadowingEnglish (shadowingenglish.com)

### Content Types
- **Speaking** (primary): Shadowing practice (listen + immediately repeat)
- **Listening**: Full video comprehension with transcripts
- **Reading**: Sentence-by-sentence transcripts
- **Writing**: Dictation exercises (type what you hear)
- **Vocabulary**: Saved word lists with spaced-repetition review

### What Makes It Effective
- Based on the **shadowing technique** from professional interpreter training (Dr. Alexander Arguelles)
- Forces active processing: brain and mouth simultaneously process and reproduce real speech patterns
- Progressive practice: understanding-focused listening first, then repeated practice at increasing speeds
- AI pronunciation scoring provides instant feedback

### Key Features to Consider
- **Multiple practice modes**:
  - Shadowing (repeat after listening with 1-2 second delay)
  - Dubbing (selective unmuting of sentences)
  - Dictation (type-to-check)
  - AI Talk (conversational practice)
  - Final Practice (continuous speaking over full video)
- **Wait Mode**: Adjustable pause percentage for different skill levels
- **Speed adjustment**: 1x to 1.5x playback
- **IPA phonetics display** on each sentence
- **Stress/pause highlighting**: Visual prosody indicators matching speaker timing
- **Spaced repetition vocabulary**: Auto-scheduled review (1d, 3d, 7d, 14d)
- **Word Chain game**: Multiplayer vocabulary game with leaderboard
- **CEFR level tagging**: Content tagged A1 through C2

### Content Structure
- Content sourced from **YouTube videos** (under 20 minutes)
- Organized by **CEFR level** (A1-C2)
- Organized by **topic** (Education, Entertainment, Music, Business, Travel)
- Curated playlists, trending/popular sections
- Sentence-by-sentence transcript breakdown

### Relevance for English Buddy
The **shadowing technique** is excellent for pronunciation improvement and could be a powerful addition to English Buddy. A simplified version for kids: play a short sentence, pause, let the child repeat, then compare. The **dictation mode** (type what you hear) is also a great exercise that tests both listening and spelling. The **adjustable speed** feature is important for younger learners who need slower audio.

---

## 5. BBC Learning English (bbc.co.uk/learningenglish)

### Content Types
- **Listening**: Audio and video lessons with native BBC presenters
- **Reading**: News-based articles, scripts, transcripts
- **Writing**: Writing tips and exercises
- **Speaking**: Pronunciation guides (Tim's Pronunciation Workshop)
- **Grammar**: Dedicated grammar courses (6 Minute Grammar)
- **Vocabulary**: News-based vocabulary (News Review, 6 Minute English)

### What Makes It Effective
- **Authentic British English** from professional broadcasters
- Uses **real news and current events** as learning material
- Consistent format: programs like "6 Minute English", "The English We Speak"
- Very high production quality (BBC standard)
- Free and comprehensive

### Key Features to Consider
- **Regular programs/series**: "6 Minute English", "6 Minute Grammar", "The English We Speak", "News Review"
- **Level-based organization**: Lower Intermediate, Intermediate, Upper Intermediate, Advanced
- **Courses**: Structured multi-episode courses with clear progression
- **Quizzes after every lesson**: Comprehension check with immediate scoring
- **Transcripts**: Full text available for every audio/video lesson
- **Weekly publication schedule**: New episodes on fixed days (creates habit)
- **News-based content**: Current events make learning feel relevant

### Content Structure
- **Programs** (recurring series with consistent format)
- **Courses** (structured learning paths)
- **Features** (one-off special content)
- Levels: Lower Intermediate through Advanced
- Skills: Grammar, Vocabulary, Pronunciation, News
- Episode format: intro, content, quiz, summary

### Relevance for English Buddy
The **"6 Minute" format** is brilliant for English Buddy -- short, focused audio lessons on a single topic. For kids, this could be "3 Minute English" episodes on topics they care about (games, animals, sports). The **quiz-after-every-lesson** pattern reinforces learning and is already partially implemented in English Buddy's test system. The **transcript + audio sync** approach is also worth adopting.

---

## 6. British Council LearnEnglish (learnenglish.britishcouncil.org)

### Content Types
- **Reading**: Graded readers, articles, stories at multiple levels
- **Listening**: Audio recordings with comprehension exercises
- **Writing**: Writing guides, sample essays, structured exercises
- **Speaking**: Discussion prompts, pronunciation practice
- **Grammar**: Comprehensive grammar reference with interactive exercises
- **Vocabulary**: Topic-based vocabulary with exercises

### What Makes It Effective
- **CEFR-aligned content** (A1-C1) gives clear progression
- Comprehensive: covers all four skills systematically
- Exercises attached to every piece of content
- Professional, authoritative (British Council is the gold standard)
- Community comments allow learners to interact

### Key Features to Consider
- **CEFR level system**: Every piece of content tagged with exact level
- **Skills-based navigation**: Browse by Listening, Reading, Writing, Speaking, Grammar, Vocabulary
- **Online courses**: Structured self-study courses with certificates
- **Grammar reference**: Complete grammar rules with examples and exercises
- **Business English section**: Professional English resources
- **Exam preparation**: IELTS-focused content
- **Interactive exercises**: Gap-fill, matching, multiple choice, ordering, true/false
- **Discussion/comments**: Community engagement on each lesson

### Content Structure
- Primary navigation by **skill** (Listening, Reading, Writing, Speaking)
- Secondary navigation by **level** (A1, A2, B1, B2, C1)
- Also by **topic** (Environment, Science, Culture, Travel)
- Each lesson: introduction, main content, exercises, discussion
- Courses: multi-lesson structured paths

### Relevance for English Buddy
The **CEFR leveling** is important -- even for kids, having a clear A1/A2 mapping helps parents track progress against an international standard. The **exercise variety** (gap-fill, matching, ordering, true/false) is more diverse than English Buddy's current quiz types and would add engagement. The **skills-based navigation** alongside topic-based is a useful dual-axis organization.

---

## 7. EnglishClub (englishclub.com)

### Content Types
- **Grammar**: Comprehensive rules, explanations, exercises
- **Vocabulary**: Word lists, idioms, phrasal verbs, slang
- **Listening**: Listening exercises with audio + comprehension questions
- **Reading**: Graded reading passages
- **Writing**: Writing tips and guides
- **Speaking**: Pronunciation guides
- **ESL games**: Word games, quizzes, puzzles

### What Makes It Effective
- **Encyclopedic reference**: Covers virtually every English grammar topic
- Simple, text-first approach (no distractions)
- Large community forums for peer help
- Free and accessible

### Key Features to Consider
- **Grammar reference**: Organized by topic (tenses, articles, prepositions, etc.)
- **Word of the Day**: Daily vocabulary with pronunciation, meaning, example
- **Idiom of the Day**: Daily idiom learning
- **ESL Quizzes**: Grammar quizzes, vocabulary quizzes, listening quizzes
- **Forums**: Learner community for questions and practice
- **Teacher resources**: Lesson plans, worksheets
- **Phrasal verb dictionary**: Comprehensive phrasal verb reference
- **Minimal design**: Focuses on content, not flash

### Content Structure
- Organized primarily by **skill/topic** (Grammar, Vocabulary, Listening, etc.)
- Grammar broken down by subtopic (Tenses, Conditionals, Passive, etc.)
- Each topic: explanation, examples, practice exercises, quiz
- Supplementary: games, forums, daily features

### Relevance for English Buddy
The **Word of the Day** and **Idiom of the Day** features are easy to implement and create a daily touchpoint. For kids, a "Tu Moi Moi Ngay" (New Word Every Day) notification or home screen card would drive daily engagement. The **phrasal verb** and **idiom** collections are also useful content categories to add as kids advance.

---

## 8. Randall's ESL Cyber Listening Lab (esl-lab.com)

### Content Types
- **Listening** (primary focus): Audio dialogues with comprehension exercises
- **Speaking**: Discussion questions after each listening activity
- **Grammar**: Grammar lessons linked to listening content
- **Vocabulary**: Vocabulary quizzes tied to listening topics
- **Reading**: Transcripts and related reading materials

### What Makes It Effective
- **Three clear difficulty levels**: Easy, Intermediate, Difficult
- Authentic conversational recordings (not over-enunciated textbook audio)
- Structured lesson format: Pre-listening, Listening, Post-listening
- Operating since 1998 -- massive library of content
- Each lesson has a complete learning cycle

### Key Features to Consider
- **Three-phase lesson structure**:
  1. Pre-listening: vocabulary preview, prediction questions
  2. Listening: audio + comprehension quiz
  3. Post-listening: discussion questions, vocabulary review, grammar extension
- **Difficulty levels**: Easy / Intermediate / Difficult (mapped to CEFR)
- **Self-Study Guide**: Activities organized by subject (food, travel, health, technology)
- **Study Paths**: Structured sequences through activities by topic and level
- **Culture Videos**: Short videos on everyday cultural topics
- **English Interviews**: Real interviews with native speakers
- **ESL Vocabulary Quizzes**: Standalone vocabulary assessment

### Content Structure
- **General Listening Quizzes**: Three levels (Easy, Intermediate, Difficult)
- **Special sections**: Interviews, Grammar, Culture Videos, Life Stories, Language Games
- **Self-Study Guide**: Browse by subject/topic
- **Study Paths**: Sequential, structured routes through content
- Each lesson: title, difficulty, topic tags, pre/during/post activities

### Relevance for English Buddy
The **three-phase lesson structure** (pre-listening, listening, post-listening) is pedagogically sound and should be adopted. Before a listening exercise, show the child key vocabulary they'll encounter. During, play the audio. After, test comprehension. The **Study Paths** concept -- guided sequences rather than random browsing -- would give structure to English Buddy's learning flow. The **difficulty levels** with clear criteria (not just arbitrary labels) help parents understand what level their child is at.

---

## 9. Perfect English Grammar (perfect-english-grammar.com)

### Content Types
- **Grammar** (primary): Tenses, conditionals, reported speech, modal verbs, passive voice
- **Exercises**: Fill-in-the-blank, multiple choice, error correction
- **PDF resources**: Downloadable grammar charts and summaries

### What Makes It Effective
- **Extremely clear explanations**: Complex grammar made simple
- Logical organization: tenses first, then conditionals, reported speech, etc.
- Free exercises with immediate answers
- PDF downloads for offline study
- Focused -- does one thing (grammar) exceptionally well

### Key Features to Consider
- **Visual grammar charts**: Clear tables showing tense forms, usage, examples
- **Free PDFs**: Downloadable reference materials
- **Progressive structure**: Grammar topics ordered by natural learning sequence
- **Exercise variety**: Gap-fill, transformation, error correction
- **Membership tier**: Premium content with more exercises and a structured course
- **Clear method**: "Really understand, don't just memorize rules"
- **Verb tenses as foundation**: Everything builds from tense mastery

### Content Structure
- **Grammar Explanations**: Organized by topic (verb tenses, conditionals, reported speech, phrasal verbs, modal verbs)
- **Exercises**: Paired with each explanation
- **PDFs**: Standalone reference documents
- **Membership course**: Structured learning path through all grammar

### Relevance for English Buddy
For grade 5-7 students, **grammar is part of the curriculum**. English Buddy currently focuses on vocabulary but grammar is listed as a future feature. Perfect English Grammar's approach of **visual charts** (clear tables showing verb forms) and **progressive topic ordering** is the right model. Start with present simple, then present continuous, then past simple -- matching the school curriculum. Grammar cards could work like vocabulary flashcards.

---

## 10. engVid (engvid.com)

### Content Types
- **Video lessons** (primary): YouTube-hosted video lessons by real teachers
- **Grammar**: Tenses, sentence structure, common errors
- **Vocabulary**: Compound adjectives, business English, slang, relationships
- **Speaking**: Pronunciation, fluency tips, conversation strategies
- **Writing**: Resumes, emails, academic writing
- **Culture**: Cultural tips, expressions, idioms
- **Test Prep**: IELTS, TOEFL, TOEIC preparation

### What Makes It Effective
- **Real human teachers**: 8+ professional English teachers with distinct personalities
- Video format is engaging and personal
- Each lesson has a quiz to test understanding
- Covers breadth of topics from beginner to advanced
- Free, large library (1,000+ lessons)
- Teachers explain in English but clearly enough for non-native speakers

### Key Features to Consider
- **Teacher personality**: Multiple teachers with different styles -- learners pick who they connect with
- **Topic + level tagging**: Every lesson tagged by topic and difficulty level (Beginner, Intermediate, Advanced)
- **Post-lesson quiz**: 10-question quiz after each video
- **Related lessons**: Suggestions for what to watch next
- **RSS/subscription**: Stay updated with new content
- **Searchable by topic**: Business, grammar, vocabulary, pronunciation, culture, IELTS, etc.
- **Lesson format**: Whiteboard-style teaching (15-25 minutes per lesson)

### Content Structure
- Lessons organized by **topic** (grammar, vocabulary, speaking, writing, culture, etc.)
- Filtered by **teacher** (Adam, Alex, Benjamin, Emma, Gill, Jade, James, Rebecca, Ronnie)
- Filtered by **level** (1-Beginner, 2-Intermediate, 3-Advanced)
- Each lesson: embedded YouTube video + quiz + related lessons
- Blog-style layout with newest lessons on homepage

### Relevance for English Buddy
The **video lesson format** is something English Buddy could adopt for grammar explanations or vocabulary introductions. Short (3-5 minute) video explanations for kids, perhaps animated, would complement the flashcard/game approach. The **post-lesson quiz** is already in English Buddy's DNA. The **teacher personality** concept could translate to a friendly animated character/mascot that guides kids through lessons.

---

## Summary: Top Features to Adopt for English Buddy

### High Priority (directly supports current users -- grade 5 & 7 students)

| Feature | Inspired By | Implementation Idea |
|---------|-------------|---------------------|
| **Short video clips with subtitles** | Cake, BBC | Curate age-appropriate YouTube clips; display synced subtitles; extract key vocabulary |
| **Shadowing / Speak & Compare** | ShadowingEnglish, Cake | Play sentence, record child's voice, play back comparison. Use Web Speech API |
| **Dictation exercises** | ShadowingEnglish | Play audio, child types what they hear -- tests listening + spelling simultaneously |
| **Three-phase listening lessons** | ESL-Lab | Pre-listening vocab preview, listening with questions, post-listening review |
| **Word of the Day** | EnglishClub | Daily push/notification with one new word -- easy engagement driver |
| **Grammar cards & charts** | Perfect English Grammar | Visual grammar tables (verb tenses, etc.) matching school curriculum |
| **Diagnostic assessment** | ELSA | Short test at start to determine child's level; skip content they already know |

### Medium Priority (enhances engagement and depth)

| Feature | Inspired By | Implementation Idea |
|---------|-------------|---------------------|
| **Visual learning path / skill tree** | Duolingo | Show a map of all topics with progress indicators; unlock next level |
| **Story-based contextual learning** | Duolingo | Short stories where kids encounter vocabulary in narrative context |
| **AI pronunciation feedback** | ELSA, ShadowingEnglish | Simplified pronunciation scoring: "Great / Almost / Try again" with visual feedback |
| **Adjustable audio speed** | ShadowingEnglish | Slower playback for beginners, normal/fast for advanced |
| **Exercise variety** | British Council | Add gap-fill, ordering, true/false, matching (beyond current quiz types) |
| **CEFR level mapping** | British Council, ShadowingEnglish | Tag all content with A1/A2 levels so parents see international benchmarks |

### Lower Priority (future expansion)

| Feature | Inspired By | Implementation Idea |
|---------|-------------|---------------------|
| **Regular content series** | BBC | "3 Minute English" -- weekly short episodes on kid-friendly topics |
| **Idiom / Expression library** | EnglishClub, Cake | Teach common expressions and idioms with examples and audio |
| **Conversation simulations** | ELSA | Simple guided dialogues where child practices real scenarios (ordering food, etc.) |
| **Multiplayer word games** | ShadowingEnglish | Word chain or vocabulary battle games (if multiple users are added) |
| **Animated teacher/mascot** | engVid | Character that guides kids through lessons, gives encouragement |
| **Video grammar lessons** | engVid | Short animated grammar explanations for key topics |

---

## Content Structure Recommendations

Based on how the best platforms organize content, English Buddy should adopt a **dual-axis organization**:

1. **By Topic** (already implemented): Food, Animals, School, Family, Sports, etc.
2. **By Skill** (new axis): Vocabulary, Listening, Speaking, Grammar, Reading

Each lesson should follow a consistent **learning cycle**:

```
1. Preview (key words + images)
2. Learn (flashcards, video clip, or audio)
3. Practice (games, shadowing, dictation)
4. Test (quiz with immediate feedback)
5. Review (spaced repetition of weak items)
```

Content should be tagged with:
- **Difficulty level** (Beginner / Intermediate / Advanced or A1 / A2 / B1)
- **Skill type** (Listening / Speaking / Reading / Writing / Grammar / Vocabulary)
- **Topic** (Food, Animals, School, etc.)
- **Estimated time** (3 min, 5 min, 10 min)

---

## Key Takeaways

1. **Video content is king**: Cake, BBC, engVid, and ShadowingEnglish all center on video/audio. English Buddy's current flashcard-heavy approach should be complemented with short video clips.

2. **Active production > passive consumption**: The most effective platforms (ELSA, ShadowingEnglish, Cake) make learners speak and write, not just read and listen. English Buddy should prioritize speaking exercises.

3. **Spaced repetition is universal**: Every major platform uses it. English Buddy already has this -- keep investing in the algorithm.

4. **Short sessions work best**: Duolingo (5 min), Cake (1-min clips), BBC (6 min). For grade 5-7 kids, keep lessons under 5 minutes.

5. **Gamification drives consistency**: Streaks, XP, and progress visualization are proven. English Buddy has XP and streaks -- add a visual skill tree / learning map next.

6. **Authentic content beats textbook content**: Real YouTube clips, news, interviews feel more relevant than scripted dialogues. Age-appropriate real content should be the goal.

7. **Grammar is inevitable**: All comprehensive platforms teach grammar. Plan grammar content now using visual charts and progressive topic ordering aligned with the Vietnamese school curriculum.
