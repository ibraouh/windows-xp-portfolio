export const handleWindowDrag = (
  e: React.MouseEvent,
  window: { id: string; position: { x: number; y: number } },
  moveWindow: (id: string, x: number, y: number) => void
) => {
  const startX = e.clientX - window.position.x;
  const startY = e.clientY - window.position.y;

  const onMouseMove = (e: MouseEvent) => {
    moveWindow(window.id, e.clientX - startX, e.clientY - startY);
  };

  const onMouseUp = () => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
};

// Edge or corner being dragged: n, s, e, w, ne, nw, se, sw
export type ResizeDirection = string;

export const handleWindowResize = (
  e: React.MouseEvent,
  window: {
    id: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
  },
  direction: ResizeDirection,
  minSize: { width: number; height: number },
  resizeWindow: (
    id: string,
    bounds: { x: number; y: number; width: number; height: number }
  ) => void
) => {
  e.preventDefault();
  e.stopPropagation();
  const startX = e.clientX;
  const startY = e.clientY;
  const { x, y } = window.position;
  const { width, height } = window.size;

  const onMouseMove = (e: MouseEvent) => {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    let next = { x, y, width, height };

    if (direction.includes("e")) {
      next.width = Math.max(minSize.width, width + dx);
    }
    if (direction.includes("s")) {
      next.height = Math.max(minSize.height, height + dy);
    }
    if (direction.includes("w")) {
      next.width = Math.max(minSize.width, width - dx);
      next.x = x + width - next.width;
    }
    if (direction.includes("n")) {
      // Stop at the top of the screen so the title bar stays reachable
      next.height = Math.min(y + height, Math.max(minSize.height, height - dy));
      next.y = y + height - next.height;
    }
    resizeWindow(window.id, next);
  };

  const onMouseUp = () => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    document.body.style.cursor = "";
  };

  document.body.style.cursor = getComputedStyle(e.currentTarget as Element).cursor;
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
};
