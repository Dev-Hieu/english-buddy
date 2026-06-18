import type { VocabularyWord } from "../../types";
import { mk } from "./_mk";

// mk(level, id, word, phonetic, meaning_vi, meaning_en, example, example_vi, topicIds)
export const A2_WORDS: VocabularyWord[] = [
  // Travel
  mk("a2", "word_a2_airport", "airport", "/ˈeə.pɔːt/", "sân bay", "a place where planes take off", "We waited at the airport.", "Chúng tôi đợi ở sân bay.", ["topic_travel"]),
  mk("a2", "word_a2_passport", "passport", "/ˈpɑːs.pɔːt/", "hộ chiếu", "a document for foreign travel", "Don't forget your passport.", "Đừng quên hộ chiếu của bạn.", ["topic_travel"]),
  mk("a2", "word_a2_luggage", "luggage", "/ˈlʌɡ.ɪdʒ/", "hành lý", "bags you take when travelling", "My luggage is very heavy.", "Hành lý của tôi rất nặng.", ["topic_travel"]),
  mk("a2", "word_a2_tourist", "tourist", "/ˈtʊə.rɪst/", "khách du lịch", "a person who travels for fun", "Many tourists visit the old town.", "Nhiều khách du lịch ghé thăm phố cổ.", ["topic_travel"]),
  mk("a2", "word_a2_journey", "journey", "/ˈdʒɜː.ni/", "chuyến đi", "an act of travelling somewhere", "The journey took three hours.", "Chuyến đi mất ba giờ.", ["topic_travel"]),
  mk("a2", "word_a2_souvenir", "souvenir", "/ˌsuː.vənˈɪər/", "quà lưu niệm", "a thing you buy to remember a trip", "She bought a souvenir for her mom.", "Cô ấy mua quà lưu niệm cho mẹ.", ["topic_travel"]),

  // Sports
  mk("a2", "word_a2_team", "team", "/tiːm/", "đội", "a group of players", "Our team won the game.", "Đội của chúng tôi đã thắng trận.", ["topic_sports"]),
  mk("a2", "word_a2_coach", "coach", "/kəʊtʃ/", "huấn luyện viên", "a person who trains a team", "The coach gave us good advice.", "Huấn luyện viên cho chúng tôi lời khuyên hay.", ["topic_sports"]),
  mk("a2", "word_a2_match", "match", "/mætʃ/", "trận đấu", "a sports game between two sides", "We watched a football match.", "Chúng tôi xem một trận bóng đá.", ["topic_sports"]),
  mk("a2", "word_a2_swimming", "swimming", "/ˈswɪm.ɪŋ/", "bơi lội", "the activity of moving in water", "Swimming is good for your health.", "Bơi lội tốt cho sức khỏe.", ["topic_sports"]),
  mk("a2", "word_a2_stadium", "stadium", "/ˈsteɪ.di.əm/", "sân vận động", "a large place for sports events", "The stadium was full of fans.", "Sân vận động đầy người hâm mộ.", ["topic_sports"]),
  mk("a2", "word_a2_exercise", "exercise", "/ˈek.sə.saɪz/", "tập thể dục", "physical activity to stay fit", "I do exercise every morning.", "Tôi tập thể dục mỗi sáng.", ["topic_sports"]),

  // Feelings
  mk("a2", "word_a2_excited", "excited", "/ɪkˈsaɪ.tɪd/", "phấn khích", "feeling very happy and eager", "She was excited about the trip.", "Cô ấy phấn khích về chuyến đi.", ["topic_feelings"]),
  mk("a2", "word_a2_nervous", "nervous", "/ˈnɜː.vəs/", "lo lắng", "worried or a little afraid", "He felt nervous before the exam.", "Anh ấy lo lắng trước kỳ thi.", ["topic_feelings"]),
  mk("a2", "word_a2_bored", "bored", "/bɔːd/", "chán", "not interested, tired of something", "The kids were bored at home.", "Bọn trẻ thấy chán ở nhà.", ["topic_feelings"]),
  mk("a2", "word_a2_proud", "proud", "/praʊd/", "tự hào", "feeling happy about something good", "I am proud of my sister.", "Tôi tự hào về em gái mình.", ["topic_feelings"]),
  mk("a2", "word_a2_surprised", "surprised", "/səˈpraɪzd/", "ngạc nhiên", "feeling shocked by something unexpected", "We were surprised by the gift.", "Chúng tôi ngạc nhiên vì món quà.", ["topic_feelings"]),
  mk("a2", "word_a2_lonely", "lonely", "/ˈləʊn.li/", "cô đơn", "feeling sad because you are alone", "He felt lonely in the new city.", "Anh ấy thấy cô đơn ở thành phố mới.", ["topic_feelings"]),

  // Daily
  mk("a2", "word_a2_wake", "wake", "/weɪk/", "thức dậy", "to stop sleeping", "I wake up at six o'clock.", "Tôi thức dậy lúc sáu giờ.", ["topic_daily"]),
  mk("a2", "word_a2_brush", "brush", "/brʌʃ/", "chải, đánh răng", "to clean with a brush", "I brush my teeth twice a day.", "Tôi đánh răng hai lần một ngày.", ["topic_daily"]),
  mk("a2", "word_a2_shower", "shower", "/ˈʃaʊ.ər/", "tắm vòi sen", "to wash your body under water", "She takes a shower in the morning.", "Cô ấy tắm vòi sen vào buổi sáng.", ["topic_daily"]),
  mk("a2", "word_a2_relax", "relax", "/rɪˈlæks/", "thư giãn", "to rest and feel calm", "I relax after a long day.", "Tôi thư giãn sau một ngày dài.", ["topic_daily"]),
  mk("a2", "word_a2_clean", "clean", "/kliːn/", "lau dọn", "to remove dirt from something", "We clean the house on Sunday.", "Chúng tôi dọn nhà vào Chủ nhật.", ["topic_daily"]),
  mk("a2", "word_a2_busy", "busy", "/ˈbɪz.i/", "bận rộn", "having a lot to do", "I am very busy this week.", "Tuần này tôi rất bận.", ["topic_daily"]),

  // School
  mk("a2", "word_a2_homework", "homework", "/ˈhəʊm.wɜːk/", "bài tập về nhà", "school work done at home", "I finished my homework early.", "Tôi làm xong bài tập về nhà sớm.", ["topic_school"]),
  mk("a2", "word_a2_teacher", "teacher", "/ˈtiː.tʃər/", "giáo viên", "a person who teaches students", "Our teacher is very kind.", "Giáo viên của chúng tôi rất tốt bụng.", ["topic_school"]),
  mk("a2", "word_a2_lesson", "lesson", "/ˈles.ən/", "bài học", "a period of teaching", "The English lesson was fun.", "Bài học tiếng Anh rất vui.", ["topic_school"]),
  mk("a2", "word_a2_dictionary", "dictionary", "/ˈdɪk.ʃən.ər.i/", "từ điển", "a book of word meanings", "I use a dictionary to learn words.", "Tôi dùng từ điển để học từ.", ["topic_school"]),
  mk("a2", "word_a2_classmate", "classmate", "/ˈklɑːs.meɪt/", "bạn cùng lớp", "a person in the same class", "My classmate helped me study.", "Bạn cùng lớp giúp tôi học bài.", ["topic_school"]),
  mk("a2", "word_a2_exam", "exam", "/ɪɡˈzæm/", "kỳ thi", "an important test", "We have an exam next week.", "Chúng tôi có kỳ thi vào tuần tới.", ["topic_school"]),

  // Food
  mk("a2", "word_a2_breakfast", "breakfast", "/ˈbrek.fəst/", "bữa sáng", "the first meal of the day", "I eat breakfast at home.", "Tôi ăn sáng ở nhà.", ["topic_food"]),
  mk("a2", "word_a2_vegetable", "vegetable", "/ˈvedʒ.tə.bəl/", "rau củ", "a plant used as food", "She eats a lot of vegetables.", "Cô ấy ăn nhiều rau củ.", ["topic_food"]),
  mk("a2", "word_a2_delicious", "delicious", "/dɪˈlɪʃ.əs/", "ngon", "tasting very good", "This soup is delicious.", "Món súp này rất ngon.", ["topic_food"]),
  mk("a2", "word_a2_dinner", "dinner", "/ˈdɪn.ər/", "bữa tối", "the main evening meal", "We have dinner together.", "Chúng tôi ăn tối cùng nhau.", ["topic_food"]),
  mk("a2", "word_a2_snack", "snack", "/snæk/", "đồ ăn vặt", "a small amount of food", "I had a snack after school.", "Tôi ăn vặt sau giờ học.", ["topic_food"]),
  mk("a2", "word_a2_recipe", "recipe", "/ˈres.ɪ.pi/", "công thức nấu ăn", "instructions for cooking food", "My mom has a great recipe.", "Mẹ tôi có công thức nấu ăn tuyệt vời.", ["topic_food"]),

  // House
  mk("a2", "word_a2_kitchen", "kitchen", "/ˈkɪtʃ.ɪn/", "nhà bếp", "a room where you cook", "She is cooking in the kitchen.", "Cô ấy đang nấu ăn trong bếp.", ["topic_house"]),
  mk("a2", "word_a2_bedroom", "bedroom", "/ˈbed.ruːm/", "phòng ngủ", "a room for sleeping", "My bedroom is upstairs.", "Phòng ngủ của tôi ở trên gác.", ["topic_house"]),
  mk("a2", "word_a2_furniture", "furniture", "/ˈfɜː.nɪ.tʃər/", "đồ nội thất", "tables, chairs and other items", "We bought new furniture.", "Chúng tôi mua đồ nội thất mới.", ["topic_house"]),
  mk("a2", "word_a2_garden", "garden", "/ˈɡɑː.dən/", "khu vườn", "land for growing plants", "There are flowers in the garden.", "Có hoa trong khu vườn.", ["topic_house"]),
  mk("a2", "word_a2_window", "window", "/ˈwɪn.dəʊ/", "cửa sổ", "an opening in a wall with glass", "Please open the window.", "Làm ơn mở cửa sổ.", ["topic_house"]),

  // Clothes
  mk("a2", "word_a2_jacket", "jacket", "/ˈdʒæk.ɪt/", "áo khoác", "a short coat", "He wore a warm jacket.", "Anh ấy mặc một chiếc áo khoác ấm.", ["topic_clothes"]),
  mk("a2", "word_a2_scarf", "scarf", "/skɑːf/", "khăn quàng", "a piece of cloth for the neck", "She put on a red scarf.", "Cô ấy quàng một chiếc khăn đỏ.", ["topic_clothes"]),
  mk("a2", "word_a2_gloves", "gloves", "/ɡlʌvz/", "găng tay", "coverings for the hands", "I wear gloves in winter.", "Tôi đeo găng tay vào mùa đông.", ["topic_clothes"]),
  mk("a2", "word_a2_uniform", "uniform", "/ˈjuː.nɪ.fɔːm/", "đồng phục", "special clothes for a group", "Students wear a uniform at school.", "Học sinh mặc đồng phục ở trường.", ["topic_clothes"]),
  mk("a2", "word_a2_boots", "boots", "/buːts/", "ủng, bốt", "strong shoes that cover the ankle", "She bought new winter boots.", "Cô ấy mua đôi bốt mùa đông mới.", ["topic_clothes"]),
];
