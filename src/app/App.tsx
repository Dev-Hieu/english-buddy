import { useCallback, useEffect, useState } from "react";
import type { Level, Student, StudentVocabularyProgress } from "@/types";
import { getUser, isLoggedIn, logout, refreshMe, type AuthUser } from "@/services/authService";
import { createStudent, deleteStudent, listStudents, updateStudent, type NewStudent } from "@/services/studentService";
import { getStudentProgress, recordAnswer } from "@/services/progressService";
import { getStudent } from "@/services/studentService";
import { getImageMap } from "@/services/imageService";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import { TabBar, type TabKey } from "@/components/layout/TabBar";
import { HomePage } from "@/pages/HomePage";
import { AuthPage } from "@/pages/AuthPage";
import { AdminPage } from "@/pages/AdminPage";
import { ImagePickerPage } from "@/pages/ImagePickerPage";
import { LessonPage } from "@/pages/LessonPage";
import { FlashcardPage } from "@/pages/FlashcardPage";
import { ReviewPage } from "@/pages/ReviewPage";
import { LookupPage } from "@/pages/LookupPage";
import { TestPage } from "@/pages/TestPage";
import { GamesPage } from "@/pages/GamesPage";
import { SpeakingPage } from "@/pages/SpeakingPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { MyWordsPage } from "@/pages/MyWordsPage";
import { TopicWordsPage } from "@/pages/TopicWordsPage";
import { GrammarListPage } from "@/pages/GrammarListPage";
import { GrammarRunnerPage } from "@/pages/GrammarRunnerPage";
import { ExamPage } from "@/pages/ExamPage";
import { ConversationPage } from "@/pages/ConversationPage";
import { LeaderboardPage } from "@/pages/LeaderboardPage";
import { StudentSelectPage } from "@/pages/StudentSelectPage";
import { TopicListPage } from "@/pages/TopicListPage";
import { SkillTestPage } from "@/pages/SkillTestPage";

type View =
  | "student-select" | "admin" | "home" | "topics" | "lesson"
  | "flashcard" | "review" | "lookup" | "test" | "games" | "speak" | "dashboard" | "mywords" | "leaderboard" | "topicwords" | "grammar" | "grammar-lesson" | "exam" | "conversation" | "imagepicker" | "skilltest";

interface Route { view: View; topicId: string; level: Level | "all"; mode?: "new" | "review"; }

const SELECTED_STUDENT_KEY = "english-buddy:selected-student";
const readSelected = () => (typeof window === "undefined" ? null : localStorage.getItem(SELECTED_STUDENT_KEY));

const ACTIVE_TAB: Record<View, TabKey | null> = {
  "student-select": null, admin: null, home: "home", topics: "home", lesson: "home", flashcard: "home",
  review: "review", lookup: "lookup", test: "test", games: "games", speak: "speak", dashboard: null, mywords: null, leaderboard: null, topicwords: null,
  grammar: null, "grammar-lesson": null, exam: null, conversation: null, imagepicker: null, skilltest: null,
};

export function App() {
  const [user, setUser] = useState<AuthUser | null>(isLoggedIn() ? getUser() : null);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(readSelected);
  const [route, setRoute] = useState<Route>({ view: "home", topicId: "topic_food", level: "all" });
  const [progress, setProgress] = useState<StudentVocabularyProgress[]>([]);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);

  const student = students.find((s) => s.id === selectedStudentId) ?? null;

  const loadStudents = useCallback(() => {
    if (!user) return;
    listStudents().then(setStudents).catch(() => {});
  }, [user]);

  useEffect(() => { loadStudents(); }, [loadStudents]);

  // Làm tươi tài khoản 1 lần (vd hạn mức admin vừa đổi).
  useEffect(() => { if (isLoggedIn()) refreshMe().then((u) => u && setUser(u)); }, []);

  // Áp ảnh mới nhất từ DB lên dữ liệu build sẵn -> ảnh ai đó đã đổi hiện cho MỌI người.
  // Tải lúc mở app + mỗi khi quay lại tab (đồng bộ gần tức thời giữa người dùng).
  const [, setImgVer] = useState(0);
  useEffect(() => {
    const apply = () => getImageMap().then((map) => {
      let changed = false;
      for (const w of SEED_VOCABULARY) {
        if (map[w.id] && map[w.id] !== w.imageUrl) { w.imageUrl = map[w.id]; changed = true; }
      }
      if (changed) setImgVer((v) => v + 1);
    }).catch(() => {});
    apply();
    window.addEventListener("focus", apply);
    return () => window.removeEventListener("focus", apply);
  }, []);

  const loadProgress = useCallback(() => {
    if (!user || !selectedStudentId) return;
    getStudentProgress(selectedStudentId).then(setProgress).catch(() => {});
    getStudent(selectedStudentId).then((s) => { setStreak(s.streak ?? 0); setXp(s.xp ?? 0); }).catch(() => {});
  }, [user, selectedStudentId]);

  useEffect(() => { loadProgress(); }, [loadProgress]);

  const navigate = (view: View, topicId = route.topicId, level: Level | "all" = route.level) => {
    setRoute({ view, topicId, level });
    if (view === "home" || view === "topics") loadProgress();
  };

  const selectStudent = (id: string) => {
    setSelectedStudentId(id);
    localStorage.setItem(SELECTED_STUDENT_KEY, id);
    setProgress([]);
    setRoute({ view: "home", topicId: "topic_food", level: "all" });
  };

  const addStudent = async (data: NewStudent) => {
    const s = await createStudent(data);
    setStudents((prev) => [...prev, s]);
  };
  const editStudent = async (id: string, data: Partial<NewStudent>) => {
    const s = await updateStudent(id, data);
    setStudents((prev) => prev.map((x) => (x.id === id ? s : x)));
  };
  const removeStudent = async (id: string) => {
    await deleteStudent(id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    if (selectedStudentId === id) { setSelectedStudentId(null); localStorage.removeItem(SELECTED_STUDENT_KEY); }
  };

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
    setUser(null);
    setStudents([]);
    setSelectedStudentId(null);
  };

  const onTab = (key: TabKey) => {
    if (key === "home") navigate("home");
    else if (key === "games") navigate("games", route.topicId || "topic_food");
    else if (key === "test") navigate("test", route.topicId || "topic_food");
    else if (key === "speak") navigate("speak", route.topicId || "topic_food");
    else navigate(key);
  };

  // ── Chưa đăng nhập ──
  if (!user) {
    return <AuthPage onAuthed={(u) => { setUser(u); }} />;
  }

  if (route.view === "admin") {
    return <AdminPage onBack={() => navigate("student-select")} onOpenPicker={() => navigate("imagepicker")} />;
  }
  if (route.view === "imagepicker") {
    return <ImagePickerPage onBackHome={() => navigate("student-select")} />;
  }

  // ── Chưa chọn bé ──
  if (!student || route.view === "student-select") {
    return (
      <StudentSelectPage
        students={students}
        user={user}
        selectedStudentId={selectedStudentId}
        onSelectStudent={selectStudent}
        onAddStudent={addStudent}
        onUpdateStudent={editStudent}
        onDeleteStudent={removeStudent}
        onLogout={doLogout}
        onOpenAdmin={() => setRoute({ view: "admin", topicId: "topic_food", level: "all" })}
        onOpenPicker={() => setRoute({ view: "imagepicker", topicId: "topic_food", level: "all" })}
      />
    );
  }

  const studiedWordIds = progress.filter((p) => p.mastery > 0).map((p) => p.wordId);
  const todayStr = new Date().toDateString();
  const learnedToday = progress.filter((p) => p.lastReviewedAt && new Date(p.lastReviewedAt).toDateString() === todayStr).length;
  const reviewDue = progress.filter((p) => (p as any).status === "relearn").length; // kho Cần ôn
  const pendingCount = progress.filter((p) => (p as any).status === "pending_test").length;
  const dueTestCount = progress.filter((p) => (p as any).status === "scored" && p.nextReviewAt && p.nextReviewAt <= Date.now()).length;
  const openSkillTest = (mode: "new" | "review") => setRoute({ view: "skilltest", topicId: route.topicId, level: route.level, mode });

  let content: React.ReactNode;
  switch (route.view) {
    case "topics":
      content = <TopicListPage student={student} studiedWordIds={studiedWordIds} onBackHome={() => navigate("home")} onStartTopic={(t, lv) => navigate("lesson", t, lv)} />;
      break;
    case "lesson":
      content = <LessonPage topicId={route.topicId} level={route.level} student={student} studiedWordIds={studiedWordIds} onAnswerWord={markWord} onBackHome={() => navigate("home")} onPracticeFlashcard={() => navigate("flashcard")} onStartTest={() => navigate("test")} onViewWordList={() => navigate("topicwords")} />;
      break;
    case "topicwords":
      content = <TopicWordsPage topicId={route.topicId} level={route.level} studiedWordIds={studiedWordIds} onBack={() => navigate("lesson")} />;
      break;
    case "grammar":
      content = <GrammarListPage student={student} onBackHome={() => navigate("home")} onPick={(id) => navigate("grammar-lesson", id)} />;
      break;
    case "grammar-lesson":
      content = <GrammarRunnerPage topicId={route.topicId} studentId={student.id} onBackHome={() => navigate("grammar")} />;
      break;
    case "exam":
      content = <ExamPage student={student} level={student.level} onBackHome={() => navigate("home")} />;
      break;
    case "conversation":
      content = <ConversationPage student={student} onBackHome={() => navigate("home")} />;
      break;
    case "flashcard":
      content = <FlashcardPage student={student} topicId={route.topicId} level={route.level} onBackHome={() => navigate("home")} />;
      break;
    case "review":
      content = <ReviewPage student={student} onBackHome={() => navigate("home")} />;
      break;
    case "lookup":
      content = <LookupPage student={student} onBackHome={() => navigate("home")} />;
      break;
    case "test":
      content = <TestPage student={student} topicId={route.topicId} level={route.level} onBackHome={() => navigate("home")} />;
      break;
    case "games":
      content = <GamesPage student={student} topicId={route.topicId} level={route.level} studiedWordIds={studiedWordIds} onBackHome={() => navigate("home")} />;
      break;
    case "speak":
      content = <SpeakingPage student={student} topicId={route.topicId} onBackHome={() => navigate("home")} />;
      break;
    case "dashboard":
      content = <DashboardPage students={students} onBackHome={() => navigate("home")} />;
      break;
    case "mywords":
      content = <MyWordsPage student={student} onBackHome={() => navigate("home")} />;
      break;
    case "leaderboard":
      content = <LeaderboardPage currentStudentId={student.id} level={student.level} onBackHome={() => navigate("home")} />;
      break;
    case "skilltest":
      content = <SkillTestPage student={student} mode={route.mode ?? "new"} onBackHome={() => { loadProgress(); navigate("home"); }} />;
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
          reviewDue={reviewDue}
          pendingCount={pendingCount}
          dueTestCount={dueTestCount}
          onStartSkillTest={openSkillTest}
          onChangeStudent={() => navigate("student-select")}
          onLogout={doLogout}
          onNavigate={(view, topicId, level) => navigate(view as View, topicId, level as Level | "all" | undefined)}
        />
      );
  }

  const showTab = route.view === "home" || route.view === "topics" || route.view === "lookup";
  return (
    <>
      <div className={showTab ? "pb-24" : ""}>{content}</div>
      {showTab ? <TabBar active={ACTIVE_TAB[route.view]} onSelect={onTab} /> : null}
    </>
  );
}
