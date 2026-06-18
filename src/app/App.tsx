import { useCallback, useEffect, useState } from "react";
import { SEED_STUDENTS } from "@/data/seedStudents";
import type { StudentVocabularyProgress } from "@/types";
import { isLoggedIn, logout } from "@/services/authService";
import { getStudentProgress, recordAnswer } from "@/services/progressService";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { LessonPage } from "@/pages/LessonPage";
import { FlashcardPage } from "@/pages/FlashcardPage";
import { ReviewPage } from "@/pages/ReviewPage";
import { LookupPage } from "@/pages/LookupPage";
import { TestPage } from "@/pages/TestPage";
import { GamesPage } from "@/pages/GamesPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { StudentSelectPage } from "@/pages/StudentSelectPage";
import { TopicListPage } from "@/pages/TopicListPage";

type View =
  | "student-select" | "home" | "topics" | "lesson"
  | "flashcard" | "review" | "lookup" | "test" | "games" | "dashboard";

interface Route {
  view: View;
  topicId: string;
}

const SELECTED_STUDENT_KEY = "english-buddy:selected-student";
const readSelected = () => (typeof window === "undefined" ? null : localStorage.getItem(SELECTED_STUDENT_KEY));

export function App() {
  const [authed, setAuthed] = useState(isLoggedIn());
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(readSelected);
  const [route, setRoute] = useState<Route>({ view: "home", topicId: "topic_food" });
  // Tiến độ lấy từ DB trung tâm (đồng bộ mọi máy), KHÔNG dùng localStorage.
  const [progress, setProgress] = useState<StudentVocabularyProgress[]>([]);

  const student = SEED_STUDENTS.find((s) => s.id === selectedStudentId) ?? null;

  const loadProgress = useCallback(() => {
    if (!authed || !selectedStudentId) return;
    getStudentProgress(selectedStudentId).then(setProgress).catch(() => {});
  }, [authed, selectedStudentId]);

  // Tải tiến độ khi đăng nhập / đổi bé.
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const navigate = (view: View, topicId = route.topicId) => {
    setRoute({ view, topicId });
    // Làm tươi tiến độ khi quay về các màn hiển thị tiến độ.
    if (view === "home" || view === "topics") loadProgress();
  };

  const selectStudent = (id: string) => {
    setSelectedStudentId(id);
    localStorage.setItem(SELECTED_STUDENT_KEY, id);
    setProgress([]);
    setRoute({ view: "home", topicId: "topic_food" });
  };

  // Học/đánh dấu 1 từ -> ghi DB (recordAnswer) + cập nhật tiến độ tại chỗ (optimistic).
  const markWordStudied = (wordId: string) => {
    if (!student) return;
    setProgress((prev) => {
      const existing = prev.find((p) => p.wordId === wordId);
      if (existing && existing.mastery > 0) return prev;
      const stub: StudentVocabularyProgress = existing
        ? { ...existing, mastery: Math.max(1, existing.mastery) as StudentVocabularyProgress["mastery"], status: "learning" }
        : { studentId: student.id, wordId, status: "learning", mastery: 1, correctCount: 1, wrongCount: 0, lastReviewedAt: Date.now(), nextReviewAt: Date.now() };
      return existing ? prev.map((p) => (p.wordId === wordId ? stub : p)) : [...prev, stub];
    });
    recordAnswer(student.id, wordId, true)
      .then(loadProgress)
      .catch(() => {});
  };

  const studiedWordIds = progress.filter((p) => p.mastery > 0).map((p) => p.wordId);

  const doLogout = () => {
    logout();
    setAuthed(false);
  };

  if (!authed) return <LoginPage onLogin={() => { setAuthed(true); loadProgress(); }} />;

  if (!student || route.view === "student-select") {
    return <StudentSelectPage selectedStudentId={selectedStudentId} onSelectStudent={selectStudent} />;
  }

  switch (route.view) {
    case "topics":
      return (
        <TopicListPage
          student={student}
          studiedWordIds={studiedWordIds}
          onBackHome={() => navigate("home")}
          onStartTopic={(topicId) => navigate("lesson", topicId)}
        />
      );
    case "lesson":
      return (
        <LessonPage
          topicId={route.topicId}
          student={student}
          studiedWordIds={studiedWordIds}
          onMarkWordStudied={markWordStudied}
          onBackHome={() => navigate("home")}
          onPracticeFlashcard={() => navigate("flashcard")}
          onStartTest={() => navigate("test")}
        />
      );
    case "flashcard":
      return <FlashcardPage student={student} topicId={route.topicId} onBackHome={() => navigate("home")} />;
    case "review":
      return <ReviewPage student={student} onBackHome={() => navigate("home")} />;
    case "lookup":
      return <LookupPage student={student} onBackHome={() => navigate("home")} />;
    case "test":
      return <TestPage student={student} topicId={route.topicId} onBackHome={() => navigate("home")} />;
    case "games":
      return <GamesPage student={student} topicId={route.topicId} onBackHome={() => navigate("home")} />;
    case "dashboard":
      return <DashboardPage onBackHome={() => navigate("home")} />;
    default:
      return (
        <HomePage
          student={student}
          onChangeStudent={() => navigate("student-select")}
          onLogout={doLogout}
          onNavigate={(view, topicId) => navigate(view as View, topicId)}
        />
      );
  }
}
