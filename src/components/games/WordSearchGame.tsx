import { Check, Clock, PartyPopper, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/components/ui/cn";
import { SessionHeader } from "@/components/layout/SessionHeader";

interface Props {
  words: { word: string; meaning_vi: string }[];
  onComplete: (score: number) => void;
  onBack: () => void;
}

type Difficulty = "easy" | "medium" | "hard";

const DIFFICULTY_CONFIG: Record<Difficulty, { size: number; count: number }> = {
  easy: { size: 8, count: 6 },
  medium: { size: 10, count: 8 },
  hard: { size: 12, count: 12 },
};

const DIRECTIONS: [number, number][] = [
  [0, 1],   // horizontal right
  [1, 0],   // vertical down
  [1, 1],   // diagonal down-right
  [1, -1],  // diagonal down-left
];

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickWords(pool: Props["words"], count: number): Props["words"] {
  return shuffle(pool).slice(0, Math.min(count, pool.length));
}

function tryPlaceWord(grid: string[][], word: string, size: number): boolean {
  const upper = word.toUpperCase();
  const dirs = shuffle(DIRECTIONS);
  const positions = shuffle(
    Array.from({ length: size * size }, (_, i) => [Math.floor(i / size), i % size] as [number, number]),
  );

  for (const [dr, dc] of dirs) {
    for (const [r, c] of positions) {
      const endR = r + dr * (upper.length - 1);
      const endC = c + dc * (upper.length - 1);
      if (endR < 0 || endR >= size || endC < 0 || endC >= size) continue;

      let fits = true;
      for (let i = 0; i < upper.length; i++) {
        const cell = grid[r + dr * i][c + dc * i];
        if (cell !== "" && cell !== upper[i]) {
          fits = false;
          break;
        }
      }
      if (!fits) continue;

      for (let i = 0; i < upper.length; i++) {
        grid[r + dr * i][c + dc * i] = upper[i];
      }
      return true;
    }
  }
  return false;
}

interface PlacedWord {
  word: string;
  meaning_vi: string;
  cells: [number, number][];
}

function generateGrid(
  selectedWords: Props["words"],
  size: number,
): { grid: string[][]; placed: PlacedWord[] } {
  const grid: string[][] = Array.from({ length: size }, () => Array(size).fill(""));
  const placed: PlacedWord[] = [];

  // Sort longer words first for better placement
  const sorted = selectedWords.slice().sort((a, b) => b.word.length - a.word.length);

  for (const { word, meaning_vi } of sorted) {
    const upper = word.toUpperCase();
    const beforeGrid = grid.map((r) => r.slice());

    if (tryPlaceWord(grid, word, size)) {
      // Find the cells that were placed
      const cells: [number, number][] = [];
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (grid[r][c] !== beforeGrid[r][c]) {
            cells.push([r, c]);
          }
        }
      }
      // Cells from overlap won't appear in diff, so reconstruct from actual placement
      // Re-find by scanning directions
      const found = findWordCells(grid, upper, size);
      if (found) {
        placed.push({ word: upper, meaning_vi, cells: found });
      }
    }
  }

  // Fill empty cells with random letters
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === "") {
        grid[r][c] = letters[Math.floor(Math.random() * 26)];
      }
    }
  }

  return { grid, placed };
}

function findWordCells(grid: string[][], word: string, size: number): [number, number][] | null {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      for (const [dr, dc] of DIRECTIONS) {
        const endR = r + dr * (word.length - 1);
        const endC = c + dc * (word.length - 1);
        if (endR < 0 || endR >= size || endC < 0 || endC >= size) continue;

        let match = true;
        for (let i = 0; i < word.length; i++) {
          if (grid[r + dr * i][c + dc * i] !== word[i]) {
            match = false;
            break;
          }
        }
        if (match) {
          return Array.from({ length: word.length }, (_, i) => [r + dr * i, c + dc * i] as [number, number]);
        }
      }
    }
  }
  return null;
}

function getCellsOnLine(
  r1: number,
  c1: number,
  r2: number,
  c2: number,
): [number, number][] | null {
  const dr = r2 - r1;
  const dc = c2 - c1;
  if (dr === 0 && dc === 0) return null;

  const steps = Math.max(Math.abs(dr), Math.abs(dc));
  if (Math.abs(dr) !== 0 && Math.abs(dc) !== 0 && Math.abs(dr) !== Math.abs(dc)) return null;

  const stepR = dr === 0 ? 0 : dr / steps;
  const stepC = dc === 0 ? 0 : dc / steps;

  const cells: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    cells.push([r1 + stepR * i, c1 + stepC * i]);
  }
  return cells;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type Phase = "pick" | "play" | "done";

export function WordSearchGame({ words, onComplete, onBack }: Props) {
  const [phase, setPhase] = useState<Phase>("pick");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [grid, setGrid] = useState<string[][]>([]);
  const [placed, setPlaced] = useState<PlacedWord[]>([]);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [firstCell, setFirstCell] = useState<[number, number] | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [message, setMessage] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startGame = useCallback(
    (diff: Difficulty) => {
      const config = DIFFICULTY_CONFIG[diff];
      const selected = pickWords(words, config.count);
      const { grid: g, placed: p } = generateGrid(selected, config.size);
      setDifficulty(diff);
      setGrid(g);
      setPlaced(p);
      setFoundWords(new Set());
      setFirstCell(null);
      setElapsed(0);
      setMessage("");
      setPhase("play");
    },
    [words],
  );

  // Timer
  useEffect(() => {
    if (phase === "play") {
      timerRef.current = setInterval(() => setElapsed((t) => t + 1), 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
    if (timerRef.current) clearInterval(timerRef.current);
  }, [phase]);

  const foundCells = useMemo(() => {
    const set = new Set<string>();
    for (const pw of placed) {
      if (foundWords.has(pw.word)) {
        for (const [r, c] of pw.cells) set.add(`${r},${c}`);
      }
    }
    return set;
  }, [foundWords, placed]);

  const size = grid.length;

  const handleCellClick = useCallback(
    (r: number, c: number) => {
      if (phase !== "play") return;

      if (!firstCell) {
        setFirstCell([r, c]);
        setMessage("");
        return;
      }

      const [r1, c1] = firstCell;
      setFirstCell(null);

      if (r1 === r && c1 === c) return;

      const cells = getCellsOnLine(r1, c1, r, c);
      if (!cells) {
        setMessage("Chon theo duong thang!");
        return;
      }

      const selectedWord = cells.map(([cr, cc]) => grid[cr][cc]).join("");
      const reversedWord = cells.slice().reverse().map(([cr, cc]) => grid[cr][cc]).join("");

      const match = placed.find(
        (pw) => !foundWords.has(pw.word) && (pw.word === selectedWord || pw.word === reversedWord),
      );

      if (match) {
        const next = new Set(foundWords);
        next.add(match.word);
        setFoundWords(next);
        setMessage("");

        if (next.size === placed.length) {
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase("done");
          const score = Math.max(1000 - elapsed * 2, 100) + placed.length * 50;
          onComplete(score);
        }
      } else {
        setMessage("Khong dung, thu lai!");
      }
    },
    [phase, firstCell, grid, placed, foundWords, elapsed, onComplete],
  );

  // --- Difficulty picker ---
  if (phase === "pick") {
    return (
      <>
        <SessionHeader title="Tim tu" onClose={onBack} />

        <Card>
          <CardContent className="flex flex-col gap-4 p-6">
            <p className="text-center text-lg font-bold">Chon do kho</p>
            {(["easy", "medium", "hard"] as Difficulty[]).map((d) => {
              const cfg = DIFFICULTY_CONFIG[d];
              const label = d === "easy" ? "De" : d === "medium" ? "Trung binh" : "Kho";
              return (
                <Button
                  key={d}
                  type="button"
                  size="lg"
                  variant="outline"
                  className="w-full text-base"
                  onClick={() => startGame(d)}
                >
                  {label} ({cfg.size}x{cfg.size}, {cfg.count} tu)
                </Button>
              );
            })}
          </CardContent>
        </Card>
      </>
    );
  }

  // --- Done screen ---
  if (phase === "done") {
    const score = Math.max(1000 - elapsed * 2, 100) + placed.length * 50;
    return (
      <>
        <SessionHeader title="Tim tu" onClose={onBack} />

        <Card className="animate-pop">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <PartyPopper className="h-14 w-14 text-accent" />
            <p className="text-2xl font-black text-primary">Hoan thanh!</p>
            <p className="text-muted-foreground">
              Thoi gian: {formatTime(elapsed)} &middot; Diem: {score}
            </p>
            <div className="flex w-full gap-2">
              <Button type="button" size="lg" variant="outline" className="flex-1" onClick={onBack}>
                Quay lai
              </Button>
              <Button type="button" size="lg" className="flex-1" onClick={() => startGame(difficulty)}>
                Choi lai
              </Button>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  // --- Play screen ---
  return (
    <>
      <SessionHeader
        title="Tim tu"
        onClose={onBack}
        right={
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-sm font-bold text-muted-foreground">
              <Clock className="h-4 w-4" /> {formatTime(elapsed)}
            </span>
            <Button type="button" size="sm" variant="outline" onClick={() => startGame(difficulty)}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        }
      />

      {message && (
        <p className="mb-2 text-center text-sm font-semibold text-red-500">{message}</p>
      )}

      <p className="mb-2 text-center text-xs text-muted-foreground">
        Cham o dau &rarr; cham o cuoi de chon tu
      </p>

      {/* Grid */}
      <div
        className="mx-auto w-full overflow-hidden rounded-2xl border-2 border-foreground/30 bg-card shadow-card"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          aspectRatio: "1 / 1",
        }}
      >
        {grid.map((row, r) =>
          row.map((letter, c) => {
            const key = `${r},${c}`;
            const isFound = foundCells.has(key);
            const isFirst = firstCell && firstCell[0] === r && firstCell[1] === c;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleCellClick(r, c)}
                className={cn(
                  "flex items-center justify-center border border-border/40 font-extrabold uppercase transition-colors select-none",
                  size <= 8 ? "text-base sm:text-lg" : size <= 10 ? "text-sm sm:text-base" : "text-xs sm:text-sm",
                  isFound && "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200",
                  isFirst && "bg-primary/20 ring-2 ring-primary",
                  !isFound && !isFirst && "hover:bg-secondary",
                )}
              >
                {letter}
              </button>
            );
          }),
        )}
      </div>

      {/* Word list */}
      <div className="mt-4">
        <p className="mb-2 text-sm font-bold">
          Tu can tim ({foundWords.size}/{placed.length})
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {placed.map((pw) => {
            const found = foundWords.has(pw.word);
            return (
              <div
                key={pw.word}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm",
                  found ? "bg-green-100 dark:bg-green-900/40" : "bg-muted",
                )}
              >
                {found && <Check className="h-3.5 w-3.5 shrink-0 text-green-600" />}
                <span className={cn("font-bold", found && "line-through opacity-60")}>
                  {pw.word}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {pw.meaning_vi}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
