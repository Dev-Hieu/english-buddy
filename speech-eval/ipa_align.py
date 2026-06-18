"""Tách chuỗi IPA thành từng âm và so khớp âm dự đoán với âm chuẩn (chấm từng âm)."""

# Các ký hiệu IPA nhiều ký tự (nguyên âm đôi, phụ âm ghép) — tách tham lam theo độ dài.
MULTI = [
    "tʃ", "dʒ", "aɪ", "eɪ", "ɔɪ", "aʊ", "oʊ", "əʊ", "ɪə", "eə", "ʊə", "ɛə",
]
# Bỏ các dấu không phải âm: phân cách, nhấn, dài, ngoặc.
STRIP = set("/[]ˈˌ.ː‿ '\"()")

# Nhóm âm tương đương (chấp nhận lệch nhỏ giữa model và IPA chuẩn -> vẫn tính đúng).
EQUIV = [
    {"r", "ɹ"}, {"g", "ɡ"}, {"e", "ɛ"}, {"o", "ɔ", "ɒ"}, {"a", "ɑ", "ʌ", "ə"},
    {"i", "ɪ", "iː"}, {"u", "ʊ", "uː"}, {"y", "j"}, {"ɝ", "ɜ", "ər"}, {"ɾ", "t", "d"},
]


def _strip(s: str) -> str:
    return "".join(c for c in s if c not in STRIP)


def tokenize_ipa(ipa: str) -> list[str]:
    s = _strip(ipa.strip().lower())
    out, i = [], 0
    while i < len(s):
        two = s[i : i + 2]
        if two in MULTI:
            out.append(two)
            i += 2
        else:
            out.append(s[i])
            i += 1
    return [p for p in out if p.strip()]


def _same(a: str, b: str) -> bool:
    if a == b:
        return True
    for g in EQUIV:
        if a in g and b in g:
            return True
    return False


def align_score(expected: list[str], predicted: list[str]) -> dict:
    """Needleman-Wunsch: gán mỗi âm CHUẨN là đúng (khớp) hay sai (thay/thiếu)."""
    n, m = len(expected), len(predicted)
    if n == 0:
        return {"score": 0, "phones": [], "heard": " ".join(predicted)}

    INF = float("inf")
    dp = [[0.0] * (m + 1) for _ in range(n + 1)]
    bt = [[""] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        dp[i][0] = i
        bt[i][0] = "del"
    for j in range(1, m + 1):
        dp[0][j] = j
        bt[0][j] = "ins"
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            cost = 0 if _same(expected[i - 1], predicted[j - 1]) else 1
            diag, up, left = dp[i - 1][j - 1] + cost, dp[i - 1][j] + 1, dp[i][j - 1] + 1
            best = min(diag, up, left)
            dp[i][j] = best
            bt[i][j] = "match" if best == diag else ("del" if best == up else "ins")

    # Backtrace -> đánh dấu đúng/sai cho từng âm chuẩn.
    ok = [False] * n
    i, j = n, m
    while i > 0 or j > 0:
        step = bt[i][j] if (i > 0 and j > 0) else ("del" if j == 0 else "ins")
        if step == "match":
            ok[i - 1] = _same(expected[i - 1], predicted[j - 1])
            i, j = i - 1, j - 1
        elif step == "del":
            i -= 1
        else:
            j -= 1

    correct = sum(1 for x in ok if x)
    phones = [{"ipa": expected[k], "ok": ok[k]} for k in range(n)]
    return {
        "score": round(correct / n * 100),
        "phones": phones,
        "heard": " ".join(predicted),
    }
