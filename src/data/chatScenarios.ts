import type { ChatScenario } from "../types";

const o = (en: string, vi: string) => ({ en, vi });

export const CHAT_SCENARIOS: ChatScenario[] = [
  {
    id: "greetings", emoji: "👋", title_vi: "Chào hỏi & làm quen",
    prompt: "You meet the child for the first time and get to know each other (name, age, hobbies).",
    opening_en: "Hi! My name is Lisa. What's your name?", opening_vi: "Chào! Mình tên Lisa. Bạn tên gì?",
    steps: [
      { bot_en: "Nice to meet you! How old are you?", bot_vi: "Rất vui được gặp! Bạn bao nhiêu tuổi?", answer: "My name is Nam.", options: [o("My name is Nam.", "Mình tên Nam."), o("I am fine.", "Mình khỏe."), o("Goodbye.", "Tạm biệt.")] },
      { bot_en: "Cool! What do you like to do?", bot_vi: "Hay đó! Bạn thích làm gì?", answer: "I am ten years old.", options: [o("I am ten years old.", "Mình mười tuổi."), o("I have a dog.", "Mình có một con chó."), o("It is red.", "Nó màu đỏ.")] },
      { bot_en: "That's great! Nice talking to you!", bot_vi: "Tuyệt! Vui khi nói chuyện với bạn!", answer: "I like playing football.", options: [o("I like playing football.", "Mình thích chơi bóng đá."), o("I am a teacher.", "Mình là giáo viên."), o("Yes, please.", "Vâng, làm ơn.")] },
    ],
  },
  {
    id: "school", emoji: "🏫", title_vi: "Ở trường",
    prompt: "You are a classmate talking about school, subjects, and friends.",
    opening_en: "Hello! Do you like our school?", opening_vi: "Xin chào! Bạn có thích trường mình không?",
    steps: [
      { bot_en: "Me too! What's your favorite subject?", bot_vi: "Mình cũng thế! Môn bạn thích nhất là gì?", answer: "Yes, I love it!", options: [o("Yes, I love it!", "Có, mình rất thích!"), o("No, I am tired.", "Không, mình mệt."), o("It is a pen.", "Đó là cây bút.")] },
      { bot_en: "English is fun! Do you have many friends here?", bot_vi: "Tiếng Anh vui mà! Bạn có nhiều bạn ở đây không?", answer: "My favorite subject is English.", options: [o("My favorite subject is English.", "Môn mình thích nhất là tiếng Anh."), o("I am twelve.", "Mình mười hai tuổi."), o("Goodbye.", "Tạm biệt.")] },
      { bot_en: "That's wonderful!", bot_vi: "Thật tuyệt vời!", answer: "Yes, I have a lot of friends.", options: [o("Yes, I have a lot of friends.", "Có, mình có nhiều bạn."), o("I like pizza.", "Mình thích pizza."), o("Stand up.", "Đứng lên.")] },
    ],
  },
  {
    id: "restaurant", emoji: "🍔", title_vi: "Ở nhà hàng",
    prompt: "You are a waiter at a restaurant taking the child's order.",
    opening_en: "Welcome! What would you like to eat today?", opening_vi: "Chào mừng! Hôm nay con muốn ăn gì?",
    steps: [
      { bot_en: "Good choice! Would you like something to drink?", bot_vi: "Lựa chọn hay! Con muốn uống gì không?", answer: "I would like a burger, please.", options: [o("I would like a burger, please.", "Cho con một cái burger ạ."), o("I am ten.", "Con mười tuổi."), o("My name is Nam.", "Con tên Nam.")] },
      { bot_en: "Sure! Anything else?", bot_vi: "Được! Còn gì nữa không?", answer: "A glass of water, please.", options: [o("A glass of water, please.", "Cho con một ly nước ạ."), o("I like cats.", "Con thích mèo."), o("See you.", "Hẹn gặp lại.")] },
      { bot_en: "Okay! Your food is coming soon.", bot_vi: "Được rồi! Món ăn sẽ ra ngay.", answer: "No, thank you.", options: [o("No, thank you.", "Không, cảm ơn ạ."), o("I am happy.", "Con vui."), o("Open the door.", "Mở cửa ra.")] },
    ],
  },
  {
    id: "shopping", emoji: "🛍️", title_vi: "Đi mua sắm",
    prompt: "You are a shop assistant helping the child buy clothes or toys.",
    opening_en: "Hi there! Can I help you find something?", opening_vi: "Chào! Con cần tìm gì để mình giúp nhé?",
    steps: [
      { bot_en: "Sure! What color do you like?", bot_vi: "Được! Con thích màu gì?", answer: "Yes, I'm looking for a T-shirt.", options: [o("Yes, I'm looking for a T-shirt.", "Vâng, con đang tìm một cái áo thun."), o("I am hungry.", "Con đói."), o("Goodbye.", "Tạm biệt.")] },
      { bot_en: "Nice! What size do you need?", bot_vi: "Đẹp đó! Con cần cỡ nào?", answer: "I like the blue one.", options: [o("I like the blue one.", "Con thích cái màu xanh."), o("I am nine.", "Con chín tuổi."), o("It is raining.", "Trời đang mưa.")] },
      { bot_en: "Here you go! That's ten dollars.", bot_vi: "Của con đây! Hết mười đô la.", answer: "Medium, please.", options: [o("Medium, please.", "Cỡ vừa ạ."), o("I have a cat.", "Con có một con mèo."), o("Turn left.", "Rẽ trái.")] },
    ],
  },
  {
    id: "directions", emoji: "🗺️", title_vi: "Hỏi đường",
    prompt: "You are a friendly local person. The child asks you for directions.",
    opening_en: "Hello! You look lost. Where do you want to go?", opening_vi: "Xin chào! Con có vẻ lạc đường. Con muốn đến đâu?",
    steps: [
      { bot_en: "The library? Go straight and turn left.", bot_vi: "Thư viện à? Đi thẳng rồi rẽ trái.", answer: "I want to go to the library.", options: [o("I want to go to the library.", "Con muốn đến thư viện."), o("I am fine, thanks.", "Con khỏe, cảm ơn."), o("My name is Mai.", "Con tên Mai.")] },
      { bot_en: "You're welcome! It's next to the park.", bot_vi: "Không có gì! Nó nằm cạnh công viên.", answer: "Thank you very much!", options: [o("Thank you very much!", "Cảm ơn nhiều ạ!"), o("I am hungry.", "Con đói."), o("It is blue.", "Nó màu xanh.")] },
      { bot_en: "No, it's only five minutes away.", bot_vi: "Không, chỉ năm phút thôi.", answer: "Is it far from here?", options: [o("Is it far from here?", "Nó có xa đây không ạ?"), o("I like dogs.", "Con thích chó."), o("Sit down.", "Ngồi xuống.")] },
    ],
  },
  {
    id: "free", emoji: "💬", title_vi: "Tự do trò chuyện",
    prompt: "Have a free, friendly chat about anything the child likes.",
    opening_en: "Hi! What do you want to talk about today?", opening_vi: "Chào! Hôm nay con muốn nói về điều gì?",
    steps: [
      { bot_en: "I love animals! What's your favorite animal?", bot_vi: "Mình thích động vật! Con vật con thích nhất là gì?", answer: "Let's talk about animals.", options: [o("Let's talk about animals.", "Mình nói về động vật nhé."), o("I am ten.", "Con mười tuổi."), o("Goodbye.", "Tạm biệt.")] },
      { bot_en: "Dogs are great! Do you have a pet?", bot_vi: "Chó tuyệt lắm! Con có thú cưng không?", answer: "My favorite animal is the dog.", options: [o("My favorite animal is the dog.", "Con vật con thích nhất là chó."), o("I am a student.", "Con là học sinh."), o("It is red.", "Nó màu đỏ.")] },
      { bot_en: "That's lovely! Tell me more next time!", bot_vi: "Dễ thương quá! Lần sau kể thêm nhé!", answer: "Yes, I have a small dog.", options: [o("Yes, I have a small dog.", "Vâng, con có một con chó nhỏ."), o("Turn right.", "Rẽ phải."), o("I am sad.", "Con buồn.")] },
    ],
  },
];
