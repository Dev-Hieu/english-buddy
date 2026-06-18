import { useState } from "react";
import { SEED_STUDENTS } from "@/data/seedStudents";
import { HomePage } from "@/pages/HomePage";
import { LessonPage } from "@/pages/LessonPage";
import { StudentSelectPage } from "@/pages/StudentSelectPage";
import { TopicListPage } from "@/pages/TopicListPage";

type View = "student-select" | "home" | "topics" | "lesson";

const SELECTED_STUDENT_KEY = "english-buddy:selected-student";
const LESSON_PROGRESS_KEY = "english-buddy:lesson-progress";

type LessonProgress = Record<string, string[]>;

function readSelectedStudentId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(SELECTED_STUDENT_KEY);
}

function readLessonProgress(): LessonProgress {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(LESSON_PROGRESS_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as LessonProgress;
  } catch {
    return {};
  }
}

function progressKey(studentId: string, topicId: string) {
  return `${studentId}:${topicId}`;
}

export function App() {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(() => readSelectedStudentId());
  const [view, setView] = useState<View>(() => (readSelectedStudentId() ? "home" : "student-select"));
  const [lessonProgress, setLessonProgress] = useState<LessonProgress>(() => readLessonProgress());
  const selectedStudent = SEED_STUDENTS.find((student) => student.id === selectedStudentId) ?? null;

  const selectStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    window.localStorage.setItem(SELECTED_STUDENT_KEY, studentId);
    setView("home");
  };

  const markWordStudied = (topicId: string, wordId: string) => {
    if (!selectedStudent) return;
    setLessonProgress((previous) => {
      const key = progressKey(selectedStudent.id, topicId);
      const nextIds = Array.from(new Set([...(previous[key] ?? []), wordId]));
      const next = { ...previous, [key]: nextIds };
      window.localStorage.setItem(LESSON_PROGRESS_KEY, JSON.stringify(next));
      return next;
    });
  };

  if (!selectedStudent || view === "student-select") {
    return <StudentSelectPage selectedStudentId={selectedStudentId} onSelectStudent={selectStudent} />;
  }

  if (view === "lesson") {
    const topicId = "topic_food";
    return (
      <LessonPage
        topicId={topicId}
        student={selectedStudent}
        studiedWordIds={lessonProgress[progressKey(selectedStudent.id, topicId)] ?? []}
        onMarkWordStudied={(wordId) => markWordStudied(topicId, wordId)}
        onBackHome={() => setView("home")}
      />
    );
  }

  if (view === "topics") {
    return (
      <TopicListPage
        student={selectedStudent}
        lessonProgress={lessonProgress}
        onBackHome={() => setView("home")}
        onStartTopic={() => setView("lesson")}
      />
    );
  }

  return (
    <HomePage
      student={selectedStudent}
      onChangeStudent={() => setView("student-select")}
      onOpenTopics={() => setView("topics")}
      onStartFoodLesson={() => setView("lesson")}
    />
  );
}
