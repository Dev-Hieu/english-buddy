import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";
import { buildQuiz } from "../utils/quizGenerator";
import type { QuizQuestion, QuizResult, VocabularyWord } from "../types";

const VOCAB = "vocabulary";
const RESULTS = "quiz_results";

async function getWordsByTopic(topicId: string): Promise<VocabularyWord[]> {
  const q = query(collection(db, VOCAB), where("topicIds", "array-contains", topicId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as VocabularyWord);
}

export async function generateQuiz(topicId: string, count: number): Promise<QuizQuestion[]> {
  const words = await getWordsByTopic(topicId);
  return buildQuiz(words, count);
}

export async function submitQuiz(result: QuizResult): Promise<void> {
  await addDoc(collection(db, RESULTS), result);
}
