import { Check, ChevronRight, Loader2, Send, Sparkles, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CHAT_SCENARIOS } from "@/data/chatScenarios";
import { getChatStatus, sendChat } from "@/services/chatService";
import { speakText } from "@/services/speechService";
import type { ChatMessage, ChatScenario, Student } from "@/types";
import { Button } from "@/components/ui/button";
import { SessionHeader } from "@/components/layout/SessionHeader";
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

function Bubbles({ messages }: { messages: ChatMessage[] }) {
  return (
    <>
      {messages.map((m, i) => {
        if (m.role === "user") {
          return (
            <div key={i} className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-br-md bg-primary px-4 py-2 font-bold text-primary-foreground">{m.content}</div>
            </div>
          );
        }
        const { en, hint } = splitReply(m.content);
        return (
          <div key={i} className="flex justify-start">
            <div className="max-w-[85%] space-y-1">
              <div className="flex items-start gap-2 rounded-2xl rounded-bl-md bg-card px-4 py-2 font-bold shadow-card">
                <span className="flex-1">{en}</span>
                <button type="button" aria-label="Nghe" onClick={() => speakText(en)} className="mt-0.5 shrink-0 text-muted-foreground"><Volume2 className="h-4 w-4" /></button>
              </div>
              {hint ? <p className="px-2 text-sm font-semibold text-accent">{hint}</p> : null}
            </div>
          </div>
        );
      })}
    </>
  );
}

export function ConversationPage({ student, onBackHome }: ConversationPageProps) {
  const [aiEnabled, setAiEnabled] = useState<boolean | null>(null);
  const [scenario, setScenario] = useState<ChatScenario | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  // AI mode
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
  };
  const backToMenu = () => { setScenario(null); setMessages([]); };

  // AI: gửi tin nhắn tự do.
  const send = async () => {
    const text = input.trim();
    if (!text || loading || !scenario) return;
    setInput(""); // xoá ô nhập NGAY để gõ đoạn tiếp theo
    const next: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next); setLoading(true); setError("");
    try {
      const { reply } = await sendChat(next, student.level, scenario.prompt);
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setError("Chưa gọi được trợ lý AI. Kiểm tra DEEPSEEK_API_KEY trong server/.env.");
    } finally { setLoading(false); }
  };

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

      <div className="flex-1 space-y-3 overflow-y-auto pb-3">
        <Bubbles messages={messages} />
        {loading ? <div className="flex justify-start"><div className="rounded-2xl bg-card px-4 py-2 shadow-card"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div></div> : null}
        {error ? <p className="text-center text-sm font-bold text-red-600">{error}</p> : null}
        <div ref={endRef} />
      </div>

      {/* AI mode: ô nhập tự do */}
      {aiEnabled ? (
        <div className="flex items-center gap-2 border-t border-border bg-background py-3">
          <input
            className="h-12 flex-1 rounded-2xl border-2 border-border px-4 font-bold outline-none focus:border-primary"
            placeholder="Trả lời bằng tiếng Anh..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <Button type="button" size="icon" disabled={!input.trim() || loading} onClick={send}><Send className="h-5 w-5" /></Button>
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
