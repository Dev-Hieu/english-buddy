import type { VocabularyWord } from "../../types";
import { mk } from "./_mk";

// mk(level, id, word, phonetic, meaning_vi, meaning_en, example, example_vi, topicIds)
export const KIDS_WORDS: VocabularyWord[] = [
  // Colors → topic_colors
  mk("kids", "word_kids_red", "red", "/red/", "màu đỏ", "the color of a tomato", "The ball is red.", "Quả bóng màu đỏ.", ["topic_colors"]),
  mk("kids", "word_kids_blue", "blue", "/bluː/", "màu xanh dương", "the color of the sky", "The sky is blue.", "Bầu trời màu xanh.", ["topic_colors"]),
  mk("kids", "word_kids_green", "green", "/ɡriːn/", "màu xanh lá", "the color of grass", "The leaf is green.", "Chiếc lá màu xanh lá.", ["topic_colors"]),
  mk("kids", "word_kids_yellow", "yellow", "/ˈjeləʊ/", "màu vàng", "the color of the sun", "The sun is yellow.", "Mặt trời màu vàng.", ["topic_colors"]),

  // Numbers
  mk("kids", "word_kids_one", "one", "/wʌn/", "số một", "the number 1", "I have one nose.", "Con có một cái mũi.", ["topic_school"]),
  mk("kids", "word_kids_two", "two", "/tuː/", "số hai", "the number 2", "I have two eyes.", "Con có hai mắt.", ["topic_school"]),
  mk("kids", "word_kids_three", "three", "/θriː/", "số ba", "the number 3", "I see three cats.", "Con thấy ba con mèo.", ["topic_school"]),

  // Toys
  mk("kids", "word_kids_ball", "ball", "/bɔːl/", "quả bóng", "a round toy you play with", "I play with a ball.", "Con chơi với quả bóng.", ["topic_daily"]),
  mk("kids", "word_kids_doll", "doll", "/dɒl/", "búp bê", "a toy that looks like a person", "She has a doll.", "Bạn ấy có một con búp bê.", ["topic_daily"]),
  mk("kids", "word_kids_kite", "kite", "/kaɪt/", "con diều", "a toy that flies in the wind", "We fly a kite.", "Chúng con thả diều.", ["topic_daily"]),
  mk("kids", "word_kids_teddy", "teddy", "/ˈtedi/", "gấu bông", "a soft toy bear", "I hug my teddy.", "Con ôm gấu bông.", ["topic_daily"]),

  // Body parts → topic_body
  mk("kids", "word_kids_hand", "hand", "/hænd/", "bàn tay", "the part at the end of your arm", "Wash your hand.", "Rửa tay của con đi.", ["topic_body"]),
  mk("kids", "word_kids_foot", "foot", "/fʊt/", "bàn chân", "the part you stand on", "My foot is small.", "Bàn chân con nhỏ.", ["topic_body"]),
  mk("kids", "word_kids_eye", "eye", "/aɪ/", "mắt", "you see with it", "Close your eye.", "Nhắm mắt lại đi.", ["topic_body"]),
  mk("kids", "word_kids_nose", "nose", "/nəʊz/", "mũi", "you smell with it", "My nose is small.", "Mũi con nhỏ.", ["topic_body"]),
  mk("kids", "word_kids_ear", "ear", "/ɪə/", "tai", "you hear with it", "I have two ears.", "Con có hai tai.", ["topic_body"]),

  // Animals
  mk("kids", "word_kids_fish", "fish", "/fɪʃ/", "con cá", "an animal that lives in water", "The fish can swim.", "Con cá biết bơi.", ["topic_animals"]),
  mk("kids", "word_kids_bird", "bird", "/bɜːd/", "con chim", "an animal that can fly", "The bird can fly.", "Con chim biết bay.", ["topic_animals"]),
  mk("kids", "word_kids_duck", "duck", "/dʌk/", "con vịt", "a bird that says quack", "The duck is yellow.", "Con vịt màu vàng.", ["topic_animals"]),
  mk("kids", "word_kids_cow", "cow", "/kaʊ/", "con bò", "a big farm animal", "The cow eats grass.", "Con bò ăn cỏ.", ["topic_animals"]),
  mk("kids", "word_kids_pig", "pig", "/pɪɡ/", "con lợn", "a pink farm animal", "The pig is pink.", "Con lợn màu hồng.", ["topic_animals"]),

  // Food
  mk("kids", "word_kids_milk", "milk", "/mɪlk/", "sữa", "a white drink", "I drink milk.", "Con uống sữa.", ["topic_food"]),
  mk("kids", "word_kids_egg", "egg", "/eɡ/", "quả trứng", "food from a hen", "I eat an egg.", "Con ăn một quả trứng.", ["topic_food"]),
  mk("kids", "word_kids_cake", "cake", "/keɪk/", "bánh ngọt", "a sweet food for birthdays", "I like cake.", "Con thích bánh.", ["topic_food"]),
  mk("kids", "word_kids_rice", "rice", "/raɪs/", "cơm", "small white food we eat", "I eat rice.", "Con ăn cơm.", ["topic_food"]),
  mk("kids", "word_kids_water", "water", "/ˈwɔːtə/", "nước", "a clear drink", "I drink water.", "Con uống nước.", ["topic_food"]),

  // Family
  mk("kids", "word_kids_mom", "mom", "/mɒm/", "mẹ", "your mother", "I love my mom.", "Con yêu mẹ.", ["topic_family"]),
  mk("kids", "word_kids_dad", "dad", "/dæd/", "bố", "your father", "My dad is tall.", "Bố con cao.", ["topic_family"]),
  mk("kids", "word_kids_baby", "baby", "/ˈbeɪbi/", "em bé", "a very young child", "The baby is small.", "Em bé nhỏ xíu.", ["topic_family"]),
  mk("kids", "word_kids_sister", "sister", "/ˈsɪstə/", "chị/em gái", "a girl in your family", "I have a sister.", "Con có một chị gái.", ["topic_family"]),
  mk("kids", "word_kids_brother", "brother", "/ˈbrʌðə/", "anh/em trai", "a boy in your family", "I have a brother.", "Con có một anh trai.", ["topic_family"]),

  // House
  mk("kids", "word_kids_bed", "bed", "/bed/", "cái giường", "you sleep on it", "I sleep in bed.", "Con ngủ trên giường.", ["topic_house"]),
  mk("kids", "word_kids_door", "door", "/dɔː/", "cái cửa", "you open it to go in", "Open the door.", "Mở cửa ra.", ["topic_house"]),
  mk("kids", "word_kids_chair", "chair", "/tʃeə/", "cái ghế", "you sit on it", "Sit on the chair.", "Ngồi lên ghế đi.", ["topic_house"]),
  mk("kids", "word_kids_cup", "cup", "/kʌp/", "cái cốc", "you drink from it", "Here is my cup.", "Đây là cái cốc của con.", ["topic_house"]),

  // Clothes
  mk("kids", "word_kids_hat", "hat", "/hæt/", "cái mũ", "you wear it on your head", "I wear a hat.", "Con đội mũ.", ["topic_clothes"]),
  mk("kids", "word_kids_shoe", "shoe", "/ʃuː/", "chiếc giày", "you wear it on your foot", "Put on your shoe.", "Mang giày vào đi.", ["topic_clothes"]),
  mk("kids", "word_kids_sock", "sock", "/sɒk/", "chiếc tất", "you wear it under your shoe", "I have red socks.", "Con có tất màu đỏ.", ["topic_clothes"]),

  // Feelings
  mk("kids", "word_kids_happy", "happy", "/ˈhæpi/", "vui", "feeling good", "I am happy.", "Con vui.", ["topic_feelings"]),
  mk("kids", "word_kids_sad", "sad", "/sæd/", "buồn", "feeling not good", "I am sad.", "Con buồn.", ["topic_feelings"]),

  // Actions
  mk("kids", "word_kids_run", "run", "/rʌn/", "chạy", "to move fast with your legs", "I can run.", "Con biết chạy.", ["topic_daily"]),
  mk("kids", "word_kids_jump", "jump", "/dʒʌmp/", "nhảy", "to go up in the air", "I can jump.", "Con biết nhảy.", ["topic_daily"]),
  mk("kids", "word_kids_sleep", "sleep", "/sliːp/", "ngủ", "to close your eyes and rest", "I sleep at night.", "Con ngủ vào ban đêm.", ["topic_daily"]),

  // School
  mk("kids", "word_kids_pen", "pen", "/pen/", "cái bút", "you write with it", "I write with a pen.", "Con viết bằng bút.", ["topic_school"]),
  mk("kids", "word_kids_bag", "bag", "/bæɡ/", "cái cặp", "you put your things in it", "This is my bag.", "Đây là cặp của con.", ["topic_school"]),
];
