// Tổng hợp toàn bộ từ vựng theo cấp độ (các file do agent sinh). Thêm đợt mới -> import ở đây.
import type { VocabularyWord } from "../../types";
import { KIDS_WORDS } from "./kids";
import { KIDS2_WORDS } from "./kids2";
import { KIDS3_WORDS } from "./kids3";
import { KIDS4_WORDS } from "./kids4";
import { KIDS5_WORDS } from "./kids5";
import { A2_WORDS } from "./a2";
import { A2B_WORDS } from "./a2b";
import { A2C_WORDS } from "./a2c";
import { A2D_WORDS } from "./a2d";
import { A2E_WORDS } from "./a2e";
import { B1_WORDS } from "./b1";
import { B1B_WORDS } from "./b1b";
import { B1C_WORDS } from "./b1c";
import { B1D_WORDS } from "./b1d";
import { B1E_WORDS } from "./b1e";
import { B2_WORDS } from "./b2";
import { B2B_WORDS } from "./b2b";
import { B2C_WORDS } from "./b2c";
import { B2D_WORDS } from "./b2d";
import { B2E_WORDS } from "./b2e";
import { C1_WORDS } from "./c1";
import { C1B_WORDS } from "./c1b";
import { C1C_WORDS } from "./c1c";
import { C1D_WORDS } from "./c1d";
import { C1E_WORDS } from "./c1e";
import { C1F_WORDS } from "./c1f";
import { C1G_WORDS } from "./c1g";

export const ALL_LEVEL_WORDS: VocabularyWord[] = [
  ...KIDS_WORDS, ...KIDS2_WORDS, ...KIDS3_WORDS, ...KIDS4_WORDS, ...KIDS5_WORDS,
  ...A2_WORDS, ...A2B_WORDS, ...A2C_WORDS, ...A2D_WORDS, ...A2E_WORDS,
  ...B1_WORDS, ...B1B_WORDS, ...B1C_WORDS, ...B1D_WORDS, ...B1E_WORDS,
  ...B2_WORDS, ...B2B_WORDS, ...B2C_WORDS, ...B2D_WORDS, ...B2E_WORDS,
  ...C1_WORDS, ...C1B_WORDS, ...C1C_WORDS, ...C1D_WORDS, ...C1E_WORDS, ...C1F_WORDS, ...C1G_WORDS,
];
