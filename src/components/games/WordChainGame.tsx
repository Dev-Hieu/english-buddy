import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/components/ui/cn";
import { SessionHeader } from "@/components/layout/SessionHeader";

interface Props {
  words: { word: string }[];
  onComplete: (score: number) => void;
  onBack: () => void;
}

interface Player {
  name: string;
  emoji: string;
  isHuman: boolean;
  eliminated: boolean;
  wordsPlayed: number;
}

const TURN_TIME = 10;
const BOT_FAIL_CHANCE = 0.15;

const INITIAL_PLAYERS: Player[] = [
  { name: "You", emoji: "😊", isHuman: true, eliminated: false, wordsPlayed: 0 },
  { name: "Bot 1", emoji: "🦊", isHuman: false, eliminated: false, wordsPlayed: 0 },
  { name: "Bot 2", emoji: "🐱", isHuman: false, eliminated: false, wordsPlayed: 0 },
  { name: "Bot 3", emoji: "🐶", isHuman: false, eliminated: false, wordsPlayed: 0 },
];

export function WordChainGame({ words, onComplete, onBack }: Props) {
  const wordSet = useMemo(() => new Set(words.map((w) => w.word.toLowerCase())), [words]);
  const wordList = useMemo(() => Array.from(wordSet), [wordSet]);

  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS.map((p) => ({ ...p })));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [chain, setChain] = useState<string[]>([]);
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(TURN_TIME);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [elimination, setElimination] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const botTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const processingRef = useRef(false);

  const activePlayers = players.filter((p) => !p.eliminated);
  const currentPlayer = players[currentIndex];
  const requiredLetter = chain.length > 0 ? chain[chain.length - 1].slice(-1) : "";

  // Pick a random starting word
  useEffect(() => {
    if (chain.length === 0 && wordList.length > 0) {
      const start = wordList[Math.floor(Math.random() * wordList.length)];
      setChain([start]);
      setUsedWords(new Set([start]));
      setMessage(`Starting word: "${start}" — next word must start with "${start.slice(-1)}"`);
    }
  }, [chain.length, wordList]);

  // Determine placement for the human player
  const getPlacement = useCallback(() => {
    const eliminationOrder = players.filter((p) => p.eliminated && p.isHuman);
    if (eliminationOrder.length === 0) return 1; // human won
    const aliveCount = players.filter((p) => !p.eliminated).length;
    const eliminatedCount = players.filter((p) => p.eliminated).length;
    // Human was eliminated — placement is total players minus those eliminated before human
    const humanElimIdx = players.findIndex((p) => p.isHuman && p.eliminated);
    if (humanElimIdx === -1) return 1;
    // Count how many were eliminated after the human
    const humanWordsPlayed = players.find((p) => p.isHuman)!.wordsPlayed;
    let placement = 1 + aliveCount; // behind all alive players
    // Actually just count alive + those eliminated after human
    // Simpler: placement = number of players still alive when human was eliminated + bots eliminated after human
    // Let's just count: alive players are ahead, eliminated players who had more words are ahead too
    return players.filter((p) => !p.isHuman && !p.eliminated).length + 1;
  }, [players]);

  const advanceTurn = useCallback(() => {
    const nextAlive = (fromIndex: number): number => {
      let idx = (fromIndex + 1) % 4;
      let tries = 0;
      while (players[idx].eliminated && tries < 4) {
        idx = (idx + 1) % 4;
        tries++;
      }
      return idx;
    };
    const next = nextAlive(currentIndex);
    setCurrentIndex(next);
    setTimeLeft(TURN_TIME);
    setInput("");
    processingRef.current = false;
  }, [currentIndex, players]);

  const eliminatePlayer = useCallback(
    (index: number, reason: string) => {
      setPlayers((prev) => {
        const updated = prev.map((p, i) => (i === index ? { ...p, eliminated: true } : p));
        const alive = updated.filter((p) => !p.eliminated);
        if (alive.length <= 1) {
          setTimeout(() => setGameOver(true), 1200);
        }
        return updated;
      });
      setElimination(`${players[index].emoji} ${players[index].name} eliminated! ${reason}`);
      setTimeout(() => {
        setElimination(null);
        // Check if game should end
        const alive = players.filter((p, i) => !p.eliminated && i !== index);
        if (alive.length <= 1) {
          setGameOver(true);
        } else {
          advanceTurn();
        }
      }, 1200);
    },
    [players, advanceTurn],
  );

  const playWord = useCallback(
    (playerIndex: number, word: string) => {
      const lower = word.toLowerCase().trim();
      const lastLetter = chain[chain.length - 1].slice(-1);

      if (lower[0] !== lastLetter) {
        eliminatePlayer(playerIndex, `"${lower}" doesn't start with "${lastLetter}"`);
        return;
      }
      if (!wordSet.has(lower)) {
        eliminatePlayer(playerIndex, `"${lower}" is not a valid word`);
        return;
      }
      if (usedWords.has(lower)) {
        eliminatePlayer(playerIndex, `"${lower}" was already used`);
        return;
      }

      setChain((prev) => [...prev, lower]);
      setUsedWords((prev) => new Set(prev).add(lower));
      setPlayers((prev) => prev.map((p, i) => (i === playerIndex ? { ...p, wordsPlayed: p.wordsPlayed + 1 } : p)));
      setMessage(`${players[playerIndex].emoji} played "${lower}"`);
      advanceTurn();
    },
    [chain, wordSet, usedWords, players, eliminatePlayer, advanceTurn],
  );

  // Timer countdown
  useEffect(() => {
    if (gameOver || chain.length === 0 || processingRef.current) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        const next = Math.max(0, +(t - 0.1).toFixed(1));
        return next;
      });
    }, 100);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, gameOver, chain.length]);

  // Timeout handler
  useEffect(() => {
    if (timeLeft <= 0 && !processingRef.current && !gameOver && chain.length > 0) {
      processingRef.current = true;
      if (timerRef.current) clearInterval(timerRef.current);
      eliminatePlayer(currentIndex, "Time's up!");
    }
  }, [timeLeft, currentIndex, gameOver, chain.length, eliminatePlayer]);

  // Bot turn logic
  useEffect(() => {
    if (gameOver || chain.length === 0 || currentPlayer.eliminated || currentPlayer.isHuman || processingRef.current) return;

    const lastLetter = chain[chain.length - 1].slice(-1);
    const shouldFail = Math.random() < BOT_FAIL_CHANCE;
    const delay = 1000 + Math.random() * 1000;

    botTimeoutRef.current = setTimeout(() => {
      if (processingRef.current) return;
      processingRef.current = true;
      if (timerRef.current) clearInterval(timerRef.current);

      if (shouldFail) {
        eliminatePlayer(currentIndex, "Couldn't think of a word!");
        return;
      }

      const candidates = wordList.filter((w) => w[0] === lastLetter && !usedWords.has(w));
      if (candidates.length === 0) {
        eliminatePlayer(currentIndex, "No valid words left!");
        return;
      }

      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      playWord(currentIndex, pick);
    }, delay);

    return () => {
      if (botTimeoutRef.current) clearTimeout(botTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, gameOver, chain.length]);

  // Auto-focus input on human turn
  useEffect(() => {
    if (currentPlayer.isHuman && !currentPlayer.eliminated && !gameOver) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [currentIndex, currentPlayer, gameOver]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPlayer.isHuman || currentPlayer.eliminated || processingRef.current || !input.trim()) return;
    processingRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    playWord(currentIndex, input);
  };

  const handlePlayAgain = () => {
    setPlayers(INITIAL_PLAYERS.map((p) => ({ ...p })));
    setCurrentIndex(0);
    setChain([]);
    setUsedWords(new Set());
    setTimeLeft(TURN_TIME);
    setInput("");
    setMessage("");
    setGameOver(false);
    setElimination(null);
    processingRef.current = false;
  };

  // Not enough words
  if (wordList.length < 10) {
    return (
      <>
        <SessionHeader title="Word Chain" onClose={onBack} />
        <Card>
          <CardContent className="p-8 text-center font-bold text-muted-foreground">
            Not enough words to play Word Chain. Need at least 10 words.
          </CardContent>
        </Card>
      </>
    );
  }

  // Game over screen
  if (gameOver) {
    const alive = players.filter((p) => !p.eliminated);
    const winner = alive.length === 1 ? alive[0] : null;
    const humanAlive = players.find((p) => p.isHuman && !p.eliminated);
    const placement = humanAlive ? 1 : 4 - players.filter((p) => !p.isHuman && p.eliminated).length;
    const humanWords = players.find((p) => p.isHuman)!.wordsPlayed;
    const placementLabel = placement === 1 ? "1st" : placement === 2 ? "2nd" : placement === 3 ? "3rd" : "4th";

    return (
      <>
        <SessionHeader title="Word Chain" onClose={onBack} />
        <Card className="animate-pop">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <span className="text-6xl">{placement === 1 ? "🏆" : "💪"}</span>
            <p className="text-2xl font-black text-primary">
              {placement === 1 ? "You won!" : `You placed ${placementLabel}!`}
            </p>
            {winner && (
              <p className="text-lg font-bold text-muted-foreground">
                Winner: {winner.emoji} {winner.name}
              </p>
            )}
            <div className="w-full space-y-2 rounded-xl bg-muted p-4">
              <p className="text-sm font-bold text-muted-foreground">Results</p>
              {players.map((p) => (
                <div key={p.name} className="flex items-center justify-between text-sm font-semibold">
                  <span>
                    {p.emoji} {p.name}
                  </span>
                  <span className={cn(p.eliminated ? "text-red-400" : "text-green-500")}>
                    {p.eliminated ? `Out (${p.wordsPlayed} words)` : `Winner! (${p.wordsPlayed} words)`}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-sm font-bold text-muted-foreground">Chain length: {chain.length} words</p>
            <div className="flex w-full gap-2">
              <Button type="button" size="lg" className="flex-1" onClick={handlePlayAgain}>
                Play again
              </Button>
              <Button type="button" size="lg" variant="outline" className="flex-1" onClick={() => onComplete(humanWords)}>
                Done
              </Button>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  const timePct = (timeLeft / TURN_TIME) * 100;
  const displayChain = chain.slice(-5);

  return (
    <>
      <SessionHeader title="Word Chain" onClose={onBack} />

      {/* Players */}
      <div className="mb-4 grid grid-cols-4 gap-2">
        {players.map((p, i) => (
          <div
            key={p.name}
            className={cn(
              "flex flex-col items-center rounded-xl border-2 p-2 transition-all",
              p.eliminated ? "border-border bg-muted opacity-40" : i === currentIndex ? "border-primary bg-primary/10 scale-105" : "border-border bg-card",
            )}
          >
            <span className="text-2xl">{p.emoji}</span>
            <span className={cn("text-xs font-extrabold", i === currentIndex && !p.eliminated ? "text-primary" : "text-muted-foreground")}>
              {p.name}
            </span>
            {p.eliminated && <span className="text-[10px] font-bold text-red-400">OUT</span>}
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="space-y-4 p-6">
          {/* Timer bar */}
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full transition-[width] duration-100", timeLeft > 3 ? "bg-primary" : "bg-red-500")}
              style={{ width: `${timePct}%` }}
            />
          </div>

          {/* Elimination banner */}
          {elimination && (
            <div className="rounded-lg bg-red-100 p-2 text-center text-sm font-bold text-red-600 dark:bg-red-900/30 dark:text-red-400">
              {elimination}
            </div>
          )}

          {/* Status message */}
          {message && !elimination && <p className="text-center text-sm font-bold text-muted-foreground">{message}</p>}

          {/* Chain display */}
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {displayChain.map((w, i) => (
              <span key={`${w}-${i}`} className="flex items-center gap-1">
                {i > 0 && <span className="text-muted-foreground">→</span>}
                <span
                  className={cn(
                    "rounded-lg px-2 py-1 text-sm font-bold",
                    i === displayChain.length - 1 ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
                  )}
                >
                  {w}
                </span>
              </span>
            ))}
          </div>

          {/* Required letter hint */}
          {requiredLetter && (
            <p className="text-center text-lg font-black">
              Next word must start with: <span className="text-primary uppercase">"{requiredLetter}"</span>
            </p>
          )}

          {/* Turn indicator */}
          <p className="text-center text-sm font-bold text-muted-foreground">
            {currentPlayer.isHuman ? "Your turn! Type a word:" : `${currentPlayer.emoji} ${currentPlayer.name} is thinking...`}
          </p>

          {/* Input (only interactive on human turn) */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={!currentPlayer.isHuman || currentPlayer.eliminated}
              placeholder={currentPlayer.isHuman ? `Word starting with "${requiredLetter}"...` : "Waiting for bot..."}
              className="flex-1 rounded-xl border-2 border-border bg-card px-4 py-3 text-lg font-bold outline-none transition-colors focus:border-primary disabled:opacity-50"
              autoComplete="off"
            />
            <Button type="submit" size="lg" disabled={!currentPlayer.isHuman || currentPlayer.eliminated || !input.trim()}>
              Go
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
