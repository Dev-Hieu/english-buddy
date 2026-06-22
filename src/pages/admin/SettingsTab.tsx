import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { resetScores, type ResetOptions } from "@/services/studentService";
import { apiRequest } from "@/services/api";

function ConfigRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="text-sm font-bold text-muted-foreground">{label}</span>
      <span className="text-sm font-extrabold">{value}</span>
    </div>
  );
}

export function SettingsTab() {
  const [deepseekConfigured, setDeepseekConfigured] = useState<boolean | null>(null);

  // Reset state
  const [resetXp, setResetXp] = useState(false);
  const [resetStreak, setResetStreak] = useState(false);
  const [resetProgress, setResetProgress] = useState(false);
  const [resetQuiz, setResetQuiz] = useState(false);
  const [resetLookups, setResetLookups] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetMsg, setResetMsg] = useState("");

  const [defaultGoal, setDefaultGoal] = useState("5");

  useEffect(() => {
    apiRequest<{ configured: boolean }>("/api/chat/status")
      .then((d) => setDeepseekConfigured(d.configured))
      .catch(() => setDeepseekConfigured(false));
  }, []);

  async function handleReset() {
    const opts: ResetOptions = {
      xp: resetXp,
      streak: resetStreak,
      progress: resetProgress,
      quiz: resetQuiz,
      lookups: resetLookups,
    };
    if (!Object.values(opts).some(Boolean)) {
      setResetMsg("Chọn ít nhất một mục cần reset.");
      return;
    }
    if (!confirm("Bạn chắc chắn muốn reset dữ liệu? Hành động này không thể hoàn tác.")) return;
    setResetting(true);
    setResetMsg("");
    try {
      const result = await resetScores(opts);
      setResetMsg(result.ok ? `Đã reset: ${result.done.join(", ")}` : "Lỗi khi reset.");
    } catch {
      setResetMsg("Lỗi kết nối.");
    } finally {
      setResetting(false);
    }
  }

  return (
    <div className="space-y-5 max-w-lg">
      {/* Hệ thống */}
      <section>
        <h3 className="mb-2 font-extrabold text-base">Hệ thống</h3>
        <Card>
          <CardContent className="p-4">
            <ConfigRow label="TTS Engine" value="Edge TTS" />
            <ConfigRow label="Speech Model" value={import.meta.env.VITE_SPEECH_EVAL_URL ? "Whisper (local)" : "Web Speech API"} />
            <ConfigRow
              label="DeepSeek"
              value={deepseekConfigured === null ? "Đang kiểm tra…" : deepseekConfigured ? "Đã cấu hình" : "Chưa cấu hình"}
            />
          </CardContent>
        </Card>
      </section>

      {/* Mặc định */}
      <section>
        <h3 className="mb-2 font-extrabold text-base">Mặc định</h3>
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <label className="text-sm font-bold" htmlFor="defaultGoal">
                Mục tiêu hàng ngày mặc định (từ)
              </label>
              <input
                id="defaultGoal"
                type="number"
                min={1}
                max={50}
                value={defaultGoal}
                onChange={(e) => setDefaultGoal(e.target.value)}
                className="w-20 rounded-lg border border-border bg-background px-2 py-1 text-center text-sm font-bold"
              />
            </div>
            <p className="text-xs font-bold text-muted-foreground">Lưu cấu hình sẽ có trong phiên bản tiếp theo.</p>
          </CardContent>
        </Card>
      </section>

      {/* Reset dữ liệu */}
      <section>
        <h3 className="mb-2 font-extrabold text-base text-destructive">Reset dữ liệu</h3>
        <Card className="border-destructive/30">
          <CardContent className="p-4 space-y-3">
            <p className="text-xs font-bold text-muted-foreground">Chọn dữ liệu cần xoá cho TẤT CẢ học sinh. Không thể hoàn tác.</p>
            {(
              [
                { key: "xp", label: "XP (điểm kinh nghiệm)", value: resetXp, set: setResetXp },
                { key: "streak", label: "Streak (chuỗi ngày)", value: resetStreak, set: setResetStreak },
                { key: "progress", label: "Tiến độ từ vựng", value: resetProgress, set: setResetProgress },
                { key: "quiz", label: "Kết quả Quiz", value: resetQuiz, set: setResetQuiz },
                { key: "lookups", label: "Lịch sử tra cứu", value: resetLookups, set: setResetLookups },
              ] as const
            ).map(({ key, label, value, set }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-destructive"
                  checked={value}
                  onChange={(e) => set(e.target.checked)}
                />
                <span className="text-sm font-bold">{label}</span>
              </label>
            ))}

            {resetMsg && (
              <p className="rounded-lg bg-muted px-3 py-2 text-sm font-bold">{resetMsg}</p>
            )}

            <Button
              type="button"
              variant="destructive"
              disabled={resetting || ![resetXp, resetStreak, resetProgress, resetQuiz, resetLookups].some(Boolean)}
              onClick={handleReset}
              className="w-full"
            >
              {resetting ? "Đang reset…" : "Reset dữ liệu đã chọn"}
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
