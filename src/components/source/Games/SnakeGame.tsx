import React, { useState, useEffect, useCallback, useRef } from "react";
import MessageBox from "../../MessageBox.tsx";

const GRID_SIZE = 20;
const MAX_CELL = 20;
const MIN_CELL = 12;
const COUNTDOWN_TIME = 3;
const BEST_KEY = "abes-xp-snake-best";

const sunken = "border-[3px] border-t-[#808080] border-l-[#808080] border-b-white border-r-white";

const readBest = () => {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
};

const saveBest = (score: number) => {
  try {
    localStorage.setItem(BEST_KEY, String(score));
  } catch {
    // Storage can be blocked; the best score just won't persist.
  }
};

type Turn = "up" | "down" | "left" | "right";

const ARROWS: Record<Turn, string> = { up: "▲", down: "▼", left: "◀", right: "▶" };

// Score readout styled like XP Minesweeper's red LED counters
const Counter: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="flex items-center gap-2 text-[12px]">
    <span>{label}</span>
    <span className="bg-black text-[#ff2020] font-mono font-bold text-[18px] leading-none px-1.5 py-0.5 tracking-widest border border-t-[#808080] border-l-[#808080] border-b-white border-r-white">
      {String(Math.min(value, 999)).padStart(3, "0")}
    </span>
  </div>
);

export default function SnakeGame() {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN_TIME);
  const [best, setBest] = useState(readBest);
  const [cell, setCell] = useState(MAX_CELL);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const isTouch = window.matchMedia("(pointer: coarse)").matches;

  // The board shrinks to fit narrow windows and phones
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const measure = () => {
      const fit = Math.floor((container.clientWidth - 30) / GRID_SIZE);
      setCell(Math.max(MIN_CELL, Math.min(MAX_CELL, fit)));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const score = snake.length - 1;

  const generateFood = useCallback(() => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  }, []);

  const resetGame = useCallback(() => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    setDirection({ x: 1, y: 0 });
    setGameOver(false);
    setGameStarted(false);
    setCountdown(COUNTDOWN_TIME);
  }, [generateFood]);

  const startCountdown = useCallback(() => {
    setGameStarted(true);
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    if (gameOver && score > best) {
      setBest(score);
      saveBest(score);
    }
  }, [gameOver, score, best]);

  const turn = useCallback(
    (to: Turn) => {
      if (!gameStarted || countdown > 0) return;
      setDirection((prev) => {
        if (to === "up") return prev.y !== 1 ? { x: 0, y: -1 } : prev;
        if (to === "down") return prev.y !== -1 ? { x: 0, y: 1 } : prev;
        if (to === "left") return prev.x !== 1 ? { x: -1, y: 0 } : prev;
        return prev.x !== -1 ? { x: 1, y: 0 } : prev;
      });
    },
    [gameStarted, countdown]
  );

  useEffect(() => {
    const keys: Record<string, Turn> = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
    };
    const handleKeyPress = (e: KeyboardEvent) => {
      const to = keys[e.key];
      if (!to || !gameStarted || countdown > 0) return;
      e.preventDefault();
      turn(to);
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameStarted, countdown, turn]);

  // Swipe on the board to steer
  const handleTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    const touch = e.changedTouches[0];
    touchStart.current = null;
    if (!start || !touch) return;
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
    if (Math.abs(dx) > Math.abs(dy)) turn(dx > 0 ? "right" : "left");
    else turn(dy > 0 ? "down" : "up");
  };

  useEffect(() => {
    if (!gameStarted || gameOver || countdown > 0) return;

    const moveSnake = setInterval(() => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = {
          x: newSnake[0].x + direction.x,
          y: newSnake[0].y + direction.y,
        };

        // Check for collision with border
        if (
          head.x < 0 ||
          head.x >= GRID_SIZE ||
          head.y < 0 ||
          head.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check for collision with self
        if (
          newSnake.some(
            (segment) => segment.x === head.x && segment.y === head.y
          )
        ) {
          setGameOver(true);
          return prevSnake;
        }

        newSnake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
          setFood(generateFood());
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 100);

    return () => clearInterval(moveSnake);
  }, [direction, food, gameOver, gameStarted, generateFood, countdown]);

  return (
    <div ref={containerRef} className="h-full min-h-full bg-[#ece9d8] flex flex-col">
      <div className="flex-grow flex flex-col items-center justify-center gap-3 p-3">
        <div className="flex justify-between" style={{ width: cell * GRID_SIZE + 6 }}>
          <Counter label="Score" value={score} />
          <Counter label="Best" value={best} />
        </div>

        <div className={`relative ${sunken}`}>
          <div
            className="bg-[#aad751] relative touch-none"
            style={{ width: cell * GRID_SIZE, height: cell * GRID_SIZE }}
            onTouchStart={(e) => {
              touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }}
            onTouchEnd={handleTouchEnd}
          >
            {snake.map((segment, i) => (
              <div
                key={i}
                className="absolute bg-[#4a752c] border-2 border-t-[#6b9a45] border-l-[#6b9a45] border-b-[#2f4d1b] border-r-[#2f4d1b]"
                style={{ left: segment.x * cell, top: segment.y * cell, width: cell, height: cell }}
              />
            ))}
            <div
              className="absolute bg-[#e7471d] border-2 border-t-[#ff8a66] border-l-[#ff8a66] border-b-[#9a2a0c] border-r-[#9a2a0c] rounded-full"
              style={{ left: food.x * cell, top: food.y * cell, width: cell, height: cell }}
            />
            {gameStarted && countdown > 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <span className="text-white text-6xl font-bold [text-shadow:2px_2px_#0f1089]">
                  {countdown}
                </span>
              </div>
            )}
          </div>

          {!gameStarted && !gameOver && (
            <MessageBox
              title="Snake"
              icon="/img/icons/snake.png"
              buttons={<button className="xp-button" onClick={startCountdown}>Start</button>}
            >
              {isTouch ? "Swipe on the board or tap the arrows to steer." : "Use the arrow keys to steer."} Eat the red dots, and don't hit the walls or yourself.
            </MessageBox>
          )}
          {gameOver && (
            <MessageBox
              title="Snake"
              icon="/img/icons/snake.png"
              buttons={
                <button
                  className="xp-button"
                  onClick={() => {
                    resetGame();
                    startCountdown();
                  }}
                >
                  Play again
                </button>
              }
            >
              <p className="font-bold mb-1">Game over!</p>
              <p>
                You scored {score}.{score > 0 && score >= best ? " That's a new best!" : ""}
              </p>
            </MessageBox>
          )}
        </div>

        {isTouch && (
          <div className="grid grid-cols-3 gap-1.5 select-none">
            {(["up", "left", "down", "right"] as Turn[]).map((to) => (
              <button
                key={to}
                aria-label={to}
                className={`xp-button !min-w-0 w-[56px] h-[42px] text-[16px] ${
                  to === "up" ? "col-start-2" : to === "left" ? "col-start-1" : ""
                }`}
                onTouchStart={() => turn(to)}
              >
                {ARROWS[to]}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="xp-statusbar">
        {gameStarted && !gameOver && countdown === 0 ? "Playing" : "Ready"}
      </div>
    </div>
  );
}
