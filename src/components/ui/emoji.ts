// Emoji vui cho chủ đề & avatar — tăng chất "Memrise" cho UI.
export const TOPIC_EMOJI: Record<string, string> = {
  topic_food: "🍎",
  topic_school: "🏫",
  topic_family: "👨‍👩‍👧",
  topic_animals: "🐶",
  topic_sports: "⚽",
  topic_daily: "🌅",
  topic_feelings: "😊",
  topic_house: "🏠",
  topic_clothes: "👕",
  topic_travel: "✈️",
  topic_environment: "🌍",
  topic_technology: "💻",
  topic_health: "🩺",
  topic_education: "🎓",
  topic_work: "💼",
  topic_society: "🏙️",
  topic_science: "🔬",
  topic_culture: "🎭",
  topic_greetings: "👋",
  topic_weather: "🌤️",
  topic_numbers: "🔢",
  topic_colors: "🎨",
  topic_body: "🦴",
  topic_hobbies: "🎯",
  topic_shopping: "🛒",
};

export const topicEmoji = (id: string) => TOPIC_EMOJI[id] ?? "📚";

export const avatarEmoji = (avatar: string) => (avatar.includes("girl") ? "👧" : "👦");
