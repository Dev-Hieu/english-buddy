import { BookOpen, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useState, useMemo } from "react";
import type { Student } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/cn";

interface Props { student: Student; onBackHome: () => void; }

type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1";

const LEVELS: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1"];

/* ------------------------------------------------------------------ */
/*  Mini dictionary for word tap                                      */
/* ------------------------------------------------------------------ */
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
      <main className="mx-auto w-full max-w-md overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
        <SessionHeader title="Đọc hiểu" onClose={onBackHome} />

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
      <main className="mx-auto w-full max-w-md overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
        <SessionHeader title={activeStory.title} onClose={backToList}
          right={<span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-extrabold text-primary">{activeStory.level}</span>} />

        <Card>
          <CardContent className="p-5">
            <p className="text-base leading-relaxed">
              {words.map((w, i) => {
                const clean = w.toLowerCase().replace(/[^a-z]/g, "");
                const meaning = clean ? MINI_DICT[clean] : undefined;
                if (!clean) return <span key={i}>{w}</span>;
                return (
                  <span key={i}
                    onClick={() => setTappedWord(meaning ? clean : null)}
                    className={cn(
                      "cursor-pointer rounded px-0.5 transition-colors",
                      meaning ? "hover:bg-primary/10" : "",
                      tappedWord === clean ? "bg-primary/20 text-primary font-bold" : "",
                    )}>
                    {w}
                  </span>
                );
              })}
            </p>
          </CardContent>
        </Card>

        {/* Word meaning popup */}
        {tappedWord && MINI_DICT[tappedWord] && (
          <div className="mt-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-center">
            <span className="text-sm font-extrabold text-primary">{tappedWord}</span>
            <span className="mx-2 text-muted-foreground">→</span>
            <span className="text-sm font-bold">{MINI_DICT[tappedWord]}</span>
          </div>
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
      <main className="mx-auto w-full max-w-md overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
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
    <main className="mx-auto w-full max-w-md overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
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
