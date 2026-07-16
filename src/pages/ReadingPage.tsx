import { BookOpen, ArrowLeft, CheckCircle, Loader2, Volume2, XCircle } from "lucide-react";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import type { Student } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/cn";
import { speakText } from "@/services/speechService";

interface Props { student: Student; onBackHome: () => void; }

type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

const LEVELS: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

/* ------------------------------------------------------------------ */
/*  Mini dictionary for word tap                                      */
/* ------------------------------------------------------------------ */
// Part of speech → color: n=noun, v=verb, adj=adjective, adv=adverb, prep=preposition
type POS = "n" | "v" | "adj" | "adv" | "prep" | "conj" | "pron";
const POS_COLOR: Record<POS, string> = {
  n: "text-blue-600", v: "text-red-500", adj: "text-green-600",
  adv: "text-purple-600", prep: "text-amber-600", conj: "text-gray-500", pron: "text-teal-600",
};
const POS_LABEL: Record<POS, string> = {
  n: "danh từ", v: "động từ", adj: "tính từ",
  adv: "trạng từ", prep: "giới từ", conj: "liên từ", pron: "đại từ",
};
const WORD_POS: Record<string, POS> = {
  // nouns
  family: "n", father: "n", mother: "n", brother: "n", sister: "n", teacher: "n", nurse: "n",
  school: "n", classroom: "n", friend: "n", friends: "n", day: "n", park: "n", weekend: "n",
  story: "n", stories: "n", trip: "n", beach: "n", morning: "n", car: "n", ocean: "n",
  sand: "n", waves: "n", sandcastle: "n", lunch: "n", sandwiches: "n", fruit: "n", afternoon: "n",
  shells: "n", sunset: "n", sky: "n", home: "n", city: "n", village: "n", grandmother: "n",
  summer: "n", holiday: "n", air: "n", river: "n", field: "n", mountain: "n", nature: "n",
  noise: "n", traffic: "n", garden: "n", flowers: "n", vegetables: "n", chickens: "n", eggs: "n",
  bird: "n", birds: "n", tree: "n", trees: "n", environment: "n", technology: "n",
  communication: "n", smartphone: "n", internet: "n", information: "n", education: "n",
  media: "n", world: "n", challenge: "n", screen: "n", health: "n", balance: "n", benefit: "n",
  house: "n", hair: "n", name: "n", water: "n", food: "n", book: "n", library: "n",
  dog: "n", cat: "n", pet: "n", birthday: "n", present: "n", presents: "n", gift: "n",
  candles: "n", balloon: "n", balloons: "n", race: "n", team: "n", prize: "n", medal: "n",
  score: "n", competition: "n", recipe: "n", ingredient: "n", ingredients: "n",
  oven: "n", flour: "n", sugar: "n", butter: "n", bowl: "n", shelf: "n", shelves: "n",
  librarian: "n", adventure: "n", job: "n", interview: "n", manager: "n", customer: "n",
  experience: "n", salary: "n", colleague: "n", opportunity: "n",
  // verbs
  love: "v", learn: "v", read: "v", write: "v", play: "v", lives: "v", likes: "v", like: "v",
  swim: "v", run: "v", draw: "v", laugh: "v", drove: "v", arrived: "v", built: "v",
  ate: "v", swam: "v", collected: "v", watched: "v", remember: "v", spent: "v",
  miss: "v", grow: "v", walk: "v", sing: "v", protect: "v", changed: "v", connect: "v",
  eat: "v", drink: "v", sleep: "v", go: "v", come: "v", see: "v", look: "v", help: "v",
  make: "v", take: "v", give: "v", tell: "v", say: "v", think: "v", know: "v", want: "v",
  need: "v", cook: "v", mix: "v", stir: "v", pour: "v", bake: "v", borrow: "v",
  imagine: "v", win: "v", won: "v", cheer: "v", cheered: "v", blow: "v", wish: "v",
  // adjectives
  big: "adj", tall: "adj", long: "adj", brown: "adj", beautiful: "adj", early: "adj",
  excited: "adj", orange: "adj", pink: "adj", tired: "adj", wonderful: "adj",
  fresh: "adj", clean: "adj", green: "adj", peaceful: "adj", quiet: "adj", busy: "adj",
  important: "adj", online: "adj", social: "adj", happy: "adj", good: "adj", bad: "adj",
  nice: "adj", kind: "adj", old: "adj", new: "adj", young: "adj", small: "adj",
  hot: "adj", cold: "adj", warm: "adj", proud: "adj", dangerous: "adj", cute: "adj", lucky: "adj",
  // adverbs
  together: "adv", forever: "adv", every: "adv", very: "adv", always: "adv", never: "adv",
  // prepositions
  next: "prep", near: "prep",
  // pronouns
  we: "pron", they: "pron", she: "pron", he: "pron",
};

const MINI_DICT: Record<string, string> = {
  family: "gia đình", big: "lớn", father: "bố", mother: "mẹ", teacher: "giáo viên",
  nurse: "y tá", brother: "anh/em trai", sister: "chị/em gái", love: "yêu thương",
  school: "trường học", every: "mỗi", day: "ngày", classroom: "lớp học",
  friends: "bạn bè", friend: "bạn", learn: "học", read: "đọc", write: "viết",
  play: "chơi", happy: "vui", together: "cùng nhau", best: "tốt nhất",
  lives: "sống", next: "kế bên", house: "nhà", tall: "cao", hair: "tóc",
  long: "dài", brown: "nâu", likes: "thích", like: "thích", swim: "bơi",
  swimming: "bơi lội", run: "chạy", running: "chạy bộ", draw: "vẽ", drawing: "vẽ",
  park: "công viên", weekend: "cuối tuần", laugh: "cười", stories: "câu chuyện",
  story: "câu chuyện", trip: "chuyến đi", beach: "bãi biển", morning: "buổi sáng",
  early: "sớm", excited: "hào hứng", car: "xe hơi", drove: "lái xe",
  ocean: "đại dương", arrived: "đến nơi", sand: "cát", waves: "sóng",
  beautiful: "đẹp", sandcastle: "lâu đài cát", built: "xây", lunch: "bữa trưa",
  ate: "ăn", sandwiches: "bánh mì kẹp", fruit: "trái cây", afternoon: "buổi chiều",
  swam: "bơi (quá khứ)", collected: "thu thập", shells: "vỏ sò", sunset: "hoàng hôn",
  watched: "xem", sky: "bầu trời", orange: "cam", pink: "hồng", home: "nhà",
  tired: "mệt", wonderful: "tuyệt vời", remember: "nhớ", forever: "mãi mãi",
  city: "thành phố", village: "làng", grandmother: "bà", summer: "mùa hè",
  holiday: "kỳ nghỉ", spent: "dành", fresh: "tươi", air: "không khí",
  clean: "sạch", river: "sông", field: "cánh đồng", green: "xanh lá",
  mountain: "núi", nature: "thiên nhiên", peaceful: "yên bình", quiet: "yên tĩnh",
  busy: "bận rộn", noise: "tiếng ồn", traffic: "giao thông", miss: "nhớ",
  garden: "vườn", flowers: "hoa", grow: "trồng/lớn lên", vegetables: "rau",
  chickens: "gà", eggs: "trứng", walk: "đi bộ",
  bird: "chim", birds: "chim", sing: "hát", singing: "hát", tree: "cây",
  trees: "cây cối", important: "quan trọng", protect: "bảo vệ", environment: "môi trường",
  technology: "công nghệ", changed: "thay đổi", communication: "giao tiếp",
  smartphone: "điện thoại thông minh", internet: "mạng internet", information: "thông tin",
  education: "giáo dục", online: "trực tuyến", social: "xã hội", media: "truyền thông",
  connect: "kết nối", world: "thế giới", challenge: "thách thức", screen: "màn hình",
  health: "sức khỏe", exercise: "tập thể dục", balance: "cân bằng", benefit: "lợi ích",
  water: "nước", food: "đồ ăn", eat: "ăn", drink: "uống", sleep: "ngủ",
  wake: "thức dậy", small: "nhỏ", old: "già/cũ", new: "mới", young: "trẻ",
  go: "đi", come: "đến", see: "thấy", look: "nhìn", help: "giúp đỡ",
  make: "làm", take: "lấy", give: "cho", tell: "kể", say: "nói",
  think: "nghĩ", know: "biết", want: "muốn", need: "cần", can: "có thể",
  good: "tốt", bad: "xấu", nice: "đẹp/tốt", kind: "tốt bụng",
  weather: "thời tiết", rain: "mưa", sun: "mặt trời", hot: "nóng", cold: "lạnh",
  warm: "ấm", cool: "mát", wind: "gió", cloud: "mây", snow: "tuyết",
  people: "mọi người", children: "trẻ em", man: "đàn ông", woman: "phụ nữ",
  boy: "con trai", girl: "con gái", baby: "em bé",
  cat: "mèo", dog: "chó", fish: "cá", animal: "động vật", animals: "động vật",
  book: "sách", books: "sách", pen: "bút", paper: "giấy", desk: "bàn",
  door: "cửa", window: "cửa sổ", room: "phòng", bed: "giường", chair: "ghế",
  table: "bàn", kitchen: "nhà bếp", bathroom: "phòng tắm",
  time: "thời gian", year: "năm", month: "tháng", week: "tuần",
  today: "hôm nay", yesterday: "hôm qua", tomorrow: "ngày mai",
  color: "màu sắc", red: "đỏ", blue: "xanh dương", yellow: "vàng",
  white: "trắng", black: "đen", purple: "tím",
  number: "số", one: "một", two: "hai", three: "ba", four: "bốn", five: "năm",
  breakfast: "bữa sáng", dinner: "bữa tối", delicious: "ngon", soup: "súp",
  restaurant: "nhà hàng", order: "gọi món", pizza: "pizza", milk: "sữa",
  bread: "bánh mì", rice: "cơm", chicken: "gà/thịt gà", banana: "chuối",
  bananas: "chuối", especially: "đặc biệt", favorite: "yêu thích",
  cute: "dễ thương", name: "tên", lucky: "may mắn",
  evening: "buổi tối", night: "buổi tối/đêm",
  market: "chợ", buy: "mua", sell: "bán", shop: "cửa hàng",
  workplace: "nơi làm việc", employee: "nhân viên", employer: "người sử dụng lao động",
  productivity: "năng suất", research: "nghiên cứu", significant: "đáng kể",
  flexibility: "sự linh hoạt", remote: "từ xa", commute: "đi lại",
  autonomy: "sự tự chủ", isolation: "sự cô lập", boundaries: "ranh giới",
  struggle: "đấu tranh", discipline: "kỷ luật", distractions: "sự xao nhãng",
  hybrid: "kết hợp", arrangement: "sự sắp xếp", collaborate: "hợp tác",
  monitor: "giám sát", performance: "hiệu suất", culture: "văn hóa",
  career: "sự nghiệp", opportunity: "cơ hội", advantage: "lợi thế",
  disadvantage: "bất lợi", debate: "tranh luận", evolve: "phát triển",
  shape: "định hình", future: "tương lai", experiment: "thí nghiệm",
  traditional: "truyền thống", modern: "hiện đại", society: "xã hội",
  ultimately: "cuối cùng", decade: "thập kỷ", professional: "chuyên nghiệp",
  teeth: "răng",
  brush: "đánh (răng)/chải", uniform: "đồng phục", wear: "mặc",
  // pets, playground, birthday
  pet: "thú cưng", pets: "thú cưng", tail: "đuôi", wag: "vẫy", bark: "sủa",
  bone: "xương", toy: "đồ chơi", toys: "đồ chơi", slide: "cầu trượt", swing: "xích đu",
  swings: "xích đu", climb: "trèo", ladder: "thang", fast: "nhanh", turn: "lượt/quay",
  birthday: "sinh nhật", party: "bữa tiệc", cake: "bánh kem", candle: "nến",
  candles: "nến", balloon: "bong bóng", balloons: "bong bóng", present: "quà tặng",
  presents: "quà tặng", gift: "quà", gifts: "quà", blow: "thổi", wish: "ước",
  sang: "đã hát",
  // sports, cooking, library
  race: "cuộc đua", team: "đội", win: "thắng", won: "đã thắng", prize: "giải thưởng",
  proud: "tự hào", cheer: "cổ vũ", cheered: "đã cổ vũ", medal: "huy chương",
  sport: "thể thao", sports: "thể thao", score: "điểm số", competition: "cuộc thi",
  cook: "nấu ăn", cooking: "nấu ăn", recipe: "công thức", ingredient: "nguyên liệu",
  ingredients: "nguyên liệu", mix: "trộn", stir: "khuấy", oven: "lò nướng",
  flour: "bột mì", sugar: "đường", butter: "bơ", bowl: "tô/bát", pour: "đổ",
  smell: "mùi/ngửi", taste: "vị/nếm", bake: "nướng",
  library: "thư viện", borrow: "mượn", shelf: "kệ sách", shelves: "kệ sách",
  librarian: "thủ thư", silence: "sự im lặng",
  adventure: "phiêu lưu", imagine: "tưởng tượng",
  // first job, social media, healthy eating, volunteering
  job: "công việc", interview: "phỏng vấn", nervous: "lo lắng", manager: "quản lý",
  customer: "khách hàng", customers: "khách hàng", wage: "lương", earn: "kiếm được",
  responsibility: "trách nhiệm", confidence: "sự tự tin", shift: "ca làm việc",
  experience: "kinh nghiệm", colleagues: "đồng nghiệp",
  followers: "người theo dõi", profile: "hồ sơ", post: "bài đăng", posts: "bài đăng",
  notification: "thông báo", notifications: "thông báo", comparison: "sự so sánh",
  pressure: "áp lực", reality: "thực tế", mindful: "chánh niệm",
  diet: "chế độ ăn", nutrition: "dinh dưỡng", protein: "chất đạm",
  vitamin: "vitamin", vitamins: "vitamin", mineral: "khoáng chất", minerals: "khoáng chất",
  processed: "chế biến sẵn", organic: "hữu cơ", portion: "phần ăn",
  habit: "thói quen", habits: "thói quen", lifestyle: "lối sống",
  volunteer: "tình nguyện", volunteering: "tình nguyện", community: "cộng đồng",
  donate: "quyên góp", donation: "sự quyên góp", shelter: "nơi trú ẩn",
  elderly: "người cao tuổi", impact: "tác động", grateful: "biết ơn",
  purpose: "mục đích", meaningful: "có ý nghĩa",
  // B2 topics
  artificial: "nhân tạo", intelligence: "trí tuệ", algorithm: "thuật toán",
  algorithms: "thuật toán", automation: "tự động hóa", bias: "thiên kiến",
  ethical: "đạo đức", ethics: "đạo đức học", dataset: "tập dữ liệu",
  prediction: "dự đoán", efficiency: "hiệu quả", displacement: "sự thay thế",
  climate: "khí hậu", emission: "khí thải", emissions: "khí thải",
  carbon: "carbon", renewable: "tái tạo", fossil: "hóa thạch", fuel: "nhiên liệu",
  drought: "hạn hán", flood: "lũ lụt", glacier: "sông băng",
  sustainable: "bền vững", sustainability: "sự bền vững",
  exploration: "sự khám phá", orbit: "quỹ đạo", satellite: "vệ tinh",
  spacecraft: "tàu vũ trụ", astronaut: "phi hành gia", colony: "thuộc địa/khu định cư",
  colonize: "khai hoang", radiation: "bức xạ", gravity: "trọng lực",
  mars: "sao Hỏa", frontier: "biên giới",
  cultural: "văn hóa", customs: "phong tục", norm: "chuẩn mực", norms: "chuẩn mực",
  diversity: "sự đa dạng", stereotype: "khuôn mẫu", stereotypes: "khuôn mẫu",
  tolerance: "sự khoan dung", perspective: "góc nhìn", perspectives: "góc nhìn",
  assimilation: "sự đồng hóa", identity: "bản sắc",
  // C1 topics
  philosophy: "triết học", happiness: "hạnh phúc", fulfillment: "sự viên mãn",
  hedonic: "khoái lạc", eudaimonic: "hạnh phúc thực sự", pursuit: "sự theo đuổi",
  paradox: "nghịch lý", gratitude: "lòng biết ơn", materialism: "chủ nghĩa vật chất",
  contentment: "sự mãn nguyện", wellbeing: "sự an lạc",
  privacy: "quyền riêng tư", surveillance: "giám sát", encryption: "mã hóa",
  data: "dữ liệu", consent: "sự đồng ý", breach: "vi phạm",
  transparency: "sự minh bạch", anonymous: "ẩn danh", tracking: "theo dõi",
  regulation: "quy định", regulations: "quy định",
  inequality: "bất bình đẳng", wealth: "sự giàu có", poverty: "nghèo đói",
  redistribution: "tái phân phối", mobility: "sự dịch chuyển",
  taxation: "thuế", progressive: "lũy tiến", disparity: "sự chênh lệch",
  systemic: "mang tính hệ thống", meritocracy: "chế độ nhân tài",
  // C2 topics
  consciousness: "ý thức", qualia: "cảm thụ chủ quan", sentience: "tri giác",
  dualism: "nhị nguyên luận", materialism_phil: "chủ nghĩa duy vật",
  phenomenal: "hiện tượng", neural: "thần kinh", correlate: "tương quan",
  subjective: "chủ quan", emergent: "nổi lên/nảy sinh", introspection: "nội quan",
  linguistic: "ngôn ngữ học", relativity: "thuyết tương đối",
  cognition: "nhận thức", perception: "tri giác", conceptual: "khái niệm",
  morphology: "hình thái học", syntax: "cú pháp", semantics: "ngữ nghĩa học",
  determinism: "thuyết tất định", hypothesis: "giả thuyết",
  sapir: "Sapir", whorf: "Whorf", lexicon: "từ vựng",
};

/* ------------------------------------------------------------------ */
/*  Story data                                                        */
/* ------------------------------------------------------------------ */
interface Question { question: string; options: string[]; answer: number; }

interface Story {
  id: string;
  title: string;
  level: CEFRLevel;
  wordCount: number;
  description: string;
  text: string;
  questions: Question[];
}

const STORIES: Story[] = [
  // ─── A1 ───
  {
    id: "a1-1", title: "My Family", level: "A1", wordCount: 40,
    description: "A child talks about their family members.",
    text: "I have a big family. My father is a teacher. My mother is a nurse. I have one brother and one sister. My brother is ten years old. My sister is five. We love each other. We are happy together.",
    questions: [
      { question: "What is the father's job?", options: ["A doctor", "A teacher", "A nurse", "A cook"], answer: 1 },
      { question: "How old is the sister?", options: ["Three", "Five", "Seven", "Ten"], answer: 1 },
      { question: "What is the mother's job?", options: ["A teacher", "A cook", "A nurse", "A driver"], answer: 2 },
    ],
  },
  {
    id: "a1-2", title: "At School", level: "A1", wordCount: 38,
    description: "A student describes their school day.",
    text: "I go to school every day. My school is big. I have many friends. We learn to read and write. We play in the park after class. My teacher is very kind. I like my school very much.",
    questions: [
      { question: "How often does the child go to school?", options: ["Sometimes", "Every day", "Once a week", "Twice a week"], answer: 1 },
      { question: "What do they do after class?", options: ["Study more", "Go home", "Play in the park", "Sleep"], answer: 2 },
      { question: "What is the teacher like?", options: ["Strict", "Funny", "Kind", "Quiet"], answer: 2 },
    ],
  },
  {
    id: "a1-3", title: "My Pet Cat", level: "A1", wordCount: 37,
    description: "A child describes their pet cat.",
    text: "I have a small cat. Her name is Mimi. She is white and very cute. She likes to sleep on my bed. She eats fish every day. I play with Mimi after school. I love my cat.",
    questions: [
      { question: "What color is Mimi?", options: ["Black", "Brown", "White", "Orange"], answer: 2 },
      { question: "What does Mimi eat?", options: ["Chicken", "Rice", "Fish", "Bread"], answer: 2 },
      { question: "Where does Mimi sleep?", options: ["On the floor", "On the bed", "In the kitchen", "Outside"], answer: 1 },
    ],
  },
  // ─── A2 ───
  {
    id: "a2-1", title: "My Best Friend", level: "A2", wordCount: 64,
    description: "A child describes their best friend and what they do together.",
    text: "My best friend is Anna. She lives next to my house. Anna is tall and has long brown hair. She likes swimming and drawing. Every weekend, we go to the park together. We play, run, and laugh a lot. Sometimes we read stories under the big tree. Anna is very kind and always helps me. I am lucky to have her as my friend.",
    questions: [
      { question: "Where does Anna live?", options: ["Far away", "Next to the child's house", "In another city", "At school"], answer: 1 },
      { question: "What does Anna look like?", options: ["Short with black hair", "Tall with long brown hair", "Small with red hair", "Tall with short hair"], answer: 1 },
      { question: "What do they do under the big tree?", options: ["Play games", "Eat lunch", "Read stories", "Sleep"], answer: 2 },
      { question: "What kind of person is Anna?", options: ["Lazy", "Kind", "Shy", "Funny"], answer: 1 },
    ],
  },
  {
    id: "a2-2", title: "A Rainy Day", level: "A2", wordCount: 64,
    description: "A child talks about what happens on a rainy day.",
    text: "Today it is raining. I cannot go outside to play. I stay at home with my family. In the morning, I read a book about animals. It is very interesting. After lunch, I draw pictures with my sister. She draws a big sun because she wants the rain to stop. In the evening, we watch a movie together. Rainy days can be fun too!",
    questions: [
      { question: "Why can't the child go outside?", options: ["It is too hot", "It is raining", "It is too late", "The child is sick"], answer: 1 },
      { question: "What does the child read about?", options: ["Cars", "Animals", "Food", "School"], answer: 1 },
      { question: "What does the sister draw?", options: ["A rainbow", "A cat", "A big sun", "A house"], answer: 2 },
      { question: "What do they do in the evening?", options: ["Play games", "Cook dinner", "Watch a movie", "Go to sleep"], answer: 2 },
    ],
  },
  {
    id: "a2-3", title: "The Food I Like", level: "A2", wordCount: 64,
    description: "A child talks about their favorite foods.",
    text: "I love eating different kinds of food. For breakfast, I usually eat bread and drink warm milk. My favorite lunch is rice with chicken. I also like fruit very much, especially oranges and bananas. My mother makes delicious soup every evening. On weekends, my family sometimes goes to a restaurant together. I always order pizza there because it is delicious. Food makes me happy!",
    questions: [
      { question: "What does the child eat for breakfast?", options: ["Rice", "Bread and milk", "Pizza", "Soup"], answer: 1 },
      { question: "What is the child's favorite fruit?", options: ["Apples and grapes", "Oranges and bananas", "Mangoes", "Strawberries"], answer: 1 },
      { question: "What does the child order at the restaurant?", options: ["Chicken", "Soup", "Pizza", "Salad"], answer: 2 },
    ],
  },
  // ─── B1 ───
  {
    id: "b1-1", title: "A Trip to the Beach", level: "B1", wordCount: 129,
    description: "A family takes a memorable trip to the beach.",
    text: "Last summer, my family went on a trip to the beach. We woke up very early in the morning because we were so excited. My father drove the car for two hours until we could see the ocean. When we arrived, the sand was warm and the waves were beautiful. My brother and I built a big sandcastle near the water. For lunch, we ate sandwiches and fresh fruit under a large umbrella. In the afternoon, we swam in the ocean and collected colorful shells. Before going home, we watched the sunset together. The sky turned orange and pink, and it was the most beautiful thing I have ever seen. We were very tired when we got home, but it was a wonderful day that I will remember forever.",
    questions: [
      { question: "How long did the father drive?", options: ["One hour", "Two hours", "Three hours", "Thirty minutes"], answer: 1 },
      { question: "What did the children build?", options: ["A tent", "A boat", "A sandcastle", "A fire"], answer: 2 },
      { question: "What did they eat for lunch?", options: ["Pizza and juice", "Sandwiches and fruit", "Rice and fish", "Nothing"], answer: 1 },
      { question: "What did they watch before going home?", options: ["A movie", "The dolphins", "The sunset", "A boat race"], answer: 2 },
    ],
  },
  {
    id: "b1-2", title: "City and Village", level: "B1", wordCount: 128,
    description: "A child compares life in the city and the village.",
    text: "I live in a big city, but every summer holiday I spend two weeks at my grandmother's village. Life in the village is very different from the city. The air is fresh and clean, and there is a beautiful river near her house. In the city, there are many cars and a lot of noise, but in the village it is quiet and peaceful. My grandmother has a lovely garden with flowers and vegetables. She also keeps chickens, so we have fresh eggs every morning. I love taking walks along the river and listening to the birds singing in the trees. Although I enjoy the city because it has many shops and cinemas, I think the village is more relaxing. I always feel sad when the holiday ends.",
    questions: [
      { question: "How long does the child stay in the village?", options: ["One week", "Two weeks", "One month", "All summer"], answer: 1 },
      { question: "What is near the grandmother's house?", options: ["A mountain", "A lake", "A river", "A forest"], answer: 2 },
      { question: "What animals does the grandmother keep?", options: ["Dogs", "Cats", "Chickens", "Cows"], answer: 2 },
      { question: "How does the child feel when the holiday ends?", options: ["Happy", "Angry", "Sad", "Excited"], answer: 2 },
    ],
  },
  // ─── B2 ───
  {
    id: "b2-1", title: "Technology and Communication", level: "B2", wordCount: 159,
    description: "How technology has changed the way we communicate.",
    text: "Over the past two decades, technology has dramatically changed the way people communicate with one another. Before smartphones and the internet, people relied on letters, landline phones, and face-to-face meetings to stay in touch. Today, we can send a message to someone on the other side of the world in just a few seconds. Social media platforms have made it possible to connect with hundreds of people at once, sharing photos, videos, and thoughts instantly. While these changes have brought many benefits, such as easier access to information and faster communication, they have also created new challenges. Many experts worry that people, especially young people, spend too much time looking at screens instead of having real conversations. Some studies suggest that heavy social media use can lead to feelings of loneliness and anxiety. It is important to find a balance between using technology for its many advantages and making time for meaningful, face-to-face interactions with the people around us.",
    questions: [
      { question: "How did people communicate before smartphones?", options: ["Only by email", "Letters, phones, and face-to-face", "Only through social media", "By sending videos"], answer: 1 },
      { question: "What concern do experts have about young people?", options: ["They read too many books", "They exercise too much", "They spend too much time on screens", "They travel too often"], answer: 2 },
      { question: "What can heavy social media use lead to?", options: ["Better grades", "More friends", "Loneliness and anxiety", "Better health"], answer: 2 },
      { question: "What does the author suggest people should do?", options: ["Stop using technology", "Use only social media", "Find a balance between technology and real interactions", "Spend more time alone"], answer: 2 },
    ],
  },
  {
    id: "b2-2", title: "The Importance of Reading", level: "B2", wordCount: 161,
    description: "Why reading books is important for personal development.",
    text: "Reading is one of the most valuable habits a person can develop. Unlike watching television or scrolling through social media, reading requires active engagement from the mind. When we read a book, we must imagine the scenes, understand the characters, and follow complex storylines. This mental exercise strengthens our ability to think critically and creatively. Research has shown that regular readers tend to have larger vocabularies, better writing skills, and stronger analytical thinking. Moreover, reading fiction can increase empathy, as it allows us to experience the world through different perspectives. Despite these well-documented benefits, the number of people who read books regularly has been declining in many countries. Busy lifestyles and the constant availability of digital entertainment are often blamed for this trend. However, even reading for just twenty minutes a day can make a significant difference. Whether it is a novel, a biography, or a science article, every page we read adds to our knowledge and understanding of the world.",
    questions: [
      { question: "What does reading require compared to watching TV?", options: ["Less time", "Active engagement from the mind", "No effort at all", "Special equipment"], answer: 1 },
      { question: "What can reading fiction increase?", options: ["Physical strength", "Empathy", "Wealth", "Popularity"], answer: 1 },
      { question: "Why is the number of regular readers declining?", options: ["Books are too expensive", "Busy lifestyles and digital entertainment", "People cannot read anymore", "Libraries are closing"], answer: 1 },
      { question: "How much daily reading can make a difference?", options: ["Five minutes", "Ten minutes", "Twenty minutes", "One hour"], answer: 2 },
    ],
  },
  // ─── A1 (additional) ───
  {
    id: "a1-4", title: "My Morning", level: "A1", wordCount: 48,
    description: "A child describes their morning routine.",
    text: "I wake up at seven every morning. I brush my teeth and wash my face. Then I eat breakfast with my family. I drink milk and eat bread. I put on my school uniform. My mother walks me to school. I say goodbye and go to my classroom.",
    questions: [
      { question: "What time does the child wake up?", options: ["Six", "Seven", "Eight", "Nine"], answer: 1 },
      { question: "What does the child drink for breakfast?", options: ["Water", "Juice", "Milk", "Tea"], answer: 2 },
      { question: "Who walks the child to school?", options: ["The father", "The brother", "The mother", "A friend"], answer: 2 },
    ],
  },
  // ─── C1 ───
  {
    id: "c1-1", title: "Remote Work: A Lasting Shift?", level: "C1", wordCount: 237,
    description: "An analysis of remote work trends and their impact on the modern workplace.",
    text: "The widespread adoption of remote work during the pandemic has fundamentally altered expectations in the modern workplace. What began as a temporary necessity has evolved into a permanent feature of professional life for millions of workers worldwide. Research conducted by Stanford University found that employees who work from home are, on average, thirteen percent more productive than their office-based counterparts. This increase is attributed to fewer distractions, reduced commute time, and greater autonomy over daily schedules. However, remote work is not without its drawbacks. Many employees report feelings of isolation and difficulty maintaining boundaries between their professional and personal lives. Younger workers, in particular, struggle to develop mentoring relationships and build the informal networks that are often essential for career advancement. Companies, too, face challenges: monitoring performance, maintaining corporate culture, and fostering collaboration become significantly more complex when teams are distributed across different locations and time zones. As a result, a growing number of organizations have adopted hybrid arrangements, requiring employees to work in the office two or three days per week while allowing flexibility on the remaining days. This compromise attempts to capture the productivity benefits of remote work while preserving the social and collaborative advantages of a shared physical workspace. Whether this hybrid model will prove sustainable in the long term remains an open question, but it is clear that the traditional five-day office week is unlikely to return as the default for knowledge workers.",
    questions: [
      { question: "According to Stanford research, how much more productive are remote workers?", options: ["Eight percent", "Thirteen percent", "Twenty percent", "Thirty percent"], answer: 1 },
      { question: "What challenge do younger remote workers face?", options: ["Lower salaries", "Difficulty building mentoring relationships", "Lack of technology", "Too many meetings"], answer: 1 },
      { question: "What does the word 'drawbacks' most likely mean in context?", options: ["Benefits", "Features", "Disadvantages", "Requirements"], answer: 2 },
      { question: "Why are many companies adopting hybrid arrangements?", options: ["To reduce employee salaries", "To balance productivity with collaboration", "To eliminate remote work entirely", "To comply with government regulations"], answer: 1 },
      { question: "What is the author's conclusion about the traditional office week?", options: ["It will return soon", "It is the most productive model", "It is unlikely to be the default again", "It should be legally required"], answer: 2 },
    ],
  },
  // ─── A1 (pets, playground, birthday party) ───
  {
    id: "a1-5", title: "My Dog Max", level: "A1", wordCount: 45,
    description: "A child talks about their pet dog.",
    text: "I have a dog. His name is Max. He is brown and white. Max has a long tail. He likes to run in the park. He eats bones and drinks water. When I come home, Max is very happy. He wags his tail fast. I love Max very much.",
    questions: [
      { question: "What color is Max?", options: ["Black and white", "Brown and white", "All brown", "All white"], answer: 1 },
      { question: "What does Max like to do in the park?", options: ["Sleep", "Swim", "Run", "Eat"], answer: 2 },
      { question: "What does Max do when the child comes home?", options: ["He barks", "He sleeps", "He wags his tail", "He runs away"], answer: 2 },
    ],
  },
  {
    id: "a1-6", title: "The Playground", level: "A1", wordCount: 46,
    description: "A child describes playing at the playground.",
    text: "I go to the playground after school. There is a big slide and two swings. I like the slide the most. I climb the ladder and go down fast. My friend likes the swings. We take turns and play together. The playground is fun. We play there every day.",
    questions: [
      { question: "When does the child go to the playground?", options: ["Before school", "After school", "At night", "In the morning"], answer: 1 },
      { question: "What does the child like the most?", options: ["The swings", "The slide", "The ladder", "The sandbox"], answer: 1 },
      { question: "How often do they play there?", options: ["Once a week", "Sometimes", "Every day", "Never"], answer: 2 },
    ],
  },
  {
    id: "a1-7", title: "My Birthday Party", level: "A1", wordCount: 48,
    description: "A child describes their birthday party.",
    text: "Today is my birthday. I am seven years old. My mother makes a big cake. It has seven candles. My friends come to my house. We have balloons and presents. I blow the candles and make a wish. We eat cake and play games. It is the best day!",
    questions: [
      { question: "How old is the child?", options: ["Five", "Six", "Seven", "Eight"], answer: 2 },
      { question: "Who makes the cake?", options: ["The father", "The grandmother", "A friend", "The mother"], answer: 3 },
      { question: "What does the child do with the candles?", options: ["Lights them", "Counts them", "Blows them", "Buys them"], answer: 2 },
    ],
  },
  // ─── A2 (sports day, cooking, birthday gift, library) ───
  {
    id: "a2-4", title: "Sports Day", level: "A2", wordCount: 72,
    description: "A student talks about their school sports day.",
    text: "Last Friday was sports day at our school. All the students were very excited. There were many competitions like running, jumping, and swimming. I was on the blue team. My best friend Tom was on the red team. I ran in the short race and came in second place. Tom won the long race and got a gold medal. Our teacher was very proud of everyone. At the end of the day, the red team won, but we all had a great time. My mother cheered for me from the side.",
    questions: [
      { question: "When was sports day?", options: ["Last Monday", "Last Wednesday", "Last Friday", "Last Sunday"], answer: 2 },
      { question: "What team was the child on?", options: ["Red team", "Blue team", "Green team", "Yellow team"], answer: 1 },
      { question: "What place did the child get in the short race?", options: ["First", "Second", "Third", "Fourth"], answer: 1 },
      { question: "Who won the long race?", options: ["The child", "Tom", "The teacher", "Nobody"], answer: 1 },
    ],
  },
  {
    id: "a2-5", title: "Cooking with Mom", level: "A2", wordCount: 75,
    description: "A child helps their mother bake a cake.",
    text: "Yesterday, I helped my mother make a chocolate cake. First, we put flour, sugar, and butter in a big bowl. Then I mixed everything together. My mother added eggs and milk. I stirred the mixture until it was smooth. We poured it into a round pan and put it in the oven. We waited for thirty minutes. When the cake was ready, it smelled delicious. We put chocolate on top. I tasted a small piece. It was the best cake I have ever eaten! I want to cook with my mother again.",
    questions: [
      { question: "What kind of cake did they make?", options: ["Vanilla", "Strawberry", "Chocolate", "Banana"], answer: 2 },
      { question: "What did the child do with the ingredients?", options: ["Ate them", "Mixed them", "Threw them away", "Bought them"], answer: 1 },
      { question: "How long did they wait?", options: ["Ten minutes", "Twenty minutes", "Thirty minutes", "One hour"], answer: 2 },
      { question: "How did the cake taste?", options: ["Bad", "Strange", "Okay", "The best ever"], answer: 3 },
    ],
  },
  {
    id: "a2-6", title: "The Birthday Gift", level: "A2", wordCount: 71,
    description: "A child picks a birthday gift for a friend.",
    text: "Next week is my friend Lisa's birthday. I want to buy her a nice present. Lisa loves reading books and drawing pictures. On Saturday, my father took me to the shopping center. I looked at many things in the shops. I found a beautiful set of colored pencils and a book about animals. I think Lisa will love these gifts. I also bought a card and wrote a message inside. I cannot wait to see Lisa open her presents. I hope she has a wonderful birthday.",
    questions: [
      { question: "What does Lisa like doing?", options: ["Cooking and singing", "Reading and drawing", "Swimming and running", "Dancing and playing"], answer: 1 },
      { question: "Who took the child to the shopping center?", options: ["The mother", "A friend", "The father", "The teacher"], answer: 2 },
      { question: "What did the child buy for Lisa?", options: ["A toy and a game", "A dress and shoes", "Colored pencils and a book", "A cake and balloons"], answer: 2 },
    ],
  },
  {
    id: "a2-7", title: "At the Library", level: "A2", wordCount: 73,
    description: "A child visits the local library.",
    text: "Every Saturday morning, I go to the library with my older sister. The library is a big, quiet building near our school. Inside, there are many shelves full of books. I like to sit in the children's corner and read adventure stories. My sister prefers books about science. The librarian is a kind woman who always helps us find good books. We can borrow three books each time. I usually finish my books in one week. Reading takes me to different worlds. I love the library because it is a special place full of imagination.",
    questions: [
      { question: "When does the child go to the library?", options: ["Every Sunday", "Every Saturday morning", "After school", "Once a month"], answer: 1 },
      { question: "What kind of books does the child like?", options: ["Science books", "Adventure stories", "Cooking books", "History books"], answer: 1 },
      { question: "How many books can they borrow each time?", options: ["One", "Two", "Three", "Five"], answer: 2 },
      { question: "What kind of books does the sister prefer?", options: ["Adventure", "Art", "Science", "Music"], answer: 2 },
    ],
  },
  // ─── B1 (first job, social media, healthy eating, volunteering) ───
  {
    id: "b1-3", title: "My First Job", level: "B1", wordCount: 138,
    description: "A teenager describes the experience of their first part-time job.",
    text: "When I turned sixteen, I decided to look for a part-time job. After applying to several places, I got an interview at a small coffee shop near my house. I was very nervous, but the manager was friendly and asked simple questions about why I wanted to work there. A few days later, I received a phone call saying I got the job. My first day was exciting but also stressful. I had to learn how to make different drinks, take orders, and talk to customers politely. In the beginning, I made some mistakes, but my colleagues were patient and helped me improve. After a few weeks, I started to feel more confident. The best part of the job was earning my own money for the first time. I saved most of my wages to buy a new bicycle. Having a job also taught me important skills like time management, responsibility, and how to work as part of a team.",
    questions: [
      { question: "How old was the writer when they started looking for a job?", options: ["Fourteen", "Fifteen", "Sixteen", "Seventeen"], answer: 2 },
      { question: "Where did they get a job?", options: ["A restaurant", "A bookshop", "A coffee shop", "A supermarket"], answer: 2 },
      { question: "What was difficult in the beginning?", options: ["The pay was low", "They made some mistakes", "The hours were long", "The manager was strict"], answer: 1 },
      { question: "What did the writer save money for?", options: ["A phone", "A computer", "A bicycle", "Clothes"], answer: 2 },
    ],
  },
  {
    id: "b1-4", title: "Social Media and Teenagers", level: "B1", wordCount: 135,
    description: "An essay about the effects of social media on young people.",
    text: "Social media has become a big part of teenage life. Most young people spend several hours each day checking their phones, looking at posts, and talking to friends online. There are many positive sides to social media. It helps people stay connected with friends who live far away, and it can be a good way to learn new things through videos and articles. However, there are also serious concerns. Many teenagers feel pressure to look perfect in their photos and get many likes on their posts. This constant comparison with others can lead to low self-esteem and anxiety. Some young people also find it difficult to stop checking their notifications, which affects their sleep and schoolwork. Experts suggest that teenagers should try to be more mindful about how they use social media. Setting time limits, following accounts that make them feel good, and remembering that what people post online is not always reality are all helpful strategies.",
    questions: [
      { question: "What is one positive aspect of social media mentioned?", options: ["It makes money", "It helps stay connected with distant friends", "It replaces school", "It is always free"], answer: 1 },
      { question: "What can constant comparison on social media cause?", options: ["Better grades", "Low self-esteem and anxiety", "More friends", "Better sleep"], answer: 1 },
      { question: "What do experts suggest teenagers should do?", options: ["Delete all accounts", "Be more mindful about usage", "Use social media more", "Only use one platform"], answer: 1 },
      { question: "What problem can checking notifications too often cause?", options: ["Eye problems", "Hearing loss", "Affects sleep and schoolwork", "Losing friends"], answer: 2 },
    ],
  },
  {
    id: "b1-5", title: "Healthy Eating Habits", level: "B1", wordCount: 131,
    description: "The importance of maintaining a balanced diet.",
    text: "Eating well is one of the most important things we can do for our health. A balanced diet includes a variety of foods such as fruits, vegetables, whole grains, and protein from sources like fish, eggs, and beans. Many people today eat too much processed food, which often contains a lot of sugar, salt, and fat. This can lead to health problems like heart disease and diabetes. Experts recommend eating at least five portions of fruit and vegetables every day. Drinking enough water is also essential, as our bodies need it to function properly. Another important habit is eating regular meals and not skipping breakfast, which gives us energy for the day ahead. It is also a good idea to control portion sizes and eat slowly so that our body has time to feel full. Making small changes to our daily diet can have a big positive impact on our long-term health and wellbeing.",
    questions: [
      { question: "What does a balanced diet include?", options: ["Only meat", "A variety of foods", "Only fruits", "Fast food"], answer: 1 },
      { question: "How many portions of fruit and vegetables are recommended daily?", options: ["Two", "Three", "Five", "Ten"], answer: 2 },
      { question: "Why should we not skip breakfast?", options: ["It is expensive", "It gives us energy", "It tastes good", "Everyone does it"], answer: 1 },
      { question: "What can too much processed food lead to?", options: ["Better sleep", "More energy", "Heart disease and diabetes", "Stronger bones"], answer: 2 },
    ],
  },
  {
    id: "b1-6", title: "Volunteering in the Community", level: "B1", wordCount: 134,
    description: "A student shares their experience volunteering.",
    text: "Last year, I started volunteering at a local community center every Saturday. At first, I joined because my teacher said it would look good on my university application. However, after a few weeks, I realized that volunteering was much more meaningful than I had expected. My main job was helping elderly people with their shopping and cooking simple meals for them. Many of them lived alone and did not have family nearby, so they were always happy to see me and have someone to talk to. I also helped organize a small library at the center where people could borrow books for free. Through volunteering, I learned that even small actions can make a big difference in someone's life. I became more grateful for the things I have and developed a stronger sense of purpose. I would encourage everyone to try volunteering because it does not just help others, it also changes you as a person.",
    questions: [
      { question: "Why did the writer first start volunteering?", options: ["To earn money", "For university application", "Because of friends", "For fun"], answer: 1 },
      { question: "What was the writer's main job?", options: ["Teaching children", "Cleaning the center", "Helping elderly people", "Organizing events"], answer: 2 },
      { question: "What did the writer help organize at the center?", options: ["A garden", "A small library", "A music group", "A sports club"], answer: 1 },
      { question: "How did volunteering change the writer?", options: ["They earned more money", "They became more grateful and purposeful", "They became famous", "They found a new job"], answer: 1 },
    ],
  },
  // ─── B2 (AI, climate change, space exploration, cultural differences) ───
  {
    id: "b2-3", title: "Artificial Intelligence in Daily Life", level: "B2", wordCount: 168,
    description: "How AI is transforming everyday activities and the questions it raises.",
    text: "Artificial intelligence has moved beyond the realm of science fiction and is now embedded in many aspects of our daily lives. From voice assistants on our phones to personalized recommendations on streaming platforms, AI algorithms are constantly working behind the scenes to shape our experiences. In healthcare, AI systems can analyze medical images with remarkable accuracy, sometimes detecting diseases earlier than human doctors. In transportation, self-driving vehicles are being tested in cities around the world, promising to reduce accidents caused by human error. However, the rapid advancement of AI technology raises important ethical questions. One major concern is the potential displacement of workers as machines become capable of performing tasks that were previously done by humans. Another issue is algorithmic bias, where AI systems may make unfair decisions because they were trained on biased datasets. Furthermore, questions about privacy arise when AI systems collect and analyze vast amounts of personal data. As AI continues to evolve, society must engage in thoughtful discussions about how to harness its benefits while addressing its risks and ensuring that its development serves the common good.",
    questions: [
      { question: "What is one example of AI in healthcare?", options: ["Performing surgery alone", "Analyzing medical images accurately", "Replacing all doctors", "Making medicine"], answer: 1 },
      { question: "What is algorithmic bias?", options: ["AI being too slow", "AI making unfair decisions from biased data", "AI using too much energy", "AI being too expensive"], answer: 1 },
      { question: "What concern exists about self-driving vehicles?", options: ["They are too slow", "They are too expensive", "They promise to reduce human-error accidents", "They use too much fuel"], answer: 2 },
      { question: "What does the author suggest society should do?", options: ["Ban all AI", "Ignore the risks", "Have thoughtful discussions about benefits and risks", "Let companies decide everything"], answer: 2 },
      { question: "What privacy concern does AI raise?", options: ["AI cannot store data", "AI collects and analyzes personal data", "AI shares data openly", "AI deletes all data"], answer: 1 },
    ],
  },
  {
    id: "b2-4", title: "Understanding Climate Change", level: "B2", wordCount: 172,
    description: "The causes and consequences of global climate change.",
    text: "Climate change is widely regarded as one of the most pressing challenges facing humanity in the twenty-first century. The overwhelming majority of climate scientists agree that human activities, particularly the burning of fossil fuels such as coal, oil, and natural gas, are the primary cause of rising global temperatures. These activities release large quantities of carbon dioxide and other greenhouse gases into the atmosphere, trapping heat and causing the planet to warm. The consequences of this warming are already visible across the globe. Arctic glaciers are melting at an unprecedented rate, sea levels are rising, and extreme weather events such as hurricanes, droughts, and floods are becoming more frequent and severe. These changes threaten ecosystems, agriculture, and the livelihoods of millions of people, particularly in developing countries that are least equipped to adapt. Addressing climate change requires a coordinated global effort. Transitioning to renewable energy sources such as solar and wind power, improving energy efficiency, and protecting forests are all essential steps. Individual actions, such as reducing meat consumption and using public transportation, also contribute to the solution. The challenge is enormous, but scientists emphasize that meaningful action taken now can still prevent the worst outcomes.",
    questions: [
      { question: "What is identified as the primary cause of rising temperatures?", options: ["Natural cycles", "Volcanic eruptions", "Burning fossil fuels", "Solar activity"], answer: 2 },
      { question: "What is happening to Arctic glaciers?", options: ["They are growing", "They are melting at an unprecedented rate", "They remain unchanged", "They are moving south"], answer: 1 },
      { question: "Who is most affected by climate change according to the text?", options: ["Wealthy nations", "Developing countries", "Scientists", "Politicians"], answer: 1 },
      { question: "What individual action is mentioned?", options: ["Buying more products", "Driving more", "Reducing meat consumption", "Using more electricity"], answer: 2 },
      { question: "What do scientists say about taking action now?", options: ["It is too late", "It can prevent the worst outcomes", "It will make no difference", "It is unnecessary"], answer: 1 },
    ],
  },
  {
    id: "b2-5", title: "The New Space Race", level: "B2", wordCount: 165,
    description: "Modern space exploration and its implications for the future.",
    text: "Space exploration has entered a new and exciting era. While the original space race of the 1960s was driven by competition between the United States and the Soviet Union, today's efforts involve both government agencies and private companies. Organizations like SpaceX and Blue Origin have dramatically reduced the cost of launching spacecraft, making space more accessible than ever before. One of the most ambitious goals is the colonization of Mars. Several agencies and companies have announced plans to send humans to the red planet within the next two decades. However, the challenges are enormous. Astronauts would face extreme radiation, limited resources, and the psychological effects of being isolated millions of kilometers from Earth. Beyond Mars, scientists are exploring the possibility of mining asteroids for valuable minerals and establishing permanent bases on the Moon. These ventures could provide resources that are becoming scarce on Earth. Critics argue that the vast amounts of money spent on space exploration would be better used to solve problems here on Earth, such as poverty and climate change. Supporters counter that space exploration drives technological innovation that ultimately benefits everyone and that humanity must become a multi-planetary species to ensure its long-term survival.",
    questions: [
      { question: "How does today's space race differ from the 1960s?", options: ["Only governments are involved", "Private companies are now involved", "It is less ambitious", "Fewer countries participate"], answer: 1 },
      { question: "What challenge would Mars astronauts face?", options: ["Too much gravity", "Extreme radiation and isolation", "Too many resources", "Short travel time"], answer: 1 },
      { question: "What do critics of space exploration argue?", options: ["Space is boring", "Money should solve Earth's problems first", "Technology is not advanced enough", "Nobody wants to go to space"], answer: 1 },
      { question: "What is one benefit of asteroid mining?", options: ["Creating new planets", "Providing scarce resources", "Reducing space debris", "Improving weather on Earth"], answer: 1 },
    ],
  },
  {
    id: "b2-6", title: "Navigating Cultural Differences", level: "B2", wordCount: 166,
    description: "How cultural differences affect communication and understanding.",
    text: "In an increasingly interconnected world, the ability to understand and navigate cultural differences has become an essential skill. Culture shapes the way people think, communicate, and behave, often in ways that are invisible to those within it. What is considered polite in one culture may be seen as rude in another. For example, direct eye contact is valued as a sign of confidence in many Western countries, while in some Asian cultures it can be perceived as disrespectful. Similarly, attitudes toward time vary significantly. In some cultures, arriving exactly on time is expected, while in others a more relaxed approach is perfectly acceptable. These differences can lead to misunderstandings in both personal and professional contexts. Stereotypes and generalizations about other cultures often make things worse, as they reduce complex societies to simple, often inaccurate descriptions. Developing cultural competence requires genuine curiosity, active listening, and a willingness to question one's own assumptions. Travel, language learning, and building friendships with people from different backgrounds are all valuable ways to broaden one's perspective. Rather than viewing cultural differences as obstacles, we can see them as opportunities to learn and grow, enriching our own understanding of what it means to be human.",
    questions: [
      { question: "Why can direct eye contact cause misunderstandings?", options: ["It is always rude", "Different cultures interpret it differently", "It is a sign of weakness", "Nobody likes it"], answer: 1 },
      { question: "What makes stereotypes harmful according to the text?", options: ["They are always true", "They reduce complex societies to simple descriptions", "They help understanding", "They are based on research"], answer: 1 },
      { question: "What does developing cultural competence require?", options: ["Speaking many languages", "Genuine curiosity and active listening", "Avoiding other cultures", "Reading textbooks only"], answer: 1 },
      { question: "How does the author suggest we view cultural differences?", options: ["As obstacles to avoid", "As problems to solve", "As opportunities to learn and grow", "As unimportant details"], answer: 2 },
    ],
  },
  // ─── C1 (philosophy of happiness, digital privacy, economic inequality) ───
  {
    id: "c1-2", title: "The Philosophy of Happiness", level: "C1", wordCount: 224,
    description: "Exploring different philosophical perspectives on what constitutes genuine happiness.",
    text: "The pursuit of happiness is a fundamental human drive, yet philosophers have debated its nature for millennia. Ancient Greek philosophers distinguished between hedonic happiness, which derives from pleasure and the avoidance of pain, and eudaimonic happiness, which arises from living a virtuous and meaningful life. Aristotle argued that true happiness, or eudaimonia, could only be achieved through the cultivation of virtue and the realization of one's full potential. This perspective suggests that happiness is not merely a feeling but a way of living. In the modern era, positive psychology has attempted to study happiness scientifically. Researchers have identified several factors that consistently correlate with higher levels of reported wellbeing, including strong social relationships, a sense of purpose, and regular engagement in activities that produce a state of flow. Interestingly, beyond a certain threshold, increases in income contribute relatively little to overall life satisfaction, challenging the widespread assumption that material wealth is the key to happiness. The so-called paradox of choice suggests that having too many options can actually decrease satisfaction, as individuals become overwhelmed by possibilities and plagued by doubt about whether they made the right decision. Contemporary philosophers have also explored the relationship between gratitude and contentment, arguing that the deliberate practice of appreciating what one already has may be more conducive to lasting happiness than the relentless pursuit of more. This notion stands in stark contrast to the consumerist values that dominate much of modern society.",
    questions: [
      { question: "What did Aristotle believe about true happiness?", options: ["It comes from wealth", "It is achieved through virtue and realizing potential", "It is impossible to achieve", "It depends on luck"], answer: 1 },
      { question: "What has positive psychology found about income and happiness?", options: ["More money always means more happiness", "Money has no effect on happiness", "Beyond a threshold, more income adds little to satisfaction", "Poor people are happier"], answer: 2 },
      { question: "What is the 'paradox of choice'?", options: ["Having no choices makes people happy", "Too many options can decrease satisfaction", "People always choose correctly", "Choice is an illusion"], answer: 1 },
      { question: "What does the word 'eudaimonic' refer to in context?", options: ["Pleasure-based happiness", "Happiness from virtue and meaning", "Financial success", "Physical health"], answer: 1 },
      { question: "What do contemporary philosophers say about gratitude?", options: ["It is irrelevant to happiness", "Practicing gratitude may be more effective than pursuing more", "Gratitude is outdated", "Only wealthy people can be grateful"], answer: 1 },
    ],
  },
  {
    id: "c1-3", title: "Digital Privacy in the Modern Age", level: "C1", wordCount: 231,
    description: "An examination of privacy challenges in the era of digital technology.",
    text: "The digital revolution has brought unprecedented convenience to our lives, but it has also created profound challenges to personal privacy. Every time we browse the internet, use a smartphone application, or make an online purchase, we generate data that is collected, stored, and often sold to third parties. This vast accumulation of personal information has given rise to what scholars call surveillance capitalism, a system in which human experience is treated as raw material for commercial extraction and prediction. The implications are far-reaching. Targeted advertising, while seemingly harmless, relies on intimate knowledge of individuals' habits, preferences, and even emotional states. More concerning are cases in which personal data has been used to manipulate public opinion, as demonstrated by several high-profile election interference scandals. Governments, too, have expanded their surveillance capabilities in the name of national security, raising questions about the appropriate balance between safety and individual freedom. Proponents of stronger privacy protections argue that privacy is not merely a preference but a fundamental human right, essential for autonomy, dignity, and the free expression of ideas. They advocate for comprehensive data protection regulations that require informed consent, limit data collection to what is strictly necessary, and impose severe penalties for breaches. Critics counter that excessive regulation stifles innovation and that most people willingly trade privacy for convenience. The debate over digital privacy ultimately reflects deeper tensions between individual rights and collective interests, between technological progress and human values, that societies will continue to grapple with for decades to come.",
    questions: [
      { question: "What is 'surveillance capitalism' as described in the text?", options: ["Government spying on citizens", "A system treating human experience as raw material for commercial extraction", "Companies protecting user data", "A type of cybersecurity"], answer: 1 },
      { question: "What does targeted advertising rely on?", options: ["Random selection", "Intimate knowledge of individuals' habits and preferences", "Government databases", "Public information only"], answer: 1 },
      { question: "What do privacy proponents argue privacy is?", options: ["A luxury", "A preference", "A fundamental human right", "An outdated concept"], answer: 2 },
      { question: "What do critics of strong privacy regulation claim?", options: ["Privacy is not important", "Excessive regulation stifles innovation", "Data collection should increase", "Governments should have all data"], answer: 1 },
      { question: "What deeper tension does the privacy debate reflect?", options: ["Between rich and poor", "Between individual rights and collective interests", "Between old and young", "Between science and religion"], answer: 1 },
    ],
  },
  {
    id: "c1-4", title: "The Roots of Economic Inequality", level: "C1", wordCount: 228,
    description: "An analysis of the causes and consequences of growing economic inequality.",
    text: "Economic inequality has been widening in most developed nations for the past four decades, reversing the trend toward greater equality that characterized much of the twentieth century. The causes of this shift are multifaceted. Globalization and technological change have disproportionately benefited highly skilled workers while reducing opportunities for those in manufacturing and routine service jobs. Tax policies in many countries have become less progressive, reducing the redistributive mechanisms that once helped narrow the gap between rich and poor. Corporate governance structures increasingly prioritize shareholder returns over worker compensation, contributing to the stagnation of wages even as corporate profits reach record levels. The consequences of extreme inequality extend far beyond economics. Research consistently demonstrates that highly unequal societies suffer from higher rates of crime, poorer public health outcomes, lower social mobility, and diminished trust in institutions. The meritocratic narrative, which holds that success is primarily a result of individual talent and effort, becomes increasingly difficult to sustain when access to quality education, healthcare, and professional networks is so heavily determined by the circumstances of one's birth. Proposed solutions range across the political spectrum. Some advocate for higher taxes on wealth and capital gains, stronger labor unions, and universal basic income programs. Others argue that reducing barriers to entrepreneurship and improving educational access will enable more people to participate in economic growth. What is increasingly clear is that the status quo is unsustainable and that failure to address inequality risks undermining the social cohesion and democratic institutions upon which stable societies depend.",
    questions: [
      { question: "For how long has inequality been widening in most developed nations?", options: ["One decade", "Two decades", "Four decades", "A century"], answer: 2 },
      { question: "What has happened to wages according to the text?", options: ["They have risen sharply", "They have stagnated while profits rose", "They have disappeared", "They have matched inflation perfectly"], answer: 1 },
      { question: "What does the text say about the meritocratic narrative?", options: ["It is completely true", "It is easy to sustain", "It becomes harder to sustain when birth circumstances determine access", "It has been officially disproven"], answer: 2 },
      { question: "What is one proposed solution mentioned?", options: ["Eliminating all taxes", "Higher taxes on wealth and capital gains", "Reducing education spending", "Closing all borders"], answer: 1 },
      { question: "What risk does the author identify if inequality is not addressed?", options: ["Overpopulation", "Undermining social cohesion and democracy", "Technological regression", "Environmental collapse"], answer: 1 },
    ],
  },
  // ─── C2 (consciousness, linguistic relativity) ───
  {
    id: "c2-1", title: "The Hard Problem of Consciousness", level: "C2", wordCount: 261,
    description: "An exploration of the philosophical puzzle of subjective conscious experience.",
    text: "Among the most intractable problems in philosophy and cognitive science is what David Chalmers famously termed the 'hard problem of consciousness': the question of why and how physical processes in the brain give rise to subjective experience. While neuroscience has made remarkable progress in identifying neural correlates of consciousness — the specific brain activities associated with particular mental states — this empirical success has done little to resolve the deeper conceptual puzzle. We can map which neurons fire when a person sees the color red, but this tells us nothing about why there is something it is like to experience redness, the ineffable qualitative character that philosophers call qualia. The hard problem exposes a fundamental explanatory gap between objective, third-person descriptions of brain processes and the first-person reality of lived experience. Materialist philosophers contend that consciousness will ultimately be explained in purely physical terms, perhaps through a more sophisticated understanding of information processing or emergent properties of complex systems. They argue that the apparent mysteriousness of consciousness is an artifact of our current ignorance rather than evidence of a genuinely non-physical phenomenon. Dualists, by contrast, maintain that subjective experience possesses properties that cannot in principle be reduced to physical descriptions, suggesting that the mental and the physical constitute fundamentally distinct categories of existence. More recently, integrated information theory has proposed that consciousness is a fundamental property of any system that integrates information in a sufficiently complex manner, a view that carries the provocative implication that consciousness may be far more widespread in nature than commonly assumed. Whether the hard problem is genuinely insoluble, as some mysterian philosophers suggest, or merely awaits a conceptual breakthrough analogous to the discovery of DNA's role in heredity, remains one of the deepest open questions in human intellectual inquiry.",
    questions: [
      { question: "What is the 'hard problem of consciousness'?", options: ["How the brain processes language", "Why physical processes give rise to subjective experience", "How to measure intelligence", "Why people dream"], answer: 1 },
      { question: "What are 'qualia' as used in the text?", options: ["Types of neurons", "Scientific measurements", "The qualitative character of subjective experience", "A type of brain scan"], answer: 2 },
      { question: "What do materialist philosophers argue about consciousness?", options: ["It is supernatural", "It will ultimately be explained in physical terms", "It cannot be studied", "It does not exist"], answer: 1 },
      { question: "What does integrated information theory propose?", options: ["Consciousness exists only in humans", "Consciousness is a fundamental property of sufficiently complex information-integrating systems", "Consciousness is an illusion", "Only brains can be conscious"], answer: 1 },
      { question: "What analogy does the text draw for a potential future breakthrough?", options: ["The invention of the telescope", "Einstein's theory of relativity", "The discovery of DNA's role in heredity", "The development of computers"], answer: 2 },
    ],
  },
  {
    id: "c2-2", title: "Linguistic Relativity and Thought", level: "C2", wordCount: 254,
    description: "An examination of the Sapir-Whorf hypothesis and the relationship between language and cognition.",
    text: "The Sapir-Whorf hypothesis, in its strongest formulation, posits that the language one speaks fundamentally determines the way one thinks and perceives the world — a claim known as linguistic determinism. While this radical version has been largely abandoned by contemporary linguists, a more nuanced interpretation, termed linguistic relativity, continues to generate productive research and lively debate. Linguistic relativity holds that language influences, without strictly determining, certain cognitive processes such as categorization, memory, and spatial reasoning. Compelling evidence for this position comes from cross-linguistic studies of color perception. Languages differ dramatically in how they partition the color spectrum: Russian, for instance, distinguishes lexically between light blue and dark blue in a way that English does not. Experimental research has demonstrated that Russian speakers are measurably faster at distinguishing between shades that fall on different sides of this linguistic boundary, suggesting that lexical categories genuinely shape perceptual discrimination. Similar findings have emerged in the domain of spatial cognition. Some Aboriginal Australian languages lack egocentric spatial terms such as 'left' and 'right,' instead employing absolute cardinal directions for all spatial descriptions. Speakers of these languages maintain an extraordinary awareness of their orientation relative to compass points, a cognitive feat that speakers of egocentric languages struggle to replicate. Critics of linguistic relativity note that such effects, while statistically significant, tend to be modest in magnitude and may reflect differences in habitual attention rather than fundamental cognitive architecture. They argue that the universal aspects of human cognition far outweigh the linguistic variations, pointing to the fact that concepts can be expressed across languages even when convenient single-word translations do not exist. The debate illuminates a broader philosophical question about the relationship between symbolic systems and the minds that create and inhabit them.",
    questions: [
      { question: "What does linguistic determinism claim?", options: ["Language has no effect on thought", "Language fundamentally determines how one thinks", "All languages are identical", "Grammar is more important than vocabulary"], answer: 1 },
      { question: "What evidence from Russian supports linguistic relativity?", options: ["Russian has no color words", "Russian speakers distinguish light and dark blue faster due to lexical categories", "Russian speakers cannot see blue", "Russian has more vowels than English"], answer: 1 },
      { question: "What is notable about spatial terms in some Aboriginal Australian languages?", options: ["They have many words for 'left'", "They use absolute cardinal directions instead of 'left' and 'right'", "They have no spatial terms at all", "They use only body-based references"], answer: 1 },
      { question: "What do critics of linguistic relativity argue?", options: ["Language completely determines thought", "The effects are modest and may reflect habitual attention differences", "Color perception is universal", "No research supports the hypothesis"], answer: 1 },
      { question: "What broader question does the linguistic relativity debate illuminate?", options: ["Whether animals have language", "The relationship between symbolic systems and the minds that create them", "Whether translation is possible", "How children learn grammar"], answer: 1 },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Screens                                                           */
/* ------------------------------------------------------------------ */

type Screen = "list" | "reading" | "quiz" | "result";

export function ReadingPage({ student, onBackHome }: Props) {
  const [level, setLevel] = useState<CEFRLevel>(() => {
    const map: Record<string, CEFRLevel> = { a1: "A1", a2: "A2", b1: "B1", b2: "B2", c1: "C1" };
    return map[student.level] ?? "A1";
  });
  const [screen, setScreen] = useState<Screen>("list");
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [tappedWord, setTappedWord] = useState<string | null>(null);
  const [popupPos, setPopupPos] = useState<{ x: number; y: number } | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [apiMeaning, setApiMeaning] = useState<{ vi: string; phonetic?: string } | null>(null);
  const [apiLoading, setApiLoading] = useState(false);

  const tapWord = useCallback((word: string, e: React.MouseEvent) => {
    if (tappedWord === word) { setTappedWord(null); setPopupPos(null); return; }
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    // Luôn hiện ngay dưới từ, căn giữa, clamp trong màn hình
    const x = Math.min(Math.max(rect.left + rect.width / 2, 132), window.innerWidth - 132);
    const y = rect.bottom + 8;
    setPopupPos({ x, y });
    setTappedWord(word);
  }, [tappedWord]);

  // Auto-lookup — 4 fallback chains, KHÔNG BAO GIỜ trả "không tìm thấy"
  useEffect(() => {
    if (!tappedWord || MINI_DICT[tappedWord]) { setApiMeaning(null); setApiLoading(false); return; }
    let cancelled = false;
    setApiLoading(true); setApiMeaning(null);

    (async () => {
      // 1. Vocab DB (4220 từ, nhanh nhất)
      try {
        const r = await fetch(`/api/word-meaning?word=${encodeURIComponent(tappedWord)}`);
        if (r.ok) { const d = await r.json(); if (!cancelled && d.meaning_vi) { setApiMeaning({ vi: d.meaning_vi, phonetic: d.phonetic }); setApiLoading(false); return; } }
      } catch { /* tiếp */ }

      // 2. Word-detail cache (DeepSeek đã tra trước đó)
      try {
        const r = await fetch(`/api/word-detail?word=${encodeURIComponent(tappedWord)}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("eb_token") || ""}` }
        });
        if (r.ok) { const d = await r.json(); if (!cancelled && d.vi?.length) { setApiMeaning({ vi: d.vi.join("; ") }); setApiLoading(false); return; } }
      } catch { /* tiếp */ }

      // 3. Free Dictionary API (tiếng Anh → dịch định nghĩa)
      try {
        const r = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(tappedWord)}`);
        if (r.ok) {
          const entries = await r.json();
          const def = entries?.[0]?.meanings?.[0]?.definitions?.[0]?.definition;
          const phonetic = entries?.[0]?.phonetic;
          if (!cancelled && def) { setApiMeaning({ vi: def, phonetic: phonetic || undefined }); setApiLoading(false); return; }
        }
      } catch { /* tiếp */ }

      // 4. Google Translate fallback
      try {
        const r = await fetch(`/api/translate`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("eb_token") || ""}` },
          body: JSON.stringify({ text: tappedWord, targetLang: "vi" }),
        });
        if (r.ok) { const d = await r.json(); if (!cancelled && d.translation) { setApiMeaning({ vi: d.translation }); setApiLoading(false); return; } }
      } catch { /* cuối */ }

      if (!cancelled) { setApiMeaning({ vi: tappedWord }); setApiLoading(false); }
    })();

    return () => { cancelled = true; };
  }, [tappedWord]);

  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const filtered = useMemo(() => STORIES.filter((s) => s.level === level), [level]);

  const score = useMemo(() => {
    if (!activeStory) return 0;
    return answers.reduce<number>((acc, a, i) => acc + (a === activeStory.questions[i].answer ? 1 : 0), 0);
  }, [answers, activeStory]);

  /* helpers */
  function openStory(s: Story) {
    setActiveStory(s);
    setScreen("reading");
    setTappedWord(null);
    setAnswers(s.questions.map(() => null));
    setSubmitted(false);
  }

  function goToQuiz() { setScreen("quiz"); setTappedWord(null); }

  function selectAnswer(qi: number, oi: number) {
    if (submitted) return;
    setAnswers((prev) => prev.map((a, i) => (i === qi ? oi : a)));
  }

  function submitQuiz() { setSubmitted(true); setScreen("result"); }

  function backToList() { setScreen("list"); setActiveStory(null); setTappedWord(null); }

  /* ─── Story List ─── */
  if (screen === "list") {
    return (
      <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
        <SessionHeader title="Đọc hiểu" onClose={onBackHome} icon={<BookOpen className="h-4 w-4" />} iconBg="bg-green-500" />

        {/* Level filter */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {LEVELS.map((l) => (
            <button key={l} type="button" onClick={() => setLevel(l)}
              className={cn("rounded-full px-3 py-1.5 text-xs font-extrabold transition-all active:scale-95",
                level === l ? "bg-primary text-white shadow-sm" : "bg-muted text-muted-foreground")}>
              {l}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((s) => (
            <Card key={s.id} className="cursor-pointer transition-all hover:shadow-md active:scale-[0.98]"
              onClick={() => openStory(s)}>
              <CardContent className="flex items-start gap-3 p-4">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600">
                  <BookOpen className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm font-extrabold">{s.title}</h3>
                    <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-extrabold text-primary">{s.level}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{s.description}</p>
                  <p className="mt-1 text-[10px] font-bold text-muted-foreground">{s.wordCount} từ · {s.questions.length} câu hỏi</p>
                </div>
              </CardContent>
            </Card>
          ))}

          {filtered.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground">Chưa có bài đọc cho trình độ {level}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <p className="mt-4 text-center text-xs font-bold text-muted-foreground">
          {student.name}
        </p>
      </main>
    );
  }

  /* guard: activeStory must exist for other screens */
  if (!activeStory) return null;

  /* ─── Reading Screen ─── */
  if (screen === "reading") {
    const words = activeStory.text.split(/(\s+|(?=[.,!?;:])|(?<=[.,!?;:]))/);

    return (
      <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
        <SessionHeader title={activeStory.title} onClose={backToList}
          right={<span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-extrabold text-primary">{activeStory.level}</span>} />

        <Card>
          <CardContent className="px-5 py-6">
            <p className="font-reading text-[15px] leading-[2] text-justify tracking-wide">
              {words.map((w, i) => {
                const clean = w.toLowerCase().replace(/[^a-z]/g, "");
                const meaning = clean ? MINI_DICT[clean] : undefined;
                const pos = clean ? WORD_POS[clean] : undefined;
                if (!clean) return <span key={i}>{w}</span>;
                const isActive = tappedWord === clean;
                return (
                  <span key={i}
                    onClick={(e) => tapWord(clean, e)}
                    className={cn(
                      "cursor-pointer rounded-sm px-0.5 transition-all",
                      meaning ? "underline decoration-dotted decoration-1 underline-offset-4" : "",
                      "hover:bg-primary/10",
                      isActive ? "bg-primary/20 font-bold rounded-md px-1 py-0.5" : "",
                      isActive && pos ? POS_COLOR[pos] : pos ? cn(POS_COLOR[pos], "decoration-current") : "",
                    )}>
                    {w}
                  </span>
                );
              })}
            </p>
          </CardContent>
        </Card>

        {/* POS legend */}
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {(["n", "v", "adj", "adv"] as POS[]).map((p) => (
            <span key={p} className={cn("text-[9px] font-bold", POS_COLOR[p])}>● {POS_LABEL[p]}</span>
          ))}
        </div>

        {/* Tooltip popup — hiện ngay cạnh từ */}
        {tappedWord && popupPos && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => { setTappedWord(null); setPopupPos(null); }} />
            <div ref={popupRef}
              className="fixed z-50 w-64 rounded-2xl border border-border bg-card px-4 py-3 shadow-xl animate-pop"
              style={{ left: popupPos.x, top: popupPos.y, transform: "translateX(-50%)" }}>
              {/* Arrow trên */}
              <div className="absolute left-1/2 -top-[5px] -translate-x-1/2 h-2.5 w-2.5 rotate-45 border-l border-t border-border bg-card" />

              <div className="flex items-center gap-2 mb-1">
                <span className={cn("text-base font-black", WORD_POS[tappedWord] ? POS_COLOR[WORD_POS[tappedWord]] : "text-primary")}>{tappedWord}</span>
                <button type="button" onClick={() => speakText(tappedWord)} className="rounded-full bg-muted p-1 hover:bg-primary/10 transition-colors">
                  <Volume2 className="h-3 w-3 text-muted-foreground" />
                </button>
                {WORD_POS[tappedWord] && <span className="rounded-full bg-muted px-1.5 py-0.5 text-[8px] font-bold text-muted-foreground">{POS_LABEL[WORD_POS[tappedWord]]}</span>}
                {apiMeaning?.phonetic && <span className="text-[9px] text-muted-foreground">{apiMeaning.phonetic}</span>}
              </div>
              {MINI_DICT[tappedWord] ? (
                <p className="text-sm font-bold text-primary">{MINI_DICT[tappedWord]}</p>
              ) : apiLoading ? (
                <div className="flex items-center gap-1.5"><Loader2 className="h-3.5 w-3.5 animate-spin text-primary" /><span className="text-[11px] text-muted-foreground">Đang tra...</span></div>
              ) : apiMeaning?.vi ? (
                <p className="text-sm font-bold text-primary">{apiMeaning.vi}</p>
              ) : null}
            </div>
          </>
        )}

        <div className="mt-4 flex justify-center">
          <Button onClick={goToQuiz} size="lg" className="w-full">
            Trả lời câu hỏi
          </Button>
        </div>
      </main>
    );
  }

  /* ─── Quiz Screen ─── */
  if (screen === "quiz") {
    const allAnswered = answers.every((a) => a !== null);

    return (
      <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
        <SessionHeader title={`${activeStory.title} — Câu hỏi`} onClose={backToList}
          progress={Math.round((answers.filter((a) => a !== null).length / answers.length) * 100)} />

        <div className="space-y-4">
          {activeStory.questions.map((q, qi) => (
            <Card key={qi}>
              <CardContent className="p-4">
                <p className="mb-3 text-sm font-extrabold">{qi + 1}. {q.question}</p>
                <div className="space-y-2">
                  {q.options.map((opt, oi) => (
                    <button key={oi} type="button"
                      onClick={() => selectAnswer(qi, oi)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left text-sm font-bold transition-all active:scale-[0.98]",
                        answers[qi] === oi
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card hover:border-primary/40",
                      )}>
                      <span className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-extrabold",
                        answers[qi] === oi ? "bg-primary text-white" : "bg-muted text-muted-foreground",
                      )}>
                        {String.fromCharCode(65 + oi)}
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <Button variant="outline" onClick={() => setScreen("reading")} className="gap-1.5">
            <ArrowLeft className="h-4 w-4" /> Đọc lại
          </Button>
          <Button onClick={submitQuiz} disabled={!allAnswered} className="flex-1">
            Nộp bài
          </Button>
        </div>
      </main>
    );
  }

  /* ─── Result Screen ─── */
  const total = activeStory.questions.length;
  const pct = Math.round((score / total) * 100);

  return (
    <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
      <SessionHeader title="Kết quả" onClose={backToList} />

      <Card>
        <CardContent className="p-6 text-center space-y-3">
          <span className={cn(
            "mx-auto flex h-16 w-16 items-center justify-center rounded-2xl",
            pct >= 75 ? "bg-green-100 text-green-600" : pct >= 50 ? "bg-yellow-100 text-yellow-600" : "bg-red-100 text-red-600",
          )}>
            {pct >= 75 ? <CheckCircle className="h-8 w-8" /> : <BookOpen className="h-8 w-8" />}
          </span>
          <h2 className="text-2xl font-black">{score}/{total}</h2>
          <p className="text-sm font-bold text-muted-foreground">
            {pct >= 75 ? "Xuất sắc! Bạn hiểu bài rất tốt!" : pct >= 50 ? "Khá tốt! Hãy cố gắng hơn nhé!" : "Hãy đọc lại bài và thử lại nhé!"}
          </p>
        </CardContent>
      </Card>

      {/* Review answers */}
      <div className="mt-4 space-y-3">
        {activeStory.questions.map((q, qi) => {
          const correct = answers[qi] === q.answer;
          return (
            <Card key={qi} className={cn("border-2", correct ? "border-green-200" : "border-red-200")}>
              <CardContent className="p-4">
                <div className="mb-2 flex items-start gap-2">
                  {correct
                    ? <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    : <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />}
                  <p className="text-sm font-extrabold">{qi + 1}. {q.question}</p>
                </div>
                {!correct && (
                  <p className="ml-6 text-xs text-muted-foreground">
                    Đáp án đúng: <span className="font-bold text-green-600">{q.options[q.answer]}</span>
                  </p>
                )}
                {!correct && answers[qi] !== null && (
                  <p className="ml-6 text-xs text-red-500">
                    Bạn chọn: {q.options[answers[qi]!]}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="outline" onClick={() => openStory(activeStory)} className="flex-1">
          Đọc lại
        </Button>
        <Button onClick={backToList} className="flex-1">
          Bài khác
        </Button>
      </div>

      <p className="mt-4 text-center text-xs font-bold text-muted-foreground">
        {student.name}
      </p>
    </main>
  );
}
