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
