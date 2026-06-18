import { ArrowRight, Mic, PartyPopper, ThumbsUp, Volume2 } from "lucide-react";
import { useMemo, useState } from "react";
import { SEED_TOPICS } from "@/data/seedTopics";
import { SEED_VOCABULARY } from "@/data/seedVocabulary";
import type { Student } from "@/types";
import { speakText } from "@/services/speechService";
import { isRecognitionSupported, listenOnce } from "@/services/speechRecognitionService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/components/ui/cn";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { pickWords } from "@/components/games/wordRotation";

interface SpeakingPageProps {
  student: Student;
  topicId: string;
  onBackHome: () => void;
}

type Verdict = "correct" | "near" | "wrong";
type Status = "idle" | "listening" | "result";

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z\s]/g, "").trim();

function lev(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length][b.length];
}

function judge(target: string, heard: string[]): Verdict {
  const t = normalize(target);
  const alts = heard.map(normalize);
  if (alts.some((a) => a === t)) return "correct";
  const tol = t.length > 5 ? 2 : 1;
  if (alts.some((a) => a.split(/\s+/).includes(t) || a.includes(t) || lev(a, t) <= tol)) return "near";
  return "wrong";
}

// App chỉ tự chấm phát âm khi có nhận giọng + ngữ cảnh bảo mật (HTTPS/localhost).
const CAN_RECOGNIZE =
  typeof window !== "undefined" && isRecognitionSupported() && window.isSecureContext;

export function SpeakingPage({ topicId, onBackHome }: SpeakingPageProps) {
  const topic = SEED_TOPICS.find((t) => t.id === topicId);
  const words = useMemo(() => {
    const t = SEED_VOCABULARY.filter((w) => w.topicIds.includes(topicId) && !w.word.includes(" "));
    return pickWords(t.length >= 1 ? t : SEED_VOCABULARY, 8);
  }, [topicId]);

  const [n, setN] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [heard, setHeard] = useState("");
  const [good, setGood] = useState(0);
  const [done, setDone] = useState(false);

  const word = words[n];

  if (!word) {
    return (
      <>
        <SessionHeader title="Luyện nói" onClose={onBackHome} />
        <Card><CardContent className="p-8 text-center font-bold text-muted-foreground">Chủ đề này chưa có từ để luyện.</CardContent></Card>
      </>
    );
  }

  if (done) {
    return (
      <>
        <SessionHeader title="Luyện nói" onClose={onBackHome} />
        <Card className="animate-pop">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <PartyPopper className="h-14 w-14 text-accent" />
            <p className="text-2xl font-black text-primary">
              {CAN_RECOGNIZE ? `Đọc đúng ${good}/${words.length} từ! 🎉` : `Đã luyện ${words.length} từ! 🎉`}
            </p>
            <Button type="button" size="lg" className="w-full" onClick={onBackHome}>Xong</Button>
          </CardContent>
        </Card>
      </>
    );
  }

  const next = () => {
    if (n + 1 >= words.length) setDone(true);
    else { setN((x) => x + 1); setStatus("idle"); setVerdict(null); setHeard(""); }
  };

  const record = async () => {
    setStatus("listening");
    setVerdict(null);
    setHeard("");
    try {
      const alts = await listenOnce("en-US");
      const v = judge(word.word, alts);
      setHeard(alts[0] || "");
      setVerdict(v);
      if (v === "correct") setGood((g) => g + 1);
    } catch {
      setVerdict("wrong");
      setHeard("");
    } finally {
      setStatus("result");
    }
  };

  const feedback = {
    correct: { text: "Tuyệt vời! Phát âm chuẩn 🎉", cls: "text-success" },
    near: { text: "Gần đúng rồi, thử lại cho rõ hơn nhé", cls: "text-warning" },
    wrong: { text: "Chưa đúng — nghe mẫu rồi đọc lại nào", cls: "text-red-500" },
  };

  return (
    <>
      <SessionHeader title={`Luyện nói${topic ? " · " + topic.name : ""}`} onClose={onBackHome} progress={Math.round((n / words.length) * 100)} />
      <p className="mb-3 text-center text-sm font-extrabold text-muted-foreground">Từ {n + 1} / {words.length}</p>

      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
          {word.imageUrl ? <img src={word.imageUrl} alt="" className="h-40 w-full rounded-2xl object-cover" /> : null}
          <h2 className="text-4xl font-black capitalize">{word.word}</h2>
          {word.phonetic ? <p className="font-bold text-muted-foreground">{word.phonetic}</p> : null}
          <Button type="button" variant="outline" size="lg" onClick={() => speakText(word.word, word.audioUrl)}>
            <Volume2 className="h-5 w-5" /> Nghe mẫu
          </Button>

          {CAN_RECOGNIZE ? (
            <>
              <button
                type="button"
                onClick={record}
                disabled={status === "listening"}
                className={cn(
                  "mt-2 flex h-20 w-20 items-center justify-center rounded-full text-white shadow-card transition-all active:translate-y-[2px]",
                  status === "listening" ? "animate-pulse bg-red-500" : "bg-primary hover:brightness-105",
                )}
                aria-label="Bấm để nói"
              >
                <Mic className="h-9 w-9" strokeWidth={2.5} />
              </button>
              <p className="text-sm font-bold text-muted-foreground">
                {status === "listening" ? "Đang nghe... đọc to từ trên nhé!" : "Bấm micro rồi đọc to từ"}
              </p>

              {status === "result" && verdict ? (
                <div className="w-full space-y-2 rounded-2xl bg-muted p-4">
                  <p className={cn("text-lg font-black", feedback[verdict].cls)}>{feedback[verdict].text}</p>
                  {heard ? <p className="text-sm font-semibold text-muted-foreground">App nghe được: “{heard}”</p> : null}
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" className="flex-1" onClick={record}><Mic className="h-5 w-5" /> Đọc lại</Button>
                    <Button type="button" className="flex-1" onClick={next}>{n + 1 >= words.length ? "Xong" : (<>Từ tiếp <ArrowRight className="h-5 w-5" /></>)}</Button>
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            // Chế độ Nghe & nhắc lại (máy không tự chấm được): bé đọc theo rồi tự đánh giá.
            <div className="w-full space-y-3">
              <p className="rounded-2xl bg-muted p-3 text-sm font-bold text-muted-foreground">
                🔊 Nghe mẫu rồi đọc to theo nhé. (Thiết bị này chưa tự chấm phát âm được — xem ghi chú dưới.)
              </p>
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => speakText(word.word, word.audioUrl)}>
                  <Volume2 className="h-5 w-5" /> Nghe lại
                </Button>
                <Button type="button" className="flex-1" onClick={next}>
                  <ThumbsUp className="h-5 w-5" /> {n + 1 >= words.length ? "Xong" : "Con đọc được"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {!CAN_RECOGNIZE ? (
        <p className="mt-3 text-center text-xs font-semibold text-muted-foreground">
          Để app tự chấm phát âm: mở trên <b>máy tính (Chrome)</b> hoặc bản <b>HTTPS</b>. Trình duyệt di động qua HTTP không cho dùng micro.
        </p>
      ) : null}
    </>
  );
}
