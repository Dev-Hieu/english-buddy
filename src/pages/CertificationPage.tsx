import { useState, useEffect, useRef, useCallback } from "react";
import { Award, CheckCircle, XCircle, Clock, Lock, ChevronRight, Printer, Volume2, ChevronLeft, ChevronDown } from "lucide-react";
import type { Student } from "@/types";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { speakText } from "@/services/speechService";
import { cn } from "@/components/ui/cn";

/* ────────────────────────── Types ────────────────────────── */

interface ExamQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
  listenText?: string; // for listening questions — TTS reads this
}

interface ExamSection {
  type: "listening" | "reading" | "grammar" | "vocabulary";
  title: string;
  questions: ExamQuestion[];
}

interface CertExam {
  level: string;
  title: string;
  titleVi: string;
  timeMinutes: number;
  passingScore: number;
  sections: ExamSection[];
}

/* ────────────────────────── Exam Data ────────────────────────── */

const EXAMS: CertExam[] = [
  // ──────── A1 ────────
  {
    level: "A1", title: "A1 Beginner", titleVi: "A1 Sơ cấp", timeMinutes: 30, passingScore: 60,
    sections: [
      {
        type: "listening", title: "Nghe hiểu",
        questions: [
          { question: "Listen and choose the correct word.", listenText: "Apple", options: ["Apple", "Banana", "Orange", "Grape"], answer: 0 },
          { question: "Listen and choose what you hear.", listenText: "Good morning", options: ["Good night", "Good morning", "Good evening", "Goodbye"], answer: 1 },
          { question: "Listen. What is the color?", listenText: "The sky is blue.", options: ["Red", "Green", "Blue", "Yellow"], answer: 2 },
          { question: "Listen. What does he want?", listenText: "I want some water, please.", options: ["Milk", "Juice", "Tea", "Water"], answer: 3 },
          { question: "Listen. Where is she going?", listenText: "I am going to school.", options: ["School", "Hospital", "Market", "Park"], answer: 0 },
        ],
      },
      {
        type: "reading", title: "Đọc hiểu",
        questions: [
          { question: "Read: 'My name is Tom. I am 8 years old.' How old is Tom?", options: ["6", "7", "8", "9"], answer: 2 },
          { question: "Read: 'The cat is on the table.' Where is the cat?", options: ["Under the table", "On the table", "Next to the table", "Behind the table"], answer: 1 },
          { question: "Read: 'She has two brothers and one sister.' How many brothers does she have?", options: ["One", "Two", "Three", "Four"], answer: 1 },
          { question: "Read: 'It is raining today. I need an umbrella.' What does he need?", options: ["A hat", "A coat", "An umbrella", "Sunglasses"], answer: 2 },
          { question: "Read: 'We eat breakfast in the morning.' When do we eat breakfast?", options: ["At night", "In the afternoon", "In the evening", "In the morning"], answer: 3 },
        ],
      },
      {
        type: "grammar", title: "Ngữ pháp",
        questions: [
          { question: "She ___ a student.", options: ["am", "is", "are", "be"], answer: 1, explanation: "She + is" },
          { question: "I ___ from Vietnam.", options: ["is", "are", "am", "be"], answer: 2, explanation: "I + am" },
          { question: "There ___ three books on the desk.", options: ["is", "am", "are", "be"], answer: 2, explanation: "Three books (plural) → are" },
          { question: "___ you like ice cream?", options: ["Does", "Do", "Is", "Are"], answer: 1, explanation: "Do + you" },
          { question: "He ___ to school every day.", options: ["go", "goes", "going", "gone"], answer: 1, explanation: "He/She/It + verb-s/es (present simple)" },
        ],
      },
      {
        type: "vocabulary", title: "Từ vựng",
        questions: [
          { question: "What is the meaning of 'dog'?", options: ["Mèo", "Chó", "Chim", "Cá"], answer: 1 },
          { question: "Which word means 'trái cây'?", options: ["Vegetable", "Meat", "Fruit", "Bread"], answer: 2 },
          { question: "'Happy' means ___.", options: ["Buồn", "Vui", "Giận", "Sợ"], answer: 1 },
          { question: "What color is a banana?", options: ["Red", "Blue", "Green", "Yellow"], answer: 3 },
          { question: "'Teacher' means ___.", options: ["Bác sĩ", "Giáo viên", "Học sinh", "Nông dân"], answer: 1 },
        ],
      },
    ],
  },
  // ──────── A2 ────────
  {
    level: "A2", title: "A2 Elementary", titleVi: "A2 Cơ bản", timeMinutes: 40, passingScore: 60,
    sections: [
      {
        type: "listening", title: "Nghe hiểu",
        questions: [
          { question: "Listen to the dialogue. Where are they?", listenText: "Can I have a coffee, please? Sure, here you are. That will be three dollars.", options: ["At school", "At a café", "At home", "At a hospital"], answer: 1 },
          { question: "Listen. What time is the meeting?", listenText: "The meeting is at half past two in the afternoon.", options: ["2:00", "2:15", "2:30", "2:45"], answer: 2 },
          { question: "Listen. What is the weather like?", listenText: "It is very cloudy today and I think it will rain later.", options: ["Sunny", "Cloudy", "Snowy", "Windy"], answer: 1 },
          { question: "Listen. What did she buy?", listenText: "I went to the supermarket and bought some milk, eggs, and bread.", options: ["Milk, eggs, bread", "Cheese, butter, jam", "Rice, fish, chicken", "Apples, oranges, bananas"], answer: 0 },
          { question: "Listen. How does he go to work?", listenText: "I usually take the bus to work, but sometimes I ride my bicycle.", options: ["By car", "By bus", "By train", "On foot"], answer: 1 },
          { question: "Listen. What is his hobby?", listenText: "In my free time, I like playing football with my friends.", options: ["Swimming", "Reading", "Playing football", "Cooking"], answer: 2 },
          { question: "Listen. When is her birthday?", listenText: "My birthday is on the fifteenth of March.", options: ["March 5th", "March 15th", "March 25th", "May 3rd"], answer: 1 },
        ],
      },
      {
        type: "reading", title: "Đọc hiểu",
        questions: [
          { question: "Read: 'Tom wakes up at 7 o'clock. He has breakfast and goes to school at 8. He comes home at 3 in the afternoon.' What time does Tom go to school?", options: ["7:00", "8:00", "3:00", "9:00"], answer: 1 },
          { question: "From the text above, what time does Tom come home?", options: ["12:00", "2:00", "3:00", "4:00"], answer: 2 },
          { question: "Read: 'Lisa likes animals. She has a dog named Max and a cat named Bella. She feeds them every morning.' What is the cat's name?", options: ["Max", "Bella", "Lisa", "Tom"], answer: 1 },
          { question: "From the text above, when does Lisa feed her pets?", options: ["Every evening", "Every afternoon", "Every morning", "Every night"], answer: 2 },
          { question: "Read: 'Dear Mom, I am having a great time at summer camp. The weather is nice and I made new friends. See you next week! Love, Sarah.' Where is Sarah?", options: ["At school", "At home", "At summer camp", "At the park"], answer: 2 },
          { question: "From the text above, when will Sarah come home?", options: ["Tomorrow", "Next week", "Next month", "Today"], answer: 1 },
          { question: "Read: 'The museum is open from 9 AM to 5 PM, Tuesday to Sunday. It is closed on Monday.' When is the museum closed?", options: ["Sunday", "Saturday", "Tuesday", "Monday"], answer: 3 },
          { question: "From the text above, what time does the museum close?", options: ["4 PM", "5 PM", "6 PM", "9 PM"], answer: 1 },
        ],
      },
      {
        type: "grammar", title: "Ngữ pháp",
        questions: [
          { question: "She ___ to the cinema yesterday.", options: ["go", "goes", "went", "going"], answer: 2, explanation: "Yesterday → past simple: went" },
          { question: "This book is ___ than that one.", options: ["interesting", "more interesting", "most interesting", "interestinger"], answer: 1, explanation: "Comparative: more + long adjective" },
          { question: "You ___ wear a seatbelt in the car.", options: ["can", "must", "might", "would"], answer: 1, explanation: "Must = obligation" },
          { question: "I ___ already ___ lunch.", options: ["have / eaten", "has / eaten", "had / eat", "have / ate"], answer: 0, explanation: "Present perfect: have + past participle" },
          { question: "She is the ___ girl in the class.", options: ["tall", "taller", "tallest", "more tall"], answer: 2, explanation: "Superlative: the + -est" },
          { question: "We ___ TV when the phone rang.", options: ["watch", "watched", "were watching", "are watching"], answer: 2, explanation: "Past continuous: were + V-ing" },
          { question: "If it rains, I ___ stay at home.", options: ["will", "would", "am", "was"], answer: 0, explanation: "First conditional: if + present, will + base verb" },
          { question: "He ___ play the guitar very well.", options: ["can", "must", "should", "shall"], answer: 0, explanation: "Can = ability" },
        ],
      },
      {
        type: "vocabulary", title: "Từ vựng",
        questions: [
          { question: "'Kitchen' is a room where you ___.", options: ["Sleep", "Cook", "Study", "Shower"], answer: 1 },
          { question: "The opposite of 'cheap' is ___.", options: ["Free", "Expensive", "Small", "Old"], answer: 1 },
          { question: "A person who fixes cars is a ___.", options: ["Chef", "Mechanic", "Dentist", "Pilot"], answer: 1 },
          { question: "'Borrow' means ___.", options: ["Mượn", "Cho mượn", "Mua", "Bán"], answer: 0 },
          { question: "Which word describes the weather? ___", options: ["Hungry", "Foggy", "Angry", "Funny"], answer: 1 },
          { question: "'Headache' means ___.", options: ["Đau bụng", "Đau đầu", "Đau chân", "Đau lưng"], answer: 1 },
          { question: "You use a ___ to cut paper.", options: ["Ruler", "Pen", "Scissors", "Eraser"], answer: 2 },
        ],
      },
    ],
  },
  // ──────── B1 ────────
  {
    level: "B1", title: "B1 Intermediate", titleVi: "B1 Trung cấp", timeMinutes: 50, passingScore: 65,
    sections: [
      {
        type: "listening", title: "Nghe hiểu",
        questions: [
          { question: "Listen. What is the speaker's opinion about the city?", listenText: "I think this city is wonderful. The public transport is excellent and the people are very friendly.", options: ["It's boring", "It's wonderful", "It's expensive", "It's dangerous"], answer: 1 },
          { question: "Listen. Why is she late?", listenText: "Sorry I'm late. There was a terrible traffic jam on the highway and my bus was delayed for thirty minutes.", options: ["She overslept", "Traffic jam", "Her car broke down", "She forgot"], answer: 1 },
          { question: "Listen. What does the man recommend?", listenText: "If you visit Paris, you should definitely try the local bakeries. The croissants are absolutely amazing.", options: ["Visit museums", "Try local bakeries", "Take a boat tour", "Go shopping"], answer: 1 },
          { question: "Listen. How long has she been studying English?", listenText: "I have been studying English for about five years now. I started when I was in secondary school.", options: ["3 years", "4 years", "5 years", "6 years"], answer: 2 },
          { question: "Listen. What will the weather be like tomorrow?", listenText: "Tomorrow we expect temperatures to reach thirty-two degrees with clear skies throughout the day.", options: ["Rainy and cold", "Hot and clear", "Windy and cloudy", "Snowy"], answer: 1 },
          { question: "Listen. What is the main problem?", listenText: "The main issue with our project is that we don't have enough time to complete all the research before the deadline.", options: ["Not enough money", "Not enough time", "Not enough people", "Not enough data"], answer: 1 },
          { question: "Listen. What does the woman want to do after university?", listenText: "After I graduate, I'd like to travel around Southeast Asia for a few months before I start looking for a job.", options: ["Start working immediately", "Travel around Southeast Asia", "Study more", "Stay at home"], answer: 1 },
          { question: "Listen. What is the relationship between the two speakers?", listenText: "Doctor, I have had this cough for about a week now and it's getting worse. Can you prescribe something for me?", options: ["Teacher and student", "Doctor and patient", "Boss and employee", "Friends"], answer: 1 },
          { question: "Listen. What happened to the man's phone?", listenText: "I accidentally dropped my phone in the swimming pool yesterday. I tried putting it in rice but it still won't turn on.", options: ["It was stolen", "He lost it", "It fell in water", "The battery died"], answer: 2 },
          { question: "Listen. Where is the concert taking place?", listenText: "The concert will be held at the National Stadium this Saturday evening at seven thirty. Tickets are still available online.", options: ["City Hall", "National Stadium", "Central Park", "Opera House"], answer: 1 },
        ],
      },
      {
        type: "reading", title: "Đọc hiểu",
        questions: [
          { question: "Read: 'Working from home has become increasingly popular since 2020. Many employees report higher productivity and better work-life balance. However, some struggle with loneliness and difficulty separating work from personal time.' What is one advantage of working from home?", options: ["More meetings", "Higher productivity", "Less technology", "More travel"], answer: 1 },
          { question: "From the text above, what is one disadvantage?", options: ["Too much free time", "Too many colleagues", "Loneliness", "Too much exercise"], answer: 2 },
          { question: "Read: 'Dear Mr. Johnson, I am writing to apply for the position of Marketing Assistant advertised on your website. I have two years of experience in digital marketing and I hold a degree in Business Administration. I am available for an interview at your convenience.' What position is the person applying for?", options: ["Sales Manager", "Marketing Assistant", "Business Director", "Web Developer"], answer: 1 },
          { question: "From the letter above, how much experience does the applicant have?", options: ["One year", "Two years", "Three years", "Five years"], answer: 1 },
          { question: "Read: 'The Great Wall of China is one of the most impressive structures ever built. Construction began over 2,000 years ago. It stretches approximately 21,000 kilometers.' How long is the Great Wall approximately?", options: ["2,000 km", "5,000 km", "10,000 km", "21,000 km"], answer: 3 },
          { question: "Read: 'Recycling is important for the environment. When we recycle paper, we save trees. When we recycle plastic, we reduce pollution in the oceans. Everyone can make a difference by separating their waste.' According to the text, recycling paper helps ___.", options: ["Reduce noise", "Save trees", "Save water", "Clean the air"], answer: 1 },
          { question: "From the text above, recycling plastic helps ___.", options: ["Save energy", "Grow food", "Reduce ocean pollution", "Build houses"], answer: 2 },
          { question: "Read: 'A new study shows that people who sleep less than six hours a night are more likely to gain weight. Researchers recommend seven to eight hours of sleep for adults.' How many hours of sleep do researchers recommend?", options: ["5-6 hours", "6-7 hours", "7-8 hours", "8-9 hours"], answer: 2 },
          { question: "Read: 'The local library will be closed for renovations from July 1st to August 15th. During this time, members can use the online library service to borrow e-books.' When does the library reopen?", options: ["July 15th", "August 1st", "August 15th", "September 1st"], answer: 2 },
          { question: "From the text above, what can members do during the closure?", options: ["Visit another library", "Buy books at a discount", "Borrow e-books online", "Nothing"], answer: 2 },
        ],
      },
      {
        type: "grammar", title: "Ngữ pháp",
        questions: [
          { question: "I have lived here ___ 2015.", options: ["for", "since", "during", "while"], answer: 1, explanation: "Since + specific point in time" },
          { question: "If I ___ rich, I would travel the world.", options: ["am", "was", "were", "be"], answer: 2, explanation: "Second conditional: If + were (subjunctive)" },
          { question: "The book ___ I read last week was excellent.", options: ["who", "which", "where", "when"], answer: 1, explanation: "Which = relative pronoun for things" },
          { question: "She ___ working here for three years.", options: ["is", "has been", "was", "had"], answer: 1, explanation: "Present perfect continuous: has been + V-ing" },
          { question: "The cake was ___ by my grandmother.", options: ["make", "making", "made", "makes"], answer: 2, explanation: "Passive voice: was + past participle" },
          { question: "I wish I ___ speak French fluently.", options: ["can", "could", "will", "would"], answer: 1, explanation: "Wish + could (unreal present)" },
          { question: "He asked me where I ___.", options: ["live", "lived", "am living", "will live"], answer: 1, explanation: "Reported speech: present → past" },
          { question: "You ___ to study harder if you want to pass.", options: ["must", "need", "should", "would"], answer: 1, explanation: "Need to = necessity" },
          { question: "Despite ___ tired, she continued working.", options: ["be", "being", "was", "been"], answer: 1, explanation: "Despite + V-ing" },
          { question: "Neither Tom ___ Jerry was at the party.", options: ["or", "and", "nor", "but"], answer: 2, explanation: "Neither...nor" },
        ],
      },
      {
        type: "vocabulary", title: "Từ vựng",
        questions: [
          { question: "'Approximately' is closest in meaning to ___.", options: ["Exactly", "About", "Never", "Always"], answer: 1 },
          { question: "'She was thrilled with the results.' 'Thrilled' means ___.", options: ["Disappointed", "Very happy", "Confused", "Angry"], answer: 1 },
          { question: "The opposite of 'ancient' is ___.", options: ["Old", "Modern", "Historic", "Traditional"], answer: 1 },
          { question: "'Postpone' means ___.", options: ["Cancel", "Delay", "Start", "Finish"], answer: 1 },
          { question: "'She made a generous donation.' 'Generous' means ___.", options: ["Small", "Large and kind", "Forced", "Secret"], answer: 1 },
          { question: "'Reliable' means someone you can ___.", options: ["Ignore", "Trust", "Fear", "Forget"], answer: 1 },
          { question: "'The company went bankrupt.' 'Bankrupt' means ___.", options: ["Very successful", "Very popular", "Having no money", "Very old"], answer: 2 },
          { question: "'Commute' means ___.", options: ["To communicate", "To travel to work regularly", "To compete", "To complain"], answer: 1 },
          { question: "'Reluctant' means ___.", options: ["Eager", "Unwilling", "Happy", "Confident"], answer: 1 },
          { question: "'Breathtaking' describes something ___.", options: ["Boring", "Dangerous", "Extremely beautiful", "Very small"], answer: 2 },
        ],
      },
    ],
  },
  // ──────── B2 ────────
  {
    level: "B2", title: "B2 Upper-Intermediate", titleVi: "B2 Trung cấp cao", timeMinutes: 60, passingScore: 65,
    sections: [
      {
        type: "listening", title: "Nghe hiểu",
        questions: [
          { question: "Listen. What is the speaker's main argument?", listenText: "While social media has connected people globally, research increasingly shows that excessive use leads to higher rates of anxiety and depression, particularly among teenagers.", options: ["Social media is beneficial", "Excessive social media harms mental health", "Teenagers should use more social media", "Social media improves education"], answer: 1 },
          { question: "Listen. What solution does the speaker propose?",  listenText: "To address the housing crisis, the government should invest in affordable housing projects and provide subsidies for first-time home buyers rather than simply raising interest rates.", options: ["Raise interest rates", "Build luxury apartments", "Invest in affordable housing", "Reduce population"], answer: 2 },
          { question: "Listen. What surprised the researcher?", listenText: "What surprised us most was that participants who exercised just twenty minutes a day showed the same cognitive improvements as those who exercised for an hour.", options: ["Exercise had no effect", "20 minutes was as effective as an hour", "Nobody wanted to exercise", "The study was cancelled"], answer: 1 },
          { question: "Listen. What is the speaker's profession?", listenText: "In my twenty years of practicing law, I've seen countless cases where people could have avoided litigation simply by having a proper contract in place from the beginning.", options: ["Doctor", "Teacher", "Lawyer", "Engineer"], answer: 2 },
          { question: "Listen. What trend does the speaker describe?", listenText: "More and more companies are adopting a four-day work week. Early results from pilot programs show that productivity actually increases while employee burnout decreases significantly.", options: ["Longer work hours", "Four-day work week", "Remote work only", "More overtime"], answer: 1 },
          { question: "Listen. Why did the project fail?", listenText: "The project ultimately failed not because of a lack of funding, but because there was poor communication between the design team and the engineering department.", options: ["Lack of funding", "Poor communication", "Bad weather", "Technical problems"], answer: 1 },
          { question: "Listen. What does the speaker recommend for language learning?", listenText: "The most effective approach to language learning combines regular immersion through media consumption with structured grammar study and consistent conversational practice with native speakers.", options: ["Only grammar study", "Only watching movies", "A combined approach", "Only reading books"], answer: 2 },
          { question: "Listen. What is the environmental concern?", listenText: "Scientists warn that if current deforestation rates continue in the Amazon rainforest, we could lose up to forty percent of the remaining forest within the next thirty years.", options: ["Air pollution in cities", "Amazon deforestation", "Ocean acidification", "Ozone depletion"], answer: 1 },
          { question: "Listen. What was the outcome of the experiment?", listenText: "Contrary to our initial hypothesis, the group that received no special treatment actually performed better on the final assessment than the group that received intensive coaching.", options: ["Both groups performed equally", "The coached group did better", "The uncoached group did better", "Neither group improved"], answer: 2 },
          { question: "Listen. What does the speaker say about artificial intelligence?", listenText: "While artificial intelligence will undoubtedly transform many industries, I believe it will create more jobs than it eliminates, particularly in fields requiring creativity and emotional intelligence.", options: ["AI will destroy all jobs", "AI will create more jobs than it eliminates", "AI is not important", "AI should be banned"], answer: 1 },
          { question: "Listen. What is the historical significance?", listenText: "The discovery of penicillin by Alexander Fleming in nineteen twenty-eight is considered one of the most important breakthroughs in medical history, saving millions of lives from bacterial infections.", options: ["Discovery of DNA", "Discovery of penicillin", "Invention of the X-ray", "Development of vaccines"], answer: 1 },
          { question: "Listen. What challenge does the speaker mention?", listenText: "One of the biggest challenges facing renewable energy adoption is the intermittent nature of solar and wind power, which requires significant investment in energy storage solutions.", options: ["High cost of solar panels", "Lack of sunlight", "Energy storage for intermittent sources", "Public opposition"], answer: 2 },
        ],
      },
      {
        type: "reading", title: "Đọc hiểu",
        questions: [
          { question: "Read: 'The gig economy has transformed the nature of work. Freelancers now make up approximately 35% of the global workforce. While this offers flexibility, it also raises concerns about job security, benefits, and workers' rights.' What percentage of the global workforce are freelancers?", options: ["15%", "25%", "35%", "45%"], answer: 2 },
          { question: "From the passage above, what concern is raised about the gig economy?", options: ["Too much vacation time", "Job security and benefits", "Too many regulations", "High salaries"], answer: 1 },
          { question: "Read: 'Cognitive behavioral therapy (CBT) has proven to be one of the most effective treatments for depression and anxiety. Unlike medication, which treats symptoms, CBT addresses the underlying thought patterns that contribute to mental health issues.' How does CBT differ from medication?", options: ["It's cheaper", "It addresses thought patterns, not just symptoms", "It works faster", "It has more side effects"], answer: 1 },
          { question: "Read: 'The concept of emotional intelligence, popularized by Daniel Goleman in the 1990s, suggests that success depends not only on IQ but also on one's ability to understand and manage emotions.' Who popularized emotional intelligence?", options: ["Albert Einstein", "Daniel Goleman", "Stephen Hawking", "Sigmund Freud"], answer: 1 },
          { question: "From the passage above, emotional intelligence involves ___.", options: ["Having a high IQ", "Understanding and managing emotions", "Being physically strong", "Having many friends"], answer: 1 },
          { question: "Read: 'Urban vertical farming is emerging as a sustainable solution to food production. By growing crops in stacked layers within controlled environments, vertical farms use 95% less water than traditional agriculture and can produce food year-round.' How much less water does vertical farming use?", options: ["50%", "75%", "85%", "95%"], answer: 3 },
          { question: "Read: 'The placebo effect demonstrates the powerful connection between mind and body. In clinical trials, patients who receive sugar pills but believe they are receiving real medication often show measurable improvement in their symptoms.' What is the placebo effect?", options: ["A type of medication", "Improvement from believing you're treated", "A side effect of drugs", "A medical procedure"], answer: 1 },
          { question: "Read: 'Microplastics — tiny plastic particles less than 5mm in size — have been found in the deepest ocean trenches, the highest mountain peaks, and even in human blood. Their long-term health effects remain largely unknown.' Where have microplastics NOT been mentioned as found?", options: ["Ocean trenches", "Mountain peaks", "Human blood", "Outer space"], answer: 3 },
          { question: "Read: 'The Finnish education system, consistently ranked among the best in the world, emphasizes play-based learning, minimal homework, and no standardized testing until age 16. Teachers are required to hold a master's degree.' What qualification must Finnish teachers have?", options: ["Bachelor's degree", "Master's degree", "PhD", "Teaching certificate only"], answer: 1 },
          { question: "From the passage above, when do Finnish students first take standardized tests?", options: ["Age 10", "Age 12", "Age 14", "Age 16"], answer: 3 },
          { question: "Read: 'Blockchain technology, originally developed for cryptocurrency, is now being applied in supply chain management, healthcare records, and voting systems. Its decentralized nature makes it resistant to tampering and fraud.' What makes blockchain resistant to fraud?", options: ["Its speed", "Its decentralized nature", "Its low cost", "Its simplicity"], answer: 1 },
          { question: "Read: 'The Mediterranean diet, rich in olive oil, fish, vegetables, and whole grains, has been linked to a 30% reduction in cardiovascular disease risk. Researchers attribute this to the anti-inflammatory properties of its key components.' By how much does the Mediterranean diet reduce heart disease risk?", options: ["10%", "20%", "30%", "40%"], answer: 2 },
        ],
      },
      {
        type: "grammar", title: "Ngữ pháp",
        questions: [
          { question: "Had I known about the traffic, I ___ an earlier train.", options: ["will take", "would take", "would have taken", "took"], answer: 2, explanation: "Third conditional (inverted): Had + subject + known → would have + past participle" },
          { question: "The report ___ by the time the meeting starts.", options: ["will finish", "will be finished", "will have been finished", "is finishing"], answer: 2, explanation: "Future perfect passive: will have been + past participle" },
          { question: "She suggested that he ___ a doctor immediately.", options: ["sees", "saw", "see", "seeing"], answer: 2, explanation: "Subjunctive after suggest: base form" },
          { question: "Not only ___ the exam, but she also got the highest score.", options: ["she passed", "did she pass", "she did pass", "passed she"], answer: 1, explanation: "Inversion after 'Not only': did + subject + base verb" },
          { question: "___ the weather been better, we would have gone hiking.", options: ["If", "Had", "Should", "Were"], answer: 1, explanation: "Inverted conditional: Had + past participle" },
          { question: "The artist, ___ paintings sell for millions, lives a modest life.", options: ["who", "whom", "whose", "which"], answer: 2, explanation: "Whose = possessive relative pronoun" },
          { question: "By next year, they ___ married for twenty-five years.", options: ["will be", "will have been", "are", "have been"], answer: 1, explanation: "Future perfect: will have been" },
          { question: "He acted as though he ___ everything about the subject.", options: ["knows", "knew", "has known", "knowing"], answer: 1, explanation: "As though + past simple (unreal)" },
          { question: "It's high time we ___ a decision.", options: ["make", "made", "making", "have made"], answer: 1, explanation: "It's high time + past simple" },
          { question: "The more you practice, the ___ you will become.", options: ["good", "better", "best", "well"], answer: 1, explanation: "The more..., the + comparative" },
          { question: "She denied ___ the confidential documents.", options: ["to leak", "leaking", "leak", "leaked"], answer: 1, explanation: "Deny + V-ing" },
          { question: "Under no circumstances ___ leave the building during the drill.", options: ["you should", "should you", "you must", "must you"], answer: 1, explanation: "Inversion after negative adverbials" },
          { question: "I'd rather you ___ smoking.", options: ["stop", "stopped", "stopping", "to stop"], answer: 1, explanation: "I'd rather + subject + past simple" },
        ],
      },
      {
        type: "vocabulary", title: "Từ vựng",
        questions: [
          { question: "'The company's revenue has plummeted.' 'Plummeted' means ___.", options: ["Increased slowly", "Stayed the same", "Dropped sharply", "Fluctuated"], answer: 2 },
          { question: "'She has a knack for solving problems.' 'Knack' means ___.", options: ["Fear", "Natural talent", "Dislike", "Need"], answer: 1 },
          { question: "'The evidence was compelling.' 'Compelling' means ___.", options: ["Weak", "Convincing", "Confusing", "Irrelevant"], answer: 1 },
          { question: "'He tends to procrastinate.' 'Procrastinate' means ___.", options: ["Work hard", "Delay doing things", "Plan carefully", "Arrive early"], answer: 1 },
          { question: "'The new policy was met with backlash.' 'Backlash' means ___.", options: ["Support", "Strong negative reaction", "Excitement", "Confusion"], answer: 1 },
          { question: "'Her speech was eloquent.' 'Eloquent' means ___.", options: ["Short", "Boring", "Fluent and persuasive", "Loud"], answer: 2 },
          { question: "'The negotiations reached an impasse.' 'Impasse' means ___.", options: ["Agreement", "Deadlock", "Success", "Beginning"], answer: 1 },
          { question: "'The data is anecdotal rather than empirical.' 'Empirical' means ___.", options: ["Based on stories", "Based on observation and evidence", "Based on opinions", "Based on tradition"], answer: 1 },
          { question: "'She showed great resilience after the setback.' 'Resilience' means ___.", options: ["Sadness", "Anger", "Ability to recover", "Weakness"], answer: 2 },
          { question: "'The CEO was pragmatic in her approach.' 'Pragmatic' means ___.", options: ["Idealistic", "Practical", "Emotional", "Theoretical"], answer: 1 },
          { question: "'The two events are correlated.' 'Correlated' means ___.", options: ["Unrelated", "Connected", "Identical", "Opposite"], answer: 1 },
          { question: "'His remarks were ambiguous.' 'Ambiguous' means ___.", options: ["Clear", "Funny", "Open to interpretation", "Offensive"], answer: 2 },
          { question: "'The project requires meticulous attention to detail.' 'Meticulous' means ___.", options: ["Careless", "Very careful and precise", "Quick", "Lazy"], answer: 1 },
        ],
      },
    ],
  },
  // ──────── C1 ────────
  {
    level: "C1", title: "C1 Advanced", titleVi: "C1 Nâng cao", timeMinutes: 60, passingScore: 70,
    sections: [
      {
        type: "listening", title: "Nghe hiểu",
        questions: [
          { question: "Listen. What is the speaker's stance on genetic engineering?", listenText: "While genetic engineering holds tremendous promise for eradicating hereditary diseases, the ethical implications of modifying the human genome are profound and warrant extensive public discourse before any widespread implementation.", options: ["Fully supportive without reservations", "Cautiously optimistic, emphasizing ethics", "Completely against it", "Indifferent"], answer: 1 },
          { question: "Listen. What paradox does the speaker identify?", listenText: "The paradox of the information age is that despite having unprecedented access to knowledge, misinformation spreads faster than ever, and critical thinking skills appear to be declining rather than improving.", options: ["More information but less understanding", "More technology but less connectivity", "More money but less happiness", "More freedom but less security"], answer: 0 },
          { question: "Listen. What does the speaker argue about economic growth?", listenText: "The conventional model of perpetual economic growth is fundamentally incompatible with finite planetary resources. We need to transition toward a circular economy that decouples prosperity from resource consumption.", options: ["Growth should be maximized", "Growth is sustainable indefinitely", "Growth must be decoupled from resources", "Growth is irrelevant"], answer: 2 },
          { question: "Listen. What nuance does the speaker make about bilingualism?", listenText: "Recent neurological studies reveal that bilingualism doesn't merely add a second language to the brain; it fundamentally restructures cognitive architecture, enhancing executive function and potentially delaying the onset of dementia by several years.", options: ["Bilingualism only helps with languages", "Bilingualism restructures cognitive architecture", "Bilingualism has no proven benefits", "Bilingualism is harmful"], answer: 1 },
          { question: "Listen. What critique does the speaker offer?", listenText: "The prevailing narrative that technology is inherently democratizing ignores the digital divide and the concentration of technological power in the hands of a few multinational corporations that effectively function as unregulated monopolies.", options: ["Technology needs more funding", "Technology is perfectly democratic", "Technology's democratizing narrative is flawed", "Technology should be abolished"], answer: 2 },
          { question: "Listen. What distinction does the speaker draw?", listenText: "There is a crucial distinction between correlation and causation that is frequently overlooked in media reporting of scientific studies. The fact that two variables co-occur does not establish that one causes the other.", options: ["Between theory and practice", "Between correlation and causation", "Between qualitative and quantitative", "Between old and new research"], answer: 1 },
          { question: "Listen. What does the speaker say about artificial intelligence in education?", listenText: "Artificial intelligence in education should augment rather than replace human teachers. The irreplaceable qualities of mentorship — empathy, inspiration, and the ability to recognize individual potential — cannot be algorithmically replicated.", options: ["AI should replace teachers entirely", "AI should augment, not replace teachers", "AI has no role in education", "AI is better than human teachers"], answer: 1 },
          { question: "Listen. What philosophical point does the speaker make?", listenText: "The pursuit of happiness as a goal in itself is paradoxically self-defeating. Research consistently shows that meaning, purpose, and contribution to others' wellbeing are far more reliable predictors of life satisfaction.", options: ["Happiness should be the primary goal", "Pursuing happiness directly is self-defeating", "Money leads to happiness", "Happiness is impossible"], answer: 1 },
          { question: "Listen. What does the speaker conclude about urbanization?", listenText: "Urbanization, when managed thoughtfully, can actually reduce humanity's environmental footprint per capita through shared infrastructure, efficient public transport, and concentrated resource distribution networks.", options: ["Urbanization always harms the environment", "Urbanization can reduce environmental footprint", "People should move to rural areas", "Urbanization has no environmental impact"], answer: 1 },
          { question: "Listen. What methodological concern does the speaker raise?", listenText: "The reproducibility crisis in social sciences — where a significant proportion of published studies fail to produce consistent results when replicated — fundamentally undermines public confidence in scientific research.", options: ["Studies cost too much", "Results often can't be reproduced", "Scientists don't collaborate enough", "Funding is distributed unfairly"], answer: 1 },
          { question: "Listen. What does the speaker suggest about cultural identity?", listenText: "Globalization has created a complex tension between cultural homogenization and the preservation of indigenous traditions. The challenge lies in fostering intercultural exchange without eroding the distinctive heritage that defines communities.", options: ["All cultures should merge", "Cultural preservation is unnecessary", "Balance exchange and preservation", "Globalization should be stopped"], answer: 2 },
          { question: "Listen. What economic principle does the speaker explain?", listenText: "The concept of diminishing marginal returns suggests that beyond a certain threshold, additional investment yields progressively smaller benefits, which has profound implications for resource allocation in public policy.", options: ["More investment always means more returns", "Returns diminish beyond a threshold", "Investment is unnecessary", "Returns are always constant"], answer: 1 },
        ],
      },
      {
        type: "reading", title: "Đọc hiểu",
        questions: [
          { question: "Read: 'The Dunning-Kruger effect posits that individuals with limited competence in a domain tend to overestimate their abilities, while experts often underestimate theirs. This cognitive bias has significant implications for decision-making in organizations where the least qualified may be the most confident.' What do less competent individuals tend to do?", options: ["Underestimate their abilities", "Overestimate their abilities", "Accurately assess themselves", "Seek more training"], answer: 1 },
          { question: "From the passage above, what do experts tend to do?", options: ["Overestimate their abilities", "Refuse to participate", "Underestimate their abilities", "Leave the organization"], answer: 2 },
          { question: "Read: 'Epigenetics — the study of heritable changes in gene expression that do not involve alterations to the DNA sequence — has revolutionized our understanding of nature versus nurture. Environmental factors such as diet, stress, and exposure to toxins can activate or silence genes, and these modifications can potentially be passed down through generations.' Epigenetic changes ___.", options: ["Alter the DNA sequence", "Cannot be inherited", "Affect gene expression without changing DNA", "Only occur in plants"], answer: 2 },
          { question: "From the passage above, which is NOT mentioned as an environmental factor?", options: ["Diet", "Stress", "Toxins", "Exercise"], answer: 3 },
          { question: "Read: 'The tragedy of the commons, articulated by Garrett Hardin in 1968, describes how individuals acting in rational self-interest can deplete shared resources, even when it is clearly not in anyone's long-term interest. This concept remains central to contemporary debates about climate change and ocean conservation.' The tragedy of the commons involves ___.", options: ["Government regulation of resources", "Individual self-interest depleting shared resources", "Community cooperation", "Private property rights"], answer: 1 },
          { question: "Read: 'Quantum computing leverages the principles of superposition and entanglement to perform calculations exponentially faster than classical computers for certain types of problems. However, quantum decoherence — the tendency of quantum states to lose their properties when interacting with the environment — remains a formidable engineering challenge.' What is quantum decoherence?", options: ["A type of calculation", "Loss of quantum properties from environmental interaction", "A programming language", "A cooling system"], answer: 1 },
          { question: "Read: 'The hedonic treadmill theory suggests that people rapidly return to a baseline level of happiness despite major positive or negative life events. Lottery winners, for instance, report similar happiness levels to their pre-winning state within months.' The hedonic treadmill suggests that ___.", options: ["Money guarantees happiness", "People adapt back to baseline happiness", "Negative events are permanent", "Happiness always increases over time"], answer: 1 },
          { question: "Read: 'In sociolinguistics, code-switching refers to the practice of alternating between two or more languages or dialects within a single conversation. Far from indicating linguistic deficiency, code-switching demonstrates sophisticated metalinguistic awareness and serves important social functions.' Code-switching indicates ___.", options: ["Poor language ability", "Confusion", "Sophisticated linguistic awareness", "A learning disability"], answer: 2 },
          { question: "Read: 'The Sapir-Whorf hypothesis, in its strong form, posits that language determines thought — that speakers of different languages literally perceive reality differently. While the strong version has been largely discredited, the weak version — that language influences thought — continues to find empirical support.' The strong form of the Sapir-Whorf hypothesis states that ___.", options: ["Language influences thought somewhat", "Language determines thought entirely", "Thought determines language", "Language and thought are unrelated"], answer: 1 },
          { question: "From the passage above, which version of the hypothesis still has support?", options: ["The strong version", "The weak version", "Both versions equally", "Neither version"], answer: 1 },
          { question: "Read: 'Confirmation bias — the tendency to seek, interpret, and remember information that confirms pre-existing beliefs — is perhaps the most pervasive cognitive bias in human reasoning. It operates unconsciously and affects experts and laypersons alike.' Confirmation bias involves ___.", options: ["Seeking new perspectives", "Favoring information confirming existing beliefs", "Changing beliefs frequently", "Ignoring all information"], answer: 1 },
          { question: "Read: 'The concept of neuroplasticity has overturned the long-held belief that the adult brain is essentially fixed. Research now demonstrates that the brain continues to form new neural connections throughout life in response to learning, experience, and even injury recovery.' Neuroplasticity means the brain ___.", options: ["Stops developing after childhood", "Can form new connections throughout life", "Only changes during sleep", "Cannot recover from injury"], answer: 1 },
        ],
      },
      {
        type: "grammar", title: "Ngữ pháp",
        questions: [
          { question: "Seldom ___ such a compelling argument in academic discourse.", options: ["I have encountered", "have I encountered", "I encountered", "did I encountered"], answer: 1, explanation: "Inversion after negative adverbial: Seldom + auxiliary + subject" },
          { question: "The manuscript, ___ authenticity had been questioned for decades, was finally verified.", options: ["which", "whose", "that", "whom"], answer: 1, explanation: "Whose = possessive relative pronoun" },
          { question: "Were it not for her intervention, the project ___ have collapsed.", options: ["will", "would", "should", "could"], answer: 1, explanation: "Inverted third conditional: Were it not for → would have + past participle" },
          { question: "The data ___ to suggest a correlation between the two variables.", options: ["seem", "seems", "is seeming", "are seeming"], answer: 1, explanation: "Data (treated as singular in modern usage) + seems" },
          { question: "No sooner had he finished speaking ___ the audience erupted in applause.", options: ["when", "than", "that", "as"], answer: 1, explanation: "No sooner...than" },
          { question: "It is imperative that every participant ___ the form before the deadline.", options: ["submits", "submit", "submitted", "will submit"], answer: 1, explanation: "Subjunctive after 'imperative that': base form" },
          { question: "The theory, ___ controversial at first, eventually gained widespread acceptance.", options: ["however", "albeit", "despite", "nevertheless"], answer: 1, explanation: "Albeit = although it was" },
          { question: "So profound ___ the impact that the entire industry had to adapt.", options: ["is", "was", "were", "been"], answer: 1, explanation: "Inversion: So + adjective + auxiliary + subject" },
          { question: "___ he to have accepted the offer, his career trajectory would have been entirely different.", options: ["Were", "Had", "Should", "If"], answer: 0, explanation: "Were + subject + to have + past participle (formal third conditional)" },
          { question: "The phenomenon ___ to which the author refers remains poorly understood.", options: ["—", "that", "who", "when"], answer: 0, explanation: "Reduced relative clause / zero relative pronoun is acceptable" },
          { question: "Little ___ they realize the magnitude of the consequences.", options: ["do", "did", "are", "have"], answer: 1, explanation: "Inversion: Little did + subject + base verb" },
          { question: "The report recommends that the committee ___ its findings immediately.", options: ["publishes", "publish", "published", "will publish"], answer: 1, explanation: "Subjunctive: recommend that + base form" },
          { question: "Hardly ___ the lecture begun when the fire alarm went off.", options: ["has", "had", "did", "was"], answer: 1, explanation: "Hardly had + subject + past participle...when" },
        ],
      },
      {
        type: "vocabulary", title: "Từ vựng",
        questions: [
          { question: "'The speaker's argument was specious.' 'Specious' means ___.", options: ["Brilliant", "Seemingly correct but actually wrong", "Boring", "Complex"], answer: 1 },
          { question: "'She was known for her perspicacity.' 'Perspicacity' means ___.", options: ["Stubbornness", "Sharp mental perception", "Physical strength", "Generosity"], answer: 1 },
          { question: "'The changes were implemented surreptitiously.' 'Surreptitiously' means ___.", options: ["Openly", "Quickly", "Secretly", "Carelessly"], answer: 2 },
          { question: "'His obsequious behavior annoyed everyone.' 'Obsequious' means ___.", options: ["Brave", "Honest", "Excessively flattering", "Quiet"], answer: 2 },
          { question: "'The two concepts are antithetical.' 'Antithetical' means ___.", options: ["Similar", "Directly opposite", "Related", "Complex"], answer: 1 },
          { question: "'She demonstrated remarkable sangfroid under pressure.' 'Sangfroid' means ___.", options: ["Panic", "Composure under stress", "Aggression", "Confusion"], answer: 1 },
          { question: "'The decision was met with equanimity.' 'Equanimity' means ___.", options: ["Anger", "Calm acceptance", "Excitement", "Fear"], answer: 1 },
          { question: "'His argument was predicated on flawed assumptions.' 'Predicated' means ___.", options: ["Predicted by", "Based on", "Contradicted by", "Inspired by"], answer: 1 },
          { question: "'The policy had a deleterious effect.' 'Deleterious' means ___.", options: ["Positive", "Neutral", "Harmful", "Temporary"], answer: 2 },
          { question: "'The evidence was circumstantial at best.' 'Circumstantial' means ___.", options: ["Direct and conclusive", "Indirect and not conclusive", "Fabricated", "Overwhelming"], answer: 1 },
          { question: "'She is known for her laconic style.' 'Laconic' means ___.", options: ["Using few words", "Very detailed", "Emotional", "Poetic"], answer: 0 },
          { question: "'The committee reached a consensus after protracted deliberations.' 'Protracted' means ___.", options: ["Brief", "Extended and lengthy", "Secret", "Productive"], answer: 1 },
          { question: "'The author's prose is characteristically pellucid.' 'Pellucid' means ___.", options: ["Complex", "Clear and easy to understand", "Mysterious", "Poetic"], answer: 1 },
        ],
      },
    ],
  },
];

/* ────────────────────────── Helpers ────────────────────────── */

const LEVEL_ORDER_MAP: Record<string, number> = { kids: 0, a1: 1, a2: 2, b1: 3, b2: 4, c1: 5 };
const EXAM_LEVEL_MAP: Record<string, number> = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5 };

function canTakeExam(studentLevel: string, examLevel: string): boolean {
  const sIdx = LEVEL_ORDER_MAP[studentLevel] ?? 0;
  const eIdx = EXAM_LEVEL_MAP[examLevel] ?? 99;
  return eIdx <= sIdx + 1;
}

function generateCertId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "EB-";
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

const SECTION_LABELS: Record<string, string> = {
  listening: "Nghe hiểu", reading: "Đọc hiểu", grammar: "Ngữ pháp", vocabulary: "Từ vựng",
};

const SECTION_ICONS: Record<string, string> = {
  listening: "Nghe", reading: "Đọc", grammar: "Ngữ pháp", vocabulary: "Từ vựng",
};

/* ────────────────────────── Component ────────────────────────── */

type Phase = "select" | "preExam" | "exam" | "result" | "certificate";

interface SectionScore { type: string; correct: number; total: number }

export function CertificationPage({ student, onBackHome }: { student: Student; onBackHome: () => void }) {
  const [phase, setPhase] = useState<Phase>("select");
  const [selectedExam, setSelectedExam] = useState<CertExam | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [sectionScores, setSectionScores] = useState<SectionScore[]>([]);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [passed, setPassed] = useState(false);
  const [certId] = useState(generateCertId);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Flatten questions for indexing
  const allQuestions = selectedExam ? selectedExam.sections.flatMap((s) => s.questions) : [];

  // Global question index from section+question
  const globalIndex = useCallback(() => {
    if (!selectedExam) return 0;
    let idx = 0;
    for (let s = 0; s < currentSection; s++) idx += selectedExam.sections[s].questions.length;
    return idx + currentQuestion;
  }, [selectedExam, currentSection, currentQuestion]);

  // Timer
  useEffect(() => {
    if (phase !== "exam") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          submitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const startExam = (exam: CertExam) => {
    setSelectedExam(exam);
    setAnswers({});
    setCurrentSection(0);
    setCurrentQuestion(0);
    setTimeLeft(exam.timeMinutes * 60);
    setPhase("preExam");
  };

  const beginExam = () => {
    setPhase("exam");
  };

  const selectAnswer = (qIdx: number, optIdx: number) => {
    setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const submitExam = useCallback(() => {
    if (!selectedExam) return;
    if (timerRef.current) clearInterval(timerRef.current);

    let total = 0;
    let correct = 0;
    const scores: SectionScore[] = [];

    for (const section of selectedExam.sections) {
      let sCorrect = 0;
      for (const q of section.questions) {
        const gIdx = selectedExam.sections.slice(0, selectedExam.sections.indexOf(section))
          .reduce((sum, s) => sum + s.questions.length, 0) + section.questions.indexOf(q);
        if (answers[gIdx] === q.answer) sCorrect++;
        total++;
      }
      correct += sCorrect;
      scores.push({ type: section.type, correct: sCorrect, total: section.questions.length });
    }

    setTotalCorrect(correct);
    setTotalQuestions(total);
    setSectionScores(scores);
    const pct = (correct / total) * 100;
    setPassed(pct >= selectedExam.passingScore);
    setPhase("result");
  }, [selectedExam, answers]);

  // Navigate questions
  const goToQuestion = (sectionIdx: number, qIdx: number) => {
    setCurrentSection(sectionIdx);
    setCurrentQuestion(qIdx);
  };

  const nextQuestion = () => {
    if (!selectedExam) return;
    const sec = selectedExam.sections[currentSection];
    if (currentQuestion < sec.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentSection < selectedExam.sections.length - 1) {
      setCurrentSection(currentSection + 1);
      setCurrentQuestion(0);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (currentSection > 0 && selectedExam) {
      const prevSec = currentSection - 1;
      setCurrentSection(prevSec);
      setCurrentQuestion(selectedExam.sections[prevSec].questions.length - 1);
    }
  };

  const answeredCount = Object.keys(answers).length;

  /* ──── RENDER ──── */

  // ── Select exam ──
  if (phase === "select") {
    return (
      <main className="ios-container">
        <SessionHeader title="Chứng chỉ CEFR" icon={<Award className="h-4 w-4" />} iconBg="bg-red-500" onClose={onBackHome} />

        <p className="mb-4 text-sm text-muted-foreground">Chọn cấp độ để thi lấy chứng chỉ. Hoàn thành bài thi để nhận chứng chỉ CEFR.</p>

        <div className="space-y-3">
          {EXAMS.map((exam) => {
            const locked = !canTakeExam(student.level, exam.level);
            const isCurrent = exam.level.toLowerCase() === student.level;
            const totalQ = exam.sections.reduce((s, sec) => s + sec.questions.length, 0);
            return (
              <button
                key={exam.level}
                type="button"
                disabled={locked}
                onClick={() => startExam(exam)}
                className={cn(
                  "relative w-full rounded-2xl border p-4 text-left transition-all",
                  locked
                    ? "border-border/40 bg-muted/50 opacity-60 cursor-not-allowed"
                    : "border-border/40 bg-card shadow-sm hover:shadow-md active:scale-[0.98]",
                  isCurrent && !locked && "ring-2 ring-primary/50",
                )}
              >
                {locked && (
                  <div className="absolute right-4 top-4"><Lock className="h-5 w-5 text-muted-foreground" /></div>
                )}
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-black text-white shadow-md",
                    exam.level === "A1" ? "bg-green-500" : exam.level === "A2" ? "bg-blue-500" : exam.level === "B1" ? "bg-purple-500" : exam.level === "B2" ? "bg-orange-500" : "bg-red-500",
                  )}>
                    {exam.level}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-extrabold">{exam.title}</p>
                    <p className="text-xs text-muted-foreground">{exam.titleVi}</p>
                    <div className="mt-1 flex flex-wrap gap-2 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" /> {exam.timeMinutes} phút</span>
                      <span>{totalQ} câu hỏi</span>
                      <span>Đạt: {exam.passingScore}%</span>
                    </div>
                  </div>
                  {!locked && <ChevronRight className="h-5 w-5 text-muted-foreground" />}
                </div>
                {isCurrent && !locked && (
                  <span className="mt-2 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">Trình độ hiện tại</span>
                )}
              </button>
            );
          })}
        </div>
      </main>
    );
  }

  // ── Pre-exam ──
  if (phase === "preExam" && selectedExam) {
    const totalQ = selectedExam.sections.reduce((s, sec) => s + sec.questions.length, 0);
    return (
      <main className="ios-container">
        <SessionHeader title={`Thi ${selectedExam.level}`} icon={<Award className="h-4 w-4" />} iconBg="bg-red-500" onClose={() => setPhase("select")} />

        <div className="mx-auto max-w-md space-y-5">
          <div className="rounded-2xl border border-border/40 bg-card p-5 shadow-sm text-center">
            <span className={cn(
              "mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-black text-white shadow-lg",
              selectedExam.level === "A1" ? "bg-green-500" : selectedExam.level === "A2" ? "bg-blue-500" : selectedExam.level === "B1" ? "bg-purple-500" : selectedExam.level === "B2" ? "bg-orange-500" : "bg-red-500",
            )}>
              {selectedExam.level}
            </span>
            <h2 className="text-lg font-black">{selectedExam.title}</h2>
            <p className="text-sm text-muted-foreground">{selectedExam.titleVi}</p>
          </div>

          <div className="rounded-2xl border border-border/40 bg-card p-4 shadow-sm space-y-3">
            <h3 className="text-sm font-bold">Hướng dẫn thi</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>Thời gian làm bài: <strong className="text-foreground">{selectedExam.timeMinutes} phút</strong></li>
              <li>Tổng số câu hỏi: <strong className="text-foreground">{totalQ} câu</strong></li>
              <li>Điểm đạt: <strong className="text-foreground">{selectedExam.passingScore}%</strong></li>
              <li>Bài thi gồm {selectedExam.sections.length} phần: {selectedExam.sections.map((s) => SECTION_LABELS[s.type]).join(", ")}</li>
            </ul>
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-200">
              <strong>Lưu ý:</strong> Bài thi có giới hạn thời gian. Khi hết giờ, bài sẽ được tự động nộp. Bạn không thể tạm dừng giữa chừng.
            </div>
          </div>

          <button
            type="button"
            onClick={beginExam}
            className="w-full rounded-2xl bg-primary py-3.5 text-sm font-extrabold text-white shadow-lg transition-all active:scale-[0.97] hover:opacity-90"
          >
            Bắt đầu thi
          </button>
        </div>
      </main>
    );
  }

  // ── Exam ──
  if (phase === "exam" && selectedExam) {
    const section = selectedExam.sections[currentSection];
    const question = section.questions[currentQuestion];
    const gIdx = globalIndex();
    const isLast = currentSection === selectedExam.sections.length - 1 && currentQuestion === section.questions.length - 1;
    const isFirst = currentSection === 0 && currentQuestion === 0;
    const progressPct = ((answeredCount) / allQuestions.length) * 100;

    return (
      <main className="ios-container">
        {/* Timer + Progress */}
        <div className="sticky top-0 z-30 -mx-4 mb-4 border-b border-border/60 bg-background/85 px-4 pb-2.5 pt-3 backdrop-blur">
          <div className="flex items-center justify-between mb-2">
            <button type="button" onClick={() => setPhase("select")} className="text-xs text-muted-foreground hover:text-foreground">
              <ChevronLeft className="inline h-4 w-4" /> Thoát
            </button>
            <span className={cn(
              "flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold",
              timeLeft <= 300 ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 animate-pulse" : "bg-muted text-foreground",
            )}>
              <Clock className="h-3.5 w-3.5" />
              {formatTime(timeLeft)}
            </span>
          </div>
          {/* Section tabs */}
          <div className="flex gap-1 mb-2 overflow-x-auto">
            {selectedExam.sections.map((sec, sIdx) => (
              <button
                key={sec.type}
                type="button"
                onClick={() => goToQuestion(sIdx, 0)}
                className={cn(
                  "shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-bold transition-colors",
                  sIdx === currentSection ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/80",
                )}
              >
                {SECTION_ICONS[sec.type]}
              </button>
            ))}
          </div>
          {/* Progress bar */}
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        {/* Question */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-bold">{SECTION_LABELS[section.type]}</span>
            <span>Câu {gIdx + 1}/{allQuestions.length}</span>
          </div>

          {/* Listening play button */}
          {section.type === "listening" && question.listenText && (
            <button
              type="button"
              onClick={() => speakText(question.listenText!)}
              className="flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-200 px-4 py-2.5 text-sm font-bold text-blue-700 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-300 transition-all active:scale-[0.97]"
            >
              <Volume2 className="h-4 w-4" />
              Nghe
            </button>
          )}

          <p className="text-sm font-bold leading-relaxed">{question.question}</p>

          <div className="space-y-2">
            {question.options.map((opt, oIdx) => (
              <button
                key={oIdx}
                type="button"
                onClick={() => selectAnswer(gIdx, oIdx)}
                className={cn(
                  "w-full rounded-xl border p-3 text-left text-sm transition-all active:scale-[0.98]",
                  answers[gIdx] === oIdx
                    ? "border-primary bg-primary/10 font-bold text-primary"
                    : "border-border/40 bg-card hover:border-primary/30",
                )}
              >
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[10px] font-bold">
                  {String.fromCharCode(65 + oIdx)}
                </span>
                {opt}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={prevQuestion}
              disabled={isFirst}
              className={cn(
                "flex items-center gap-1 rounded-xl px-4 py-2 text-xs font-bold transition-all",
                isFirst ? "text-muted-foreground opacity-50" : "text-foreground hover:bg-muted active:scale-[0.97]",
              )}
            >
              <ChevronLeft className="h-4 w-4" /> Trước
            </button>

            {isLast ? (
              <button
                type="button"
                onClick={() => submitExam()}
                className="rounded-xl bg-primary px-6 py-2 text-xs font-extrabold text-white shadow-md transition-all active:scale-[0.97]"
              >
                Nộp bài ({answeredCount}/{allQuestions.length})
              </button>
            ) : (
              <button
                type="button"
                onClick={nextQuestion}
                className="flex items-center gap-1 rounded-xl bg-primary/10 px-4 py-2 text-xs font-bold text-primary transition-all active:scale-[0.97]"
              >
                Tiếp <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Question dots */}
          <details className="rounded-xl border border-border/40 bg-card p-3">
            <summary className="flex items-center gap-1 text-xs font-bold text-muted-foreground cursor-pointer">
              <ChevronDown className="h-3 w-3" /> Tổng quan câu hỏi
            </summary>
            <div className="mt-2 space-y-2">
              {selectedExam.sections.map((sec, sIdx) => {
                let offset = 0;
                for (let i = 0; i < sIdx; i++) offset += selectedExam.sections[i].questions.length;
                return (
                  <div key={sec.type}>
                    <p className="text-[10px] font-bold text-muted-foreground mb-1">{SECTION_LABELS[sec.type]}</p>
                    <div className="flex flex-wrap gap-1">
                      {sec.questions.map((_, qIdx) => {
                        const gi = offset + qIdx;
                        const isActive = sIdx === currentSection && qIdx === currentQuestion;
                        const isAnswered = answers[gi] !== undefined;
                        return (
                          <button
                            key={qIdx}
                            type="button"
                            onClick={() => goToQuestion(sIdx, qIdx)}
                            className={cn(
                              "h-7 w-7 rounded-lg text-[10px] font-bold transition-all",
                              isActive ? "bg-primary text-white" : isAnswered ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300" : "bg-muted text-muted-foreground",
                            )}
                          >
                            {gi + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </details>
        </div>
      </main>
    );
  }

  // ── Result ──
  if (phase === "result" && selectedExam) {
    const pct = Math.round((totalCorrect / totalQuestions) * 100);
    return (
      <main className="ios-container">
        <SessionHeader title="Kết quả thi" icon={<Award className="h-4 w-4" />} iconBg="bg-red-500" onClose={onBackHome} />

        <div className="mx-auto max-w-md space-y-5">
          {/* Score */}
          <div className="rounded-2xl border border-border/40 bg-card p-6 text-center shadow-sm">
            <div className={cn(
              "mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full text-3xl",
              passed ? "bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400" : "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400",
            )}>
              {passed ? <CheckCircle className="h-10 w-10" /> : <XCircle className="h-10 w-10" />}
            </div>
            <h2 className="text-2xl font-black">{totalCorrect}/{totalQuestions} ({pct}%)</h2>
            <p className={cn("mt-1 text-sm font-bold", passed ? "text-green-600" : "text-red-600")}>
              {passed ? "ĐẠT - Chúc mừng bạn!" : "CHƯA ĐẠT - Cố gắng lần sau nhé!"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Điểm đạt: {selectedExam.passingScore}%</p>
          </div>

          {/* Section breakdown */}
          <div className="rounded-2xl border border-border/40 bg-card p-4 shadow-sm space-y-3">
            <h3 className="text-sm font-bold">Chi tiết từng phần</h3>
            {sectionScores.map((s) => {
              const secPct = Math.round((s.correct / s.total) * 100);
              return (
                <div key={s.type} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{SECTION_LABELS[s.type]}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn("h-full rounded-full", secPct >= 60 ? "bg-green-500" : "bg-red-500")}
                        style={{ width: `${secPct}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold">{s.correct}/{s.total}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="space-y-2">
            {passed && (
              <button
                type="button"
                onClick={() => setPhase("certificate")}
                className="w-full rounded-2xl bg-primary py-3 text-sm font-extrabold text-white shadow-lg transition-all active:scale-[0.97]"
              >
                Xem chứng chỉ
              </button>
            )}
            <button
              type="button"
              onClick={() => startExam(selectedExam)}
              className={cn(
                "w-full rounded-2xl py-3 text-sm font-extrabold transition-all active:scale-[0.97]",
                passed ? "bg-muted text-foreground" : "bg-primary text-white shadow-lg",
              )}
            >
              Thử lại
            </button>
            {!passed && (
              <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 text-xs text-blue-800 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-200">
                <strong>Gợi ý:</strong> Hãy ôn tập thêm các phần yếu nhất và thử lại. Bạn có thể luyện tập với các bài học và kiểm tra trong ứng dụng.
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  // ── Certificate ──
  if (phase === "certificate" && selectedExam) {
    const pct = Math.round((totalCorrect / totalQuestions) * 100);
    const dateStr = new Date().toLocaleDateString("vi-VN", { year: "numeric", month: "long", day: "numeric" });
    return (
      <main className="ios-container">
        <SessionHeader title="Chứng chỉ" icon={<Award className="h-4 w-4" />} iconBg="bg-red-500" onClose={() => setPhase("result")} />

        {/* Print button */}
        <div className="mb-4 flex justify-end print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-md transition-all active:scale-[0.97]"
          >
            <Printer className="h-4 w-4" /> In chứng chỉ
          </button>
        </div>

        {/* Certificate */}
        <div className="cert-print mx-auto max-w-lg rounded-2xl border-4 border-double border-amber-400 bg-white p-8 shadow-xl dark:bg-white">
          {/* Inner border */}
          <div className="rounded-xl border-2 border-amber-200 p-6 text-center">
            {/* Header */}
            <div className="mb-6">
              <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
                <Award className="h-8 w-8 text-amber-600" />
              </div>
              <h1 className="text-2xl font-black tracking-wider text-gray-800 uppercase">Certificate of Achievement</h1>
              <p className="text-xs text-gray-500 tracking-widest uppercase mt-1">Chứng chỉ năng lực Tiếng Anh</p>
            </div>

            {/* Divider */}
            <div className="mx-auto mb-5 h-px w-32 bg-amber-300" />

            {/* Body */}
            <p className="text-xs text-gray-500 mb-2">This is to certify that</p>
            <h2 className="text-2xl font-black text-gray-800 mb-2">{student.name}</h2>

            <p className="text-xs text-gray-500 mb-4">has successfully passed the</p>

            <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-3 shadow-md">
              <span className="text-2xl font-black text-white">{selectedExam.level}</span>
              <span className="text-xs font-bold text-white/90">{selectedExam.titleVi}</span>
            </div>

            <p className="text-xs text-gray-500 mb-1">CEFR Level Examination</p>
            <p className="text-sm font-bold text-gray-700 mb-4">Điểm: {totalCorrect}/{totalQuestions} ({pct}%)</p>

            {/* Divider */}
            <div className="mx-auto mb-4 h-px w-32 bg-amber-300" />

            {/* Footer */}
            <div className="flex items-center justify-between text-[10px] text-gray-400">
              <div className="text-left">
                <p>Ngày cấp: {dateStr}</p>
                <p>Mã chứng chỉ: {certId}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-amber-600">English Buddy</p>
                <p>Nền tảng học tiếng Anh</p>
              </div>
            </div>
          </div>
        </div>

        {/* Print CSS */}
        <style>{`
          @media print {
            body * { visibility: hidden !important; }
            .cert-print, .cert-print * { visibility: visible !important; }
            .cert-print {
              position: fixed !important;
              left: 50% !important;
              top: 50% !important;
              transform: translate(-50%, -50%) !important;
              width: 700px !important;
              box-shadow: none !important;
            }
          }
        `}</style>
      </main>
    );
  }

  return null;
}
