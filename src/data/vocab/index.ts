// Tổng hợp toàn bộ từ vựng: gốc (seed) + Oxford 3000/5000 (chuẩn CEFR quốc tế)
import type { VocabularyWord } from "../../types";
// ── Từ vựng gốc (seed, đã có từ đầu) ──
import { KIDS_WORDS } from "./kids";
import { KIDS2_WORDS } from "./kids2";
import { KIDS3_WORDS } from "./kids3";
import { KIDS4_WORDS } from "./kids4";
import { KIDS5_WORDS } from "./kids5";
import { KIDS6_WORDS } from "./kids6";
import { A1F_WORDS } from "./a1f";
import { A1G_WORDS } from "./a1g";
import { A1H_WORDS } from "./a1h";
import { A1I_WORDS } from "./a1i";
import { A1J_WORDS } from "./a1j";
import { A2_WORDS } from "./a2";
import { A2B_WORDS } from "./a2b";
import { A2C_WORDS } from "./a2c";
import { A2D_WORDS } from "./a2d";
import { A2E_WORDS } from "./a2e";
import { A2F_WORDS } from "./a2f";
import { A2G_WORDS } from "./a2g";
import { B1_WORDS } from "./b1";
import { B1B_WORDS } from "./b1b";
import { B1C_WORDS } from "./b1c";
import { B1D_WORDS } from "./b1d";
import { B1E_WORDS } from "./b1e";
import { B1F_WORDS } from "./b1f";
import { B1G_WORDS } from "./b1g";
import { B2_WORDS } from "./b2";
import { B2B_WORDS } from "./b2b";
import { B2C_WORDS } from "./b2c";
import { B2D_WORDS } from "./b2d";
import { B2E_WORDS } from "./b2e";
import { B2F_WORDS } from "./b2f";
import { B2G_WORDS } from "./b2g";
import { C1_WORDS } from "./c1";
import { C1B_WORDS } from "./c1b";
import { C1C_WORDS } from "./c1c";
import { C1D_WORDS } from "./c1d";
import { C1E_WORDS } from "./c1e";
import { C1F_WORDS } from "./c1f";
import { C1G_WORDS } from "./c1g";
import { C1H_WORDS } from "./c1h";
import { C1I_WORDS } from "./c1i";
import { C1J_WORDS } from "./c1j";
// ── Oxford 3000+5000 (4251 từ chuẩn CEFR, map vào 35 topics) ──
import { OXFORD_ACADEMIC } from "./oxford_academic";
import { OXFORD_ANIMALS } from "./oxford_animals";
import { OXFORD_BODY } from "./oxford_body";
import { OXFORD_CITY } from "./oxford_city";
import { OXFORD_CLOTHES } from "./oxford_clothes";
import { OXFORD_COLORS } from "./oxford_colors";
import { OXFORD_COMMUNICATION } from "./oxford_communication";
import { OXFORD_COMMUNITY } from "./oxford_community";
import { OXFORD_CULTURE } from "./oxford_culture";
import { OXFORD_DAILY } from "./oxford_daily";
import { OXFORD_EDUCATION } from "./oxford_education";
import { OXFORD_ENTERTAINMENT } from "./oxford_entertainment";
import { OXFORD_ENVIRONMENT } from "./oxford_environment";
import { OXFORD_FAMILY } from "./oxford_family";
import { OXFORD_FEELINGS } from "./oxford_feelings";
import { OXFORD_FOOD } from "./oxford_food";
import { OXFORD_GLOBAL } from "./oxford_global";
import { OXFORD_GREETINGS } from "./oxford_greetings";
import { OXFORD_HEALTH } from "./oxford_health";
import { OXFORD_HOBBIES } from "./oxford_hobbies";
import { OXFORD_HOUSE } from "./oxford_house";
import { OXFORD_JOBS } from "./oxford_jobs";
import { OXFORD_NUMBERS } from "./oxford_numbers";
import { OXFORD_PEOPLE } from "./oxford_people";
import { OXFORD_POLITICS } from "./oxford_politics";
import { OXFORD_SCHOOL } from "./oxford_school";
import { OXFORD_SCIENCE } from "./oxford_science";
import { OXFORD_SHOPPING } from "./oxford_shopping";
import { OXFORD_SOCIETY } from "./oxford_society";
import { OXFORD_SPORTS } from "./oxford_sports";
import { OXFORD_TECHNOLOGY } from "./oxford_technology";
import { OXFORD_TRANSPORT } from "./oxford_transport";
import { OXFORD_TRAVEL } from "./oxford_travel";
import { OXFORD_WEATHER } from "./oxford_weather";
import { OXFORD_WORK } from "./oxford_work";

export const ALL_LEVEL_WORDS: VocabularyWord[] = [
  // Seed (gốc)
  ...KIDS_WORDS, ...KIDS2_WORDS, ...KIDS3_WORDS, ...KIDS4_WORDS, ...KIDS5_WORDS, ...KIDS6_WORDS,
  ...A1F_WORDS, ...A1G_WORDS, ...A1H_WORDS, ...A1I_WORDS, ...A1J_WORDS,
  ...A2_WORDS, ...A2B_WORDS, ...A2C_WORDS, ...A2D_WORDS, ...A2E_WORDS, ...A2F_WORDS, ...A2G_WORDS,
  ...B1_WORDS, ...B1B_WORDS, ...B1C_WORDS, ...B1D_WORDS, ...B1E_WORDS, ...B1F_WORDS, ...B1G_WORDS,
  ...B2_WORDS, ...B2B_WORDS, ...B2C_WORDS, ...B2D_WORDS, ...B2E_WORDS, ...B2F_WORDS, ...B2G_WORDS,
  ...C1_WORDS, ...C1B_WORDS, ...C1C_WORDS, ...C1D_WORDS, ...C1E_WORDS, ...C1F_WORDS, ...C1G_WORDS,
  ...C1H_WORDS, ...C1I_WORDS, ...C1J_WORDS,
  // Oxford 3000+5000 (chuẩn CEFR)
  ...OXFORD_ACADEMIC, ...OXFORD_ANIMALS, ...OXFORD_BODY, ...OXFORD_CITY, ...OXFORD_CLOTHES,
  ...OXFORD_COLORS, ...OXFORD_COMMUNICATION, ...OXFORD_COMMUNITY, ...OXFORD_CULTURE, ...OXFORD_DAILY,
  ...OXFORD_EDUCATION, ...OXFORD_ENTERTAINMENT, ...OXFORD_ENVIRONMENT, ...OXFORD_FAMILY, ...OXFORD_FEELINGS,
  ...OXFORD_FOOD, ...OXFORD_GLOBAL, ...OXFORD_GREETINGS, ...OXFORD_HEALTH, ...OXFORD_HOBBIES,
  ...OXFORD_HOUSE, ...OXFORD_JOBS, ...OXFORD_NUMBERS, ...OXFORD_PEOPLE, ...OXFORD_POLITICS,
  ...OXFORD_SCHOOL, ...OXFORD_SCIENCE, ...OXFORD_SHOPPING, ...OXFORD_SOCIETY, ...OXFORD_SPORTS,
  ...OXFORD_TECHNOLOGY, ...OXFORD_TRANSPORT, ...OXFORD_TRAVEL, ...OXFORD_WEATHER, ...OXFORD_WORK,
];
