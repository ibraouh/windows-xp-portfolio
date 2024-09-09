export type Window = {
  id: string;
  title: string;
  content: React.ReactNode;
  isMinimized: boolean;
  position: { x: number; y: number };
  zIndex: number;
};
