// Tổng hợp toàn bộ từ vựng theo cấp độ (các file do agent sinh). Thêm đợt mới -> import ở đây.
import type { VocabularyWord } from "../../types";
import { KIDS_WORDS } from "./kids";
import { KIDS2_WORDS } from "./kids2";
import { KIDS3_WORDS } from "./kids3";
import { KIDS4_WORDS } from "./kids4";
import { KIDS5_WORDS } from "./kids5";
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
import { KIDS6_WORDS } from "./kids6";
import { A2F_WORDS } from "./a2f";
import { A2G_WORDS } from "./a2g";
import { B1F_WORDS } from "./b1f";
import { B1G_WORDS } from "./b1g";
import { B2F_WORDS } from "./b2f";
import { B2G_WORDS } from "./b2g";
import { C1H_WORDS } from "./c1h";
import { C1I_WORDS } from "./c1i";
import { C1J_WORDS } from "./c1j";

export const ALL_LEVEL_WORDS: VocabularyWord[] = [
  ...KIDS_WORDS, ...KIDS2_WORDS, ...KIDS3_WORDS, ...KIDS4_WORDS, ...KIDS5_WORDS, ...KIDS6_WORDS,
  ...A1F_WORDS, ...A1G_WORDS, ...A1H_WORDS, ...A1I_WORDS, ...A1J_WORDS,
  ...A2_WORDS, ...A2B_WORDS, ...A2C_WORDS, ...A2D_WORDS, ...A2E_WORDS, ...A2F_WORDS, ...A2G_WORDS,
  ...B1_WORDS, ...B1B_WORDS, ...B1C_WORDS, ...B1D_WORDS, ...B1E_WORDS, ...B1F_WORDS, ...B1G_WORDS,
  ...B2_WORDS, ...B2B_WORDS, ...B2C_WORDS, ...B2D_WORDS, ...B2E_WORDS, ...B2F_WORDS, ...B2G_WORDS,
  ...C1_WORDS, ...C1B_WORDS, ...C1C_WORDS, ...C1D_WORDS, ...C1E_WORDS, ...C1F_WORDS, ...C1G_WORDS,
  ...C1H_WORDS, ...C1I_WORDS, ...C1J_WORDS,
];
