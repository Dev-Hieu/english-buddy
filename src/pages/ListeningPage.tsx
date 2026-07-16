import { CheckCircle2, Ear, Headphones, Image, MessageSquare, Play, RotateCcw, Volume2, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Student, VocabularyWord } from "@/types";
import type { Level } from "@/types/student";
import { LEVEL_LABELS, LEVEL_ORDER } from "@/types/student";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import { speakText } from "@/services/speechService";
import { matchesLevel } from "@/utils/levelFilter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { cn } from "@/components/ui/cn";

interface Props { student: Student; onBackHome: () => void; }

type Mode = "word-image" | "sentence" | "stories";

const MODES: { key: Mode; icon: typeof Ear; label: string; desc: string; color: string }[] = [
  { key: "word-image", icon: Image, label: "Nghe từ chọn ảnh", desc: "Nghe phát âm → chọn hình đúng", color: "bg-blue-100 text-blue-600" },
  { key: "sentence", icon: MessageSquare, label: "Nghe câu chọn đáp án", desc: "Nghe câu → chọn câu trả lời đúng", color: "bg-green-100 text-green-600" },
  { key: "stories", icon: Headphones, label: "Nghe hiểu câu chuyện", desc: "Nghe audio stories → trả lời câu hỏi", color: "bg-purple-100 text-purple-600" },
];

const ROUND_SIZE = 10;

function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

function pickN(pool: VocabularyWord[], n: number): VocabularyWord[] {
  return shuffle(pool).slice(0, n);
}

// ── Listening stories data ──
interface StoryQuestion { question: string; options: string[]; answer: number; }

interface StoryItem {
  id: string;
  title: string;
  titleVi: string;
  level: Level;
  text: string;
  questions: StoryQuestion[];
}

const LISTENING_STORIES: StoryItem[] = [
  // ─── A1 ─── (20-40 words, very simple sentences, common nouns/verbs)
  {
    id: "ls1", title: "My Morning", titleVi: "Buổi sáng của tôi", level: "a1",
    text: "I wake up at seven. I brush my teeth. Then I eat bread and drink milk. I walk to school. I like my morning.",
    questions: [
      { question: "What time does the speaker wake up?", options: ["Six", "Seven", "Eight", "Nine"], answer: 1 },
      { question: "What does the speaker eat?", options: ["Rice", "Bread", "Eggs", "Fruit"], answer: 1 },
      { question: "How does the speaker go to school?", options: ["By bus", "By car", "Walking", "By bike"], answer: 2 },
    ],
  },
  {
    id: "ls2", title: "My Dog Max", titleVi: "Con chó Max", level: "a1",
    text: "I have a dog. His name's Max. He's small and brown. He likes to run in the park. I play with him every day. Max is my best friend.",
    questions: [
      { question: "What's the dog's name?", options: ["Buddy", "Rex", "Max", "Sam"], answer: 2 },
      { question: "What color is the dog?", options: ["White", "Black", "Brown", "Gray"], answer: 2 },
      { question: "Where does the dog like to run?", options: ["In the house", "In the park", "At school", "In the garden"], answer: 1 },
    ],
  },
  {
    id: "ls3", title: "My Family", titleVi: "Gia đình tôi", level: "a1",
    text: "There are four people in my family. My dad's a teacher. My mom works at a hospital. I have one sister. She's five years old. I love my family.",
    questions: [
      { question: "How many people are in the family?", options: ["Three", "Four", "Five", "Six"], answer: 1 },
      { question: "What does the dad do?", options: ["He's a doctor", "He's a teacher", "He's a cook", "He's a driver"], answer: 1 },
      { question: "How old is the sister?", options: ["Three", "Four", "Five", "Six"], answer: 2 },
    ],
  },
  // ─── A2 ─── (40-70 words, simple past/present, daily life, short dialogues)
  {
    id: "ls4", title: "A Day at the Beach", titleVi: "Một ngày ở biển", level: "a2",
    text: "Last Sunday my family went to the beach. It was sunny and warm. We swam in the sea and built a sandcastle. My sister found some pretty shells. We ate sandwiches and drank juice for lunch. Then we played volleyball. It was a wonderful day.",
    questions: [
      { question: "When did they go to the beach?", options: ["Saturday", "Sunday", "Monday", "Friday"], answer: 1 },
      { question: "What did the sister find?", options: ["Stones", "Fish", "Shells", "Flowers"], answer: 2 },
      { question: "What did they eat for lunch?", options: ["Pizza", "Rice", "Sandwiches", "Burgers"], answer: 2 },
      { question: "What sport did they play?", options: ["Football", "Tennis", "Basketball", "Volleyball"], answer: 3 },
    ],
  },
  {
    id: "ls5", title: "Shopping with Mom", titleVi: "Đi mua sắm với mẹ", level: "a2",
    text: "On Saturday I went shopping with my mom. We drove to the supermarket. We bought vegetables, fruit, and some chicken. Mom also got a new book for me. I was really happy. Then we stopped at a cafe and had hot chocolate. It was a nice afternoon.",
    questions: [
      { question: "When did they go shopping?", options: ["Monday", "Friday", "Saturday", "Sunday"], answer: 2 },
      { question: "What did Mom buy for the child?", options: ["A toy", "A book", "Clothes", "A phone"], answer: 1 },
      { question: "Where did they stop after shopping?", options: ["A park", "A restaurant", "A cafe", "A library"], answer: 2 },
    ],
  },
  {
    id: "ls6", title: "My Hobby", titleVi: "Sở thích của tôi", level: "a2",
    text: "I really like drawing. Every evening after homework I sit at my desk and draw. I mostly draw animals and flowers. My favorite thing to draw is cats. Last month I won a drawing competition at school. I want to be an artist when I grow up.",
    questions: [
      { question: "What's the speaker's hobby?", options: ["Singing", "Drawing", "Dancing", "Reading"], answer: 1 },
      { question: "What does the speaker like to draw most?", options: ["Dogs", "Trees", "Cats", "Houses"], answer: 2 },
      { question: "What happened last month?", options: ["Started a new class", "Won a competition", "Got a new pet", "Had a birthday"], answer: 1 },
      { question: "What does the speaker want to be?", options: ["A teacher", "A doctor", "An artist", "A singer"], answer: 2 },
    ],
  },
  // ─── B1 ─── (70-120 words, varied tenses, social/work topics, opinions)
  {
    id: "ls7", title: "The New Neighbor", titleVi: "Người hàng xóm mới", level: "b1",
    text: "Last week a new family moved into the house next to ours. They've got two kids, a boy and a girl. The boy's about my age, so we started talking. His name's David and he's from Canada. He told me he misses his old friends. I felt bad for him, so I invited him to play football with my group. He said yes right away. We've been hanging out every day since then. I think we'll be good friends.",
    questions: [
      { question: "Where did the new family move to?", options: ["Across the street", "Next door", "Another city", "A nearby apartment"], answer: 1 },
      { question: "Where's David from?", options: ["Australia", "England", "Canada", "America"], answer: 2 },
      { question: "Why did the speaker invite David to play?", options: ["David asked him", "He felt bad for David", "Their parents told them to", "They were in the same class"], answer: 1 },
      { question: "How many children does the new family have?", options: ["One", "Two", "Three", "Four"], answer: 1 },
    ],
  },
  {
    id: "ls8", title: "A Cooking Lesson", titleVi: "Bài học nấu ăn", level: "b1",
    text: "Yesterday my grandmother taught me how to make chicken soup. First we washed the vegetables and cut them into small pieces. Then we boiled water in a big pot and put the chicken in. After about thirty minutes we added the vegetables and a bit of salt. The kitchen smelled amazing. When it was ready the whole family sat down to eat together. Everyone said the soup was delicious, and my grandmother smiled at me. I felt really proud of myself. I can't wait to cook again next weekend.",
    questions: [
      { question: "Who taught the speaker to cook?", options: ["Mother", "Father", "Grandmother", "A teacher"], answer: 2 },
      { question: "What did they cook?", options: ["Fried rice", "Chicken soup", "Pasta", "Fish"], answer: 1 },
      { question: "How long did they cook the chicken?", options: ["Ten minutes", "Twenty minutes", "Thirty minutes", "One hour"], answer: 2 },
      { question: "How did the speaker feel at the end?", options: ["Tired", "Sad", "Proud", "Bored"], answer: 2 },
    ],
  },
  {
    id: "ls9", title: "A Trip to the Mountains", titleVi: "Chuyến đi lên núi", level: "b1",
    text: "During the summer holiday my family took a trip to the mountains. We stayed at a small hotel near a lake. Every morning we'd go hiking on different trails. The views were incredible. One day we saw wild deer near the river. My dad took lots of photos. In the evenings we'd sit around a campfire and tell stories. The trip lasted five days, but it gave me memories I'll never forget.",
    questions: [
      { question: "Where did the family stay?", options: ["A tent", "A friend's house", "A small hotel", "A cabin"], answer: 2 },
      { question: "What did they do every morning?", options: ["Swimming", "Hiking", "Fishing", "Cycling"], answer: 1 },
      { question: "What animals did they see?", options: ["Bears", "Rabbits", "Deer", "Eagles"], answer: 2 },
      { question: "How long was the trip?", options: ["Three days", "Five days", "One week", "Two weeks"], answer: 1 },
    ],
  },
  // ─── B2 ─── (120-180 words, complex ideas, abstract topics, natural speech)
  {
    id: "ls10", title: "Working from Home", titleVi: "Làm việc tại nhà", level: "b2",
    text: "Since the pandemic many companies have let their employees work from home, and it's changed how people think about daily life. Some workers love the flexibility because they don't have to commute anymore. They can spend that extra time with their families or on hobbies. But it's not all positive. Many people find it hard to switch off when their office is also their living room. They end up working longer hours without realizing it. There's also the social side. Working alone all day can feel isolating, and some people miss chatting with colleagues. Experts say the key is to set up a proper workspace and stick to a fixed schedule. That way you've got a clear line between work and personal time.",
    questions: [
      { question: "What's one benefit of working from home?", options: ["Higher salary", "No commuting", "More meetings", "Better equipment"], answer: 1 },
      { question: "What problem do some workers have?", options: ["No internet", "Difficulty stopping work", "Too many breaks", "Not enough work"], answer: 1 },
      { question: "Why do some people feel isolated?", options: ["They don't have phones", "They work alone all day", "They live far away", "They don't like their job"], answer: 1 },
      { question: "What do experts recommend?", options: ["Work at a cafe", "Set up a proper workspace and fixed schedule", "Work only part-time", "Change jobs"], answer: 1 },
    ],
  },
  {
    id: "ls11", title: "Protecting the Ocean", titleVi: "Bảo vệ đại dương", level: "b2",
    text: "The ocean covers more than seventy percent of our planet and it's home to millions of species. But we're doing a lot of damage to it. Plastic pollution is the biggest problem right now. Scientists think about eight million tons of plastic end up in the ocean every year. Sea animals like turtles often mistake plastic for food, which can kill them. Overfishing is another serious issue because it's disrupting the balance of marine life. The good news is that many countries have banned single use plastics and created protected ocean areas. But governments can't do it alone. We all need to do our part by using less plastic and recycling properly. Small changes in our daily habits can make a real difference.",
    questions: [
      { question: "How much of the Earth's surface does the ocean cover?", options: ["Fifty percent", "Sixty percent", "More than seventy percent", "Eighty percent"], answer: 2 },
      { question: "How much plastic enters the ocean each year?", options: ["One million tons", "Five million tons", "About eight million tons", "Ten million tons"], answer: 2 },
      { question: "Why does plastic harm sea animals?", options: ["It's too heavy", "They mistake it for food", "It's too hot", "It blocks sunlight"], answer: 1 },
      { question: "What's the speaker's main message?", options: ["Stop eating fish", "Only governments can help", "Everyone needs to do their part", "The ocean is too damaged to save"], answer: 2 },
    ],
  },
  {
    id: "ls12", title: "The Future of Education", titleVi: "Tương lai của giáo dục", level: "b2",
    text: "Over the past few years technology has transformed how we learn. Online courses and video lessons have made education accessible to people who couldn't attend traditional schools. You can now learn almost anything from coding to cooking just by watching videos on your phone. But there's a debate about whether this is better than classroom learning. Some educators argue that students need face to face interaction to develop social skills. Others believe online learning gives students more freedom to study at their own pace. Personally I think the best approach is a mix of both. Students can watch lectures online and come to class for discussions. This way they get the convenience of technology without losing the human connection. Education will keep evolving, and we need to be ready to adapt.",
    questions: [
      { question: "What has technology done to education?", options: ["Made it more expensive", "Transformed how we learn", "Replaced all teachers", "Made it less popular"], answer: 1 },
      { question: "What do some educators worry about?", options: ["Too many students", "Students losing social skills", "Technology being too expensive", "Not enough online courses"], answer: 1 },
      { question: "What approach does the speaker prefer?", options: ["Only online learning", "Only classroom learning", "A mix of both", "No technology at all"], answer: 2 },
      { question: "What does the speaker say about the future?", options: ["Nothing will change", "Education will keep evolving", "Schools will close", "Online learning will disappear"], answer: 1 },
    ],
  },
  // ─── A1 (more) ───
  {
    id: "ls13", title: "At the Zoo", titleVi: "Ở sở thú", level: "a1",
    text: "Today I'm at the zoo with my class. I can see elephants, lions, and monkeys. The monkeys are funny. They jump and eat bananas. My favorite animal's the giraffe. It's so tall!",
    questions: [
      { question: "Who's at the zoo with the speaker?", options: ["Family", "Friends", "Class", "Teacher only"], answer: 2 },
      { question: "What do the monkeys do?", options: ["Sleep", "Jump and eat bananas", "Swim", "Fight"], answer: 1 },
      { question: "What's the speaker's favorite animal?", options: ["Elephant", "Lion", "Monkey", "Giraffe"], answer: 3 },
    ],
  },
  {
    id: "ls14", title: "My Toys", titleVi: "Đồ chơi của tôi", level: "a1",
    text: "I have many toys in my room. I have a red car, a teddy bear, and some blocks. My teddy bear's name is Coco. I play with my blocks every day. I build houses and towers.",
    questions: [
      { question: "What's the teddy bear's name?", options: ["Teddy", "Coco", "Bear", "Max"], answer: 1 },
      { question: "What does the speaker build with blocks?", options: ["Animals", "Houses and towers", "Cars", "Robots"], answer: 1 },
      { question: "What toys does the speaker have?", options: ["A ball and a doll", "A car, a teddy bear, and blocks", "A bike and a kite", "A puzzle and a train"], answer: 1 },
    ],
  },
  {
    id: "ls15", title: "Lunchtime", titleVi: "Giờ ăn trưa", level: "a1",
    text: "It's twelve o'clock. It's lunchtime! I eat rice and chicken today. I also have some soup. My friend Tom eats noodles. We sit together. After lunch we play in the yard.",
    questions: [
      { question: "What time is it?", options: ["Eleven", "Twelve", "One", "Two"], answer: 1 },
      { question: "What's the speaker eating?", options: ["Noodles", "Pizza", "Rice and chicken", "Sandwiches"], answer: 2 },
      { question: "What does Tom eat?", options: ["Rice", "Soup", "Bread", "Noodles"], answer: 3 },
    ],
  },
  // ─── A2 (more) ───
  {
    id: "ls16", title: "Visiting Grandparents", titleVi: "Thăm ông bà", level: "a2",
    text: "Last weekend my family drove to my grandparents' house in the countryside. It took about two hours. Grandma made us a big lunch. After eating we walked near the river. Grandpa showed me how to catch fish but I didn't catch any. In the evening grandma told us old stories.",
    questions: [
      { question: "Where do the grandparents live?", options: ["In the city", "In the countryside", "Near the beach", "In another country"], answer: 1 },
      { question: "How long did the drive take?", options: ["One hour", "About two hours", "Three hours", "Thirty minutes"], answer: 1 },
      { question: "Did the speaker catch any fish?", options: ["Yes, many", "Yes, one", "No", "The story doesn't say"], answer: 2 },
      { question: "What did grandma do in the evening?", options: ["Cooked dinner", "Told old stories", "Watched TV", "Went to bed early"], answer: 1 },
    ],
  },
  {
    id: "ls17", title: "School Sports Day", titleVi: "Ngày hội thể thao", level: "a2",
    text: "Yesterday was sports day at our school. I entered the running race and the long jump. I came second in the running race and got a silver medal. My best friend Lily won the long jump. After the competitions we had ice cream together. It was the best day of the year.",
    questions: [
      { question: "What events did the speaker enter?", options: ["Swimming and running", "Running and long jump", "Football and running", "Long jump and swimming"], answer: 1 },
      { question: "What medal did the speaker get?", options: ["Gold", "Silver", "Bronze", "No medal"], answer: 1 },
      { question: "Who won the long jump?", options: ["The speaker", "The teacher", "Lily", "Tom"], answer: 2 },
      { question: "What did they eat after the competitions?", options: ["Cake", "Pizza", "Ice cream", "Candy"], answer: 2 },
    ],
  },
  {
    id: "ls18", title: "My Birthday Party", titleVi: "Tiệc sinh nhật", level: "a2",
    text: "Last Saturday was my tenth birthday. My parents organized a party at home. Eight friends came to my party. We played games and sang karaoke. Mom made a chocolate cake with ten candles. I blew out all the candles and made a wish. My friends gave me great presents. It was the happiest day.",
    questions: [
      { question: "How old did the speaker turn?", options: ["Eight", "Nine", "Ten", "Eleven"], answer: 2 },
      { question: "Where was the party?", options: ["At school", "At a restaurant", "At a park", "At home"], answer: 3 },
      { question: "What kind of cake did Mom make?", options: ["Vanilla", "Strawberry", "Chocolate", "Lemon"], answer: 2 },
      { question: "How many friends came?", options: ["Six", "Seven", "Eight", "Ten"], answer: 2 },
    ],
  },
  // ─── B1 (more) ───
  {
    id: "ls19", title: "The Job Interview", titleVi: "Buổi phỏng vấn việc làm", level: "b1",
    text: "I had my first job interview yesterday and I was incredibly nervous. I'd applied for a position at a marketing company downtown. I spent the whole morning picking the right outfit and practicing answers in front of the mirror. When I got there the interviewer was a friendly woman named Sarah. She asked me about my experience and why I wanted to work there. I told her I'd done some freelance projects in college and that I'm passionate about creative work. The interview lasted about forty minutes. At the end Sarah smiled and said they'd let me know by Friday. I'm keeping my fingers crossed.",
    questions: [
      { question: "What kind of company was the interview at?", options: ["A tech company", "A marketing company", "A bank", "A hospital"], answer: 1 },
      { question: "How did the speaker prepare?", options: ["Read a book", "Practiced answers in the mirror", "Called a friend", "Did nothing"], answer: 1 },
      { question: "How long did the interview last?", options: ["Twenty minutes", "Thirty minutes", "About forty minutes", "One hour"], answer: 2 },
      { question: "When will they hear back?", options: ["Tomorrow", "Next week", "By Friday", "In a month"], answer: 2 },
    ],
  },
  {
    id: "ls20", title: "Travel Plans", titleVi: "Kế hoạch du lịch", level: "b1",
    text: "My friend and I are planning a trip to Japan next spring. We've been saving money for about six months now. We want to visit Tokyo, Kyoto, and Osaka. I've heard that spring is the best time to go because of the cherry blossoms. We're going to stay in hostels to save money and try as much local food as possible. My friend's really into history, so she wants to visit old temples and castles. I'm more interested in trying street food and shopping. We'll be there for ten days, which should be enough to see a lot. I can't wait to go.",
    questions: [
      { question: "When are they planning to go?", options: ["This summer", "Next winter", "Next spring", "This autumn"], answer: 2 },
      { question: "How long have they been saving money?", options: ["Three months", "About six months", "A year", "Two months"], answer: 1 },
      { question: "What's the friend most interested in?", options: ["Shopping", "Street food", "History", "Nature"], answer: 2 },
      { question: "How long will they stay in Japan?", options: ["One week", "Ten days", "Two weeks", "Three weeks"], answer: 1 },
    ],
  },
  {
    id: "ls21", title: "Environmental Problems", titleVi: "Vấn đề môi trường", level: "b1",
    text: "Our teacher gave us a talk about environmental problems today and it really made me think. She said that air pollution's getting worse in many cities because of cars and factories. She also said that people cut down too many forests, which affects animals and the climate. One thing that surprised me was that small actions like using reusable bags can help. After the talk our class decided to start a recycling project. We're going to put recycling bins in every classroom. I think if everyone does a little bit we can make a big difference.",
    questions: [
      { question: "What causes air pollution according to the teacher?", options: ["Animals", "Cars and factories", "Recycling", "Farming"], answer: 1 },
      { question: "What surprised the speaker?", options: ["How bad things are", "That small actions can help", "That forests are growing", "That pollution is decreasing"], answer: 1 },
      { question: "What did the class decide to do?", options: ["Plant trees", "Start a recycling project", "Write letters", "Stop using electricity"], answer: 1 },
      { question: "Where will they put recycling bins?", options: ["In the cafeteria", "Outside the school", "In every classroom", "In the hallway"], answer: 2 },
    ],
  },
  // ─── B2 (more) ───
  {
    id: "ls22", title: "Artificial Intelligence", titleVi: "Trí tuệ nhân tạo", level: "b2",
    text: "Artificial intelligence has been making headlines lately, and it affects all of us whether we realize it or not. AI's already used in voice assistants, recommendation algorithms, and medical diagnosis. Some people are excited because AI could solve problems humans can't handle alone, like predicting natural disasters or developing new medicines. But others are worried about job losses. If machines can do tasks faster and cheaper, what happens to the people who used to do those jobs? There's also the question of privacy since AI systems often need massive amounts of personal data to function. I think the key is finding a balance. We should embrace the technology but also put regulations in place to make sure it's used responsibly.",
    questions: [
      { question: "Which of these is NOT mentioned as a current use of AI?", options: ["Voice assistants", "Medical diagnosis", "Self-driving planes", "Recommendation algorithms"], answer: 2 },
      { question: "What worry do some people have about AI?", options: ["It's too expensive", "It could cause job losses", "It's too slow", "It uses too much electricity"], answer: 1 },
      { question: "What does AI need to function properly?", options: ["More computers", "Massive amounts of personal data", "Better internet", "More programmers"], answer: 1 },
      { question: "What does the speaker think we should do?", options: ["Ban AI completely", "Use AI without limits", "Embrace it with proper regulations", "Wait and see what happens"], answer: 2 },
    ],
  },
  {
    id: "ls23", title: "Culture Shock", titleVi: "Sốc văn hóa", level: "b2",
    text: "When I first moved abroad for university I experienced what people call culture shock. Everything felt strange. The food was different, and even simple things like greeting someone felt awkward. Back home we'd greet people with a hug, but here everyone just shook hands. I felt really lonely during the first few weeks. I couldn't understand local slang and I'd often misread social situations. But gradually things changed. I joined a student club and met people from all over the world. They were going through the same thing, which made me feel less alone. After about three months I finally started feeling comfortable. Now I can say the experience made me a more open minded and adaptable person.",
    questions: [
      { question: "Why did the speaker move abroad?", options: ["For work", "For university", "For family", "For travel"], answer: 1 },
      { question: "What was different about greetings?", options: ["People didn't greet at all", "People hugged instead of waving", "People shook hands instead of hugging", "People bowed"], answer: 2 },
      { question: "How did the speaker start feeling better?", options: ["Called home every day", "Joined a student club", "Changed universities", "Moved to a different city"], answer: 1 },
      { question: "How long did it take to feel comfortable?", options: ["One week", "One month", "About three months", "A full year"], answer: 2 },
    ],
  },
  {
    id: "ls24", title: "Work-Life Balance", titleVi: "Cân bằng công việc và cuộc sống", level: "b2",
    text: "A lot of people talk about work life balance, but it's one of the hardest things to achieve. When I first started my career I was working twelve hour days and checking emails on weekends. I thought that's what it took to be successful. But after two years I was completely burned out. I couldn't sleep properly and I felt exhausted all the time. That's when I decided to make changes. I started setting strict boundaries. No work emails after seven PM, no laptops on Sundays, and thirty minutes of exercise every day. It wasn't easy at first because I felt guilty about not working. But over time I realized that taking breaks actually made me more productive. My boss even noticed my work improved. The lesson is that taking care of yourself isn't selfish. It's necessary.",
    questions: [
      { question: "How long did the speaker work each day at first?", options: ["Eight hours", "Ten hours", "Twelve hours", "Fourteen hours"], answer: 2 },
      { question: "What happened after two years?", options: ["Got promoted", "Got burned out", "Changed jobs", "Started a business"], answer: 1 },
      { question: "What's one boundary the speaker set?", options: ["No phone calls", "No work emails after 7 PM", "No meetings", "No overtime pay"], answer: 1 },
      { question: "What was the result of taking breaks?", options: ["Got fired", "Nothing changed", "Became more productive", "Lost clients"], answer: 2 },
    ],
  },
  // ─── C1 ───
  {
    id: "ls25", title: "The Globalization Debate", titleVi: "Tranh luận về toàn cầu hóa", level: "c1",
    text: "Globalization's one of the most fiercely debated topics in economics and politics today. Proponents argue that it's lifted millions of people out of poverty by opening up markets and creating jobs in developing countries. They point to nations like South Korea and Vietnam, which have experienced remarkable economic growth largely thanks to international trade. However, critics contend that globalization has widened the gap between rich and poor within countries. While multinational corporations and their shareholders have prospered enormously, many workers in both developed and developing nations have seen their wages stagnate or their jobs disappear altogether. There's also a cultural dimension that's often overlooked. As global brands and Western media dominate, local traditions and languages are being eroded. Some scholars refer to this as cultural homogenization. The reality is that globalization isn't inherently good or bad. Its impact depends entirely on the policies governments put in place to manage it. Without proper regulation and social safety nets the benefits will continue to be unevenly distributed.",
    questions: [
      { question: "What do proponents say globalization has done?", options: ["Increased poverty", "Lifted millions out of poverty", "Destroyed all local businesses", "Had no real impact"], answer: 1 },
      { question: "What's the cultural concern about globalization?", options: ["Too many languages", "Local traditions being eroded", "People traveling too much", "Music becoming too diverse"], answer: 1 },
      { question: "What does the speaker say determines globalization's impact?", options: ["The size of the economy", "Government policies", "The number of corporations", "International agreements alone"], answer: 1 },
      { question: "What term do scholars use for the cultural effect?", options: ["Cultural revolution", "Cultural homogenization", "Cultural exchange", "Cultural diversity"], answer: 1 },
    ],
  },
  {
    id: "ls26", title: "A Scientific Discovery", titleVi: "Một khám phá khoa học", level: "c1",
    text: "Last year a team of researchers at a university in Switzerland made what many consider a groundbreaking discovery in the field of neuroscience. They identified a previously unknown mechanism by which the brain consolidates memories during sleep. It'd long been established that sleep plays a crucial role in memory formation, but the precise biological processes involved remained largely a mystery. What the team found was that during deep sleep specific neurons fire in synchronized patterns that essentially replay the day's experiences at an accelerated rate. This replay strengthens the neural connections associated with important memories while allowing less significant ones to fade. The implications of this research are far reaching. It could lead to new treatments for conditions like Alzheimer's disease and PTSD, where memory processing is severely disrupted. It also raises fascinating questions about the nature of consciousness itself. If our brains are essentially editing and curating our experiences while we sleep, to what extent are our memories truly accurate representations of what actually happened?",
    questions: [
      { question: "Where was the research conducted?", options: ["In the United States", "In Japan", "In Switzerland", "In the United Kingdom"], answer: 2 },
      { question: "What happens during deep sleep according to the discovery?", options: ["The brain shuts down completely", "Neurons replay experiences in synchronized patterns", "New memories are deleted", "The brain stops forming connections"], answer: 1 },
      { question: "Which conditions could benefit from this research?", options: ["Heart disease and diabetes", "Alzheimer's and PTSD", "Asthma and allergies", "Depression and anxiety only"], answer: 1 },
      { question: "What philosophical question does the research raise?", options: ["Why we dream", "Whether memories are truly accurate", "How long we should sleep", "Whether sleep is necessary"], answer: 1 },
    ],
  },
  {
    id: "ls27", title: "Political Systems", titleVi: "Hệ thống chính trị", level: "c1",
    text: "When we compare political systems around the world it becomes clear that there's no one size fits all model for governance. Democracies, for instance, are often held up as the gold standard because they give citizens a voice through elections and protect individual rights. But even within democracies there's enormous variation. The presidential system used in the United States operates very differently from the parliamentary systems found in countries like the UK or Germany. Each has its own strengths and weaknesses. Presidential systems provide a clear separation of powers but can lead to gridlock when the executive and legislature disagree. Parliamentary systems tend to be more flexible but can sometimes result in unstable coalition governments. Then there are hybrid systems that try to combine elements of both. Beyond these democratic models there are also authoritarian regimes that prioritize stability and economic development over individual freedoms. Proponents of such systems argue they can make faster decisions without the inefficiencies of democratic debate. Critics counter that without accountability and transparency these systems inevitably become corrupt and oppressive. Ultimately the effectiveness of any political system depends not just on its structure but on the institutions, culture, and civic engagement that support it.",
    questions: [
      { question: "What's a weakness of presidential systems according to the speaker?", options: ["Too many elections", "Can lead to gridlock", "Too much power for parliament", "Lack of a constitution"], answer: 1 },
      { question: "What can be a problem with parliamentary systems?", options: ["No elections", "Too much military power", "Unstable coalition governments", "No separation of powers at all"], answer: 2 },
      { question: "What do proponents of authoritarian systems claim?", options: ["They're more democratic", "They can make faster decisions", "They have better elections", "They protect individual rights better"], answer: 1 },
      { question: "What does the speaker say determines a system's effectiveness?", options: ["Only its structure", "Only its leaders", "Structure, institutions, culture, and civic engagement", "Economic power alone"], answer: 2 },
    ],
  },
];

export function ListeningPage({ student, onBackHome }: Props) {
  const [mode, setMode] = useState<Mode | null>(null);
  const [level, setLevel] = useState<Level>(student.level);

  if (!mode) {
    return (
      <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
        <SessionHeader title="Nghe" onClose={onBackHome} icon={<Ear className="h-4 w-4" />} iconBg="bg-blue-500" />

        {/* Level filter */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {LEVEL_ORDER.map((l) => (
            <button key={l} type="button" onClick={() => setLevel(l)}
              className={cn("rounded-full px-3 py-1.5 text-xs font-extrabold transition-all active:scale-95",
                level === l ? "bg-primary text-white shadow-sm" : "bg-muted text-muted-foreground")}>
              {l === "kids" ? "Kids" : l.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {MODES.map((m) => (
            <button key={m.key} type="button" onClick={() => setMode(m.key)}
              className="flex w-full items-center gap-3 rounded-2xl border border-border/50 bg-card p-4 shadow-sm transition-all active:scale-[0.98] hover:shadow-md text-left">
              <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", m.color)}>
                <m.icon className="h-6 w-6" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-extrabold">{m.label}</p>
                <p className="text-xs text-muted-foreground">{m.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <p className="mt-4 text-center text-xs font-bold text-muted-foreground">
          Trình độ: {level === "kids" ? "Kids" : level.toUpperCase()} · {student.name}
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-2xl overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-4 pb-6">
      {mode === "word-image" && <WordImageGame level={level} onClose={() => setMode(null)} />}
      {mode === "sentence" && <SentenceGame level={level} onClose={() => setMode(null)} />}
      {mode === "stories" && <StoriesView level={level} onClose={() => setMode(null)} />}
    </main>
  );
}

// ════════════════════════════════════════════
// Mode 1: Nghe từ chọn ảnh
// ════════════════════════════════════════════

function WordImageGame({ level, onClose }: { level: Level; onClose: () => void }) {
  const pool = useMemo(() => {
    const filtered = SEED_VOCABULARY.filter((w) => w.imageUrl && matchesLevel(w.level, level));
    return filtered.length >= 4 ? filtered : SEED_VOCABULARY.filter((w) => w.imageUrl);
  }, [level]);

  const [targets] = useState(() => pickN(pool, ROUND_SIZE));
  const [n, setN] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const target = n < targets.length ? targets[n] : null;

  const opts = useMemo(() => {
    if (!target) return [];
    const others = shuffle(pool.filter((w) => w.id !== target.id)).slice(0, 3);
    return shuffle([target, ...others]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, targets]);

  // Auto-play TTS when question changes
  useEffect(() => {
    if (target) speakText(target.word, target.audioUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  if (!target) {
    return (
      <>
        <SessionHeader title="Nghe từ chọn ảnh" onClose={onClose} />
        <ScoreCard score={score} total={targets.length} onClose={onClose} />
      </>
    );
  }

  const choose = (w: VocabularyWord) => {
    if (picked) return;
    setPicked(w.id);
    if (w.id === target.id) setScore((s) => s + 1);
    setTimeout(() => { setPicked(null); setN((x) => x + 1); }, 900);
  };

  return (
    <>
      <SessionHeader title="Nghe từ chọn ảnh" onClose={onClose} progress={Math.round((n / targets.length) * 100)} />
      <Card>
        <CardContent className="space-y-4 p-5">
          <p className="text-center text-xs font-bold text-muted-foreground">Câu {n + 1}/{targets.length}</p>

          <Button type="button" size="xl" className="w-full" onClick={() => speakText(target.word, target.audioUrl)}>
            <Volume2 className="h-7 w-7" /> Nghe lại
          </Button>

          <div className="grid grid-cols-2 gap-3">
            {opts.map((w) => {
              const isCorrect = w.id === target.id;
              const state = !picked ? "" : isCorrect ? "ring-4 ring-success" : w.id === picked ? "ring-4 ring-red-400" : "opacity-50";
              return (
                <button key={w.id} type="button" onClick={() => choose(w)}
                  className={cn("overflow-hidden rounded-2xl border-2 border-border transition-all active:translate-y-[1px]", state)}>
                  <img src={w.imageUrl} alt="" className="h-28 w-full object-cover" loading="lazy" />
                  {picked && isCorrect && (
                    <p className="bg-success/10 py-1 text-center text-xs font-extrabold text-success capitalize">{w.word}</p>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

// ════════════════════════════════════════════
// Mode 2: Nghe câu chọn đáp án
// ════════════════════════════════════════════

interface SentenceQuestion {
  word: VocabularyWord;
  sentence: string;
  correctVi: string;
  options: string[];
}

function buildSentenceQuestion(target: VocabularyWord, pool: VocabularyWord[]): SentenceQuestion {
  const sentence = target.example || `I have a ${target.word}.`;
  const correctVi = target.example_vi || target.meaning_vi;

  // Pick 3 wrong Vietnamese translations from other words
  const wrongPool = shuffle(pool.filter((w) => w.id !== target.id));
  const wrongs: string[] = [];
  const usedVi = new Set<string>([correctVi]);
  for (const w of wrongPool) {
    const vi = w.example_vi || w.meaning_vi;
    if (!usedVi.has(vi)) { wrongs.push(vi); usedVi.add(vi); }
    if (wrongs.length >= 3) break;
  }

  return {
    word: target,
    sentence,
    correctVi,
    options: shuffle([correctVi, ...wrongs]),
  };
}

function SentenceGame({ level, onClose }: { level: Level; onClose: () => void }) {
  const pool = useMemo(() => {
    const filtered = SEED_VOCABULARY.filter((w) => matchesLevel(w.level, level));
    return filtered.length >= 4 ? filtered : SEED_VOCABULARY;
  }, [level]);

  const [questions] = useState(() => {
    const targets = pickN(pool, ROUND_SIZE);
    return targets.map((t) => buildSentenceQuestion(t, pool));
  });
  const [n, setN] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const q = n < questions.length ? questions[n] : null;

  // Auto-play TTS
  useEffect(() => {
    if (q) speakText(q.sentence);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  if (!q) {
    return (
      <>
        <SessionHeader title="Nghe câu chọn đáp án" onClose={onClose} />
        <ScoreCard score={score} total={questions.length} onClose={onClose} />
      </>
    );
  }

  const choose = (opt: string) => {
    if (picked) return;
    setPicked(opt);
    if (opt === q.correctVi) setScore((s) => s + 1);
    setTimeout(() => { setPicked(null); setN((x) => x + 1); }, 900);
  };

  return (
    <>
      <SessionHeader title="Nghe câu chọn đáp án" onClose={onClose} progress={Math.round((n / questions.length) * 100)} />
      <Card>
        <CardContent className="space-y-4 p-5">
          <p className="text-center text-xs font-bold text-muted-foreground">Câu {n + 1}/{questions.length}</p>

          <Button type="button" size="xl" className="w-full" onClick={() => speakText(q.sentence)}>
            <Volume2 className="h-7 w-7" /> Nghe lại
          </Button>

          <div className="space-y-2">
            {q.options.map((opt) => {
              const isCorrect = opt === q.correctVi;
              const state = !picked
                ? "border-border hover:border-primary/50"
                : isCorrect
                  ? "border-success bg-success/10 text-success"
                  : opt === picked
                    ? "border-red-400 bg-red-50 text-red-600"
                    : "border-border opacity-50";
              return (
                <button key={opt} type="button" onClick={() => choose(opt)}
                  className={cn("flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-sm font-bold transition-all active:translate-y-[1px]", state)}>
                  {picked && isCorrect && <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />}
                  {picked && opt === picked && !isCorrect && <XCircle className="h-5 w-5 shrink-0 text-red-400" />}
                  <span className="flex-1">{opt}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

// ════════════════════════════════════════════
// Mode 3: Nghe hiểu câu chuyện
// ════════════════════════════════════════════

type StoryScreen = "list" | "listening" | "quiz" | "result";

function StoriesView({ level, onClose }: { level: Level; onClose: () => void }) {
  const [screen, setScreen] = useState<StoryScreen>("list");
  const [activeStory, setActiveStory] = useState<StoryItem | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const filtered = useMemo(() => {
    const result = LISTENING_STORIES.filter((s) => matchesLevel(s.level, level));
    return result.length > 0 ? result : LISTENING_STORIES;
  }, [level]);

  const score = useMemo(() => {
    if (!activeStory) return 0;
    return answers.reduce<number>((acc, a, i) => acc + (a === activeStory.questions[i].answer ? 1 : 0), 0);
  }, [answers, activeStory]);

  function openStory(s: StoryItem) {
    setActiveStory(s);
    setScreen("listening");
    setAnswers(s.questions.map(() => null));
    setSubmitted(false);
  }

  function selectAnswer(qi: number, oi: number) {
    if (submitted) return;
    setAnswers((prev) => prev.map((a, i) => (i === qi ? oi : a)));
  }

  function submitQuiz() { setSubmitted(true); setScreen("result"); }

  function backToList() { setScreen("list"); setActiveStory(null); }

  // ─── Story List ───
  if (screen === "list") {
    return (
      <>
        <SessionHeader title="Nghe hiểu câu chuyện" onClose={onClose} />

        <p className="mb-4 text-center text-sm font-bold text-muted-foreground">
          {LEVEL_LABELS[level] ?? level.toUpperCase()} · {filtered.length} câu chuyện
        </p>

        <div className="space-y-3">
          {filtered.map((s) => (
            <Card key={s.id} className="overflow-hidden">
              <CardContent className="flex items-start gap-4 p-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                  <Headphones className="h-6 w-6" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-extrabold truncate">{s.title}</p>
                    <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-extrabold text-muted-foreground">
                      {s.level === "kids" ? "Kids" : s.level.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-muted-foreground">{s.titleVi}</p>
                  <div className="mt-2">
                    <Button type="button" size="sm" onClick={() => openStory(s)}>
                      <Headphones className="h-4 w-4" /> Nghe
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </>
    );
  }

  if (!activeStory) return null;

  // ─── Listening Screen ───
  if (screen === "listening") {
    return (
      <>
        <SessionHeader title={activeStory.title} onClose={backToList} />
        <Card>
          <CardContent className="flex flex-col items-center gap-5 p-6">
            <span className="shrink-0 rounded-full bg-muted px-3 py-1 text-xs font-extrabold text-muted-foreground">
              {activeStory.level === "kids" ? "Kids" : activeStory.level.toUpperCase()}
            </span>
            <p className="text-center text-sm font-bold text-muted-foreground">{activeStory.titleVi}</p>

            <Button type="button" size="xl" className="w-full" onClick={() => speakText(activeStory.text)}>
              <Play className="h-7 w-7" /> Nghe câu chuyện
            </Button>

            <Button type="button" variant="outline" size="lg" className="w-full" onClick={() => speakText(activeStory.text)}>
              <RotateCcw className="h-4 w-4" /> Nghe lại
            </Button>

            <Button type="button" size="lg" className="w-full" onClick={() => setScreen("quiz")}>
              Trả lời câu hỏi
            </Button>
          </CardContent>
        </Card>
      </>
    );
  }

  // ─── Quiz Screen ───
  if (screen === "quiz") {
    return (
      <>
        <SessionHeader title={activeStory.title} onClose={backToList} />
        <Card>
          <CardContent className="space-y-5 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-extrabold">{activeStory.questions.length} câu hỏi</p>
              <Button type="button" variant="ghost" size="sm" onClick={() => speakText(activeStory.text)}>
                <Volume2 className="h-4 w-4" /> Nghe lại
              </Button>
            </div>

            {activeStory.questions.map((q, qi) => (
              <div key={qi} className="space-y-2">
                <p className="text-sm font-bold">Câu {qi + 1}. {q.question}</p>
                <div className="space-y-1.5">
                  {q.options.map((opt, oi) => (
                    <button key={oi} type="button" onClick={() => selectAnswer(qi, oi)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-2.5 text-left text-sm font-bold transition-all active:translate-y-[1px]",
                        answers[qi] === oi ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"
                      )}>
                      <span className="flex-1">{opt}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <Button type="button" size="lg" className="w-full" onClick={submitQuiz}
              disabled={answers.some((a) => a === null)}>
              Nộp bài
            </Button>
          </CardContent>
        </Card>
      </>
    );
  }

  // ─── Result Screen ───
  return (
    <>
      <SessionHeader title={activeStory.title} onClose={backToList} />
      <Card className="animate-pop">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <span className={cn("flex h-16 w-16 items-center justify-center rounded-full", score >= activeStory.questions.length * 0.8 ? "bg-success/20" : "bg-orange-100")}>
            {score >= activeStory.questions.length * 0.8
              ? <CheckCircle2 className="h-8 w-8 text-success" />
              : <RotateCcw className="h-8 w-8 text-orange-500" />}
          </span>
          <p className="text-3xl font-black text-primary">{score}/{activeStory.questions.length}</p>
          <p className={cn("text-sm font-extrabold", score >= activeStory.questions.length * 0.8 ? "text-success" : "text-orange-500")}>
            {score >= activeStory.questions.length * 0.8 ? "Xuất sắc!" : "Cố gắng hơn nhé!"}
          </p>
          <p className="text-xs text-muted-foreground">Đúng {Math.round((score / activeStory.questions.length) * 100)}% câu hỏi</p>
        </CardContent>
      </Card>

      {/* Answer review */}
      <div className="mt-4 space-y-3">
        {activeStory.questions.map((q, qi) => {
          const isCorrect = answers[qi] === q.answer;
          return (
            <Card key={qi}>
              <CardContent className="space-y-2 p-4">
                <div className="flex items-start gap-2">
                  {isCorrect ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />}
                  <p className="text-sm font-bold">{q.question}</p>
                </div>
                {!isCorrect && answers[qi] !== null && (
                  <p className="ml-6 text-xs text-red-500">Bạn chọn: {q.options[answers[qi]!]}</p>
                )}
                <p className="ml-6 text-xs font-bold text-success">Đáp án: {q.options[q.answer]}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-4 space-y-2">
        <Button type="button" size="lg" className="w-full" onClick={() => openStory(activeStory)}>
          <RotateCcw className="h-4 w-4" /> Nghe lại
        </Button>
        <Button type="button" variant="outline" size="lg" className="w-full" onClick={backToList}>
          Danh sách
        </Button>
      </div>
    </>
  );
}

// ════════════════════════════════════════════
// Shared: Score card
// ════════════════════════════════════════════

function ScoreCard({ score, total, onClose }: { score: number; total: number; onClose: () => void }) {
  const pct = Math.round((score / total) * 100);
  const great = pct >= 80;

  return (
    <Card className="animate-pop">
      <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
        <span className={cn("flex h-16 w-16 items-center justify-center rounded-full", great ? "bg-success/20" : "bg-orange-100")}>
          {great
            ? <CheckCircle2 className="h-8 w-8 text-success" />
            : <RotateCcw className="h-8 w-8 text-orange-500" />}
        </span>
        <p className="text-3xl font-black text-primary">{score}/{total}</p>
        <p className={cn("text-sm font-extrabold", great ? "text-success" : "text-orange-500")}>
          {great ? "Xuất sắc!" : "Cố gắng hơn nhé!"}
        </p>
        <p className="text-xs text-muted-foreground">Đúng {pct}% câu hỏi</p>
        <Button type="button" size="lg" className="w-full" onClick={onClose}>
          <RotateCcw className="h-4 w-4" /> Chơi lại
        </Button>
      </CardContent>
    </Card>
  );
}
