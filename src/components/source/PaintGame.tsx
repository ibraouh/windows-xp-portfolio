import React, { useRef, useState, useEffect } from "react";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const ColorButton: React.FC<{
  color: string;
  isSelected: boolean;
  onClick: () => void;
}> = ({ color, isSelected, onClick }) => (
  <button
    className={`w-8 h-8 m-1 border-2 ${
      isSelected ? "border-black" : "border-gray-400"
    }`}
    style={{ backgroundColor: color }}
    onClick={onClick}
  />
);

export default function WindowsXPPaint() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(2);

  const colors = [
    "#000000",
    "#FFFFFF",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#00FFFF",
    "#FF00FF",
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      ctx.beginPath(); // Start a new path when stopping drawing
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      const rect = canvas?.getBoundingClientRect();
      const x = e.clientX - (rect?.left ?? 0);
      const y = e.clientY - (rect?.top ?? 0);

      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
  };

  return (
    <div className="bg-[#ECE9D8] p-1 rounded-lg shadow-lg border-2 border-[#0054E3]">
      <div className="bg-[#F0F0F0] p-1 mb-1 flex items-center border border-[#919B9C]">
        <div className="flex flex-wrap mr-4">
          {colors.map((c) => (
            <ColorButton
              key={c}
              color={c}
              isSelected={color === c}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
        <div className="flex items-center">
          <span className="mr-2 text-sm">Brush Size:</span>
          <input
            type="range"
            min="1"
            max="20"
            value={lineWidth}
            onChange={(e) => setLineWidth(parseInt(e.target.value))}
            className="w-32"
          />
        </div>
        <button
          className="ml-4 bg-[#E1E1E1] hover:bg-[#C7C7C7] text-black px-4 py-1 rounded border border-[#919B9C] text-sm font-bold"
          onClick={clearCanvas}
        >
          Clear
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onMouseMove={draw}
        className="border border-[#919B9C] cursor-crosshair bg-white"
      />
    </div>
  );
}
