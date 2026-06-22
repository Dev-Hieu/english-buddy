import { useEffect, useState } from "react";
import { ExternalLink, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/components/ui/cn";
import { getVocabulary } from "@/services/contentService";
import type { VocabularyWord } from "@/types";

export interface ImagesTabProps {
  onOpenPicker: () => void;
}

export function ImagesTab({ onOpenPicker }: ImagesTabProps) {
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVocabulary()
      .then(setWords)
      .catch(() => setWords([]))
      .finally(() => setLoading(false));
  }, []);

  const withImages = words.filter((w) => w.imageUrl);
  const withoutImages = words.filter((w) => !w.imageUrl);

  const missingPreview = withoutImages.slice(0, 12);
  const recentPreview = withImages.slice(-12).reverse();

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-black">{loading ? "—" : words.length}</p>
            <p className="text-xs font-bold text-muted-foreground">Tổng từ</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-black text-green-600">{loading ? "—" : withImages.length}</p>
            <p className="text-xs font-bold text-muted-foreground">Có ảnh</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className={cn("text-2xl font-black", !loading && withoutImages.length > 0 ? "text-amber-500" : "")}>
              {loading ? "—" : withoutImages.length}
            </p>
            <p className="text-xs font-bold text-muted-foreground">Thiếu ảnh</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="mb-2 font-extrabold">Thao tác nhanh</h3>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => window.open("/picker", "_blank")}>
            <ExternalLink className="h-4 w-4" /> Mở Picker nâng cao
          </Button>
          <Button type="button" variant="outline" onClick={onOpenPicker}>
            <Image className="h-4 w-4" /> Chỉnh ảnh trong app
          </Button>
        </div>
      </div>

      {/* Missing images preview */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-extrabold">Từ chưa có ảnh</h3>
          {withoutImages.length > 12 && (
            <a href="/picker" target="_blank" rel="noreferrer"
              className="text-xs font-bold text-primary underline underline-offset-2">
              Xem tất cả ({withoutImages.length})
            </a>
          )}
        </div>
        {loading ? (
          <p className="text-sm font-bold text-muted-foreground">Đang tải...</p>
        ) : missingPreview.length === 0 ? (
          <p className="text-sm font-bold text-green-600">Tất cả từ đã có ảnh!</p>
        ) : (
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {missingPreview.map((w) => (
              <div key={w.id}
                className="flex flex-col items-center gap-1 rounded-xl border-2 border-dashed border-border bg-muted/40 p-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Image className="h-5 w-5" />
                </span>
                <p className="w-full truncate text-center text-xs font-bold">{w.word}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recently updated preview */}
      <div>
        <h3 className="mb-2 font-extrabold">Ảnh cập nhật gần đây</h3>
        {loading ? (
          <p className="text-sm font-bold text-muted-foreground">Đang tải...</p>
        ) : recentPreview.length === 0 ? (
          <p className="text-sm font-bold text-muted-foreground">Chưa có từ nào có ảnh.</p>
        ) : (
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {recentPreview.map((w) => (
              <div key={w.id} className="flex flex-col items-center gap-1">
                <div className="h-14 w-full overflow-hidden rounded-xl border border-border bg-muted">
                  <img src={w.imageUrl} alt={w.word}
                    className="h-full w-full object-cover"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                </div>
                <p className="w-full truncate text-center text-xs font-bold">{w.word}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
