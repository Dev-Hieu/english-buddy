import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  addDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { nextReview } from "../utils/spacedRepetition";
import type { StudentVocabularyProgress, LookupHistory } from "../types";

const PROGRESS = "student_vocabulary_progress";
const LOOKUPS = "lookup_history";

const progressId = (studentId: string, wordId: string) => `${studentId}_${wordId}`;

function defaultProgress(studentId: string, wordId: string): StudentVocabularyProgress {
  return {
    studentId,
    wordId,
    status: "new",
    mastery: 0,
    correctCount: 0,
    wrongCount: 0,
    lastReviewedAt: 0,
    nextReviewAt: 0,
  };
}

export async function getStudentProgress(
  studentId: string
): Promise<StudentVocabularyProgress[]> {
  const q = query(collection(db, PROGRESS), where("studentId", "==", studentId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as StudentVocabularyProgress);
}

/** Chấm 1 lần trả lời: cập nhật mastery + lịch ôn (spaced repetition) rồi ghi Firestore. */
export async function recordAnswer(
  studentId: string,
  wordId: string,
  correct: boolean
): Promise<void> {
  const ref = doc(db, PROGRESS, progressId(studentId, wordId));
  const snap = await getDoc(ref);
  const prev = snap.exists()
    ? (snap.data() as StudentVocabularyProgress)
    : defaultProgress(studentId, wordId);

  const now = Date.now();
  const { mastery, nextReviewAt, status } = nextReview(prev.mastery, correct, now);

  const updated: StudentVocabularyProgress = {
    studentId,
    wordId,
    status,
    mastery,
    correctCount: prev.correctCount + (correct ? 1 : 0),
    wrongCount: prev.wrongCount + (correct ? 0 : 1),
    lastReviewedAt: now,
    nextReviewAt,
  };
  await setDoc(ref, updated);
}

/** Các từ đã đến hạn ôn (nextReviewAt <= now). */
export async function getDueReviews(
  studentId: string,
  now: number
): Promise<StudentVocabularyProgress[]> {
  const q = query(
    collection(db, PROGRESS),
    where("studentId", "==", studentId),
    where("nextReviewAt", "<=", now)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as StudentVocabularyProgress);
}

export async function saveLookup(entry: LookupHistory): Promise<void> {
  await addDoc(collection(db, LOOKUPS), entry);
}
