import React, { useEffect, useRef, useState } from "react";

const FONT_SIZE = 15;
const LINE_HEIGHT = 19;
const STRETCH = 1.1;
const RIM = [224, 120, 0];
const FILL = [255, 200, 0];

// The classic shutdown text was a tiny bitmap stretched to fill the screen.
// Draw the text at low resolution, then scale it up with no smoothing.
const PixelText: React.FC<{ lines: string[]; maxScale: number; fitWidth?: number }> = ({
  lines,
  maxScale,
  fitWidth,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cssWidth, setCssWidth] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const font = `bold ${FONT_SIZE}px Verdana, "Arial Black", sans-serif`;
    const setup = () => {
      ctx.font = font;
      // Wider letter spacing like the original (ignored where unsupported)
      (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = "1px";
    };
    setup();
    const textWidth = Math.max(...lines.map((line) => ctx.measureText(line).width));
    canvas.width = Math.ceil(textWidth * STRETCH) + 6;
    canvas.height = lines.length * LINE_HEIGHT + 4;

    setup();
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.setTransform(STRETCH, 0, 0, 1, canvas.width / 2, 2);
    lines.forEach((line, i) => {
      const y = i * LINE_HEIGHT;
      ctx.fillStyle = `rgb(${RIM})`;
      for (const [dx, dy] of [[-1, 0], [1, 0], [0, 1], [1, 1]]) {
        ctx.fillText(line, dx / STRETCH, y + dy);
      }
      ctx.fillStyle = `rgb(${FILL})`;
      ctx.fillText(line, 0, y);
    });

    // Snap every pixel to solid fill, solid rim or empty, so the scaled-up
    // text has crisp blocky edges instead of blurry anti-aliasing.
    const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const px = image.data;
    for (let i = 0; i < px.length; i += 4) {
      if (px[i + 3] < 110) {
        px[i + 3] = 0;
        continue;
      }
      const color = px[i + 1] > 160 ? FILL : RIM;
      px[i] = color[0];
      px[i + 1] = color[1];
      px[i + 2] = color[2];
      px[i + 3] = 255;
    }
    ctx.putImageData(image, 0, 0);

    // Whole-number scaling keeps every pixel block the same size
    const fit = fitWidth ? fitWidth / canvas.width : maxScale;
    const scale = Math.max(1, Math.floor(Math.min(maxScale, fit)));
    setCssWidth(canvas.width * scale);
  }, [lines, maxScale, fitWidth]);

  return (
    <canvas
      ref={canvasRef}
      aria-label={lines.join(" ")}
      style={{ width: cssWidth, imageRendering: "pixelated" }}
    />
  );
};

interface ShutdownScreenProps {
  onReturn: () => void;
}

const HEADLINE = ["It’s now safe to email Abe", "to join your company."];
const HEADLINE_NARROW = ["It’s now safe", "to email Abe", "to join your", "company."];
const EMAIL_LABEL = ["Email Abe"];
const RETURN_LABEL = ["Return"];

const ShutdownScreen: React.FC<ShutdownScreenProps> = ({ onReturn }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onReturn();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onReturn]);

  // Just pixel text, like the original screen: a pixel underline marks hover
  const buttonClass =
    "px-2 pb-1 border-b-[4px] border-transparent opacity-80 hover:opacity-100 hover:border-[#e07800] focus-visible:outline-none focus-visible:opacity-100 focus-visible:border-[#e07800]";

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center gap-14 px-4">
      <PixelText
        lines={window.innerWidth < 640 ? HEADLINE_NARROW : HEADLINE}
        maxScale={3}
        fitWidth={window.innerWidth * 0.9}
      />
      <div className="flex flex-wrap justify-center gap-x-16 gap-y-4">
        <a href="mailto:abe@raouh.com" className={buttonClass}>
          <PixelText lines={EMAIL_LABEL} maxScale={2} />
        </a>
        <button className={buttonClass} onClick={onReturn}>
          <PixelText lines={RETURN_LABEL} maxScale={2} />
        </button>
      </div>
    </div>
  );
};

export default ShutdownScreen;
