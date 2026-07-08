import { useState } from "react";
import { Check, X as XIcon, Crown, Star, Zap, Copy, CheckCircle } from "lucide-react";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/cn";

interface PremiumPageProps {
  user: { name: string; email: string; isPremium: boolean };
  onBack: () => void;
}

type PlanKey = "monthly" | "yearly" | "lifetime";

const PLANS: { key: PlanKey; name: string; price: string; unit: string; badge?: string; highlight?: boolean; desc: string }[] = [
  { key: "monthly", name: "Premium Tháng", price: "49,000", unit: "đ/tháng", desc: "Linh hoạt, huỷ bất kỳ lúc nào" },
  { key: "yearly", name: "Premium Năm", price: "390,000", unit: "đ/năm", badge: "Tiết kiệm 33%", highlight: true, desc: "Phổ biến nhất — chỉ 32,500đ/tháng" },
  { key: "lifetime", name: "Premium Trọn đời", price: "990,000", unit: "một lần", desc: "Trả một lần, dùng mãi mãi" },
];

const FEATURES: { name: string; free: boolean | string; premium: boolean | string }[] = [
  { name: "Học từ vựng, ngữ pháp, game", free: true, premium: true },
  { name: "Luyện đọc, luyện nghe", free: true, premium: true },
  { name: "Bài thi đánh giá", free: "5 bài/ngày", premium: "Không giới hạn" },
  { name: "Tra từ điển", free: "20 từ/ngày", premium: "Không giới hạn" },
  { name: "AI chấm bài viết", free: false, premium: true },
  { name: "AI hội thoại", free: false, premium: "Không giới hạn" },
  { name: "Chấm điểm phát âm nâng cao", free: false, premium: true },
  { name: "Không quảng cáo", free: false, premium: true },
  { name: "Hỗ trợ ưu tiên", free: false, premium: true },
];

const BANK_INFO = {
  bank: "OCB (Ngân hàng Phương Đông)",
  account: "800 999 9999",
  holder: "LE TIEN HIEU",
  format: "PREMIUM [email] [gói]",
};

export function PremiumPage({ user, onBack }: PremiumPageProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanKey | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedPlanData = PLANS.find((p) => p.key === selectedPlan);
  const transferContent = selectedPlanData
    ? `PREMIUM ${user.email} ${selectedPlan}`
    : "";

  if (user.isPremium) {
    return (
      <main className="mx-auto w-full max-w-md overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-0 pb-6">
        <SessionHeader title="Premium" onClose={onBack} />
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
            <Crown className="h-10 w-10 text-amber-600" />
          </div>
          <h2 className="text-xl font-black">Bạn đã là thành viên Premium!</h2>
          <p className="text-sm text-muted-foreground">
            Cảm ơn bạn đã ủng hộ English Buddy. Tất cả tính năng Premium đã được kích hoạt.
          </p>
          <Button variant="outline" onClick={onBack}>Quay lại trang chủ</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-md overflow-x-hidden min-h-[100dvh] bg-card/80 backdrop-blur-sm shadow-soft sm:my-4 sm:rounded-3xl sm:min-h-0 sm:border sm:border-border/40 px-4 pt-0 pb-6">
      <SessionHeader title="Nâng cấp Premium" onClose={onBack} />

      {/* Hero */}
      <div className="text-center mb-6">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg mb-3">
          <Crown className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-lg font-black">Mở khoá toàn bộ sức mạnh</h2>
        <p className="text-sm text-muted-foreground mt-1">
          AI chấm bài, hội thoại không giới hạn, phát âm nâng cao
        </p>
      </div>

      {/* Free tier info */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-base font-black">Miễn phí</h3>
            <span className="ml-auto text-sm font-extrabold text-muted-foreground">0đ</span>
          </div>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>5 bài thi/ngày, tra từ giới hạn</li>
            <li>Game cơ bản, luyện đọc & nghe</li>
          </ul>
        </CardContent>
      </Card>

      {/* Plan cards */}
      <div className="space-y-3 mb-6">
        {PLANS.map((plan) => (
          <button
            key={plan.key}
            type="button"
            onClick={() => setSelectedPlan(plan.key)}
            className={cn(
              "relative w-full rounded-2xl border-2 p-4 text-left transition-all active:scale-[0.98]",
              selectedPlan === plan.key
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border/60 bg-card hover:border-primary/40",
              plan.highlight && selectedPlan !== plan.key && "border-amber-300 bg-amber-50/50",
            )}
          >
            {plan.badge && (
              <span className="absolute -top-2.5 right-3 rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-black text-white shadow-sm">
                {plan.badge}
              </span>
            )}
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl",
                plan.highlight ? "bg-amber-100" : "bg-primary/10",
              )}>
                {plan.key === "lifetime" ? <Zap className="h-5 w-5 text-amber-600" /> : <Crown className="h-5 w-5 text-primary" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black">{plan.name}</p>
                <p className="text-xs text-muted-foreground">{plan.desc}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-lg font-black text-primary">{plan.price}đ</p>
                <p className="text-[10px] font-bold text-muted-foreground">{plan.unit}</p>
              </div>
            </div>
            {selectedPlan === plan.key && (
              <CheckCircle className="absolute top-3 left-3 h-5 w-5 text-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Feature comparison */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <h3 className="text-base font-black mb-3">So sánh tính năng</h3>
          <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 gap-y-2 text-sm">
            <span className="font-bold text-muted-foreground text-xs">Tính năng</span>
            <span className="font-bold text-muted-foreground text-xs text-center w-16">Miễn phí</span>
            <span className="font-bold text-xs text-center w-16 text-primary">Premium</span>
            {FEATURES.map((f) => (
              <FeatureRow key={f.name} name={f.name} free={f.free} premium={f.premium} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment section */}
      {selectedPlan && (
        <Card className="mb-6 border-primary/30">
          <CardContent className="p-4">
            <h3 className="text-base font-black mb-3">Thanh toán</h3>

            {/* Bank transfer */}
            <div className="rounded-xl bg-blue-50 p-3 mb-3">
              <p className="text-sm font-black text-blue-800 mb-2">Chuyển khoản ngân hàng</p>
              <div className="space-y-1.5 text-sm">
                <InfoRow label="Ngân hàng" value={BANK_INFO.bank} onCopy={handleCopy} />
                <InfoRow label="Số tài khoản" value={BANK_INFO.account} onCopy={handleCopy} />
                <InfoRow label="Chủ TK" value={BANK_INFO.holder} onCopy={handleCopy} />
                <InfoRow label="Nội dung CK" value={transferContent} onCopy={handleCopy} />
                <InfoRow label="Số tiền" value={`${selectedPlanData!.price}đ`} onCopy={handleCopy} />
              </div>
              {copied && (
                <p className="mt-2 text-xs font-bold text-green-600">Đã copy!</p>
              )}
            </div>

            {/* MoMo */}
            <div className="rounded-xl bg-pink-50 p-3 mb-3">
              <p className="text-sm font-black text-pink-800 mb-2">MoMo / VietQR</p>
              <div className="flex items-center justify-center rounded-xl bg-white p-4 border border-pink-200">
                <div className="text-center">
                  <img src="/momo-qr.jpg" alt="MoMo QR" className="h-48 w-48 mx-auto rounded-xl object-contain mb-2" />
                  <p className="text-xs font-bold">LÊ TIẾN HIẾU</p>
                  <p className="text-xs text-muted-foreground">Quét mã để thanh toán</p>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="rounded-xl bg-amber-50 p-3">
              <p className="text-xs font-bold text-amber-800">
                Sau khi chuyển khoản, tài khoản sẽ được kích hoạt trong vòng 24h.
                Nếu cần hỗ trợ, vui lòng liên hệ:
              </p>
              <div className="mt-2 space-y-1 text-xs font-bold text-amber-700">
                <p>Zalo: 0856.322.323</p>
                <p>Email: support@buddy.vn</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* CTA */}
      {!selectedPlan && (
        <p className="text-center text-sm font-bold text-muted-foreground mb-4">
          Chọn một gói phía trên để xem hướng dẫn thanh toán
        </p>
      )}

      {/* Contact */}
      <div className="text-center text-xs text-muted-foreground space-y-1 pb-4">
        <p className="font-bold">Liên hệ hỗ trợ</p>
        <p>Zalo: 0856.322.323 | Email: support@buddy.vn</p>
      </div>
    </main>
  );
}

/* ── Helpers ── */

function FeatureRow({ name, free, premium }: { name: string; free: boolean | string; premium: boolean | string }) {
  return (
    <>
      <span className="text-xs">{name}</span>
      <CellValue value={free} />
      <CellValue value={premium} isPremium />
    </>
  );
}

function CellValue({ value, isPremium }: { value: boolean | string; isPremium?: boolean }) {
  if (typeof value === "string") {
    return <span className={cn("text-[10px] font-bold text-center w-16", isPremium ? "text-primary" : "text-muted-foreground")}>{value}</span>;
  }
  return (
    <span className="flex justify-center w-16">
      {value
        ? <Check className={cn("h-4 w-4", isPremium ? "text-primary" : "text-green-500")} strokeWidth={3} />
        : <XIcon className="h-4 w-4 text-muted-foreground/40" strokeWidth={2} />
      }
    </span>
  );
}

function InfoRow({ label, value, onCopy }: { label: string; value: string; onCopy: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-blue-600 shrink-0">{label}:</span>
      <div className="flex items-center gap-1 min-w-0">
        <span className="text-xs font-bold text-blue-900 truncate">{value}</span>
        <button
          type="button"
          onClick={() => onCopy(value)}
          className="shrink-0 rounded p-0.5 hover:bg-blue-200/50 transition-colors"
        >
          <Copy className="h-3 w-3 text-blue-500" />
        </button>
      </div>
    </div>
  );
}
