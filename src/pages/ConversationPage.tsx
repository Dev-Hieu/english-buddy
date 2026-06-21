import { Check, ChevronRight, Loader2, Mic, Send, Sparkles, Square, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CHAT_SCENARIOS } from "@/data/chatScenarios";
import { getChatStatus, sendChat } from "@/services/chatService";
import { speakText } from "@/services/speechService";
import { translateToVi } from "@/services/translateService";
import type { ChatMessage, ChatScenario, Student } from "@/types";
import { Button } from "@/components/ui/button";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { avatarEmoji } from "@/components/ui/emoji";
import { cn } from "@/components/ui/cn";

interface ConversationPageProps {
  student: Student;
  onBackHome: () => void;
}

// Tách phần tiếng Anh (đọc được) và dòng gợi ý "💡" (tiếng Việt) trong câu của bot.
function splitReply(text: string): { en: string; hint: string } {
  const idx = text.indexOf("💡");
  if (idx === -1) return { en: text.trim(), hint: "" };
  return { en: text.slice(0, idx).trim(), hint: text.slice(idx).trim() };
}

// Avatar tròn cho nhân vật trò chuyện (bot) và người học.
function Avatar({ emoji }: { emoji: string }) {
  return <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xl shadow-card">{emoji}</span>;
}

// 1 bong bóng chat: bấm vào câu -> dịch tiếng Việt để tra cứu.
function Bubble({ m, botAvatar, userAvatar }: { m: ChatMessage; botAvatar: string; userAvatar: string }) {
  const [vi, setVi] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isUser = m.role === "user";
  const { en, hint } = isUser ? { en: m.content, hint: "" } : splitReply(m.content);

  const toggle = async () => {
    if (vi !== null) { setVi(null); return; } // bấm lần nữa -> ẩn
    setLoading(true);
    try { setVi(await translateToVi(en)); }
    catch { setVi("Chưa dịch được, thử lại sau."); }
    finally { setLoading(false); }
  };

  if (isUser) {
    return (
      <div className="flex items-end justify-end gap-2">
        <div className="max-w-[78%]">
          <button type="button" onClick={toggle} className="block w-full rounded-2xl rounded-br-md bg-primary px-4 py-2 text-left font-bold text-primary-foreground transition active:scale-[0.99]">{en}</button>
          {loading ? <p className="px-2 pt-1 text-right text-xs font-semibold text-muted-foreground">Đang dịch…</p> : null}
          {vi ? <p className="px-2 pt-1 text-right text-sm font-semibold text-accent">🇻🇳 {vi}</p> : null}
        </div>
        <Avatar emoji={userAvatar} />
      </div>
    );
  }
  return (
    <div className="flex items-end justify-start gap-2">
      <Avatar emoji={botAvatar} />
      <div className="max-w-[80%]">
        <div className="flex items-start gap-2 rounded-2xl rounded-bl-md bg-card px-4 py-2 font-bold shadow-card">
          <button type="button" onClick={toggle} className="flex-1 text-left transition active:scale-[0.99]">{en}</button>
          <button type="button" aria-label="Nghe" onClick={() => speakText(en)} className="mt-0.5 shrink-0 text-muted-foreground"><Volume2 className="h-4 w-4" /></button>
        </div>
        {hint ? <p className="px-2 pt-0.5 text-sm font-semibold text-accent">{hint}</p> : null}
        {loading ? <p className="px-2 pt-1 text-xs font-semibold text-muted-foreground">Đang dịch…</p> : null}
        {vi ? <p className="px-2 pt-1 text-sm font-semibold text-accent">🇻🇳 {vi}</p> : null}
      </div>
    </div>
  );
}

function Bubbles({ messages, botAvatar, userAvatar }: { messages: ChatMessage[]; botAvatar: string; userAvatar: string }) {
  return <>{messages.map((m, i) => <Bubble key={i} m={m} botAvatar={botAvatar} userAvatar={userAvatar} />)}</>;
}

// Web Speech API: nhận diện giọng nói → text
const SpeechRecognition = typeof window !== "undefined"
  ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  : null;
const canVoice = !!SpeechRecognition;

export function ConversationPage({ student, onBackHome }: ConversationPageProps) {
  const [aiEnabled, setAiEnabled] = useState<boolean | null>(null);
  const [scenario, setScenario] = useState<ChatScenario | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  // AI mode
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Voice
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [autoSpeak, setAutoSpeak] = useState(true);
  const recogRef = useRef<any>(null);
  // Script mode
  const [stepIndex, setStepIndex] = useState(0);
  const [wrong, setWrong] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { getChatStatus().then((s) => setAiEnabled(s.enabled)).catch(() => setAiEnabled(false)); }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const start = (s: ChatScenario) => {
    setScenario(s);
    setMessages([{ role: "assistant", content: s.opening_en }]);
    setStepIndex(0); setError(""); setWrong(null); setInput("");
    // Đọc câu mở đầu
    const { en } = splitReply(s.opening_en);
    if (en && autoSpeak) speakText(en);
  };
  const backToMenu = () => { setScenario(null); setMessages([]); };

  // Voice: bắt đầu nghe
  const startListening = () => {
    if (!SpeechRecognition || listening) return;
    const recog = new SpeechRecognition();
    recog.lang = "en-US";
    recog.interimResults = true;
    recog.continuous = false;
    recog.maxAlternatives = 1;
    recog.onresult = (e: any) => {
      let final = "", inter = "";
      for (let i = 0; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t; else inter += t;
      }
      if (final) { setInput(final); setInterim(""); }
      else setInterim(inter);
    };
    recog.onend = () => setListening(false);
    recog.onerror = () => setListening(false);
    recogRef.current = recog;
    recog.start();
    setListening(true);
    setInterim("");
  };

  const stopListening = () => {
    if (recogRef.current) { recogRef.current.stop(); recogRef.current = null; }
    setListening(false);
  };

  // AI: gửi tin nhắn tự do (text hoặc voice).
  const send = async (voiceText?: string) => {
    const text = (voiceText || input).trim();
    if (!text || loading || !scenario) return;
    setInput(""); setInterim("");
    const next: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next); setLoading(true); setError("");
    try {
      const { reply } = await sendChat(next, student.level, scenario.prompt);
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
      // Auto đọc câu trả lời của AI
      if (autoSpeak) {
        const { en } = splitReply(reply);
        if (en) speakText(en);
      }
    } catch {
      setError("Chưa gọi được trợ lý AI. Kiểm tra DEEPSEEK_API_KEY trong server/.env.");
    } finally { setLoading(false); }
  };

  // Voice: khi stop listening và có text → gửi luôn
  useEffect(() => {
    if (!listening && input.trim() && recogRef.current === null) {
      // Vừa stop voice → gửi tự động
    }
  }, [listening]); // eslint-disable-line

  // Kịch bản: chọn câu trả lời đúng.
  const step = scenario?.steps[stepIndex];
  const scriptDone = scenario ? stepIndex >= scenario.steps.length : false;
  const pick = (en: string) => {
    if (!step) return;
    if (en !== step.answer) { setWrong(en); setTimeout(() => setWrong(null), 600); return; }
    setMessages((m) => [...m, { role: "user", content: en }, { role: "assistant", content: step.bot_en }]);
    setStepIndex((i) => i + 1);
  };

  // ── Menu ──
  if (!scenario) {
    return (
      <main className="mx-auto w-full max-w-2xl px-4 pt-6">
        <SessionHeader title="Luyện hội thoại" onClose={onBackHome} />
        <p className="mb-4 text-sm font-semibold text-muted-foreground">
          {aiEnabled
            ? "Trò chuyện tự do bằng tiếng Anh với trợ lý AI — sẽ nhẹ nhàng sửa lỗi câu cho con."
            : "Chọn câu trả lời đúng để hoàn thành đoạn hội thoại theo tình huống."}
        </p>
        <section className="space-y-3">
          {CHAT_SCENARIOS.map((s) => (
            <button key={s.id} type="button" onClick={() => start(s)}
              className="flex w-full items-center gap-4 rounded-3xl border border-border/70 bg-card p-4 text-left shadow-card transition-transform active:scale-[0.99]">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-2xl">{s.emoji}</span>
              <span className="flex-1 text-lg font-extrabold">{s.title_vi}</span>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          ))}
        </section>
        {aiEnabled ? <p className="mt-4 flex items-center justify-center gap-1 text-xs font-bold text-success"><Sparkles className="h-3.5 w-3.5" /> Chế độ AI (DeepSeek) đang bật</p> : null}
      </main>
    );
  }

  return (
    <main className="mx-auto flex h-[100dvh] w-full max-w-2xl flex-col px-4">
      <SessionHeader title={`${scenario.emoji} ${scenario.title_vi}`} onClose={backToMenu} />

      <p className="pb-1 text-center text-xs font-semibold text-muted-foreground">💬 Mẹo: bấm vào câu để xem nghĩa tiếng Việt</p>
      <div className="flex-1 space-y-3 overflow-y-auto pb-3">
        <Bubbles messages={messages} botAvatar={scenario.emoji} userAvatar={avatarEmoji(student.avatar)} />
        {loading ? <div className="flex justify-start"><div className="rounded-2xl bg-card px-4 py-2 shadow-card"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div></div> : null}
        {error ? <p className="text-center text-sm font-bold text-red-600">{error}</p> : null}
        <div ref={endRef} />
      </div>

      {/* AI mode: ô nhập tự do + voice */}
      {aiEnabled ? (
        <div className="border-t border-border bg-background py-3">
          {/* Interim text khi đang nghe */}
          {listening && interim && (
            <p className="mb-1.5 px-2 text-sm font-semibold text-muted-foreground italic">🎤 {interim}</p>
          )}
          <div className="flex items-center gap-2">
            {/* Nút mic */}
            {canVoice && (
              <button
                type="button"
                onClick={listening ? stopListening : startListening}
                disabled={loading}
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-all",
                  listening ? "animate-pulse bg-red-500 text-white" : "bg-secondary text-secondary-foreground hover:bg-primary/15"
                )}
                title={listening ? "Dừng nghe" : "Nói tiếng Anh"}
              >
                {listening ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
            )}
            <input
              className="h-12 flex-1 rounded-2xl border-2 border-border px-4 font-bold outline-none focus:border-primary"
              placeholder={listening ? "Đang nghe..." : "Gõ hoặc nói tiếng Anh..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              disabled={listening}
            />
            <Button type="button" size="icon" disabled={!input.trim() || loading || listening} onClick={() => send()}>
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
          {/* Toggle auto-speak */}
          <button type="button" onClick={() => setAutoSpeak(!autoSpeak)}
            className="mt-1.5 flex items-center gap-1 px-2 text-[11px] font-bold text-muted-foreground hover:text-foreground">
            <Volume2 className="h-3 w-3" /> Tự đọc câu trả lời: {autoSpeak ? "Bật" : "Tắt"}
          </button>
        </div>
      ) : scriptDone ? (
        <div className="border-t border-border bg-background py-4 text-center">
          <p className="mb-3 flex items-center justify-center gap-2 text-lg font-extrabold text-success"><Check className="h-5 w-5" /> Hoàn thành hội thoại!</p>
          <Button type="button" className="w-full" onClick={backToMenu}>Chọn tình huống khác</Button>
        </div>
      ) : (
        <div className="space-y-2 border-t border-border bg-background py-3">
          <p className="text-center text-xs font-bold text-muted-foreground">Chọn câu trả lời:</p>
          {step?.options.map((opt) => (
            <button key={opt.en} type="button" onClick={() => pick(opt.en)}
              className={cn("w-full rounded-2xl border-2 px-4 py-3 text-left font-bold transition-colors",
                wrong === opt.en ? "border-red-400 bg-red-50" : "border-border hover:border-primary")}>
              <span className="block">{opt.en}</span>
              <span className="block text-xs font-semibold text-muted-foreground">{opt.vi}</span>
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
