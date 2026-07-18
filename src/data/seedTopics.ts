import type { Topic } from "../types";

// Chủ đề trải từ trẻ em -> IELTS. Mỗi chủ đề gắn cấp độ gợi ý.
export const SEED_TOPICS: Topic[] = [
  // Cơ bản (trẻ em / A1 / A2)
  { id: "topic_food", name: "Food", name_vi: "Đồ ăn", level: "a1", order: 1 },
  { id: "topic_school", name: "School", name_vi: "Trường học", level: "a1", order: 2 },
  { id: "topic_family", name: "Family", name_vi: "Gia đình", level: "a1", order: 3 },
  { id: "topic_animals", name: "Animals", name_vi: "Động vật", level: "a1", order: 4 },
  { id: "topic_sports", name: "Sports", name_vi: "Thể thao", level: "a2", order: 5 },
  { id: "topic_daily", name: "Daily Activities", name_vi: "Hoạt động hằng ngày", level: "a1", order: 6 },
  { id: "topic_feelings", name: "Feelings", name_vi: "Cảm xúc", level: "a2", order: 7 },
  { id: "topic_house", name: "House", name_vi: "Ngôi nhà", level: "a1", order: 8 },
  { id: "topic_clothes", name: "Clothes", name_vi: "Quần áo", level: "a2", order: 9 },
  { id: "topic_travel", name: "Travel", name_vi: "Du lịch", level: "a2", order: 10 },
  // Nâng cao (B1 / B2 / C1 - IELTS)
  { id: "topic_environment", name: "Environment", name_vi: "Môi trường", level: "b1", order: 11 },
  { id: "topic_technology", name: "Technology", name_vi: "Công nghệ", level: "b1", order: 12 },
  { id: "topic_health", name: "Health", name_vi: "Sức khỏe", level: "b1", order: 13 },
  { id: "topic_education", name: "Education", name_vi: "Giáo dục", level: "b2", order: 14 },
  { id: "topic_work", name: "Work & Career", name_vi: "Công việc & nghề nghiệp", level: "b2", order: 15 },
  { id: "topic_society", name: "Society", name_vi: "Xã hội", level: "b2", order: 16 },
  { id: "topic_science", name: "Science", name_vi: "Khoa học", level: "c1", order: 17 },
  { id: "topic_culture", name: "Culture & Media", name_vi: "Văn hóa & truyền thông", level: "c1", order: 18 },
  // Chủ đề mới (Oxford 3000)
  { id: "topic_greetings", name: "Greetings", name_vi: "Chào hỏi", level: "kids", order: 19 },
  { id: "topic_weather", name: "Weather & Seasons", name_vi: "Thời tiết & Mùa", level: "kids", order: 20 },
  { id: "topic_numbers", name: "Numbers & Time", name_vi: "Số & Thời gian", level: "kids", order: 21 },
  { id: "topic_colors", name: "Colors & Shapes", name_vi: "Màu sắc & Hình dạng", level: "kids", order: 22 },
  { id: "topic_body", name: "Body Parts", name_vi: "Cơ thể", level: "kids", order: 23 },
  { id: "topic_hobbies", name: "Hobbies", name_vi: "Sở thích", level: "a1", order: 24 },
  { id: "topic_shopping", name: "Shopping", name_vi: "Mua sắm", level: "a1", order: 25 },
  // 10 chủ đề mới (Cambridge A2 Key + LanGeek + Oxford 3000)
  { id: "topic_people", name: "People & Descriptions", name_vi: "Con người & Miêu tả", level: "kids", order: 26 },
  { id: "topic_transport", name: "Transport", name_vi: "Giao thông & Phương tiện", level: "a1", order: 27 },
  { id: "topic_city", name: "City & Places", name_vi: "Thành phố & Địa điểm", level: "a1", order: 28 },
  { id: "topic_jobs", name: "Jobs & Occupations", name_vi: "Nghề nghiệp", level: "a2", order: 29 },
  { id: "topic_entertainment", name: "Entertainment & Media", name_vi: "Giải trí & Truyền thông", level: "a2", order: 30 },
  { id: "topic_communication", name: "Communication", name_vi: "Giao tiếp & Ngôn ngữ", level: "b1", order: 31 },
  { id: "topic_community", name: "Community & Social", name_vi: "Cộng đồng & Đời sống", level: "b1", order: 32 },
  { id: "topic_politics", name: "Politics & Economy", name_vi: "Chính trị & Kinh tế", level: "b2", order: 33 },
  { id: "topic_academic", name: "Academic & Research", name_vi: "Học thuật & Nghiên cứu", level: "c1", order: 34 },
  { id: "topic_global", name: "Global Issues", name_vi: "Vấn đề toàn cầu", level: "c1", order: 35 },
];
