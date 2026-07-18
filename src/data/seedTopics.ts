import type { Topic } from "../types";

// Thứ tự khớp với lộ trình LearningPathPage (CURRICULUM).
// Level = cấp độ chính của topic trong lộ trình.
export const SEED_TOPICS: Topic[] = [
  // ═══ A1 — Tuần 1: Chào hỏi & Gia đình ═══
  { id: "topic_greetings", name: "Greetings", name_vi: "Chào hỏi", level: "a1", order: 1 },
  { id: "topic_people", name: "People & Descriptions", name_vi: "Con người & Miêu tả", level: "a1", order: 2 },
  { id: "topic_numbers", name: "Numbers & Time", name_vi: "Số & Thời gian", level: "a1", order: 3 },
  { id: "topic_family", name: "Family", name_vi: "Gia đình", level: "a1", order: 4 },
  { id: "topic_colors", name: "Colors & Shapes", name_vi: "Màu sắc & Hình dạng", level: "a1", order: 5 },
  // ═══ A1 — Tuần 2: Nhà & Sinh hoạt ═══
  { id: "topic_house", name: "House", name_vi: "Ngôi nhà", level: "a1", order: 6 },
  { id: "topic_daily", name: "Daily Activities", name_vi: "Hoạt động hằng ngày", level: "a1", order: 7 },
  { id: "topic_body", name: "Body Parts", name_vi: "Cơ thể", level: "a1", order: 8 },
  { id: "topic_animals", name: "Animals", name_vi: "Động vật", level: "a1", order: 9 },
  // ═══ A1 — Tuần 3: Đồ ăn & Mua sắm ═══
  { id: "topic_food", name: "Food", name_vi: "Đồ ăn", level: "a1", order: 10 },
  { id: "topic_shopping", name: "Shopping", name_vi: "Mua sắm", level: "a1", order: 11 },
  { id: "topic_hobbies", name: "Hobbies", name_vi: "Sở thích", level: "a1", order: 12 },
  // ═══ A1 — Tuần 4: Trường & Thành phố ═══
  { id: "topic_school", name: "School", name_vi: "Trường học", level: "a1", order: 13 },
  { id: "topic_transport", name: "Transport", name_vi: "Giao thông & Phương tiện", level: "a1", order: 14 },
  { id: "topic_city", name: "City & Places", name_vi: "Thành phố & Địa điểm", level: "a1", order: 15 },
  { id: "topic_weather", name: "Weather & Seasons", name_vi: "Thời tiết & Mùa", level: "a1", order: 16 },
  // ═══ A2 — Du lịch & Giao tiếp ═══
  { id: "topic_sports", name: "Sports", name_vi: "Thể thao", level: "a2", order: 17 },
  { id: "topic_feelings", name: "Feelings", name_vi: "Cảm xúc", level: "a2", order: 18 },
  { id: "topic_clothes", name: "Clothes", name_vi: "Quần áo", level: "a2", order: 19 },
  { id: "topic_travel", name: "Travel", name_vi: "Du lịch", level: "a2", order: 20 },
  { id: "topic_jobs", name: "Jobs & Occupations", name_vi: "Nghề nghiệp", level: "a2", order: 21 },
  { id: "topic_entertainment", name: "Entertainment & Media", name_vi: "Giải trí & Truyền thông", level: "a2", order: 22 },
  // ═══ B1 — Xã hội & Công nghệ ═══
  { id: "topic_environment", name: "Environment", name_vi: "Môi trường", level: "b1", order: 23 },
  { id: "topic_technology", name: "Technology", name_vi: "Công nghệ", level: "b1", order: 24 },
  { id: "topic_health", name: "Health", name_vi: "Sức khỏe", level: "b1", order: 25 },
  { id: "topic_communication", name: "Communication", name_vi: "Giao tiếp & Ngôn ngữ", level: "b1", order: 26 },
  { id: "topic_community", name: "Community & Social", name_vi: "Cộng đồng & Đời sống", level: "b1", order: 27 },
  // ═══ B2 — Nghề & Xã hội ═══
  { id: "topic_education", name: "Education", name_vi: "Giáo dục", level: "b2", order: 28 },
  { id: "topic_work", name: "Work & Career", name_vi: "Công việc & nghề nghiệp", level: "b2", order: 29 },
  { id: "topic_society", name: "Society", name_vi: "Xã hội", level: "b2", order: 30 },
  { id: "topic_politics", name: "Politics & Economy", name_vi: "Chính trị & Kinh tế", level: "b2", order: 31 },
  // ═══ C1 — Học thuật & Quốc tế ═══
  { id: "topic_science", name: "Science", name_vi: "Khoa học", level: "c1", order: 32 },
  { id: "topic_culture", name: "Culture & Media", name_vi: "Văn hóa & truyền thông", level: "c1", order: 33 },
  { id: "topic_academic", name: "Academic & Research", name_vi: "Học thuật & Nghiên cứu", level: "c1", order: 34 },
  { id: "topic_global", name: "Global Issues", name_vi: "Vấn đề toàn cầu", level: "c1", order: 35 },
];
