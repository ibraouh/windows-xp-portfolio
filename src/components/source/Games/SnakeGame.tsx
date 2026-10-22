import React, { useState, useEffect, useCallback } from "react";
import MessageBox from "../../MessageBox.tsx";

const GRID_SIZE = 20;
const CELL_SIZE = 20;
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

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted || countdown > 0) return;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          setDirection((prev) => (prev.y !== 1 ? { x: 0, y: -1 } : prev));
          break;
        case "ArrowDown":
          e.preventDefault();
          setDirection((prev) => (prev.y !== -1 ? { x: 0, y: 1 } : prev));
          break;
        case "ArrowLeft":
          e.preventDefault();
          setDirection((prev) => (prev.x !== 1 ? { x: -1, y: 0 } : prev));
          break;
        case "ArrowRight":
          e.preventDefault();
          setDirection((prev) => (prev.x !== -1 ? { x: 1, y: 0 } : prev));
          break;
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameStarted, countdown]);

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
    <div className="h-full min-h-full bg-[#ece9d8] flex flex-col">
      <div className="flex-grow flex flex-col items-center justify-center gap-3 p-3">
        <div className="w-[406px] flex justify-between">
          <Counter label="Score" value={score} />
          <Counter label="Best" value={best} />
        </div>

        <div className={`relative ${sunken}`}>
          <div className="w-[400px] h-[400px] bg-[#aad751] relative">
            {snake.map((segment, i) => (
              <div
                key={i}
                className="absolute w-[20px] h-[20px] bg-[#4a752c] border-2 border-t-[#6b9a45] border-l-[#6b9a45] border-b-[#2f4d1b] border-r-[#2f4d1b]"
                style={{
                  left: `${segment.x * CELL_SIZE}px`,
                  top: `${segment.y * CELL_SIZE}px`,
                }}
              />
            ))}
            <div
              className="absolute w-[20px] h-[20px] bg-[#e7471d] border-2 border-t-[#ff8a66] border-l-[#ff8a66] border-b-[#9a2a0c] border-r-[#9a2a0c] rounded-full"
              style={{
                left: `${food.x * CELL_SIZE}px`,
                top: `${food.y * CELL_SIZE}px`,
              }}
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
              Use the arrow keys to steer. Eat the red dots, and don't hit the walls or yourself.
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
      </div>

      <div className="xp-statusbar">
        {gameStarted && !gameOver && countdown === 0 ? "Playing" : "Ready"}
      </div>
    </div>
  );
}
