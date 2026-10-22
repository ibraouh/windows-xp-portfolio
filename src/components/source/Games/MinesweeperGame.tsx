import React, { useCallback, useEffect, useRef, useState } from "react";

const ROWS = 9;
const COLS = 9;
const MINES = 10;
// Bigger cells for fingers, and long-press stands in for right-click on touch screens
const IS_TOUCH = window.matchMedia("(pointer: coarse)").matches;
const CELL = IS_TOUCH ? 32 : 20;
const LONG_PRESS_MS = 400;

type Cell = { mine: boolean; adjacent: number; revealed: boolean; flagged: boolean };
type Status = "ready" | "playing" | "won" | "lost";

const NUMBER_COLORS = ["", "#0000ff", "#008000", "#ff0000", "#000080", "#800000", "#008080", "#000000", "#808080"];

const emptyBoard = (): Cell[] =>
  Array.from({ length: ROWS * COLS }, () => ({
    mine: false,
    adjacent: 0,
    revealed: false,
    flagged: false,
  }));

const neighbors = (index: number) => {
  const row = Math.floor(index / COLS);
  const col = index % COLS;
  const result: number[] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const r = row + dr;
      const c = col + dc;
      if ((dr || dc) && r >= 0 && r < ROWS && c >= 0 && c < COLS) result.push(r * COLS + c);
    }
  }
  return result;
};

// Mines go anywhere except the first clicked cell and its neighbors.
const plantMines = (board: Cell[], safeIndex: number): Cell[] => {
  const safe = new Set([safeIndex, ...neighbors(safeIndex)]);
  const next = board.map((cell) => ({ ...cell }));
  let planted = 0;
  while (planted < MINES) {
    const i = Math.floor(Math.random() * next.length);
    if (!next[i].mine && !safe.has(i)) {
      next[i].mine = true;
      planted++;
    }
  }
  next.forEach((cell, i) => {
    cell.adjacent = neighbors(i).filter((n) => next[n].mine).length;
  });
  return next;
};

// Reveals a cell, flooding outward through cells with no adjacent mines.
const floodReveal = (board: Cell[], start: number): Cell[] => {
  const next = board.map((cell) => ({ ...cell }));
  const queue = [start];
  while (queue.length) {
    const i = queue.shift()!;
    const cell = next[i];
    if (cell.revealed || cell.flagged) continue;
    cell.revealed = true;
    if (cell.adjacent === 0 && !cell.mine) queue.push(...neighbors(i));
  }
  return next;
};

// Seven-segment LED digits, like the counters in XP's Minesweeper
const SEGMENTS: Record<string, string> = {
  "0": "abcdef", "1": "bc", "2": "abged", "3": "abgcd", "4": "fgbc",
  "5": "afgcd", "6": "afgedc", "7": "abc", "8": "abcdefg", "9": "abcdfg", "-": "g",
};
const SEGMENT_RECTS: Record<string, [number, number, number, number]> = {
  a: [3, 1, 7, 2], b: [10, 3, 2, 7], c: [10, 13, 2, 7], d: [3, 20, 7, 2],
  e: [1, 13, 2, 7], f: [1, 3, 2, 7], g: [3, 10.5, 7, 2],
};

const LedCounter: React.FC<{ value: number }> = ({ value }) => {
  const clamped = Math.max(-99, Math.min(999, value));
  const text = clamped < 0 ? "-" + String(-clamped).padStart(2, "0") : String(clamped).padStart(3, "0");
  return (
    <div className="flex bg-black px-[2px] py-[2px] border border-t-[#808080] border-l-[#808080] border-b-white border-r-white">
      {text.split("").map((char, i) => (
        <svg key={i} width="13" height="23" viewBox="0 0 13 23">
          {Object.entries(SEGMENT_RECTS).map(([segment, [x, y, w, h]]) => (
            <rect
              key={segment}
              x={x}
              y={y}
              width={w}
              height={h}
              fill={SEGMENTS[char]?.includes(segment) ? "#ff0000" : "#420000"}
            />
          ))}
        </svg>
      ))}
    </div>
  );
};

const Face: React.FC<{ mood: "smile" | "wow" | "cool" | "dead" }> = ({ mood }) => (
  <svg width="17" height="17" viewBox="0 0 17 17">
    <circle cx="8.5" cy="8.5" r="7.5" fill="#ffff00" stroke="#000" />
    {mood === "dead" ? (
      <path d="M4.5 4.5l2 2m0-2l-2 2M10.5 4.5l2 2m0-2l-2 2" stroke="#000" />
    ) : mood === "cool" ? (
      <path d="M3 6h11M4 6h3.5v1.5H4zM9.5 6H13v1.5H9.5z" stroke="#000" fill="#000" />
    ) : (
      <>
        <rect x="5" y="5" width="2" height="2" fill="#000" />
        <rect x="10" y="5" width="2" height="2" fill="#000" />
      </>
    )}
    {mood === "wow" ? (
      <circle cx="8.5" cy="11.5" r="1.8" fill="none" stroke="#000" />
    ) : mood === "dead" ? (
      <path d="M5.5 12.5q3-2.5 6 0" fill="none" stroke="#000" />
    ) : (
      <path d="M5 10.5q3.5 3 7 0" fill="none" stroke="#000" />
    )}
  </svg>
);

const Mine = () => (
  <svg width="14" height="14" viewBox="0 0 14 14">
    <path d="M7 1v12M1 7h12M2.8 2.8l8.4 8.4M11.2 2.8l-8.4 8.4" stroke="#000" />
    <circle cx="7" cy="7" r="4" fill="#000" />
    <rect x="5" y="5" width="2" height="2" fill="#fff" />
  </svg>
);

const Flag = () => (
  <svg width="12" height="13" viewBox="0 0 12 13">
    <path d="M7 1L2 4l5 3z" fill="#ff0000" />
    <path d="M7 1v8" stroke="#000" />
    <path d="M3 11h8v1H3zM5 10h4v1H5z" fill="#000" />
  </svg>
);

const raised = "border-2 border-t-white border-l-white border-b-[#808080] border-r-[#808080]";
const sunken = "border-[3px] border-t-[#808080] border-l-[#808080] border-b-white border-r-white";

export default function MinesweeperGame() {
  const [board, setBoard] = useState<Cell[]>(emptyBoard);
  const [status, setStatus] = useState<Status>("ready");
  const [time, setTime] = useState(0);
  const [pressing, setPressing] = useState(false);
  const [exploded, setExploded] = useState<number | null>(null);
  const pressTimer = useRef<ReturnType<typeof setTimeout>>();
  const longPressed = useRef(false);

  useEffect(() => {
    if (status !== "playing") return;
    const timer = setInterval(() => setTime((t) => Math.min(999, t + 1)), 1000);
    return () => clearInterval(timer);
  }, [status]);

  const reset = useCallback(() => {
    setBoard(emptyBoard());
    setStatus("ready");
    setTime(0);
    setExploded(null);
  }, []);

  const finish = (next: Cell[], hitMine: number | null) => {
    if (hitMine !== null) {
      setExploded(hitMine);
      setStatus("lost");
      // Like XP: correct flags stay, every other mine is shown
      setBoard(next.map((cell) => (cell.mine && !cell.flagged ? { ...cell, revealed: true } : cell)));
      return;
    }
    const won = next.every((cell) => cell.mine || cell.revealed);
    if (won) {
      setStatus("won");
      setBoard(next.map((cell) => (cell.mine ? { ...cell, flagged: true } : cell)));
    } else {
      setBoard(next);
    }
  };

  const reveal = (index: number) => {
    if (status === "won" || status === "lost") return;
    let current = board;
    if (status === "ready") {
      current = plantMines(board, index);
      setStatus("playing");
      setTime(1);
    }
    const cell = current[index];
    if (cell.flagged) return;

    // Clicking a number with all its flags placed opens the rest of its neighbors
    if (cell.revealed) {
      const around = neighbors(index);
      const flags = around.filter((n) => current[n].flagged).length;
      if (cell.adjacent === 0 || flags !== cell.adjacent) return;
      let next = current;
      let hit: number | null = null;
      around.forEach((n) => {
        if (next[n].flagged || next[n].revealed) return;
        if (next[n].mine) hit = n;
        next = floodReveal(next, n);
      });
      finish(next, hit);
      return;
    }

    if (cell.mine) {
      finish(current, index);
      return;
    }
    finish(floodReveal(current, index), null);
  };

  const toggleFlag = (index: number) => {
    if (status === "won" || status === "lost" || board[index].revealed) return;
    setBoard(board.map((cell, i) => (i === index ? { ...cell, flagged: !cell.flagged } : cell)));
  };

  const flagsPlaced = board.filter((cell) => cell.flagged).length;
  const mood = status === "lost" ? "dead" : status === "won" ? "cool" : pressing ? "wow" : "smile";

  return (
    <div className="h-full min-h-full bg-[#c0c0c0] flex justify-center items-start p-2 select-none">
      <div className={`inline-flex flex-col gap-[6px] p-[6px] bg-[#c0c0c0] ${raised}`}>
        <div className={`flex items-center justify-between px-[5px] py-[4px] ${sunken} border-2`}>
          <LedCounter value={MINES - flagsPlaced} />
          <button
            className={`w-[30px] h-[30px] flex items-center justify-center bg-[#c0c0c0] ${raised} active:border-t-[#808080] active:border-l-[#808080] active:border-b-white active:border-r-white`}
            onClick={reset}
            aria-label="New game"
          >
            <Face mood={mood} />
          </button>
          <LedCounter value={time} />
        </div>

        <div
          className={`grid ${sunken}`}
          style={{ gridTemplateColumns: `repeat(${COLS}, ${CELL}px)` }}
          onMouseLeave={() => setPressing(false)}
        >
          {board.map((cell, i) => {
            const showNumber = cell.revealed && !cell.mine && cell.adjacent > 0;
            const wrongFlag = status === "lost" && cell.flagged && !cell.mine;
            return (
              <button
                key={i}
                className={`flex items-center justify-center font-bold leading-none [-webkit-touch-callout:none] ${
                  cell.revealed
                    ? `border-l border-t border-[#808080] ${i === exploded ? "bg-[#ff0000]" : "bg-[#c0c0c0]"}`
                    : `bg-[#c0c0c0] ${raised}`
                }`}
                style={{
                  width: CELL,
                  height: CELL,
                  fontSize: IS_TOUCH ? 18 : 13,
                  color: showNumber ? NUMBER_COLORS[cell.adjacent] : undefined,
                }}
                onMouseDown={(e) => {
                  if (e.button === 0 && status !== "won" && status !== "lost") setPressing(true);
                }}
                onMouseUp={() => setPressing(false)}
                onTouchStart={() => {
                  longPressed.current = false;
                  pressTimer.current = setTimeout(() => {
                    longPressed.current = true;
                    toggleFlag(i);
                  }, LONG_PRESS_MS);
                }}
                onTouchMove={() => clearTimeout(pressTimer.current)}
                onTouchEnd={() => clearTimeout(pressTimer.current)}
                onClick={() => {
                  if (longPressed.current) {
                    longPressed.current = false;
                    return;
                  }
                  reveal(i);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  // On touch screens the long-press timer already flagged it
                  if (!IS_TOUCH) toggleFlag(i);
                }}
              >
                {cell.revealed && cell.mine ? (
                  <Mine />
                ) : cell.flagged ? (
                  wrongFlag ? <span className="text-[#ff0000]">✕</span> : <Flag />
                ) : showNumber ? (
                  cell.adjacent
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
