import { useState } from "react";
import { SessionHeader } from "@/components/layout/SessionHeader";
import { Shield, FileText } from "lucide-react";
import { cn } from "@/components/ui/cn";

interface LegalPageProps {
  onBack: () => void;
}

type Tab = "privacy" | "terms";

export function LegalPage({ onBack }: LegalPageProps) {
  const [tab, setTab] = useState<Tab>("privacy");

  return (
    <div className="mx-auto max-w-2xl px-4 py-2">
      <SessionHeader
        title={tab === "privacy" ? "Chính sách bảo mật" : "Điều khoản sử dụng"}
        icon={tab === "privacy" ? <Shield className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
        iconBg={tab === "privacy" ? "bg-emerald-500" : "bg-blue-500"}
        onClose={onBack}
      />

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-muted p-1 mb-6">
        {([
          { key: "privacy" as Tab, label: "Chính sách bảo mật" },
          { key: "terms" as Tab, label: "Điều khoản sử dụng" },
        ]).map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "flex-1 rounded-lg py-2 text-sm font-semibold transition-all",
              tab === t.key
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-6 text-sm leading-relaxed text-foreground/90">
        {tab === "privacy" ? <PrivacyContent /> : <TermsContent />}
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Cập nhật lần cuối: 01/07/2026
      </p>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-base font-bold text-foreground mt-2">{children}</h2>;
}

function PrivacyContent() {
  return (
    <>
      <section>
        <SectionTitle>1. Thu thập dữ liệu</SectionTitle>
        <p>
          Chúng tôi thu thập các thông tin sau khi bạn đăng ký và sử dụng dịch vụ:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Email và tên người dùng</li>
          <li>Kết quả học tập, điểm số, tiến độ các bài học</li>
          <li>Thông tin thiết bị và trình duyệt (để tối ưu trải nghiệm)</li>
        </ul>
      </section>

      <section>
        <SectionTitle>2. Mục đích sử dụng</SectionTitle>
        <ul className="list-disc pl-5 space-y-1">
          <li>Cá nhân hoá trải nghiệm học tập</li>
          <li>Theo dõi tiến độ và đề xuất bài học phù hợp</li>
          <li>Gửi thông báo liên quan đến tài khoản và dịch vụ</li>
        </ul>
      </section>

      <section>
        <SectionTitle>3. Bảo mật dữ liệu</SectionTitle>
        <ul className="list-disc pl-5 space-y-1">
          <li>Mật khẩu được mã hoá (bcrypt) trước khi lưu trữ</li>
          <li>Dữ liệu truyền tải được bảo vệ bằng HTTPS/TLS</li>
          <li>Chúng tôi không chia sẻ thông tin cá nhân với bên thứ 3</li>
        </ul>
      </section>

      <section>
        <SectionTitle>4. Quyền của người dùng</SectionTitle>
        <ul className="list-disc pl-5 space-y-1">
          <li>Yêu cầu xoá tài khoản và toàn bộ dữ liệu</li>
          <li>Xuất dữ liệu học tập của bạn</li>
          <li>Từ chối nhận email marketing</li>
        </ul>
      </section>

      <section>
        <SectionTitle>5. Liên hệ</SectionTitle>
        <p>
          Mọi thắc mắc về quyền riêng tư, vui lòng liên hệ:{" "}
          <a href="mailto:support@buddy.vn" className="text-primary underline">
            support@buddy.vn
          </a>
        </p>
      </section>
    </>
  );
}

function TermsContent() {
  return (
    <>
      <section>
        <SectionTitle>1. Điều kiện sử dụng</SectionTitle>
        <ul className="list-disc pl-5 space-y-1">
          <li>Bạn cần đăng ký tài khoản để sử dụng đầy đủ tính năng</li>
          <li>Người dùng cần tuân thủ quy tắc cộng đồng và không lạm dụng dịch vụ</li>
          <li>Tài khoản là cá nhân, không được chia sẻ cho người khác</li>
        </ul>
      </section>

      <section>
        <SectionTitle>2. Nội dung học tập</SectionTitle>
        <ul className="list-disc pl-5 space-y-1">
          <li>Toàn bộ nội dung bài học, hình ảnh, âm thanh là tài sản của English Buddy</li>
          <li>Không sao chép, phân phối lại nội dung khi chưa có sự đồng ý</li>
          <li>Nội dung do người dùng tạo (ghi chú, bài viết) thuộc quyền người dùng</li>
        </ul>
      </section>

      <section>
        <SectionTitle>3. Tài khoản Premium</SectionTitle>
        <ul className="list-disc pl-5 space-y-1">
          <li>Thanh toán được xử lý qua cổng thanh toán bảo mật</li>
          <li>Bạn có thể huỷ đăng ký bất kỳ lúc nào</li>
          <li>Hoàn tiền trong 7 ngày đầu nếu chưa hài lòng</li>
          <li>Sau khi huỷ, tài khoản vẫn hoạt động đến hết chu kỳ thanh toán</li>
        </ul>
      </section>

      <section>
        <SectionTitle>4. Giới hạn trách nhiệm</SectionTitle>
        <ul className="list-disc pl-5 space-y-1">
          <li>English Buddy cung cấp dịch vụ "nguyên trạng" (as-is)</li>
          <li>Chúng tôi nỗ lực đảm bảo dịch vụ hoạt động ổn định nhưng không cam kết 100% uptime</li>
          <li>Không chịu trách nhiệm về thiệt hại gián tiếp từ việc sử dụng dịch vụ</li>
        </ul>
      </section>

      <section>
        <SectionTitle>5. Thay đổi điều khoản</SectionTitle>
        <p>
          Chúng tôi có quyền cập nhật điều khoản bất kỳ lúc nào. Thay đổi quan trọng sẽ được
          thông báo qua email hoặc thông báo trong ứng dụng. Việc tiếp tục sử dụng dịch vụ
          đồng nghĩa với việc bạn đồng ý với điều khoản mới.
        </p>
      </section>

      <section>
        <SectionTitle>Liên hệ</SectionTitle>
        <p>
          Mọi thắc mắc, vui lòng liên hệ:{" "}
          <a href="mailto:support@buddy.vn" className="text-primary underline">
            support@buddy.vn
          </a>
        </p>
      </section>
    </>
  );
}
