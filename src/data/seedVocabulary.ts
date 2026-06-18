import type { VocabularyWord } from "../types";
import { IMAGE_URLS } from "./seedImages";
import { ALL_LEVEL_WORDS } from "./vocab";

// Mốc thời gian seed cố định (tránh giá trị động giữa các lần chạy).
const SEED_CREATED_AT = Date.UTC(2026, 5, 18); // 2026-06-18

// ~100 từ / 10 chủ đề (TECH_SPEC §12, §14).
// NOTE: nghĩa/ví dụ tiếng Việt do AI soạn NHÁP — anh Hieu review & chỉnh (C-001).
// imageUrl để rỗng: ảnh do anh Hieu duyệt URL cố định an toàn cho trẻ (C-002).
// audioUrl rỗng: lấy từ Dictionary khi tra, hoặc TTS đọc.

type Seed = Omit<VocabularyWord, "level" | "source" | "createdAt" | "imageUrl" | "audioUrl">;

function word(s: Seed): VocabularyWord {
  return {
    ...s,
    level: "a1",
    imageUrl: IMAGE_URLS[s.id] ?? "", // ảnh Pexels (seedImages.ts); rỗng -> placeholder
    audioUrl: "",
    source: "seed",
    createdAt: SEED_CREATED_AT,
  };
}

const CORE_WORDS: VocabularyWord[] = [
  // ── Food ──
  word({ id: "word_apple", word: "apple", phonetic: "/ˈæp.əl/", meaning_vi: "quả táo", meaning_en: "a round fruit with red, green, or yellow skin", example: "I eat an apple every day.", example_vi: "Con ăn một quả táo mỗi ngày.", topicIds: ["topic_food"] }),
  word({ id: "word_banana", word: "banana", phonetic: "/bəˈnɑː.nə/", meaning_vi: "quả chuối", meaning_en: "a long curved fruit with yellow skin", example: "Monkeys like bananas.", example_vi: "Khỉ thích chuối.", topicIds: ["topic_food"] }),
  word({ id: "word_rice", word: "rice", phonetic: "/raɪs/", meaning_vi: "cơm / gạo", meaning_en: "small white or brown grains eaten as food", example: "We eat rice for lunch.", example_vi: "Chúng con ăn cơm vào bữa trưa.", topicIds: ["topic_food"] }),
  word({ id: "word_bread", word: "bread", phonetic: "/bred/", meaning_vi: "bánh mì", meaning_en: "a food made from flour and baked", example: "She buys bread in the morning.", example_vi: "Chị ấy mua bánh mì vào buổi sáng.", topicIds: ["topic_food"] }),
  word({ id: "word_milk", word: "milk", phonetic: "/mɪlk/", meaning_vi: "sữa", meaning_en: "a white liquid drink from cows", example: "I drink milk every morning.", example_vi: "Con uống sữa mỗi sáng.", topicIds: ["topic_food"] }),
  word({ id: "word_water", word: "water", phonetic: "/ˈwɔː.tər/", meaning_vi: "nước", meaning_en: "a clear liquid that we drink", example: "Please give me some water.", example_vi: "Làm ơn cho con xin chút nước.", topicIds: ["topic_food"] }),
  word({ id: "word_egg", word: "egg", phonetic: "/eɡ/", meaning_vi: "quả trứng", meaning_en: "an oval food from a hen", example: "I like fried eggs.", example_vi: "Con thích trứng rán.", topicIds: ["topic_food"] }),
  word({ id: "word_chicken", word: "chicken", phonetic: "/ˈtʃɪk.ɪn/", meaning_vi: "thịt gà / con gà", meaning_en: "a farm bird, or its meat as food", example: "We have chicken for dinner.", example_vi: "Chúng con ăn thịt gà vào bữa tối.", topicIds: ["topic_food", "topic_animals"] }),
  word({ id: "word_fish", word: "fish", phonetic: "/fɪʃ/", meaning_vi: "con cá / cá", meaning_en: "an animal that lives in water, also eaten as food", example: "My father catches fish.", example_vi: "Bố con bắt cá.", topicIds: ["topic_food", "topic_animals"] }),
  word({ id: "word_orange", word: "orange", phonetic: "/ˈɒr.ɪndʒ/", meaning_vi: "quả cam", meaning_en: "a round orange-colored fruit", example: "Orange juice is sweet.", example_vi: "Nước cam thì ngọt.", topicIds: ["topic_food"] }),

  // ── School ──
  word({ id: "word_book", word: "book", phonetic: "/bʊk/", meaning_vi: "quyển sách", example: "I read a book.", example_vi: "Con đọc một quyển sách.", topicIds: ["topic_school"] }),
  word({ id: "word_pen", word: "pen", phonetic: "/pen/", meaning_vi: "cây bút (bút mực)", example: "This is my pen.", example_vi: "Đây là cây bút của con.", topicIds: ["topic_school"] }),
  word({ id: "word_pencil", word: "pencil", phonetic: "/ˈpen.səl/", meaning_vi: "bút chì", example: "I write with a pencil.", example_vi: "Con viết bằng bút chì.", topicIds: ["topic_school"] }),
  word({ id: "word_teacher", word: "teacher", phonetic: "/ˈtiː.tʃər/", meaning_vi: "giáo viên", example: "My teacher is kind.", example_vi: "Cô giáo của con rất hiền.", topicIds: ["topic_school"] }),
  word({ id: "word_student", word: "student", phonetic: "/ˈstjuː.dənt/", meaning_vi: "học sinh", example: "She is a good student.", example_vi: "Bạn ấy là học sinh giỏi.", topicIds: ["topic_school"] }),
  word({ id: "word_classroom", word: "classroom", phonetic: "/ˈklɑːs.ruːm/", meaning_vi: "lớp học / phòng học", example: "Our classroom is big.", example_vi: "Lớp học của chúng con rộng.", topicIds: ["topic_school"] }),
  word({ id: "word_lesson", word: "lesson", phonetic: "/ˈles.ən/", meaning_vi: "bài học", example: "Today's lesson is easy.", example_vi: "Bài học hôm nay dễ.", topicIds: ["topic_school"] }),
  word({ id: "word_homework", word: "homework", phonetic: "/ˈhəʊm.wɜːk/", meaning_vi: "bài tập về nhà", example: "I do my homework.", example_vi: "Con làm bài tập về nhà.", topicIds: ["topic_school"] }),
  word({ id: "word_notebook", word: "notebook", phonetic: "/ˈnəʊt.bʊk/", meaning_vi: "quyển vở", example: "Write it in your notebook.", example_vi: "Hãy viết vào vở của con.", topicIds: ["topic_school"] }),
  word({ id: "word_subject", word: "subject", phonetic: "/ˈsʌb.dʒɪkt/", meaning_vi: "môn học", example: "Math is my favorite subject.", example_vi: "Toán là môn con thích nhất.", topicIds: ["topic_school"] }),

  // ── Family ──
  word({ id: "word_father", word: "father", phonetic: "/ˈfɑː.ðər/", meaning_vi: "bố / cha", example: "My father works hard.", example_vi: "Bố con làm việc chăm chỉ.", topicIds: ["topic_family"] }),
  word({ id: "word_mother", word: "mother", phonetic: "/ˈmʌð.ər/", meaning_vi: "mẹ", example: "My mother cooks well.", example_vi: "Mẹ con nấu ăn ngon.", topicIds: ["topic_family"] }),
  word({ id: "word_brother", word: "brother", phonetic: "/ˈbrʌð.ər/", meaning_vi: "anh trai / em trai", example: "I have one brother.", example_vi: "Con có một người anh trai.", topicIds: ["topic_family"] }),
  word({ id: "word_sister", word: "sister", phonetic: "/ˈsɪs.tər/", meaning_vi: "chị gái / em gái", example: "My sister is tall.", example_vi: "Chị gái con cao.", topicIds: ["topic_family"] }),
  word({ id: "word_grandfather", word: "grandfather", phonetic: "/ˈɡræn.fɑː.ðər/", meaning_vi: "ông", example: "My grandfather tells stories.", example_vi: "Ông con hay kể chuyện.", topicIds: ["topic_family"] }),
  word({ id: "word_grandmother", word: "grandmother", phonetic: "/ˈɡræn.mʌð.ər/", meaning_vi: "bà", example: "My grandmother loves me.", example_vi: "Bà con yêu con.", topicIds: ["topic_family"] }),
  word({ id: "word_uncle", word: "uncle", phonetic: "/ˈʌŋ.kəl/", meaning_vi: "chú / bác / cậu", example: "My uncle has a car.", example_vi: "Chú con có ô tô.", topicIds: ["topic_family"] }),
  word({ id: "word_aunt", word: "aunt", phonetic: "/ɑːnt/", meaning_vi: "cô / dì / bác gái", example: "My aunt is a nurse.", example_vi: "Dì con là y tá.", topicIds: ["topic_family"] }),
  word({ id: "word_cousin", word: "cousin", phonetic: "/ˈkʌz.ən/", meaning_vi: "anh / chị / em họ", example: "My cousin is funny.", example_vi: "Anh họ con vui tính.", topicIds: ["topic_family"] }),
  word({ id: "word_family", word: "family", phonetic: "/ˈfæm.əl.i/", meaning_vi: "gia đình", example: "I love my family.", example_vi: "Con yêu gia đình của con.", topicIds: ["topic_family"] }),

  // ── Animals (fish & chicken đã thuộc Food + Animals ở trên) ──
  word({ id: "word_cat", word: "cat", phonetic: "/kæt/", meaning_vi: "con mèo", example: "The cat is sleeping.", example_vi: "Con mèo đang ngủ.", topicIds: ["topic_animals"] }),
  word({ id: "word_dog", word: "dog", phonetic: "/dɒɡ/", meaning_vi: "con chó", example: "My dog runs fast.", example_vi: "Con chó của con chạy nhanh.", topicIds: ["topic_animals"] }),
  word({ id: "word_bird", word: "bird", phonetic: "/bɜːd/", meaning_vi: "con chim", example: "The bird can fly.", example_vi: "Con chim biết bay.", topicIds: ["topic_animals"] }),
  word({ id: "word_horse", word: "horse", phonetic: "/hɔːs/", meaning_vi: "con ngựa", example: "The horse is big.", example_vi: "Con ngựa to.", topicIds: ["topic_animals"] }),
  word({ id: "word_cow", word: "cow", phonetic: "/kaʊ/", meaning_vi: "con bò", example: "The cow eats grass.", example_vi: "Con bò ăn cỏ.", topicIds: ["topic_animals"] }),
  word({ id: "word_rabbit", word: "rabbit", phonetic: "/ˈræb.ɪt/", meaning_vi: "con thỏ", example: "The rabbit is white.", example_vi: "Con thỏ màu trắng.", topicIds: ["topic_animals"] }),
  word({ id: "word_tiger", word: "tiger", phonetic: "/ˈtaɪ.ɡər/", meaning_vi: "con hổ", example: "The tiger is strong.", example_vi: "Con hổ khỏe.", topicIds: ["topic_animals"] }),
  word({ id: "word_lion", word: "lion", phonetic: "/ˈlaɪ.ən/", meaning_vi: "con sư tử", example: "The lion roars.", example_vi: "Con sư tử gầm.", topicIds: ["topic_animals"] }),
  word({ id: "word_monkey", word: "monkey", phonetic: "/ˈmʌŋ.ki/", meaning_vi: "con khỉ", example: "The monkey eats bananas.", example_vi: "Con khỉ ăn chuối.", topicIds: ["topic_animals"] }),

  // ── Daily Activities ──
  word({ id: "word_wake_up", word: "wake up", meaning_vi: "thức dậy", example: "I wake up at six.", example_vi: "Con thức dậy lúc sáu giờ.", topicIds: ["topic_daily"] }),
  word({ id: "word_brush_teeth", word: "brush teeth", meaning_vi: "đánh răng", example: "I brush my teeth.", example_vi: "Con đánh răng.", topicIds: ["topic_daily"] }),
  word({ id: "word_go_to_school", word: "go to school", meaning_vi: "đi học / đến trường", example: "I go to school by bike.", example_vi: "Con đi học bằng xe đạp.", topicIds: ["topic_daily"] }),
  word({ id: "word_study", word: "study", phonetic: "/ˈstʌd.i/", meaning_vi: "học bài", example: "I study every evening.", example_vi: "Con học bài mỗi tối.", topicIds: ["topic_daily"] }),
  word({ id: "word_read", word: "read", phonetic: "/riːd/", meaning_vi: "đọc", example: "I read at night.", example_vi: "Con đọc sách vào buổi tối.", topicIds: ["topic_daily"] }),
  word({ id: "word_write", word: "write", phonetic: "/raɪt/", meaning_vi: "viết", example: "I write a letter.", example_vi: "Con viết một lá thư.", topicIds: ["topic_daily"] }),
  word({ id: "word_eat", word: "eat", phonetic: "/iːt/", meaning_vi: "ăn", example: "We eat at noon.", example_vi: "Chúng con ăn vào buổi trưa.", topicIds: ["topic_daily"] }),
  word({ id: "word_drink", word: "drink", phonetic: "/drɪŋk/", meaning_vi: "uống", example: "I drink water.", example_vi: "Con uống nước.", topicIds: ["topic_daily"] }),
  word({ id: "word_play", word: "play", phonetic: "/pleɪ/", meaning_vi: "chơi", example: "Children play together.", example_vi: "Các bạn nhỏ chơi cùng nhau.", topicIds: ["topic_daily"] }),
  word({ id: "word_sleep", word: "sleep", phonetic: "/sliːp/", meaning_vi: "ngủ", example: "I sleep at ten.", example_vi: "Con ngủ lúc mười giờ.", topicIds: ["topic_daily"] }),

  // ── Sports ──
  word({ id: "word_football", word: "football", phonetic: "/ˈfʊt.bɔːl/", meaning_vi: "bóng đá", example: "We play football.", example_vi: "Chúng con chơi bóng đá.", topicIds: ["topic_sports"] }),
  word({ id: "word_basketball", word: "basketball", phonetic: "/ˈbɑːs.kɪt.bɔːl/", meaning_vi: "bóng rổ", example: "He likes basketball.", example_vi: "Bạn ấy thích bóng rổ.", topicIds: ["topic_sports"] }),
  word({ id: "word_tennis", word: "tennis", phonetic: "/ˈten.ɪs/", meaning_vi: "quần vợt", example: "She plays tennis.", example_vi: "Bạn ấy chơi quần vợt.", topicIds: ["topic_sports"] }),
  word({ id: "word_swimming", word: "swimming", phonetic: "/ˈswɪm.ɪŋ/", meaning_vi: "bơi lội", example: "Swimming is fun.", example_vi: "Bơi lội rất vui.", topicIds: ["topic_sports"] }),
  word({ id: "word_running", word: "running", phonetic: "/ˈrʌn.ɪŋ/", meaning_vi: "chạy bộ", example: "Running is good for you.", example_vi: "Chạy bộ tốt cho sức khỏe.", topicIds: ["topic_sports"] }),
  word({ id: "word_badminton", word: "badminton", phonetic: "/ˈbæd.mɪn.tən/", meaning_vi: "cầu lông", example: "We play badminton.", example_vi: "Chúng con chơi cầu lông.", topicIds: ["topic_sports"] }),
  word({ id: "word_volleyball", word: "volleyball", phonetic: "/ˈvɒl.i.bɔːl/", meaning_vi: "bóng chuyền", example: "They play volleyball.", example_vi: "Họ chơi bóng chuyền.", topicIds: ["topic_sports"] }),
  word({ id: "word_cycling", word: "cycling", phonetic: "/ˈsaɪ.klɪŋ/", meaning_vi: "đạp xe", example: "Cycling is healthy.", example_vi: "Đạp xe tốt cho sức khỏe.", topicIds: ["topic_sports"] }),
  word({ id: "word_ball", word: "ball", phonetic: "/bɔːl/", meaning_vi: "quả bóng", example: "I have a new ball.", example_vi: "Con có quả bóng mới.", topicIds: ["topic_sports"] }),
  word({ id: "word_team", word: "team", phonetic: "/tiːm/", meaning_vi: "đội", example: "My team is strong.", example_vi: "Đội của con mạnh.", topicIds: ["topic_sports"] }),

  // ── Feelings ──
  word({ id: "word_happy", word: "happy", phonetic: "/ˈhæp.i/", meaning_vi: "vui / hạnh phúc", example: "I am happy today.", example_vi: "Hôm nay con rất vui.", topicIds: ["topic_feelings"] }),
  word({ id: "word_sad", word: "sad", phonetic: "/sæd/", meaning_vi: "buồn", example: "She is sad.", example_vi: "Bạn ấy buồn.", topicIds: ["topic_feelings"] }),
  word({ id: "word_angry", word: "angry", phonetic: "/ˈæŋ.ɡri/", meaning_vi: "tức giận", example: "He is angry.", example_vi: "Bạn ấy tức giận.", topicIds: ["topic_feelings"] }),
  word({ id: "word_tired", word: "tired", phonetic: "/ˈtaɪəd/", meaning_vi: "mệt", example: "I am tired.", example_vi: "Con mệt.", topicIds: ["topic_feelings"] }),
  word({ id: "word_scared", word: "scared", phonetic: "/skeəd/", meaning_vi: "sợ hãi", example: "The baby is scared.", example_vi: "Em bé sợ hãi.", topicIds: ["topic_feelings"] }),
  word({ id: "word_excited", word: "excited", phonetic: "/ɪkˈsaɪ.tɪd/", meaning_vi: "háo hức / phấn khích", example: "I am excited.", example_vi: "Con rất háo hức.", topicIds: ["topic_feelings"] }),
  word({ id: "word_bored", word: "bored", phonetic: "/bɔːd/", meaning_vi: "chán", example: "He is bored.", example_vi: "Bạn ấy thấy chán.", topicIds: ["topic_feelings"] }),
  word({ id: "word_hungry", word: "hungry", phonetic: "/ˈhʌŋ.ɡri/", meaning_vi: "đói", example: "I am hungry.", example_vi: "Con đói.", topicIds: ["topic_feelings"] }),
  word({ id: "word_surprised", word: "surprised", phonetic: "/səˈpraɪzd/", meaning_vi: "ngạc nhiên", example: "She is surprised.", example_vi: "Bạn ấy ngạc nhiên.", topicIds: ["topic_feelings"] }),
  word({ id: "word_shy", word: "shy", phonetic: "/ʃaɪ/", meaning_vi: "nhút nhát / xấu hổ", example: "He is shy.", example_vi: "Bạn ấy nhút nhát.", topicIds: ["topic_feelings"] }),

  // ── House ──
  word({ id: "word_door", word: "door", phonetic: "/dɔːr/", meaning_vi: "cửa ra vào", example: "Close the door.", example_vi: "Hãy đóng cửa.", topicIds: ["topic_house"] }),
  word({ id: "word_window", word: "window", phonetic: "/ˈwɪn.dəʊ/", meaning_vi: "cửa sổ", example: "Open the window.", example_vi: "Hãy mở cửa sổ.", topicIds: ["topic_house"] }),
  word({ id: "word_table", word: "table", phonetic: "/ˈteɪ.bəl/", meaning_vi: "cái bàn", example: "The book is on the table.", example_vi: "Quyển sách ở trên bàn.", topicIds: ["topic_house"] }),
  word({ id: "word_chair", word: "chair", phonetic: "/tʃeər/", meaning_vi: "cái ghế", example: "Sit on the chair.", example_vi: "Hãy ngồi lên ghế.", topicIds: ["topic_house"] }),
  word({ id: "word_bed", word: "bed", phonetic: "/bed/", meaning_vi: "cái giường", example: "I sleep in my bed.", example_vi: "Con ngủ trên giường.", topicIds: ["topic_house"] }),
  word({ id: "word_kitchen", word: "kitchen", phonetic: "/ˈkɪtʃ.ɪn/", meaning_vi: "nhà bếp", example: "Mom cooks in the kitchen.", example_vi: "Mẹ nấu ăn trong bếp.", topicIds: ["topic_house"] }),
  word({ id: "word_room", word: "room", phonetic: "/ruːm/", meaning_vi: "căn phòng", example: "My room is clean.", example_vi: "Phòng của con sạch sẽ.", topicIds: ["topic_house"] }),
  word({ id: "word_roof", word: "roof", phonetic: "/ruːf/", meaning_vi: "mái nhà", example: "The roof is red.", example_vi: "Mái nhà màu đỏ.", topicIds: ["topic_house"] }),
  word({ id: "word_wall", word: "wall", phonetic: "/wɔːl/", meaning_vi: "bức tường", example: "There is a clock on the wall.", example_vi: "Có một chiếc đồng hồ trên tường.", topicIds: ["topic_house"] }),
  word({ id: "word_floor", word: "floor", phonetic: "/flɔːr/", meaning_vi: "sàn nhà", example: "The floor is wet.", example_vi: "Sàn nhà bị ướt.", topicIds: ["topic_house"] }),

  // ── Clothes ──
  word({ id: "word_shirt", word: "shirt", phonetic: "/ʃɜːt/", meaning_vi: "áo sơ mi", example: "He wears a white shirt.", example_vi: "Bạn ấy mặc áo sơ mi trắng.", topicIds: ["topic_clothes"] }),
  word({ id: "word_trousers", word: "trousers", phonetic: "/ˈtraʊ.zəz/", meaning_vi: "quần dài", example: "These trousers are new.", example_vi: "Cái quần dài này mới.", topicIds: ["topic_clothes"] }),
  word({ id: "word_dress", word: "dress", phonetic: "/dres/", meaning_vi: "váy / đầm", example: "She has a pretty dress.", example_vi: "Bạn ấy có chiếc váy đẹp.", topicIds: ["topic_clothes"] }),
  word({ id: "word_shoes", word: "shoes", phonetic: "/ʃuːz/", meaning_vi: "giày", example: "My shoes are black.", example_vi: "Giày của con màu đen.", topicIds: ["topic_clothes"] }),
  word({ id: "word_hat", word: "hat", phonetic: "/hæt/", meaning_vi: "cái mũ / nón", example: "I wear a hat.", example_vi: "Con đội mũ.", topicIds: ["topic_clothes"] }),
  word({ id: "word_socks", word: "socks", phonetic: "/sɒks/", meaning_vi: "tất / vớ", example: "These socks are warm.", example_vi: "Đôi tất này ấm.", topicIds: ["topic_clothes"] }),
  word({ id: "word_jacket", word: "jacket", phonetic: "/ˈdʒæk.ɪt/", meaning_vi: "áo khoác", example: "It is cold, wear a jacket.", example_vi: "Trời lạnh, hãy mặc áo khoác.", topicIds: ["topic_clothes"] }),
  word({ id: "word_skirt", word: "skirt", phonetic: "/skɜːt/", meaning_vi: "chân váy", example: "Her skirt is blue.", example_vi: "Chân váy của bạn ấy màu xanh.", topicIds: ["topic_clothes"] }),
  word({ id: "word_shorts", word: "shorts", phonetic: "/ʃɔːts/", meaning_vi: "quần đùi / quần soóc", example: "He wears shorts in summer.", example_vi: "Bạn ấy mặc quần đùi vào mùa hè.", topicIds: ["topic_clothes"] }),
  word({ id: "word_sweater", word: "sweater", phonetic: "/ˈswet.ər/", meaning_vi: "áo len", example: "This sweater is soft.", example_vi: "Chiếc áo len này mềm.", topicIds: ["topic_clothes"] }),

  // ── Travel ──
  word({ id: "word_airplane", word: "airplane", phonetic: "/ˈeə.pleɪn/", meaning_vi: "máy bay", example: "The airplane is fast.", example_vi: "Máy bay rất nhanh.", topicIds: ["topic_travel"] }),
  word({ id: "word_train", word: "train", phonetic: "/treɪn/", meaning_vi: "tàu hỏa", example: "We go by train.", example_vi: "Chúng con đi bằng tàu hỏa.", topicIds: ["topic_travel"] }),
  word({ id: "word_bus", word: "bus", phonetic: "/bʌs/", meaning_vi: "xe buýt", example: "I take the bus.", example_vi: "Con đi xe buýt.", topicIds: ["topic_travel"] }),
  word({ id: "word_car", word: "car", phonetic: "/kɑːr/", meaning_vi: "xe ô tô", example: "My father drives a car.", example_vi: "Bố con lái ô tô.", topicIds: ["topic_travel"] }),
  word({ id: "word_ticket", word: "ticket", phonetic: "/ˈtɪk.ɪt/", meaning_vi: "vé", example: "I buy a ticket.", example_vi: "Con mua một chiếc vé.", topicIds: ["topic_travel"] }),
  word({ id: "word_suitcase", word: "suitcase", phonetic: "/ˈsuːt.keɪs/", meaning_vi: "vali", example: "My suitcase is heavy.", example_vi: "Vali của con nặng.", topicIds: ["topic_travel"] }),
  word({ id: "word_map", word: "map", phonetic: "/mæp/", meaning_vi: "bản đồ", example: "We look at the map.", example_vi: "Chúng con xem bản đồ.", topicIds: ["topic_travel"] }),
  word({ id: "word_hotel", word: "hotel", phonetic: "/həʊˈtel/", meaning_vi: "khách sạn", example: "We stay in a hotel.", example_vi: "Chúng con ở khách sạn.", topicIds: ["topic_travel"] }),
  word({ id: "word_beach", word: "beach", phonetic: "/biːtʃ/", meaning_vi: "bãi biển", example: "I play on the beach.", example_vi: "Con chơi ở bãi biển.", topicIds: ["topic_travel"] }),
  word({ id: "word_mountain", word: "mountain", phonetic: "/ˈmaʊn.tɪn/", meaning_vi: "ngọn núi", example: "The mountain is high.", example_vi: "Ngọn núi cao.", topicIds: ["topic_travel"] }),
];

// Gộp toàn bộ: từ cơ bản + mọi cấp độ do các agent sinh (khử trùng id, giữ bản đầu).
function dedupeById(list: VocabularyWord[]): VocabularyWord[] {
  const seen = new Set<string>();
  return list.filter((w) => (seen.has(w.id) ? false : (seen.add(w.id), true)));
}
export const SEED_VOCABULARY: VocabularyWord[] = dedupeById([...CORE_WORDS, ...ALL_LEVEL_WORDS]);
