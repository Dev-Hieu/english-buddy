import { Eraser, Eye, PartyPopper, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { playWin, playTap, playWrong } from "@/services/soundService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/components/ui/cn";
import { SessionHeader } from "@/components/layout/SessionHeader";

type Grid = number[][];
type Diff = "easy" | "medium";

const shuffle = <T,>(s: T[]): T[] => s.slice().sort(() => Math.random() - 0.5);

// Tạo bảng đã giải hợp lệ bằng kỹ thuật hoán vị mẫu chuẩn.
function generateSolved(): Grid {
  const base = 3;
  const side = 9;
  const pattern = (r: number, c: number) => (base * (r % base) + Math.floor(r / base) + c) % side;
  const rBase = [0, 1, 2];
  const rows = shuffle(rBase).flatMap((g) => shuffle(rBase).map((r) => g * base + r));
  const cols = shuffle(rBase).flatMap((g) => shuffle(rBase).map((c) => g * base + c));
  const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  return rows.map((r) => cols.map((c) => nums[pattern(r, c)]));
}

function makePuzzle(diff: Diff) {
  const solution = generateSolved();
  const puzzle = solution.map((row) => row.slice());
  const remove = diff === "easy" ? 36 : 46;
  let removed = 0;
  while (removed < remove) {
    const r = Math.floor(Math.random() * 9);
    const c = Math.floor(Math.random() * 9);
    if (puzzle[r][c] !== 0) {
      puzzle[r][c] = 0;
      removed++;
    }
  }
  return { solution, puzzle };
}

export function SudokuGame({ onClose }: { onClose: () => void }) {
  const [diff, setDiff] = useState<Diff>("easy");
  const [{ solution, puzzle }, setGame] = useState(() => makePuzzle("easy"));
  const [board, setBoard] = useState<Grid>(() => puzzle.map((r) => r.slice()));
  const [sel, setSel] = useState<[number, number] | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  const newGame = (d: Diff) => {
    const g = makePuzzle(d);
    setDiff(d);
    setGame(g);
    setBoard(g.puzzle.map((r) => r.slice()));
    setSel(null);
    setShowSolution(false);
  };

  const given = (r: number, c: number) => puzzle[r][c] !== 0;
  const wrong = (r: number, c: number) => board[r][c] !== 0 && board[r][c] !== solution[r][c];
  const won = board.every((row, r) => row.every((v, c) => v === solution[r][c]));

  useEffect(() => {
    if (won && !showSolution) playWin();
  }, [won, showSolution]);

  const setCell = (n: number) => {
    if (!sel) return;
    const [r, c] = sel;
    if (given(r, c)) return;
    setBoard((b) => b.map((row, ri) => row.map((v, ci) => (ri === r && ci === c ? n : v))));
    if (n !== 0) {
      if (n !== solution[r][c]) playWrong(); else playTap();
    }
  };

  const selVal = sel ? board[sel[0]][sel[1]] : 0;

  return (
    <>
      <SessionHeader
        title="Sudoku"
        onClose={onClose}
        right={
          <div className="flex gap-1.5">
            {!showSolution && !won && (
              <Button type="button" size="sm" variant="outline" onClick={() => { setShowSolution(true); setBoard(solution.map((r) => r.slice())); }}>
                <Eye className="h-4 w-4" /> Lời giải
              </Button>
            )}
            <Button type="button" size="sm" variant="outline" onClick={() => newGame(diff)}>
              <RotateCcw className="h-4 w-4" /> Ván mới
            </Button>
          </div>
        }
      />

      <div className="mb-3 grid grid-cols-2 gap-1 rounded-2xl bg-muted p-1">
        {(["easy", "medium"] as Diff[]).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => newGame(d)}
            className={cn("rounded-xl py-2 text-sm font-extrabold transition-colors", diff === d ? "bg-card text-primary shadow-card" : "text-muted-foreground")}
          >
            {d === "easy" ? "Dễ" : "Khó"}
          </button>
        ))}
      </div>

      {showSolution ? (
        <Card className="animate-pop mb-4">
          <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
            <Eye className="h-10 w-10 text-primary" />
            <p className="text-lg font-black text-primary">Đây là lời giải</p>
            <p className="text-xs text-muted-foreground">Xem đáp án để học cách giải, rồi thử ván mới nhé!</p>
            <Button type="button" size="lg" className="w-full" onClick={() => newGame(diff)}>Chơi ván mới</Button>
          </CardContent>
        </Card>
      ) : null}

      {won && !showSolution ? (
        <Card className="animate-pop">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <PartyPopper className="h-14 w-14 text-accent" />
            <p className="text-2xl font-black text-primary">Giải xong rồi! 🎉</p>
            <Button type="button" size="lg" className="w-full" onClick={() => newGame(diff)}>Chơi ván mới</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mx-auto grid aspect-square w-full grid-cols-9 overflow-hidden rounded-2xl border-[3px] border-foreground/70 bg-card shadow-card">
            {board.map((row, r) =>
              row.map((v, c) => {
                const isSel = sel && sel[0] === r && sel[1] === c;
                const sameVal = selVal !== 0 && v === selVal;
                const isWrong = wrong(r, c);
                return (
                  <button
                    key={`${r}-${c}`}
                    type="button"
                    onClick={() => setSel([r, c])}
                    className={cn(
                      "flex items-center justify-center border border-border/60 text-lg font-extrabold sm:text-xl",
                      c % 3 === 2 && c !== 8 && "border-r-[3px] border-r-foreground/40",
                      r % 3 === 2 && r !== 8 && "border-b-[3px] border-b-foreground/40",
                      given(r, c) ? "text-foreground" : showSolution && !given(r, c) ? "text-success font-black" : "text-primary",
                      isWrong && "bg-red-100 text-red-600",
                      sameVal && !isWrong && "bg-secondary",
                      isSel && "bg-primary/20 ring-2 ring-primary",
                    )}
                  >
                    {v !== 0 ? v : ""}
                  </button>
                );
              }),
            )}
          </div>

          <div className="mt-4 grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <Button key={n} type="button" variant="outline" size="lg" className="text-xl" onClick={() => setCell(n)}>
                {n}
              </Button>
            ))}
            <Button type="button" variant="secondary" size="lg" onClick={() => setCell(0)} aria-label="Xoá">
              <Eraser className="h-5 w-5" />
            </Button>
          </div>
        </>
      )}
    </>
  );
}
