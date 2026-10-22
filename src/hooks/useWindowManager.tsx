import { useState } from "react";
import { Window } from "../types/types";
import WindowContent from "../components/WindowContent.tsx";
import React from "react";

export const TASKBAR_HEIGHT = 38;

export const MIN_WINDOW_SIZE = { width: 220, height: 160 };

// Windows that fit their content open at their own size.
const DEFAULT_SIZES: Record<string, { width: number; height: number }> = {
  // Touch screens get bigger Minesweeper cells, so a bigger window
  minesweeper: window.matchMedia("(pointer: coarse)").matches
    ? { width: 344, height: 470 }
    : { width: 236, height: 352 },
  snake: { width: 480, height: 600 },
  recycle: { width: 640, height: 360 },
  control: { width: 520, height: 420 },
  legal: { width: 560, height: 520 },
};

// New windows fit the screen and open at a random spot where they're fully
// visible, clear of the desktop icon column when there's room.
const getInitialBounds = (id: string) => {
  const preferred = DEFAULT_SIZES[id] || { width: 680, height: 650 };
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight - TASKBAR_HEIGHT;
  const width = Math.min(preferred.width, screenWidth - 40);
  const height = Math.min(preferred.height, screenHeight - 40);
  const room = screenWidth - width;
  // Desktop icons take two 94px columns on the left
  const minX = room > 250 ? 210 : room > 140 ? 110 : 0;
  const maxX = Math.max(minX, screenWidth - width - 20);
  const maxY = Math.max(0, screenHeight - height - 10);

  return {
    size: { width, height },
    position: {
      x: Math.round(minX + Math.random() * (maxX - minX)),
      y: Math.round(Math.random() * maxY),
    },
  };
};

// Puts one window on top and renumbers the rest 1..n in their current
// stacking order, so z-indexes stay below the taskbar and start menu.
const bringToFront = (list: Window[], id: string): Window[] => {
  const target = list.find((w) => w.id === id);
  if (!target) return list;
  const topZ = Math.max(...list.map((w) => w.zIndex));
  if (target.zIndex === topZ && !target.isMinimized) return list;

  const order = list
    .filter((w) => w.id !== id)
    .sort((a, b) => a.zIndex - b.zIndex)
    .concat(target);
  return list.map((w) => ({
    ...w,
    zIndex: order.indexOf(w) + 1,
    isMinimized: w.id === id ? false : w.isMinimized,
  }));
};

export const useWindowManager = () => {
  const [windows, setWindows] = useState<Window[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);

  // Every update reads the latest state: a drag keeps calling moveWindow from
  // the render where it started, and stale copies used to undo bringToFront.
  const openWindow = (id: string, title: string) => {
    setWindows((prev) => {
      if (prev.some((w) => w.id === id)) return bringToFront(prev, id);
      const newWindow: Window = {
        id,
        title,
        content: <WindowContent id={id} />,
        isMinimized: false,
        ...getInitialBounds(id),
        zIndex: prev.length + 1,
      };
      return [...prev, newWindow];
    });
    setActiveWindow(id);
  };

  const closeWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    setActiveWindow((prev) => (prev === id ? null : prev));
  };

  const minimizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
    setActiveWindow(null);
  };

  const activateWindow = (id: string) => {
    setWindows((prev) => bringToFront(prev, id));
    setActiveWindow(id);
  };

  const moveWindow = (id: string, x: number, y: number) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, position: { x, y: Math.max(0, y) } } : w
      )
    );
  };

  const resizeWindow = (
    id: string,
    bounds: { x: number; y: number; width: number; height: number }
  ) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              position: { x: bounds.x, y: Math.max(0, bounds.y) },
              size: { width: bounds.width, height: bounds.height },
            }
          : w
      )
    );
  };

  const minimizeAllWindows = () => {
    setWindows((prev) => prev.map((w) => ({ ...w, isMinimized: true })));
    setActiveWindow(null);
  };

  const closeAllWindows = () => {
    setWindows([]);
    setActiveWindow(null);
  };

  const deactivateWindows = () => setActiveWindow(null);

  return {
    windows,
    activeWindow,
    openWindow,
    closeWindow,
    minimizeWindow,
    activateWindow,
    moveWindow,
    resizeWindow,
    minimizeAllWindows,
    closeAllWindows,
    deactivateWindows,
  };
};
