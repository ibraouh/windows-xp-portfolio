import React, { useState, useEffect, useCallback } from "react";

const GRID_SIZE = 20;
const CELL_SIZE = 20;

// Custom Button component
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  ...props
}) => (
  <button
    {...props}
    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
    setGameStarted(true);
  }, [generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted) return;

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
  }, [gameStarted]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

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
  }, [direction, food, gameOver, gameStarted, generateFood]);

  return (
    <div className="w-full h-full bg-gray-900 p-4 flex flex-col items-center justify-center">
      <div className="relative w-[400px] h-[400px] bg-gray-800 border-2 border-green-500">
        {snake.map((segment, i) => (
          <div
            key={i}
            className="absolute w-[20px] h-[20px] bg-green-500"
            style={{
              left: `${segment.x * CELL_SIZE}px`,
              top: `${segment.y * CELL_SIZE}px`,
            }}
          />
        ))}
        <div
          className="absolute w-[20px] h-[20px] bg-red-500"
          style={{
            left: `${food.x * CELL_SIZE}px`,
            top: `${food.y * CELL_SIZE}px`,
          }}
        />
      </div>
      {!gameStarted && !gameOver && (
        <Button className="mt-4" onClick={resetGame}>
          Start Game
        </Button>
      )}
      {gameOver && (
        <div className="text-white text-center mt-4">
          <p className="mb-2">Game Over!</p>
          <Button onClick={resetGame}>Restart Game</Button>
        </div>
      )}
      {gameStarted && !gameOver && (
        <p className="text-white mt-2">Score: {snake.length - 1}</p>
      )}
    </div>
  );
}
