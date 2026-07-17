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
  a1: [
    // Week 1: Greetings & Introductions
    { id: "a1-w1d1", week: 1, day: 1, title: "Hello & Goodbye", titleVi: "Chào hỏi & Tạm biệt", skills: [
      { type: "vocab", label: "Từ vựng chào hỏi", view: "topics", topicId: "topic_greetings" },
      { type: "speak", label: "Luyện nói lời chào", view: "speak", topicId: "topic_greetings" },
      { type: "listen", label: "Nghe lời chào", view: "listening" },
    ]},
    { id: "a1-w1d2", week: 1, day: 2, title: "Numbers 1-20", titleVi: "Số đếm 1-20", skills: [
      { type: "vocab", label: "Từ vựng số đếm", view: "topics", topicId: "topic_numbers" },
      { type: "write", label: "Viết số", view: "writing" },
      { type: "listen", label: "Nghe & đếm", view: "listening" },
    ]},
    { id: "a1-w1d3", week: 1, day: 3, title: "My Family", titleVi: "Gia đình tôi", skills: [
      { type: "vocab", label: "Từ vựng gia đình", view: "topics", topicId: "topic_family" },
      { type: "read", label: "Đọc 'My Family'", view: "reading" },
      { type: "speak", label: "Nói về gia đình", view: "speak", topicId: "topic_family" },
    ]},
    { id: "a1-w1d4", week: 1, day: 4, title: "Colors & Shapes", titleVi: "Màu sắc & Hình dạng", skills: [
      { type: "vocab", label: "Từ vựng màu sắc", view: "topics", topicId: "topic_colors" },
      { type: "grammar", label: "Cấu trúc 'It is...'", view: "grammar" },
      { type: "write", label: "Mô tả hình ảnh", view: "writing" },
    ]},
    { id: "a1-w1d5", week: 1, day: 5, title: "Review Week 1", titleVi: "Ôn tập Tuần 1", skills: [
      { type: "vocab", label: "Ôn từ vựng", view: "review" },
      { type: "listen", label: "Nghe tổng hợp", view: "listening" },
      { type: "speak", label: "Luyện nói tổng hợp", view: "speak" },
    ]},
    // Week 2: Daily Routine & Time
    { id: "a1-w2d1", week: 2, day: 1, title: "Daily Activities", titleVi: "Hoạt động hàng ngày", skills: [
      { type: "vocab", label: "Từ vựng sinh hoạt", view: "topics", topicId: "topic_daily" },
      { type: "grammar", label: "Thì hiện tại đơn", view: "grammar" },
      { type: "listen", label: "Nghe về lịch trình", view: "listening" },
    ]},
    { id: "a1-w2d2", week: 2, day: 2, title: "Telling Time", titleVi: "Xem giờ", skills: [
      { type: "vocab", label: "Từ vựng thời gian", view: "topics", topicId: "topic_time" },
      { type: "speak", label: "Hỏi & trả lời giờ", view: "speak" },
      { type: "write", label: "Viết lịch trình", view: "writing" },
    ]},
    { id: "a1-w2d3", week: 2, day: 3, title: "Days & Months", titleVi: "Thứ & Tháng", skills: [
      { type: "vocab", label: "Thứ trong tuần", view: "topics", topicId: "topic_calendar" },
      { type: "read", label: "Đọc lịch hẹn", view: "reading" },
      { type: "grammar", label: "Giới từ thời gian", view: "grammar" },
    ]},
    { id: "a1-w2d4", week: 2, day: 4, title: "Morning Routine", titleVi: "Buổi sáng của tôi", skills: [
      { type: "listen", label: "Nghe miêu tả buổi sáng", view: "listening" },
      { type: "speak", label: "Kể về buổi sáng", view: "speak" },
      { type: "write", label: "Viết nhật ký buổi sáng", view: "writing" },
    ]},
    { id: "a1-w2d5", week: 2, day: 5, title: "Review Week 2", titleVi: "Ôn tập Tuần 2", skills: [
      { type: "vocab", label: "Ôn từ vựng", view: "review" },
      { type: "grammar", label: "Ôn ngữ pháp", view: "grammar" },
      { type: "speak", label: "Luyện nói tổng hợp", view: "speak" },
    ]},
    // Week 3: Food & Drinks
    { id: "a1-w3d1", week: 3, day: 1, title: "Fruits & Vegetables", titleVi: "Trái cây & Rau củ", skills: [
      { type: "vocab", label: "Từ vựng trái cây", view: "topics", topicId: "topic_food" },
      { type: "listen", label: "Nghe tên trái cây", view: "listening" },
      { type: "speak", label: "Nói tên thực phẩm", view: "speak", topicId: "topic_food" },
    ]},
    { id: "a1-w3d2", week: 3, day: 2, title: "Drinks & Meals", titleVi: "Đồ uống & Bữa ăn", skills: [
      { type: "vocab", label: "Từ vựng đồ uống", view: "topics", topicId: "topic_food" },
      { type: "grammar", label: "Some / Any", view: "grammar" },
      { type: "read", label: "Đọc thực đơn", view: "reading" },
    ]},
    { id: "a1-w3d3", week: 3, day: 3, title: "At the Restaurant", titleVi: "Ở nhà hàng", skills: [
      { type: "listen", label: "Nghe gọi món", view: "listening" },
      { type: "speak", label: "Đặt món ăn", view: "speak" },
      { type: "write", label: "Viết thực đơn", view: "writing" },
    ]},
    { id: "a1-w3d4", week: 3, day: 4, title: "Cooking", titleVi: "Nấu ăn", skills: [
      { type: "vocab", label: "Từ vựng nấu ăn", view: "topics", topicId: "topic_food" },
      { type: "read", label: "Đọc công thức", view: "reading" },
      { type: "grammar", label: "Động từ mệnh lệnh", view: "grammar" },
    ]},
    { id: "a1-w3d5", week: 3, day: 5, title: "Review Week 3", titleVi: "Ôn tập Tuần 3", skills: [
      { type: "vocab", label: "Ôn từ vựng", view: "review" },
      { type: "listen", label: "Nghe tổng hợp", view: "listening" },
      { type: "write", label: "Viết về bữa ăn yêu thích", view: "writing" },
    ]},
    // Week 4: School & Classroom
    { id: "a1-w4d1", week: 4, day: 1, title: "School Supplies", titleVi: "Đồ dùng học tập", skills: [
      { type: "vocab", label: "Từ vựng trường học", view: "topics", topicId: "topic_school" },
      { type: "listen", label: "Nghe tên đồ vật", view: "listening" },
      { type: "grammar", label: "This / That / These / Those", view: "grammar" },
    ]},
    { id: "a1-w4d2", week: 4, day: 2, title: "Classroom Language", titleVi: "Ngôn ngữ lớp học", skills: [
      { type: "vocab", label: "Câu nói trong lớp", view: "topics", topicId: "topic_school" },
      { type: "speak", label: "Luyện câu nói lớp học", view: "speak" },
      { type: "listen", label: "Nghe hướng dẫn", view: "listening" },
    ]},
    { id: "a1-w4d3", week: 4, day: 3, title: "My School Day", titleVi: "Ngày đi học", skills: [
      { type: "read", label: "Đọc 'My School Day'", view: "reading" },
      { type: "write", label: "Viết về ngày học", view: "writing" },
      { type: "speak", label: "Kể về trường học", view: "speak" },
    ]},
    { id: "a1-w4d4", week: 4, day: 4, title: "Subjects & Teachers", titleVi: "Môn học & Giáo viên", skills: [
      { type: "vocab", label: "Từ vựng môn học", view: "topics", topicId: "topic_school" },
      { type: "grammar", label: "Câu hỏi What/Who", view: "grammar" },
      { type: "read", label: "Đọc thời khóa biểu", view: "reading" },
    ]},
    { id: "a1-w4d5", week: 4, day: 5, title: "Final Review", titleVi: "Ôn tập tổng kết", skills: [
      { type: "vocab", label: "Ôn toàn bộ từ vựng", view: "review" },
      { type: "grammar", label: "Ôn ngữ pháp", view: "grammar" },
      { type: "speak", label: "Nói tự do", view: "speak" },
    ]},
  ],
  a2: [
    // Week 1: Travel & Transport
    { id: "a2-w1d1", week: 1, day: 1, title: "Means of Transport", titleVi: "Phương tiện giao thông", skills: [
      { type: "vocab", label: "Từ vựng giao thông", view: "topics", topicId: "topic_travel" },
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
    // Week 2: Shopping & Money
    { id: "a2-w2d1", week: 2, day: 1, title: "At the Shop", titleVi: "Đi mua sắm", skills: [
      { type: "vocab", label: "Từ vựng mua sắm", view: "topics", topicId: "topic_shopping" },
      { type: "speak", label: "Hỏi giá & mua hàng", view: "speak" },
      { type: "grammar", label: "How much / How many", view: "grammar" },
    ]},
    { id: "a2-w2d2", week: 2, day: 2, title: "Clothes & Fashion", titleVi: "Quần áo & Thời trang", skills: [
      { type: "vocab", label: "Từ vựng quần áo", view: "topics", topicId: "topic_clothes" },
      { type: "listen", label: "Nghe miêu tả trang phục", view: "listening" },
      { type: "read", label: "Đọc quảng cáo", view: "reading" },
    ]},
    { id: "a2-w2d3", week: 2, day: 3, title: "Online Shopping", titleVi: "Mua hàng trực tuyến", skills: [
      { type: "read", label: "Đọc đánh giá sản phẩm", view: "reading" },
      { type: "write", label: "Viết đánh giá", view: "writing" },
      { type: "grammar", label: "So sánh hơn", view: "grammar" },
    ]},
    { id: "a2-w2d4", week: 2, day: 4, title: "Money & Prices", titleVi: "Tiền & Giá cả", skills: [
      { type: "vocab", label: "Từ vựng tiền tệ", view: "topics", topicId: "topic_shopping" },
      { type: "listen", label: "Nghe giá cả", view: "listening" },
      { type: "speak", label: "Mặc cả", view: "speak" },
    ]},
    { id: "a2-w2d5", week: 2, day: 5, title: "Review Week 2", titleVi: "Ôn tập Tuần 2", skills: [
      { type: "vocab", label: "Ôn từ vựng", view: "review" },
      { type: "grammar", label: "Ôn ngữ pháp", view: "grammar" },
      { type: "write", label: "Viết về trải nghiệm mua sắm", view: "writing" },
    ]},
    // Week 3: Health & Body
    { id: "a2-w3d1", week: 3, day: 1, title: "Parts of the Body", titleVi: "Bộ phận cơ thể", skills: [
      { type: "vocab", label: "Từ vựng cơ thể", view: "topics", topicId: "topic_body" },
      { type: "listen", label: "Nghe mô tả cơ thể", view: "listening" },
      { type: "grammar", label: "Have got / Has got", view: "grammar" },
    ]},
    { id: "a2-w3d2", week: 3, day: 2, title: "At the Doctor", titleVi: "Đi khám bệnh", skills: [
      { type: "vocab", label: "Từ vựng sức khỏe", view: "topics", topicId: "topic_health" },
      { type: "speak", label: "Miêu tả triệu chứng", view: "speak" },
      { type: "listen", label: "Nghe lời khuyên bác sĩ", view: "listening" },
    ]},
    { id: "a2-w3d3", week: 3, day: 3, title: "Healthy Habits", titleVi: "Thói quen lành mạnh", skills: [
      { type: "read", label: "Đọc bài về sức khỏe", view: "reading" },
      { type: "write", label: "Viết về thói quen", view: "writing" },
      { type: "grammar", label: "Should / Shouldn't", view: "grammar" },
    ]},
    { id: "a2-w3d4", week: 3, day: 4, title: "Sports & Exercise", titleVi: "Thể thao & Tập luyện", skills: [
      { type: "vocab", label: "Từ vựng thể thao", view: "topics", topicId: "topic_sports" },
      { type: "speak", label: "Nói về thể thao yêu thích", view: "speak" },
      { type: "listen", label: "Nghe bình luận thể thao", view: "listening" },
    ]},
    { id: "a2-w3d5", week: 3, day: 5, title: "Review Week 3", titleVi: "Ôn tập Tuần 3", skills: [
      { type: "vocab", label: "Ôn từ vựng", view: "review" },
      { type: "speak", label: "Luyện nói tổng hợp", view: "speak" },
      { type: "listen", label: "Nghe tổng hợp", view: "listening" },
    ]},
    // Week 4: Weather & Seasons
    { id: "a2-w4d1", week: 4, day: 1, title: "Weather Words", titleVi: "Từ vựng thời tiết", skills: [
      { type: "vocab", label: "Từ vựng thời tiết", view: "topics", topicId: "topic_weather" },
      { type: "listen", label: "Nghe dự báo thời tiết", view: "listening" },
      { type: "grammar", label: "Thì tương lai đơn", view: "grammar" },
    ]},
    { id: "a2-w4d2", week: 4, day: 2, title: "Four Seasons", titleVi: "Bốn mùa", skills: [
      { type: "read", label: "Đọc về các mùa", view: "reading" },
      { type: "speak", label: "Nói về mùa yêu thích", view: "speak" },
      { type: "write", label: "Viết về mùa", view: "writing" },
    ]},
    { id: "a2-w4d3", week: 4, day: 3, title: "Holiday Plans", titleVi: "Kế hoạch nghỉ lễ", skills: [
      { type: "vocab", label: "Từ vựng nghỉ lễ", view: "topics", topicId: "topic_travel" },
      { type: "grammar", label: "Going to + V", view: "grammar" },
      { type: "speak", label: "Nói về kế hoạch", view: "speak" },
    ]},
    { id: "a2-w4d4", week: 4, day: 4, title: "Nature & Environment", titleVi: "Thiên nhiên & Môi trường", skills: [
      { type: "read", label: "Đọc về môi trường", view: "reading" },
      { type: "listen", label: "Nghe phóng sự", view: "listening" },
      { type: "write", label: "Viết về thiên nhiên", view: "writing" },
    ]},
    { id: "a2-w4d5", week: 4, day: 5, title: "Final Review", titleVi: "Ôn tập tổng kết", skills: [
      { type: "vocab", label: "Ôn toàn bộ từ vựng", view: "review" },
      { type: "grammar", label: "Ôn ngữ pháp", view: "grammar" },
      { type: "speak", label: "Nói tự do", view: "speak" },
    ]},
  ],
  b1: [
    // Week 1: Work & Career
    { id: "b1-w1d1", week: 1, day: 1, title: "Jobs & Professions", titleVi: "Nghề nghiệp", skills: [
      { type: "vocab", label: "Từ vựng nghề nghiệp", view: "topics", topicId: "topic_jobs" },
      { type: "listen", label: "Nghe phỏng vấn xin việc", view: "listening" },
      { type: "grammar", label: "Present Perfect", view: "grammar" },
    ]},
    { id: "b1-w1d2", week: 1, day: 2, title: "Job Interview", titleVi: "Phỏng vấn xin việc", skills: [
      { type: "speak", label: "Luyện phỏng vấn", view: "speak" },
      { type: "read", label: "Đọc CV mẫu", view: "reading" },
      { type: "write", label: "Viết thư xin việc", view: "writing" },
    ]},
    { id: "b1-w1d3", week: 1, day: 3, title: "Office Life", titleVi: "Cuộc sống văn phòng", skills: [
      { type: "vocab", label: "Từ vựng văn phòng", view: "topics", topicId: "topic_jobs" },
      { type: "listen", label: "Nghe hội thoại văn phòng", view: "listening" },
      { type: "speak", label: "Trình bày ý kiến", view: "speak" },
    ]},
    { id: "b1-w1d4", week: 1, day: 4, title: "Work-Life Balance", titleVi: "Cân bằng công việc", skills: [
      { type: "read", label: "Đọc bài về work-life balance", view: "reading" },
      { type: "write", label: "Viết về công việc mơ ước", view: "writing" },
      { type: "grammar", label: "Used to + V", view: "grammar" },
    ]},
    { id: "b1-w1d5", week: 1, day: 5, title: "Review Week 1", titleVi: "Ôn tập Tuần 1", skills: [
      { type: "vocab", label: "Ôn từ vựng", view: "review" },
      { type: "listen", label: "Nghe tổng hợp", view: "listening" },
      { type: "speak", label: "Thảo luận nhóm", view: "speak" },
    ]},
    // Week 2: Technology & Media
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
      { type: "vocab", label: "Từ vựng báo chí", view: "topics", topicId: "topic_technology" },
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
    // Week 3: Environment & Society
    { id: "b1-w3d1", week: 3, day: 1, title: "Environment Issues", titleVi: "Vấn đề môi trường", skills: [
      { type: "vocab", label: "Từ vựng môi trường", view: "topics", topicId: "topic_environment" },
      { type: "read", label: "Đọc bài về ô nhiễm", view: "reading" },
      { type: "grammar", label: "Conditionals Type 1 & 2", view: "grammar" },
    ]},
    { id: "b1-w3d2", week: 3, day: 2, title: "Recycling & Green Living", titleVi: "Tái chế & Sống xanh", skills: [
      { type: "listen", label: "Nghe phóng sự môi trường", view: "listening" },
      { type: "speak", label: "Thảo luận giải pháp", view: "speak" },
      { type: "write", label: "Viết bài về bảo vệ MT", view: "writing" },
    ]},
    { id: "b1-w3d3", week: 3, day: 3, title: "Community & Volunteering", titleVi: "Cộng đồng & Tình nguyện", skills: [
      { type: "vocab", label: "Từ vựng xã hội", view: "topics", topicId: "topic_environment" },
      { type: "read", label: "Đọc về hoạt động tình nguyện", view: "reading" },
      { type: "speak", label: "Kể về trải nghiệm", view: "speak" },
    ]},
    { id: "b1-w3d4", week: 3, day: 4, title: "Current Events", titleVi: "Sự kiện thời sự", skills: [
      { type: "listen", label: "Nghe thời sự", view: "listening" },
      { type: "write", label: "Viết bài bình luận", view: "writing" },
      { type: "grammar", label: "Reported Speech", view: "grammar" },
    ]},
    { id: "b1-w3d5", week: 3, day: 5, title: "Review Week 3", titleVi: "Ôn tập Tuần 3", skills: [
      { type: "vocab", label: "Ôn từ vựng", view: "review" },
      { type: "listen", label: "Nghe tổng hợp", view: "listening" },
      { type: "write", label: "Viết bài luận ngắn", view: "writing" },
    ]},
    // Week 4: Culture & Travel
    { id: "b1-w4d1", week: 4, day: 1, title: "World Cultures", titleVi: "Văn hóa thế giới", skills: [
      { type: "vocab", label: "Từ vựng văn hóa", view: "topics", topicId: "topic_culture" },
      { type: "read", label: "Đọc về phong tục", view: "reading" },
      { type: "listen", label: "Nghe giới thiệu đất nước", view: "listening" },
    ]},
    { id: "b1-w4d2", week: 4, day: 2, title: "Travel Stories", titleVi: "Câu chuyện du lịch", skills: [
      { type: "read", label: "Đọc nhật ký du lịch", view: "reading" },
      { type: "speak", label: "Kể về chuyến đi", view: "speak" },
      { type: "grammar", label: "Past Perfect", view: "grammar" },
    ]},
    { id: "b1-w4d3", week: 4, day: 3, title: "Food Around the World", titleVi: "Ẩm thực thế giới", skills: [
      { type: "listen", label: "Nghe về ẩm thực", view: "listening" },
      { type: "speak", label: "Giới thiệu món ăn VN", view: "speak" },
      { type: "write", label: "Viết về món ăn", view: "writing" },
    ]},
    { id: "b1-w4d4", week: 4, day: 4, title: "Festivals & Celebrations", titleVi: "Lễ hội", skills: [
      { type: "vocab", label: "Từ vựng lễ hội", view: "topics", topicId: "topic_culture" },
      { type: "read", label: "Đọc về lễ hội", view: "reading" },
      { type: "write", label: "Viết về lễ hội yêu thích", view: "writing" },
    ]},
    { id: "b1-w4d5", week: 4, day: 5, title: "Final Review", titleVi: "Ôn tập tổng kết", skills: [
      { type: "vocab", label: "Ôn toàn bộ từ vựng", view: "review" },
      { type: "grammar", label: "Ôn ngữ pháp", view: "grammar" },
      { type: "speak", label: "Thuyết trình tự do", view: "speak" },
    ]},
  ],
  b2: [
    // Week 1: Globalisation & Economy
    { id: "b2-w1d1", week: 1, day: 1, title: "Global Economy", titleVi: "Kinh tế toàn cầu", skills: [
      { type: "vocab", label: "Từ vựng kinh tế", view: "topics", topicId: "topic_business" },
      { type: "read", label: "Đọc bài phân tích kinh tế", view: "reading" },
      { type: "grammar", label: "Mixed Conditionals", view: "grammar" },
    ]},
    { id: "b2-w1d2", week: 1, day: 2, title: "International Trade", titleVi: "Thương mại quốc tế", skills: [
      { type: "listen", label: "Nghe bài giảng kinh tế", view: "listening" },
      { type: "speak", label: "Tranh luận về toàn cầu hóa", view: "speak" },
      { type: "write", label: "Viết bài nghị luận", view: "writing" },
    ]},
    { id: "b2-w1d3", week: 1, day: 3, title: "Startups & Innovation", titleVi: "Khởi nghiệp & Sáng tạo", skills: [
      { type: "vocab", label: "Từ vựng khởi nghiệp", view: "topics", topicId: "topic_business" },
      { type: "read", label: "Đọc case study", view: "reading" },
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
    // Week 2: Science & Research
    { id: "b2-w2d1", week: 2, day: 1, title: "Scientific Discovery", titleVi: "Phát minh khoa học", skills: [
      { type: "vocab", label: "Từ vựng khoa học", view: "topics", topicId: "topic_science" },
      { type: "read", label: "Đọc bài khoa học", view: "reading" },
      { type: "grammar", label: "Cleft sentences", view: "grammar" },
    ]},
    { id: "b2-w2d2", week: 2, day: 2, title: "Medical Advances", titleVi: "Tiến bộ y học", skills: [
      { type: "listen", label: "Nghe podcast y học", view: "listening" },
      { type: "speak", label: "Thảo luận y tế", view: "speak" },
      { type: "write", label: "Viết tóm tắt nghiên cứu", view: "writing" },
    ]},
    { id: "b2-w2d3", week: 2, day: 3, title: "AI & Future Tech", titleVi: "AI & Công nghệ tương lai", skills: [
      { type: "read", label: "Đọc về trí tuệ nhân tạo", view: "reading" },
      { type: "vocab", label: "Từ vựng AI", view: "topics", topicId: "topic_science" },
      { type: "speak", label: "Tranh luận về AI", view: "speak" },
    ]},
    { id: "b2-w2d4", week: 2, day: 4, title: "Space Exploration", titleVi: "Khám phá vũ trụ", skills: [
      { type: "listen", label: "Nghe phóng sự vũ trụ", view: "listening" },
      { type: "write", label: "Viết bài về tương lai", view: "writing" },
      { type: "grammar", label: "Participle clauses", view: "grammar" },
    ]},
    { id: "b2-w2d5", week: 2, day: 5, title: "Review Week 2", titleVi: "Ôn tập Tuần 2", skills: [
      { type: "vocab", label: "Ôn từ vựng", view: "review" },
      { type: "grammar", label: "Ôn ngữ pháp", view: "grammar" },
      { type: "listen", label: "Nghe TED Talk", view: "listening" },
    ]},
    // Week 3: Society & Ethics
    { id: "b2-w3d1", week: 3, day: 1, title: "Social Issues", titleVi: "Vấn đề xã hội", skills: [
      { type: "vocab", label: "Từ vựng xã hội", view: "topics", topicId: "topic_society" },
      { type: "read", label: "Đọc bài xã luận", view: "reading" },
      { type: "grammar", label: "Subjunctive mood", view: "grammar" },
    ]},
    { id: "b2-w3d2", week: 3, day: 2, title: "Education Debate", titleVi: "Tranh luận giáo dục", skills: [
      { type: "listen", label: "Nghe tranh luận", view: "listening" },
      { type: "speak", label: "Phản biện ý kiến", view: "speak" },
      { type: "write", label: "Viết bài nghị luận 2 mặt", view: "writing" },
    ]},
    { id: "b2-w3d3", week: 3, day: 3, title: "Human Rights", titleVi: "Nhân quyền", skills: [
      { type: "read", label: "Đọc bài về nhân quyền", view: "reading" },
      { type: "vocab", label: "Từ vựng pháp lý", view: "topics", topicId: "topic_society" },
      { type: "speak", label: "Trình bày quan điểm", view: "speak" },
    ]},
    { id: "b2-w3d4", week: 3, day: 4, title: "Media & Ethics", titleVi: "Truyền thông & Đạo đức", skills: [
      { type: "listen", label: "Nghe phỏng vấn", view: "listening" },
      { type: "write", label: "Viết bài phân tích", view: "writing" },
      { type: "grammar", label: "Emphasis & hedging", view: "grammar" },
    ]},
    { id: "b2-w3d5", week: 3, day: 5, title: "Review Week 3", titleVi: "Ôn tập Tuần 3", skills: [
      { type: "vocab", label: "Ôn từ vựng", view: "review" },
      { type: "speak", label: "Debate tự do", view: "speak" },
      { type: "write", label: "Viết bài luận hoàn chỉnh", view: "writing" },
    ]},
    // Week 4: Academic & Exam Prep
    { id: "b2-w4d1", week: 4, day: 1, title: "Academic Writing", titleVi: "Viết học thuật", skills: [
      { type: "write", label: "Viết bài essay", view: "writing" },
      { type: "grammar", label: "Formal linking words", view: "grammar" },
      { type: "read", label: "Đọc bài mẫu IELTS", view: "reading" },
    ]},
    { id: "b2-w4d2", week: 4, day: 2, title: "Listening Exam", titleVi: "Luyện nghe thi", skills: [
      { type: "listen", label: "Nghe bài thi mẫu", view: "listening" },
      { type: "vocab", label: "Từ vựng học thuật", view: "topics", topicId: "topic_academic" },
      { type: "speak", label: "Tóm tắt nội dung nghe", view: "speak" },
    ]},
    { id: "b2-w4d3", week: 4, day: 3, title: "Speaking Exam", titleVi: "Luyện nói thi", skills: [
      { type: "speak", label: "Mock Speaking test", view: "speak" },
      { type: "listen", label: "Nghe bài mẫu speaking", view: "listening" },
      { type: "grammar", label: "Ôn tổng ngữ pháp", view: "grammar" },
    ]},
    { id: "b2-w4d4", week: 4, day: 4, title: "Reading Comprehension", titleVi: "Đọc hiểu nâng cao", skills: [
      { type: "read", label: "Đọc bài thi mẫu", view: "reading" },
      { type: "write", label: "Viết tóm tắt bài đọc", view: "writing" },
      { type: "vocab", label: "Từ vựng nâng cao", view: "topics", topicId: "topic_academic" },
    ]},
    { id: "b2-w4d5", week: 4, day: 5, title: "Final Review", titleVi: "Ôn tập tổng kết", skills: [
      { type: "vocab", label: "Ôn toàn bộ từ vựng", view: "review" },
      { type: "grammar", label: "Ôn ngữ pháp", view: "grammar" },
      { type: "speak", label: "Thuyết trình tự do", view: "speak" },
    ]},
  ],
};

// Fallback: kids/c1 reuse a1/b2
const getCurriculum = (level: string): Lesson[] => {
  if (level === "kids") return CURRICULUM.a1;
  if (level === "c1") return CURRICULUM.b2;
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
