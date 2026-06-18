import { useState } from "react";
import { HomePage } from "@/pages/HomePage";
import { LessonPage } from "@/pages/LessonPage";

type View = "home" | "lesson";

export function App() {
  const [view, setView] = useState<View>("home");

  if (view === "lesson") {
    return <LessonPage topicId="topic_food" onBackHome={() => setView("home")} />;
  }

  return <HomePage onStartFoodLesson={() => setView("lesson")} />;
}
