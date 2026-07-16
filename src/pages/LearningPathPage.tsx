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
    { id: "a1-w1d1", week: 1, day: 1, title: "Hello & Goodbye", titleVi: "Chao hoi & Tam biet", skills: [
      { type: "vocab", label: "Tu vung chao hoi", view: "topics", topicId: "topic_greetings" },
      { type: "speak", label: "Luyen noi loi chao", view: "speak", topicId: "topic_greetings" },
      { type: "listen", label: "Nghe loi chao", view: "listening" },
    ]},
    { id: "a1-w1d2", week: 1, day: 2, title: "Numbers 1-20", titleVi: "So dem 1-20", skills: [
      { type: "vocab", label: "Tu vung so dem", view: "topics", topicId: "topic_numbers" },
      { type: "write", label: "Viet so", view: "writing" },
      { type: "listen", label: "Nghe & dem", view: "listening" },
    ]},
    { id: "a1-w1d3", week: 1, day: 3, title: "My Family", titleVi: "Gia dinh toi", skills: [
      { type: "vocab", label: "Tu vung gia dinh", view: "topics", topicId: "topic_family" },
      { type: "read", label: "Doc 'My Family'", view: "reading" },
      { type: "speak", label: "Noi ve gia dinh", view: "speak", topicId: "topic_family" },
    ]},
    { id: "a1-w1d4", week: 1, day: 4, title: "Colors & Shapes", titleVi: "Mau sac & Hinh dang", skills: [
      { type: "vocab", label: "Tu vung mau sac", view: "topics", topicId: "topic_colors" },
      { type: "grammar", label: "Cau truc 'It is...'", view: "grammar" },
      { type: "write", label: "Mo ta hinh anh", view: "writing" },
    ]},
    { id: "a1-w1d5", week: 1, day: 5, title: "Review Week 1", titleVi: "On tap Tuan 1", skills: [
      { type: "vocab", label: "On tu vung", view: "review" },
      { type: "listen", label: "Nghe tong hop", view: "listening" },
      { type: "speak", label: "Luyen noi tong hop", view: "speak" },
    ]},
    // Week 2: Daily Routine & Time
    { id: "a1-w2d1", week: 2, day: 1, title: "Daily Activities", titleVi: "Hoat dong hang ngay", skills: [
      { type: "vocab", label: "Tu vung sinh hoat", view: "topics", topicId: "topic_daily" },
      { type: "grammar", label: "Thi hien tai don", view: "grammar" },
      { type: "listen", label: "Nghe ve lich trinh", view: "listening" },
    ]},
    { id: "a1-w2d2", week: 2, day: 2, title: "Telling Time", titleVi: "Xem gio", skills: [
      { type: "vocab", label: "Tu vung thoi gian", view: "topics", topicId: "topic_time" },
      { type: "speak", label: "Hoi & tra loi gio", view: "speak" },
      { type: "write", label: "Viet lich trinh", view: "writing" },
    ]},
    { id: "a1-w2d3", week: 2, day: 3, title: "Days & Months", titleVi: "Thu & Thang", skills: [
      { type: "vocab", label: "Thu trong tuan", view: "topics", topicId: "topic_calendar" },
      { type: "read", label: "Doc lich hen", view: "reading" },
      { type: "grammar", label: "Gioi tu thoi gian", view: "grammar" },
    ]},
    { id: "a1-w2d4", week: 2, day: 4, title: "Morning Routine", titleVi: "Buoi sang cua toi", skills: [
      { type: "listen", label: "Nghe mieu ta buoi sang", view: "listening" },
      { type: "speak", label: "Ke ve buoi sang", view: "speak" },
      { type: "write", label: "Viet nhat ky buoi sang", view: "writing" },
    ]},
    { id: "a1-w2d5", week: 2, day: 5, title: "Review Week 2", titleVi: "On tap Tuan 2", skills: [
      { type: "vocab", label: "On tu vung", view: "review" },
      { type: "grammar", label: "On ngu phap", view: "grammar" },
      { type: "speak", label: "Luyen noi tong hop", view: "speak" },
    ]},
    // Week 3: Food & Drinks
    { id: "a1-w3d1", week: 3, day: 1, title: "Fruits & Vegetables", titleVi: "Trai cay & Rau cu", skills: [
      { type: "vocab", label: "Tu vung trai cay", view: "topics", topicId: "topic_food" },
      { type: "listen", label: "Nghe ten trai cay", view: "listening" },
      { type: "speak", label: "Noi ten thuc pham", view: "speak", topicId: "topic_food" },
    ]},
    { id: "a1-w3d2", week: 3, day: 2, title: "Drinks & Meals", titleVi: "Do uong & Bua an", skills: [
      { type: "vocab", label: "Tu vung do uong", view: "topics", topicId: "topic_food" },
      { type: "grammar", label: "Some / Any", view: "grammar" },
      { type: "read", label: "Doc thuc don", view: "reading" },
    ]},
    { id: "a1-w3d3", week: 3, day: 3, title: "At the Restaurant", titleVi: "O nha hang", skills: [
      { type: "listen", label: "Nghe goi mon", view: "listening" },
      { type: "speak", label: "Dat mon an", view: "speak" },
      { type: "write", label: "Viet thuc don", view: "writing" },
    ]},
    { id: "a1-w3d4", week: 3, day: 4, title: "Cooking", titleVi: "Nau an", skills: [
      { type: "vocab", label: "Tu vung nau an", view: "topics", topicId: "topic_food" },
      { type: "read", label: "Doc cong thuc", view: "reading" },
      { type: "grammar", label: "Dong tu menh lenh", view: "grammar" },
    ]},
    { id: "a1-w3d5", week: 3, day: 5, title: "Review Week 3", titleVi: "On tap Tuan 3", skills: [
      { type: "vocab", label: "On tu vung", view: "review" },
      { type: "listen", label: "Nghe tong hop", view: "listening" },
      { type: "write", label: "Viet ve bua an yeu thich", view: "writing" },
    ]},
    // Week 4: School & Classroom
    { id: "a1-w4d1", week: 4, day: 1, title: "School Supplies", titleVi: "Do dung hoc tap", skills: [
      { type: "vocab", label: "Tu vung truong hoc", view: "topics", topicId: "topic_school" },
      { type: "listen", label: "Nghe ten do vat", view: "listening" },
      { type: "grammar", label: "This / That / These / Those", view: "grammar" },
    ]},
    { id: "a1-w4d2", week: 4, day: 2, title: "Classroom Language", titleVi: "Ngon ngu lop hoc", skills: [
      { type: "vocab", label: "Cau noi trong lop", view: "topics", topicId: "topic_school" },
      { type: "speak", label: "Luyen cau noi lop hoc", view: "speak" },
      { type: "listen", label: "Nghe huong dan", view: "listening" },
    ]},
    { id: "a1-w4d3", week: 4, day: 3, title: "My School Day", titleVi: "Ngay di hoc", skills: [
      { type: "read", label: "Doc 'My School Day'", view: "reading" },
      { type: "write", label: "Viet ve ngay hoc", view: "writing" },
      { type: "speak", label: "Ke ve truong hoc", view: "speak" },
    ]},
    { id: "a1-w4d4", week: 4, day: 4, title: "Subjects & Teachers", titleVi: "Mon hoc & Giao vien", skills: [
      { type: "vocab", label: "Tu vung mon hoc", view: "topics", topicId: "topic_school" },
      { type: "grammar", label: "Cau hoi What/Who", view: "grammar" },
      { type: "read", label: "Doc thoi khoa bieu", view: "reading" },
    ]},
    { id: "a1-w4d5", week: 4, day: 5, title: "Final Review", titleVi: "On tap tong ket", skills: [
      { type: "vocab", label: "On toan bo tu vung", view: "review" },
      { type: "grammar", label: "On ngu phap", view: "grammar" },
      { type: "speak", label: "Noi tu do", view: "speak" },
    ]},
  ],
  a2: [
    // Week 1: Travel & Transport
    { id: "a2-w1d1", week: 1, day: 1, title: "Means of Transport", titleVi: "Phuong tien giao thong", skills: [
      { type: "vocab", label: "Tu vung giao thong", view: "topics", topicId: "topic_travel" },
      { type: "listen", label: "Nghe huong dan di lai", view: "listening" },
      { type: "grammar", label: "Can / Could", view: "grammar" },
    ]},
    { id: "a2-w1d2", week: 1, day: 2, title: "Asking for Directions", titleVi: "Hoi duong", skills: [
      { type: "speak", label: "Luyen hoi duong", view: "speak" },
      { type: "listen", label: "Nghe chi duong", view: "listening" },
      { type: "write", label: "Viet chi dan", view: "writing" },
    ]},
    { id: "a2-w1d3", week: 1, day: 3, title: "At the Airport", titleVi: "O san bay", skills: [
      { type: "vocab", label: "Tu vung san bay", view: "topics", topicId: "topic_travel" },
      { type: "read", label: "Doc bang thong bao", view: "reading" },
      { type: "speak", label: "Lam thu tuc bay", view: "speak" },
    ]},
    { id: "a2-w1d4", week: 1, day: 4, title: "Booking a Hotel", titleVi: "Dat phong khach san", skills: [
      { type: "listen", label: "Nghe dat phong", view: "listening" },
      { type: "write", label: "Viet email dat phong", view: "writing" },
      { type: "grammar", label: "Would like to...", view: "grammar" },
    ]},
    { id: "a2-w1d5", week: 1, day: 5, title: "Review Week 1", titleVi: "On tap Tuan 1", skills: [
      { type: "vocab", label: "On tu vung", view: "review" },
      { type: "listen", label: "Nghe tong hop", view: "listening" },
      { type: "speak", label: "Hoi thoai du lich", view: "speak" },
    ]},
    // Week 2: Shopping & Money
    { id: "a2-w2d1", week: 2, day: 1, title: "At the Shop", titleVi: "Di mua sam", skills: [
      { type: "vocab", label: "Tu vung mua sam", view: "topics", topicId: "topic_shopping" },
      { type: "speak", label: "Hoi gia & mua hang", view: "speak" },
      { type: "grammar", label: "How much / How many", view: "grammar" },
    ]},
    { id: "a2-w2d2", week: 2, day: 2, title: "Clothes & Fashion", titleVi: "Quan ao & Thoi trang", skills: [
      { type: "vocab", label: "Tu vung quan ao", view: "topics", topicId: "topic_clothes" },
      { type: "listen", label: "Nghe mieu ta trang phuc", view: "listening" },
      { type: "read", label: "Doc quang cao", view: "reading" },
    ]},
    { id: "a2-w2d3", week: 2, day: 3, title: "Online Shopping", titleVi: "Mua hang truc tuyen", skills: [
      { type: "read", label: "Doc danh gia san pham", view: "reading" },
      { type: "write", label: "Viet danh gia", view: "writing" },
      { type: "grammar", label: "So sanh hon", view: "grammar" },
    ]},
    { id: "a2-w2d4", week: 2, day: 4, title: "Money & Prices", titleVi: "Tien & Gia ca", skills: [
      { type: "vocab", label: "Tu vung tien te", view: "topics", topicId: "topic_shopping" },
      { type: "listen", label: "Nghe gia ca", view: "listening" },
      { type: "speak", label: "Mac ca", view: "speak" },
    ]},
    { id: "a2-w2d5", week: 2, day: 5, title: "Review Week 2", titleVi: "On tap Tuan 2", skills: [
      { type: "vocab", label: "On tu vung", view: "review" },
      { type: "grammar", label: "On ngu phap", view: "grammar" },
      { type: "write", label: "Viet ve trai nghiem mua sam", view: "writing" },
    ]},
    // Week 3: Health & Body
    { id: "a2-w3d1", week: 3, day: 1, title: "Parts of the Body", titleVi: "Bo phan co the", skills: [
      { type: "vocab", label: "Tu vung co the", view: "topics", topicId: "topic_body" },
      { type: "listen", label: "Nghe mo ta co the", view: "listening" },
      { type: "grammar", label: "Have got / Has got", view: "grammar" },
    ]},
    { id: "a2-w3d2", week: 3, day: 2, title: "At the Doctor", titleVi: "Di kham benh", skills: [
      { type: "vocab", label: "Tu vung suc khoe", view: "topics", topicId: "topic_health" },
      { type: "speak", label: "Mieu ta trieu chung", view: "speak" },
      { type: "listen", label: "Nghe loi khuyen bac si", view: "listening" },
    ]},
    { id: "a2-w3d3", week: 3, day: 3, title: "Healthy Habits", titleVi: "Thoi quen lanh manh", skills: [
      { type: "read", label: "Doc bai ve suc khoe", view: "reading" },
      { type: "write", label: "Viet ve thoi quen", view: "writing" },
      { type: "grammar", label: "Should / Shouldn't", view: "grammar" },
    ]},
    { id: "a2-w3d4", week: 3, day: 4, title: "Sports & Exercise", titleVi: "The thao & Tap luyen", skills: [
      { type: "vocab", label: "Tu vung the thao", view: "topics", topicId: "topic_sports" },
      { type: "speak", label: "Noi ve the thao yeu thich", view: "speak" },
      { type: "listen", label: "Nghe binh luan the thao", view: "listening" },
    ]},
    { id: "a2-w3d5", week: 3, day: 5, title: "Review Week 3", titleVi: "On tap Tuan 3", skills: [
      { type: "vocab", label: "On tu vung", view: "review" },
      { type: "speak", label: "Luyen noi tong hop", view: "speak" },
      { type: "listen", label: "Nghe tong hop", view: "listening" },
    ]},
    // Week 4: Weather & Seasons
    { id: "a2-w4d1", week: 4, day: 1, title: "Weather Words", titleVi: "Tu vung thoi tiet", skills: [
      { type: "vocab", label: "Tu vung thoi tiet", view: "topics", topicId: "topic_weather" },
      { type: "listen", label: "Nghe du bao thoi tiet", view: "listening" },
      { type: "grammar", label: "Thi tuong lai don", view: "grammar" },
    ]},
    { id: "a2-w4d2", week: 4, day: 2, title: "Four Seasons", titleVi: "Bon mua", skills: [
      { type: "read", label: "Doc ve cac mua", view: "reading" },
      { type: "speak", label: "Noi ve mua yeu thich", view: "speak" },
      { type: "write", label: "Viet ve mua", view: "writing" },
    ]},
    { id: "a2-w4d3", week: 4, day: 3, title: "Holiday Plans", titleVi: "Ke hoach nghi le", skills: [
      { type: "vocab", label: "Tu vung nghi le", view: "topics", topicId: "topic_travel" },
      { type: "grammar", label: "Going to + V", view: "grammar" },
      { type: "speak", label: "Noi ve ke hoach", view: "speak" },
    ]},
    { id: "a2-w4d4", week: 4, day: 4, title: "Nature & Environment", titleVi: "Thien nhien & Moi truong", skills: [
      { type: "read", label: "Doc ve moi truong", view: "reading" },
      { type: "listen", label: "Nghe phong su", view: "listening" },
      { type: "write", label: "Viet ve thien nhien", view: "writing" },
    ]},
    { id: "a2-w4d5", week: 4, day: 5, title: "Final Review", titleVi: "On tap tong ket", skills: [
      { type: "vocab", label: "On toan bo tu vung", view: "review" },
      { type: "grammar", label: "On ngu phap", view: "grammar" },
      { type: "speak", label: "Noi tu do", view: "speak" },
    ]},
  ],
  b1: [
    // Week 1: Work & Career
    { id: "b1-w1d1", week: 1, day: 1, title: "Jobs & Professions", titleVi: "Nghe nghiep", skills: [
      { type: "vocab", label: "Tu vung nghe nghiep", view: "topics", topicId: "topic_jobs" },
      { type: "listen", label: "Nghe phong van xin viec", view: "listening" },
      { type: "grammar", label: "Present Perfect", view: "grammar" },
    ]},
    { id: "b1-w1d2", week: 1, day: 2, title: "Job Interview", titleVi: "Phong van xin viec", skills: [
      { type: "speak", label: "Luyen phong van", view: "speak" },
      { type: "read", label: "Doc CV mau", view: "reading" },
      { type: "write", label: "Viet thu xin viec", view: "writing" },
    ]},
    { id: "b1-w1d3", week: 1, day: 3, title: "Office Life", titleVi: "Cuoc song van phong", skills: [
      { type: "vocab", label: "Tu vung van phong", view: "topics", topicId: "topic_jobs" },
      { type: "listen", label: "Nghe hoi thoai van phong", view: "listening" },
      { type: "speak", label: "Trinh bay y kien", view: "speak" },
    ]},
    { id: "b1-w1d4", week: 1, day: 4, title: "Work-Life Balance", titleVi: "Can bang cong viec", skills: [
      { type: "read", label: "Doc bai ve work-life balance", view: "reading" },
      { type: "write", label: "Viet ve cong viec mo uoc", view: "writing" },
      { type: "grammar", label: "Used to + V", view: "grammar" },
    ]},
    { id: "b1-w1d5", week: 1, day: 5, title: "Review Week 1", titleVi: "On tap Tuan 1", skills: [
      { type: "vocab", label: "On tu vung", view: "review" },
      { type: "listen", label: "Nghe tong hop", view: "listening" },
      { type: "speak", label: "Thao luan nhom", view: "speak" },
    ]},
    // Week 2: Technology & Media
    { id: "b1-w2d1", week: 2, day: 1, title: "Tech & Gadgets", titleVi: "Cong nghe & Thiet bi", skills: [
      { type: "vocab", label: "Tu vung cong nghe", view: "topics", topicId: "topic_technology" },
      { type: "listen", label: "Nghe review san pham", view: "listening" },
      { type: "grammar", label: "Passive Voice", view: "grammar" },
    ]},
    { id: "b1-w2d2", week: 2, day: 2, title: "Social Media", titleVi: "Mang xa hoi", skills: [
      { type: "read", label: "Doc bai ve mang xa hoi", view: "reading" },
      { type: "speak", label: "Tranh luan ve MXH", view: "speak" },
      { type: "write", label: "Viet y kien ve MXH", view: "writing" },
    ]},
    { id: "b1-w2d3", week: 2, day: 3, title: "News & Articles", titleVi: "Tin tuc & Bao chi", skills: [
      { type: "read", label: "Doc tin tuc", view: "reading" },
      { type: "vocab", label: "Tu vung bao chi", view: "topics", topicId: "topic_technology" },
      { type: "listen", label: "Nghe ban tin", view: "listening" },
    ]},
    { id: "b1-w2d4", week: 2, day: 4, title: "Movies & Entertainment", titleVi: "Phim & Giai tri", skills: [
      { type: "speak", label: "Review phim", view: "speak" },
      { type: "write", label: "Viet review phim", view: "writing" },
      { type: "grammar", label: "Relative Clauses", view: "grammar" },
    ]},
    { id: "b1-w2d5", week: 2, day: 5, title: "Review Week 2", titleVi: "On tap Tuan 2", skills: [
      { type: "vocab", label: "On tu vung", view: "review" },
      { type: "grammar", label: "On ngu phap", view: "grammar" },
      { type: "speak", label: "Thuyet trinh ngan", view: "speak" },
    ]},
    // Week 3: Environment & Society
    { id: "b1-w3d1", week: 3, day: 1, title: "Environment Issues", titleVi: "Van de moi truong", skills: [
      { type: "vocab", label: "Tu vung moi truong", view: "topics", topicId: "topic_environment" },
      { type: "read", label: "Doc bai ve o nhiem", view: "reading" },
      { type: "grammar", label: "Conditionals Type 1 & 2", view: "grammar" },
    ]},
    { id: "b1-w3d2", week: 3, day: 2, title: "Recycling & Green Living", titleVi: "Tai che & Song xanh", skills: [
      { type: "listen", label: "Nghe phong su moi truong", view: "listening" },
      { type: "speak", label: "Thao luan giai phap", view: "speak" },
      { type: "write", label: "Viet bai ve bao ve MT", view: "writing" },
    ]},
    { id: "b1-w3d3", week: 3, day: 3, title: "Community & Volunteering", titleVi: "Cong dong & Tinh nguyen", skills: [
      { type: "vocab", label: "Tu vung xa hoi", view: "topics", topicId: "topic_environment" },
      { type: "read", label: "Doc ve hoat dong tinh nguyen", view: "reading" },
      { type: "speak", label: "Ke ve trai nghiem", view: "speak" },
    ]},
    { id: "b1-w3d4", week: 3, day: 4, title: "Current Events", titleVi: "Su kien thoi su", skills: [
      { type: "listen", label: "Nghe thoi su", view: "listening" },
      { type: "write", label: "Viet bai binh luan", view: "writing" },
      { type: "grammar", label: "Reported Speech", view: "grammar" },
    ]},
    { id: "b1-w3d5", week: 3, day: 5, title: "Review Week 3", titleVi: "On tap Tuan 3", skills: [
      { type: "vocab", label: "On tu vung", view: "review" },
      { type: "listen", label: "Nghe tong hop", view: "listening" },
      { type: "write", label: "Viet bai luan ngan", view: "writing" },
    ]},
    // Week 4: Culture & Travel
    { id: "b1-w4d1", week: 4, day: 1, title: "World Cultures", titleVi: "Van hoa the gioi", skills: [
      { type: "vocab", label: "Tu vung van hoa", view: "topics", topicId: "topic_culture" },
      { type: "read", label: "Doc ve phong tuc", view: "reading" },
      { type: "listen", label: "Nghe gioi thieu dat nuoc", view: "listening" },
    ]},
    { id: "b1-w4d2", week: 4, day: 2, title: "Travel Stories", titleVi: "Cau chuyen du lich", skills: [
      { type: "read", label: "Doc nhat ky du lich", view: "reading" },
      { type: "speak", label: "Ke ve chuyen di", view: "speak" },
      { type: "grammar", label: "Past Perfect", view: "grammar" },
    ]},
    { id: "b1-w4d3", week: 4, day: 3, title: "Food Around the World", titleVi: "Am thuc the gioi", skills: [
      { type: "listen", label: "Nghe ve am thuc", view: "listening" },
      { type: "speak", label: "Gioi thieu mon an VN", view: "speak" },
      { type: "write", label: "Viet ve mon an", view: "writing" },
    ]},
    { id: "b1-w4d4", week: 4, day: 4, title: "Festivals & Celebrations", titleVi: "Le hoi", skills: [
      { type: "vocab", label: "Tu vung le hoi", view: "topics", topicId: "topic_culture" },
      { type: "read", label: "Doc ve le hoi", view: "reading" },
      { type: "write", label: "Viet ve le hoi yeu thich", view: "writing" },
    ]},
    { id: "b1-w4d5", week: 4, day: 5, title: "Final Review", titleVi: "On tap tong ket", skills: [
      { type: "vocab", label: "On toan bo tu vung", view: "review" },
      { type: "grammar", label: "On ngu phap", view: "grammar" },
      { type: "speak", label: "Thuyet trinh tu do", view: "speak" },
    ]},
  ],
  b2: [
    // Week 1: Globalisation & Economy
    { id: "b2-w1d1", week: 1, day: 1, title: "Global Economy", titleVi: "Kinh te toan cau", skills: [
      { type: "vocab", label: "Tu vung kinh te", view: "topics", topicId: "topic_business" },
      { type: "read", label: "Doc bai phan tich kinh te", view: "reading" },
      { type: "grammar", label: "Mixed Conditionals", view: "grammar" },
    ]},
    { id: "b2-w1d2", week: 1, day: 2, title: "International Trade", titleVi: "Thuong mai quoc te", skills: [
      { type: "listen", label: "Nghe bai giang kinh te", view: "listening" },
      { type: "speak", label: "Tranh luan ve toan cau hoa", view: "speak" },
      { type: "write", label: "Viet bai nghi luan", view: "writing" },
    ]},
    { id: "b2-w1d3", week: 1, day: 3, title: "Startups & Innovation", titleVi: "Khoi nghiep & Sang tao", skills: [
      { type: "vocab", label: "Tu vung khoi nghiep", view: "topics", topicId: "topic_business" },
      { type: "read", label: "Doc case study", view: "reading" },
      { type: "speak", label: "Pitch y tuong", view: "speak" },
    ]},
    { id: "b2-w1d4", week: 1, day: 4, title: "Marketing & Advertising", titleVi: "Tiep thi & Quang cao", skills: [
      { type: "listen", label: "Nghe quang cao", view: "listening" },
      { type: "write", label: "Viet quang cao san pham", view: "writing" },
      { type: "grammar", label: "Inversion", view: "grammar" },
    ]},
    { id: "b2-w1d5", week: 1, day: 5, title: "Review Week 1", titleVi: "On tap Tuan 1", skills: [
      { type: "vocab", label: "On tu vung", view: "review" },
      { type: "speak", label: "Thuyet trinh kinh doanh", view: "speak" },
      { type: "write", label: "Viet bao cao", view: "writing" },
    ]},
    // Week 2: Science & Research
    { id: "b2-w2d1", week: 2, day: 1, title: "Scientific Discovery", titleVi: "Phat minh khoa hoc", skills: [
      { type: "vocab", label: "Tu vung khoa hoc", view: "topics", topicId: "topic_science" },
      { type: "read", label: "Doc bai khoa hoc", view: "reading" },
      { type: "grammar", label: "Cleft sentences", view: "grammar" },
    ]},
    { id: "b2-w2d2", week: 2, day: 2, title: "Medical Advances", titleVi: "Tien bo y hoc", skills: [
      { type: "listen", label: "Nghe podcast y hoc", view: "listening" },
      { type: "speak", label: "Thao luan y te", view: "speak" },
      { type: "write", label: "Viet tom tat nghien cuu", view: "writing" },
    ]},
    { id: "b2-w2d3", week: 2, day: 3, title: "AI & Future Tech", titleVi: "AI & Cong nghe tuong lai", skills: [
      { type: "read", label: "Doc ve tri tue nhan tao", view: "reading" },
      { type: "vocab", label: "Tu vung AI", view: "topics", topicId: "topic_science" },
      { type: "speak", label: "Tranh luan ve AI", view: "speak" },
    ]},
    { id: "b2-w2d4", week: 2, day: 4, title: "Space Exploration", titleVi: "Kham pha vu tru", skills: [
      { type: "listen", label: "Nghe phong su vu tru", view: "listening" },
      { type: "write", label: "Viet bai ve tuong lai", view: "writing" },
      { type: "grammar", label: "Participle clauses", view: "grammar" },
    ]},
    { id: "b2-w2d5", week: 2, day: 5, title: "Review Week 2", titleVi: "On tap Tuan 2", skills: [
      { type: "vocab", label: "On tu vung", view: "review" },
      { type: "grammar", label: "On ngu phap", view: "grammar" },
      { type: "listen", label: "Nghe TED Talk", view: "listening" },
    ]},
    // Week 3: Society & Ethics
    { id: "b2-w3d1", week: 3, day: 1, title: "Social Issues", titleVi: "Van de xa hoi", skills: [
      { type: "vocab", label: "Tu vung xa hoi", view: "topics", topicId: "topic_society" },
      { type: "read", label: "Doc bai xa luan", view: "reading" },
      { type: "grammar", label: "Subjunctive mood", view: "grammar" },
    ]},
    { id: "b2-w3d2", week: 3, day: 2, title: "Education Debate", titleVi: "Tranh luan giao duc", skills: [
      { type: "listen", label: "Nghe tranh luan", view: "listening" },
      { type: "speak", label: "Phan bien y kien", view: "speak" },
      { type: "write", label: "Viet bai nghi luan 2 mat", view: "writing" },
    ]},
    { id: "b2-w3d3", week: 3, day: 3, title: "Human Rights", titleVi: "Nhan quyen", skills: [
      { type: "read", label: "Doc bai ve nhan quyen", view: "reading" },
      { type: "vocab", label: "Tu vung phap ly", view: "topics", topicId: "topic_society" },
      { type: "speak", label: "Trinh bay quan diem", view: "speak" },
    ]},
    { id: "b2-w3d4", week: 3, day: 4, title: "Media & Ethics", titleVi: "Truyen thong & Dao duc", skills: [
      { type: "listen", label: "Nghe phong van", view: "listening" },
      { type: "write", label: "Viet bai phan tich", view: "writing" },
      { type: "grammar", label: "Emphasis & hedging", view: "grammar" },
    ]},
    { id: "b2-w3d5", week: 3, day: 5, title: "Review Week 3", titleVi: "On tap Tuan 3", skills: [
      { type: "vocab", label: "On tu vung", view: "review" },
      { type: "speak", label: "Debate tu do", view: "speak" },
      { type: "write", label: "Viet bai luan hoan chinh", view: "writing" },
    ]},
    // Week 4: Academic & Exam Prep
    { id: "b2-w4d1", week: 4, day: 1, title: "Academic Writing", titleVi: "Viet hoc thuat", skills: [
      { type: "write", label: "Viet bai essay", view: "writing" },
      { type: "grammar", label: "Formal linking words", view: "grammar" },
      { type: "read", label: "Doc bai mau IELTS", view: "reading" },
    ]},
    { id: "b2-w4d2", week: 4, day: 2, title: "Listening Exam", titleVi: "Luyen nghe thi", skills: [
      { type: "listen", label: "Nghe bai thi mau", view: "listening" },
      { type: "vocab", label: "Tu vung hoc thuat", view: "topics", topicId: "topic_academic" },
      { type: "speak", label: "Tom tat noi dung nghe", view: "speak" },
    ]},
    { id: "b2-w4d3", week: 4, day: 3, title: "Speaking Exam", titleVi: "Luyen noi thi", skills: [
      { type: "speak", label: "Mock Speaking test", view: "speak" },
      { type: "listen", label: "Nghe bai mau speaking", view: "listening" },
      { type: "grammar", label: "On tong ngu phap", view: "grammar" },
    ]},
    { id: "b2-w4d4", week: 4, day: 4, title: "Reading Comprehension", titleVi: "Doc hieu nang cao", skills: [
      { type: "read", label: "Doc bai thi mau", view: "reading" },
      { type: "write", label: "Viet tom tat bai doc", view: "writing" },
      { type: "vocab", label: "Tu vung nang cao", view: "topics", topicId: "topic_academic" },
    ]},
    { id: "b2-w4d5", week: 4, day: 5, title: "Final Review", titleVi: "On tap tong ket", skills: [
      { type: "vocab", label: "On toan bo tu vung", view: "review" },
      { type: "grammar", label: "On ngu phap", view: "grammar" },
      { type: "speak", label: "Thuyet trinh tu do", view: "speak" },
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

const WEEK_LABELS = ["Tuan 1", "Tuan 2", "Tuan 3", "Tuan 4"];
const WEEK_THEMES: Record<string, string[]> = {
  a1: ["Chao hoi & Gioi thieu", "Sinh hoat & Thoi gian", "Thuc pham & Do uong", "Truong hoc & Lop hoc"],
  a2: ["Du lich & Giao thong", "Mua sam & Tien bac", "Suc khoe & Co the", "Thoi tiet & Mua"],
  b1: ["Cong viec & Nghe nghiep", "Cong nghe & Truyen thong", "Moi truong & Xa hoi", "Van hoa & Du lich"],
  b2: ["Kinh te toan cau", "Khoa hoc & Nghien cuu", "Xa hoi & Dao duc", "Hoc thuat & Luyen thi"],
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
        title="Lo trinh hoc tap"
        icon={<BookOpen className="h-4 w-4" />}
        iconBg="bg-indigo-500"
        onClose={onBackHome}
        progress={progressPct}
      />

      {/* Level & progress summary */}
      <div className="mb-4 text-center">
        <p className="text-xs font-bold text-muted-foreground">
          Cap do {student.level.toUpperCase()} &middot; {completedCount}/{totalLessons} bai hoc
        </p>
      </div>

      {/* Week tabs */}
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
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
                "flex-1 min-w-0 rounded-xl px-3 py-2.5 text-center transition-all active:scale-95",
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
                "rounded-2xl border px-4 py-3.5 transition-all",
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
                    <span className="text-[10px] font-bold text-muted-foreground">Ngay {lesson.day}</span>
                    {isToday && !isDone && (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-[8px] font-black text-white">
                        Bai hoc hom nay
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
