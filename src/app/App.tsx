import { useState } from "react";
import { SEED_STUDENTS } from "@/data/seedStudents";
import { isLoggedIn, logout } from "@/services/authService";
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
const LESSON_PROGRESS_KEY = "english-buddy:lesson-progress";
type LessonProgress = Record<string, string[]>;

const readSelected = () => (typeof window === "undefined" ? null : localStorage.getItem(SELECTED_STUDENT_KEY));
function readLessonProgress(): LessonProgress {
  try {
    return JSON.parse(localStorage.getItem(LESSON_PROGRESS_KEY) || "{}") as LessonProgress;
  } catch {
    return {};
  }
}
const progressKey = (s: string, t: string) => `${s}:${t}`;

export function App() {
  const [authed, setAuthed] = useState(isLoggedIn());
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(readSelected);
  const [route, setRoute] = useState<Route>({ view: "home", topicId: "topic_food" });
  const [lessonProgress, setLessonProgress] = useState<LessonProgress>(readLessonProgress);

  const student = SEED_STUDENTS.find((s) => s.id === selectedStudentId) ?? null;
  const navigate = (view: View, topicId = route.topicId) => setRoute({ view, topicId });

  const selectStudent = (id: string) => {
    setSelectedStudentId(id);
    localStorage.setItem(SELECTED_STUDENT_KEY, id);
    setRoute({ view: "home", topicId: "topic_food" });
  };

  const markWordStudied = (topicId: string, wordId: string) => {
    if (!student) return;
    setLessonProgress((prev) => {
      const key = progressKey(student.id, topicId);
      const next = { ...prev, [key]: Array.from(new Set([...(prev[key] ?? []), wordId])) };
      localStorage.setItem(LESSON_PROGRESS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const doLogout = () => {
    logout();
    setAuthed(false);
  };

  if (!authed) return <LoginPage onLogin={() => setAuthed(true)} />;

  if (!student || route.view === "student-select") {
    return <StudentSelectPage selectedStudentId={selectedStudentId} onSelectStudent={selectStudent} />;
  }

  switch (route.view) {
    case "topics":
      return (
        <TopicListPage
          student={student}
          lessonProgress={lessonProgress}
          onBackHome={() => navigate("home")}
          onStartTopic={(topicId) => navigate("lesson", topicId)}
        />
      );
    case "lesson":
      return (
        <LessonPage
          topicId={route.topicId}
          student={student}
          studiedWordIds={lessonProgress[progressKey(student.id, route.topicId)] ?? []}
          onMarkWordStudied={(wordId) => markWordStudied(route.topicId, wordId)}
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
