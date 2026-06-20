import type { Level } from "../types";

// SỬA theo từ điển quốc tế (Oxford/Cambridge) — sinh tự động từ audit (DeepSeek) + duyệt.
// Áp đè lên từ gốc theo id tại seedVocabulary. Để trống = không đổi.
export interface VocabOverride {
  phonetic?: string;
  meaning_vi?: string;
  meaning_en?: string;
  pos?: string;
  level?: Level;
}

export const VOCAB_OVERRIDES: Record<string, VocabOverride> = {
  "word_apple": {
    "pos": "danh từ"
  },
  "word_banana": {
    "pos": "danh từ"
  },
  "word_rice": {
    "pos": "danh từ"
  },
  "word_bread": {
    "pos": "danh từ"
  },
  "word_milk": {
    "pos": "danh từ"
  },
  "word_water": {
    "pos": "danh từ"
  },
  "word_egg": {
    "pos": "danh từ"
  },
  "word_chicken": {
    "pos": "danh từ"
  },
  "word_fish": {
    "pos": "danh từ"
  },
  "word_orange": {
    "pos": "danh từ"
  },
  "word_book": {
    "pos": "danh từ"
  },
  "word_pen": {
    "pos": "danh từ"
  },
  "word_pencil": {
    "pos": "danh từ"
  },
  "word_teacher": {
    "pos": "danh từ"
  },
  "word_student": {
    "pos": "danh từ"
  },
  "word_classroom": {
    "pos": "danh từ"
  },
  "word_lesson": {
    "pos": "danh từ"
  },
  "word_homework": {
    "pos": "danh từ"
  },
  "word_notebook": {
    "pos": "danh từ"
  },
  "word_subject": {
    "pos": "danh từ"
  },
  "word_father": {
    "pos": "danh từ",
    "phonetic": "/ˈfɑː.ðə(r)/"
  },
  "word_mother": {
    "pos": "danh từ",
    "phonetic": "/ˈmʌð.ə(r)/"
  },
  "word_brother": {
    "pos": "danh từ",
    "phonetic": "/ˈbrʌð.ə(r)/"
  },
  "word_sister": {
    "pos": "danh từ",
    "phonetic": "/ˈsɪs.tə(r)/"
  },
  "word_grandfather": {
    "pos": "danh từ",
    "phonetic": "/ˈɡræn.fɑː.ðə(r)/"
  },
  "word_grandmother": {
    "pos": "danh từ",
    "phonetic": "/ˈɡræn.mʌð.ə(r)/"
  },
  "word_uncle": {
    "pos": "danh từ",
    "phonetic": "/ˈʌŋ.kəl/"
  },
  "word_aunt": {
    "pos": "danh từ",
    "phonetic": "/ɑːnt/"
  },
  "word_cousin": {
    "pos": "danh từ",
    "phonetic": "/ˈkʌz.ən/"
  },
  "word_family": {
    "pos": "danh từ",
    "phonetic": "/ˈfæm.əl.i/"
  },
  "word_cat": {
    "pos": "danh từ",
    "phonetic": "/kæt/"
  },
  "word_dog": {
    "pos": "danh từ",
    "phonetic": "/dɒɡ/"
  },
  "word_bird": {
    "pos": "danh từ",
    "phonetic": "/bɜːd/"
  },
  "word_horse": {
    "pos": "danh từ",
    "phonetic": "/hɔːs/"
  },
  "word_cow": {
    "pos": "danh từ",
    "phonetic": "/kaʊ/"
  },
  "word_rabbit": {
    "pos": "danh từ",
    "phonetic": "/ˈræb.ɪt/"
  },
  "word_tiger": {
    "pos": "danh từ",
    "phonetic": "/ˈtaɪ.ɡə(r)/"
  },
  "word_lion": {
    "pos": "danh từ",
    "phonetic": "/ˈlaɪ.ən/"
  },
  "word_monkey": {
    "pos": "danh từ",
    "phonetic": "/ˈmʌŋ.ki/"
  },
  "word_wake_up": {
    "pos": "động từ",
    "phonetic": "/weɪk ʌp/"
  },
  "word_brush_teeth": {
    "pos": "động từ"
  },
  "word_go_to_school": {
    "pos": "động từ"
  },
  "word_study": {
    "pos": "động từ",
    "phonetic": "/ˈstʌd.i/"
  },
  "word_read": {
    "pos": "động từ"
  },
  "word_write": {
    "pos": "động từ"
  },
  "word_eat": {
    "pos": "động từ"
  },
  "word_drink": {
    "pos": "động từ"
  },
  "word_play": {
    "pos": "động từ"
  },
  "word_sleep": {
    "pos": "động từ"
  },
  "word_football": {
    "pos": "danh từ"
  },
  "word_basketball": {
    "pos": "danh từ"
  },
  "word_tennis": {
    "pos": "danh từ"
  },
  "word_swimming": {
    "pos": "danh từ"
  },
  "word_running": {
    "pos": "danh từ"
  },
  "word_badminton": {
    "pos": "danh từ"
  },
  "word_volleyball": {
    "pos": "danh từ"
  },
  "word_cycling": {
    "pos": "danh từ"
  },
  "word_ball": {
    "pos": "danh từ"
  },
  "word_team": {
    "pos": "danh từ"
  },
  "word_happy": {
    "pos": "tính từ"
  },
  "word_sad": {
    "pos": "tính từ",
    "phonetic": "/sæd/"
  },
  "word_angry": {
    "pos": "tính từ"
  },
  "word_tired": {
    "pos": "tính từ"
  },
  "word_scared": {
    "pos": "tính từ",
    "phonetic": "/skeəd/"
  },
  "word_excited": {
    "pos": "tính từ"
  },
  "word_bored": {
    "pos": "tính từ"
  },
  "word_hungry": {
    "pos": "tính từ"
  },
  "word_surprised": {
    "pos": "tính từ"
  },
  "word_shy": {
    "pos": "tính từ"
  },
  "word_door": {
    "pos": "danh từ",
    "phonetic": "/dɔːr/"
  },
  "word_window": {
    "pos": "danh từ"
  },
  "word_table": {
    "pos": "danh từ"
  },
  "word_chair": {
    "pos": "danh từ",
    "phonetic": "/tʃeər/"
  },
  "word_bed": {
    "pos": "danh từ"
  },
  "word_kitchen": {
    "pos": "danh từ"
  },
  "word_room": {
    "pos": "danh từ"
  },
  "word_roof": {
    "pos": "danh từ"
  },
  "word_wall": {
    "pos": "danh từ"
  },
  "word_floor": {
    "pos": "danh từ",
    "phonetic": "/flɔːr/"
  },
  "word_shirt": {
    "pos": "danh từ"
  },
  "word_trousers": {
    "pos": "danh từ"
  },
  "word_dress": {
    "pos": "danh từ"
  },
  "word_shoes": {
    "pos": "danh từ"
  },
  "word_hat": {
    "pos": "danh từ"
  },
  "word_socks": {
    "pos": "danh từ"
  },
  "word_jacket": {
    "pos": "danh từ"
  },
  "word_skirt": {
    "pos": "danh từ"
  },
  "word_shorts": {
    "pos": "danh từ"
  },
  "word_sweater": {
    "pos": "danh từ"
  },
  "word_airplane": {
    "pos": "danh từ",
    "phonetic": "/ˈeə.pleɪn/",
    "meaning_vi": "máy bay"
  },
  "word_train": {
    "pos": "danh từ"
  },
  "word_bus": {
    "pos": "danh từ"
  },
  "word_car": {
    "pos": "danh từ",
    "phonetic": "/kɑːr/"
  },
  "word_ticket": {
    "pos": "danh từ"
  },
  "word_suitcase": {
    "pos": "danh từ"
  },
  "word_map": {
    "pos": "danh từ"
  },
  "word_hotel": {
    "pos": "danh từ"
  },
  "word_beach": {
    "pos": "danh từ"
  },
  "word_mountain": {
    "pos": "danh từ"
  },
  "word_kids_red": {
    "pos": "tính từ"
  },
  "word_kids_blue": {
    "pos": "tính từ"
  },
  "word_kids_green": {
    "pos": "tính từ"
  },
  "word_kids_yellow": {
    "pos": "tính từ"
  },
  "word_kids_one": {
    "pos": "số từ"
  },
  "word_kids_two": {
    "pos": "số từ"
  },
  "word_kids_three": {
    "pos": "số từ"
  },
  "word_kids_ball": {
    "pos": "danh từ"
  },
  "word_kids_doll": {
    "pos": "danh từ"
  },
  "word_kids_kite": {
    "pos": "danh từ"
  },
  "word_kids_teddy": {
    "pos": "danh từ"
  },
  "word_kids_hand": {
    "pos": "danh từ"
  },
  "word_kids_foot": {
    "pos": "danh từ"
  },
  "word_kids_eye": {
    "pos": "danh từ"
  },
  "word_kids_nose": {
    "pos": "danh từ"
  },
  "word_kids_ear": {
    "pos": "danh từ"
  },
  "word_kids_fish": {
    "pos": "danh từ"
  },
  "word_kids_bird": {
    "pos": "danh từ"
  },
  "word_kids_duck": {
    "pos": "danh từ"
  },
  "word_kids_cow": {
    "pos": "danh từ"
  },
  "word_kids_pig": {
    "pos": "danh từ"
  },
  "word_kids_milk": {
    "pos": "danh từ"
  },
  "word_kids_egg": {
    "pos": "danh từ"
  },
  "word_kids_cake": {
    "pos": "danh từ"
  },
  "word_kids_rice": {
    "pos": "danh từ",
    "meaning_vi": "gạo"
  },
  "word_kids_water": {
    "pos": "danh từ"
  },
  "word_kids_mom": {
    "pos": "danh từ"
  },
  "word_kids_dad": {
    "pos": "danh từ"
  },
  "word_kids_baby": {
    "pos": "danh từ"
  },
  "word_kids_sister": {
    "pos": "danh từ"
  },
  "word_kids_brother": {
    "pos": "danh từ"
  },
  "word_kids_bed": {
    "pos": "danh từ"
  },
  "word_kids_door": {
    "pos": "danh từ"
  },
  "word_kids_chair": {
    "pos": "danh từ"
  },
  "word_kids_cup": {
    "pos": "danh từ"
  },
  "word_kids_hat": {
    "pos": "danh từ"
  },
  "word_kids_shoe": {
    "pos": "danh từ"
  },
  "word_kids_sock": {
    "pos": "danh từ"
  },
  "word_kids_happy": {
    "pos": "tính từ"
  },
  "word_kids_sad": {
    "pos": "tính từ"
  },
  "word_kids_run": {
    "pos": "động từ"
  },
  "word_kids_jump": {
    "pos": "động từ"
  },
  "word_kids_sleep": {
    "pos": "động từ"
  },
  "word_kids_pen": {
    "pos": "danh từ"
  },
  "word_kids_bag": {
    "pos": "danh từ"
  },
  "word_kids2_hen": {
    "pos": "danh từ"
  },
  "word_kids2_sheep": {
    "pos": "danh từ"
  },
  "word_kids2_goat": {
    "pos": "danh từ"
  },
  "word_kids2_horse": {
    "pos": "danh từ",
    "phonetic": "/hɔːrs/",
    "meaning_vi": "con ngựa"
  },
  "word_kids2_dog": {
    "pos": "danh từ",
    "phonetic": "/dɒɡ/"
  },
  "word_kids2_cat": {
    "pos": "danh từ"
  },
  "word_kids2_rabbit": {
    "pos": "danh từ"
  },
  "word_kids2_mouse": {
    "pos": "danh từ"
  },
  "word_kids2_chick": {
    "pos": "danh từ"
  },
  "word_kids2_tiger": {
    "pos": "danh từ"
  },
  "word_kids2_lion": {
    "pos": "danh từ"
  },
  "word_kids2_bear": {
    "pos": "danh từ",
    "phonetic": "/beər/"
  },
  "word_kids2_fox": {
    "pos": "danh từ",
    "phonetic": "/fɒks/"
  },
  "word_kids2_wolf": {
    "pos": "danh từ"
  },
  "word_kids2_deer": {
    "pos": "danh từ",
    "phonetic": "/dɪər/"
  },
  "word_kids2_monkey": {
    "pos": "danh từ"
  },
  "word_kids2_elephant": {
    "pos": "danh từ"
  },
  "word_kids2_giraffe": {
    "pos": "danh từ",
    "phonetic": "/dʒəˈrɑːf/"
  },
  "word_kids2_zebra": {
    "pos": "danh từ"
  },
  "word_kids2_snake": {
    "pos": "danh từ"
  },
  "word_kids2_frog": {
    "pos": "danh từ",
    "phonetic": "/frɒɡ/"
  },
  "word_kids2_owl": {
    "pos": "danh từ"
  },
  "word_kids2_panda": {
    "pos": "danh từ"
  },
  "word_kids2_shark": {
    "pos": "danh từ",
    "phonetic": "/ʃɑːk/"
  },
  "word_kids2_whale": {
    "pos": "danh từ"
  },
  "word_kids2_dolphin": {
    "pos": "danh từ",
    "phonetic": "/ˈdɒl.fɪn/"
  },
  "word_kids2_crab": {
    "pos": "danh từ",
    "phonetic": "/kræb/"
  },
  "word_kids2_octopus": {
    "pos": "danh từ",
    "phonetic": "/ˈɒk.tə.pəs/"
  },
  "word_kids2_turtle": {
    "pos": "danh từ",
    "phonetic": "/ˈtɜː.təl/"
  },
  "word_kids2_seahorse": {
    "pos": "danh từ",
    "phonetic": "/ˈsiː.hɔːs/"
  },
  "word_kids2_starfish": {
    "pos": "danh từ",
    "phonetic": "/ˈstɑː.fɪʃ/"
  },
  "word_kids2_jellyfish": {
    "pos": "danh từ",
    "phonetic": "/ˈdʒel.i.fɪʃ/"
  },
  "word_kids2_bee": {
    "pos": "danh từ"
  },
  "word_kids2_ant": {
    "pos": "danh từ"
  },
  "word_kids2_butterfly": {
    "pos": "danh từ",
    "phonetic": "/ˈbʌt.ə.flaɪ/"
  },
  "word_kids2_spider": {
    "pos": "danh từ",
    "phonetic": "/ˈspaɪ.dər/"
  },
  "word_kids2_ladybug": {
    "pos": "danh từ"
  },
  "word_kids2_snail": {
    "pos": "danh từ"
  },
  "word_kids2_apple": {
    "pos": "danh từ"
  },
  "word_kids2_banana": {
    "pos": "danh từ"
  },
  "word_kids2_orange": {
    "pos": "danh từ",
    "phonetic": "/ˈɒr.ɪndʒ/"
  },
  "word_kids2_grape": {
    "pos": "danh từ"
  },
  "word_kids2_mango": {
    "pos": "danh từ",
    "phonetic": "/ˈmæŋ.ɡəʊ/"
  },
  "word_kids2_watermelon": {
    "pos": "danh từ",
    "phonetic": "/ˈwɔː.təˌmel.ən/"
  },
  "word_kids2_strawberry": {
    "pos": "danh từ",
    "phonetic": "/ˈstrɔː.bər.i/"
  },
  "word_kids2_lemon": {
    "pos": "danh từ"
  },
  "word_kids2_peach": {
    "pos": "danh từ"
  },
  "word_kids2_pear": {
    "pos": "danh từ",
    "phonetic": "/peər/"
  },
  "word_kids2_pineapple": {
    "pos": "danh từ"
  },
  "word_kids2_cherry": {
    "pos": "danh từ"
  },
  "word_kids2_coconut": {
    "pos": "danh từ",
    "phonetic": "/ˈkəʊ.kə.nʌt/"
  },
  "word_kids2_carrot": {
    "pos": "danh từ",
    "phonetic": "/ˈkær.ət/"
  },
  "word_kids2_tomato": {
    "pos": "danh từ",
    "phonetic": "/təˈmɑː.təʊ/"
  },
  "word_kids2_potato": {
    "pos": "danh từ",
    "phonetic": "/pəˈteɪ.təʊ/"
  },
  "word_kids2_corn": {
    "pos": "danh từ",
    "phonetic": "/kɔːn/"
  },
  "word_kids2_onion": {
    "pos": "danh từ"
  },
  "word_kids2_cucumber": {
    "pos": "danh từ",
    "phonetic": "/ˈkjuː.kʌm.bər/"
  },
  "word_kids2_pumpkin": {
    "pos": "danh từ"
  },
  "word_kids2_mushroom": {
    "pos": "danh từ"
  },
  "word_kids2_bread": {
    "pos": "danh từ"
  },
  "word_kids2_cheese": {
    "pos": "danh từ"
  },
  "word_kids2_noodles": {
    "pos": "danh từ"
  },
  "word_kids2_soup": {
    "pos": "danh từ"
  },
  "word_kids2_pizza": {
    "pos": "danh từ"
  },
  "word_kids2_sandwich": {
    "pos": "danh từ"
  },
  "word_kids2_chicken": {
    "pos": "danh từ"
  },
  "word_kids2_meat": {
    "pos": "danh từ"
  },
  "word_kids2_candy": {
    "pos": "danh từ"
  },
  "word_kids2_chocolate": {
    "pos": "danh từ",
    "phonetic": "/ˈtʃɒk.lət/"
  },
  "word_kids2_cookie": {
    "pos": "danh từ"
  },
  "word_kids2_icecream": {
    "pos": "danh từ",
    "phonetic": "/ˌaɪs ˈkriːm/"
  },
  "word_kids2_honey": {
    "pos": "danh từ"
  },
  "word_kids2_juice": {
    "pos": "danh từ"
  },
  "word_kids2_tea": {
    "pos": "danh từ"
  },
  "word_kids3_spoon": {
    "pos": "danh từ"
  },
  "word_kids3_fork": {
    "pos": "danh từ",
    "phonetic": "/fɔːk/"
  },
  "word_kids3_knife": {
    "pos": "danh từ"
  },
  "word_kids3_plate": {
    "pos": "danh từ"
  },
  "word_kids3_bowl": {
    "pos": "danh từ",
    "phonetic": "/bəʊl/"
  },
  "word_kids3_glass": {
    "pos": "danh từ"
  },
  "word_kids3_bottle": {
    "pos": "danh từ"
  },
  "word_kids3_pot": {
    "pos": "danh từ"
  },
  "word_kids3_pan": {
    "pos": "danh từ"
  },
  "word_kids3_table": {
    "pos": "danh từ"
  },
  "word_kids3_sofa": {
    "pos": "danh từ",
    "phonetic": "/ˈsəʊfə/"
  },
  "word_kids3_pillow": {
    "pos": "danh từ",
    "phonetic": "/ˈpɪləʊ/"
  },
  "word_kids3_blanket": {
    "pos": "danh từ"
  },
  "word_kids3_lamp": {
    "pos": "danh từ"
  },
  "word_kids3_clock": {
    "pos": "danh từ"
  },
  "word_kids3_window": {
    "pos": "danh từ",
    "phonetic": "/ˈwɪndəʊ/"
  },
  "word_kids3_wall": {
    "pos": "danh từ"
  },
  "word_kids3_floor": {
    "pos": "danh từ",
    "phonetic": "/flɔːr/"
  },
  "word_kids3_roof": {
    "pos": "danh từ"
  },
  "word_kids3_kitchen": {
    "pos": "danh từ"
  },
  "word_kids3_bedroom": {
    "pos": "danh từ"
  },
  "word_kids3_bathroom": {
    "pos": "danh từ"
  },
  "word_kids3_stairs": {
    "pos": "danh từ",
    "phonetic": "/steəz/"
  },
  "word_kids3_key": {
    "pos": "danh từ"
  },
  "word_kids3_mirror": {
    "pos": "danh từ",
    "phonetic": "/ˈmɪrə(r)/"
  },
  "word_kids3_towel": {
    "pos": "danh từ",
    "phonetic": "/ˈtaʊəl/"
  },
  "word_kids3_soap": {
    "pos": "danh từ",
    "phonetic": "/səʊp/"
  },
  "word_kids3_brush": {
    "pos": "danh từ"
  },
  "word_kids3_cupboard": {
    "pos": "danh từ",
    "phonetic": "/ˈkʌbəd/"
  },
  "word_kids3_fridge": {
    "pos": "danh từ"
  },
  "word_kids3_fan": {
    "pos": "danh từ"
  },
  "word_kids3_shirt": {
    "pos": "danh từ",
    "phonetic": "/ʃɜːt/"
  },
  "word_kids3_tshirt": {
    "pos": "danh từ",
    "phonetic": "/ˈtiː ʃɜːt/"
  },
  "word_kids3_pants": {
    "pos": "danh từ"
  },
  "word_kids3_shorts": {
    "pos": "danh từ",
    "phonetic": "/ʃɔːts/"
  },
  "word_kids3_skirt": {
    "pos": "danh từ",
    "phonetic": "/skɜːt/"
  },
  "word_kids3_dress": {
    "pos": "danh từ"
  },
  "word_kids3_coat": {
    "pos": "danh từ",
    "phonetic": "/kəʊt/"
  },
  "word_kids3_jacket": {
    "pos": "danh từ"
  },
  "word_kids3_sweater": {
    "pos": "danh từ",
    "phonetic": "/ˈswetə(r)/"
  },
  "word_kids3_socks": {
    "pos": "danh từ",
    "phonetic": "/sɒks/"
  },
  "word_kids3_shoes": {
    "pos": "danh từ"
  },
  "word_kids3_boots": {
    "pos": "danh từ"
  },
  "word_kids3_cap": {
    "pos": "danh từ"
  },
  "word_kids3_gloves": {
    "pos": "danh từ"
  },
  "word_kids3_scarf": {
    "pos": "danh từ",
    "phonetic": "/skɑːf/"
  },
  "word_kids3_belt": {
    "pos": "danh từ"
  },
  "word_kids3_button": {
    "pos": "danh từ"
  },
  "word_kids3_pocket": {
    "pos": "danh từ"
  },
  "word_kids3_pajamas": {
    "pos": "danh từ"
  },
  "word_kids3_uniform": {
    "pos": "danh từ",
    "phonetic": "/ˈjuːnɪfɔːm/"
  },
  "word_kids3_raincoat": {
    "pos": "danh từ",
    "phonetic": "/ˈreɪnkəʊt/"
  },
  "word_kids3_clap": {
    "pos": "động từ"
  },
  "word_kids3_wash": {
    "pos": "động từ"
  },
  "word_kids3_brushteeth": {
    "pos": "động từ",
    "phonetic": "/brʌʃ tiːθ/"
  },
  "word_kids3_eat": {
    "pos": "động từ"
  },
  "word_kids3_drink": {
    "pos": "động từ"
  },
  "word_kids3_wake": {
    "pos": "động từ",
    "phonetic": "/weɪk ʌp/"
  },
  "word_kids3_walk": {
    "pos": "động từ"
  },
  "word_kids3_sit": {
    "pos": "động từ"
  },
  "word_kids3_stand": {
    "pos": "động từ"
  },
  "word_kids3_read": {
    "pos": "động từ"
  },
  "word_kids3_write": {
    "pos": "động từ"
  },
  "word_kids3_draw": {
    "pos": "động từ"
  },
  "word_kids3_sing": {
    "pos": "động từ"
  },
  "word_kids3_dance": {
    "pos": "động từ",
    "phonetic": "/dɑːns/"
  },
  "word_kids3_play": {
    "pos": "động từ"
  },
  "word_kids3_smile": {
    "pos": "động từ"
  },
  "word_kids3_cry": {
    "pos": "động từ"
  },
  "word_kids3_open": {
    "pos": "động từ",
    "phonetic": "/ˈəʊpən/"
  },
  "word_kids3_close": {
    "pos": "động từ",
    "phonetic": "/kləʊz/"
  },
  "word_kids3_push": {
    "pos": "động từ"
  },
  "word_kids3_pull": {
    "pos": "động từ"
  },
  "word_kids3_throw": {
    "pos": "động từ",
    "phonetic": "/θrəʊ/"
  },
  "word_kids3_catch": {
    "pos": "động từ"
  },
  "word_kids3_help": {
    "pos": "động từ"
  },
  "word_kids3_listen": {
    "pos": "động từ"
  },
  "word_kids3_dressup": {
    "pos": "động từ",
    "phonetic": "/ɡet drest/"
  },
  "word_kids3_wave": {
    "pos": "động từ"
  },
  "word_kids4_school": {
    "pos": "danh từ"
  },
  "word_kids4_classroom": {
    "pos": "danh từ",
    "phonetic": "/ˈklɑːsruːm/"
  },
  "word_kids4_teacher": {
    "pos": "danh từ",
    "phonetic": "/ˈtiːtʃər/"
  },
  "word_kids4_student": {
    "pos": "danh từ"
  },
  "word_kids4_friend": {
    "pos": "danh từ"
  },
  "word_kids4_book": {
    "pos": "danh từ"
  },
  "word_kids4_pencil": {
    "pos": "danh từ"
  },
  "word_kids4_eraser": {
    "pos": "danh từ",
    "phonetic": "/ɪˈreɪ.zər/",
    "meaning_vi": "cục tẩy",
    "level": "kids"
  },
  "word_kids4_ruler": {
    "pos": "danh từ"
  },
  "word_kids4_notebook": {
    "pos": "danh từ"
  },
  "word_kids4_paper": {
    "pos": "danh từ"
  },
  "word_kids4_marker": {
    "pos": "danh từ"
  },
  "word_kids4_glue": {
    "pos": "danh từ"
  },
  "word_kids4_scissors": {
    "pos": "danh từ"
  },
  "word_kids4_desk": {
    "pos": "danh từ"
  },
  "word_kids4_board": {
    "pos": "danh từ"
  },
  "word_kids4_chalk": {
    "pos": "danh từ"
  },
  "word_kids4_class": {
    "pos": "danh từ"
  },
  "word_kids4_lesson": {
    "pos": "danh từ"
  },
  "word_kids4_homework": {
    "pos": "danh từ"
  },
  "word_kids4_test": {
    "pos": "danh từ"
  },
  "word_kids4_letter": {
    "pos": "danh từ"
  },
  "word_kids4_number": {
    "pos": "danh từ"
  },
  "word_kids4_alphabet": {
    "pos": "danh từ",
    "phonetic": "/ˈæl.fə.bet/"
  },
  "word_kids4_count": {
    "pos": "động từ"
  },
  "word_kids4_spell": {
    "pos": "động từ"
  },
  "word_kids4_color": {
    "pos": "động từ",
    "phonetic": "/ˈkʌl.ər/"
  },
  "word_kids4_learn": {
    "pos": "động từ"
  },
  "word_kids4_study": {
    "pos": "động từ"
  },
  "word_kids4_answer": {
    "pos": "danh từ"
  },
  "word_kids4_question": {
    "pos": "danh từ"
  },
  "word_kids4_raise_hand": {
    "pos": "động từ",
    "phonetic": "/reɪz hænd/"
  },
  "word_kids4_bell": {
    "pos": "danh từ"
  },
  "word_kids4_recess": {
    "pos": "danh từ"
  },
  "word_kids4_playground": {
    "pos": "danh từ"
  },
  "word_kids4_library": {
    "pos": "danh từ"
  },
  "word_kids4_bus": {
    "pos": "danh từ"
  },
  "word_kids4_lunch": {
    "pos": "danh từ"
  },
  "word_kids4_lunchbox": {
    "pos": "danh từ"
  },
  "word_kids4_paint": {
    "pos": "động từ"
  },
  "word_kids4_picture": {
    "pos": "danh từ"
  },
  "word_kids4_story": {
    "pos": "danh từ"
  },
  "word_kids4_clock_school": {
    "pos": "danh từ",
    "phonetic": "/ˈkæl.ɪn.dər/"
  },
  "word_kids4_globe": {
    "pos": "danh từ"
  },
  "word_kids4_map": {
    "pos": "danh từ"
  },
  "word_kids4_crayon_box": {
    "pos": "danh từ",
    "phonetic": "/ˈʃɑːpənər/",
    "meaning_vi": "đồ gọt bút chì"
  },
  "word_kids4_backpack": {
    "pos": "danh từ"
  },
  "word_kids4_uniform_school": {
    "pos": "danh từ"
  },
  "word_kids4_angry": {
    "pos": "tính từ"
  },
  "word_kids4_scared": {
    "pos": "tính từ",
    "phonetic": "/skeəd/"
  },
  "word_kids4_tired": {
    "pos": "tính từ"
  },
  "word_kids4_hungry": {
    "pos": "tính từ"
  },
  "word_kids4_thirsty": {
    "pos": "tính từ"
  },
  "word_kids4_excited": {
    "pos": "tính từ"
  },
  "word_kids4_shy": {
    "pos": "tính từ"
  },
  "word_kids4_brave": {
    "pos": "tính từ"
  },
  "word_kids4_proud": {
    "pos": "tính từ"
  },
  "word_kids4_surprised": {
    "pos": "tính từ"
  },
  "word_kids4_bored": {
    "pos": "tính từ"
  },
  "word_kids4_sick": {
    "pos": "tính từ"
  },
  "word_kids4_sleepy": {
    "pos": "tính từ"
  },
  "word_kids4_calm": {
    "pos": "tính từ"
  },
  "word_kids4_worried": {
    "pos": "tính từ"
  },
  "word_kids4_kind": {
    "pos": "tính từ",
    "phonetic": "/kaɪnd/"
  },
  "word_kids4_friendly": {
    "pos": "tính từ"
  },
  "word_kids4_glad": {
    "pos": "tính từ"
  },
  "word_kids4_lonely": {
    "pos": "tính từ"
  },
  "word_kids4_silly": {
    "pos": "tính từ"
  },
  "word_kids4_love": {
    "pos": "động từ"
  },
  "word_kids4_hug": {
    "pos": "danh từ"
  },
  "word_kids4_laugh": {
    "pos": "động từ"
  },
  "word_kids4_share": {
    "pos": "động từ"
  },
  "word_kids4_thank": {
    "pos": "động từ"
  },
  "word_kids4_sorry": {
    "pos": "tính từ"
  },
  "word_kids4_please": {
    "pos": "thán từ"
  },
  "word_kids4_nice": {
    "pos": "tính từ"
  },
  "word_kids4_naughty": {
    "pos": "tính từ"
  },
  "word_kids4_good": {
    "pos": "tính từ"
  },
  "word_kids5_grandpa": {
    "pos": "danh từ"
  },
  "word_kids5_grandma": {
    "pos": "danh từ"
  },
  "word_kids5_father": {
    "pos": "danh từ"
  },
  "word_kids5_mother": {
    "pos": "danh từ"
  },
  "word_kids5_parents": {
    "pos": "danh từ"
  },
  "word_kids5_son": {
    "pos": "danh từ"
  },
  "word_kids5_daughter": {
    "pos": "danh từ",
    "phonetic": "/ˈdɔːtər/"
  },
  "word_kids5_uncle": {
    "pos": "danh từ"
  },
  "word_kids5_aunt": {
    "pos": "danh từ",
    "phonetic": "/ɑːnt/"
  },
  "word_kids5_cousin": {
    "pos": "danh từ"
  },
  "word_kids5_family": {
    "pos": "danh từ"
  },
  "word_kids5_boy": {
    "pos": "danh từ"
  },
  "word_kids5_girl": {
    "pos": "danh từ",
    "phonetic": "/ɡɜːl/"
  },
  "word_kids5_man": {
    "pos": "danh từ"
  },
  "word_kids5_woman": {
    "pos": "danh từ"
  },
  "word_kids5_kid": {
    "pos": "danh từ"
  },
  "word_kids5_child": {
    "pos": "danh từ"
  },
  "word_kids5_twin": {
    "pos": "danh từ"
  },
  "word_kids5_husband": {
    "pos": "danh từ"
  },
  "word_kids5_wife": {
    "pos": "danh từ"
  },
  "word_kids5_grandson": {
    "pos": "danh từ"
  },
  "word_kids5_pet": {
    "pos": "danh từ"
  },
  "word_kids5_neighbor": {
    "pos": "danh từ",
    "phonetic": "/ˈneɪbər/"
  },
  "word_kids5_name": {
    "pos": "danh từ"
  },
  "word_kids5_home": {
    "pos": "danh từ",
    "phonetic": "/həʊm/"
  },
  "word_kids5_house": {
    "pos": "danh từ"
  },
  "word_kids5_kiss": {
    "pos": "động từ"
  },
  "word_kids5_old": {
    "pos": "tính từ",
    "phonetic": "/əʊld/"
  },
  "word_kids5_young": {
    "pos": "tính từ"
  },
  "word_kids5_tall": {
    "pos": "tính từ"
  },
  "word_kids5_short": {
    "pos": "tính từ",
    "phonetic": "/ʃɔːt/"
  },
  "word_kids5_wash_face": {
    "pos": "động từ",
    "phonetic": "/wɒʃ feɪs/"
  },
  "word_kids5_comb_hair": {
    "pos": "động từ",
    "phonetic": "/kəʊm heər/"
  },
  "word_kids5_take_bath": {
    "pos": "động từ",
    "phonetic": "/teɪk ə bɑːθ/"
  },
  "word_kids5_shower": {
    "pos": "danh từ",
    "phonetic": "/ˈʃaʊər/"
  },
  "word_kids5_breakfast": {
    "pos": "danh từ"
  },
  "word_kids5_dinner": {
    "pos": "danh từ"
  },
  "word_kids5_brush_hair": {
    "pos": "động từ",
    "phonetic": "/brʌʃ heər/"
  },
  "word_kids5_go_to_school": {
    "pos": "động từ",
    "phonetic": "/ɡəʊ tə skuːl/"
  },
  "word_kids5_play_outside": {
    "pos": "động từ",
    "phonetic": "/pleɪ ˌaʊtˈsaɪd/"
  },
  "word_kids5_clean": {
    "pos": "động từ"
  },
  "word_kids5_cook": {
    "pos": "động từ"
  },
  "word_kids5_help_mom": {
    "pos": "động từ",
    "phonetic": "/help mɒm/"
  },
  "word_kids5_watch_tv": {
    "pos": "động từ",
    "phonetic": "/wɒtʃ ˌtiːˈviː/"
  },
  "word_kids5_go_to_bed": {
    "pos": "động từ",
    "phonetic": "/ɡəʊ tə bed/"
  },
  "word_kids5_get_up": {
    "pos": "động từ"
  },
  "word_kids5_morning": {
    "pos": "danh từ",
    "phonetic": "/ˈmɔː.nɪŋ/"
  },
  "word_kids5_afternoon": {
    "pos": "danh từ",
    "phonetic": "/ˌæf.tərˈnuːn/"
  },
  "word_kids5_evening": {
    "pos": "danh từ",
    "phonetic": "/ˈiːv.nɪŋ/"
  },
  "word_kids5_night": {
    "pos": "danh từ"
  },
  "word_kids5_day": {
    "pos": "danh từ"
  },
  "word_kids5_toothbrush": {
    "pos": "danh từ"
  },
  "word_kids5_toothpaste": {
    "pos": "danh từ"
  },
  "word_kids5_eat_dinner": {
    "pos": "động từ"
  },
  "word_kids5_set_table": {
    "pos": "động từ"
  },
  "word_kids5_wash_hands": {
    "pos": "động từ",
    "phonetic": "/wɒʃ hændz/"
  },
  "word_kids5_get_ready": {
    "pos": "động từ"
  },
  "word_kids5_put_on": {
    "pos": "động từ",
    "phonetic": "/pʊt ɒn/"
  },
  "word_kids5_take_off": {
    "pos": "động từ",
    "phonetic": "/teɪk ɒf/"
  },
  "word_kids5_tidy_up": {
    "pos": "động từ"
  },
  "word_kids5_feed_pet": {
    "pos": "động từ"
  },
  "word_kids5_water_plants": {
    "pos": "động từ"
  },
  "word_kids5_make_bed": {
    "pos": "động từ"
  },
  "word_kids5_rest": {
    "pos": "động từ"
  },
  "word_kids5_nap": {
    "pos": "danh từ"
  },
  "word_kids5_snack": {
    "pos": "danh từ",
    "meaning_vi": "bữa ăn nhẹ, đồ ăn nhẹ"
  },
  "word_kids5_brush_shoes": {
    "pos": "động từ",
    "phonetic": "/weər ʃuːz/",
    "meaning_vi": "đi giày"
  },
  "word_kids5_say_hello": {
    "pos": "động từ",
    "phonetic": "/seɪ həˈloʊ/"
  },
  "word_kids6_grasshopper": {
    "pos": "danh từ",
    "phonetic": "/ˈɡrɑːs.hɒp.ər/"
  },
  "word_kids6_dragonfly": {
    "pos": "danh từ"
  },
  "word_kids6_caterpillar": {
    "pos": "danh từ",
    "phonetic": "/ˈkæt.ə.pɪl.ər/"
  },
  "word_kids6_mosquito": {
    "pos": "danh từ",
    "phonetic": "/məˈskiː.toʊ/"
  },
  "word_kids6_firefly": {
    "pos": "danh từ",
    "phonetic": "/ˈfaɪə.flaɪ/"
  },
  "word_kids6_beetle": {
    "pos": "danh từ"
  },
  "word_kids6_cricket": {
    "pos": "danh từ"
  },
  "word_kids6_worm": {
    "pos": "danh từ"
  },
  "word_kids6_moth": {
    "pos": "danh từ"
  },
  "word_kids6_parrot": {
    "pos": "danh từ"
  },
  "word_kids6_penguin": {
    "pos": "danh từ"
  },
  "word_kids6_eagle": {
    "pos": "danh từ"
  },
  "word_kids6_peacock": {
    "pos": "danh từ"
  },
  "word_kids6_sparrow": {
    "pos": "danh từ",
    "phonetic": "/ˈspær.oʊ/"
  },
  "word_kids6_swan": {
    "pos": "danh từ"
  },
  "word_kids6_woodpecker": {
    "pos": "danh từ"
  },
  "word_kids6_pigeon": {
    "pos": "danh từ"
  },
  "word_a2c_throat": {
    "pos": "danh từ"
  },
  "word_a2c_tooth": {
    "pos": "danh từ"
  },
  "word_a2c_back": {
    "pos": "danh từ"
  },
  "word_a2c_arm": {
    "pos": "danh từ"
  },
  "word_a2c_leg": {
    "pos": "danh từ"
  },
  "word_a2c_ear": {
    "pos": "danh từ"
  },
  "word_a2c_headache": {
    "pos": "danh từ"
  },
  "word_a2c_stomachache": {
    "pos": "danh từ"
  },
  "word_a2c_toothache": {
    "pos": "danh từ"
  },
  "word_a2c_cold": {
    "pos": "danh từ"
  },
  "word_a2c_cough": {
    "pos": "danh từ"
  },
  "word_a2c_fever": {
    "pos": "danh từ"
  },
  "word_a2c_sneeze": {
    "pos": "danh từ"
  },
  "word_a2c_pain": {
    "pos": "danh từ"
  },
  "word_a2c_sick": {
    "pos": "tính từ"
  },
  "word_a2c_ill": {
    "pos": "tính từ"
  },
  "word_a2c_tired_h": {
    "pos": "tính từ",
    "meaning_vi": "yếu"
  },
  "word_a2c_doctor": {
    "pos": "danh từ"
  },
  "word_a2c_nurse": {
    "pos": "danh từ"
  },
  "word_a2c_medicine": {
    "pos": "danh từ"
  },
  "word_a2c_hospital": {
    "pos": "danh từ"
  },
  "word_a2c_healthy": {
    "pos": "tính từ"
  },
  "word_a2c_rest": {
    "pos": "danh từ",
    "phonetic": "/rest/",
    "meaning_vi": "nghỉ ngơi",
    "level": "a2"
  },
  "word_a2c_sleep": {
    "pos": "động từ"
  },
  "word_a2d_lunch": {
    "pos": "danh từ"
  },
  "word_a2d_meal": {
    "pos": "danh từ"
  },
  "word_a2d_fruit": {
    "pos": "danh từ"
  },
  "word_a2d_meat": {
    "pos": "danh từ"
  },
  "word_a2d_fish": {
    "pos": "danh từ"
  },
  "word_a2d_chicken": {
    "pos": "danh từ"
  },
  "word_a2d_beef": {
    "pos": "danh từ"
  },
  "word_a2d_egg": {
    "pos": "danh từ"
  },
  "word_a2d_bread": {
    "pos": "danh từ"
  },
  "word_a2d_rice": {
    "pos": "danh từ"
  },
  "word_a2d_noodle": {
    "pos": "danh từ"
  },
  "word_a2d_soup": {
    "pos": "danh từ"
  },
  "word_a2d_salad": {
    "pos": "danh từ"
  },
  "word_a2d_cheese": {
    "pos": "danh từ"
  },
  "word_a2d_butter": {
    "pos": "danh từ"
  },
  "word_a2d_milk": {
    "pos": "danh từ"
  },
  "word_a2d_sugar": {
    "pos": "danh từ",
    "phonetic": "/ˈʃʊɡ.ər/"
  },
  "word_a2d_salt": {
    "pos": "danh từ",
    "phonetic": "/sɒlt/"
  },
  "word_a2d_pepper": {
    "pos": "danh từ",
    "phonetic": "/ˈpep.ər/"
  },
  "word_a2d_oil": {
    "pos": "danh từ",
    "phonetic": "/ɔɪl/"
  },
  "word_a2d_flour": {
    "pos": "danh từ",
    "phonetic": "/flaʊər/"
  },
  "word_a2d_cake": {
    "pos": "danh từ",
    "phonetic": "/keɪk/"
  },
  "word_a2d_cookie": {
    "pos": "danh từ",
    "phonetic": "/ˈkʊk.i/"
  },
  "word_a2d_sandwich": {
    "pos": "danh từ",
    "phonetic": "/ˈsæn.wɪdʒ/"
  },
  "word_a2d_pizza": {
    "pos": "danh từ",
    "phonetic": "/ˈpiːt.sə/"
  },
  "word_a2d_dessert": {
    "pos": "danh từ",
    "phonetic": "/dɪˈzɜːt/"
  },
  "word_a2d_coffee": {
    "pos": "danh từ",
    "phonetic": "/ˈkɒf.i/"
  },
  "word_a2d_tea": {
    "pos": "danh từ",
    "phonetic": "/tiː/"
  },
  "word_a2d_juice": {
    "pos": "danh từ",
    "phonetic": "/dʒuːs/"
  },
  "word_a2d_water": {
    "pos": "danh từ",
    "phonetic": "/ˈwɔː.tər/"
  },
  "word_a2d_taste": {
    "pos": "danh từ",
    "phonetic": "/teɪst/"
  },
  "word_a2d_sweet": {
    "pos": "tính từ",
    "phonetic": "/swiːt/"
  },
  "word_a2d_sour": {
    "pos": "tính từ",
    "phonetic": "/saʊər/"
  },
  "word_a2d_spicy": {
    "pos": "tính từ",
    "phonetic": "/ˈspaɪ.si/"
  },
  "word_a2d_hungry": {
    "pos": "tính từ",
    "phonetic": "/ˈhʌŋ.ɡri/"
  },
  "word_a2d_thirsty": {
    "pos": "tính từ",
    "phonetic": "/ˈθɜː.sti/"
  },
  "word_a2d_cook": {
    "pos": "động từ",
    "level": "a1"
  },
  "word_a2d_boil": {
    "pos": "động từ",
    "level": "a1"
  },
  "word_a2d_fry": {
    "pos": "động từ",
    "level": "a1"
  },
  "word_a2d_bake": {
    "pos": "động từ",
    "level": "a1"
  },
  "word_a2d_menu": {
    "pos": "danh từ",
    "level": "a1"
  },
  "word_a2d_plate": {
    "pos": "danh từ",
    "level": "a1"
  },
  "word_a2d_bowl": {
    "pos": "danh từ",
    "level": "a1"
  },
  "word_a2d_fork": {
    "pos": "danh từ",
    "level": "a1"
  },
  "word_a2d_spoon": {
    "pos": "danh từ",
    "level": "a1"
  },
  "word_a2d_knife": {
    "pos": "danh từ",
    "level": "a1"
  },
  "word_a2d_cup": {
    "pos": "danh từ",
    "level": "a1"
  },
  "word_a2d_glass": {
    "pos": "danh từ",
    "level": "a1"
  },
  "word_a2d_bottle": {
    "pos": "danh từ",
    "level": "a1"
  },
  "word_a2d_house": {
    "pos": "danh từ",
    "level": "a1"
  },
  "word_a2d_apartment": {
    "pos": "danh từ",
    "level": "a1"
  },
  "word_a2d_room": {
    "pos": "danh từ",
    "level": "a1"
  },
  "word_a2d_bathroom": {
    "pos": "danh từ",
    "level": "a1"
  },
  "word_a2d_living_room": {
    "pos": "danh từ",
    "level": "a1"
  },
  "word_a2d_garage": {
    "pos": "danh từ",
    "level": "a1"
  },
  "word_a2d_floor": {
    "pos": "danh từ",
    "level": "a1"
  },
  "word_a2d_wall": {
    "pos": "danh từ"
  },
  "word_a2d_roof": {
    "pos": "danh từ"
  },
  "word_a2d_door": {
    "pos": "danh từ"
  },
  "word_a2d_stairs": {
    "pos": "danh từ"
  },
  "word_a2d_table": {
    "pos": "danh từ"
  },
  "word_a2d_chair": {
    "pos": "danh từ"
  },
  "word_a2d_sofa": {
    "pos": "danh từ"
  },
  "word_a2d_bed": {
    "pos": "danh từ"
  },
  "word_a2d_pillow": {
    "pos": "danh từ"
  },
  "word_a2d_blanket": {
    "pos": "danh từ"
  },
  "word_a2d_lamp": {
    "pos": "danh từ"
  },
  "word_a2d_mirror": {
    "pos": "danh từ"
  },
  "word_a2d_cupboard": {
    "pos": "danh từ"
  },
  "word_a2d_shelf": {
    "pos": "danh từ"
  },
  "word_a2d_drawer": {
    "pos": "danh từ"
  },
  "word_a2d_curtain": {
    "pos": "danh từ"
  },
  "word_a2d_carpet": {
    "pos": "danh từ"
  },
  "word_a2d_fridge": {
    "pos": "danh từ"
  },
  "word_a2d_oven": {
    "pos": "danh từ"
  },
  "word_a2d_stove": {
    "pos": "danh từ"
  },
  "word_a2d_sink": {
    "pos": "danh từ"
  },
  "word_a2d_television": {
    "pos": "danh từ"
  },
  "word_a2d_clock": {
    "pos": "danh từ"
  },
  "word_a2d_key": {
    "pos": "danh từ"
  },
  "word_a2d_light": {
    "pos": "danh từ"
  },
  "word_a2e_routine": {
    "pos": "danh từ"
  },
  "word_a2e_wakeup": {
    "pos": "động từ"
  },
  "word_a2e_getup": {
    "pos": "động từ"
  },
  "word_a2e_alarm": {
    "pos": "danh từ"
  },
  "word_a2e_brush": {
    "pos": "động từ"
  },
  "word_a2e_wash": {
    "pos": "động từ"
  },
  "word_a2e_bath": {
    "pos": "danh từ"
  },
  "word_a2e_tidy": {
    "pos": "tính từ"
  },
  "word_a2e_chore": {
    "pos": "danh từ"
  },
  "word_a2e_housework": {
    "pos": "danh từ"
  },
  "word_a2e_laundry": {
    "pos": "danh từ"
  },
  "word_a2e_iron": {
    "pos": "động từ"
  },
  "word_a2e_sweep": {
    "pos": "động từ"
  },
  "word_a2e_vacuum": {
    "pos": "động từ"
  },
  "word_a2e_dishes": {
    "pos": "danh từ"
  },
  "word_a2e_makebed": {
    "pos": "động từ"
  },
  "word_a2e_getdressed": {
    "pos": "động từ"
  },
  "word_a2e_comb": {
    "pos": "danh từ",
    "meaning_vi": "lược"
  },
  "word_a2e_leave": {
    "pos": "động từ"
  },
  "word_a2e_commute": {
    "pos": "động từ"
  },
  "word_a2e_arrive": {
    "pos": "động từ"
  },
  "word_a2e_work": {
    "pos": "động từ"
  },
  "word_a2e_homework": {
    "pos": "động từ"
  },
  "word_a2e_nap": {
    "pos": "danh từ"
  },
  "word_a2e_tv": {
    "pos": "động từ"
  },
  "word_a2e_walk": {
    "pos": "động từ"
  },
  "word_a2e_shop": {
    "pos": "động từ"
  },
  "word_a2e_groceries": {
    "pos": "danh từ"
  },
  "word_a2e_bedtime": {
    "pos": "danh từ"
  },
  "word_a2e_sleep": {
    "pos": "động từ"
  },
  "word_a2e_schedule": {
    "pos": "danh từ"
  },
  "word_a2e_dailylife": {
    "pos": "danh từ"
  },
  "word_a2e_freetime": {
    "pos": "danh từ"
  },
  "word_a2e_clothes": {
    "pos": "danh từ"
  },
  "word_a2e_shirt": {
    "pos": "danh từ"
  },
  "word_a2e_tshirt": {
    "pos": "danh từ"
  },
  "word_a2e_trousers": {
    "pos": "danh từ"
  },
  "word_a2e_jeans": {
    "pos": "danh từ"
  },
  "word_a2e_shorts": {
    "pos": "danh từ"
  },
  "word_a2e_skirt": {
    "pos": "danh từ"
  },
  "word_a2e_dress": {
    "pos": "danh từ"
  },
  "word_a2e_coat": {
    "pos": "danh từ"
  },
  "word_a2e_sweater": {
    "pos": "danh từ"
  },
  "word_a2e_hoodie": {
    "pos": "danh từ"
  },
  "word_a2e_suit": {
    "pos": "danh từ"
  },
  "word_a2e_socks": {
    "pos": "danh từ"
  },
  "word_a2e_shoes": {
    "pos": "danh từ"
  },
  "word_a2e_sandals": {
    "pos": "danh từ"
  },
  "word_a2e_trainers": {
    "pos": "danh từ"
  },
  "word_a2e_hat": {
    "pos": "danh từ"
  },
  "word_a2e_cap": {
    "pos": "danh từ"
  },
  "word_a2e_belt": {
    "pos": "danh từ"
  },
  "word_a2e_tie": {
    "pos": "danh từ"
  },
  "word_a2e_glasses": {
    "pos": "danh từ"
  },
  "word_a2e_pyjamas": {
    "pos": "danh từ"
  },
  "word_a2e_pocket": {
    "pos": "danh từ"
  },
  "word_a2e_button": {
    "pos": "danh từ"
  },
  "word_a2e_zip": {
    "pos": "danh từ"
  },
  "word_a2e_size": {
    "pos": "danh từ"
  },
  "word_a2e_fit": {
    "pos": "động từ"
  },
  "word_a2e_tryon": {
    "pos": "động từ"
  },
  "word_a2e_wear": {
    "pos": "động từ"
  },
  "word_a2e_puton": {
    "pos": "động từ"
  },
  "word_a2e_takeoff": {
    "pos": "động từ"
  },
  "word_a2e_fashion": {
    "pos": "danh từ"
  },
  "word_a2e_style": {
    "pos": "danh từ"
  },
  "word_a2e_cotton": {
    "pos": "danh từ"
  },
  "word_a2e_wool": {
    "pos": "danh từ"
  },
  "word_a2e_pattern": {
    "pos": "danh từ"
  },
  "word_a2e_stripe": {
    "pos": "danh từ"
  },
  "word_a2e_jewellery": {
    "pos": "danh từ"
  },
  "word_a2e_ring": {
    "pos": "danh từ"
  },
  "word_a2e_watch": {
    "pos": "danh từ"
  },
  "word_a2f_boarding": {
    "pos": "danh từ"
  },
  "word_a2f_customs": {
    "pos": "danh từ"
  },
  "word_a2f_reservation": {
    "pos": "danh từ"
  },
  "word_a2f_singleroom": {
    "pos": "danh từ"
  },
  "word_a2f_doubleroom": {
    "pos": "danh từ"
  },
  "word_a2f_keycard": {
    "pos": "danh từ"
  },
  "word_a2f_lobby": {
    "pos": "danh từ"
  },
  "word_a2f_checkout": {
    "pos": "danh từ"
  },
  "word_a2f_towel": {
    "pos": "danh từ"
  },
  "word_a2f_elevator": {
    "pos": "danh từ"
  },
  "word_a2f_stay": {
    "pos": "động từ"
  },
  "word_a2f_left": {
    "pos": "tính từ"
  },
  "word_a2f_right": {
    "pos": "tính từ"
  },
  "word_a2f_straight": {
    "pos": "tính từ"
  },
  "word_a2f_corner": {
    "pos": "danh từ"
  },
  "word_a2f_crossroads": {
    "pos": "danh từ"
  },
  "word_a2f_traffic": {
    "pos": "danh từ",
    "phonetic": "/ˈtræf.ɪk laɪt/",
    "meaning_vi": "đèn giao thông",
    "level": "a2"
  },
  "word_a2f_street": {
    "pos": "danh từ"
  },
  "word_a2f_roundabout": {
    "pos": "danh từ"
  },
  "word_a2f_direction": {
    "pos": "danh từ"
  },
  "word_a2f_near": {
    "pos": "giới từ"
  },
  "word_a2f_far": {
    "pos": "tính từ"
  },
  "word_a2f_opposite": {
    "pos": "giới từ"
  },
  "word_a2f_between": {
    "pos": "giới từ"
  },
  "word_a2f_clinic": {
    "pos": "danh từ"
  },
  "word_a2f_appointment": {
    "pos": "danh từ"
  },
  "word_a2f_patient": {
    "pos": "danh từ"
  },
  "word_a2f_dentist": {
    "pos": "danh từ"
  },
  "word_a2f_checkup": {
    "pos": "danh từ"
  },
  "word_a2f_examine": {
    "pos": "động từ"
  },
  "word_a2f_treatment": {
    "pos": "danh từ"
  },
  "word_a2f_pill": {
    "pos": "danh từ"
  },
  "word_a2f_tablet": {
    "pos": "danh từ"
  },
  "word_a2f_pharmacy": {
    "pos": "danh từ"
  },
  "word_a2f_prescription": {
    "pos": "danh từ"
  },
  "word_a2f_bandage": {
    "pos": "danh từ"
  },
  "word_a2f_painkiller": {
    "pos": "danh từ"
  },
  "word_a2f_dose": {
    "pos": "danh từ"
  },
  "word_a2f_vitamin": {
    "pos": "danh từ"
  },
  "word_a2f_injection": {
    "pos": "danh từ"
  },
  "word_a2f_sorethroat": {
    "pos": "danh từ"
  },
  "word_a2f_dizzy": {
    "pos": "tính từ"
  },
  "word_a2f_injury": {
    "pos": "danh từ"
  },
  "word_a2f_rash": {
    "pos": "danh từ"
  },
  "word_a2f_temperature": {
    "pos": "danh từ"
  },
  "word_a2g_restaurant": {
    "pos": "danh từ",
    "phonetic": "/ˈres.tər.ɒnt/",
    "meaning_vi": "nhà hàng"
  },
  "word_a2g_waiter": {
    "pos": "danh từ",
    "phonetic": "/ˈweɪ.tər/"
  },
  "word_a2g_waitress": {
    "pos": "danh từ",
    "phonetic": "/ˈweɪ.trəs/"
  },
  "word_a2g_order": {
    "pos": "danh từ",
    "phonetic": "/ˈɔːr.dər/",
    "meaning_vi": "gọi món"
  },
  "word_a2g_bill": {
    "pos": "danh từ"
  },
  "word_a2g_tip": {
    "pos": "danh từ"
  },
  "word_a2g_customer": {
    "pos": "danh từ",
    "phonetic": "/ˈkʌs.tə.mər/"
  },
  "word_a2g_cafe": {
    "pos": "danh từ",
    "phonetic": "/ˈkæf.eɪ/",
    "meaning_vi": "quán cà phê"
  },
  "word_a2g_takeaway": {
    "pos": "danh từ"
  },
  "word_a2g_starter": {
    "pos": "danh từ"
  },
  "word_a2g_maincourse": {
    "pos": "danh từ",
    "phonetic": "/ˌmeɪn ˈkɔːrs/"
  },
  "word_a2g_grill": {
    "pos": "danh từ",
    "meaning_vi": "vỉ nướng"
  },
  "word_a2g_mix": {
    "pos": "động từ"
  },
  "word_a2g_cut": {
    "pos": "động từ"
  },
  "word_a2g_peel": {
    "pos": "động từ"
  },
  "word_a2g_pan": {
    "pos": "danh từ"
  },
  "word_a2g_pot": {
    "pos": "danh từ"
  },
  "word_a2g_ingredient": {
    "pos": "danh từ"
  },
  "word_a2g_dish": {
    "pos": "danh từ"
  },
  "word_a2g_flavour": {
    "pos": "danh từ"
  },
  "word_a2g_bitter": {
    "pos": "tính từ"
  },
  "word_a2g_salty": {
    "pos": "tính từ"
  },
  "word_a2g_tasty": {
    "pos": "tính từ"
  },
  "word_a2g_fresh": {
    "pos": "tính từ"
  },
  "word_a2g_hot": {
    "pos": "tính từ"
  },
  "word_a2g_sauce": {
    "pos": "danh từ"
  },
  "word_a2g_oily": {
    "pos": "tính từ"
  },
  "word_a2g_timetable": {
    "pos": "danh từ"
  },
  "word_a2g_club": {
    "pos": "danh từ"
  },
  "word_a2g_practice": {
    "pos": "danh từ"
  },
  "word_a2g_activity": {
    "pos": "danh từ"
  },
  "word_a2g_drama": {
    "pos": "danh từ"
  },
  "word_a2g_hobby": {
    "pos": "danh từ"
  },
  "word_a2g_band": {
    "pos": "danh từ"
  },
  "word_a2g_competition": {
    "pos": "danh từ"
  },
  "word_a2g_mark": {
    "pos": "danh từ"
  },
  "word_a2g_pass": {
    "pos": "động từ"
  },
  "word_a2g_fail": {
    "pos": "động từ"
  },
  "word_a2g_result": {
    "pos": "danh từ"
  },
  "word_a2g_revise": {
    "pos": "động từ"
  },
  "word_b1_pollution": {
    "pos": "danh từ"
  },
  "word_b1_recycle": {
    "pos": "động từ"
  },
  "word_b1_climate": {
    "pos": "danh từ"
  },
  "word_b1_renewable": {
    "pos": "tính từ"
  },
  "word_b1_endangered": {
    "pos": "tính từ"
  },
  "word_b1_waste": {
    "pos": "danh từ"
  },
  "word_b1_forest": {
    "pos": "danh từ"
  },
  "word_b1_drought": {
    "pos": "danh từ"
  },
  "word_b1_device": {
    "pos": "danh từ"
  },
  "word_b1_software": {
    "pos": "danh từ"
  },
  "word_b1_download": {
    "pos": "động từ"
  },
  "word_b1_password": {
    "pos": "danh từ"
  },
  "word_b1_screen": {
    "pos": "danh từ"
  },
  "word_b1_network": {
    "pos": "danh từ"
  },
  "word_b1_wireless": {
    "pos": "tính từ"
  },
  "word_b1_update": {
    "pos": "động từ"
  },
  "word_b1_symptom": {
    "pos": "danh từ"
  },
  "word_b1_disease": {
    "pos": "danh từ"
  },
  "word_b1_treatment": {
    "pos": "danh từ"
  },
  "word_b1_exercise": {
    "pos": "danh từ",
    "meaning_vi": "bài tập"
  },
  "word_b1_nutrition": {
    "pos": "danh từ"
  },
  "word_b1_injury": {
    "pos": "danh từ"
  },
  "word_b1_recover": {
    "pos": "động từ"
  },
  "word_b1_prescription": {
    "pos": "danh từ"
  },
  "word_b1_destination": {
    "pos": "danh từ"
  },
  "word_b1_luggage": {
    "pos": "danh từ"
  },
  "word_b1_passport": {
    "pos": "danh từ"
  },
  "word_b1_booking": {
    "pos": "danh từ"
  },
  "word_b1_journey": {
    "pos": "danh từ"
  },
  "word_b1_sightseeing": {
    "pos": "danh từ"
  },
  "word_b1_abroad": {
    "pos": "trạng từ"
  },
  "word_b1_souvenir": {
    "pos": "danh từ"
  },
  "word_b1_colleague": {
    "pos": "danh từ"
  },
  "word_b1_deadline": {
    "pos": "danh từ"
  },
  "word_b1_meeting": {
    "pos": "danh từ"
  },
  "word_b1_salary": {
    "pos": "danh từ"
  },
  "word_b1_interview": {
    "pos": "danh từ"
  },
  "word_b1_promotion": {
    "pos": "danh từ"
  },
  "word_b1_employee": {
    "pos": "danh từ"
  },
  "word_b1_skill": {
    "pos": "danh từ"
  },
  "word_b1_schedule": {
    "pos": "danh từ"
  },
  "word_b1_neighbour": {
    "pos": "danh từ"
  },
  "word_b1_chore": {
    "pos": "danh từ"
  },
  "word_b1_routine": {
    "pos": "danh từ"
  },
  "word_b1_grocery": {
    "pos": "danh từ"
  },
  "word_b1_furniture": {
    "pos": "danh từ"
  },
  "word_b1_appointment": {
    "pos": "danh từ"
  },
  "word_b1_budget": {
    "pos": "danh từ"
  },
  "word_b1_hobby": {
    "pos": "danh từ"
  },
  "word_b1b_hardware": {
    "pos": "danh từ"
  },
  "word_b1b_internet": {
    "pos": "danh từ"
  },
  "word_b1b_website": {
    "pos": "danh từ"
  },
  "word_b1b_upload": {
    "pos": "động từ"
  },
  "word_b1b_keyboard": {
    "pos": "danh từ"
  },
  "word_b1b_application": {
    "pos": "danh từ"
  },
  "word_b1b_file": {
    "pos": "danh từ"
  },
  "word_b1b_folder": {
    "pos": "danh từ"
  },
  "word_b1b_server": {
    "pos": "danh từ"
  },
  "word_b1b_browser": {
    "pos": "danh từ"
  },
  "word_b1b_search": {
    "pos": "động từ"
  },
  "word_b1b_data": {
    "pos": "danh từ"
  },
  "word_b1b_battery": {
    "pos": "danh từ",
    "phonetic": "/ˈbætəri/"
  },
  "word_b1b_charger": {
    "pos": "danh từ"
  },
  "word_b1b_camera": {
    "pos": "danh từ",
    "phonetic": "/ˈkæmərə/"
  },
  "word_b1b_printer": {
    "pos": "danh từ"
  },
  "word_b1b_scanner": {
    "pos": "danh từ"
  },
  "word_b1b_install": {
    "pos": "động từ"
  },
  "word_b1b_connect": {
    "pos": "động từ"
  },
  "word_b1b_digital": {
    "pos": "tính từ"
  },
  "word_b1b_online": {
    "pos": "tính từ"
  },
  "word_b1b_offline": {
    "pos": "tính từ"
  },
  "word_b1b_message": {
    "pos": "danh từ"
  },
  "word_b1b_account": {
    "pos": "danh từ"
  },
  "word_b1b_screenshot": {
    "pos": "danh từ"
  },
  "word_b1b_storage": {
    "pos": "danh từ"
  },
  "word_b1b_signal": {
    "pos": "danh từ"
  },
  "word_b1b_robot": {
    "pos": "danh từ"
  },
  "word_b1b_invention": {
    "pos": "danh từ"
  },
  "word_b1b_virtual": {
    "pos": "tính từ"
  },
  "word_b1b_smart": {
    "pos": "tính từ"
  },
  "word_b1b_update_system": {
    "pos": "động từ",
    "meaning_vi": "nâng cấp"
  },
  "word_b1b_contract": {
    "pos": "danh từ"
  },
  "word_b1b_employer": {
    "pos": "danh từ"
  },
  "word_b1b_manager": {
    "pos": "danh từ"
  },
  "word_b1b_experience": {
    "pos": "danh từ"
  },
  "word_b1b_career": {
    "pos": "danh từ"
  },
  "word_b1b_project": {
    "pos": "danh từ"
  },
  "word_b1b_task": {
    "pos": "danh từ"
  },
  "word_b1b_report": {
    "pos": "danh từ"
  },
  "word_b1b_office": {
    "pos": "danh từ"
  },
  "word_b1b_staff": {
    "pos": "danh từ"
  },
  "word_b1b_department": {
    "pos": "danh từ"
  },
  "word_b1b_overtime": {
    "pos": "danh từ"
  },
  "word_b1b_shift": {
    "pos": "danh từ"
  },
  "word_b1b_apply": {
    "pos": "động từ"
  },
  "word_b1b_resign": {
    "pos": "động từ"
  },
  "word_b1b_recruit": {
    "pos": "động từ"
  },
  "word_b1b_training": {
    "pos": "danh từ"
  },
  "word_b1b_workplace": {
    "pos": "danh từ"
  },
  "word_b1b_teamwork": {
    "pos": "danh từ"
  },
  "word_b1b_client": {
    "pos": "danh từ"
  },
  "word_b1b_customer": {
    "pos": "danh từ",
    "phonetic": "/ˈkʌstəmər/"
  },
  "word_b1b_profit": {
    "pos": "danh từ"
  },
  "word_b1b_invoice": {
    "pos": "danh từ"
  },
  "word_b1b_benefit": {
    "pos": "danh từ"
  },
  "word_b1b_bonus": {
    "pos": "danh từ"
  },
  "word_b1b_pension": {
    "pos": "danh từ"
  },
  "word_b1b_retire": {
    "pos": "động từ"
  },
  "word_b1b_position": {
    "pos": "danh từ"
  },
  "word_b1b_qualification": {
    "pos": "danh từ"
  },
  "word_b1b_resume": {
    "pos": "danh từ"
  },
  "word_b1b_freelance": {
    "pos": "tính từ",
    "meaning_vi": "tự do"
  },
  "word_b1b_workload": {
    "pos": "danh từ"
  },
  "word_b1b_break": {
    "pos": "danh từ"
  },
  "word_b1c_pollute": {
    "pos": "động từ"
  },
  "word_b1c_environment": {
    "pos": "danh từ",
    "phonetic": "/ɪnˈvaɪrənmənt/"
  },
  "word_b1c_global_warming": {
    "pos": "danh từ"
  },
  "word_b1c_pollutant": {
    "pos": "danh từ"
  },
  "word_b1c_rubbish": {
    "pos": "danh từ"
  },
  "word_b1c_litter": {
    "pos": "danh từ"
  },
  "word_b1c_plastic": {
    "pos": "danh từ"
  },
  "word_b1c_energy": {
    "pos": "danh từ"
  },
  "word_b1c_solar": {
    "pos": "tính từ"
  },
  "word_b1c_wind_power": {
    "pos": "danh từ"
  },
  "word_b1c_fuel": {
    "pos": "danh từ"
  },
  "word_b1c_coal": {
    "pos": "danh từ"
  },
  "word_b1c_emission": {
    "pos": "danh từ"
  },
  "word_b1c_carbon": {
    "pos": "danh từ"
  },
  "word_b1c_deforestation": {
    "pos": "danh từ"
  },
  "word_b1c_wildlife": {
    "pos": "danh từ"
  },
  "word_b1c_species": {
    "pos": "danh từ"
  },
  "word_b1c_extinct": {
    "pos": "tính từ"
  },
  "word_b1c_protect": {
    "pos": "động từ"
  },
  "word_b1c_conservation": {
    "pos": "danh từ"
  },
  "word_b1c_natural": {
    "pos": "tính từ"
  },
  "word_b1c_resource": {
    "pos": "danh từ"
  },
  "word_b1c_ocean": {
    "pos": "danh từ"
  },
  "word_b1c_atmosphere": {
    "pos": "danh từ",
    "phonetic": "/ˈæt.mə.sfɪər/"
  },
  "word_b1c_flood": {
    "pos": "danh từ"
  },
  "word_b1c_disaster": {
    "pos": "danh từ"
  },
  "word_b1c_temperature": {
    "pos": "danh từ",
    "phonetic": "/ˈtem.prə.tʃər/"
  },
  "word_b1c_greenhouse": {
    "pos": "danh từ"
  },
  "word_b1c_environmental": {
    "pos": "tính từ"
  },
  "word_b1c_sustainable": {
    "pos": "tính từ"
  },
  "word_b1c_reduce": {
    "pos": "động từ"
  },
  "word_b1c_reuse": {
    "pos": "động từ"
  },
  "word_b1c_organic": {
    "pos": "tính từ"
  },
  "word_b1c_smoke": {
    "pos": "danh từ"
  },
  "word_b1c_chemical": {
    "pos": "danh từ"
  },
  "word_b1c_oil_spill": {
    "pos": "danh từ"
  },
  "word_b1c_landfill": {
    "pos": "danh từ"
  },
  "word_b1c_ecosystem": {
    "pos": "danh từ"
  },
  "word_b1c_habitat": {
    "pos": "danh từ"
  },
  "word_b1c_clean_energy": {
    "pos": "danh từ"
  },
  "word_b1c_drinking_water": {
    "pos": "danh từ"
  },
  "word_b1c_save": {
    "pos": "động từ"
  },
  "word_b1c_planet": {
    "pos": "danh từ"
  },
  "word_b1c_health": {
    "pos": "danh từ"
  },
  "word_b1c_healthy": {
    "pos": "tính từ"
  },
  "word_b1c_illness": {
    "pos": "danh từ"
  },
  "word_b1c_infection": {
    "pos": "danh từ"
  },
  "word_b1c_virus": {
    "pos": "danh từ"
  },
  "word_b1c_fever": {
    "pos": "danh từ"
  },
  "word_b1c_medicine": {
    "pos": "danh từ"
  },
  "word_b1c_patient": {
    "pos": "danh từ"
  },
  "word_b1c_doctor": {
    "pos": "danh từ"
  },
  "word_b1c_nurse": {
    "pos": "danh từ"
  },
  "word_b1c_hospital": {
    "pos": "danh từ"
  },
  "word_b1c_diet": {
    "pos": "danh từ"
  },
  "word_b1c_vitamin": {
    "pos": "danh từ"
  },
  "word_b1c_protein": {
    "pos": "danh từ"
  },
  "word_b1c_calorie": {
    "pos": "danh từ"
  },
  "word_b1c_balanced": {
    "pos": "tính từ"
  },
  "word_b1c_workout": {
    "pos": "danh từ"
  },
  "word_b1c_fitness": {
    "pos": "danh từ"
  },
  "word_b1c_muscle": {
    "pos": "danh từ"
  },
  "word_b1c_stress": {
    "pos": "danh từ"
  },
  "word_b1c_relax": {
    "pos": "động từ"
  },
  "word_b1c_prevent": {
    "pos": "động từ"
  },
  "word_b1c_pain": {
    "pos": "danh từ"
  },
  "word_b1c_obesity": {
    "pos": "danh từ"
  },
  "word_b1c_mental_health": {
    "pos": "danh từ"
  },
  "word_b1c_sleep": {
    "pos": "danh từ"
  },
  "word_b1c_vaccine": {
    "pos": "danh từ"
  },
  "word_b1c_checkup": {
    "pos": "danh từ"
  },
  "word_b1c_cough": {
    "pos": "danh từ"
  },
  "word_b1c_allergy": {
    "pos": "danh từ"
  },
  "word_b1c_hygiene": {
    "pos": "danh từ"
  },
  "word_b1c_fit": {
    "pos": "tính từ"
  },
  "word_b1d_community": {
    "pos": "danh từ"
  },
  "word_b1d_society": {
    "pos": "danh từ"
  },
  "word_b1d_citizen": {
    "pos": "danh từ"
  },
  "word_b1d_government": {
    "pos": "danh từ"
  },
  "word_b1d_population": {
    "pos": "danh từ"
  },
  "word_b1d_culture": {
    "pos": "danh từ"
  },
  "word_b1d_tradition": {
    "pos": "danh từ"
  },
  "word_b1d_custom": {
    "pos": "danh từ"
  },
  "word_b1d_law": {
    "pos": "danh từ"
  },
  "word_b1d_right": {
    "pos": "danh từ"
  },
  "word_b1d_freedom": {
    "pos": "danh từ"
  },
  "word_b1d_equality": {
    "pos": "danh từ"
  },
  "word_b1d_poverty": {
    "pos": "danh từ"
  },
  "word_b1d_charity": {
    "pos": "danh từ"
  },
  "word_b1d_volunteer": {
    "pos": "danh từ"
  },
  "word_b1d_crime": {
    "pos": "danh từ"
  },
  "word_b1d_education": {
    "pos": "danh từ"
  },
  "word_b1d_unemployment": {
    "pos": "danh từ"
  },
  "word_b1d_responsibility": {
    "pos": "danh từ"
  },
  "word_b1d_respect": {
    "pos": "danh từ"
  },
  "word_b1d_relationship": {
    "pos": "danh từ"
  },
  "word_b1d_immigrant": {
    "pos": "danh từ"
  },
  "word_b1d_generation": {
    "pos": "danh từ"
  },
  "word_b1d_protest": {
    "pos": "danh từ"
  },
  "word_b1d_welfare": {
    "pos": "danh từ"
  },
  "word_b1d_democracy": {
    "pos": "danh từ"
  },
  "word_b1d_discrimination": {
    "pos": "danh từ"
  },
  "word_b1d_charity_event": {
    "pos": "danh từ",
    "phonetic": "/ˈfʌndˌreɪ.zər/",
    "meaning_vi": "người gây quỹ"
  },
  "word_b1d_scenery": {
    "pos": "danh từ"
  },
  "word_b1d_landmark": {
    "pos": "danh từ"
  },
  "word_b1d_resort": {
    "pos": "danh từ"
  },
  "word_b1d_backpack": {
    "pos": "danh từ"
  },
  "word_b1d_departure": {
    "pos": "danh từ"
  },
  "word_b1d_arrival": {
    "pos": "danh từ"
  },
  "word_b1d_delay": {
    "pos": "danh từ"
  },
  "word_b1d_book": {
    "pos": "động từ"
  },
  "word_b1d_cruise": {
    "pos": "danh từ"
  },
  "word_b1d_voyage": {
    "pos": "danh từ"
  },
  "word_b1d_visa": {
    "pos": "danh từ"
  },
  "word_b1d_currency": {
    "pos": "danh từ"
  },
  "word_b1d_check_in": {
    "pos": "danh từ"
  },
  "word_b1d_excursion": {
    "pos": "danh từ"
  },
  "word_b1d_traveller": {
    "pos": "danh từ"
  },
  "word_b1d_route": {
    "pos": "danh từ"
  },
  "word_b1d_ferry": {
    "pos": "danh từ"
  },
  "word_b1d_hostel": {
    "pos": "danh từ"
  },
  "word_b1d_customs": {
    "pos": "danh từ"
  },
  "word_b1d_passenger": {
    "pos": "danh từ"
  },
  "word_b1d_postpone": {
    "pos": "động từ"
  },
  "word_b1d_wander": {
    "pos": "động từ"
  },
  "word_b1d_breathtaking": {
    "pos": "tính từ",
    "meaning_vi": "ngoạn mục, đẹp đến nghẹt thở"
  },
  "word_b1d_local": {
    "pos": "tính từ",
    "meaning_vi": "địa phương, thuộc địa phương"
  },
  "word_b1e_hire": {
    "pos": "động từ",
    "phonetic": "/haɪər/",
    "meaning_vi": "thuê, mướn"
  },
  "word_b1e_presentation": {
    "pos": "danh từ"
  },
  "word_b1e_promote": {
    "pos": "động từ",
    "meaning_vi": "thăng chức, thúc đẩy, quảng bá"
  },
  "word_b1e_supervisor": {
    "pos": "danh từ"
  },
  "word_b1e_factory": {
    "pos": "danh từ"
  },
  "word_b1e_business": {
    "pos": "danh từ"
  },
  "word_b1e_income": {
    "pos": "danh từ"
  },
  "word_b1e_unemployed": {
    "pos": "tính từ"
  },
  "word_b1e_housework": {
    "pos": "danh từ"
  },
  "word_b1e_errand": {
    "pos": "danh từ"
  },
  "word_b1e_groceries": {
    "pos": "danh từ"
  },
  "word_b1e_commute": {
    "pos": "động từ",
    "meaning_vi": "đi lại thường xuyên giữa nhà và nơi làm việc"
  },
  "word_b1e_household": {
    "pos": "danh từ"
  },
  "word_b1e_rent": {
    "pos": "danh từ"
  },
  "word_b1e_bill": {
    "pos": "danh từ"
  },
  "word_b1e_laundry": {
    "pos": "danh từ"
  },
  "word_b1e_recipe": {
    "pos": "danh từ"
  },
  "word_b1e_habit": {
    "pos": "danh từ"
  },
  "word_b1e_weekend": {
    "pos": "danh từ",
    "phonetic": "/ˌwiːkˈend/",
    "level": "a1"
  },
  "word_b1e_breakfast": {
    "pos": "danh từ",
    "level": "a1"
  },
  "word_b1e_lunch": {
    "pos": "danh từ",
    "level": "a1"
  },
  "word_b1e_dinner": {
    "pos": "danh từ",
    "level": "a1"
  },
  "word_b1e_alarm": {
    "pos": "danh từ"
  },
  "word_b1e_tidy": {
    "pos": "tính từ",
    "level": "a2"
  },
  "word_b1e_pavement": {
    "pos": "danh từ"
  },
  "word_b1e_bedtime": {
    "pos": "danh từ",
    "level": "a2"
  },
  "word_b1e_meal": {
    "pos": "danh từ",
    "level": "a1"
  },
  "word_b1e_clean": {
    "pos": "tính từ",
    "level": "a1"
  },
  "word_b1e_garden": {
    "pos": "danh từ",
    "level": "a1"
  },
  "word_b1e_kitchen": {
    "pos": "danh từ",
    "level": "a1"
  },
  "word_b1e_wardrobe": {
    "pos": "danh từ"
  },
  "word_b1e_appliance": {
    "pos": "danh từ"
  },
  "word_b1e_wallet": {
    "pos": "danh từ",
    "level": "a2"
  },
  "word_b1e_furnish": {
    "pos": "động từ"
  },
  "word_b1e_tenant": {
    "pos": "danh từ"
  },
  "word_b1f_profile": {
    "pos": "danh từ"
  },
  "word_b1f_follower": {
    "pos": "danh từ",
    "phonetic": "/ˈfɒl.əʊ.ər/"
  },
  "word_b1f_post": {
    "pos": "danh từ"
  },
  "word_b1f_share": {
    "pos": "động từ"
  },
  "word_b1f_comment": {
    "pos": "danh từ"
  },
  "word_b1f_hashtag": {
    "pos": "danh từ"
  },
  "word_b1f_trending": {
    "pos": "tính từ"
  },
  "word_b1f_notification": {
    "pos": "danh từ"
  },
  "word_b1f_stream": {
    "pos": "danh từ"
  },
  "word_b1f_chat": {
    "pos": "danh từ"
  },
  "word_b1f_emoji": {
    "pos": "danh từ"
  },
  "word_b1f_viral": {
    "pos": "tính từ"
  },
  "word_b1f_app": {
    "pos": "danh từ"
  },
  "word_b1f_setting": {
    "pos": "danh từ"
  },
  "word_b1f_login": {
    "pos": "danh từ"
  },
  "word_b1f_privacy": {
    "pos": "danh từ"
  },
  "word_b1f_security": {
    "pos": "danh từ"
  },
  "word_b1f_hacker": {
    "pos": "danh từ"
  },
  "word_b1f_scam": {
    "pos": "danh từ"
  },
  "word_b1f_spam": {
    "pos": "danh từ"
  },
  "word_b1f_backup": {
    "pos": "danh từ"
  },
  "word_b1f_warning": {
    "pos": "danh từ"
  },
  "word_b1f_block": {
    "pos": "động từ"
  },
  "word_b1f_safe": {
    "pos": "tính từ"
  },
  "word_b1f_link": {
    "pos": "danh từ"
  },
  "word_b1f_group": {
    "pos": "danh từ"
  },
  "word_b1f_event": {
    "pos": "danh từ"
  },
  "word_b1f_help": {
    "pos": "động từ"
  },
  "word_b1f_kindness": {
    "pos": "danh từ"
  },
  "word_b1f_generous": {
    "pos": "tính từ"
  },
  "word_b1f_organise": {
    "pos": "động từ"
  },
  "word_b1f_raise": {
    "pos": "động từ",
    "meaning_vi": "quyên góp, gây quỹ"
  },
  "word_b1f_communicate": {
    "pos": "động từ"
  },
  "word_b1f_conversation": {
    "pos": "danh từ"
  },
  "word_b1f_discuss": {
    "pos": "động từ"
  },
  "word_b1f_opinion": {
    "pos": "danh từ"
  },
  "word_b1f_agree": {
    "pos": "động từ"
  },
  "word_b1f_disagree": {
    "pos": "động từ"
  },
  "word_b1f_explain": {
    "pos": "động từ"
  },
  "word_b1f_polite": {
    "pos": "tính từ"
  },
  "word_b1f_apologise": {
    "pos": "động từ"
  },
  "word_b1f_introduce": {
    "pos": "động từ"
  },
  "word_b1f_greeting": {
    "pos": "danh từ"
  },
  "word_b1g_mountain": {
    "pos": "danh từ"
  },
  "word_b1g_valley": {
    "pos": "danh từ"
  },
  "word_b1g_river": {
    "pos": "danh từ"
  },
  "word_b1g_lake": {
    "pos": "danh từ"
  },
  "word_b1g_waterfall": {
    "pos": "danh từ"
  },
  "word_b1g_jungle": {
    "pos": "danh từ"
  },
  "word_b1g_desert": {
    "pos": "danh từ"
  },
  "word_b1g_island": {
    "pos": "danh từ"
  },
  "word_b1g_beach": {
    "pos": "danh từ"
  },
  "word_b1g_cliff": {
    "pos": "danh từ"
  },
  "word_b1g_cave": {
    "pos": "danh từ"
  },
  "word_b1g_field": {
    "pos": "danh từ"
  },
  "word_b1g_meadow": {
    "pos": "danh từ"
  },
  "word_b1g_hill": {
    "pos": "danh từ"
  },
  "word_b1g_coast": {
    "pos": "danh từ"
  },
  "word_b1g_landscape": {
    "pos": "danh từ"
  },
  "word_b1g_wave": {
    "pos": "danh từ"
  },
  "word_b1g_soil": {
    "pos": "danh từ"
  },
  "word_b1g_plant": {
    "pos": "danh từ",
    "level": "a2"
  },
  "word_b1g_weather": {
    "pos": "danh từ",
    "phonetic": "/ˈweð.ər/",
    "level": "a2"
  },
  "word_b1g_climate_change": {
    "pos": "danh từ"
  },
  "word_b1g_storm": {
    "pos": "danh từ",
    "level": "a2"
  },
  "word_b1g_thunder": {
    "pos": "danh từ",
    "level": "a2"
  },
  "word_b1g_lightning": {
    "pos": "danh từ",
    "level": "a2"
  },
  "word_b1g_fog": {
    "pos": "danh từ",
    "level": "a2"
  },
  "word_b1g_breeze": {
    "pos": "danh từ",
    "level": "b1"
  },
  "word_b1g_humid": {
    "pos": "tính từ",
    "level": "b1"
  },
  "word_b1g_freezing": {
    "pos": "tính từ",
    "level": "b1"
  },
  "word_b1g_forecast": {
    "pos": "danh từ",
    "phonetic": "/ˈfɔː.kɑːst/",
    "level": "b1"
  },
  "word_b1g_shower": {
    "pos": "danh từ",
    "level": "a2"
  },
  "word_b1g_hail": {
    "pos": "danh từ",
    "level": "b1"
  },
  "word_b1g_frost": {
    "pos": "danh từ",
    "level": "b1"
  },
  "word_b1g_sunshine": {
    "pos": "danh từ",
    "level": "a2"
  },
  "word_b1g_rainbow": {
    "pos": "danh từ",
    "level": "a2"
  },
  "word_b1g_heatwave": {
    "pos": "danh từ",
    "level": "b1"
  },
  "word_b1g_wet": {
    "pos": "tính từ",
    "level": "a2"
  },
  "word_b1g_dry": {
    "pos": "tính từ",
    "level": "a2"
  },
  "word_b1g_preserve": {
    "pos": "động từ",
    "level": "b2"
  },
  "word_b1g_nature_reserve": {
    "pos": "danh từ"
  },
  "word_b1g_pollution_free": {
    "pos": "tính từ"
  },
  "word_b1g_replant": {
    "pos": "động từ"
  },
  "word_b1g_campaign": {
    "pos": "danh từ"
  },
  "word_b1g_awareness": {
    "pos": "danh từ"
  },
  "word_b1g_carbon_footprint": {
    "pos": "danh từ"
  },
  "word_b1g_packaging": {
    "pos": "danh từ"
  },
  "word_b1g_throwaway": {
    "pos": "tính từ"
  },
  "word_b1g_clean_up": {
    "pos": "động từ"
  },
  "word_b1g_harmful": {
    "pos": "tính từ"
  },
  "word_b1g_threaten": {
    "pos": "động từ"
  },
  "word_b1g_check_in": {
    "pos": "động từ"
  },
  "word_b1g_guidebook": {
    "pos": "danh từ"
  },
  "word_b1g_tour_guide": {
    "pos": "danh từ"
  },
  "word_b1g_cuisine": {
    "pos": "danh từ"
  },
  "word_b1g_temple": {
    "pos": "danh từ"
  },
  "word_b1g_market": {
    "pos": "danh từ"
  },
  "word_b1g_handicraft": {
    "pos": "danh từ"
  },
  "word_b1g_costume": {
    "pos": "danh từ"
  },
  "word_b1g_heritage": {
    "pos": "danh từ"
  },
  "word_b1g_hospitality": {
    "pos": "danh từ"
  },
  "word_b1g_phrasebook": {
    "pos": "danh từ"
  },
  "word_b2_curriculum": {
    "pos": "danh từ"
  },
  "word_b2_assessment": {
    "pos": "danh từ"
  },
  "word_b2_qualification": {
    "pos": "danh từ"
  },
  "word_b2_scholarship": {
    "pos": "danh từ"
  },
  "word_b2_literacy": {
    "pos": "danh từ"
  },
  "word_b2_undergraduate": {
    "pos": "danh từ"
  },
  "word_b2_tuition": {
    "pos": "danh từ"
  },
  "word_b2_dissertation": {
    "pos": "danh từ"
  },
  "word_b2_intellectual": {
    "pos": "tính từ"
  },
  "word_b2_motivate": {
    "pos": "động từ"
  },
  "word_b2_promotion": {
    "pos": "danh từ"
  },
  "word_b2_deadline": {
    "pos": "danh từ"
  },
  "word_b2_colleague": {
    "pos": "danh từ"
  },
  "word_b2_recruitment": {
    "pos": "danh từ"
  },
  "word_b2_redundancy": {
    "pos": "danh từ"
  },
  "word_b2_workload": {
    "pos": "danh từ"
  },
  "word_b2_negotiate": {
    "pos": "động từ"
  },
  "word_b2_freelance": {
    "pos": "tính từ"
  },
  "word_b2_expertise": {
    "pos": "danh từ",
    "phonetic": "/ˌek.spɜːˈtiːz/"
  },
  "word_b2_internship": {
    "pos": "danh từ"
  },
  "word_b2_inequality": {
    "pos": "danh từ"
  },
  "word_b2_prejudice": {
    "pos": "danh từ"
  },
  "word_b2_diversity": {
    "pos": "danh từ"
  },
  "word_b2_discrimination": {
    "pos": "danh từ"
  },
  "word_b2_poverty": {
    "pos": "danh từ"
  },
  "word_b2_community": {
    "pos": "danh từ"
  },
  "word_b2_immigration": {
    "pos": "danh từ"
  },
  "word_b2_welfare": {
    "pos": "danh từ"
  },
  "word_b2_corruption": {
    "pos": "danh từ"
  },
  "word_b2_volunteer": {
    "pos": "danh từ"
  },
  "word_b2_symptom": {
    "pos": "danh từ"
  },
  "word_b2_diagnosis": {
    "pos": "danh từ"
  },
  "word_b2_immune": {
    "pos": "tính từ"
  },
  "word_b2_nutrition": {
    "pos": "danh từ"
  },
  "word_b2_chronic": {
    "pos": "tính từ"
  },
  "word_b2_prescription": {
    "pos": "danh từ"
  },
  "word_b2_wellbeing": {
    "pos": "danh từ"
  },
  "word_b2_obesity": {
    "pos": "danh từ"
  },
  "word_b2_therapy": {
    "pos": "danh từ"
  },
  "word_b2_outbreak": {
    "pos": "danh từ"
  },
  "word_b2_sustainable": {
    "pos": "tính từ"
  },
  "word_b2_emission": {
    "pos": "danh từ"
  },
  "word_b2_pollution": {
    "pos": "danh từ"
  },
  "word_b2_renewable": {
    "pos": "tính từ"
  },
  "word_b2_conservation": {
    "pos": "danh từ"
  },
  "word_b2_deforestation": {
    "pos": "danh từ"
  },
  "word_b2_biodiversity": {
    "pos": "danh từ"
  },
  "word_b2_recycle": {
    "pos": "động từ"
  },
  "word_b2_habitat": {
    "pos": "danh từ"
  },
  "word_b2_drought": {
    "pos": "danh từ"
  },
  "word_b2b_lecture": {
    "pos": "danh từ"
  },
  "word_b2b_syllabus": {
    "pos": "danh từ"
  },
  "word_b2b_enrol": {
    "pos": "động từ"
  },
  "word_b2b_graduate": {
    "pos": "động từ"
  },
  "word_b2b_revise": {
    "pos": "động từ"
  },
  "word_b2b_memorise": {
    "pos": "động từ"
  },
  "word_b2b_comprehend": {
    "pos": "động từ"
  },
  "word_b2b_academic": {
    "pos": "tính từ"
  },
  "word_b2b_thesis": {
    "pos": "danh từ"
  },
  "word_b2b_distinction": {
    "pos": "danh từ"
  },
  "word_b2b_plagiarism": {
    "pos": "danh từ"
  },
  "word_b2b_coursework": {
    "pos": "danh từ"
  },
  "word_b2b_seminar": {
    "pos": "danh từ"
  },
  "word_b2b_faculty": {
    "pos": "danh từ"
  },
  "word_b2b_attendance": {
    "pos": "danh từ"
  },
  "word_b2b_competence": {
    "pos": "danh từ"
  },
  "word_b2b_motivation": {
    "pos": "danh từ"
  },
  "word_b2b_discipline": {
    "pos": "danh từ"
  },
  "word_b2b_evaluate": {
    "pos": "động từ"
  },
  "word_b2b_analyse": {
    "pos": "động từ"
  },
  "word_b2b_concept": {
    "pos": "danh từ"
  },
  "word_b2b_theory": {
    "pos": "danh từ"
  },
  "word_b2b_vocational": {
    "pos": "tính từ"
  },
  "word_b2b_tutor": {
    "pos": "danh từ"
  },
  "word_b2b_aptitude": {
    "pos": "danh từ"
  },
  "word_b2b_diploma": {
    "pos": "danh từ"
  },
  "word_b2b_examine": {
    "pos": "động từ"
  },
  "word_b2b_grade": {
    "pos": "danh từ"
  },
  "word_b2b_lecturer": {
    "pos": "danh từ",
    "phonetic": "/ˈlek.tʃər.ər/"
  },
  "word_b2b_research": {
    "pos": "danh từ",
    "phonetic": "/rɪˈsɜːtʃ/"
  },
  "word_b2b_knowledgeable": {
    "pos": "tính từ",
    "phonetic": "/ˈnɒl.ɪ.dʒə.bəl/"
  },
  "word_b2b_career": {
    "pos": "danh từ",
    "phonetic": "/kəˈrɪər/"
  },
  "word_b2b_applicant": {
    "pos": "danh từ",
    "phonetic": "/ˈæp.lɪ.kənt/"
  },
  "word_b2b_interview": {
    "pos": "danh từ",
    "phonetic": "/ˈɪn.tə.vjuː/"
  },
  "word_b2b_salary": {
    "pos": "danh từ",
    "phonetic": "/ˈsæl.ər.i/"
  },
  "word_b2b_employee": {
    "pos": "danh từ",
    "phonetic": "/ɪmˈplɔɪ.iː/"
  },
  "word_b2b_employer": {
    "pos": "danh từ",
    "phonetic": "/ɪmˈplɔɪ.ər/"
  },
  "word_b2b_supervisor": {
    "pos": "danh từ",
    "phonetic": "/ˈsuː.pə.vaɪ.zər/"
  },
  "word_b2b_productivity": {
    "pos": "danh từ",
    "phonetic": "/ˌprɒd.ʌkˈtɪv.ə.ti/"
  },
  "word_b2b_efficiency": {
    "pos": "danh từ",
    "phonetic": "/ɪˈfɪʃ.ən.si/"
  },
  "word_b2b_responsibility": {
    "pos": "danh từ",
    "phonetic": "/rɪˌspɒn.sɪˈbɪl.ə.ti/"
  },
  "word_b2b_delegate": {
    "pos": "động từ",
    "phonetic": "/ˈdel.ɪ.ɡeɪt/"
  },
  "word_b2b_resign": {
    "pos": "động từ",
    "phonetic": "/rɪˈzaɪn/"
  },
  "word_b2b_appraisal": {
    "pos": "danh từ",
    "phonetic": "/əˈpreɪ.zəl/"
  },
  "word_b2b_incentive": {
    "pos": "danh từ",
    "phonetic": "/ɪnˈsen.tɪv/"
  },
  "word_b2b_initiative": {
    "pos": "danh từ",
    "phonetic": "/ɪˈnɪʃ.ə.tɪv/"
  },
  "word_b2b_collaborate": {
    "pos": "động từ",
    "phonetic": "/kəˈlæb.ə.reɪt/"
  },
  "word_b2b_workforce": {
    "pos": "danh từ",
    "phonetic": "/ˈwɜːk.fɔːs/"
  },
  "word_b2b_overtime": {
    "pos": "danh từ",
    "meaning_vi": "làm thêm giờ"
  },
  "word_b2b_resume": {
    "pos": "danh từ",
    "phonetic": "/ˈrez.ə.meɪ/"
  },
  "word_b2b_shortlist": {
    "pos": "danh từ"
  },
  "word_b2b_vacancy": {
    "pos": "danh từ"
  },
  "word_b2b_dismiss": {
    "pos": "động từ",
    "meaning_vi": "sa thải"
  },
  "word_b2b_commission": {
    "pos": "danh từ"
  },
  "word_b2b_redeploy": {
    "pos": "động từ"
  },
  "word_b2b_competent": {
    "pos": "tính từ"
  },
  "word_b2b_ambitious": {
    "pos": "tính từ"
  },
  "word_b2b_demanding": {
    "pos": "tính từ"
  },
  "word_b2b_flexible": {
    "pos": "tính từ"
  },
  "word_b2b_reliable": {
    "pos": "tính từ"
  },
  "word_b2b_appoint": {
    "pos": "động từ"
  },
  "word_b2b_redundant": {
    "pos": "tính từ"
  },
  "word_b2b_mentor": {
    "pos": "danh từ"
  },
  "word_b2b_outsource": {
    "pos": "động từ"
  },
  "word_b2b_prospect": {
    "pos": "danh từ"
  },
  "word_b2c_treatment": {
    "pos": "danh từ"
  },
  "word_b2c_recovery": {
    "pos": "danh từ"
  },
  "word_b2c_infection": {
    "pos": "danh từ"
  },
  "word_b2c_vaccine": {
    "pos": "danh từ",
    "level": "b1"
  },
  "word_b2c_surgery": {
    "pos": "danh từ"
  },
  "word_b2c_physician": {
    "pos": "danh từ"
  },
  "word_b2c_disorder": {
    "pos": "danh từ"
  },
  "word_b2c_allergy": {
    "pos": "danh từ"
  },
  "word_b2c_dehydration": {
    "pos": "danh từ"
  },
  "word_b2c_metabolism": {
    "pos": "danh từ"
  },
  "word_b2c_contagious": {
    "pos": "tính từ"
  },
  "word_b2c_epidemic": {
    "pos": "danh từ"
  },
  "word_b2c_hygiene": {
    "pos": "danh từ"
  },
  "word_b2c_painkiller": {
    "pos": "danh từ"
  },
  "word_b2c_dosage": {
    "pos": "danh từ"
  },
  "word_b2c_fatigue": {
    "pos": "danh từ"
  },
  "word_b2c_inflammation": {
    "pos": "danh từ"
  },
  "word_b2c_pulse": {
    "pos": "danh từ"
  },
  "word_b2c_rehabilitation": {
    "pos": "danh từ"
  },
  "word_b2c_anxiety": {
    "pos": "danh từ"
  },
  "word_b2c_circulation": {
    "pos": "danh từ"
  },
  "word_b2c_balanced": {
    "pos": "tính từ"
  },
  "word_b2c_clinical": {
    "pos": "tính từ"
  },
  "word_b2c_remedy": {
    "pos": "danh từ"
  },
  "word_b2c_specialist": {
    "pos": "danh từ"
  },
  "word_b2c_sedentary": {
    "pos": "tính từ"
  },
  "word_b2c_diagnose": {
    "pos": "động từ"
  },
  "word_b2c_genetic": {
    "pos": "tính từ"
  },
  "word_b2c_stamina": {
    "pos": "danh từ"
  },
  "word_b2c_relapse": {
    "pos": "danh từ"
  },
  "word_b2c_algorithm": {
    "pos": "danh từ"
  },
  "word_b2c_software": {
    "pos": "danh từ"
  },
  "word_b2c_hardware": {
    "pos": "danh từ"
  },
  "word_b2c_database": {
    "pos": "danh từ"
  },
  "word_b2c_encryption": {
    "pos": "danh từ"
  },
  "word_b2c_bandwidth": {
    "pos": "danh từ"
  },
  "word_b2c_interface": {
    "pos": "danh từ"
  },
  "word_b2c_automation": {
    "pos": "danh từ"
  },
  "word_b2c_innovation": {
    "pos": "danh từ"
  },
  "word_b2c_device": {
    "pos": "danh từ"
  },
  "word_b2c_network": {
    "pos": "danh từ"
  },
  "word_b2c_artificial": {
    "pos": "danh từ",
    "phonetic": "/ˌɑː.tɪˌfɪʃ.əl ɪnˈtel.ɪ.dʒəns/",
    "meaning_vi": "trí tuệ nhân tạo",
    "level": "b2"
  },
  "word_b2c_virtual": {
    "pos": "tính từ"
  },
  "word_b2c_download": {
    "pos": "động từ"
  },
  "word_b2c_upgrade": {
    "pos": "động từ"
  },
  "word_b2c_glitch": {
    "pos": "danh từ"
  },
  "word_b2c_processor": {
    "pos": "danh từ"
  },
  "word_b2c_wireless": {
    "pos": "tính từ"
  },
  "word_b2c_storage": {
    "pos": "danh từ"
  },
  "word_b2c_browser": {
    "pos": "danh từ"
  },
  "word_b2c_malware": {
    "pos": "danh từ"
  },
  "word_b2c_breach": {
    "pos": "danh từ"
  },
  "word_b2c_compatible": {
    "pos": "tính từ"
  },
  "word_b2c_digital": {
    "pos": "tính từ"
  },
  "word_b2c_server": {
    "pos": "danh từ"
  },
  "word_b2c_firewall": {
    "pos": "danh từ"
  },
  "word_b2c_robotics": {
    "pos": "danh từ"
  },
  "word_b2c_prototype": {
    "pos": "danh từ"
  },
  "word_b2c_streaming": {
    "pos": "danh từ"
  },
  "word_b2c_gadget": {
    "pos": "danh từ"
  },
  "word_b2c_obsolete": {
    "pos": "tính từ"
  },
  "word_b2c_install": {
    "pos": "động từ"
  },
  "word_b2c_glitchfree": {
    "pos": "tính từ",
    "phonetic": "/ˈsiːm.ləs/",
    "meaning_vi": "liền mạch",
    "level": "b2"
  },
  "word_b2c_cybersecurity": {
    "pos": "danh từ",
    "phonetic": "/ˌsaɪ.bə.sɪˈkjʊə.rə.ti/"
  },
  "word_b2c_innovate": {
    "pos": "động từ"
  },
  "word_b2c_sensor": {
    "pos": "danh từ"
  },
  "word_b2c_backup": {
    "pos": "danh từ"
  },
  "word_b2c_connectivity": {
    "pos": "danh từ"
  },
  "word_b2c_transmit": {
    "pos": "động từ"
  },
  "word_b2c_automate": {
    "pos": "động từ"
  },
  "word_b2c_cutting_edge": {
    "pos": "tính từ"
  },
  "word_b2d_landscape": {
    "pos": "danh từ"
  },
  "word_b2d_ecosystem": {
    "pos": "danh từ"
  },
  "word_b2d_endangered": {
    "pos": "tính từ"
  },
  "word_b2d_extinct": {
    "pos": "tính từ"
  },
  "word_b2d_waste": {
    "pos": "danh từ"
  },
  "word_b2d_greenhouse": {
    "pos": "danh từ"
  },
  "word_b2d_flood": {
    "pos": "danh từ"
  },
  "word_b2d_climate": {
    "pos": "danh từ"
  },
  "word_b2d_atmosphere": {
    "pos": "danh từ"
  },
  "word_b2d_glacier": {
    "pos": "danh từ"
  },
  "word_b2d_drainage": {
    "pos": "danh từ"
  },
  "word_b2d_contaminate": {
    "pos": "động từ"
  },
  "word_b2d_dispose": {
    "pos": "động từ"
  },
  "word_b2d_organic": {
    "pos": "tính từ"
  },
  "word_b2d_fertiliser": {
    "pos": "danh từ"
  },
  "word_b2d_pesticide": {
    "pos": "danh từ"
  },
  "word_b2d_wildlife": {
    "pos": "danh từ"
  },
  "word_b2d_erosion": {
    "pos": "danh từ"
  },
  "word_b2d_drinkable": {
    "pos": "tính từ"
  },
  "word_b2d_overfishing": {
    "pos": "danh từ"
  },
  "word_b2d_reservoir": {
    "pos": "danh từ"
  },
  "word_b2d_carbon_footprint": {
    "pos": "danh từ"
  },
  "word_b2d_sewage": {
    "pos": "danh từ"
  },
  "word_b2d_landfill": {
    "pos": "danh từ"
  },
  "word_b2d_protect": {
    "pos": "động từ"
  },
  "word_b2d_pollutant": {
    "pos": "danh từ"
  },
  "word_b2d_marine": {
    "pos": "tính từ"
  },
  "word_b2d_rural": {
    "pos": "tính từ"
  },
  "word_b2d_urban": {
    "pos": "tính từ"
  },
  "word_b2d_irrigation": {
    "pos": "danh từ"
  },
  "word_b2d_disposable": {
    "pos": "tính từ"
  },
  "word_b2d_heritage": {
    "pos": "danh từ"
  },
  "word_b2d_tradition": {
    "pos": "danh từ"
  },
  "word_b2d_custom": {
    "pos": "danh từ"
  },
  "word_b2d_ritual": {
    "pos": "danh từ"
  },
  "word_b2d_ancestor": {
    "pos": "danh từ"
  },
  "word_b2d_ethnic": {
    "pos": "tính từ",
    "meaning_vi": "thuộc dân tộc"
  },
  "word_b2d_indigenous": {
    "pos": "tính từ"
  },
  "word_b2d_folklore": {
    "pos": "danh từ"
  },
  "word_b2d_dialect": {
    "pos": "danh từ"
  },
  "word_b2d_ceremony": {
    "pos": "danh từ"
  },
  "word_b2d_festival": {
    "pos": "danh từ"
  },
  "word_b2d_costume": {
    "pos": "danh từ"
  },
  "word_b2d_cuisine": {
    "pos": "danh từ"
  },
  "word_b2d_belief": {
    "pos": "danh từ"
  },
  "word_b2d_superstition": {
    "pos": "danh từ"
  },
  "word_b2d_identity": {
    "pos": "danh từ"
  },
  "word_b2d_multicultural": {
    "pos": "tính từ"
  },
  "word_b2d_civilisation": {
    "pos": "danh từ"
  },
  "word_b2d_monument": {
    "pos": "danh từ"
  },
  "word_b2d_temple": {
    "pos": "danh từ"
  },
  "word_b2d_pilgrimage": {
    "pos": "danh từ"
  },
  "word_b2d_sculpture": {
    "pos": "danh từ",
    "phonetic": "/ˈskʌlp.tʃər/"
  },
  "word_b2d_calligraphy": {
    "pos": "danh từ"
  },
  "word_b2d_craftsmanship": {
    "pos": "danh từ"
  },
  "word_b2d_folk": {
    "pos": "danh từ",
    "phonetic": "/fəʊk/"
  },
  "word_b2d_anthem": {
    "pos": "danh từ"
  },
  "word_b2d_legend": {
    "pos": "danh từ"
  },
  "word_b2d_myth": {
    "pos": "danh từ"
  },
  "word_b2d_etiquette": {
    "pos": "danh từ"
  },
  "word_b2d_hospitality": {
    "pos": "danh từ"
  },
  "word_b2d_generation": {
    "pos": "danh từ"
  },
  "word_b2d_inherit": {
    "pos": "động từ"
  },
  "word_b2d_preserve": {
    "pos": "động từ"
  },
  "word_b2d_assimilate": {
    "pos": "động từ"
  },
  "word_b2d_norm": {
    "pos": "danh từ"
  },
  "word_b2d_taboo": {
    "pos": "danh từ"
  },
  "word_b2d_dynasty": {
    "pos": "danh từ"
  },
  "word_b2d_artefact": {
    "pos": "danh từ"
  },
  "word_b2d_worship": {
    "pos": "động từ"
  },
  "word_b2d_ancestry": {
    "pos": "danh từ"
  },
  "word_b2e_itinerary": {
    "pos": "danh từ"
  },
  "word_b2e_excursion": {
    "pos": "danh từ"
  },
  "word_b2e_sightseeing": {
    "pos": "danh từ"
  },
  "word_b2e_landmark": {
    "pos": "danh từ"
  },
  "word_b2e_accommodation": {
    "pos": "danh từ"
  },
  "word_b2e_destination_hub": {
    "pos": "danh từ"
  },
  "word_b2e_souvenir": {
    "pos": "danh từ"
  },
  "word_b2e_currency": {
    "pos": "danh từ"
  },
  "word_b2e_customs": {
    "pos": "danh từ"
  },
  "word_b2e_departure_lounge": {
    "pos": "danh từ"
  },
  "word_b2e_boarding_pass": {
    "pos": "danh từ"
  },
  "word_b2e_layover": {
    "pos": "danh từ"
  },
  "word_b2e_jetlag": {
    "pos": "danh từ"
  },
  "word_b2e_voyage": {
    "pos": "danh từ"
  },
  "word_b2e_expedition": {
    "pos": "danh từ"
  },
  "word_b2e_wanderlust": {
    "pos": "danh từ"
  },
  "word_b2e_picturesque": {
    "pos": "tính từ"
  },
  "word_b2e_scenic": {
    "pos": "tính từ"
  },
  "word_b2e_remote": {
    "pos": "tính từ"
  },
  "word_b2e_bustling": {
    "pos": "tính từ"
  },
  "word_b2e_authentic": {
    "pos": "tính từ"
  },
  "word_b2e_backpacking": {
    "pos": "danh từ",
    "phonetic": "/ˈbæk.pæk.ɪŋ/"
  },
  "word_b2e_getaway": {
    "pos": "danh từ"
  },
  "word_b2e_commute": {
    "pos": "danh từ"
  },
  "word_b2e_transit": {
    "pos": "danh từ"
  },
  "word_b2e_fare": {
    "pos": "danh từ",
    "phonetic": "/feər/"
  },
  "word_b2e_reservation": {
    "pos": "danh từ"
  },
  "word_b2e_concierge": {
    "pos": "danh từ",
    "phonetic": "/ˈkɒn.si.eəʒ/"
  },
  "word_b2e_check_out_time": {
    "pos": "danh từ",
    "phonetic": "/ˈtʃek.aʊt ˌtaɪm/"
  },
  "word_b2e_roundtrip": {
    "pos": "danh từ",
    "phonetic": "/ˌraʊnd ˈtrɪp/"
  },
  "word_b2e_stopover": {
    "pos": "danh từ"
  },
  "word_b2e_voucher": {
    "pos": "danh từ"
  },
  "word_b2e_overcrowded": {
    "pos": "tính từ"
  },
  "word_b2e_ecotourism": {
    "pos": "danh từ"
  },
  "word_b2e_trekking": {
    "pos": "danh từ"
  },
  "word_b2e_aboard": {
    "pos": "giới từ"
  },
  "word_b2e_embark": {
    "pos": "động từ"
  },
  "word_b2e_detour": {
    "pos": "danh từ"
  },
  "word_b2e_cruise": {
    "pos": "danh từ"
  },
  "word_b2e_destination_unspoiled": {
    "pos": "tính từ"
  },
  "word_b2e_citizen": {
    "pos": "danh từ"
  },
  "word_b2e_population": {
    "pos": "danh từ"
  },
  "word_b2e_prosperity": {
    "pos": "danh từ"
  },
  "word_b2e_unemployment": {
    "pos": "danh từ"
  },
  "word_b2e_homeless": {
    "pos": "tính từ"
  },
  "word_b2e_charity": {
    "pos": "danh từ"
  },
  "word_b2e_donation": {
    "pos": "danh từ"
  },
  "word_b2e_inhabitant": {
    "pos": "danh từ"
  },
  "word_b2e_neighbourhood": {
    "pos": "danh từ"
  },
  "word_b2e_lifestyle": {
    "pos": "danh từ"
  },
  "word_b2e_overpopulation": {
    "pos": "danh từ"
  },
  "word_b2e_crime_rate": {
    "pos": "danh từ"
  },
  "word_b2e_authority": {
    "pos": "danh từ"
  },
  "word_b2e_democracy": {
    "pos": "danh từ"
  },
  "word_b2e_equality": {
    "pos": "danh từ"
  },
  "word_b2e_justice": {
    "pos": "danh từ"
  },
  "word_b2e_freedom": {
    "pos": "danh từ"
  },
  "word_b2e_human_rights": {
    "pos": "danh từ"
  },
  "word_b2e_immigrant": {
    "pos": "danh từ"
  },
  "word_b2e_refugee": {
    "pos": "danh từ"
  },
  "word_b2e_urbanise": {
    "pos": "động từ"
  },
  "word_b2f_vacancy_role": {
    "pos": "danh từ"
  },
  "word_b2f_probation": {
    "pos": "danh từ"
  },
  "word_b2f_contract": {
    "pos": "danh từ"
  },
  "word_b2f_negotiation": {
    "pos": "danh từ"
  },
  "word_b2f_proactive": {
    "pos": "tính từ"
  },
  "word_b2f_adaptable": {
    "pos": "tính từ"
  },
  "word_b2f_teamwork": {
    "pos": "danh từ"
  },
  "word_b2f_leadership": {
    "pos": "danh từ"
  },
  "word_b2f_communication": {
    "pos": "danh từ"
  },
  "word_b2f_punctual": {
    "pos": "tính từ"
  },
  "word_b2f_reliable_dep": {
    "pos": "tính từ"
  },
  "word_b2f_confident": {
    "pos": "tính từ"
  },
  "word_b2f_persuasive": {
    "pos": "tính từ"
  },
  "word_b2f_strengths": {
    "pos": "danh từ"
  },
  "word_b2f_weakness": {
    "pos": "danh từ"
  },
  "word_b2f_workplace": {
    "pos": "danh từ"
  },
  "word_b2f_promote": {
    "pos": "động từ"
  },
  "word_b2f_apply": {
    "pos": "động từ"
  },
  "word_b2f_skillset": {
    "pos": "danh từ"
  },
  "word_b2f_networking": {
    "pos": "danh từ"
  },
  "word_b2f_workspace": {
    "pos": "danh từ",
    "level": "a2"
  },
  "word_b2f_resignation": {
    "pos": "danh từ"
  },
  "word_b2f_overqualified": {
    "pos": "tính từ",
    "meaning_vi": "có trình độ quá cao so với yêu cầu"
  },
  "word_b2f_motivated": {
    "pos": "tính từ"
  },
  "word_b2f_ambition": {
    "pos": "danh từ",
    "meaning_vi": "hoài bão, khát vọng"
  },
  "word_b2f_workethic": {
    "pos": "danh từ",
    "meaning_vi": "đạo đức làm việc"
  },
  "word_b2f_multitask": {
    "pos": "động từ"
  },
  "word_b2f_initiative_skill": {
    "pos": "danh từ",
    "meaning_vi": "kỹ năng giải quyết vấn đề"
  },
  "word_b2f_organised": {
    "pos": "tính từ"
  },
  "word_b2f_workload_man": {
    "pos": "động từ"
  },
  "word_b2f_cv": {
    "pos": "danh từ",
    "meaning_vi": "thư xin việc (cover letter)"
  },
  "word_b2f_reference": {
    "pos": "danh từ",
    "meaning_vi": "người giới thiệu; thư giới thiệu"
  },
  "word_b2f_telecommute": {
    "pos": "động từ"
  },
  "word_b2f_burnout": {
    "pos": "danh từ"
  },
  "word_b2f_workfromhome": {
    "pos": "tính từ",
    "meaning_vi": "thuộc thời gian tập sự"
  },
  "word_b2f_shortcoming": {
    "pos": "tính từ",
    "meaning_vi": "được lọt vào danh sách rút gọn"
  },
  "word_b2f_media": {
    "pos": "danh từ"
  },
  "word_b2f_journalist": {
    "pos": "danh từ"
  },
  "word_b2f_broadcast": {
    "pos": "động từ"
  },
  "word_b2f_headline": {
    "pos": "danh từ"
  },
  "word_b2f_coverage": {
    "pos": "danh từ"
  },
  "word_b2f_biased": {
    "pos": "tính từ"
  },
  "word_b2f_censorship": {
    "pos": "danh từ",
    "phonetic": "/ˈsen.sə.ʃɪp/"
  },
  "word_b2f_propaganda": {
    "pos": "danh từ"
  },
  "word_b2f_misinformation": {
    "pos": "danh từ"
  },
  "word_b2f_influencer": {
    "pos": "danh từ"
  },
  "word_b2f_advertising": {
    "pos": "danh từ"
  },
  "word_b2f_legislation": {
    "pos": "danh từ"
  },
  "word_b2f_court": {
    "pos": "danh từ"
  },
  "word_b2f_lawyer": {
    "pos": "danh từ"
  },
  "word_b2f_verdict": {
    "pos": "danh từ"
  },
  "word_b2f_evidence": {
    "pos": "danh từ"
  },
  "word_b2f_witness": {
    "pos": "danh từ"
  },
  "word_b2f_suspect": {
    "pos": "danh từ"
  },
  "word_b2f_offence": {
    "pos": "danh từ",
    "phonetic": "/əˈfens/"
  },
  "word_b2f_fine": {
    "pos": "danh từ"
  },
  "word_b2f_sentence": {
    "pos": "danh từ"
  },
  "word_b2f_trial": {
    "pos": "danh từ"
  },
  "word_b2f_regulation": {
    "pos": "danh từ"
  },
  "word_b2f_rights": {
    "pos": "danh từ"
  },
  "word_b2f_homelessness": {
    "pos": "danh từ"
  },
  "word_b2f_addiction": {
    "pos": "danh từ"
  },
  "word_b2f_protester": {
    "pos": "danh từ",
    "meaning_vi": "nhà hoạt động xã hội"
  },
  "word_b2f_demonstration": {
    "pos": "danh từ"
  },
  "word_b2f_petition": {
    "pos": "danh từ"
  },
  "word_b2f_reform": {
    "pos": "danh từ"
  },
  "word_b2f_taxation": {
    "pos": "danh từ"
  },
  "word_b2f_policy": {
    "pos": "danh từ"
  },
  "word_b2f_privacy": {
    "pos": "danh từ"
  },
  "word_b2f_surveillance": {
    "pos": "danh từ"
  },
  "word_b2f_integration": {
    "pos": "danh từ"
  },
  "word_b2f_tolerance": {
    "pos": "danh từ"
  },
  "word_b2g_postgraduate": {
    "pos": "tính từ",
    "meaning_vi": "sau đại học"
  },
  "word_b2g_tutorial": {
    "pos": "danh từ"
  },
  "word_b2g_campus": {
    "pos": "danh từ"
  },
  "word_b2g_degree": {
    "pos": "danh từ"
  },
  "word_b2g_concentrate": {
    "pos": "động từ"
  },
  "word_b2g_apprenticeship": {
    "pos": "danh từ"
  },
  "word_b2g_hypothesis": {
    "pos": "danh từ"
  },
  "word_b2g_methodology": {
    "pos": "danh từ"
  },
  "word_b2g_findings": {
    "pos": "danh từ"
  },
  "word_b2g_data": {
    "pos": "danh từ"
  },
  "word_b2g_survey": {
    "pos": "danh từ"
  },
  "word_b2g_citation": {
    "pos": "danh từ"
  },
  "word_b2g_depression": {
    "pos": "danh từ"
  },
  "word_b2g_stress": {
    "pos": "danh từ"
  },
  "word_b2g_counsellor": {
    "pos": "danh từ"
  },
  "word_b2g_emotional": {
    "pos": "tính từ"
  },
  "word_b2g_resilience": {
    "pos": "danh từ"
  },
  "word_b2g_insomnia": {
    "pos": "danh từ"
  },
  "word_b2g_nutrient": {
    "pos": "danh từ"
  },
  "word_b2g_protein": {
    "pos": "danh từ"
  },
  "word_b2g_vitamin": {
    "pos": "danh từ"
  },
  "word_b2g_calorie": {
    "pos": "danh từ"
  },
  "word_b2g_diet": {
    "pos": "danh từ"
  },
  "word_b2g_infectious": {
    "pos": "tính từ"
  },
  "word_b2g_vaccination": {
    "pos": "danh từ"
  },
  "word_b2g_surgeon": {
    "pos": "danh từ"
  },
  "word_b2g_clinic": {
    "pos": "danh từ"
  },
  "word_b2g_pharmacy": {
    "pos": "danh từ"
  },
  "word_b2g_patient": {
    "pos": "danh từ",
    "level": "a2"
  },
  "word_b2g_healthcare": {
    "pos": "danh từ"
  },
  "word_b2g_posture": {
    "pos": "danh từ"
  },
  "word_b2g_preventive": {
    "pos": "tính từ"
  },
  "word_c1_sustainable": {
    "pos": "tính từ"
  },
  "word_c1_significant": {
    "pos": "tính từ"
  },
  "word_c1_phenomenon": {
    "pos": "danh từ"
  },
  "word_c1_infrastructure": {
    "pos": "danh từ"
  },
  "word_c1_controversial": {
    "pos": "tính từ"
  },
  "word_c1_deteriorate": {
    "pos": "động từ"
  },
  "word_c1_comprehensive": {
    "pos": "tính từ"
  },
  "word_c1_inevitable": {
    "pos": "tính từ"
  },
  "word_c1_prevalent": {
    "pos": "tính từ"
  },
  "word_c1_advocate": {
    "pos": "động từ"
  },
  "word_c1_undermine": {
    "pos": "động từ"
  },
  "word_c1_unprecedented": {
    "pos": "tính từ"
  },
  "word_c1_diverse": {
    "pos": "tính từ"
  },
  "word_c1_implement": {
    "pos": "động từ"
  },
  "word_c1_substantial": {
    "pos": "tính từ"
  },
  "word_c1_emerge": {
    "pos": "động từ"
  },
  "word_c1_facilitate": {
    "pos": "động từ"
  },
  "word_c1_mitigate": {
    "pos": "động từ"
  },
  "word_c1_compelling": {
    "pos": "tính từ"
  },
  "word_c1_disparity": {
    "pos": "danh từ"
  },
  "word_c1_innovation": {
    "pos": "danh từ"
  },
  "word_c1_paradigm": {
    "pos": "danh từ"
  },
  "word_c1_empirical": {
    "pos": "tính từ"
  },
  "word_c1_advent": {
    "pos": "danh từ"
  },
  "word_c1_detrimental": {
    "pos": "tính từ"
  },
  "word_c1_advocate_change": {
    "pos": "tính từ",
    "phonetic": "/juːˈbɪk.wɪ.təs/",
    "meaning_vi": "có mặt khắp nơi",
    "level": "c1"
  },
  "word_c1_cultivate": {
    "pos": "động từ"
  },
  "word_c1_heritage": {
    "pos": "danh từ"
  },
  "word_c1_assimilate": {
    "pos": "động từ"
  },
  "word_c1_indigenous": {
    "pos": "tính từ"
  },
  "word_c1_proliferate": {
    "pos": "động từ"
  },
  "word_c1_scrutiny": {
    "pos": "danh từ"
  },
  "word_c1_pervasive": {
    "pos": "tính từ"
  },
  "word_c1_alleviate": {
    "pos": "động từ"
  },
  "word_c1_intervention": {
    "pos": "danh từ"
  },
  "word_c1_attribute": {
    "pos": "động từ"
  },
  "word_c1_resilient": {
    "pos": "tính từ"
  },
  "word_c1_consensus": {
    "pos": "danh từ"
  },
  "word_c1_exacerbate": {
    "pos": "động từ"
  },
  "word_c1_aesthetic": {
    "pos": "tính từ",
    "phonetic": "/iːsˈθet.ɪk/"
  },
  "word_c1_autonomy": {
    "pos": "danh từ"
  },
  "word_c1_correlation": {
    "pos": "danh từ"
  },
  "word_c1_conform": {
    "pos": "động từ"
  },
  "word_c1_degradation": {
    "pos": "danh từ"
  },
  "word_c1_disseminate": {
    "pos": "động từ"
  },
  "word_c1_notion": {
    "pos": "danh từ"
  },
  "word_c1_assert": {
    "pos": "động từ"
  },
  "word_c1_viable": {
    "pos": "tính từ"
  },
  "word_c1_profound": {
    "pos": "tính từ"
  },
  "word_c1_speculate": {
    "pos": "động từ"
  },
  "word_c1_versatile": {
    "pos": "tính từ"
  },
  "word_c1_obsolete": {
    "pos": "tính từ"
  },
  "word_c1b_hypothesis": {
    "pos": "danh từ"
  },
  "word_c1b_methodology": {
    "pos": "danh từ"
  },
  "word_c1b_quantitative": {
    "pos": "tính từ"
  },
  "word_c1b_qualitative": {
    "pos": "tính từ"
  },
  "word_c1b_variable": {
    "pos": "danh từ",
    "phonetic": "/ˈveə.ri.ə.bəl/",
    "meaning_vi": "biến số",
    "level": "b2"
  },
  "word_c1b_validate": {
    "pos": "động từ",
    "phonetic": "/ˈvæl.ɪ.deɪt/",
    "meaning_vi": "xác nhận tính hợp lệ",
    "level": "b2"
  },
  "word_c1b_replicate": {
    "pos": "động từ",
    "phonetic": "/ˈrep.lɪ.keɪt/",
    "meaning_vi": "sao chép",
    "level": "b2"
  },
  "word_c1b_phenomena": {
    "pos": "danh từ",
    "phonetic": "/fəˈnɒm.ɪ.nə/",
    "meaning_vi": "hiện tượng (số nhiều)",
    "level": "b2"
  },
  "word_c1b_inference": {
    "pos": "danh từ",
    "phonetic": "/ˈɪn.fər.əns/",
    "meaning_vi": "sự suy luận",
    "level": "b2"
  },
  "word_c1b_synthesis": {
    "pos": "danh từ",
    "phonetic": "/ˈsɪn.θə.sɪs/",
    "meaning_vi": "sự tổng hợp",
    "level": "b2"
  },
  "word_c1b_analysis": {
    "pos": "danh từ",
    "phonetic": "/əˈnæl.ə.sɪs/",
    "meaning_vi": "sự phân tích",
    "level": "b2"
  },
  "word_c1b_data": {
    "pos": "danh từ",
    "phonetic": "/ˈdeɪ.tə/",
    "meaning_vi": "dữ liệu",
    "level": "a2"
  },
  "word_c1b_sample": {
    "pos": "danh từ",
    "phonetic": "/ˈsɑːm.pəl/",
    "meaning_vi": "mẫu",
    "level": "b1"
  },
  "word_c1b_calibrate": {
    "pos": "động từ",
    "phonetic": "/ˈkæl.ɪ.breɪt/",
    "meaning_vi": "hiệu chỉnh",
    "level": "c1"
  },
  "word_c1b_catalyst": {
    "pos": "danh từ",
    "phonetic": "/ˈkæt.ə.lɪst/",
    "meaning_vi": "chất xúc tác",
    "level": "c1"
  },
  "word_c1b_molecule": {
    "pos": "danh từ",
    "phonetic": "/ˈmɒl.ɪ.kjuːl/",
    "meaning_vi": "phân tử",
    "level": "b2"
  },
  "word_c1b_genome": {
    "pos": "danh từ",
    "phonetic": "/ˈdʒiː.nəʊm/",
    "meaning_vi": "bộ gen",
    "level": "c1"
  },
  "word_c1b_organism": {
    "pos": "danh từ",
    "phonetic": "/ˈɔː.ɡən.ɪ.zəm/",
    "meaning_vi": "sinh vật",
    "level": "b2"
  },
  "word_c1b_ecosystem": {
    "pos": "danh từ",
    "phonetic": "/ˈiː.kəʊˌsɪs.təm/",
    "meaning_vi": "hệ sinh thái",
    "level": "b2"
  },
  "word_c1b_evolution": {
    "pos": "danh từ",
    "phonetic": "/ˌiː.vəˈluː.ʃən/",
    "meaning_vi": "sự tiến hóa",
    "level": "b2"
  },
  "word_c1b_radiation": {
    "pos": "danh từ",
    "phonetic": "/ˌreɪ.diˈeɪ.ʃən/",
    "meaning_vi": "bức xạ",
    "level": "b2"
  },
  "word_c1b_velocity": {
    "pos": "danh từ",
    "phonetic": "/vəˈlɒs.ə.ti/",
    "meaning_vi": "vận tốc",
    "level": "c1"
  },
  "word_c1b_friction": {
    "pos": "danh từ",
    "phonetic": "/ˈfrɪk.ʃən/",
    "meaning_vi": "ma sát",
    "level": "b2"
  },
  "word_c1b_density": {
    "pos": "danh từ",
    "phonetic": "/ˈden.sɪ.ti/",
    "meaning_vi": "mật độ",
    "level": "b2"
  },
  "word_c1b_spectrum": {
    "pos": "danh từ"
  },
  "word_c1b_particle": {
    "pos": "danh từ"
  },
  "word_c1b_equilibrium": {
    "pos": "danh từ"
  },
  "word_c1b_dimension": {
    "pos": "danh từ"
  },
  "word_c1b_threshold": {
    "pos": "danh từ"
  },
  "word_c1b_anomaly": {
    "pos": "danh từ"
  },
  "word_c1b_simulate": {
    "pos": "động từ"
  },
  "word_c1b_algorithm": {
    "pos": "danh từ"
  },
  "word_c1b_automation": {
    "pos": "danh từ"
  },
  "word_c1b_artificial_intelligence": {
    "pos": "danh từ"
  },
  "word_c1b_machine_learning": {
    "pos": "danh từ"
  },
  "word_c1b_neural_network": {
    "pos": "danh từ"
  },
  "word_c1b_dataset": {
    "pos": "danh từ"
  },
  "word_c1b_database": {
    "pos": "danh từ"
  },
  "word_c1b_encryption": {
    "pos": "danh từ"
  },
  "word_c1b_cybersecurity": {
    "pos": "danh từ"
  },
  "word_c1b_interface": {
    "pos": "danh từ"
  },
  "word_c1b_bandwidth": {
    "pos": "danh từ"
  },
  "word_c1b_protocol": {
    "pos": "danh từ"
  },
  "word_c1b_server": {
    "pos": "danh từ"
  },
  "word_c1b_scalable": {
    "pos": "tính từ"
  },
  "word_c1b_optimize": {
    "pos": "động từ"
  },
  "word_c1b_prototype": {
    "pos": "danh từ"
  },
  "word_c1b_integrate": {
    "pos": "động từ"
  },
  "word_c1b_deploy": {
    "pos": "động từ"
  },
  "word_c1b_processor": {
    "pos": "danh từ"
  },
  "word_c1b_compute": {
    "pos": "động từ"
  },
  "word_c1b_innovative": {
    "pos": "tính từ"
  },
  "word_c1b_breakthrough": {
    "pos": "danh từ"
  },
  "word_c1b_invention": {
    "pos": "danh từ"
  },
  "word_c1b_patent": {
    "pos": "danh từ"
  },
  "word_c1b_pioneer": {
    "pos": "danh từ"
  },
  "word_c1b_emerging": {
    "pos": "tính từ"
  },
  "word_c1b_robotics": {
    "pos": "danh từ"
  },
  "word_c1b_biotechnology": {
    "pos": "danh từ"
  },
  "word_c1b_nanotechnology": {
    "pos": "danh từ"
  },
  "word_c1b_renewable": {
    "pos": "tính từ"
  },
  "word_c1b_emission": {
    "pos": "danh từ"
  },
  "word_c1b_conductivity": {
    "pos": "danh từ"
  },
  "word_c1b_quantum": {
    "pos": "danh từ"
  },
  "word_c1b_microscopic": {
    "pos": "tính từ"
  },
  "word_c1b_synthesize": {
    "pos": "động từ"
  },
  "word_c1b_diagnose": {
    "pos": "động từ"
  },
  "word_c1b_aggregate": {
    "pos": "danh từ",
    "meaning_vi": "tổng số, tổng hợp"
  },
  "word_c1b_metric": {
    "pos": "danh từ"
  },
  "word_c1b_parameter": {
    "pos": "danh từ"
  },
  "word_c1b_iteration": {
    "pos": "danh từ"
  },
  "word_c1b_threshold_value": {
    "pos": "danh từ"
  },
  "word_c1b_feasible": {
    "pos": "tính từ"
  },
  "word_c1b_robust": {
    "pos": "tính từ"
  },
  "word_c1b_phenotype": {
    "pos": "danh từ"
  },
  "word_c1b_telemetry": {
    "pos": "danh từ"
  },
  "word_c1b_apparatus": {
    "pos": "danh từ"
  },
  "word_c1b_observation": {
    "pos": "danh từ"
  },
  "word_c1b_artificial": {
    "pos": "tính từ"
  },
  "word_c1b_computational": {
    "pos": "tính từ"
  },
  "word_c1c_inequality": {
    "pos": "danh từ"
  },
  "word_c1c_welfare": {
    "pos": "danh từ"
  },
  "word_c1c_urbanization": {
    "pos": "danh từ"
  },
  "word_c1c_demographic": {
    "pos": "tính từ"
  },
  "word_c1c_policy": {
    "pos": "danh từ"
  },
  "word_c1c_legislation": {
    "pos": "danh từ"
  },
  "word_c1c_marginalize": {
    "pos": "động từ"
  },
  "word_c1c_cohesion": {
    "pos": "danh từ"
  },
  "word_c1c_deprivation": {
    "pos": "danh từ"
  },
  "word_c1c_integration": {
    "pos": "danh từ"
  },
  "word_c1c_diversity": {
    "pos": "danh từ"
  },
  "word_c1c_discrimination": {
    "pos": "danh từ"
  },
  "word_c1c_prejudice": {
    "pos": "danh từ"
  },
  "word_c1c_empowerment": {
    "pos": "danh từ"
  },
  "word_c1c_subsidy": {
    "pos": "danh từ"
  },
  "word_c1c_taxation": {
    "pos": "danh từ"
  },
  "word_c1c_governance": {
    "pos": "danh từ"
  },
  "word_c1c_accountability": {
    "pos": "danh từ"
  },
  "word_c1c_migration": {
    "pos": "danh từ"
  },
  "word_c1c_segregation": {
    "pos": "danh từ"
  },
  "word_c1c_philanthropy": {
    "pos": "danh từ"
  },
  "word_c1c_solidarity": {
    "pos": "danh từ"
  },
  "word_c1c_civic": {
    "pos": "tính từ"
  },
  "word_c1c_franchise": {
    "pos": "danh từ"
  },
  "word_c1c_demographic_shift": {
    "pos": "danh từ"
  },
  "word_c1c_stratification": {
    "pos": "danh từ"
  },
  "word_c1c_mobility": {
    "pos": "danh từ"
  },
  "word_c1c_referendum": {
    "pos": "danh từ"
  },
  "word_c1c_advocacy": {
    "pos": "danh từ"
  },
  "word_c1c_disenfranchise": {
    "pos": "động từ"
  },
  "word_c1c_gentrification": {
    "pos": "danh từ"
  },
  "word_c1c_sustainability": {
    "pos": "danh từ"
  },
  "word_c1c_demographics": {
    "pos": "danh từ"
  },
  "word_c1c_assimilation": {
    "pos": "danh từ"
  },
  "word_c1c_stigma": {
    "pos": "danh từ"
  },
  "word_c1c_displacement": {
    "pos": "danh từ"
  },
  "word_c1c_redistribution": {
    "pos": "danh từ"
  },
  "word_c1c_grassroots": {
    "pos": "danh từ"
  },
  "word_c1c_pluralism": {
    "pos": "danh từ"
  },
  "word_c1c_demobilize": {
    "pos": "động từ"
  },
  "word_c1c_meritocracy": {
    "pos": "danh từ"
  },
  "word_c1c_pedagogy": {
    "pos": "danh từ"
  },
  "word_c1c_curriculum": {
    "pos": "danh từ"
  },
  "word_c1c_literacy": {
    "pos": "danh từ"
  },
  "word_c1c_numeracy": {
    "pos": "danh từ"
  },
  "word_c1c_enrolment": {
    "pos": "danh từ"
  },
  "word_c1c_tuition": {
    "pos": "danh từ"
  },
  "word_c1c_scholarship": {
    "pos": "danh từ"
  },
  "word_c1c_undergraduate": {
    "pos": "danh từ"
  },
  "word_c1c_postgraduate": {
    "pos": "danh từ"
  },
  "word_c1c_dissertation": {
    "pos": "danh từ"
  },
  "word_c1c_assessment": {
    "pos": "danh từ"
  },
  "word_c1c_accreditation": {
    "pos": "danh từ"
  },
  "word_c1c_competence": {
    "pos": "danh từ"
  },
  "word_c1c_cognitive": {
    "pos": "tính từ"
  },
  "word_c1c_aptitude": {
    "pos": "danh từ"
  },
  "word_c1c_vocational": {
    "pos": "tính từ"
  },
  "word_c1c_truancy": {
    "pos": "danh từ"
  },
  "word_c1c_remedial": {
    "pos": "tính từ"
  },
  "word_c1c_holistic": {
    "pos": "tính từ"
  },
  "word_c1c_interdisciplinary": {
    "pos": "tính từ"
  },
  "word_c1c_mentorship": {
    "pos": "danh từ"
  },
  "word_c1c_plagiarism": {
    "pos": "danh từ"
  },
  "word_c1c_disparity_education": {
    "pos": "danh từ"
  },
  "word_c1c_attainment": {
    "pos": "danh từ"
  },
  "word_c1c_pedagogical": {
    "pos": "tính từ"
  },
  "word_c1c_lifelong": {
    "pos": "danh từ",
    "phonetic": "/ˌlaɪf.lɒŋ ˈlɜː.nɪŋ/",
    "meaning_vi": "học tập suốt đời",
    "level": "c1"
  },
  "word_c1c_engagement": {
    "pos": "danh từ"
  },
  "word_c1c_streaming": {
    "pos": "danh từ"
  },
  "word_c1c_dropout": {
    "pos": "danh từ",
    "phonetic": "/ˈdrɒp.aʊt reɪt/",
    "meaning_vi": "tỷ lệ bỏ học",
    "level": "c1"
  },
  "word_c1c_inclusive": {
    "pos": "tính từ"
  },
  "word_c1c_curriculum_reform": {
    "pos": "danh từ"
  },
  "word_c1c_proficiency": {
    "pos": "danh từ"
  },
  "word_c1c_aptitude_test": {
    "pos": "danh từ"
  },
  "word_c1c_socioeconomic": {
    "pos": "tính từ"
  },
  "word_c1d_authenticity": {
    "pos": "danh từ"
  },
  "word_c1d_artefact": {
    "pos": "danh từ"
  },
  "word_c1d_curator": {
    "pos": "danh từ"
  },
  "word_c1d_renowned": {
    "pos": "tính từ"
  },
  "word_c1d_avant_garde": {
    "pos": "tính từ"
  },
  "word_c1d_connotation": {
    "pos": "danh từ"
  },
  "word_c1d_narrative": {
    "pos": "danh từ"
  },
  "word_c1d_evocative": {
    "pos": "tính từ"
  },
  "word_c1d_genre": {
    "pos": "danh từ"
  },
  "word_c1d_acclaim": {
    "pos": "danh từ"
  },
  "word_c1d_patron": {
    "pos": "danh từ"
  },
  "word_c1d_pivotal": {
    "pos": "tính từ",
    "phonetic": "/ˈpɪv.ə.təl/"
  },
  "word_c1d_secular": {
    "pos": "tính từ"
  },
  "word_c1d_ritual": {
    "pos": "danh từ"
  },
  "word_c1d_norm": {
    "pos": "danh từ"
  },
  "word_c1d_taboo": {
    "pos": "danh từ"
  },
  "word_c1d_stereotype": {
    "pos": "danh từ"
  },
  "word_c1d_globalisation": {
    "pos": "danh từ"
  },
  "word_c1d_homogeneous": {
    "pos": "tính từ"
  },
  "word_c1d_journalism": {
    "pos": "danh từ"
  },
  "word_c1d_coverage": {
    "pos": "danh từ"
  },
  "word_c1d_bias": {
    "pos": "danh từ"
  },
  "word_c1d_credibility": {
    "pos": "danh từ"
  },
  "word_c1d_misinformation": {
    "pos": "danh từ"
  },
  "word_c1d_propaganda": {
    "pos": "danh từ"
  },
  "word_c1d_censorship": {
    "pos": "danh từ"
  },
  "word_c1d_anonymity": {
    "pos": "danh từ"
  },
  "word_c1d_surveillance": {
    "pos": "danh từ"
  },
  "word_c1d_influential": {
    "pos": "tính từ"
  },
  "word_c1d_addictive": {
    "pos": "tính từ"
  },
  "word_c1d_polarise": {
    "pos": "động từ"
  },
  "word_c1d_discourse": {
    "pos": "danh từ"
  },
  "word_c1d_manipulate": {
    "pos": "động từ"
  },
  "word_c1d_perception": {
    "pos": "danh từ"
  },
  "word_c1d_conservation": {
    "pos": "danh từ"
  },
  "word_c1d_biodiversity": {
    "pos": "danh từ"
  },
  "word_c1d_emissions": {
    "pos": "danh từ"
  },
  "word_c1d_deforestation": {
    "pos": "danh từ"
  },
  "word_c1d_depletion": {
    "pos": "danh từ"
  },
  "word_c1d_pollutant": {
    "pos": "danh từ"
  },
  "word_c1d_contaminate": {
    "pos": "động từ"
  },
  "word_c1d_habitat": {
    "pos": "danh từ"
  },
  "word_c1d_endangered": {
    "pos": "tính từ"
  },
  "word_c1d_extinction": {
    "pos": "danh từ"
  },
  "word_c1d_adverse": {
    "pos": "tính từ"
  },
  "word_c1d_finite": {
    "pos": "tính từ"
  },
  "word_c1d_carbon_footprint": {
    "pos": "danh từ"
  },
  "word_c1d_greenhouse_gas": {
    "pos": "danh từ"
  },
  "word_c1d_landfill": {
    "pos": "danh từ"
  },
  "word_c1d_recycling": {
    "pos": "danh từ",
    "level": "a2"
  },
  "word_c1d_resilience": {
    "pos": "danh từ"
  },
  "word_c1d_vulnerable": {
    "pos": "tính từ"
  },
  "word_c1d_arid": {
    "pos": "tính từ"
  },
  "word_c1d_drought": {
    "pos": "danh từ"
  },
  "word_c1d_curb": {
    "pos": "động từ"
  },
  "word_c1d_offset": {
    "pos": "động từ"
  },
  "word_c1d_initiative": {
    "pos": "danh từ"
  },
  "word_c1d_incentive": {
    "pos": "danh từ"
  },
  "word_c1d_irreversible": {
    "pos": "tính từ"
  },
  "word_c1d_advocate_policy": {
    "pos": "danh từ",
    "phonetic": "/ˈæd.və.kət ˈdrɪv.ən ˈpɒl.ə.si/",
    "meaning_vi": "chính sách do vận động dẫn dắt",
    "level": "c1"
  },
  "word_c1d_emit": {
    "pos": "động từ"
  },
  "word_c1d_replenish": {
    "pos": "động từ"
  },
  "word_c1e_workforce": {
    "pos": "danh từ"
  },
  "word_c1e_remuneration": {
    "pos": "danh từ"
  },
  "word_c1e_productivity": {
    "pos": "danh từ"
  },
  "word_c1e_entrepreneurship": {
    "pos": "danh từ"
  },
  "word_c1e_redundancy": {
    "pos": "danh từ"
  },
  "word_c1e_recruitment": {
    "pos": "danh từ"
  },
  "word_c1e_delegation": {
    "pos": "danh từ"
  },
  "word_c1e_remote": {
    "pos": "tính từ",
    "meaning_vi": "xa xôi, hẻo lánh; từ xa"
  },
  "word_c1e_burnout": {
    "pos": "danh từ"
  },
  "word_c1e_subordinate": {
    "pos": "danh từ"
  },
  "word_c1e_appraisal": {
    "pos": "danh từ"
  },
  "word_c1e_outsource": {
    "pos": "động từ"
  },
  "word_c1e_collaboration": {
    "pos": "danh từ"
  },
  "word_c1e_diligence": {
    "pos": "danh từ"
  },
  "word_c1e_tenure": {
    "pos": "danh từ"
  },
  "word_c1e_aspiration": {
    "pos": "danh từ"
  },
  "word_c1e_deadline": {
    "pos": "danh từ"
  },
  "word_c1e_vacancy": {
    "pos": "danh từ"
  },
  "word_c1e_freelance": {
    "pos": "tính từ",
    "meaning_vi": "làm việc tự do"
  },
  "word_c1e_promotion": {
    "pos": "danh từ"
  },
  "word_c1e_workload": {
    "pos": "danh từ"
  },
  "word_c1e_expertise": {
    "pos": "danh từ"
  },
  "word_c1e_negotiation": {
    "pos": "danh từ"
  },
  "word_c1e_compensation": {
    "pos": "danh từ"
  },
  "word_c1e_hierarchy": {
    "pos": "danh từ"
  },
  "word_c1e_internship": {
    "pos": "danh từ"
  },
  "word_c1e_morale": {
    "pos": "danh từ"
  },
  "word_c1e_diversify": {
    "pos": "động từ"
  },
  "word_c1e_streamline": {
    "pos": "động từ"
  },
  "word_c1e_overtime": {
    "pos": "danh từ",
    "meaning_vi": "thời gian làm thêm"
  },
  "word_c1e_credential": {
    "pos": "danh từ",
    "meaning_vi": "chứng chỉ, giấy tờ chứng nhận"
  },
  "word_c1e_wellbeing": {
    "pos": "danh từ",
    "phonetic": "/ˌwelˈbiː.ɪŋ/"
  },
  "word_c1e_chronic": {
    "pos": "tính từ"
  },
  "word_c1e_sedentary": {
    "pos": "tính từ"
  },
  "word_c1e_immunity": {
    "pos": "danh từ",
    "meaning_vi": "miễn dịch"
  },
  "word_c1e_nutrition": {
    "pos": "danh từ"
  },
  "word_c1e_obesity": {
    "pos": "danh từ"
  },
  "word_c1e_epidemic": {
    "pos": "danh từ"
  },
  "word_c1e_diagnosis": {
    "pos": "danh từ"
  },
  "word_c1e_prognosis": {
    "pos": "danh từ"
  },
  "word_c1e_rehabilitation": {
    "pos": "danh từ"
  },
  "word_c1e_prevalence": {
    "pos": "danh từ"
  },
  "word_c1e_symptom": {
    "pos": "danh từ"
  },
  "word_c1e_contagious": {
    "pos": "tính từ"
  },
  "word_c1e_vaccination": {
    "pos": "danh từ"
  },
  "word_c1e_therapeutic": {
    "pos": "tính từ"
  },
  "word_c1e_metabolism": {
    "pos": "danh từ"
  },
  "word_c1e_dehydration": {
    "pos": "danh từ"
  },
  "word_c1e_insomnia": {
    "pos": "danh từ"
  },
  "word_c1e_susceptible": {
    "pos": "tính từ"
  },
  "word_c1e_dietary": {
    "pos": "tính từ"
  },
  "word_c1e_pathogen": {
    "pos": "danh từ"
  },
  "word_c1e_inflammation": {
    "pos": "danh từ"
  },
  "word_c1e_longevity": {
    "pos": "danh từ"
  },
  "word_c1e_malnutrition": {
    "pos": "danh từ"
  },
  "word_c1e_cardiovascular": {
    "pos": "tính từ"
  },
  "word_c1e_outbreak": {
    "pos": "danh từ"
  },
  "word_c1e_recuperate": {
    "pos": "động từ"
  },
  "word_c1e_abstain": {
    "pos": "động từ"
  },
  "word_c1e_strenuous": {
    "pos": "tính từ"
  },
  "word_c1e_relapse": {
    "pos": "danh từ"
  },
  "word_c1e_communicable": {
    "pos": "tính từ"
  },
  "word_c1e_regimen": {
    "pos": "danh từ"
  },
  "word_c1e_invigorating": {
    "pos": "tính từ"
  },
  "word_c1e_ailment": {
    "pos": "danh từ"
  },
  "word_c1e_convalescence": {
    "pos": "danh từ"
  },
  "word_c1e_debilitating": {
    "pos": "tính từ"
  },
  "word_c1e_hygiene": {
    "pos": "danh từ"
  },
  "word_c1f_arable": {
    "pos": "tính từ"
  },
  "word_c1f_erosion": {
    "pos": "danh từ"
  },
  "word_c1f_sediment": {
    "pos": "danh từ"
  },
  "word_c1f_recycle": {
    "pos": "tính từ",
    "meaning_vi": "có thể tái chế"
  },
  "word_c1f_organic": {
    "pos": "tính từ"
  },
  "word_c1f_fossil_fuel": {
    "pos": "danh từ"
  },
  "word_c1f_solar": {
    "pos": "tính từ"
  },
  "word_c1f_turbine": {
    "pos": "danh từ"
  },
  "word_c1f_ozone": {
    "pos": "danh từ"
  },
  "word_c1f_atmosphere": {
    "pos": "danh từ"
  },
  "word_c1f_acidification": {
    "pos": "danh từ"
  },
  "word_c1f_runoff": {
    "pos": "danh từ"
  },
  "word_c1f_dispose": {
    "pos": "động từ"
  },
  "word_c1f_hazardous": {
    "pos": "tính từ"
  },
  "word_c1f_overfishing": {
    "pos": "danh từ"
  },
  "word_c1f_wildlife": {
    "pos": "danh từ"
  },
  "word_c1f_thermal": {
    "pos": "tính từ"
  },
  "word_c1f_quantify": {
    "pos": "động từ"
  },
  "word_c1f_cell": {
    "pos": "tính từ"
  },
  "word_c1g_collective": {
    "pos": "tính từ"
  },
  "word_c1g_conformity": {
    "pos": "danh từ"
  },
  "word_c1g_deviance": {
    "pos": "danh từ"
  },
  "word_c1g_alienation": {
    "pos": "danh từ"
  },
  "word_c1g_ostracism": {
    "pos": "danh từ"
  },
  "word_c1g_integrationist": {
    "pos": "danh từ"
  },
  "word_c1g_marginalised": {
    "pos": "tính từ"
  },
  "word_c1g_disadvantaged": {
    "pos": "tính từ"
  },
  "word_c1g_underprivileged": {
    "pos": "tính từ"
  },
  "word_c1g_affluent": {
    "pos": "tính từ"
  },
  "word_c1g_destitute": {
    "pos": "tính từ"
  },
  "word_c1g_precarious": {
    "pos": "tính từ"
  },
  "word_c1g_destigmatise": {
    "pos": "động từ"
  },
  "word_c1g_emancipation": {
    "pos": "danh từ"
  },
  "word_c1g_suffrage": {
    "pos": "danh từ"
  },
  "word_c1g_egalitarian": {
    "pos": "tính từ"
  },
  "word_c1g_paternalistic": {
    "pos": "tính từ"
  },
  "word_c1g_oppression": {
    "pos": "danh từ"
  },
  "word_c1g_disparate": {
    "pos": "tính từ"
  },
  "word_c1g_dichotomy": {
    "pos": "danh từ"
  },
  "word_c1g_demographer": {
    "pos": "danh từ",
    "phonetic": "/dɪˈmɒɡ.rə.fər/"
  },
  "word_c1g_cohort": {
    "pos": "danh từ"
  },
  "word_c1g_generational": {
    "pos": "tính từ"
  },
  "word_c1g_dependency": {
    "pos": "danh từ"
  },
  "word_c1g_fertility": {
    "pos": "danh từ"
  },
  "word_c1g_diaspora": {
    "pos": "danh từ"
  },
  "word_c1g_repatriation": {
    "pos": "danh từ"
  },
  "word_c1g_xenophobia": {
    "pos": "danh từ"
  },
  "word_c1g_tolerance": {
    "pos": "danh từ"
  },
  "word_c1g_reconciliation": {
    "pos": "danh từ"
  },
  "word_c1g_citizenship": {
    "pos": "danh từ"
  },
  "word_c1g_accountable": {
    "pos": "tính từ"
  },
  "word_c1g_transparency": {
    "pos": "danh từ"
  },
  "word_c1g_corruption": {
    "pos": "danh từ"
  },
  "word_c1g_institution": {
    "pos": "danh từ"
  },
  "word_c1g_bureaucracy": {
    "pos": "danh từ"
  },
  "word_c1g_mandate": {
    "pos": "danh từ"
  },
  "word_c1g_legitimacy": {
    "pos": "danh từ"
  },
  "word_c1g_activism": {
    "pos": "danh từ"
  },
  "word_c1g_dissent": {
    "pos": "danh từ"
  },
  "word_c1g_mobilise": {
    "pos": "động từ"
  },
  "word_c1g_grievance": {
    "pos": "danh từ"
  },
  "word_c1g_consumerism": {
    "pos": "danh từ"
  },
  "word_c1g_materialism": {
    "pos": "danh từ"
  },
  "word_c1g_commodify": {
    "pos": "động từ"
  },
  "word_c1g_homogenise": {
    "pos": "động từ"
  },
  "word_c1g_westernisation": {
    "pos": "danh từ"
  },
  "word_c1g_subculture": {
    "pos": "danh từ"
  },
  "word_c1g_mainstream": {
    "pos": "danh từ"
  },
  "word_c1g_zeitgeist": {
    "pos": "danh từ"
  },
  "word_c1g_ethos": {
    "pos": "danh từ"
  },
  "word_c1g_convention": {
    "pos": "danh từ"
  },
  "word_c1g_etiquette": {
    "pos": "danh từ"
  },
  "word_c1g_reverence": {
    "pos": "danh từ"
  },
  "word_c1g_idiosyncrasy": {
    "pos": "danh từ"
  },
  "word_c1g_perpetuate": {
    "pos": "động từ"
  },
  "word_c1g_entrenched": {
    "pos": "tính từ"
  },
  "word_c1g_endemic": {
    "pos": "tính từ"
  },
  "word_c1g_revitalise": {
    "pos": "động từ"
  },
  "word_c1g_safeguard": {
    "pos": "động từ"
  },
  "word_c1g_intangible": {
    "pos": "tính từ"
  },
  "word_c1g_cohesive": {
    "pos": "tính từ"
  },
  "word_c1g_inclusivity": {
    "pos": "danh từ"
  },
  "word_c1g_philanthropic": {
    "pos": "tính từ"
  },
  "word_c1g_humanitarian": {
    "pos": "tính từ"
  },
  "word_c1g_benevolent": {
    "pos": "tính từ"
  },
  "word_c1g_altruism": {
    "pos": "danh từ"
  },
  "word_c1g_camaraderie": {
    "pos": "danh từ"
  },
  "word_c1h_postulate": {
    "pos": "động từ"
  },
  "word_c1h_conjecture": {
    "pos": "danh từ"
  },
  "word_c1h_methodological": {
    "pos": "tính từ"
  },
  "word_c1h_falsifiable": {
    "pos": "tính từ"
  },
  "word_c1h_reproducible": {
    "pos": "tính từ"
  },
  "word_c1h_quantitative_data": {
    "pos": "danh từ",
    "meaning_vi": "bằng chứng thực nghiệm"
  },
  "word_c1h_variable_control": {
    "pos": "danh từ",
    "meaning_vi": "nhóm đối chứng"
  },
  "word_c1h_placebo": {
    "pos": "danh từ"
  },
  "word_c1h_calibration": {
    "pos": "danh từ"
  },
  "word_c1h_extrapolate": {
    "pos": "động từ"
  },
  "word_c1h_interpolate": {
    "pos": "động từ"
  },
  "word_c1h_deviation": {
    "pos": "danh từ"
  },
  "word_c1h_margin_of_error": {
    "pos": "danh từ",
    "phonetic": "/ˌmɑː.dʒɪn əv ˈer.ər/"
  },
  "word_c1h_statistically_significant": {
    "pos": "tính từ",
    "phonetic": "/stəˈtɪs.tɪ.kəl.i sɪɡˈnɪf.ɪ.kənt/"
  },
  "word_c1h_corroborate": {
    "pos": "động từ",
    "phonetic": "/kəˈrɒb.ə.reɪt/"
  },
  "word_c1h_refute": {
    "pos": "động từ",
    "phonetic": "/rɪˈfjuːt/"
  },
  "word_c1h_substantiate": {
    "pos": "động từ",
    "phonetic": "/səbˈstæn.ʃi.eɪt/"
  },
  "word_c1h_inconclusive": {
    "pos": "tính từ",
    "phonetic": "/ˌɪn.kənˈkluː.sɪv/"
  },
  "word_c1h_replication": {
    "pos": "danh từ",
    "phonetic": "/ˌrep.lɪˈkeɪ.ʃən/"
  },
  "word_c1h_peer_review": {
    "pos": "danh từ",
    "phonetic": "/ˌpɪə rɪˈvjuː/"
  },
  "word_c1h_longitudinal": {
    "pos": "tính từ",
    "phonetic": "/ˌlɒn.dʒɪˈtjuː.dɪ.nəl/"
  },
  "word_c1h_causality": {
    "pos": "danh từ",
    "phonetic": "/kɔːˈzæl.ə.ti/"
  },
  "word_c1h_predisposition": {
    "pos": "danh từ",
    "phonetic": "/ˌpriː.dɪs.pəˈzɪʃ.ən/"
  },
  "word_c1h_synthesise": {
    "pos": "động từ",
    "phonetic": "/ˈsɪn.θə.saɪz/"
  },
  "word_c1h_catalyse": {
    "pos": "động từ",
    "phonetic": "/ˈkæt.əl.aɪz/"
  },
  "word_c1h_dissolve": {
    "pos": "động từ",
    "phonetic": "/dɪˈzɒlv/"
  },
  "word_c1h_compound": {
    "pos": "danh từ",
    "phonetic": "/ˈkɒm.paʊnd/"
  },
  "word_c1h_specimen": {
    "pos": "danh từ",
    "phonetic": "/ˈspes.ɪ.mən/"
  },
  "word_c1h_centrifuge": {
    "pos": "danh từ",
    "phonetic": "/ˈsen.trɪ.fjuːdʒ/"
  },
  "word_c1h_microorganism": {
    "pos": "danh từ",
    "phonetic": "/ˌmaɪ.krəʊˈɔː.ɡən.ɪ.zəm/"
  },
  "word_c1h_chromosome": {
    "pos": "danh từ",
    "phonetic": "/ˈkrəʊ.mə.səʊm/"
  },
  "word_c1h_mutation": {
    "pos": "danh từ",
    "phonetic": "/mjuːˈteɪ.ʃən/"
  },
  "word_c1h_adaptation": {
    "pos": "danh từ",
    "phonetic": "/ˌæd.æpˈteɪ.ʃən/"
  },
  "word_c1h_metamorphosis": {
    "pos": "danh từ"
  },
  "word_c1h_dormancy": {
    "pos": "danh từ"
  },
  "word_c1h_friction_force": {
    "pos": "danh từ"
  },
  "word_c1h_momentum": {
    "pos": "danh từ"
  },
  "word_c1h_density_measure": {
    "pos": "danh từ"
  },
  "word_c1h_conductive": {
    "pos": "tính từ"
  },
  "word_c1h_oscillate": {
    "pos": "động từ"
  },
  "word_c1h_decay": {
    "pos": "động từ"
  },
  "word_c1h_emit_radiation": {
    "pos": "động từ"
  },
  "word_c1h_equilibrate": {
    "pos": "động từ"
  },
  "word_c1h_breakthrough_finding": {
    "pos": "tính từ"
  },
  "word_c1h_interdisciplinary_field": {
    "pos": "tính từ"
  },
  "word_c1h_speculative": {
    "pos": "tính từ"
  },
  "word_c1h_rigorous": {
    "pos": "tính từ"
  },
  "word_c1h_systematic": {
    "pos": "tính từ"
  },
  "word_c1h_preliminary": {
    "pos": "tính từ"
  },
  "word_c1h_negligible": {
    "pos": "tính từ"
  },
  "word_c1h_finding": {
    "pos": "động từ"
  },
  "word_c1h_underlying": {
    "pos": "tính từ"
  },
  "word_c1h_curriculum_design": {
    "pos": "danh từ",
    "level": "b2"
  },
  "word_c1h_coursework": {
    "pos": "danh từ",
    "level": "b2"
  },
  "word_c1h_thesis": {
    "pos": "danh từ",
    "level": "b2"
  },
  "word_c1h_seminar": {
    "pos": "danh từ",
    "level": "b2"
  },
  "word_c1h_lecture": {
    "pos": "danh từ",
    "level": "a2"
  },
  "word_c1h_tutorial": {
    "pos": "danh từ",
    "level": "b2"
  },
  "word_c1h_module": {
    "pos": "danh từ",
    "level": "b2"
  },
  "word_c1h_prerequisite": {
    "pos": "danh từ",
    "level": "c1"
  },
  "word_c1h_invigilator": {
    "pos": "danh từ",
    "level": "c1"
  },
  "word_c1h_grading": {
    "pos": "danh từ",
    "level": "b2"
  },
  "word_c1h_rubric": {
    "pos": "danh từ",
    "level": "c1"
  },
  "word_c1h_benchmark": {
    "pos": "danh từ",
    "level": "b2"
  },
  "word_c1h_formative_assessment": {
    "pos": "danh từ",
    "level": "c1"
  },
  "word_c1h_summative_assessment": {
    "pos": "danh từ",
    "level": "c1"
  },
  "word_c1h_competency": {
    "pos": "danh từ",
    "level": "b2"
  },
  "word_c1h_comprehension": {
    "pos": "danh từ",
    "level": "b2"
  },
  "word_c1h_retention": {
    "pos": "danh từ",
    "level": "b2"
  },
  "word_c1h_cognition": {
    "pos": "danh từ",
    "level": "c1"
  },
  "word_c1h_scaffolding": {
    "pos": "danh từ",
    "level": "c1"
  },
  "word_c1h_differentiation": {
    "pos": "danh từ",
    "level": "c1"
  },
  "word_c1h_facilitator": {
    "pos": "danh từ",
    "phonetic": "/fəˈsɪl.ɪ.teɪ.tər/"
  },
  "word_c1h_autonomous_learning": {
    "pos": "danh từ"
  },
  "word_c1h_rote_learning": {
    "pos": "danh từ"
  },
  "word_c1h_critical_thinking": {
    "pos": "danh từ"
  },
  "word_c1h_intellectual": {
    "pos": "tính từ"
  },
  "word_c1h_articulate": {
    "pos": "tính từ",
    "phonetic": "/ɑːˈtɪk.jə.lət/"
  },
  "word_c1h_coherent": {
    "pos": "tính từ"
  },
  "word_c1h_concise": {
    "pos": "tính từ"
  },
  "word_c1h_elaborate": {
    "pos": "động từ"
  },
  "word_c1h_paraphrase": {
    "pos": "động từ"
  },
  "word_c1h_cite": {
    "pos": "động từ"
  },
  "word_c1h_bibliography": {
    "pos": "danh từ"
  },
  "word_c1h_citation": {
    "pos": "danh từ"
  },
  "word_c1h_annotation": {
    "pos": "danh từ"
  },
  "word_c1h_didactic": {
    "pos": "tính từ"
  },
  "word_c1h_scholarly": {
    "pos": "tính từ"
  },
  "word_c1h_academia": {
    "pos": "danh từ"
  },
  "word_c1h_alumni": {
    "pos": "danh từ"
  },
  "word_c1h_faculty": {
    "pos": "danh từ"
  },
  "word_c1h_dean": {
    "pos": "danh từ"
  },
  "word_c1h_matriculate": {
    "pos": "động từ"
  },
  "word_c1h_commencement": {
    "pos": "danh từ"
  },
  "word_c1h_extracurricular": {
    "pos": "tính từ"
  },
  "word_c1h_pedagogue": {
    "pos": "danh từ"
  },
  "word_c1h_disseminate_knowledge": {
    "pos": "động từ",
    "phonetic": "/ɪmˈpɑːt/",
    "meaning_vi": "truyền đạt"
  },
  "word_c1h_assimilate_ideas": {
    "pos": "động từ",
    "phonetic": "/ɡrɑːsp/",
    "meaning_vi": "nắm bắt, lĩnh hội"
  },
  "word_c1h_proficient": {
    "pos": "tính từ"
  },
  "word_c1h_inquisitive": {
    "pos": "tính từ"
  },
  "word_c1h_meticulous": {
    "pos": "tính từ"
  },
  "word_c1i_recession": {
    "pos": "danh từ"
  },
  "word_c1i_inflation": {
    "pos": "danh từ"
  },
  "word_c1i_deflation": {
    "pos": "danh từ"
  },
  "word_c1i_stagnation": {
    "pos": "danh từ"
  },
  "word_c1i_austerity": {
    "pos": "danh từ"
  },
  "word_c1i_fiscal": {
    "pos": "tính từ"
  },
  "word_c1i_monetary": {
    "pos": "tính từ"
  },
  "word_c1i_deficit": {
    "pos": "danh từ"
  },
  "word_c1i_surplus": {
    "pos": "danh từ"
  },
  "word_c1i_revenue": {
    "pos": "danh từ"
  },
  "word_c1i_expenditure": {
    "pos": "danh từ"
  },
  "word_c1i_commodity": {
    "pos": "danh từ"
  },
  "word_c1i_dividend": {
    "pos": "danh từ"
  },
  "word_c1i_equity": {
    "pos": "danh từ"
  },
  "word_c1i_liquidity": {
    "pos": "danh từ"
  },
  "word_c1i_solvency": {
    "pos": "danh từ"
  },
  "word_c1i_collateral": {
    "pos": "danh từ"
  },
  "word_c1i_default": {
    "pos": "danh từ"
  },
  "word_c1i_insolvency": {
    "pos": "danh từ"
  },
  "word_c1i_bankruptcy": {
    "pos": "danh từ"
  },
  "word_c1i_capitalisation": {
    "pos": "danh từ"
  },
  "word_c1i_speculation": {
    "pos": "danh từ"
  },
  "word_c1i_volatility": {
    "pos": "danh từ"
  },
  "word_c1i_portfolio": {
    "pos": "danh từ"
  },
  "word_c1i_asset": {
    "pos": "danh từ"
  },
  "word_c1i_liability": {
    "pos": "danh từ"
  },
  "word_c1i_depreciation": {
    "pos": "danh từ"
  },
  "word_c1i_appreciation": {
    "pos": "danh từ"
  },
  "word_c1i_arbitrage": {
    "pos": "danh từ"
  },
  "word_c1i_leverage": {
    "pos": "danh từ"
  },
  "word_c1i_hedge": {
    "pos": "danh từ"
  },
  "word_c1i_yield": {
    "pos": "danh từ",
    "level": "b2"
  },
  "word_c1i_macroeconomic": {
    "pos": "tính từ"
  },
  "word_c1i_microeconomic": {
    "pos": "tính từ"
  },
  "word_c1i_protectionism": {
    "pos": "danh từ"
  },
  "word_c1i_tariff": {
    "pos": "danh từ"
  },
  "word_c1i_embargo": {
    "pos": "danh từ"
  },
  "word_c1i_deregulation": {
    "pos": "danh từ"
  },
  "word_c1i_privatisation": {
    "pos": "danh từ"
  },
  "word_c1i_nationalisation": {
    "pos": "danh từ"
  },
  "word_c1i_monopoly": {
    "pos": "danh từ"
  },
  "word_c1i_oligopoly": {
    "pos": "danh từ"
  },
  "word_c1i_competitiveness": {
    "pos": "danh từ"
  },
  "word_c1i_diversification": {
    "pos": "danh từ"
  },
  "word_c1i_consolidation": {
    "pos": "danh từ"
  },
  "word_c1i_acquisition": {
    "pos": "danh từ"
  },
  "word_c1i_merger": {
    "pos": "danh từ"
  },
  "word_c1i_conglomerate": {
    "pos": "danh từ"
  },
  "word_c1i_stakeholder": {
    "pos": "danh từ"
  },
  "word_c1i_shareholder": {
    "pos": "danh từ"
  },
  "word_c1i_restructuring": {
    "pos": "danh từ"
  },
  "word_c1i_downsizing": {
    "pos": "danh từ"
  },
  "word_c1i_layoff": {
    "pos": "danh từ"
  },
  "word_c1i_attrition": {
    "pos": "danh từ"
  },
  "word_c1i_appraisal": {
    "pos": "danh từ",
    "phonetic": "/pərˈfɔːr.məns əˈpreɪ.zəl/",
    "meaning_vi": "đánh giá hiệu suất"
  },
  "word_c1i_hierarchy": {
    "pos": "danh từ",
    "phonetic": "/ˌɔːr.ɡən.ɪˈzeɪ.ʃən.əl ˈhaɪ.ə.rɑːr.ki/",
    "meaning_vi": "cơ cấu thứ bậc"
  },
  "word_c1i_incumbent": {
    "pos": "danh từ"
  },
  "word_c1i_entrepreneur": {
    "pos": "danh từ",
    "phonetic": "/ˌɒn.trə.prəˈnɜːr/"
  },
  "word_c1i_venture": {
    "pos": "danh từ"
  },
  "word_c1i_startup": {
    "pos": "danh từ"
  },
  "word_c1i_subsidiary": {
    "pos": "danh từ"
  },
  "word_c1i_overhead": {
    "pos": "danh từ"
  },
  "word_c1i_margin": {
    "pos": "danh từ"
  },
  "word_c1i_turnover": {
    "pos": "danh từ"
  },
  "word_c1i_procurement": {
    "pos": "danh từ"
  },
  "word_c1i_logistics": {
    "pos": "danh từ"
  },
  "word_c1i_inventory": {
    "pos": "danh từ"
  },
  "word_c1i_throughput": {
    "pos": "danh từ"
  },
  "word_c1i_output": {
    "pos": "danh từ"
  },
  "word_c1i_capacity": {
    "pos": "danh từ"
  },
  "word_c1i_scalability": {
    "pos": "danh từ"
  },
  "word_c1i_unemployment": {
    "pos": "danh từ"
  },
  "word_c1i_underemployment": {
    "pos": "danh từ"
  },
  "word_c1i_precarity": {
    "pos": "danh từ"
  },
  "word_c1i_gig": {
    "pos": "danh từ",
    "phonetic": "/ˈɡɪɡ ɪˌkɒn.ə.mi/"
  },
  "word_c1i_wage": {
    "pos": "danh từ"
  },
  "word_c1i_pension": {
    "pos": "danh từ"
  },
  "word_c1i_unionise": {
    "pos": "động từ"
  },
  "word_c1i_collective_bargaining": {
    "pos": "danh từ"
  },
  "word_c1i_remittance": {
    "pos": "danh từ"
  },
  "word_c1i_microfinance": {
    "pos": "danh từ"
  },
  "word_c1i_outsourcing": {
    "pos": "danh từ"
  },
  "word_c1i_offshoring": {
    "pos": "danh từ"
  },
  "word_c1i_monopolise": {
    "pos": "động từ"
  },
  "word_c1i_subsidise": {
    "pos": "động từ"
  },
  "word_c1i_amortise": {
    "pos": "động từ"
  },
  "word_c1i_recapitalise": {
    "pos": "động từ"
  },
  "word_c1i_stimulus": {
    "pos": "danh từ"
  },
  "word_c1i_quota": {
    "pos": "danh từ"
  },
  "word_c1i_forecast": {
    "pos": "danh từ"
  },
  "word_c1i_solvent": {
    "pos": "tính từ"
  },
  "word_c1i_lucrative": {
    "pos": "tính từ"
  },
  "word_c1i_remunerative": {
    "pos": "tính từ"
  },
  "word_c1i_buoyant": {
    "pos": "tính từ"
  },
  "word_c1i_sluggish": {
    "pos": "tính từ"
  },
  "word_c1i_burgeoning": {
    "pos": "tính từ"
  },
  "word_c1i_disposable_income": {
    "pos": "danh từ"
  },
  "word_c1j_aesthetic_value": {
    "pos": "danh từ"
  },
  "word_c1j_connoisseur": {
    "pos": "danh từ"
  },
  "word_c1j_portrayal": {
    "pos": "danh từ"
  },
  "word_c1j_protagonist": {
    "pos": "danh từ"
  },
  "word_c1j_cinematography": {
    "pos": "danh từ"
  },
  "word_c1j_screenplay": {
    "pos": "danh từ"
  },
  "word_c1j_montage": {
    "pos": "danh từ"
  },
  "word_c1j_subtitle": {
    "pos": "danh từ"
  },
  "word_c1j_box_office": {
    "pos": "danh từ"
  },
  "word_c1j_premiere": {
    "pos": "danh từ"
  },
  "word_c1j_acclaim": {
    "pos": "danh từ",
    "phonetic": "/ˈkrɪt.ɪ.kəl rɪˈsep.ʃən/",
    "meaning_vi": "sự đón nhận của giới phê bình",
    "level": "c1"
  },
  "word_c1j_genre_blending": {
    "pos": "danh từ",
    "phonetic": "/ˈmet.ə.fɔːr/",
    "meaning_vi": "ẩn dụ",
    "level": "c1"
  },
  "word_c1j_allegory": {
    "pos": "danh từ"
  },
  "word_c1j_satire": {
    "pos": "danh từ"
  },
  "word_c1j_nuance": {
    "pos": "danh từ"
  },
  "word_c1j_motif": {
    "pos": "danh từ"
  },
  "word_c1j_canon": {
    "pos": "danh từ"
  },
  "word_c1j_acquisition": {
    "pos": "danh từ",
    "phonetic": "/ˌek.sɪˈbɪʃ.ən/",
    "meaning_vi": "triển lãm",
    "level": "c1"
  },
  "word_c1j_avantgarde": {
    "pos": "danh từ",
    "phonetic": "/ˈmɑː.stə.piːs/",
    "meaning_vi": "kiệt tác",
    "level": "c1"
  },
  "word_c1j_journalistic": {
    "pos": "danh từ",
    "phonetic": "/ɪnˈves.tɪ.ɡeɪ.tɪv ˈdʒɜː.nə.lɪ.zəm/",
    "meaning_vi": "báo chí điều tra",
    "level": "c1"
  },
  "word_c1j_editorial": {
    "pos": "danh từ"
  },
  "word_c1j_op_ed": {
    "pos": "danh từ"
  },
  "word_c1j_byline": {
    "pos": "danh từ"
  },
  "word_c1j_press_freedom": {
    "pos": "danh từ"
  },
  "word_c1j_tabloid": {
    "pos": "danh từ"
  },
  "word_c1j_sensationalism": {
    "pos": "danh từ"
  },
  "word_c1j_objectivity": {
    "pos": "danh từ"
  },
  "word_c1j_correspondent": {
    "pos": "danh từ"
  },
  "word_c1j_circulation": {
    "pos": "danh từ"
  },
  "word_c1j_defamation": {
    "pos": "danh từ"
  },
  "word_c1j_disinformation": {
    "pos": "danh từ"
  },
  "word_c1j_narrative_voice": {
    "pos": "danh từ",
    "phonetic": "/ˈhed.laɪn/",
    "meaning_vi": "tiêu đề báo",
    "level": "c1"
  },
  "word_c1j_dissemination": {
    "pos": "danh từ",
    "phonetic": "/ˈkʌv.ər.ɪdʒ ˈæŋ.ɡl/",
    "meaning_vi": "góc tiếp cận đưa tin",
    "level": "c1"
  },
  "word_c1j_repertory": {
    "pos": "tính từ",
    "phonetic": "/θiˈæt.rɪ.kəl/",
    "meaning_vi": "thuộc về sân khấu",
    "level": "c1"
  },
  "word_c1j_choreography": {
    "pos": "danh từ",
    "meaning_vi": "biên đạo múa"
  },
  "word_c1j_improvisation": {
    "pos": "danh từ",
    "meaning_vi": "sự ứng tác"
  },
  "word_c1j_virtuoso": {
    "pos": "danh từ",
    "phonetic": "/ˌvɜː.tʃuˈəʊ.səʊ/"
  },
  "word_c1j_evocative_imagery": {
    "pos": "động từ",
    "meaning_vi": "tô điểm"
  },
  "word_c1j_digitisation": {
    "pos": "danh từ",
    "meaning_vi": "sự số hóa"
  },
  "word_c1j_connectivity": {
    "pos": "danh từ",
    "meaning_vi": "khả năng kết nối"
  },
  "word_c1j_latency": {
    "pos": "danh từ",
    "meaning_vi": "độ trễ"
  },
  "word_c1j_redundancy_tech": {
    "pos": "danh từ",
    "meaning_vi": "khả năng tương tác"
  },
  "word_c1j_algorithmic_bias": {
    "pos": "danh từ",
    "meaning_vi": "thiên kiến thuật toán"
  },
  "word_c1j_neural_architecture": {
    "pos": "danh từ",
    "meaning_vi": "dữ liệu huấn luyện"
  },
  "word_c1j_inference_engine": {
    "pos": "danh từ",
    "meaning_vi": "phân tích dự đoán"
  },
  "word_c1j_automation_tech": {
    "pos": "danh từ",
    "meaning_vi": "hệ thống tự hành"
  },
  "word_c1j_data_privacy": {
    "pos": "danh từ",
    "meaning_vi": "quyền riêng tư dữ liệu"
  },
  "word_c1j_anonymisation": {
    "pos": "danh từ",
    "meaning_vi": "sự ẩn danh hóa"
  },
  "word_c1j_breach": {
    "pos": "danh từ",
    "meaning_vi": "sự rò rỉ dữ liệu"
  },
  "word_c1j_authentication": {
    "pos": "danh từ",
    "meaning_vi": "sự xác thực"
  },
  "word_c1j_malware": {
    "pos": "danh từ",
    "meaning_vi": "phần mềm độc hại"
  },
  "word_c1j_phishing": {
    "pos": "danh từ",
    "meaning_vi": "lừa đảo trực tuyến"
  },
  "word_c1j_blockchain": {
    "pos": "danh từ",
    "meaning_vi": "chuỗi khối"
  },
  "word_c1j_decentralisation": {
    "pos": "danh từ",
    "meaning_vi": "sự phi tập trung"
  },
  "word_c1j_virtualization": {
    "pos": "danh từ",
    "phonetic": "/ˌvɜː.tʃu.ə.laɪˈzeɪ.ʃən/"
  },
  "word_c1j_open_source": {
    "pos": "danh từ"
  },
  "word_c1j_proprietary": {
    "pos": "tính từ"
  },
  "word_c1j_obsolescence": {
    "pos": "danh từ"
  },
  "word_c1j_disruptive": {
    "pos": "tính từ"
  },
  "word_c1j_digital_divide": {
    "pos": "danh từ"
  },
  "word_c1j_user_interface": {
    "pos": "danh từ"
  },
  "word_c1j_optimisation": {
    "pos": "danh từ"
  },
  "word_c1j_aggregation": {
    "pos": "danh từ"
  },
  "word_c1j_metadata": {
    "pos": "danh từ"
  },
  "word_c1j_facial_recognition": {
    "pos": "danh từ"
  },
  "word_c1j_personalisation": {
    "pos": "danh từ"
  },
  "word_c1j_engagement_metric": {
    "pos": "danh từ",
    "phonetic": "/ˈklɪk θruː reɪt/",
    "meaning_vi": "tỷ lệ nhấp chuột",
    "level": "c1"
  },
  "word_c1j_viral": {
    "pos": "tính từ"
  },
  "word_c1j_moderation": {
    "pos": "danh từ",
    "phonetic": "/ˈkɒn.tent ˌmɒd.əˈreɪ.ʃən/",
    "meaning_vi": "kiểm duyệt nội dung",
    "level": "c1"
  },
  "word_c1j_deepfake": {
    "pos": "danh từ"
  },
  "word_c1j_immersive": {
    "pos": "tính từ"
  },
  "word_c1j_augmented_reality": {
    "pos": "danh từ"
  },
  "word_c1j_bandwidth_demand": {
    "pos": "danh từ",
    "phonetic": "/ˌkɒm.pjuˈteɪ.ʃən.əl ˈpaʊə/",
    "meaning_vi": "năng lực tính toán",
    "level": "c1"
  },
  "word_c1j_repository": {
    "pos": "danh từ"
  },
  "word_c1j_legacy_system": {
    "pos": "danh từ",
    "phonetic": "/ˈleɡ.ə.si ˌsɪs.təm/",
    "meaning_vi": "hệ thống kế thừa"
  },
  "word_a1f_waffle": {
    "pos": "danh từ"
  },
  "word_a1f_jam": {
    "pos": "danh từ"
  },
  "word_a1f_honey_food": {
    "pos": "danh từ",
    "level": "a2"
  },
  "word_a1f_toast": {
    "pos": "danh từ"
  },
  "word_a1f_egg_fried": {
    "pos": "danh từ"
  },
  "word_a1f_ham": {
    "pos": "danh từ"
  },
  "word_a1f_bacon": {
    "pos": "danh từ"
  },
  "word_a1f_sausage": {
    "pos": "danh từ"
  },
  "word_a1f_burger": {
    "pos": "danh từ"
  },
  "word_a1f_fries": {
    "pos": "danh từ"
  },
  "word_a1f_chips": {
    "pos": "danh từ"
  },
  "word_a1f_pasta": {
    "pos": "danh từ"
  },
  "word_a1f_bun": {
    "pos": "danh từ"
  },
  "word_a1f_biscuit": {
    "pos": "danh từ"
  },
  "word_a1f_pie": {
    "pos": "danh từ"
  },
  "word_a1f_donut": {
    "pos": "danh từ"
  },
  "word_a1f_pancake": {
    "pos": "danh từ"
  },
  "word_a1f_jelly": {
    "pos": "danh từ"
  },
  "word_a1f_yogurt": {
    "pos": "danh từ"
  },
  "word_a1f_cream": {
    "pos": "danh từ"
  },
  "word_a1f_chocolate_bar": {
    "pos": "danh từ"
  },
  "word_a1f_lollipop": {
    "pos": "danh từ"
  },
  "word_a1f_popcorn": {
    "pos": "danh từ"
  },
  "word_a1f_nut": {
    "pos": "danh từ",
    "meaning_vi": "hạt (có vỏ cứng)"
  },
  "word_a1f_bean": {
    "pos": "danh từ"
  },
  "word_a1f_pea": {
    "pos": "danh từ",
    "meaning_vi": "đậu Hà Lan"
  },
  "word_a1f_garlic": {
    "pos": "danh từ"
  },
  "word_a1f_ginger": {
    "pos": "danh từ"
  },
  "word_a1f_chili": {
    "pos": "danh từ",
    "meaning_vi": "ớt (quả)"
  },
  "word_a1f_cabbage": {
    "pos": "danh từ"
  },
  "word_a1f_lettuce": {
    "pos": "danh từ"
  },
  "word_a1f_spinach": {
    "pos": "danh từ"
  },
  "word_a1f_potato_sweet": {
    "pos": "danh từ",
    "phonetic": "/ˈbrɒkəli/",
    "meaning_vi": "bông cải xanh",
    "level": "a1"
  },
  "word_a1f_grapefruit": {
    "pos": "danh từ"
  },
  "word_a1f_lime": {
    "pos": "danh từ"
  },
  "word_a1f_plum": {
    "pos": "danh từ"
  },
  "word_a1f_apricot": {
    "pos": "danh từ"
  },
  "word_a1f_kiwi": {
    "pos": "danh từ"
  },
  "word_a1f_melon": {
    "pos": "danh từ"
  },
  "word_a1f_berry": {
    "pos": "danh từ"
  },
  "word_a1f_milkshake": {
    "pos": "danh từ"
  },
  "word_a1f_lemonade": {
    "pos": "danh từ"
  },
  "word_a1f_soda": {
    "pos": "danh từ"
  },
  "word_a1f_smoothie": {
    "pos": "danh từ"
  },
  "word_a1f_syrup": {
    "pos": "danh từ"
  },
  "word_a1f_dumpling": {
    "pos": "danh từ"
  },
  "word_a1f_cracker": {
    "pos": "danh từ"
  },
  "word_a1f_ice": {
    "pos": "danh từ"
  },
  "word_a1f_spaghetti": {
    "pos": "danh từ"
  },
  "word_a1f_curry": {
    "pos": "danh từ"
  },
  "word_a1f_pepper_black": {
    "pos": "danh từ",
    "phonetic": "/ˌsɔːlt ən ˈpepə/",
    "meaning_vi": "muối và tiêu"
  },
  "word_a1f_sweet_food": {
    "pos": "danh từ",
    "phonetic": "/ˈʃʊɡə kjuːb/",
    "meaning_vi": "viên đường"
  },
  "word_a1f_meal_dinner": {
    "pos": "danh từ",
    "phonetic": "/ˈlʌntʃ bɒks/",
    "meaning_vi": "hộp cơm trưa"
  },
  "word_a1f_pony": {
    "pos": "danh từ"
  },
  "word_a1f_otter": {
    "pos": "danh từ"
  },
  "word_a1f_beaver": {
    "pos": "danh từ"
  },
  "word_a1f_lamb": {
    "pos": "danh từ"
  },
  "word_a1f_calf": {
    "pos": "danh từ"
  },
  "word_a1f_donkey": {
    "pos": "danh từ"
  },
  "word_a1f_stork": {
    "pos": "danh từ"
  },
  "word_a1f_turkey": {
    "pos": "danh từ"
  },
  "word_a1f_rooster": {
    "pos": "danh từ",
    "phonetic": "/ˈruːstər/"
  },
  "word_a1f_swallow": {
    "pos": "danh từ"
  },
  "word_a1f_canary": {
    "pos": "danh từ"
  },
  "word_a1f_hawk": {
    "pos": "danh từ"
  },
  "word_a1f_kangaroo": {
    "pos": "danh từ"
  },
  "word_a1f_llama": {
    "pos": "danh từ"
  },
  "word_a1f_koala": {
    "pos": "danh từ"
  },
  "word_a1f_camel": {
    "pos": "danh từ",
    "phonetic": "/ˈkæməl/"
  },
  "word_a1f_hippo": {
    "pos": "danh từ"
  },
  "word_a1f_rhino": {
    "pos": "danh từ"
  },
  "word_a1f_leopard": {
    "pos": "danh từ"
  },
  "word_a1f_cheetah": {
    "pos": "danh từ"
  },
  "word_a1f_squirrel": {
    "pos": "danh từ"
  },
  "word_a1f_hedgehog": {
    "pos": "danh từ"
  },
  "word_a1f_bat": {
    "pos": "danh từ"
  },
  "word_a1f_salamander": {
    "pos": "danh từ",
    "phonetic": "/ˈsæləmændə/"
  },
  "word_a1f_buffalo": {
    "pos": "danh từ"
  },
  "word_a1f_seal": {
    "pos": "danh từ"
  },
  "word_a1f_raccoon": {
    "pos": "danh từ"
  },
  "word_a1f_seastar": {
    "pos": "danh từ",
    "level": "kids"
  },
  "word_a1f_sloth": {
    "pos": "danh từ",
    "level": "a2"
  },
  "word_a1f_toad": {
    "pos": "danh từ",
    "level": "a2"
  },
  "word_a1f_fly": {
    "pos": "danh từ"
  },
  "word_a1f_crow": {
    "pos": "danh từ",
    "level": "a2"
  },
  "word_a1g_mom": {
    "pos": "danh từ"
  },
  "word_a1g_dad": {
    "pos": "danh từ"
  },
  "word_a1g_parents": {
    "pos": "danh từ"
  },
  "word_a1g_son": {
    "pos": "danh từ"
  },
  "word_a1g_daughter": {
    "pos": "danh từ"
  },
  "word_a1g_child": {
    "pos": "danh từ"
  },
  "word_a1g_children": {
    "pos": "danh từ"
  },
  "word_a1g_baby": {
    "pos": "danh từ"
  },
  "word_a1g_grandma": {
    "pos": "danh từ"
  },
  "word_a1g_grandpa": {
    "pos": "danh từ"
  },
  "word_a1g_grandparents": {
    "pos": "danh từ"
  },
  "word_a1g_husband": {
    "pos": "danh từ"
  },
  "word_a1g_wife": {
    "pos": "danh từ"
  },
  "word_a1g_boy": {
    "pos": "danh từ"
  },
  "word_a1g_girl": {
    "pos": "danh từ"
  },
  "word_a1g_man": {
    "pos": "danh từ"
  },
  "word_a1g_woman": {
    "pos": "danh từ"
  },
  "word_a1g_people": {
    "pos": "danh từ"
  },
  "word_a1g_friend": {
    "pos": "danh từ"
  },
  "word_a1g_name": {
    "pos": "danh từ"
  },
  "word_a1g_pet": {
    "pos": "danh từ"
  },
  "word_a1g_house": {
    "pos": "danh từ"
  },
  "word_a1g_home": {
    "pos": "danh từ"
  },
  "word_a1g_flat": {
    "pos": "danh từ"
  },
  "word_a1g_bedroom": {
    "pos": "danh từ"
  },
  "word_a1g_bathroom": {
    "pos": "danh từ"
  },
  "word_a1g_livingroom": {
    "pos": "danh từ"
  },
  "word_a1g_garden": {
    "pos": "danh từ"
  },
  "word_a1g_stairs": {
    "pos": "danh từ"
  },
  "word_a1g_sofa": {
    "pos": "danh từ"
  },
  "word_a1g_desk": {
    "pos": "danh từ"
  },
  "word_a1g_shelf": {
    "pos": "danh từ"
  },
  "word_a1g_lamp": {
    "pos": "danh từ"
  },
  "word_a1g_light": {
    "pos": "danh từ"
  },
  "word_a1g_clock": {
    "pos": "danh từ"
  },
  "word_a1g_tv": {
    "pos": "danh từ"
  },
  "word_a1g_phone": {
    "pos": "danh từ"
  },
  "word_a1g_fridge": {
    "pos": "danh từ"
  },
  "word_a1g_oven": {
    "pos": "danh từ"
  },
  "word_a1g_cup": {
    "pos": "danh từ"
  },
  "word_a1g_glass": {
    "pos": "danh từ"
  },
  "word_a1g_plate": {
    "pos": "danh từ"
  },
  "word_a1g_bowl": {
    "pos": "danh từ"
  },
  "word_a1g_spoon": {
    "pos": "danh từ"
  },
  "word_a1g_fork": {
    "pos": "danh từ"
  },
  "word_a1g_knife": {
    "pos": "danh từ"
  },
  "word_a1g_key": {
    "pos": "danh từ"
  },
  "word_a1g_box": {
    "pos": "danh từ"
  },
  "word_a1g_picture": {
    "pos": "danh từ"
  },
  "word_a1g_mirror": {
    "pos": "danh từ"
  },
  "word_a1g_towel": {
    "pos": "danh từ"
  },
  "word_a1g_sink": {
    "pos": "danh từ"
  },
  "word_a1g_curtain": {
    "pos": "danh từ"
  },
  "word_a1g_carpet": {
    "pos": "danh từ"
  },
  "word_a1g_blanket": {
    "pos": "danh từ"
  },
  "word_a1g_pillow": {
    "pos": "danh từ"
  },
  "word_a1g_cupboard": {
    "pos": "danh từ"
  },
  "word_a1g_garage": {
    "pos": "danh từ"
  },
  "word_a1g_address": {
    "pos": "danh từ"
  },
  "word_a1h_ruler": {
    "pos": "danh từ"
  },
  "word_a1h_eraser": {
    "pos": "danh từ"
  },
  "word_a1h_bag": {
    "pos": "danh từ"
  },
  "word_a1h_board": {
    "pos": "danh từ"
  },
  "word_a1h_chalk": {
    "pos": "danh từ"
  },
  "word_a1h_marker": {
    "pos": "danh từ"
  },
  "word_a1h_paper": {
    "pos": "danh từ"
  },
  "word_a1h_glue": {
    "pos": "danh từ"
  },
  "word_a1h_scissors": {
    "pos": "danh từ"
  },
  "word_a1h_bottle": {
    "pos": "danh từ"
  },
  "word_a1h_crayon": {
    "pos": "danh từ"
  },
  "word_a1h_dictionary": {
    "pos": "danh từ"
  },
  "word_a1h_school": {
    "pos": "danh từ"
  },
  "word_a1h_class": {
    "pos": "danh từ"
  },
  "word_a1h_test": {
    "pos": "danh từ"
  },
  "word_a1h_pencilcase": {
    "pos": "danh từ"
  },
  "word_a1h_backpack": {
    "pos": "danh từ"
  },
  "word_a1h_word": {
    "pos": "danh từ"
  },
  "word_a1h_letter": {
    "pos": "danh từ"
  },
  "word_a1h_number": {
    "pos": "danh từ"
  },
  "word_a1h_question": {
    "pos": "danh từ"
  },
  "word_a1h_answer": {
    "pos": "danh từ"
  },
  "word_a1h_page": {
    "pos": "danh từ"
  },
  "word_a1h_color": {
    "pos": "danh từ"
  },
  "word_a1h_draw": {
    "pos": "động từ"
  },
  "word_a1h_learn": {
    "pos": "động từ"
  },
  "word_a1h_teach": {
    "pos": "động từ"
  },
  "word_a1h_ask": {
    "pos": "động từ"
  },
  "word_a1h_listen": {
    "pos": "động từ"
  },
  "word_a1h_speak": {
    "pos": "động từ"
  },
  "word_a1h_count": {
    "pos": "động từ"
  },
  "word_a1h_open": {
    "pos": "động từ"
  },
  "word_a1h_close": {
    "pos": "động từ"
  },
  "word_a1h_sit": {
    "pos": "động từ"
  },
  "word_a1h_stand": {
    "pos": "động từ"
  },
  "word_a1h_walk": {
    "pos": "động từ"
  },
  "word_a1h_run": {
    "pos": "động từ"
  },
  "word_a1h_wash": {
    "pos": "động từ"
  },
  "word_a1h_brush": {
    "pos": "động từ"
  },
  "word_a1h_cook": {
    "pos": "động từ"
  },
  "word_a1h_clean": {
    "pos": "động từ"
  },
  "word_a1h_help": {
    "pos": "động từ"
  },
  "word_a1h_go": {
    "pos": "động từ"
  },
  "word_a1h_come": {
    "pos": "động từ"
  },
  "word_a1h_get_up": {
    "pos": "động từ"
  },
  "word_a1h_dress": {
    "pos": "động từ",
    "meaning_vi": "mặc quần áo"
  },
  "word_a1h_breakfast": {
    "pos": "danh từ"
  },
  "word_a1h_lunch": {
    "pos": "danh từ"
  },
  "word_a1h_dinner": {
    "pos": "danh từ"
  },
  "word_a1h_morning": {
    "pos": "danh từ"
  },
  "word_a1h_afternoon": {
    "pos": "danh từ"
  },
  "word_a1h_evening": {
    "pos": "danh từ"
  },
  "word_a1h_night": {
    "pos": "danh từ"
  },
  "word_a1h_today": {
    "pos": "trạng từ"
  },
  "word_a1h_homework_do": {
    "pos": "động từ"
  },
  "word_a1h_watch": {
    "pos": "động từ"
  },
  "word_a1h_sing": {
    "pos": "động từ"
  },
  "word_a1h_dance": {
    "pos": "động từ"
  },
  "word_a1h_exercise": {
    "pos": "động từ"
  },
  "word_a1i_tshirt": {
    "pos": "danh từ"
  },
  "word_a1i_jeans": {
    "pos": "danh từ"
  },
  "word_a1i_coat": {
    "pos": "danh từ"
  },
  "word_a1i_boots": {
    "pos": "danh từ"
  },
  "word_a1i_cap": {
    "pos": "danh từ"
  },
  "word_a1i_scarf": {
    "pos": "danh từ"
  },
  "word_a1i_gloves": {
    "pos": "danh từ"
  },
  "word_a1i_belt": {
    "pos": "danh từ"
  },
  "word_a1i_tie": {
    "pos": "danh từ"
  },
  "word_a1i_glasses": {
    "pos": "danh từ"
  },
  "word_a1i_pocket": {
    "pos": "danh từ"
  },
  "word_a1i_uniform": {
    "pos": "danh từ"
  },
  "word_a1i_pyjamas": {
    "pos": "danh từ"
  },
  "word_a1i_clothes": {
    "pos": "danh từ"
  },
  "word_a1i_wear": {
    "pos": "động từ"
  },
  "word_a1i_puton": {
    "pos": "động từ"
  },
  "word_a1i_takeoff": {
    "pos": "động từ"
  },
  "word_a1i_size": {
    "pos": "danh từ"
  },
  "word_a1i_button": {
    "pos": "danh từ"
  },
  "word_a1i_red": {
    "pos": "tính từ"
  },
  "word_a1i_blue": {
    "pos": "tính từ"
  },
  "word_a1i_green": {
    "pos": "tính từ"
  },
  "word_a1i_yellow": {
    "pos": "tính từ"
  },
  "word_a1i_black": {
    "pos": "tính từ"
  },
  "word_a1i_white": {
    "pos": "tính từ"
  },
  "word_a1i_brown": {
    "pos": "tính từ"
  },
  "word_a1i_pink": {
    "pos": "tính từ"
  },
  "word_a1i_purple": {
    "pos": "tính từ"
  },
  "word_a1i_grey": {
    "pos": "tính từ"
  },
  "word_a1i_colour": {
    "pos": "danh từ"
  },
  "word_a1i_new": {
    "pos": "tính từ"
  },
  "word_a1i_old": {
    "pos": "tính từ"
  },
  "word_a1i_long": {
    "pos": "tính từ"
  },
  "word_a1i_short": {
    "pos": "tính từ"
  },
  "word_a1i_big": {
    "pos": "tính từ"
  },
  "word_a1i_small": {
    "pos": "tính từ"
  },
  "word_a1i_nice": {
    "pos": "tính từ"
  },
  "word_a1i_pretty": {
    "pos": "tính từ",
    "phonetic": "/ˈprɪt.i/"
  },
  "word_a1i_dirty": {
    "pos": "tính từ",
    "phonetic": "/ˈdɜː.ti/"
  },
  "word_a1i_warm": {
    "pos": "tính từ",
    "phonetic": "/wɔːm/"
  },
  "word_a1i_soft": {
    "pos": "tính từ",
    "phonetic": "/sɒft/"
  },
  "word_a1i_afraid": {
    "pos": "tính từ",
    "phonetic": "/əˈfreɪd/"
  },
  "word_a1i_thirsty": {
    "pos": "tính từ",
    "phonetic": "/ˈθɜː.sti/"
  },
  "word_a1i_sleepy": {
    "pos": "tính từ",
    "phonetic": "/ˈsliː.pi/"
  },
  "word_a1i_cold": {
    "pos": "tính từ",
    "phonetic": "/kəʊld/"
  },
  "word_a1i_hot": {
    "pos": "tính từ",
    "phonetic": "/hɒt/"
  },
  "word_a1i_sick": {
    "pos": "tính từ",
    "phonetic": "/sɪk/"
  },
  "word_a1i_well": {
    "pos": "tính từ",
    "phonetic": "/wel/"
  },
  "word_a1i_fine": {
    "pos": "tính từ",
    "phonetic": "/faɪn/"
  },
  "word_a1i_okay": {
    "pos": "tính từ",
    "phonetic": "/ˌəʊˈkeɪ/"
  },
  "word_a1i_glad": {
    "pos": "tính từ",
    "phonetic": "/ɡlæd/"
  },
  "word_a1i_worried": {
    "pos": "tính từ",
    "phonetic": "/ˈwʌr.id/"
  },
  "word_a1i_calm": {
    "pos": "tính từ",
    "phonetic": "/kɑːm/"
  },
  "word_a1i_lonely": {
    "pos": "tính từ",
    "phonetic": "/ˈləʊn.li/"
  },
  "word_a1i_proud": {
    "pos": "tính từ",
    "phonetic": "/praʊd/"
  },
  "word_a1i_love": {
    "pos": "động từ",
    "phonetic": "/lʌv/"
  },
  "word_a1i_like": {
    "pos": "động từ",
    "phonetic": "/laɪk/"
  },
  "word_a1i_feel": {
    "pos": "động từ"
  },
  "word_a1i_smile": {
    "pos": "động từ"
  },
  "word_a1i_cry": {
    "pos": "động từ"
  },
  "word_a1j_trip": {
    "pos": "danh từ"
  },
  "word_a1j_sea": {
    "pos": "danh từ"
  },
  "word_a1j_city": {
    "pos": "danh từ"
  },
  "word_a1j_airport": {
    "pos": "danh từ"
  },
  "word_a1j_plane": {
    "pos": "danh từ"
  },
  "word_a1j_taxi": {
    "pos": "danh từ"
  },
  "word_a1j_boat": {
    "pos": "danh từ"
  },
  "word_a1j_bike": {
    "pos": "danh từ"
  },
  "word_a1j_road": {
    "pos": "danh từ"
  },
  "word_a1j_station": {
    "pos": "danh từ"
  },
  "word_a1j_street": {
    "pos": "danh từ"
  },
  "word_a1j_passport": {
    "pos": "danh từ"
  },
  "word_a1j_camera": {
    "pos": "danh từ"
  },
  "word_a1j_photo": {
    "pos": "danh từ"
  },
  "word_a1j_visit": {
    "pos": "động từ"
  },
  "word_a1j_holiday": {
    "pos": "danh từ"
  },
  "word_a1j_island": {
    "pos": "danh từ"
  },
  "word_a1j_park": {
    "pos": "danh từ"
  },
  "word_a1j_river": {
    "pos": "danh từ"
  },
  "word_a1j_game": {
    "pos": "danh từ"
  },
  "word_a1j_swim": {
    "pos": "động từ"
  },
  "word_a1j_jump": {
    "pos": "động từ"
  },
  "word_a1j_win": {
    "pos": "động từ"
  },
  "word_a1j_kick": {
    "pos": "động từ"
  },
  "word_a1j_throw": {
    "pos": "động từ"
  },
  "word_a1j_catch": {
    "pos": "động từ"
  },
  "word_a1j_ride": {
    "pos": "động từ"
  },
  "word_a1j_player": {
    "pos": "danh từ"
  },
  "word_a1j_score": {
    "pos": "danh từ"
  },
  "word_a1j_race": {
    "pos": "danh từ"
  },
  "word_a1j_gym": {
    "pos": "danh từ"
  },
  "word_a1j_climb": {
    "pos": "động từ"
  },
  "word_a1j_skate": {
    "pos": "động từ"
  },
  "word_a1j_goal": {
    "pos": "danh từ"
  },
  "word_a1j_match": {
    "pos": "danh từ"
  },
  "word_a1j_head": {
    "pos": "danh từ"
  },
  "word_a1j_hand": {
    "pos": "danh từ"
  },
  "word_a1j_arm": {
    "pos": "danh từ"
  },
  "word_a1j_leg": {
    "pos": "danh từ"
  },
  "word_a1j_foot": {
    "pos": "danh từ"
  },
  "word_a1j_eye": {
    "pos": "danh từ"
  },
  "word_a1j_ear": {
    "pos": "danh từ"
  },
  "word_a1j_nose": {
    "pos": "danh từ"
  },
  "word_a1j_mouth": {
    "pos": "danh từ"
  },
  "word_a1j_tooth": {
    "pos": "danh từ"
  },
  "word_a1j_hair": {
    "pos": "danh từ"
  },
  "word_a1j_face": {
    "pos": "danh từ"
  },
  "word_a1j_finger": {
    "pos": "danh từ"
  },
  "word_a1j_body": {
    "pos": "danh từ"
  },
  "word_a1j_ill": {
    "pos": "tính từ"
  },
  "word_a1j_doctor": {
    "pos": "danh từ"
  },
  "word_a1j_nurse": {
    "pos": "danh từ"
  },
  "word_a1j_hospital": {
    "pos": "danh từ"
  },
  "word_a1j_pain": {
    "pos": "danh từ"
  },
  "word_a1j_fever": {
    "pos": "danh từ"
  },
  "word_a1j_medicine": {
    "pos": "danh từ"
  },
  "word_a1j_pill": {
    "pos": "danh từ"
  },
  "word_a1j_rest": {
    "pos": "động từ"
  },
  "word_a1j_healthy": {
    "pos": "tính từ"
  },
  "word_a1j_cough": {
    "pos": "động từ"
  },
  "word_a2_airport": {
    "pos": "danh từ"
  },
  "word_a2_passport": {
    "pos": "danh từ"
  },
  "word_a2_luggage": {
    "pos": "danh từ"
  },
  "word_a2_tourist": {
    "pos": "danh từ"
  },
  "word_a2_journey": {
    "pos": "danh từ"
  },
  "word_a2_souvenir": {
    "pos": "danh từ"
  },
  "word_a2_team": {
    "pos": "danh từ"
  },
  "word_a2_coach": {
    "pos": "danh từ"
  },
  "word_a2_match": {
    "pos": "danh từ"
  },
  "word_a2_swimming": {
    "pos": "danh từ"
  },
  "word_a2_stadium": {
    "pos": "danh từ"
  },
  "word_a2_exercise": {
    "pos": "danh từ"
  },
  "word_a2_excited": {
    "pos": "tính từ"
  },
  "word_a2_nervous": {
    "pos": "tính từ"
  },
  "word_a2_bored": {
    "pos": "tính từ"
  },
  "word_a2_proud": {
    "pos": "tính từ"
  },
  "word_a2_surprised": {
    "pos": "tính từ"
  },
  "word_a2_lonely": {
    "pos": "tính từ"
  },
  "word_a2_wake": {
    "pos": "động từ"
  },
  "word_a2_brush": {
    "pos": "động từ"
  },
  "word_a2_shower": {
    "pos": "danh từ"
  },
  "word_a2_relax": {
    "pos": "động từ"
  },
  "word_a2_clean": {
    "pos": "động từ"
  },
  "word_a2_busy": {
    "pos": "tính từ"
  },
  "word_a2_homework": {
    "pos": "danh từ"
  },
  "word_a2_teacher": {
    "pos": "danh từ"
  },
  "word_a2_lesson": {
    "pos": "danh từ"
  },
  "word_a2_dictionary": {
    "pos": "danh từ"
  },
  "word_a2_classmate": {
    "pos": "danh từ"
  },
  "word_a2_exam": {
    "pos": "danh từ"
  },
  "word_a2_breakfast": {
    "pos": "danh từ"
  },
  "word_a2_vegetable": {
    "pos": "danh từ"
  },
  "word_a2_delicious": {
    "pos": "tính từ"
  },
  "word_a2_dinner": {
    "pos": "danh từ"
  },
  "word_a2_snack": {
    "pos": "danh từ"
  },
  "word_a2_recipe": {
    "pos": "danh từ"
  },
  "word_a2_kitchen": {
    "pos": "danh từ"
  },
  "word_a2_bedroom": {
    "pos": "danh từ",
    "phonetic": "/ˈbed.ruːm/"
  },
  "word_a2_furniture": {
    "pos": "danh từ",
    "phonetic": "/ˈfɜː.nɪ.tʃər/"
  },
  "word_a2_garden": {
    "pos": "danh từ",
    "phonetic": "/ˈɡɑː.dən/"
  },
  "word_a2_window": {
    "pos": "danh từ",
    "phonetic": "/ˈwɪn.dəʊ/"
  },
  "word_a2_jacket": {
    "pos": "danh từ",
    "phonetic": "/ˈdʒæk.ɪt/"
  },
  "word_a2_scarf": {
    "pos": "danh từ",
    "phonetic": "/skɑːf/"
  },
  "word_a2_gloves": {
    "pos": "danh từ",
    "phonetic": "/ɡlʌvz/"
  },
  "word_a2_uniform": {
    "pos": "danh từ",
    "phonetic": "/ˈjuː.nɪ.fɔːm/"
  },
  "word_a2_boots": {
    "pos": "danh từ",
    "phonetic": "/buːts/"
  },
  "word_a2b_ticket": {
    "pos": "danh từ",
    "phonetic": "/ˈtɪk.ɪt/"
  },
  "word_a2b_suitcase": {
    "pos": "danh từ",
    "phonetic": "/ˈsuːt.keɪs/"
  },
  "word_a2b_backpack": {
    "pos": "danh từ",
    "phonetic": "/ˈbæk.pæk/"
  },
  "word_a2b_flight": {
    "pos": "danh từ",
    "phonetic": "/flaɪt/"
  },
  "word_a2b_plane": {
    "pos": "danh từ",
    "phonetic": "/pleɪn/"
  },
  "word_a2b_airplane": {
    "pos": "danh từ",
    "phonetic": "/ˈeə.pleɪn/"
  },
  "word_a2b_train": {
    "pos": "danh từ",
    "phonetic": "/treɪn/"
  },
  "word_a2b_station": {
    "pos": "danh từ",
    "phonetic": "/ˈsteɪ.ʃən/"
  },
  "word_a2b_platform": {
    "pos": "danh từ",
    "phonetic": "/ˈplæt.fɔːm/"
  },
  "word_a2b_bus": {
    "pos": "danh từ",
    "phonetic": "/bʌs/"
  },
  "word_a2b_subway": {
    "pos": "danh từ",
    "phonetic": "/ˈsʌb.weɪ/"
  },
  "word_a2b_taxi": {
    "pos": "danh từ",
    "phonetic": "/ˈtæksi/"
  },
  "word_a2b_ferry": {
    "pos": "danh từ"
  },
  "word_a2b_ship": {
    "pos": "danh từ"
  },
  "word_a2b_boat": {
    "pos": "danh từ"
  },
  "word_a2b_bicycle": {
    "pos": "danh từ"
  },
  "word_a2b_motorbike": {
    "pos": "danh từ"
  },
  "word_a2b_hotel": {
    "pos": "danh từ"
  },
  "word_a2b_hostel": {
    "pos": "danh từ"
  },
  "word_a2b_booking": {
    "pos": "danh từ"
  },
  "word_a2b_reserve": {
    "pos": "động từ"
  },
  "word_a2b_reception": {
    "pos": "danh từ"
  },
  "word_a2b_checkin": {
    "pos": "danh từ"
  },
  "word_a2b_checkout": {
    "pos": "danh từ"
  },
  "word_a2b_guest": {
    "pos": "danh từ"
  },
  "word_a2b_trip": {
    "pos": "danh từ"
  },
  "word_a2b_holiday": {
    "pos": "danh từ"
  },
  "word_a2b_map": {
    "pos": "danh từ"
  },
  "word_a2b_guide": {
    "pos": "danh từ"
  },
  "word_a2b_destination": {
    "pos": "danh từ"
  },
  "word_a2b_departure": {
    "pos": "danh từ"
  },
  "word_a2b_arrival": {
    "pos": "danh từ"
  },
  "word_a2b_delay": {
    "pos": "danh từ"
  },
  "word_a2b_gate": {
    "pos": "danh từ"
  },
  "word_a2b_seat": {
    "pos": "danh từ"
  },
  "word_a2b_window": {
    "pos": "danh từ"
  },
  "word_a2b_aisle": {
    "pos": "danh từ"
  },
  "word_a2b_pilot": {
    "pos": "danh từ"
  },
  "word_a2b_passenger": {
    "pos": "danh từ"
  },
  "word_a2b_driver": {
    "pos": "danh từ"
  },
  "word_a2b_road": {
    "pos": "danh từ"
  },
  "word_a2b_bridge": {
    "pos": "danh từ"
  },
  "word_a2b_traffic": {
    "pos": "danh từ"
  },
  "word_a2b_petrol": {
    "pos": "danh từ"
  },
  "word_a2b_visa": {
    "pos": "danh từ"
  },
  "word_a2b_abroad": {
    "pos": "trạng từ"
  },
  "word_a2b_football": {
    "pos": "danh từ"
  },
  "word_a2b_basketball": {
    "pos": "danh từ"
  },
  "word_a2b_tennis": {
    "pos": "danh từ"
  },
  "word_a2b_volleyball": {
    "pos": "danh từ"
  },
  "word_a2b_badminton": {
    "pos": "danh từ"
  },
  "word_a2b_running": {
    "pos": "danh từ"
  },
  "word_a2b_cycling": {
    "pos": "danh từ"
  },
  "word_a2b_running_race": {
    "pos": "danh từ"
  },
  "word_a2b_golf": {
    "pos": "danh từ"
  },
  "word_a2b_boxing": {
    "pos": "danh từ"
  },
  "word_a2b_skiing": {
    "pos": "danh từ"
  },
  "word_a2b_skating": {
    "pos": "danh từ"
  },
  "word_a2b_yoga": {
    "pos": "danh từ"
  },
  "word_a2b_gym": {
    "pos": "danh từ"
  },
  "word_a2b_player": {
    "pos": "danh từ"
  },
  "word_a2b_referee": {
    "pos": "danh từ"
  },
  "word_a2b_goal": {
    "pos": "danh từ"
  },
  "word_a2b_score": {
    "pos": "danh từ"
  },
  "word_a2b_win": {
    "pos": "động từ",
    "meaning_vi": "thắng"
  },
  "word_a2b_lose": {
    "pos": "động từ"
  },
  "word_a2b_winner": {
    "pos": "danh từ"
  },
  "word_a2b_champion": {
    "pos": "danh từ"
  },
  "word_a2b_medal": {
    "pos": "danh từ"
  },
  "word_a2b_prize": {
    "pos": "danh từ"
  },
  "word_a2b_field": {
    "pos": "danh từ"
  },
  "word_a2b_court": {
    "pos": "danh từ"
  },
  "word_a2b_pool": {
    "pos": "danh từ"
  },
  "word_a2b_track": {
    "pos": "danh từ"
  },
  "word_a2b_ball": {
    "pos": "danh từ"
  },
  "word_a2b_racket": {
    "pos": "danh từ"
  },
  "word_a2b_net": {
    "pos": "danh từ"
  },
  "word_a2b_helmet": {
    "pos": "danh từ"
  },
  "word_a2b_glove": {
    "pos": "danh từ"
  },
  "word_a2b_whistle": {
    "pos": "danh từ"
  },
  "word_a2b_fan": {
    "pos": "danh từ"
  },
  "word_a2c_subject": {
    "pos": "danh từ"
  },
  "word_a2c_maths": {
    "pos": "danh từ"
  },
  "word_a2c_science": {
    "pos": "danh từ"
  },
  "word_a2c_history": {
    "pos": "danh từ"
  },
  "word_a2c_geography": {
    "pos": "danh từ"
  },
  "word_a2c_english": {
    "pos": "danh từ"
  },
  "word_a2c_art": {
    "pos": "danh từ"
  },
  "word_a2c_music": {
    "pos": "danh từ"
  },
  "word_a2c_student": {
    "pos": "danh từ"
  },
  "word_a2c_classroom": {
    "pos": "danh từ"
  },
  "word_a2c_library": {
    "pos": "danh từ"
  },
  "word_a2c_playground": {
    "pos": "danh từ"
  },
  "word_a2c_blackboard": {
    "pos": "danh từ"
  },
  "word_a2c_desk": {
    "pos": "danh từ"
  },
  "word_a2c_pencil": {
    "pos": "danh từ"
  },
  "word_a2c_pen": {
    "pos": "danh từ"
  },
  "word_a2c_eraser": {
    "pos": "danh từ"
  },
  "word_a2c_ruler": {
    "pos": "danh từ"
  },
  "word_a2c_notebook": {
    "pos": "danh từ"
  },
  "word_a2c_textbook": {
    "pos": "danh từ"
  },
  "word_a2c_bag": {
    "pos": "danh từ"
  },
  "word_a2c_scissors": {
    "pos": "danh từ"
  },
  "word_a2c_glue": {
    "pos": "danh từ"
  },
  "word_a2c_test": {
    "pos": "danh từ"
  },
  "word_a2c_grade": {
    "pos": "danh từ"
  },
  "word_a2c_break": {
    "pos": "danh từ"
  },
  "word_a2c_question": {
    "pos": "danh từ"
  },
  "word_a2c_answer": {
    "pos": "danh từ"
  },
  "word_a2c_mistake": {
    "pos": "danh từ"
  },
  "word_a2c_study": {
    "pos": "động từ"
  },
  "word_a2c_learn": {
    "pos": "động từ"
  },
  "word_a2c_happy": {
    "pos": "tính từ"
  },
  "word_a2c_sad": {
    "pos": "tính từ"
  },
  "word_a2c_angry": {
    "pos": "tính từ"
  },
  "word_a2c_afraid": {
    "pos": "tính từ"
  },
  "word_a2c_scared": {
    "pos": "tính từ"
  },
  "word_a2c_tired": {
    "pos": "tính từ"
  },
  "word_a2c_worried": {
    "pos": "tính từ"
  },
  "word_a2c_calm": {
    "pos": "tính từ"
  },
  "word_a2c_glad": {
    "pos": "tính từ"
  },
  "word_a2c_confident": {
    "pos": "tính từ"
  },
  "word_a2c_shy": {
    "pos": "tính từ"
  },
  "word_a2c_jealous": {
    "pos": "tính từ"
  },
  "word_a2c_relaxed": {
    "pos": "tính từ"
  },
  "word_a2c_feeling": {
    "pos": "danh từ"
  },
  "word_a2c_smile": {
    "pos": "danh từ"
  },
  "word_a2c_laugh": {
    "pos": "động từ"
  },
  "word_a2c_cry": {
    "pos": "động từ"
  },
  "word_a2c_head": {
    "pos": "danh từ"
  },
  "word_a2c_stomach": {
    "pos": "danh từ"
  },
  "word_kids6_ostrich": {
    "pos": "danh từ"
  },
  "word_kids6_flamingo": {
    "pos": "danh từ"
  },
  "word_kids6_robin": {
    "pos": "danh từ"
  },
  "word_kids6_lizard": {
    "pos": "danh từ"
  },
  "word_kids6_crocodile": {
    "pos": "danh từ"
  },
  "word_kids6_gecko": {
    "pos": "danh từ"
  },
  "word_kids6_chameleon": {
    "pos": "danh từ"
  },
  "word_kids6_iguana": {
    "pos": "danh từ"
  },
  "word_kids6_tortoise": {
    "pos": "danh từ"
  },
  "word_kids6_alligator": {
    "pos": "danh từ"
  },
  "word_kids6_dinosaur": {
    "pos": "danh từ"
  },
  "word_kids6_trex": {
    "pos": "danh từ"
  },
  "word_kids6_stegosaurus": {
    "pos": "danh từ"
  },
  "word_kids6_triceratops": {
    "pos": "danh từ"
  },
  "word_kids6_brontosaurus": {
    "pos": "danh từ"
  },
  "word_kids6_pterodactyl": {
    "pos": "danh từ"
  },
  "word_kids6_velociraptor": {
    "pos": "danh từ"
  },
  "word_kids6_fossil": {
    "pos": "danh từ"
  },
  "word_kids6_hamster": {
    "pos": "danh từ"
  },
  "word_kids6_goldfish": {
    "pos": "danh từ"
  },
  "word_kids6_guineapig": {
    "pos": "danh từ"
  },
  "word_kids6_kitten": {
    "pos": "danh từ"
  },
  "word_kids6_puppy": {
    "pos": "danh từ"
  },
  "word_kids6_cage": {
    "pos": "danh từ"
  },
  "word_kids6_leash": {
    "pos": "danh từ"
  },
  "word_kids6_paw": {
    "pos": "danh từ"
  },
  "word_kids6_bathtub": {
    "pos": "danh từ"
  },
  "word_kids6_sink": {
    "pos": "danh từ"
  },
  "word_kids6_faucet": {
    "pos": "danh từ"
  },
  "word_kids6_shampoo": {
    "pos": "danh từ"
  },
  "word_kids6_comb": {
    "pos": "danh từ"
  },
  "word_kids6_toilet": {
    "pos": "danh từ"
  },
  "word_kids6_sponge": {
    "pos": "danh từ"
  },
  "word_kids6_oven": {
    "pos": "danh từ"
  },
  "word_kids6_stove": {
    "pos": "danh từ"
  },
  "word_kids6_kettle": {
    "pos": "danh từ"
  },
  "word_kids6_napkin": {
    "pos": "danh từ"
  },
  "word_kids6_apron": {
    "pos": "danh từ"
  },
  "word_kids6_blender": {
    "pos": "danh từ"
  },
  "word_kids6_toaster": {
    "pos": "danh từ"
  },
  "word_a2e_cook": {
    "pos": "động từ"
  },
  "word_a2f_floor": {
    "pos": "danh từ"
  },
  "word_a2g_menu": {
    "pos": "danh từ"
  },
  "word_a2g_boil": {
    "pos": "động từ"
  },
  "word_a2g_fry": {
    "pos": "động từ"
  },
  "word_a2g_bake": {
    "pos": "động từ"
  },
  "word_a2g_knife": {
    "pos": "danh từ"
  },
  "word_b1d_donate": {
    "pos": "động từ"
  },
  "word_b1d_homeless": {
    "pos": "tính từ"
  },
  "word_b1d_neighbourhood": {
    "pos": "danh từ"
  },
  "word_b1d_public": {
    "pos": "tính từ"
  },
  "word_b1d_society_member": {
    "pos": "danh từ"
  },
  "word_b1d_support": {
    "pos": "danh từ"
  },
  "word_b1d_cooperate": {
    "pos": "động từ"
  },
  "word_b1d_inequality": {
    "pos": "danh từ"
  },
  "word_b1d_celebrate": {
    "pos": "động từ"
  },
  "word_b1d_festival": {
    "pos": "danh từ"
  },
  "word_b1d_diversity": {
    "pos": "danh từ"
  },
  "word_b1d_tourist": {
    "pos": "danh từ"
  },
  "word_b1d_flight": {
    "pos": "danh từ"
  },
  "word_b1d_airport": {
    "pos": "danh từ"
  },
  "word_b1d_accommodation": {
    "pos": "danh từ"
  },
  "word_b1d_reservation": {
    "pos": "danh từ"
  },
  "word_b1d_guide": {
    "pos": "danh từ"
  },
  "word_b1d_itinerary": {
    "pos": "danh từ"
  },
  "word_b1d_explore": {
    "pos": "động từ"
  },
  "word_b1d_adventure": {
    "pos": "danh từ"
  },
  "word_b2e_welfare_state": {
    "pos": "danh từ"
  },
  "word_b2e_taxpayer": {
    "pos": "danh từ"
  },
  "word_b2e_protest": {
    "pos": "danh từ"
  },
  "word_b2e_campaign": {
    "pos": "danh từ"
  },
  "word_b2e_awareness": {
    "pos": "danh từ"
  },
  "word_b2e_solidarity_social": {
    "pos": "danh từ"
  },
  "word_b2e_conflict": {
    "pos": "danh từ"
  },
  "word_b2e_integration_social": {
    "pos": "danh từ"
  },
  "word_b2e_minority": {
    "pos": "danh từ"
  },
  "word_b2e_majority": {
    "pos": "danh từ"
  },
  "word_b2e_gap": {
    "pos": "danh từ"
  },
  "word_b2e_norm_social": {
    "pos": "danh từ"
  },
  "word_b2e_inclusion": {
    "pos": "danh từ"
  },
  "word_b2f_advancement": {
    "pos": "danh từ"
  },
  "word_b2f_raise": {
    "pos": "danh từ"
  },
  "word_b2f_bonus": {
    "pos": "danh từ"
  },
  "word_b2f_appraise": {
    "pos": "động từ"
  },
  "word_b2f_feedback": {
    "pos": "danh từ"
  },
  "word_b2f_recruit": {
    "pos": "động từ"
  },
  "word_b2f_candidate": {
    "pos": "danh từ"
  },
  "word_c1d_ecosystem": {
    "pos": "danh từ"
  },
  "word_c1f_analysis": {
    "pos": "danh từ"
  },
  "word_c1f_variable": {
    "pos": "danh từ"
  },
  "word_c1f_synthesis": {
    "pos": "danh từ"
  },
  "word_c1f_molecule": {
    "pos": "danh từ"
  },
  "word_c1f_organism": {
    "pos": "danh từ"
  },
  "word_c1f_evolution": {
    "pos": "danh từ"
  },
  "word_c1f_radiation": {
    "pos": "danh từ"
  },
  "word_c1f_density": {
    "pos": "danh từ"
  },
  "word_c1f_inference": {
    "pos": "danh từ"
  },
  "word_c1f_replicate": {
    "pos": "động từ"
  },
  "word_c1f_validity": {
    "pos": "danh từ"
  },
  "word_c1f_isolate": {
    "pos": "động từ"
  },
  "word_c1f_simulation": {
    "pos": "danh từ"
  },
  "word_c1f_decompose": {
    "pos": "động từ"
  },
  "word_c1f_microbe": {
    "pos": "danh từ"
  },
  "word_c1f_photosynthesis": {
    "pos": "danh từ"
  },
  "word_c1f_aquatic": {
    "pos": "tính từ"
  },
  "word_c1f_terrestrial": {
    "pos": "tính từ"
  },
  "word_c1f_dormant": {
    "pos": "tính từ"
  },
  "word_c1f_accumulate": {
    "pos": "động từ"
  },
  "word_c1g_acculturation": {
    "pos": "danh từ"
  },
  "word_c1g_ethnicity": {
    "pos": "danh từ"
  },
  "word_c1g_multiculturalism": {
    "pos": "danh từ"
  },
  "word_c1g_cosmopolitan": {
    "pos": "tính từ"
  },
  "word_c1g_ancestral": {
    "pos": "tính từ"
  },
  "word_c1g_vernacular": {
    "pos": "danh từ"
  },
  "word_c1g_dialect": {
    "pos": "danh từ"
  },
  "word_c1g_linguistic": {
    "pos": "tính từ"
  },
  "word_c1g_folklore": {
    "pos": "danh từ"
  },
  "word_c1g_artisan": {
    "pos": "danh từ"
  },
  "word_c1g_craftsmanship": {
    "pos": "danh từ"
  },
  "word_c1g_monument": {
    "pos": "danh từ"
  },
  "word_c1g_artefactual": {
    "pos": "tính từ"
  },
  "word_c1g_antiquity": {
    "pos": "danh từ"
  },
  "word_c1g_aesthetics": {
    "pos": "danh từ"
  },
  "word_c1g_iconography": {
    "pos": "danh từ"
  },
  "word_c1g_symbolism": {
    "pos": "danh từ"
  },
  "word_c1g_repertoire": {
    "pos": "danh từ"
  },
  "word_c1g_renaissance": {
    "pos": "danh từ"
  },
  "word_c1g_canonical": {
    "pos": "tính từ"
  },
  "word_c1g_oeuvre": {
    "pos": "danh từ"
  },
  "word_c1g_provenance": {
    "pos": "danh từ"
  },
  "word_c1g_custodian": {
    "pos": "danh từ"
  },
  "word_c1g_commemorate": {
    "pos": "động từ"
  },
  "word_c1g_secularism": {
    "pos": "danh từ"
  },
  "word_c1g_doctrine": {
    "pos": "danh từ"
  },
  "word_c1g_devout": {
    "pos": "tính từ"
  },
  "word_c1g_pilgrimage": {
    "pos": "danh từ"
  },
  "word_c1g_kinship": {
    "pos": "danh từ"
  },
  "word_c1g_communal": {
    "pos": "tính từ"
  },
  "word_c1i_retention": {
    "pos": "danh từ"
  },
  "word_c1i_benchmark": {
    "pos": "danh từ"
  }
};
