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
  // ── New scenarios ──
  {
    id: "airport", emoji: "✈️", title_vi: "Ở sân bay",
    prompt: "You are an airport check-in agent helping the child check in for a flight.",
    opening_en: "Good morning! May I see your passport and ticket, please?", opening_vi: "Chào buổi sáng! Cho tôi xem hộ chiếu và vé của bạn nhé?",
    steps: [
      { bot_en: "Thank you! Where are you flying to today?", bot_vi: "Cảm ơn! Hôm nay bạn bay đến đâu?", answer: "Here is my passport and ticket.", options: [o("Here is my passport and ticket.", "Đây là hộ chiếu và vé của tôi."), o("I like airplanes.", "Tôi thích máy bay."), o("What time is it?", "Mấy giờ rồi?")] },
      { bot_en: "Great! Do you have any bags to check in? 💡 check in = gửi hành lý", bot_vi: "Tốt! Bạn có hành lý nào cần gửi không?", answer: "I am flying to London.", options: [o("I am flying to London.", "Tôi bay đến London."), o("I am from Vietnam.", "Tôi đến từ Việt Nam."), o("The weather is nice.", "Thời tiết đẹp.")] },
      { bot_en: "Okay, please put it on the scale. 💡 scale = cân", bot_vi: "Được, làm ơn đặt lên cân.", answer: "Yes, I have one suitcase.", options: [o("Yes, I have one suitcase.", "Vâng, tôi có một vali."), o("No, I don't like bags.", "Không, tôi không thích túi."), o("I want to eat.", "Tôi muốn ăn.")] },
      { bot_en: "Your seat is 12A, a window seat. Here is your boarding pass. 💡 boarding pass = thẻ lên máy bay", bot_vi: "Chỗ của bạn là 12A, ghế cạnh cửa sổ. Đây là thẻ lên máy bay.", answer: "Can I have a window seat, please?", options: [o("Can I have a window seat, please?", "Cho tôi ghế cạnh cửa sổ được không?"), o("I want to go home.", "Tôi muốn về nhà."), o("Where is the park?", "Công viên ở đâu?")] },
      { bot_en: "Gate 5. Boarding starts at 10:30. Have a nice flight! 💡 gate = cổng", bot_vi: "Cổng 5. Bắt đầu lên máy bay lúc 10:30. Chúc chuyến bay vui vẻ!", answer: "Thank you! Which gate should I go to?", options: [o("Thank you! Which gate should I go to?", "Cảm ơn! Tôi nên đến cổng nào?"), o("I like to fly.", "Tôi thích bay."), o("Goodbye, teacher.", "Tạm biệt, thầy.")] },
    ],
  },
  {
    id: "doctor", emoji: "🩺", title_vi: "Đi khám bệnh",
    prompt: "You are a friendly doctor. The child comes to your office feeling sick.",
    opening_en: "Hello! I'm Dr. Smith. How are you feeling today?", opening_vi: "Xin chào! Tôi là bác sĩ Smith. Hôm nay con cảm thấy thế nào?",
    steps: [
      { bot_en: "Oh no! When did it start? 💡 when did it start = bắt đầu từ khi nào", bot_vi: "Ôi! Bắt đầu từ khi nào?", answer: "I have a headache and a sore throat.", options: [o("I have a headache and a sore throat.", "Con bị đau đầu và đau họng."), o("I am happy today.", "Hôm nay con vui."), o("I like ice cream.", "Con thích kem.")] },
      { bot_en: "Do you have a fever? Let me check your temperature. 💡 fever = sốt", bot_vi: "Con có bị sốt không? Để tôi đo nhiệt độ.", answer: "It started yesterday morning.", options: [o("It started yesterday morning.", "Bắt đầu từ sáng hôm qua."), o("I go to school.", "Con đi học."), o("My dog is cute.", "Con chó con dễ thương.")] },
      { bot_en: "You have a small fever. I will give you some medicine. 💡 medicine = thuốc", bot_vi: "Con bị sốt nhẹ. Tôi sẽ cho con thuốc.", answer: "Yes, I feel a little hot.", options: [o("Yes, I feel a little hot.", "Vâng, con cảm thấy hơi nóng."), o("I want to play.", "Con muốn chơi."), o("It is Monday.", "Hôm nay thứ Hai.")] },
      { bot_en: "Take this medicine twice a day. Drink lots of water and rest well. 💡 twice a day = ngày hai lần", bot_vi: "Uống thuốc này ngày hai lần. Uống nhiều nước và nghỉ ngơi nhé.", answer: "Okay, thank you, doctor.", options: [o("Okay, thank you, doctor.", "Vâng, cảm ơn bác sĩ."), o("I want more food.", "Con muốn thêm đồ ăn."), o("See you at school.", "Gặp lại ở trường.")] },
      { bot_en: "You're welcome! Come back if you don't feel better in two days.", bot_vi: "Không có gì! Quay lại nếu hai ngày nữa vẫn chưa khỏe nhé.", answer: "When should I come back?", options: [o("When should I come back?", "Khi nào con nên quay lại?"), o("I like your office.", "Con thích phòng khám."), o("My name is Lan.", "Con tên Lan.")] },
    ],
  },
  {
    id: "job-interview", emoji: "💼", title_vi: "Phỏng vấn xin việc",
    prompt: "You are an interviewer. The student is practicing for a simple job interview.",
    opening_en: "Good morning! Thank you for coming. Please, sit down.", opening_vi: "Chào buổi sáng! Cảm ơn bạn đã đến. Mời ngồi.",
    steps: [
      { bot_en: "Nice to meet you! Can you tell me about yourself?", bot_vi: "Rất vui được gặp! Bạn có thể kể về mình không?", answer: "Thank you for this opportunity.", options: [o("Thank you for this opportunity.", "Cảm ơn vì cơ hội này."), o("I like your shirt.", "Tôi thích áo của anh."), o("Where is the exit?", "Lối ra ở đâu?")] },
      { bot_en: "That's great! Why do you want this job? 💡 why do you want = tại sao bạn muốn", bot_vi: "Tuyệt! Tại sao bạn muốn công việc này?", answer: "I am a student and I study hard.", options: [o("I am a student and I study hard.", "Tôi là sinh viên và tôi học chăm."), o("I have two cats.", "Tôi có hai con mèo."), o("It is sunny today.", "Hôm nay trời nắng.")] },
      { bot_en: "Good answer! What are you good at? 💡 good at = giỏi về", bot_vi: "Câu trả lời hay! Bạn giỏi về gì?", answer: "I want to learn new things and meet people.", options: [o("I want to learn new things and meet people.", "Tôi muốn học điều mới và gặp gỡ mọi người."), o("I eat lunch at noon.", "Tôi ăn trưa lúc 12 giờ."), o("The book is on the table.", "Cuốn sách ở trên bàn.")] },
      { bot_en: "Wonderful! Can you work on weekends? 💡 weekends = cuối tuần", bot_vi: "Tuyệt vời! Bạn có thể làm cuối tuần không?", answer: "I am good at English and teamwork.", options: [o("I am good at English and teamwork.", "Tôi giỏi tiếng Anh và làm việc nhóm."), o("I live near the school.", "Tôi sống gần trường."), o("I don't like rain.", "Tôi không thích mưa.")] },
      { bot_en: "We will contact you soon. Thank you for your time! 💡 contact = liên hệ", bot_vi: "Chúng tôi sẽ liên hệ bạn sớm. Cảm ơn bạn!", answer: "Yes, I can work on Saturdays.", options: [o("Yes, I can work on Saturdays.", "Vâng, tôi có thể làm thứ Bảy."), o("I play games every day.", "Tôi chơi game mỗi ngày."), o("My room is big.", "Phòng tôi rộng.")] },
      { bot_en: "Goodbye! Have a nice day.", bot_vi: "Tạm biệt! Chúc một ngày tốt lành.", answer: "Thank you! I look forward to hearing from you.", options: [o("Thank you! I look forward to hearing from you.", "Cảm ơn! Tôi mong chờ tin từ anh."), o("I am hungry now.", "Tôi đang đói."), o("Where is the bus stop?", "Trạm xe buýt ở đâu?")] },
    ],
  },
  {
    id: "restaurant-full", emoji: "🍽️", title_vi: "Gọi món & thanh toán",
    prompt: "You are a waiter at a restaurant. Help the student order food and pay the bill.",
    opening_en: "Good evening! Welcome to our restaurant. A table for how many?", opening_vi: "Chào buổi tối! Chào mừng đến nhà hàng. Bàn cho mấy người?",
    steps: [
      { bot_en: "Right this way! Here is the menu. 💡 menu = thực đơn", bot_vi: "Mời đi lối này! Đây là thực đơn.", answer: "A table for two, please.", options: [o("A table for two, please.", "Cho bàn hai người ạ."), o("I am not hungry.", "Tôi không đói."), o("My name is Hoa.", "Tôi tên Hoa.")] },
      { bot_en: "The chicken pasta is very popular. Would you like to try it? 💡 popular = được ưa chuộng", bot_vi: "Mì gà rất được ưa chuộng. Bạn muốn thử không?", answer: "What do you recommend?", options: [o("What do you recommend?", "Anh gợi ý món gì?"), o("I like your restaurant.", "Tôi thích nhà hàng."), o("It is cold outside.", "Bên ngoài trời lạnh.")] },
      { bot_en: "Of course! And what would you like to drink?", bot_vi: "Tất nhiên! Và bạn muốn uống gì?", answer: "Yes, I'll have the chicken pasta.", options: [o("Yes, I'll have the chicken pasta.", "Vâng, cho tôi mì gà."), o("I don't like cooking.", "Tôi không thích nấu ăn."), o("The table is nice.", "Cái bàn đẹp.")] },
      { bot_en: "Sure! I'll bring your order shortly. 💡 shortly = ngay thôi", bot_vi: "Được! Tôi sẽ mang ra ngay.", answer: "An orange juice, please.", options: [o("An orange juice, please.", "Cho tôi nước cam ạ."), o("I drink water at home.", "Tôi uống nước ở nhà."), o("I want to go.", "Tôi muốn đi.")] },
      { bot_en: "Of course! The total is fifteen dollars. 💡 total = tổng cộng", bot_vi: "Tất nhiên! Tổng cộng mười lăm đô la.", answer: "Excuse me, can I have the bill, please?", options: [o("Excuse me, can I have the bill, please?", "Xin lỗi, cho tôi hóa đơn được không?"), o("The food is on the table.", "Đồ ăn ở trên bàn."), o("I want dessert.", "Tôi muốn tráng miệng.")] },
      { bot_en: "You're welcome! Thank you for coming. Have a good night!", bot_vi: "Không có gì! Cảm ơn đã đến. Chúc buổi tối vui!", answer: "Here you go. Thank you, the food was delicious!", options: [o("Here you go. Thank you, the food was delicious!", "Của anh đây. Cảm ơn, đồ ăn rất ngon!"), o("I eat every day.", "Tôi ăn mỗi ngày."), o("See you tomorrow.", "Gặp lại ngày mai.")] },
    ],
  },
  {
    id: "shopping-full", emoji: "👗", title_vi: "Mua sắm quần áo",
    prompt: "You are a shop assistant helping the student buy clothes. Help with sizes, prices, and returns.",
    opening_en: "Hello! Welcome to our store. Are you looking for something special?", opening_vi: "Xin chào! Chào mừng đến cửa hàng. Bạn đang tìm gì đặc biệt không?",
    steps: [
      { bot_en: "Sure! What size do you wear? We have small, medium, and large. 💡 size = cỡ, kích thước", bot_vi: "Được! Bạn mặc cỡ nào? Chúng tôi có nhỏ, vừa, và lớn.", answer: "Yes, I need a new jacket.", options: [o("Yes, I need a new jacket.", "Vâng, tôi cần một cái áo khoác mới."), o("I like this store.", "Tôi thích cửa hàng này."), o("No, I am just walking.", "Không, tôi chỉ đi dạo.")] },
      { bot_en: "Here are some medium jackets. Do you like this one?", bot_vi: "Đây là mấy cái áo khoác cỡ vừa. Bạn thích cái này không?", answer: "I think I am a medium.", options: [o("I think I am a medium.", "Tôi nghĩ tôi mặc cỡ vừa."), o("I am very tall.", "Tôi rất cao."), o("The jacket is warm.", "Cái áo khoác ấm.")] },
      { bot_en: "Of course! The fitting room is over there. 💡 fitting room = phòng thử đồ", bot_vi: "Tất nhiên! Phòng thử đồ ở đằng kia.", answer: "It looks nice! Can I try it on?", options: [o("It looks nice! Can I try it on?", "Trông đẹp! Tôi thử được không?"), o("I don't want it.", "Tôi không muốn."), o("What color is it?", "Nó màu gì?")] },
      { bot_en: "It's twenty-five dollars. Would you like to buy it? 💡 twenty-five dollars = 25 đô la", bot_vi: "Hai mươi lăm đô la. Bạn muốn mua không?", answer: "It fits perfectly! How much is it?", options: [o("It fits perfectly! How much is it?", "Vừa vặn lắm! Giá bao nhiêu?"), o("I am going home.", "Tôi đang về nhà."), o("I need shoes.", "Tôi cần giày.")] },
      { bot_en: "Yes, you can return it within seven days with the receipt. 💡 receipt = hóa đơn, biên lai", bot_vi: "Được, bạn có thể trả lại trong bảy ngày nếu có hóa đơn.", answer: "Yes, I'll take it. Can I return it if it doesn't fit?", options: [o("Yes, I'll take it. Can I return it if it doesn't fit?", "Vâng, tôi mua. Tôi có thể trả lại nếu không vừa không?"), o("I want a cheaper one.", "Tôi muốn cái rẻ hơn."), o("Give me two.", "Cho tôi hai cái.")] },
    ],
  },
  {
    id: "hotel", emoji: "🏨", title_vi: "Nhận phòng khách sạn",
    prompt: "You are a hotel receptionist. Help the student check in and answer questions about the room.",
    opening_en: "Welcome to our hotel! Do you have a reservation? 💡 reservation = đặt phòng trước", opening_vi: "Chào mừng đến khách sạn! Bạn có đặt phòng trước không?",
    steps: [
      { bot_en: "Let me check. Yes, I found it! A room for two nights, is that right?", bot_vi: "Để tôi kiểm tra. Có rồi! Phòng cho hai đêm, đúng không?", answer: "Yes, I booked a room under the name Nguyen.", options: [o("Yes, I booked a room under the name Nguyen.", "Vâng, tôi đặt phòng dưới tên Nguyen."), o("No, I just arrived.", "Không, tôi vừa đến."), o("I like hotels.", "Tôi thích khách sạn.")] },
      { bot_en: "We have a room on the third floor with a nice view. 💡 floor = tầng", bot_vi: "Chúng tôi có phòng ở tầng ba với view đẹp.", answer: "That's correct. Can I have a quiet room?", options: [o("That's correct. Can I have a quiet room?", "Đúng rồi. Cho tôi phòng yên tĩnh được không?"), o("I want to go home.", "Tôi muốn về nhà."), o("How old is the hotel?", "Khách sạn bao nhiêu tuổi?")] },
      { bot_en: "Breakfast is from 7 to 10 in the morning, on the first floor.", bot_vi: "Bữa sáng từ 7 đến 10 giờ sáng, ở tầng một.", answer: "That sounds great! What time is breakfast?", options: [o("That sounds great! What time is breakfast?", "Nghe tuyệt! Mấy giờ ăn sáng?"), o("I am hungry now.", "Tôi đang đói."), o("I sleep early.", "Tôi ngủ sớm.")] },
      { bot_en: "Yes, the password is on the card in your room. 💡 password = mật khẩu", bot_vi: "Có, mật khẩu ở trên thẻ trong phòng bạn.", answer: "Is there free Wi-Fi?", options: [o("Is there free Wi-Fi?", "Có Wi-Fi miễn phí không?"), o("I like the Internet.", "Tôi thích Internet."), o("Where is the pool?", "Hồ bơi ở đâu?")] },
      { bot_en: "Here is your key card. Room 305. The elevator is on your right. Enjoy your stay! 💡 elevator = thang máy", bot_vi: "Đây là thẻ phòng. Phòng 305. Thang máy bên phải. Chúc ở vui!", answer: "Thank you very much!", options: [o("Thank you very much!", "Cảm ơn rất nhiều!"), o("I want another room.", "Tôi muốn phòng khác."), o("Goodbye, see you.", "Tạm biệt, hẹn gặp.")] },
    ],
  },
  {
    id: "directions-street", emoji: "🧭", title_vi: "Hỏi đường trên phố",
    prompt: "You are a kind stranger on the street. The student asks you for directions to different places.",
    opening_en: "Excuse me! Can you help me? I'm looking for the train station. 💡 train station = nhà ga", opening_vi: "Xin lỗi! Bạn giúp tôi được không? Tôi đang tìm nhà ga.",
    steps: [
      { bot_en: "Go straight for two blocks, then turn right. You'll see it on the left. 💡 blocks = dãy nhà", bot_vi: "Đi thẳng hai dãy nhà, rồi rẽ phải. Bạn sẽ thấy ở bên trái.", answer: "Sure! Where is it exactly?", options: [o("Sure! Where is it exactly?", "Được! Nó ở đâu chính xác?"), o("I like trains.", "Tôi thích tàu."), o("No, I can't.", "Không, tôi không thể.")] },
      { bot_en: "It's about ten minutes on foot, or you can take bus number 5. 💡 on foot = đi bộ", bot_vi: "Khoảng mười phút đi bộ, hoặc bạn có thể đi xe buýt số 5.", answer: "Is it far? Can I walk there?", options: [o("Is it far? Can I walk there?", "Có xa không? Tôi đi bộ được không?"), o("I am tired.", "Tôi mệt."), o("Where is my bag?", "Túi tôi ở đâu?")] },
      { bot_en: "The bus stop is right across the street, next to the coffee shop.", bot_vi: "Trạm xe buýt ngay bên kia đường, cạnh quán cà phê.", answer: "Where is the bus stop?", options: [o("Where is the bus stop?", "Trạm xe buýt ở đâu?"), o("I don't like coffee.", "Tôi không thích cà phê."), o("It is very hot.", "Trời rất nóng.")] },
      { bot_en: "You're welcome! The bus comes every ten minutes.", bot_vi: "Không có gì! Xe buýt đến mỗi mười phút.", answer: "Thank you so much for your help!", options: [o("Thank you so much for your help!", "Cảm ơn bạn rất nhiều vì đã giúp!"), o("I want to go home.", "Tôi muốn về nhà."), o("What is your name?", "Bạn tên gì?")] },
      { bot_en: "Have a great day! Good luck!", bot_vi: "Chúc bạn một ngày tốt lành!", answer: "You too! Goodbye!", options: [o("You too! Goodbye!", "Bạn cũng vậy! Tạm biệt!"), o("I am lost again.", "Tôi lại lạc rồi."), o("Wait for me.", "Đợi tôi.")] },
    ],
  },
  {
    id: "phone-call", emoji: "📞", title_vi: "Gọi điện thoại",
    prompt: "You are an office receptionist answering the phone. The student calls and wants to leave a message.",
    opening_en: "Hello, this is ABC Company. How can I help you?", opening_vi: "Xin chào, đây là công ty ABC. Tôi giúp gì được?",
    steps: [
      { bot_en: "I'm sorry, Mr. Johnson is in a meeting right now. Can I take a message? 💡 take a message = nhắn lại", bot_vi: "Xin lỗi, anh Johnson đang họp. Tôi nhắn lại được không?", answer: "Hi, can I speak to Mr. Johnson, please?", options: [o("Hi, can I speak to Mr. Johnson, please?", "Xin chào, cho tôi nói chuyện với anh Johnson được không?"), o("I like your company.", "Tôi thích công ty."), o("What is your phone number?", "Số điện thoại của bạn là gì?")] },
      { bot_en: "Sure! What is your name and phone number?", bot_vi: "Được! Tên và số điện thoại của bạn là gì?", answer: "Yes, please. Can you tell him I called?", options: [o("Yes, please. Can you tell him I called?", "Vâng, làm ơn nói anh ấy tôi đã gọi."), o("No, I will come later.", "Không, tôi sẽ đến sau."), o("I don't have a phone.", "Tôi không có điện thoại.")] },
      { bot_en: "Got it! What would you like me to tell him?", bot_vi: "Được rồi! Bạn muốn tôi nhắn gì?", answer: "My name is Lan and my number is 0901-234-567.", options: [o("My name is Lan and my number is 0901-234-567.", "Tôi tên Lan, số tôi là 0901-234-567."), o("I forgot my number.", "Tôi quên số rồi."), o("Can you call me back?", "Bạn gọi lại cho tôi được không?")] },
      { bot_en: "Okay, I'll pass on the message. Is there anything else?", bot_vi: "Được, tôi sẽ chuyển lời. Còn gì nữa không?", answer: "Please tell him to call me back about the meeting tomorrow.", options: [o("Please tell him to call me back about the meeting tomorrow.", "Nhờ anh ấy gọi lại cho tôi về cuộc họp ngày mai."), o("I like meetings.", "Tôi thích họp."), o("Tell him I said hi.", "Nói anh ấy tôi chào.")] },
      { bot_en: "You're welcome! I'll make sure he gets your message. Goodbye!", bot_vi: "Không có gì! Tôi sẽ chắc chắn anh ấy nhận được tin nhắn. Tạm biệt!", answer: "No, that's all. Thank you very much!", options: [o("No, that's all. Thank you very much!", "Không, vậy thôi. Cảm ơn rất nhiều!"), o("I want to wait.", "Tôi muốn đợi."), o("Call me now.", "Gọi cho tôi bây giờ.")] },
    ],
  },
  {
    id: "bank", emoji: "🏦", title_vi: "Ở ngân hàng",
    prompt: "You are a bank teller helping the student with banking tasks like exchanging money.",
    opening_en: "Hello! Welcome to the bank. How can I help you today?", opening_vi: "Xin chào! Chào mừng đến ngân hàng. Tôi giúp gì cho bạn?",
    steps: [
      { bot_en: "Of course! How much would you like to exchange? 💡 exchange = đổi tiền", bot_vi: "Tất nhiên! Bạn muốn đổi bao nhiêu?", answer: "I would like to exchange some money, please.", options: [o("I would like to exchange some money, please.", "Tôi muốn đổi tiền ạ."), o("I want to buy something.", "Tôi muốn mua đồ."), o("Where is the ATM?", "Máy ATM ở đâu?")] },
      { bot_en: "The exchange rate today is one dollar to twenty-five thousand dong. 💡 exchange rate = tỷ giá", bot_vi: "Tỷ giá hôm nay là một đô la bằng hai mươi lăm nghìn đồng.", answer: "I want to exchange one hundred dollars.", options: [o("I want to exchange one hundred dollars.", "Tôi muốn đổi một trăm đô la."), o("I have a lot of money.", "Tôi có nhiều tiền."), o("How far is the bank?", "Ngân hàng cách bao xa?")] },
      { bot_en: "Sure! Can I see your passport or ID card, please? 💡 ID card = chứng minh thư", bot_vi: "Được! Cho tôi xem hộ chiếu hoặc chứng minh thư?", answer: "Okay, that sounds good.", options: [o("Okay, that sounds good.", "Được, nghe tốt."), o("That is too expensive.", "Đắt quá."), o("I don't understand.", "Tôi không hiểu.")] },
      { bot_en: "Thank you! Please sign here. Here is your money. 💡 sign = ký tên", bot_vi: "Cảm ơn! Vui lòng ký tên ở đây. Đây là tiền của bạn.", answer: "Here is my passport.", options: [o("Here is my passport.", "Đây là hộ chiếu của tôi."), o("I lost my passport.", "Tôi mất hộ chiếu."), o("I don't have ID.", "Tôi không có chứng minh thư.")] },
      { bot_en: "You're welcome! Have a good day!", bot_vi: "Không có gì! Chúc một ngày tốt lành!", answer: "Thank you! Can I have a receipt?", options: [o("Thank you! Can I have a receipt?", "Cảm ơn! Cho tôi biên lai được không?"), o("I want more money.", "Tôi muốn thêm tiền."), o("Where is the exit?", "Lối ra ở đâu?")] },
    ],
  },
  {
    id: "emergency", emoji: "🚨", title_vi: "Tình huống khẩn cấp",
    prompt: "You are a police officer. The student reports a lost item or an incident.",
    opening_en: "Hello, this is the police station. What happened? Are you okay? 💡 police station = đồn cảnh sát", opening_vi: "Xin chào, đây là đồn cảnh sát. Chuyện gì xảy ra? Bạn có ổn không?",
    steps: [
      { bot_en: "I'm sorry to hear that! Where did you lose it? 💡 lose = đánh mất", bot_vi: "Tôi rất tiếc! Bạn bị mất ở đâu?", answer: "I am okay, but I lost my bag.", options: [o("I am okay, but I lost my bag.", "Tôi ổn, nhưng tôi bị mất túi."), o("I am very scared.", "Tôi rất sợ."), o("Someone took my phone.", "Ai đó lấy điện thoại tôi.")] },
      { bot_en: "What does your bag look like? What color is it? 💡 look like = trông như thế nào", bot_vi: "Túi bạn trông thế nào? Màu gì?", answer: "I think I lost it at the park this morning.", options: [o("I think I lost it at the park this morning.", "Tôi nghĩ tôi mất ở công viên sáng nay."), o("I was at school.", "Tôi ở trường."), o("I don't remember.", "Tôi không nhớ.")] },
      { bot_en: "What was inside the bag?", bot_vi: "Trong túi có gì?", answer: "It is a small black backpack.", options: [o("It is a small black backpack.", "Đó là ba lô nhỏ màu đen."), o("It is very expensive.", "Nó rất đắt."), o("I bought it yesterday.", "Tôi mua nó hôm qua.")] },
      { bot_en: "Okay, I will write a report. Can I have your phone number? 💡 report = biên bản", bot_vi: "Được, tôi sẽ viết biên bản. Cho tôi số điện thoại?", answer: "My phone, my wallet, and a book.", options: [o("My phone, my wallet, and a book.", "Điện thoại, ví tiền, và một cuốn sách."), o("Nothing important.", "Không có gì quan trọng."), o("I don't know.", "Tôi không biết.")] },
      { bot_en: "We will look for your bag. If someone finds it, we will call you.", bot_vi: "Chúng tôi sẽ tìm túi của bạn. Nếu ai tìm thấy, chúng tôi sẽ gọi.", answer: "My number is 0912-345-678. Thank you for your help!", options: [o("My number is 0912-345-678. Thank you for your help!", "Số tôi là 0912-345-678. Cảm ơn đã giúp!"), o("Please find it quickly.", "Làm ơn tìm nhanh."), o("I am going home.", "Tôi về nhà đây.")] },
    ],
  },
  {
    id: "new-friends", emoji: "🤝", title_vi: "Làm quen bạn mới",
    prompt: "You are a friendly kid at a summer camp. Make small talk and get to know each other.",
    opening_en: "Hey! I haven't seen you here before. Are you new? 💡 new = mới đến", opening_vi: "Này! Mình chưa thấy bạn ở đây. Bạn mới đến hả?",
    steps: [
      { bot_en: "Cool! Where are you from?", bot_vi: "Hay! Bạn đến từ đâu?", answer: "Yes, this is my first time here.", options: [o("Yes, this is my first time here.", "Ừ, đây là lần đầu mình đến đây."), o("No, I come here every day.", "Không, mình đến đây mỗi ngày."), o("I don't like this place.", "Mình không thích chỗ này.")] },
      { bot_en: "Vietnam! That's awesome! What do you like to do for fun? 💡 for fun = để vui", bot_vi: "Việt Nam! Tuyệt! Bạn thích làm gì cho vui?", answer: "I am from Vietnam.", options: [o("I am from Vietnam.", "Mình đến từ Việt Nam."), o("I am from the city.", "Mình đến từ thành phố."), o("I don't know.", "Mình không biết.")] },
      { bot_en: "Me too! Do you want to play together after lunch?", bot_vi: "Mình cũng thế! Bạn muốn chơi cùng sau bữa trưa không?", answer: "I like swimming and playing video games.", options: [o("I like swimming and playing video games.", "Mình thích bơi và chơi điện tử."), o("I like sleeping.", "Mình thích ngủ."), o("I don't have hobbies.", "Mình không có sở thích.")] },
      { bot_en: "Great! Let's meet at the pool at two o'clock. 💡 pool = hồ bơi", bot_vi: "Tuyệt! Gặp nhau ở hồ bơi lúc hai giờ nhé.", answer: "Sure! That sounds like fun!", options: [o("Sure! That sounds like fun!", "Chắc chắn! Nghe vui đó!"), o("I can't swim.", "Mình không biết bơi."), o("Maybe next time.", "Có lẽ lần sau.")] },
      { bot_en: "See you later! It was nice meeting you!", bot_vi: "Gặp lại sau! Rất vui được gặp bạn!", answer: "See you at two! Nice to meet you too!", options: [o("See you at two! Nice to meet you too!", "Gặp lại lúc hai giờ! Mình cũng rất vui!"), o("Goodbye forever.", "Tạm biệt vĩnh viễn."), o("I will think about it.", "Mình sẽ suy nghĩ.")] },
    ],
  },
  {
    id: "school-teacher", emoji: "📚", title_vi: "Nói chuyện với thầy cô",
    prompt: "You are a school teacher. The student talks to you about homework, classes, and questions.",
    opening_en: "Good morning! Come in. How are you today?", opening_vi: "Chào buổi sáng! Vào đi. Hôm nay em thế nào?",
    steps: [
      { bot_en: "What do you need help with?", bot_vi: "Em cần giúp gì?", answer: "Good morning, teacher! I have a question about the homework.", options: [o("Good morning, teacher! I have a question about the homework.", "Chào cô! Em có câu hỏi về bài tập."), o("I don't have homework.", "Em không có bài tập."), o("I am late, sorry.", "Em trễ, xin lỗi.")] },
      { bot_en: "Of course! You need to write five sentences about your family. 💡 sentences = câu", bot_vi: "Tất nhiên! Em cần viết năm câu về gia đình.", answer: "I don't understand the English writing exercise.", options: [o("I don't understand the English writing exercise.", "Em không hiểu bài tập viết tiếng Anh."), o("I finished all my homework.", "Em làm xong bài tập rồi."), o("Can I go home early?", "Em về sớm được không?")] },
      { bot_en: "Sure! For example: My mother's name is Hoa. She is a teacher. 💡 for example = ví dụ", bot_vi: "Được! Ví dụ: Mẹ em tên Hoa. Bà ấy là giáo viên.", answer: "Can you give me an example, please?", options: [o("Can you give me an example, please?", "Cô cho em một ví dụ được không?"), o("I don't want to write.", "Em không muốn viết."), o("My family is big.", "Gia đình em đông.")] },
      { bot_en: "The homework is due on Friday. Take your time!", bot_vi: "Bài tập nộp vào thứ Sáu. Từ từ làm nhé!", answer: "I understand now! When is the homework due?", options: [o("I understand now! When is the homework due?", "Em hiểu rồi! Khi nào nộp bài ạ?"), o("I will do it now.", "Em sẽ làm ngay."), o("Friday is my birthday.", "Thứ Sáu là sinh nhật em.")] },
      { bot_en: "You're welcome! Good luck with your homework. Study hard!", bot_vi: "Không có gì! Chúc em làm bài tốt. Cố lên!", answer: "Thank you, teacher! I will finish it on time.", options: [o("Thank you, teacher! I will finish it on time.", "Cảm ơn cô! Em sẽ hoàn thành đúng hạn."), o("I need more time.", "Em cần thêm thời gian."), o("Goodbye, see you Monday.", "Tạm biệt, gặp lại thứ Hai.")] },
    ],
  },
];
