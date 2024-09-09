import React, { useState, useEffect, useCallback } from "react";

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const COUNTDOWN_TIME = 3;

// Custom Button component
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  ...props
}) => (
  <button
    {...props}
    className="bg-[#0A246A] hover:bg-[#3A6EA5] text-white font-bold py-2 px-4 border-2 border-[#0A246A] focus:outline-none focus:shadow-outline"
  >
    {children}
  </button>
);

export default function SnakeGame() {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN_TIME);

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
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted || countdown > 0) return;

      switch (e.key) {
        case "ArrowUp":
          setDirection((prev) => (prev.y !== 1 ? { x: 0, y: -1 } : prev));
          break;
        case "ArrowDown":
          setDirection((prev) => (prev.y !== -1 ? { x: 0, y: 1 } : prev));
          break;
        case "ArrowLeft":
          setDirection((prev) => (prev.x !== 1 ? { x: -1, y: 0 } : prev));
          break;
        case "ArrowRight":
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
    <div className="w-full h-full bg-[#ECE9D8] p-4 flex flex-col items-center justify-center font-sans">
      <div className="relative w-[420px] h-[420px] bg-[#3A6EA5] p-2">
        <div className="w-[400px] h-[400px] bg-[#AAD751]  border-[#578A34] relative">
          {snake.map((segment, i) => (
            <div
              key={i}
              className="absolute w-[18px] h-[18px] bg-[#4A752C] border border-[#578A34]"
              style={{
                left: `${segment.x * CELL_SIZE}px`,
                top: `${segment.y * CELL_SIZE}px`,
              }}
            />
          ))}
          <div
            className="absolute w-[18px] h-[18px] bg-[#E7471D] border border-[#AA2B0F]"
            style={{
              left: `${food.x * CELL_SIZE}px`,
              top: `${food.y * CELL_SIZE}px`,
            }}
          />
          {gameStarted && countdown > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <span className="text-white text-6xl font-bold">{countdown}</span>
            </div>
          )}
        </div>
      </div>
      {!gameStarted && !gameOver && (
        <div className="mt-4 text-center">
          <p className="mb-2 text-[#0A246A]">
            Use arrow keys to control the snake.
          </p>
          <Button onClick={startCountdown}>Start Game</Button>
        </div>
      )}
      {gameOver && (
        <div className="text-[#0A246A] text-center mt-4">
          <p className="mb-2">Game Over!</p>
          <Button
            onClick={() => {
              resetGame();
              startCountdown();
            }}
          >
            Restart Game
          </Button>
        </div>
      )}
      {gameStarted && !gameOver && countdown === 0 && (
        <p className="text-[#0A246A] mt-2 text-xl">Score: {snake.length - 1}</p>
      )}
    </div>
  );
}
