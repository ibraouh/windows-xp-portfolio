import React, { useRef, useState, useEffect } from "react";

// Largest canvas; it shrinks to fit small windows and phones
const CANVAS_WIDTH = 560;
const CANVAS_HEIGHT = 420;

// XP Paint's default 28-color palette
const PALETTE = [
  ["#000000", "#808080", "#800000", "#808000", "#008000", "#008080", "#000080", "#800080", "#808040", "#004040", "#0080ff", "#004080", "#8000ff", "#804000"],
  ["#ffffff", "#c0c0c0", "#ff0000", "#ffff00", "#00ff00", "#00ffff", "#0000ff", "#ff00ff", "#ffff80", "#00ff80", "#80ffff", "#8080ff", "#ff0080", "#ff8040"],
];

type Tool = "pencil" | "brush" | "eraser" | "fill" | "picker";

const SIZES: Partial<Record<Tool, number[]>> = {
  brush: [1, 2, 4],
  eraser: [4, 6, 8, 10],
};

const sunken = "border border-t-[#808080] border-l-[#808080] border-b-white border-r-white";

const ToolIcon: React.FC<{ tool: Tool }> = ({ tool }) => {
  switch (tool) {
    case "pencil":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path d="M11 2l3 3-8 8-4 1 1-4z" fill="#f5c542" stroke="#000" />
          <path d="M3 10l3 3" stroke="#000" />
          <path d="M2 14l1-4 3 3z" fill="#e8c9a0" stroke="#000" />
        </svg>
      );
    case "brush":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path d="M14 1l-6 7 2 2 6-7z" fill="#a0522d" stroke="#000" />
          <path d="M8 8c-3 0-4 2-4 4s-2 2-3 2c3 1 7 0 8-4z" fill="#3060d0" stroke="#000" />
        </svg>
      );
    case "eraser":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path d="M2 11l6-6 5 5-4 4H5z" fill="#fff" stroke="#000" />
          <path d="M8 5l3-3 5 5-3 3z" fill="#f0a0b0" stroke="#000" />
        </svg>
      );
    case "fill":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path d="M3 8l5-5 5 5-5 5z" fill="#fff" stroke="#000" />
          <path d="M13 8c1 2 2 3 2 4s-1 2-2 0z" fill="#3060d0" stroke="#000" />
        </svg>
      );
    case "picker":
      return (
        <svg width="16" height="16" viewBox="0 0 16 16">
          <path d="M11 2l3 3-2 2-3-3z" fill="#555" stroke="#000" />
          <path d="M9 4l3 3-6 6-3 1 1-3z" fill="#fff" stroke="#000" />
        </svg>
      );
  }
};

const TOOLS: { tool: Tool; label: string }[] = [
  { tool: "pencil", label: "Pencil" },
  { tool: "brush", label: "Brush" },
  { tool: "eraser", label: "Eraser" },
  { tool: "fill", label: "Fill With Color" },
  { tool: "picker", label: "Pick Color" },
];

const hexToRgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const rgbToHex = (r: number, g: number, b: number) =>
  "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");

// Paint a single dab with hard pixel edges, like XP Paint (no anti-aliasing)
const stamp = (ctx: CanvasRenderingContext2D, x: number, y: number, tool: Tool, size: number) => {
  if (tool === "pencil") {
    ctx.fillRect(x, y, 1, 1);
  } else if (tool === "eraser") {
    ctx.fillRect(x - Math.floor(size / 2), y - Math.floor(size / 2), size, size);
  } else {
    for (let dy = -size; dy <= size; dy++) {
      const half = Math.floor(Math.sqrt(size * size - dy * dy));
      ctx.fillRect(x - half, y + dy, half * 2 + 1, 1);
    }
  }
};

// Bresenham line between two points, stamping each pixel along the way
const drawLine = (
  ctx: CanvasRenderingContext2D,
  from: { x: number; y: number },
  to: { x: number; y: number },
  tool: Tool,
  size: number
) => {
  let { x, y } = from;
  const dx = Math.abs(to.x - x);
  const dy = -Math.abs(to.y - y);
  const sx = x < to.x ? 1 : -1;
  const sy = y < to.y ? 1 : -1;
  let err = dx + dy;
  for (;;) {
    stamp(ctx, x, y, tool, size);
    if (x === to.x && y === to.y) break;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y += sy;
    }
  }
};

const floodFill = (ctx: CanvasRenderingContext2D, startX: number, startY: number, hex: string) => {
  const { width, height } = ctx.canvas;
  const image = ctx.getImageData(0, 0, width, height);
  const px = image.data;
  const at = (x: number, y: number) => (y * width + x) * 4;
  const start = at(startX, startY);
  const target = [px[start], px[start + 1], px[start + 2], px[start + 3]];
  const [r, g, b] = hexToRgb(hex);
  if (target[0] === r && target[1] === g && target[2] === b && target[3] === 255) return;

  const stack = [[startX, startY]];
  while (stack.length) {
    const [x, y] = stack.pop()!;
    if (x < 0 || y < 0 || x >= width || y >= height) continue;
    const i = at(x, y);
    if (px[i] !== target[0] || px[i + 1] !== target[1] || px[i + 2] !== target[2] || px[i + 3] !== target[3]) continue;
    px[i] = r;
    px[i + 1] = g;
    px[i + 2] = b;
    px[i + 3] = 255;
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
  ctx.putImageData(image, 0, 0);
};

export default function WindowsXPPaint() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number } | null>(null);
  const strokeRef = useRef<{ color: string; last: { x: number; y: number } } | null>(null);
  const [tool, setTool] = useState<Tool>("pencil");
  const [previousTool, setPreviousTool] = useState<Tool>("pencil");
  const [sizes, setSizes] = useState({ brush: 2, eraser: 6 });
  const [primary, setPrimary] = useState("#000000");
  const [secondary, setSecondary] = useState("#ffffff");
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);

  const getContext = () => canvasRef.current?.getContext("2d") ?? null;

  const clearCanvas = () => {
    const ctx = getContext();
    if (ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
  };

  // Pick the canvas size once, from the room the workspace has when Paint opens
  useEffect(() => {
    const workspace = workspaceRef.current;
    if (!workspace) return;
    setCanvasSize({
      width: Math.max(200, Math.min(CANVAS_WIDTH, workspace.clientWidth - 12)),
      height: Math.max(150, Math.min(CANVAS_HEIGHT, workspace.clientHeight - 12)),
    });
  }, []);

  useEffect(clearCanvas, [canvasSize]);

  const pointFrom = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(canvas.width - 1, Math.floor(e.clientX - rect.left))),
      y: Math.max(0, Math.min(canvas.height - 1, Math.floor(e.clientY - rect.top))),
    };
  };

  const selectTool = (next: Tool) => {
    if (next === "picker" && tool !== "picker") setPreviousTool(tool);
    setTool(next);
  };

  const size = tool === "brush" ? sizes.brush : tool === "eraser" ? sizes.eraser : 1;

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.button !== 0 && e.button !== 2) return;
    const ctx = getContext();
    if (!ctx) return;
    // Keep receiving the stroke even if the pointer leaves the canvas
    e.currentTarget.setPointerCapture(e.pointerId);
    const point = pointFrom(e);
    const isRight = e.button === 2;

    if (tool === "picker") {
      const [r, g, b] = ctx.getImageData(point.x, point.y, 1, 1).data;
      (isRight ? setSecondary : setPrimary)(rgbToHex(r, g, b));
      setTool(previousTool);
      return;
    }
    if (tool === "fill") {
      floodFill(ctx, point.x, point.y, isRight ? secondary : primary);
      return;
    }

    // The eraser paints with the background (secondary) color, as in XP
    const color = tool === "eraser" ? (isRight ? primary : secondary) : isRight ? secondary : primary;
    ctx.fillStyle = color;
    stamp(ctx, point.x, point.y, tool, size);
    strokeRef.current = { color, last: point };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const point = pointFrom(e);
    setCursor(point);
    const stroke = strokeRef.current;
    const ctx = getContext();
    if (!stroke || !ctx) return;
    ctx.fillStyle = stroke.color;
    drawLine(ctx, stroke.last, point, tool, size);
    stroke.last = point;
  };

  const endStroke = () => {
    strokeRef.current = null;
  };

  return (
    <div className="h-full min-h-full flex flex-col bg-[#ece9d8] text-[12px]">
      <div className="flex flex-grow min-h-0">
        {/* Toolbox */}
        <div className="flex flex-col items-center gap-2 p-1.5 border-r border-[#d8d2bd]">
          <div className="grid grid-cols-2 gap-[2px]">
            {TOOLS.map(({ tool: t, label }) => (
              <button
                key={t}
                title={label}
                aria-label={label}
                className={`w-[26px] h-[26px] flex items-center justify-center border ${
                  tool === t
                    ? "border-t-[#808080] border-l-[#808080] border-b-white border-r-white bg-[#f7f6f0]"
                    : "border-transparent hover:border-t-white hover:border-l-white hover:border-b-[#808080] hover:border-r-[#808080]"
                }`}
                onClick={() => selectTool(t)}
              >
                <ToolIcon tool={t} />
              </button>
            ))}
          </div>
          <div className={`w-[52px] min-h-[64px] flex flex-col items-center justify-center gap-1 py-1 bg-[#ece9d8] ${sunken}`}>
            {(SIZES[tool] || []).map((option) => {
              const selected = sizes[tool as "brush" | "eraser"] === option;
              const dot = tool === "brush" ? option * 2 + 1 : option;
              return (
                <button
                  key={option}
                  className={`w-[40px] h-[14px] flex items-center justify-center ${selected ? "bg-[#316ac5]" : ""}`}
                  onClick={() => setSizes({ ...sizes, [tool]: option })}
                  aria-label={`Size ${option}`}
                >
                  <span
                    className={tool === "brush" ? "rounded-full" : ""}
                    style={{ width: dot, height: dot, background: selected ? "#fff" : "#000" }}
                  />
                </button>
              );
            })}
          </div>
          <button className="xp-button !min-w-0 !px-2 text-[11px]" onClick={clearCanvas}>
            Clear
          </button>
        </div>

        {/* Workspace */}
        <div ref={workspaceRef} className="flex-grow min-w-0 overflow-auto bg-[#808080] p-1">
          {canvasSize && (
            <canvas
              ref={canvasRef}
              width={canvasSize.width}
              height={canvasSize.height}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={endStroke}
              onPointerCancel={endStroke}
              onPointerLeave={() => setCursor(null)}
              onContextMenu={(e) => e.preventDefault()}
              className="block bg-white shadow-[2px_2px_0_#404040] cursor-crosshair touch-none"
            />
          )}
        </div>
      </div>

      {/* Color box and palette */}
      <div className="flex items-center gap-1 px-1.5 py-1 border-t border-white">
        <div className={`relative w-[34px] h-[34px] bg-[#ece9d8] ${sunken}`}>
          <span className={`absolute right-[3px] bottom-[3px] w-[16px] h-[16px] ${sunken}`} style={{ background: secondary }} />
          <span className={`absolute left-[3px] top-[3px] w-[16px] h-[16px] ${sunken}`} style={{ background: primary }} />
        </div>
        <div className="flex flex-col gap-[1px]">
          {PALETTE.map((row, r) => (
            <div key={r} className="flex gap-[1px]">
              {row.map((color) => (
                <button
                  key={color}
                  className={`w-[16px] h-[16px] ${sunken}`}
                  style={{ background: color }}
                  aria-label={color}
                  onClick={() => setPrimary(color)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setSecondary(color);
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="xp-statusbar">
        <span className="flex-grow truncate">For Help, click Help Topics on the Help Menu.</span>
        <span className="xp-statusbar-cell w-[90px]">{cursor ? `${cursor.x},${cursor.y}` : ""}</span>
      </div>
    </div>
  );
}
