const Database = require("better-sqlite3");
const path = require("path");
const db = new Database(path.join(__dirname, "..", "data.db"));
db.pragma("journal_mode = WAL");

// Create tables first
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, name_vi TEXT NOT NULL,
    "order" INTEGER NOT NULL, sub_topics TEXT DEFAULT '[]'
  );
  CREATE TABLE IF NOT EXISTS word_bank (
    id TEXT PRIMARY KEY, word TEXT NOT NULL, phonetic TEXT DEFAULT '',
    meaning_vi TEXT NOT NULL, meaning_en TEXT DEFAULT '', pos TEXT DEFAULT '',
    level TEXT NOT NULL, categories TEXT NOT NULL DEFAULT '[]',
    frequency INTEGER DEFAULT 0, examples TEXT DEFAULT '[]',
    word_family TEXT DEFAULT '[]', collocations TEXT DEFAULT '[]',
    synonyms TEXT DEFAULT '[]', antonyms TEXT DEFAULT '[]',
    common_mistakes TEXT DEFAULT '[]', grammar_patterns TEXT DEFAULT '[]',
    image TEXT DEFAULT '', audio TEXT DEFAULT '', created_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_wb_level ON word_bank(level);
  CREATE INDEX IF NOT EXISTS idx_wb_word ON word_bank(word);
`);

const CATEGORIES = [
  { id: "animals_and_nature", name: "Animals and Nature", name_vi: "Động vật & Thiên nhiên", order: 1, sub_topics: ["Animals", "Pets", "Natural world"] },
  { id: "clothes_and_accessories", name: "Clothes and Accessories", name_vi: "Quần áo & Phụ kiện", order: 2, sub_topics: ["Clothing", "Fashion"] },
  { id: "colours_and_shapes", name: "Colours and Shapes", name_vi: "Màu sắc & Hình dạng", order: 3, sub_topics: ["Colours", "Shapes", "Descriptions"] },
  { id: "communication_and_technology", name: "Communication and Technology", name_vi: "Giao tiếp & Công nghệ", order: 4, sub_topics: ["Devices", "Internet", "Media"] },
  { id: "daily_life", name: "Daily Life", name_vi: "Sinh hoạt hàng ngày", order: 5, sub_topics: ["Routines", "Greetings", "Common actions"] },
  { id: "education", name: "Education", name_vi: "Giáo dục", order: 6, sub_topics: ["School", "University", "Studying"] },
  { id: "entertainment_and_media", name: "Entertainment and Media", name_vi: "Giải trí & Truyền thông", order: 7, sub_topics: ["Film", "Music", "TV", "Games"] },
  { id: "environment", name: "Environment", name_vi: "Môi trường", order: 8, sub_topics: ["Countryside", "Pollution", "Climate"] },
  { id: "family_and_friends", name: "Family and Friends", name_vi: "Gia đình & Bạn bè", order: 9, sub_topics: ["Family", "Relationships", "People"] },
  { id: "feelings_and_opinions", name: "Feelings and Opinions", name_vi: "Cảm xúc & Ý kiến", order: 10, sub_topics: ["Emotions", "Personality", "Attitudes"] },
  { id: "food_and_drink", name: "Food and Drink", name_vi: "Đồ ăn & Thức uống", order: 11, sub_topics: ["Food", "Cooking", "Restaurant"] },
  { id: "health_and_body", name: "Health and Body", name_vi: "Sức khỏe & Cơ thể", order: 12, sub_topics: ["Body parts", "Medicine", "Exercise"] },
  { id: "hobbies_and_leisure", name: "Hobbies and Leisure", name_vi: "Sở thích & Giải trí", order: 13, sub_topics: ["Sports", "Free time", "Interests"] },
  { id: "house_and_home", name: "House and Home", name_vi: "Nhà ở", order: 14, sub_topics: ["Rooms", "Furniture", "Housework"] },
  { id: "measurements_and_numbers", name: "Measurements and Numbers", name_vi: "Số & Đo lường", order: 15, sub_topics: ["Numbers", "Time", "Units", "Money"] },
  { id: "places", name: "Places", name_vi: "Địa điểm", order: 16, sub_topics: ["Buildings", "Town", "City", "Countryside"] },
  { id: "services", name: "Services", name_vi: "Dịch vụ", order: 17, sub_topics: ["Bank", "Post", "Restaurant", "Hospital"] },
  { id: "shopping", name: "Shopping", name_vi: "Mua sắm", order: 18, sub_topics: ["Shops", "Prices", "Buying"] },
  { id: "society_and_community", name: "Society and Community", name_vi: "Xã hội & Cộng đồng", order: 19, sub_topics: ["Social issues", "Politics", "Economy"] },
  { id: "sport", name: "Sport", name_vi: "Thể thao", order: 20, sub_topics: ["Games", "Competition", "Fitness"] },
  { id: "science_and_research", name: "Science and Research", name_vi: "Khoa học & Nghiên cứu", order: 21, sub_topics: ["Scientific topics", "Academic"] },
  { id: "travel_and_transport", name: "Travel and Transport", name_vi: "Du lịch & Giao thông", order: 22, sub_topics: ["Vehicles", "Airport", "Tourism"] },
  { id: "weather_and_seasons", name: "Weather and Seasons", name_vi: "Thời tiết & Mùa", order: 23, sub_topics: ["Climate", "Seasons", "Forecasts"] },
  { id: "work_and_jobs", name: "Work and Jobs", name_vi: "Công việc & Nghề nghiệp", order: 24, sub_topics: ["Occupations", "Office", "Career"] },
];

const insert = db.prepare('INSERT OR REPLACE INTO categories (id, name, name_vi, "order", sub_topics) VALUES (?, ?, ?, ?, ?)');
const tx = db.transaction(() => {
  for (const c of CATEGORIES) insert.run(c.id, c.name, c.name_vi, c.order, JSON.stringify(c.sub_topics));
});
tx();
console.log(`Seeded ${CATEGORIES.length} categories`);
db.close();
