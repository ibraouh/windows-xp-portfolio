import { useState } from "react";
import { Window } from "../types/types";
import WindowContent from "../components/WindowContent.tsx";
import React from "react";

export const useWindowManager = () => {
  const [windows, setWindows] = useState<Window[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);

  const openWindow = (id: string, title: string) => {
    const existingWindow = windows.find((w) => w.id === id);
    if (existingWindow) {
      activateWindow(id);
    } else {
      const newWindow: Window = {
        id,
        title,
        content: <WindowContent id={id} />,
        isMinimized: false,
        position: { x: Math.random() * 100 + 50, y: Math.random() * 100 + 50 },
        zIndex: windows.length,
      };
      setWindows([...windows, newWindow]);
      setActiveWindow(id);
    }
  };

  const closeWindow = (id: string) => {
    setWindows(windows.filter((w) => w.id !== id));
    if (activeWindow === id) setActiveWindow(null);
  };

  const minimizeWindow = (id: string) => {
    setWindows(
      windows.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
    setActiveWindow(null);
  };

  const activateWindow = (id: string) => {
    setWindows(
      windows.map((w, index) =>
        w.id === id
          ? { ...w, isMinimized: false, zIndex: windows.length }
          : { ...w, zIndex: index }
      )
    );
    setActiveWindow(id);
  };

  const moveWindow = (id: string, x: number, y: number) => {
    setWindows(
      windows.map((w) => (w.id === id ? { ...w, position: { x, y } } : w))
    );
  };

  return {
    windows,
    activeWindow,
    openWindow,
    closeWindow,
    minimizeWindow,
    activateWindow,
    moveWindow,
  };
};
