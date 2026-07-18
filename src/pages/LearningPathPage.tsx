import { useState, useEffect } from "react";
import { BookOpen, Check, Ear, GraduationCap, Mic, PenLine, Star } from "lucide-react";
import type { Student } from "@/types";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { cn } from "@/components/ui/cn";

// ── Types ──

interface Skill {
  type: "vocab" | "grammar" | "listen" | "read" | "speak" | "write";
  label: string;
  view: string;
  topicId?: string;
}

interface Lesson {
  id: string;
  week: number;
  day: number;
  title: string;
  titleVi: string;
  skills: Skill[];
}

interface LearningPathPageProps {
  student: Student;
  onNavigate: (view: string, topicId?: string, level?: string) => void;
  onBackHome: () => void;
}

// ── Skill icon/color mapping ──

const SKILL_META: Record<Skill["type"], { icon: typeof BookOpen; bg: string }> = {
  vocab: { icon: Star, bg: "bg-amber-500" },
  grammar: { icon: GraduationCap, bg: "bg-rose-500" },
  listen: { icon: Ear, bg: "bg-blue-500" },
  read: { icon: BookOpen, bg: "bg-green-500" },
  speak: { icon: Mic, bg: "bg-teal-500" },
  write: { icon: PenLine, bg: "bg-violet-500" },
};

// ── Curriculum data ──

const CURRICULUM: Record<string, Lesson[]> = {
  // ═══════════════════════════════════════════════════════════════════
  // A1 — 16 topics: people, greetings, numbers, colors, family, body (kids)
  //                + house, daily, animals, food, shopping, hobbies, school, weather, transport, city (a1)
  // ═══════════════════════════════════════════════════════════════════
  a1: [
    // Week 1: Chào hỏi & Gia đình — people, greetings, numbers, family, colors
    { id: "a1-w1d1", week: 1, day: 1, title: "Hello & Goodbye", titleVi: "Chào hỏi & Tạm biệt", skills: [
      { type: "vocab", label: "Từ vựng chào hỏi", view: "topics", topicId: "topic_greetings" },
      { type: "speak", label: "Luyện nói lời chào", view: "speak", topicId: "topic_greetings" },
      { type: "listen", label: "Nghe lời chào", view: "listening" },
    ]},
    { id: "a1-w1d2", week: 1, day: 2, title: "People Around Me", titleVi: "Những người quanh em", skills: [
      { type: "vocab", label: "Từ vựng về người", view: "topics", topicId: "topic_people" },
      { type: "listen", label: "Nghe miêu tả người", view: "listening" },
      { type: "grammar", label: "Đại từ nhân xưng", view: "grammar" },
    ]},
    { id: "a1-w1d3", week: 1, day: 3, title: "Numbers & Time", titleVi: "Số đếm & Thời gian", skills: [
      { type: "vocab", label: "Từ vựng số & giờ", view: "topics", topicId: "topic_numbers" },
      { type: "write", label: "Viết số", view: "writing" },
      { type: "listen", label: "Nghe & đếm", view: "listening" },
    ]},
    { id: "a1-w1d4", week: 1, day: 4, title: "My Family", titleVi: "Gia đình tôi", skills: [
      { type: "vocab", label: "Từ vựng gia đình", view: "topics", topicId: "topic_family" },
      { type: "read", label: "Đọc 'My Family'", view: "reading" },
      { type: "speak", label: "Nói về gia đình", view: "speak", topicId: "topic_family" },
    ]},
    { id: "a1-w1d5", week: 1, day: 5, title: "Colors & Shapes", titleVi: "Màu sắc & Hình dạng", skills: [
      { type: "vocab", label: "Từ vựng màu sắc", view: "topics", topicId: "topic_colors" },
      { type: "grammar", label: "Cấu trúc 'It is...'", view: "grammar" },
      { type: "write", label: "Mô tả hình ảnh", view: "writing" },
    ]},
    // Week 2: Nhà & Sinh hoạt — house, daily, body, animals
    { id: "a1-w2d1", week: 2, day: 1, title: "My House", titleVi: "Ngôi nhà của tôi", skills: [
      { type: "vocab", label: "Từ vựng ngôi nhà", view: "topics", topicId: "topic_house" },
      { type: "grammar", label: "There is / There are", view: "grammar" },
      { type: "listen", label: "Nghe miêu tả nhà", view: "listening" },
    ]},
    { id: "a1-w2d2", week: 2, day: 2, title: "Daily Activities", titleVi: "Hoạt động hàng ngày", skills: [
      { type: "vocab", label: "Từ vựng sinh hoạt", view: "topics", topicId: "topic_daily" },
      { type: "grammar", label: "Thì hiện tại đơn", view: "grammar" },
      { type: "speak", label: "Kể về ngày của em", view: "speak" },
    ]},
    { id: "a1-w2d3", week: 2, day: 3, title: "Body Parts", titleVi: "Bộ phận cơ thể", skills: [
      { type: "vocab", label: "Từ vựng cơ thể", view: "topics", topicId: "topic_body" },
      { type: "listen", label: "Nghe mô tả cơ thể", view: "listening" },
      { type: "write", label: "Viết miêu tả người", view: "writing" },
    ]},
    { id: "a1-w2d4", week: 2, day: 4, title: "Animals", titleVi: "Động vật", skills: [
      { type: "vocab", label: "Từ vựng động vật", view: "topics", topicId: "topic_animals" },
      { type: "read", label: "Đọc về động vật", view: "reading" },
      { type: "speak", label: "Nói về con vật yêu thích", view: "speak" },
    ]},
    { id: "a1-w2d5", week: 2, day: 5, title: "Review Week 2", titleVi: "Ôn tập Tuần 2", skills: [
      { type: "vocab", label: "Ôn từ vựng", view: "review" },
      { type: "grammar", label: "Ôn ngữ pháp", view: "grammar" },
      { type: "speak", label: "Luyện nói tổng hợp", view: "speak" },
    ]},
    // Week 3: Đồ ăn & Mua sắm — food, shopping, hobbies
    { id: "a1-w3d1", week: 3, day: 1, title: "Food & Drinks", titleVi: "Đồ ăn & Đồ uống", skills: [
      { type: "vocab", label: "Từ vựng đồ ăn", view: "topics", topicId: "topic_food" },
      { type: "listen", label: "Nghe tên thực phẩm", view: "listening" },
      { type: "speak", label: "Nói tên thực phẩm", view: "speak", topicId: "topic_food" },
    ]},
    { id: "a1-w3d2", week: 3, day: 2, title: "Shopping", titleVi: "Đi mua sắm", skills: [
      { type: "vocab", label: "Từ vựng mua sắm", view: "topics", topicId: "topic_shopping" },
      { type: "grammar", label: "How much / How many", view: "grammar" },
      { type: "listen", label: "Nghe hỏi giá", view: "listening" },
    ]},
    { id: "a1-w3d3", week: 3, day: 3, title: "Hobbies & Free Time", titleVi: "Sở thích & Giải trí", skills: [
      { type: "vocab", label: "Từ vựng sở thích", view: "topics", topicId: "topic_hobbies" },
      { type: "speak", label: "Nói về sở thích", view: "speak" },
      { type: "write", label: "Viết về sở thích", view: "writing" },
    ]},
    { id: "a1-w3d4", week: 3, day: 4, title: "At the Restaurant", titleVi: "Ở nhà hàng", skills: [
      { type: "grammar", label: "Some / Any", view: "grammar" },
      { type: "read", label: "Đọc thực đơn", view: "reading" },
      { type: "speak", label: "Đặt món ăn", view: "speak" },
    ]},
    { id: "a1-w3d5", week: 3, day: 5, title: "Review Week 3", titleVi: "Ôn tập Tuần 3", skills: [
      { type: "vocab", label: "Ôn từ vựng", view: "review" },
      { type: "listen", label: "Nghe tổng hợp", view: "listening" },
      { type: "write", label: "Viết về bữa ăn yêu thích", view: "writing" },
    ]},
    // Week 4: Trường & Thành phố — school, weather, transport, city
    { id: "a1-w4d1", week: 4, day: 1, title: "School", titleVi: "Trường học", skills: [
      { type: "vocab", label: "Từ vựng trường học", view: "topics", topicId: "topic_school" },
      { type: "listen", label: "Nghe tên đồ vật", view: "listening" },
      { type: "grammar", label: "This / That / These / Those", view: "grammar" },
    ]},
    { id: "a1-w4d2", week: 4, day: 2, title: "Transport", titleVi: "Phương tiện giao thông", skills: [
      { type: "vocab", label: "Từ vựng giao thông", view: "topics", topicId: "topic_transport" },
      { type: "listen", label: "Nghe về phương tiện", view: "listening" },
      { type: "speak", label: "Nói cách đi học", view: "speak" },
    ]},
    { id: "a1-w4d3", week: 4, day: 3, title: "City & Places", titleVi: "Thành phố & Địa điểm", skills: [
      { type: "vocab", label: "Từ vựng thành phố", view: "topics", topicId: "topic_city" },
      { type: "read", label: "Đọc bản đồ", view: "reading" },
      { type: "write", label: "Viết về thành phố", view: "writing" },
    ]},
    { id: "a1-w4d4", week: 4, day: 4, title: "Weather & Seasons", titleVi: "Thời tiết & Mùa", skills: [
      { type: "vocab", label: "Từ vựng thời tiết", view: "topics", topicId: "topic_weather" },
      { type: "listen", label: "Nghe dự báo thời tiết", view: "listening" },
      { type: "speak", label: "Nói về thời tiết", view: "speak" },
    ]},
    { id: "a1-w4d5", week: 4, day: 5, title: "Final Review", titleVi: "Ôn tập tổng kết", skills: [
      { type: "vocab", label: "Ôn toàn bộ từ vựng", view: "review" },
      { type: "grammar", label: "Ôn ngữ pháp", view: "grammar" },
      { type: "speak", label: "Nói tự do", view: "speak" },
    ]},
  ],
  // ═══════════════════════════════════════════════════════════════════
  // A2 — 6 topics mới: sports, feelings, clothes, travel, jobs, entertainment
  // ═══════════════════════════════════════════════════════════════════
  a2: [
    // Week 1: Giao thông & Du lịch — transport, travel
    { id: "a2-w1d1", week: 1, day: 1, title: "Means of Transport", titleVi: "Phương tiện giao thông", skills: [
      { type: "vocab", label: "Từ vựng giao thông", view: "topics", topicId: "topic_transport" },
      { type: "listen", label: "Nghe hướng dẫn đi lại", view: "listening" },
      { type: "grammar", label: "Can / Could", view: "grammar" },
    ]},
    { id: "a2-w1d2", week: 1, day: 2, title: "Asking for Directions", titleVi: "Hỏi đường", skills: [
      { type: "speak", label: "Luyện hỏi đường", view: "speak" },
      { type: "listen", label: "Nghe chỉ đường", view: "listening" },
      { type: "write", label: "Viết chỉ dẫn", view: "writing" },
    ]},
    { id: "a2-w1d3", week: 1, day: 3, title: "At the Airport", titleVi: "Ở sân bay", skills: [
      { type: "vocab", label: "Từ vựng sân bay", view: "topics", topicId: "topic_travel" },
      { type: "read", label: "Đọc bảng thông báo", view: "reading" },
      { type: "speak", label: "Làm thủ tục bay", view: "speak" },
    ]},
    { id: "a2-w1d4", week: 1, day: 4, title: "Booking a Hotel", titleVi: "Đặt phòng khách sạn", skills: [
      { type: "listen", label: "Nghe đặt phòng", view: "listening" },
      { type: "write", label: "Viết email đặt phòng", view: "writing" },
      { type: "grammar", label: "Would like to...", view: "grammar" },
    ]},
    { id: "a2-w1d5", week: 1, day: 5, title: "Review Week 1", titleVi: "Ôn tập Tuần 1", skills: [
      { type: "vocab", label: "Ôn từ vựng", view: "review" },
      { type: "listen", label: "Nghe tổng hợp", view: "listening" },
      { type: "speak", label: "Hội thoại du lịch", view: "speak" },
    ]},
    // Week 2: Quần áo & Cảm xúc — clothes, feelings, jobs
    { id: "a2-w2d1", week: 2, day: 1, title: "Clothes & Fashion", titleVi: "Quần áo & Thời trang", skills: [
      { type: "vocab", label: "Từ vựng quần áo", view: "topics", topicId: "topic_clothes" },
      { type: "listen", label: "Nghe miêu tả trang phục", view: "listening" },
      { type: "grammar", label: "So sánh hơn", view: "grammar" },
    ]},
    { id: "a2-w2d2", week: 2, day: 2, title: "Feelings & Emotions", titleVi: "Cảm xúc & Tâm trạng", skills: [
      { type: "vocab", label: "Từ vựng cảm xúc", view: "topics", topicId: "topic_feelings" },
      { type: "speak", label: "Nói về cảm xúc", view: "speak" },
      { type: "listen", label: "Nghe câu chuyện cảm xúc", view: "listening" },
    ]},
    { id: "a2-w2d3", week: 2, day: 3, title: "Jobs & Occupations", titleVi: "Nghề nghiệp", skills: [
      { type: "vocab", label: "Từ vựng nghề nghiệp", view: "topics", topicId: "topic_jobs" },
      { type: "read", label: "Đọc mô tả công việc", view: "reading" },
      { type: "speak", label: "Nói về nghề mơ ước", view: "speak" },
    ]},
    { id: "a2-w2d4", week: 2, day: 4, title: "Describing People", titleVi: "Miêu tả người", skills: [
      { type: "vocab", label: "Từ vựng tính cách", view: "topics", topicId: "topic_feelings" },
      { type: "write", label: "Viết miêu tả bạn thân", view: "writing" },
      { type: "grammar", label: "Tính từ so sánh nhất", view: "grammar" },
    ]},
    { id: "a2-w2d5", week: 2, day: 5, title: "Review Week 2", titleVi: "Ôn tập Tuần 2", skills: [
      { type: "vocab", label: "Ôn từ vựng", view: "review" },
      { type: "grammar", label: "Ôn ngữ pháp", view: "grammar" },
      { type: "write", label: "Viết về trải nghiệm mua sắm", view: "writing" },
    ]},
    // Week 3: Thể thao & Sức khỏe — sports
    { id: "a2-w3d1", week: 3, day: 1, title: "Sports & Exercise", titleVi: "Thể thao & Tập luyện", skills: [
      { type: "vocab", label: "Từ vựng thể thao", view: "topics", topicId: "topic_sports" },
      { type: "listen", label: "Nghe bình luận thể thao", view: "listening" },
      { type: "grammar", label: "Have got / Has got", view: "grammar" },
    ]},
    { id: "a2-w3d2", week: 3, day: 2, title: "My Favorite Sport", titleVi: "Môn thể thao yêu thích", skills: [
      { type: "speak", label: "Nói về thể thao yêu thích", view: "speak" },
      { type: "read", label: "Đọc bài về VĐV", view: "reading" },
      { type: "write", label: "Viết về thể thao", view: "writing" },
    ]},
    { id: "a2-w3d3", week: 3, day: 3, title: "Healthy Habits", titleVi: "Thói quen lành mạnh", skills: [
      { type: "read", label: "Đọc bài về sức khỏe", view: "reading" },
      { type: "grammar", label: "Should / Shouldn't", view: "grammar" },
      { type: "speak", label: "Nói về thói quen", view: "speak" },
    ]},
    { id: "a2-w3d4", week: 3, day: 4, title: "At the Doctor", titleVi: "Đi khám bệnh", skills: [
      { type: "speak", label: "Miêu tả triệu chứng", view: "speak" },
      { type: "listen", label: "Nghe lời khuyên bác sĩ", view: "listening" },
      { type: "write", label: "Viết về thói quen lành mạnh", view: "writing" },
    ]},
    { id: "a2-w3d5", week: 3, day: 5, title: "Review Week 3", titleVi: "Ôn tập Tuần 3", skills: [
      { type: "vocab", label: "Ôn từ vựng", view: "review" },
      { type: "speak", label: "Luyện nói tổng hợp", view: "speak" },
      { type: "listen", label: "Nghe tổng hợp", view: "listening" },
    ]},
    // Week 4: Giải trí & Ôn tập — entertainment
    { id: "a2-w4d1", week: 4, day: 1, title: "Entertainment & Media", titleVi: "Giải trí & Truyền thông", skills: [
      { type: "vocab", label: "Từ vựng giải trí", view: "topics", topicId: "topic_entertainment" },
      { type: "listen", label: "Nghe review phim", view: "listening" },
      { type: "speak", label: "Nói về phim yêu thích", view: "speak" },
    ]},
    { id: "a2-w4d2", week: 4, day: 2, title: "Music & Games", titleVi: "Âm nhạc & Trò chơi", skills: [
      { type: "vocab", label: "Từ vựng âm nhạc", view: "topics", topicId: "topic_entertainment" },
      { type: "read", label: "Đọc về ngôi sao", view: "reading" },
      { type: "write", label: "Viết review bài hát", view: "writing" },
    ]},
    { id: "a2-w4d3", week: 4, day: 3, title: "Holiday Plans", titleVi: "Kế hoạch nghỉ lễ", skills: [
      { type: "grammar", label: "Going to + V", view: "grammar" },
      { type: "speak", label: "Nói về kế hoạch", view: "speak" },
      { type: "grammar", label: "Thì quá khứ đơn", view: "grammar" },
    ]},
    { id: "a2-w4d4", week: 4, day: 4, title: "My Life", titleVi: "Cuộc sống của tôi", skills: [
      { type: "read", label: "Đọc tiểu sử", view: "reading" },
      { type: "speak", label: "Kể về cuộc sống", view: "speak" },
      { type: "listen", label: "Nghe phỏng vấn", view: "listening" },
    ]},
    { id: "a2-w4d5", week: 4, day: 5, title: "Final Review", titleVi: "Ôn tập tổng kết", skills: [
      { type: "vocab", label: "Ôn toàn bộ từ vựng", view: "review" },
      { type: "grammar", label: "Ôn ngữ pháp", view: "grammar" },
      { type: "speak", label: "Nói tự do", view: "speak" },
    ]},
  ],
  // ═══════════════════════════════════════════════════════════════════
  // B1 — 5 topics mới: health, environment, technology, communication, community
  // ═══════════════════════════════════════════════════════════════════
  b1: [
    // Week 1: Sức khỏe & Môi trường — health, environment
    { id: "b1-w1d1", week: 1, day: 1, title: "Health & Wellness", titleVi: "Sức khỏe & Dinh dưỡng", skills: [
      { type: "vocab", label: "Từ vựng sức khỏe", view: "topics", topicId: "topic_health" },
      { type: "listen", label: "Nghe lời khuyên sức khỏe", view: "listening" },
      { type: "grammar", label: "Present Perfect", view: "grammar" },
    ]},
    { id: "b1-w1d2", week: 1, day: 2, title: "Mental Health", titleVi: "Sức khỏe tinh thần", skills: [
      { type: "read", label: "Đọc bài về stress", view: "reading" },
      { type: "speak", label: "Thảo luận về sức khỏe tinh thần", view: "speak" },
      { type: "write", label: "Viết về thói quen tốt", view: "writing" },
    ]},
    { id: "b1-w1d3", week: 1, day: 3, title: "Environment Issues", titleVi: "Vấn đề môi trường", skills: [
      { type: "vocab", label: "Từ vựng môi trường", view: "topics", topicId: "topic_environment" },
      { type: "read", label: "Đọc bài về ô nhiễm", view: "reading" },
      { type: "grammar", label: "Conditionals Type 1 & 2", view: "grammar" },
    ]},
    { id: "b1-w1d4", week: 1, day: 4, title: "Green Living", titleVi: "Sống xanh", skills: [
      { type: "listen", label: "Nghe phóng sự môi trường", view: "listening" },
      { type: "speak", label: "Thảo luận giải pháp", view: "speak" },
      { type: "write", label: "Viết bài về bảo vệ MT", view: "writing" },
    ]},
    { id: "b1-w1d5", week: 1, day: 5, title: "Review Week 1", titleVi: "Ôn tập Tuần 1", skills: [
      { type: "vocab", label: "Ôn từ vựng", view: "review" },
      { type: "listen", label: "Nghe tổng hợp", view: "listening" },
      { type: "speak", label: "Thảo luận nhóm", view: "speak" },
    ]},
    // Week 2: Công nghệ — technology
    { id: "b1-w2d1", week: 2, day: 1, title: "Tech & Gadgets", titleVi: "Công nghệ & Thiết bị", skills: [
      { type: "vocab", label: "Từ vựng công nghệ", view: "topics", topicId: "topic_technology" },
      { type: "listen", label: "Nghe review sản phẩm", view: "listening" },
      { type: "grammar", label: "Passive Voice", view: "grammar" },
    ]},
    { id: "b1-w2d2", week: 2, day: 2, title: "Social Media", titleVi: "Mạng xã hội", skills: [
      { type: "read", label: "Đọc bài về mạng xã hội", view: "reading" },
      { type: "speak", label: "Tranh luận về MXH", view: "speak" },
      { type: "write", label: "Viết ý kiến về MXH", view: "writing" },
    ]},
    { id: "b1-w2d3", week: 2, day: 3, title: "News & Articles", titleVi: "Tin tức & Báo chí", skills: [
      { type: "read", label: "Đọc tin tức", view: "reading" },
      { type: "vocab", label: "Từ vựng truyền thông", view: "topics", topicId: "topic_technology" },
      { type: "listen", label: "Nghe bản tin", view: "listening" },
    ]},
    { id: "b1-w2d4", week: 2, day: 4, title: "Movies & Entertainment", titleVi: "Phim & Giải trí", skills: [
      { type: "speak", label: "Review phim", view: "speak" },
      { type: "write", label: "Viết review phim", view: "writing" },
      { type: "grammar", label: "Relative Clauses", view: "grammar" },
    ]},
    { id: "b1-w2d5", week: 2, day: 5, title: "Review Week 2", titleVi: "Ôn tập Tuần 2", skills: [
      { type: "vocab", label: "Ôn từ vựng", view: "review" },
      { type: "grammar", label: "Ôn ngữ pháp", view: "grammar" },
      { type: "speak", label: "Thuyết trình ngắn", view: "speak" },
    ]},
    // Week 3: Giao tiếp & Cộng đồng — communication, community
    { id: "b1-w3d1", week: 3, day: 1, title: "Communication Skills", titleVi: "Kỹ năng giao tiếp", skills: [
      { type: "vocab", label: "Từ vựng giao tiếp", view: "topics", topicId: "topic_communication" },
      { type: "speak", label: "Luyện tranh luận", view: "speak" },
      { type: "grammar", label: "Reported Speech", view: "grammar" },
    ]},
    { id: "b1-w3d2", week: 3, day: 2, title: "Media & News", titleVi: "Truyền thông & Tin tức", skills: [
      { type: "vocab", label: "Từ vựng truyền thông", view: "topics", topicId: "topic_communication" },
      { type: "read", label: "Đọc bài báo", view: "reading" },
      { type: "listen", label: "Nghe thời sự", view: "listening" },
    ]},
    { id: "b1-w3d3", week: 3, day: 3, title: "Community & Volunteering", titleVi: "Cộng đồng & Tình nguyện", skills: [
      { type: "vocab", label: "Từ vựng cộng đồng", view: "topics", topicId: "topic_community" },
      { type: "read", label: "Đọc về tình nguyện", view: "reading" },
      { type: "speak", label: "Kể về trải nghiệm", view: "speak" },
    ]},
    { id: "b1-w3d4", week: 3, day: 4, title: "Social Issues", titleVi: "Vấn đề xã hội", skills: [
      { type: "vocab", label: "Từ vựng xã hội", view: "topics", topicId: "topic_community" },
      { type: "listen", label: "Nghe podcast xã hội", view: "listening" },
      { type: "write", label: "Viết bài luận ngắn", view: "writing" },
    ]},
    { id: "b1-w3d5", week: 3, day: 5, title: "Review Week 3", titleVi: "Ôn tập Tuần 3", skills: [
      { type: "vocab", label: "Ôn từ vựng", view: "review" },
      { type: "listen", label: "Nghe tổng hợp", view: "listening" },
      { type: "write", label: "Viết bài luận ngắn", view: "writing" },
    ]},
    // Week 4: Du lịch & Văn hóa — travel (ôn nâng cao)
    { id: "b1-w4d1", week: 4, day: 1, title: "Travel Stories", titleVi: "Câu chuyện du lịch", skills: [
      { type: "read", label: "Đọc nhật ký du lịch", view: "reading" },
      { type: "speak", label: "Kể về chuyến đi", view: "speak" },
      { type: "grammar", label: "Past Perfect", view: "grammar" },
    ]},
    { id: "b1-w4d2", week: 4, day: 2, title: "Food Around the World", titleVi: "Ẩm thực thế giới", skills: [
      { type: "listen", label: "Nghe về ẩm thực", view: "listening" },
      { type: "speak", label: "Giới thiệu món ăn VN", view: "speak" },
      { type: "write", label: "Viết về món ăn", view: "writing" },
    ]},
    { id: "b1-w4d3", week: 4, day: 3, title: "Festivals & Celebrations", titleVi: "Lễ hội", skills: [
      { type: "read", label: "Đọc về lễ hội", view: "reading" },
      { type: "listen", label: "Nghe giới thiệu đất nước", view: "listening" },
      { type: "write", label: "Viết về lễ hội yêu thích", view: "writing" },
    ]},
    { id: "b1-w4d4", week: 4, day: 4, title: "Cross-Cultural Communication", titleVi: "Giao tiếp đa văn hóa", skills: [
      { type: "speak", label: "Thảo luận văn hóa", view: "speak" },
      { type: "read", label: "Đọc về phong tục", view: "reading" },
      { type: "grammar", label: "Ôn tổng ngữ pháp", view: "grammar" },
    ]},
    { id: "b1-w4d5", week: 4, day: 5, title: "Final Review", titleVi: "Ôn tập tổng kết", skills: [
      { type: "vocab", label: "Ôn toàn bộ từ vựng", view: "review" },
      { type: "grammar", label: "Ôn ngữ pháp", view: "grammar" },
      { type: "speak", label: "Thuyết trình tự do", view: "speak" },
    ]},
  ],
  // ═══════════════════════════════════════════════════════════════════
  // B2 — 4 topics mới: work, education, society, politics
  // ═══════════════════════════════════════════════════════════════════
  b2: [
    // Week 1: Công việc & Nghề nghiệp — work
    { id: "b2-w1d1", week: 1, day: 1, title: "Jobs & Career", titleVi: "Nghề nghiệp & Sự nghiệp", skills: [
      { type: "vocab", label: "Từ vựng nghề nghiệp", view: "topics", topicId: "topic_work" },
      { type: "listen", label: "Nghe phỏng vấn xin việc", view: "listening" },
      { type: "grammar", label: "Mixed Conditionals", view: "grammar" },
    ]},
    { id: "b2-w1d2", week: 1, day: 2, title: "Job Interview", titleVi: "Phỏng vấn xin việc", skills: [
      { type: "speak", label: "Luyện phỏng vấn", view: "speak" },
      { type: "read", label: "Đọc CV mẫu", view: "reading" },
      { type: "write", label: "Viết thư xin việc", view: "writing" },
    ]},
    { id: "b2-w1d3", week: 1, day: 3, title: "Office & Business", titleVi: "Văn phòng & Kinh doanh", skills: [
      { type: "vocab", label: "Từ vựng kinh doanh", view: "topics", topicId: "topic_work" },
      { type: "listen", label: "Nghe hội thoại văn phòng", view: "listening" },
      { type: "speak", label: "Pitch ý tưởng", view: "speak" },
    ]},
    { id: "b2-w1d4", week: 1, day: 4, title: "Marketing & Advertising", titleVi: "Tiếp thị & Quảng cáo", skills: [
      { type: "listen", label: "Nghe quảng cáo", view: "listening" },
      { type: "write", label: "Viết quảng cáo sản phẩm", view: "writing" },
      { type: "grammar", label: "Inversion", view: "grammar" },
    ]},
    { id: "b2-w1d5", week: 1, day: 5, title: "Review Week 1", titleVi: "Ôn tập Tuần 1", skills: [
      { type: "vocab", label: "Ôn từ vựng", view: "review" },
      { type: "speak", label: "Thuyết trình kinh doanh", view: "speak" },
      { type: "write", label: "Viết báo cáo", view: "writing" },
    ]},
    // Week 2: Giáo dục — education
    { id: "b2-w2d1", week: 2, day: 1, title: "Education Systems", titleVi: "Hệ thống giáo dục", skills: [
      { type: "vocab", label: "Từ vựng giáo dục", view: "topics", topicId: "topic_education" },
      { type: "read", label: "Đọc bài so sánh giáo dục", view: "reading" },
      { type: "grammar", label: "Cleft sentences", view: "grammar" },
    ]},
    { id: "b2-w2d2", week: 2, day: 2, title: "University Life", titleVi: "Đời sống đại học", skills: [
      { type: "listen", label: "Nghe bài giảng đại học", view: "listening" },
      { type: "speak", label: "Tranh luận về giáo dục", view: "speak" },
      { type: "write", label: "Viết bài nghị luận", view: "writing" },
    ]},
    { id: "b2-w2d3", week: 2, day: 3, title: "Academic Writing", titleVi: "Viết học thuật", skills: [
      { type: "vocab", label: "Từ vựng học thuật", view: "topics", topicId: "topic_education" },
      { type: "write", label: "Viết bài essay", view: "writing" },
      { type: "grammar", label: "Formal linking words", view: "grammar" },
    ]},
    { id: "b2-w2d4", week: 2, day: 4, title: "Exam Preparation", titleVi: "Luyện thi", skills: [
      { type: "listen", label: "Nghe bài thi mẫu", view: "listening" },
      { type: "read", label: "Đọc bài mẫu IELTS", view: "reading" },
      { type: "speak", label: "Mock Speaking test", view: "speak" },
    ]},
    { id: "b2-w2d5", week: 2, day: 5, title: "Review Week 2", titleVi: "Ôn tập Tuần 2", skills: [
      { type: "vocab", label: "Ôn từ vựng", view: "review" },
      { type: "grammar", label: "Ôn ngữ pháp", view: "grammar" },
      { type: "listen", label: "Nghe TED Talk", view: "listening" },
    ]},
    // Week 3: Xã hội — society
    { id: "b2-w3d1", week: 3, day: 1, title: "Social Issues", titleVi: "Vấn đề xã hội", skills: [
      { type: "vocab", label: "Từ vựng xã hội", view: "topics", topicId: "topic_society" },
      { type: "read", label: "Đọc bài xã luận", view: "reading" },
      { type: "grammar", label: "Subjunctive mood", view: "grammar" },
    ]},
    { id: "b2-w3d2", week: 3, day: 2, title: "Human Rights", titleVi: "Nhân quyền", skills: [
      { type: "listen", label: "Nghe tranh luận", view: "listening" },
      { type: "speak", label: "Phản biện ý kiến", view: "speak" },
      { type: "write", label: "Viết bài nghị luận 2 mặt", view: "writing" },
    ]},
    { id: "b2-w3d3", week: 3, day: 3, title: "Media & Ethics", titleVi: "Truyền thông & Đạo đức", skills: [
      { type: "read", label: "Đọc bài về đạo đức", view: "reading" },
      { type: "vocab", label: "Từ vựng pháp lý", view: "topics", topicId: "topic_society" },
      { type: "speak", label: "Trình bày quan điểm", view: "speak" },
    ]},
    { id: "b2-w3d4", week: 3, day: 4, title: "Global Challenges", titleVi: "Thách thức toàn cầu", skills: [
      { type: "listen", label: "Nghe phỏng vấn", view: "listening" },
      { type: "write", label: "Viết bài phân tích", view: "writing" },
      { type: "grammar", label: "Emphasis & hedging", view: "grammar" },
    ]},
    { id: "b2-w3d5", week: 3, day: 5, title: "Review Week 3", titleVi: "Ôn tập Tuần 3", skills: [
      { type: "vocab", label: "Ôn từ vựng", view: "review" },
      { type: "speak", label: "Debate tự do", view: "speak" },
      { type: "write", label: "Viết bài luận hoàn chỉnh", view: "writing" },
    ]},
    // Week 4: Chính trị & Luyện thi — politics
    { id: "b2-w4d1", week: 4, day: 1, title: "Politics & Economy", titleVi: "Chính trị & Kinh tế", skills: [
      { type: "vocab", label: "Từ vựng chính trị", view: "topics", topicId: "topic_politics" },
      { type: "read", label: "Đọc bài phân tích", view: "reading" },
      { type: "grammar", label: "Participle clauses", view: "grammar" },
    ]},
    { id: "b2-w4d2", week: 4, day: 2, title: "Listening Exam", titleVi: "Luyện nghe thi", skills: [
      { type: "listen", label: "Nghe bài thi mẫu", view: "listening" },
      { type: "speak", label: "Tóm tắt nội dung nghe", view: "speak" },
      { type: "grammar", label: "Ôn tổng ngữ pháp", view: "grammar" },
    ]},
    { id: "b2-w4d3", week: 4, day: 3, title: "Speaking Exam", titleVi: "Luyện nói thi", skills: [
      { type: "speak", label: "Mock Speaking test", view: "speak" },
      { type: "listen", label: "Nghe bài mẫu speaking", view: "listening" },
      { type: "read", label: "Đọc bài thi mẫu", view: "reading" },
    ]},
    { id: "b2-w4d4", week: 4, day: 4, title: "Reading Comprehension", titleVi: "Đọc hiểu nâng cao", skills: [
      { type: "read", label: "Đọc & phân tích bài thi", view: "reading" },
      { type: "write", label: "Viết tóm tắt bài đọc", view: "writing" },
      { type: "speak", label: "Thuyết trình tự do", view: "speak" },
    ]},
    { id: "b2-w4d5", week: 4, day: 5, title: "Final Review", titleVi: "Ôn tập tổng kết", skills: [
      { type: "vocab", label: "Ôn toàn bộ từ vựng", view: "review" },
      { type: "grammar", label: "Ôn ngữ pháp", view: "grammar" },
      { type: "speak", label: "Thuyết trình tự do", view: "speak" },
    ]},
  ],
  // ═══════════════════════════════════════════════════════════════════
  // C1 — 4 topics mới: science, culture, academic, global
  // ═══════════════════════════════════════════════════════════════════
  c1: [
    // Week 1: Khoa học — science
    { id: "c1-w1d1", week: 1, day: 1, title: "Scientific Discovery", titleVi: "Phát minh khoa học", skills: [
      { type: "vocab", label: "Từ vựng khoa học", view: "topics", topicId: "topic_science" },
      { type: "read", label: "Đọc bài khoa học", view: "reading" },
      { type: "grammar", label: "Advanced Passive", view: "grammar" },
    ]},
    { id: "c1-w1d2", week: 1, day: 2, title: "Medical Advances", titleVi: "Tiến bộ y học", skills: [
      { type: "listen", label: "Nghe podcast y học", view: "listening" },
      { type: "speak", label: "Thảo luận y tế", view: "speak" },
      { type: "write", label: "Viết tóm tắt nghiên cứu", view: "writing" },
    ]},
    { id: "c1-w1d3", week: 1, day: 3, title: "AI & Future Tech", titleVi: "AI & Công nghệ tương lai", skills: [
      { type: "vocab", label: "Từ vựng AI", view: "topics", topicId: "topic_science" },
      { type: "read", label: "Đọc về trí tuệ nhân tạo", view: "reading" },
      { type: "speak", label: "Tranh luận về AI", view: "speak" },
    ]},
    { id: "c1-w1d4", week: 1, day: 4, title: "Space Exploration", titleVi: "Khám phá vũ trụ", skills: [
      { type: "listen", label: "Nghe phóng sự vũ trụ", view: "listening" },
      { type: "write", label: "Viết bài về tương lai", view: "writing" },
      { type: "grammar", label: "Participle clauses", view: "grammar" },
    ]},
    { id: "c1-w1d5", week: 1, day: 5, title: "Review Week 1", titleVi: "Ôn tập Tuần 1", skills: [
      { type: "vocab", label: "Ôn từ vựng", view: "review" },
      { type: "listen", label: "Nghe TED Talk", view: "listening" },
      { type: "speak", label: "Thuyết trình khoa học", view: "speak" },
    ]},
    // Week 2: Văn hóa & Truyền thông — culture
    { id: "c1-w2d1", week: 2, day: 1, title: "World Cultures", titleVi: "Văn hóa thế giới", skills: [
      { type: "vocab", label: "Từ vựng văn hóa", view: "topics", topicId: "topic_culture" },
      { type: "read", label: "Đọc về phong tục", view: "reading" },
      { type: "grammar", label: "Cleft sentences", view: "grammar" },
    ]},
    { id: "c1-w2d2", week: 2, day: 2, title: "Cinema & Literature", titleVi: "Điện ảnh & Văn học", skills: [
      { type: "listen", label: "Nghe review phim/sách", view: "listening" },
      { type: "speak", label: "Thảo luận tác phẩm", view: "speak" },
      { type: "write", label: "Viết bài phê bình", view: "writing" },
    ]},
    { id: "c1-w2d3", week: 2, day: 3, title: "Media & Journalism", titleVi: "Truyền thông & Báo chí", skills: [
      { type: "vocab", label: "Từ vựng truyền thông", view: "topics", topicId: "topic_culture" },
      { type: "read", label: "Đọc bài xã luận", view: "reading" },
      { type: "speak", label: "Phân tích tin tức", view: "speak" },
    ]},
    { id: "c1-w2d4", week: 2, day: 4, title: "Cross-Cultural Issues", titleVi: "Vấn đề đa văn hóa", skills: [
      { type: "listen", label: "Nghe phỏng vấn chuyên gia", view: "listening" },
      { type: "write", label: "Viết bài nghị luận", view: "writing" },
      { type: "grammar", label: "Subjunctive mood", view: "grammar" },
    ]},
    { id: "c1-w2d5", week: 2, day: 5, title: "Review Week 2", titleVi: "Ôn tập Tuần 2", skills: [
      { type: "vocab", label: "Ôn từ vựng", view: "review" },
      { type: "grammar", label: "Ôn ngữ pháp", view: "grammar" },
      { type: "speak", label: "Debate tự do", view: "speak" },
    ]},
    // Week 3: Học thuật & Vấn đề toàn cầu — academic, global
    { id: "c1-w3d1", week: 3, day: 1, title: "Academic Research", titleVi: "Nghiên cứu học thuật", skills: [
      { type: "vocab", label: "Từ vựng học thuật", view: "topics", topicId: "topic_academic" },
      { type: "read", label: "Đọc bài nghiên cứu", view: "reading" },
      { type: "grammar", label: "Inversion", view: "grammar" },
    ]},
    { id: "c1-w3d2", week: 3, day: 2, title: "Academic Writing", titleVi: "Viết học thuật", skills: [
      { type: "vocab", label: "Từ vựng viết luận", view: "topics", topicId: "topic_academic" },
      { type: "write", label: "Viết tóm tắt nghiên cứu", view: "writing" },
      { type: "grammar", label: "Emphasis & hedging", view: "grammar" },
    ]},
    { id: "c1-w3d3", week: 3, day: 3, title: "Global Issues", titleVi: "Vấn đề toàn cầu", skills: [
      { type: "vocab", label: "Từ vựng toàn cầu", view: "topics", topicId: "topic_global" },
      { type: "read", label: "Đọc bài phân tích", view: "reading" },
      { type: "speak", label: "Tranh luận đạo đức", view: "speak" },
    ]},
    { id: "c1-w3d4", week: 3, day: 4, title: "Ethics & Philosophy", titleVi: "Đạo đức & Triết học", skills: [
      { type: "vocab", label: "Từ vựng đạo đức", view: "topics", topicId: "topic_global" },
      { type: "listen", label: "Nghe bài giảng triết học", view: "listening" },
      { type: "write", label: "Viết bài nghị luận sâu", view: "writing" },
    ]},
    { id: "c1-w3d5", week: 3, day: 5, title: "Review Week 3", titleVi: "Ôn tập Tuần 3", skills: [
      { type: "vocab", label: "Ôn từ vựng", view: "review" },
      { type: "speak", label: "Thuyết trình", view: "speak" },
      { type: "write", label: "Viết bài luận dài", view: "writing" },
    ]},
    // Week 4: Luyện thi IELTS
    { id: "c1-w4d1", week: 4, day: 1, title: "IELTS Writing", titleVi: "Viết IELTS", skills: [
      { type: "write", label: "Task 1 & Task 2", view: "writing" },
      { type: "read", label: "Đọc bài mẫu band 7+", view: "reading" },
      { type: "grammar", label: "Formal academic style", view: "grammar" },
    ]},
    { id: "c1-w4d2", week: 4, day: 2, title: "IELTS Listening", titleVi: "Nghe IELTS", skills: [
      { type: "listen", label: "Nghe bài thi mẫu", view: "listening" },
      { type: "speak", label: "Tóm tắt nội dung", view: "speak" },
      { type: "write", label: "Ghi chú khi nghe", view: "writing" },
    ]},
    { id: "c1-w4d3", week: 4, day: 3, title: "IELTS Speaking", titleVi: "Nói IELTS", skills: [
      { type: "speak", label: "Mock Speaking test", view: "speak" },
      { type: "listen", label: "Nghe bài mẫu band cao", view: "listening" },
      { type: "grammar", label: "Ôn tổng ngữ pháp", view: "grammar" },
    ]},
    { id: "c1-w4d4", week: 4, day: 4, title: "IELTS Reading", titleVi: "Đọc IELTS", skills: [
      { type: "read", label: "Đọc & phân tích bài thi", view: "reading" },
      { type: "write", label: "Viết tóm tắt", view: "writing" },
      { type: "speak", label: "Thảo luận bài đọc", view: "speak" },
    ]},
    { id: "c1-w4d5", week: 4, day: 5, title: "Final Review", titleVi: "Ôn tập tổng kết", skills: [
      { type: "vocab", label: "Ôn toàn bộ từ vựng", view: "review" },
      { type: "grammar", label: "Ôn ngữ pháp", view: "grammar" },
      { type: "speak", label: "Thuyết trình tự do", view: "speak" },
    ]},
  ],
};

// Fallback: kids reuse a1 (cùng bộ topic kids+a1)
const getCurriculum = (level: string): Lesson[] => {
  if (level === "kids") return CURRICULUM.a1;
  return CURRICULUM[level] || CURRICULUM.a1;
};

// ── LocalStorage helpers ──

const STORAGE_KEY = "english-buddy:learning-path-completed";

const getCompleted = (studentId: string): Set<string> => {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}:${studentId}`);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
};

const saveCompleted = (studentId: string, completed: Set<string>) => {
  localStorage.setItem(`${STORAGE_KEY}:${studentId}`, JSON.stringify([...completed]));
};

// ── Component ──

const WEEK_LABELS = ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"];
const WEEK_THEMES: Record<string, string[]> = {
  a1: ["Chào hỏi & Giới thiệu", "Sinh hoạt & Thời gian", "Thực phẩm & Đồ uống", "Trường học & Lớp học"],
  a2: ["Du lịch & Giao thông", "Mua sắm & Tiền bạc", "Sức khỏe & Cơ thể", "Thời tiết & Mùa"],
  b1: ["Công việc & Nghề nghiệp", "Công nghệ & Truyền thông", "Môi trường & Xã hội", "Văn hóa & Du lịch"],
  b2: ["Kinh tế toàn cầu", "Khoa học & Nghiên cứu", "Xã hội & Đạo đức", "Học thuật & Luyện thi"],
};

const getWeekTheme = (level: string, week: number): string => {
  const key = level === "kids" ? "a1" : level === "c1" ? "b2" : level;
  return WEEK_THEMES[key]?.[week - 1] || "";
};

export function LearningPathPage({ student, onNavigate, onBackHome }: LearningPathPageProps) {
  const curriculum = getCurriculum(student.level);
  const [activeWeek, setActiveWeek] = useState(1);
  const [completed, setCompleted] = useState<Set<string>>(() => getCompleted(student.id));

  useEffect(() => { saveCompleted(student.id, completed); }, [student.id, completed]);

  const toggleLesson = (lessonId: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(lessonId)) next.delete(lessonId);
      else next.add(lessonId);
      return next;
    });
  };

  const weekLessons = curriculum.filter((l) => l.week === activeWeek);
  const totalLessons = curriculum.length;
  const completedCount = curriculum.filter((l) => completed.has(l.id)).length;
  const progressPct = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;

  // "Today" lesson: first incomplete in current week, or first incomplete overall
  const todayLesson = weekLessons.find((l) => !completed.has(l.id))
    || curriculum.find((l) => !completed.has(l.id));

  const handleSkillClick = (skill: Skill) => {
    if (skill.view === "review") {
      onNavigate("review");
    } else if (skill.type === "vocab" && skill.topicId) {
      // Bấm "Từ vựng X" → vào thẳng bài học topic đó
      onNavigate("lesson", skill.topicId, student.level);
    } else {
      onNavigate(skill.view, skill.topicId, student.level);
    }
  };

  return (
    <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden h-[100dvh] overflow-y-auto bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:h-[calc(100dvh-2rem)] sm:border sm:border-border/40 px-4 pt-0 pb-6">
      <SessionHeader
        title="Lộ trình học tập"
        icon={<BookOpen className="h-4 w-4" />}
        iconBg="bg-indigo-500"
        onClose={onBackHome}
        progress={progressPct}
      />

      {/* Level & progress summary */}
      <div className="mb-4 text-center">
        <p className="text-xs font-bold text-muted-foreground">
          Cấp độ {student.level.toUpperCase()} &middot; {completedCount}/{totalLessons} bài học
        </p>
      </div>

      {/* Week tabs */}
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
        {[1, 2, 3, 4].map((w) => {
          const weekDone = curriculum.filter((l) => l.week === w && completed.has(l.id)).length;
          const weekTotal = curriculum.filter((l) => l.week === w).length;
          const allDone = weekDone === weekTotal;
          return (
            <button
              key={w}
              type="button"
              onClick={() => setActiveWeek(w)}
              className={cn(
                "flex-1 min-w-[72px] shrink-0 rounded-xl px-3 py-2.5 text-center transition-all active:scale-95",
                activeWeek === w
                  ? "bg-primary text-white shadow-lg"
                  : "bg-card border border-border/60 hover:bg-muted",
              )}
            >
              <p className={cn("text-xs font-black", activeWeek !== w && "text-foreground")}>{WEEK_LABELS[w - 1]}</p>
              <p className={cn("text-[9px] font-bold truncate", activeWeek === w ? "text-white/80" : "text-muted-foreground")}>
                {getWeekTheme(student.level, w)}
              </p>
              {allDone && <Check className="mx-auto mt-0.5 h-3 w-3 text-emerald-400" />}
              {!allDone && weekDone > 0 && (
                <p className={cn("text-[8px] font-bold mt-0.5", activeWeek === w ? "text-white/70" : "text-muted-foreground")}>
                  {weekDone}/{weekTotal}
                </p>
              )}
            </button>
          );
        })}
      </div>

      {/* Daily lesson cards */}
      <div className="space-y-3">
        {weekLessons.map((lesson) => {
          const isDone = completed.has(lesson.id);
          const isToday = todayLesson?.id === lesson.id;

          return (
            <div
              key={lesson.id}
              className={cn(
                "rounded-2xl border px-4 py-4 sm:px-5 sm:py-5 transition-all",
                isToday && !isDone
                  ? "border-primary/50 bg-primary/5 shadow-lg ring-2 ring-primary/20"
                  : isDone
                    ? "border-border/30 bg-muted/50"
                    : "border-border/40 bg-card shadow-sm",
              )}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-3">
                <button
                  type="button"
                  onClick={() => toggleLesson(lesson.id)}
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all active:scale-90",
                    isDone
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-border/60 bg-card hover:border-primary/50",
                  )}
                >
                  {isDone && <Check className="h-4 w-4" />}
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-muted-foreground">Ngày {lesson.day}</span>
                    {isToday && !isDone && (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-[8px] font-black text-white">
                        Bài học hôm nay
                      </span>
                    )}
                  </div>
                  <p className={cn("text-sm font-black", isDone && "line-through text-muted-foreground")}>
                    {lesson.title}
                  </p>
                  <p className="text-[10px] font-bold text-muted-foreground">{lesson.titleVi}</p>
                </div>
              </div>

              {/* Skill buttons */}
              <div className="flex flex-wrap gap-2">
                {lesson.skills.map((skill, i) => {
                  const meta = SKILL_META[skill.type];
                  const Icon = meta.icon;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSkillClick(skill)}
                      className={cn(
                        "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-bold transition-all active:scale-95 hover:shadow-md",
                        isDone
                          ? "bg-muted text-muted-foreground"
                          : "bg-card border border-border/40 text-foreground hover:bg-muted",
                      )}
                    >
                      <span className={cn("flex h-5 w-5 items-center justify-center rounded-md text-white", meta.bg)}>
                        <Icon className="h-3 w-3" />
                      </span>
                      {skill.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
