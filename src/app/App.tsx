import { useCallback, useEffect, useState } from "react";
import type { Level, Student, StudentVocabularyProgress } from "@/types";
import { getUser, isLoggedIn, logout, refreshMe, updateMe, type AuthUser } from "@/services/authService";
import { ProfileModal } from "@/components/ProfileModal";
import { createStudent, deleteStudent, listStudents, updateStudent, type NewStudent } from "@/services/studentService";
import { getStudentProgress, recordAnswer } from "@/services/progressService";
import { getStudent } from "@/services/studentService";
import { getImageMap } from "@/services/imageService";
import { getVocabulary } from "@/services/contentService";
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
import { ShadowingPage } from "@/pages/ShadowingPage";
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
import { TeacherPage } from "@/pages/TeacherPage";
import { ListeningPage } from "@/pages/ListeningPage";
import { WritingPage } from "@/pages/WritingPage";
import { ReadingPage } from "@/pages/ReadingPage";
import { PhrasesPage } from "@/pages/PhrasesPage";
import { PremiumPage } from "@/pages/PremiumPage";

type View =
  | "student-select" | "admin" | "home" | "topics" | "lesson"
  | "flashcard" | "review" | "lookup" | "test" | "games" | "speak" | "shadowing" | "dashboard" | "mywords" | "leaderboard" | "topicwords" | "grammar" | "grammar-lesson" | "exam" | "conversation" | "imagepicker" | "skilltest"
  | "listening" | "writing" | "reading" | "phrases" | "premium";

interface Route { view: View; topicId: string; level: Level | "all"; mode?: "new" | "review"; }

const SELECTED_STUDENT_KEY = "english-buddy:selected-student";
const readSelected = () => (typeof window === "undefined" ? null : localStorage.getItem(SELECTED_STUDENT_KEY));

const ACTIVE_TAB: Record<View, TabKey | null> = {
  "student-select": null, admin: null, home: "home", topics: "home", lesson: "home", flashcard: "home",
  review: "review", lookup: "lookup", test: "test", games: null, speak: "speak", shadowing: null, dashboard: null, mywords: "mywords", leaderboard: null, topicwords: null,
  grammar: null, "grammar-lesson": null, exam: null, conversation: null, imagepicker: null, skilltest: null,
  listening: null, writing: null, reading: null, phrases: null, premium: null,
};

export function App() {
  const [user, setUser] = useState<AuthUser | null>(isLoggedIn() ? getUser() : null);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(readSelected);
  const [route, setRoute] = useState<Route>({ view: "home", topicId: "topic_food", level: "all" });
  const [progress, setProgress] = useState<StudentVocabularyProgress[]>([]);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(0);
  const [showProfile, setShowProfile] = useState(false);

  const student = students.find((s) => s.id === selectedStudentId) ?? null;

  const loadStudents = useCallback(() => {
    if (!user) return;
    listStudents().then(setStudents).catch(() => {});
  }, [user]);

  useEffect(() => { loadStudents(); }, [loadStudents]);

  // Làm tươi tài khoản 1 lần (vd hạn mức admin vừa đổi).
  useEffect(() => { if (isLoggedIn()) refreshMe().then((u) => u && setUser(u)); }, []);

  // Load từ vựng từ DB (Oxford 3000, phrases...) merge vào SEED_VOCABULARY
  const [, setVocabVer] = useState(0);
  useEffect(() => {
    getVocabulary().then((dbWords) => {
      const existingIds = new Set(SEED_VOCABULARY.map((w) => w.id));
      let added = 0;
      for (const w of dbWords) {
        if (!existingIds.has(w.id)) { SEED_VOCABULARY.push(w); existingIds.add(w.id); added++; }
      }
      if (added > 0) setVocabVer((v) => v + 1);
    }).catch(() => {});
  }, []);

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
    localStorage.removeItem(SELECTED_STUDENT_KEY);
    setUser(null);
    setStudents([]);
    setSelectedStudentId(null);
    setRoute({ view: "student-select", topicId: "topic_food", level: "all" });
  };

  // Học thử: teacher/admin vào trang học của 1 bé
  const enterStudentMode = async (sid: string) => {
    try {
      const s = await getStudent(sid);
      setStudents((prev) => prev.some((x) => x.id === sid) ? prev : [...prev, s]);
    } catch { /* student có thể đã có trong list */ }
    setSelectedStudentId(sid);
    localStorage.setItem(SELECTED_STUDENT_KEY, sid);
    navigate("home");
  };

  // Thoát chế độ Học thử (teacher/admin quay lại trang quản lý)
  const exitStudentMode = () => {
    setSelectedStudentId(null);
    localStorage.removeItem(SELECTED_STUDENT_KEY);
    setRoute({ view: "student-select", topicId: "topic_food", level: "all" });
  };

  const onTab = (key: TabKey) => {
    if (key === "home") navigate("home");
    else if (key === "mywords") navigate("mywords");
    else if (key === "test") navigate("test", route.topicId || "topic_food");
    else if (key === "speak") navigate("speak", route.topicId || "topic_food");
    else navigate(key);
  };

  // ── Chưa đăng nhập ──
  if (!user) {
    return <AuthPage onAuthed={(u) => { setUser(u); }} />;
  }

  // ── Tài khoản chờ duyệt ──
  if (user.status === "pending") {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center gap-6 px-5 py-10 text-center">
        <p className="text-lg font-bold">Tài khoản đang chờ duyệt. Vui lòng liên hệ quản trị viên.</p>
        <button
          type="button"
          onClick={doLogout}
          className="rounded-xl bg-primary px-6 py-2.5 text-sm font-extrabold text-white"
        >
          Đăng xuất
        </button>
      </main>
    );
  }

  // ── Admin → dashboard (trừ khi đang Học thử với student đã chọn) ──
  if (user.role === "admin" && (!selectedStudentId || route.view === "student-select" || route.view === "admin")) {
    return <AdminPage onBack={doLogout} onOpenPicker={() => navigate("imagepicker")} onLoginAsStudent={enterStudentMode} adminName={user.name} />;
  }

  // ── Teacher → trang giáo viên (trừ khi đang "Học thử" với student đã chọn) ──
  if (user.role === "teacher" && (!selectedStudentId || route.view === "student-select")) {
    return <TeacherPage teacherName={user.name} onLogout={doLogout} onLoginAsStudent={enterStudentMode} />;
  }

  // ── Student → tự chọn bé duy nhất của mình, vào thẳng học ──
  if (user.role === "student" && !student && students.length > 0) {
    const myStudent = students.find((s) => s.parentId === user.id || s.userId === user.id);
    if (myStudent) {
      setSelectedStudentId(myStudent.id);
      localStorage.setItem(SELECTED_STUDENT_KEY, myStudent.id);
    }
  }
  // Student đã chọn bé → bỏ qua màn chọn bé, vào thẳng home
  if (user.role === "student" && student && route.view === "student-select") {
    navigate("home");
  }

  if (route.view === "imagepicker") {
    return <ImagePickerPage onBackHome={() => navigate("student-select")} />;
  }

  // ── Chưa chọn bé ──
  if (!student || route.view === "student-select") {
    return (
      <>
        <StudentSelectPage
          students={students}
          user={user}
          selectedStudentId={selectedStudentId}
          onSelectStudent={selectStudent}
          onAddStudent={addStudent}
          onUpdateStudent={editStudent}
          onDeleteStudent={removeStudent}
          onLogout={doLogout}
          onOpenProfile={() => setShowProfile(true)}
          onOpenAdmin={() => setRoute({ view: "admin", topicId: "topic_food", level: "all" })}
          onOpenPicker={() => setRoute({ view: "imagepicker", topicId: "topic_food", level: "all" })}
        />
        {showProfile && user && <ProfileModal user={user as any} onClose={() => setShowProfile(false)} onUpdated={(u) => setUser(u)} />}
      </>
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
      content = <SpeakingPage student={student} topicId={route.topicId} onBackHome={() => navigate("home")} onShadowing={() => navigate("shadowing", route.topicId)} />;
      break;
    case "shadowing":
      content = <ShadowingPage student={student} topicId={route.topicId} onBackHome={() => navigate("home")} />;
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
    case "phrases":
      content = <PhrasesPage student={student} onBackHome={() => navigate("home")} />;
      break;
    case "premium":
      content = <PremiumPage user={{ name: user.name, email: user.email, isPremium: !!user.isPremium }} onBack={() => navigate("home")} />;
      break;
    case "listening":
      content = <ListeningPage student={student} onBackHome={() => navigate("home")} />;
      break;
    case "writing":
      content = <WritingPage student={student} onBackHome={() => navigate("home")} />;
      break;
    case "reading":
      content = <ReadingPage student={student} onBackHome={() => navigate("home")} />;
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
          learnedTotal={progress.filter((p) => (p as any).status === "scored").length}
          learnedToday={learnedToday}
          reviewDue={reviewDue}
          pendingCount={pendingCount}
          dueTestCount={dueTestCount}
          onStartSkillTest={openSkillTest}
          onChangeStudent={(user.role === "teacher" || user.role === "admin") ? exitStudentMode : () => navigate("student-select")}
          onLogout={(user.role === "teacher" || user.role === "admin") ? exitStudentMode : doLogout}
          onOpenProfile={() => setShowProfile(true)}
          onNavigate={(view, topicId, level) => navigate(view as View, topicId, level as Level | "all" | undefined)}
        />
      );
  }

  const showTab = true;
  return (
    <>
      <div className={showTab ? "pb-24" : ""}>{content}</div>
      {showTab ? <TabBar active={ACTIVE_TAB[route.view]} onSelect={onTab} /> : null}
      {showProfile && user && (
        <ProfileModal
          user={user as any}
          onClose={() => setShowProfile(false)}
          onUpdated={(u) => setUser(u)}
        />
      )}
    </>
  );
}
