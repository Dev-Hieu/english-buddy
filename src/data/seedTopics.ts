import type { Topic } from "../types";

// 10 chủ đề MVP — TECH_SPEC §7.2. order = thứ tự hiển thị ở TopicListPage.
export const SEED_TOPICS: Topic[] = [
  { id: "topic_food", name: "Food", name_vi: "Đồ ăn", level: "beginner", order: 1 },
  { id: "topic_school", name: "School", name_vi: "Trường học", level: "beginner", order: 2 },
  { id: "topic_family", name: "Family", name_vi: "Gia đình", level: "beginner", order: 3 },
  { id: "topic_animals", name: "Animals", name_vi: "Động vật", level: "beginner", order: 4 },
  { id: "topic_sports", name: "Sports", name_vi: "Thể thao", level: "beginner", order: 5 },
  { id: "topic_daily", name: "Daily Activities", name_vi: "Hoạt động hằng ngày", level: "beginner", order: 6 },
  { id: "topic_feelings", name: "Feelings", name_vi: "Cảm xúc", level: "beginner", order: 7 },
  { id: "topic_house", name: "House", name_vi: "Ngôi nhà", level: "beginner", order: 8 },
  { id: "topic_clothes", name: "Clothes", name_vi: "Quần áo", level: "beginner", order: 9 },
  { id: "topic_travel", name: "Travel", name_vi: "Du lịch", level: "beginner", order: 10 },
];
