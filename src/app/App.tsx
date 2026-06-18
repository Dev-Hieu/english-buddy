import { useCallback, useEffect, useState } from "react";
import { SEED_STUDENTS } from "@/data/seedStudents";
import type { StudentVocabularyProgress } from "@/types";
import { isLoggedIn, logout } from "@/services/authService";
import { getStudentProgress, recordAnswer } from "@/services/progressService";
import { getStudent } from "@/services/studentService";
import { TabBar, type TabKey } from "@/components/layout/TabBar";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { LessonPage } from "@/pages/LessonPage";
import { FlashcardPage } from "@/pages/FlashcardPage";
import { ReviewPage } from "@/pages/ReviewPage";
import { LookupPage } from "@/pages/LookupPage";
import { TestPage } from "@/pages/TestPage";
import { GamesPage } from "@/pages/GamesPage";
import { SpeakingPage } from "@/pages/SpeakingPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { MyWordsPage } from "@/pages/MyWordsPage";
import { StudentSelectPage } from "@/pages/StudentSelectPage";
import { TopicListPage } from "@/pages/TopicListPage";

type View =
  | "student-select" | "home" | "topics" | "lesson"
  | "flashcard" | "review" | "lookup" | "test" | "games" | "speak" | "dashboard" | "mywords";

interface Route {
  view: View;
  topicId: string;
}

const SELECTED_STUDENT_KEY = "english-buddy:selected-student";
const readSelected = () => (typeof window === "undefined" ? null : localStorage.getItem(SELECTED_STUDENT_KEY));

const ACTIVE_TAB: Record<View, TabKey | null> = {
  "student-select": null, home: "home", topics: "home", lesson: "home", flashcard: "home",
  review: "review", lookup: "lookup", test: "test", games: "games", speak: "speak", dashboard: null, mywords: null,
};

export function App() {
  const [authed, setAuthed] = useState(isLoggedIn());
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(readSelected);
  const [route, setRoute] = useState<Route>({ view: "home", topicId: "topic_food" });
  const [progress, setProgress] = useState<StudentVocabularyProgress[]>([]);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);

  const student = SEED_STUDENTS.find((s) => s.id === selectedStudentId) ?? null;

  const loadProgress = useCallback(() => {
    if (!authed || !selectedStudentId) return;
    getStudentProgress(selectedStudentId).then(setProgress).catch(() => {});
    getStudent(selectedStudentId).then((s) => { setStreak(s.streak ?? 0); setXp(s.xp ?? 0); }).catch(() => {});
  }, [authed, selectedStudentId]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const navigate = (view: View, topicId = route.topicId) => {
    setRoute({ view, topicId });
    if (view === "home" || view === "topics") loadProgress();
  };

  const selectStudent = (id: string) => {
    setSelectedStudentId(id);
    localStorage.setItem(SELECTED_STUDENT_KEY, id);
    setProgress([]);
    setRoute({ view: "home", topicId: "topic_food" });
  };

  // Ghi 1 lần trả lời cho 1 từ (đúng = nhớ rồi, sai = cần ôn lại). Optimistic + đồng bộ DB.
  const markWord = (wordId: string, correct: boolean) => {
    if (!student) return;
    setProgress((prev) => {
      const existing = prev.find((p) => p.wordId === wordId);
      if (existing && existing.mastery > 0) return prev;
      const stub: StudentVocabularyProgress = {
        studentId: student.id, wordId, status: "learning", mastery: 1,
        correctCount: correct ? 1 : 0, wrongCount: correct ? 0 : 1,
        lastReviewedAt: Date.now(), nextReviewAt: Date.now(),
      };
      return existing ? prev.map((p) => (p.wordId === wordId ? stub : p)) : [...prev, stub];
    });
    recordAnswer(student.id, wordId, correct).then(loadProgress).catch(() => {});
  };

  const doLogout = () => {
    logout();
    setAuthed(false);
  };

  const onTab = (key: TabKey) => {
    if (key === "home") navigate("home");
    else if (key === "games") navigate("games", route.topicId || "topic_food");
    else if (key === "test") navigate("test", route.topicId || "topic_food");
    else if (key === "speak") navigate("speak", route.topicId || "topic_food");
    else navigate(key);
  };

  if (!authed) return <LoginPage onLogin={() => { setAuthed(true); loadProgress(); }} />;

  if (!student || route.view === "student-select") {
    return <StudentSelectPage selectedStudentId={selectedStudentId} onSelectStudent={selectStudent} />;
  }

  const studiedWordIds = progress.filter((p) => p.mastery > 0).map((p) => p.wordId);
  const todayStr = new Date().toDateString();
  const learnedToday = progress.filter((p) => p.lastReviewedAt && new Date(p.lastReviewedAt).toDateString() === todayStr).length;

  let content: React.ReactNode;
  switch (route.view) {
    case "topics":
      content = <TopicListPage student={student} studiedWordIds={studiedWordIds} onBackHome={() => navigate("home")} onStartTopic={(t) => navigate("lesson", t)} />;
      break;
    case "lesson":
      content = <LessonPage topicId={route.topicId} student={student} studiedWordIds={studiedWordIds} onAnswerWord={markWord} onBackHome={() => navigate("home")} onPracticeFlashcard={() => navigate("flashcard")} onStartTest={() => navigate("test")} />;
      break;
    case "flashcard":
      content = <FlashcardPage student={student} topicId={route.topicId} onBackHome={() => navigate("home")} />;
      break;
    case "review":
      content = <ReviewPage student={student} onBackHome={() => navigate("home")} />;
      break;
    case "lookup":
      content = <LookupPage student={student} onBackHome={() => navigate("home")} />;
      break;
    case "test":
      content = <TestPage student={student} topicId={route.topicId} onBackHome={() => navigate("home")} />;
      break;
    case "games":
      content = <GamesPage student={student} topicId={route.topicId} studiedWordIds={studiedWordIds} onBackHome={() => navigate("home")} />;
      break;
    case "speak":
      content = <SpeakingPage student={student} topicId={route.topicId} onBackHome={() => navigate("home")} />;
      break;
    case "dashboard":
      content = <DashboardPage onBackHome={() => navigate("home")} />;
      break;
    case "mywords":
      content = <MyWordsPage student={student} onBackHome={() => navigate("home")} />;
      break;
    default:
      content = (
        <HomePage
          student={student}
          studiedWordIds={studiedWordIds}
          streak={streak}
          xp={xp}
          learnedTotal={studiedWordIds.length}
          learnedToday={learnedToday}
          onChangeStudent={() => navigate("student-select")}
          onLogout={doLogout}
          onNavigate={(view, topicId) => navigate(view as View, topicId)}
        />
      );
  }

  // Tab bar chỉ hiện ở các màn "hub"; ẩn khi đang học/chơi/test để tập trung.
  const showTab = route.view === "home" || route.view === "topics" || route.view === "lookup";
  return (
    <>
      <div className={showTab ? "pb-24" : ""}>{content}</div>
      {showTab ? <TabBar active={ACTIVE_TAB[route.view]} onSelect={onTab} /> : null}
    </>
  );
}
