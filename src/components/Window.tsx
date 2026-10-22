import React from "react";
import { Window as WindowType } from "../types/types";
import { handleWindowDrag, handleWindowResize } from "../utils/windowUtils.ts";
import { MIN_WINDOW_SIZE } from "../hooks/useWindowManager.tsx";

// Menu bars match the kind of program each window pretends to be.
const MENUS: Record<string, string[]> = {
  snake: ["Game", "Help"],
  minesweeper: ["Game", "Help"],
  paint: ["File", "Edit", "View", "Image", "Colors", "Help"],
  default: ["File", "Edit", "View", "Favorites", "Tools", "Help"],
};

// Invisible strips along each edge and corner that resize the window
const RESIZE_HANDLES: { direction: string; className: string }[] = [
  { direction: "n", className: "top-[-3px] left-3 right-3 h-[6px] cursor-ns-resize" },
  { direction: "s", className: "bottom-[-3px] left-3 right-3 h-[6px] cursor-ns-resize" },
  { direction: "e", className: "right-[-3px] top-3 bottom-3 w-[6px] cursor-ew-resize" },
  { direction: "w", className: "left-[-3px] top-3 bottom-3 w-[6px] cursor-ew-resize" },
  { direction: "nw", className: "top-[-3px] left-[-3px] w-3 h-3 cursor-nwse-resize" },
  { direction: "ne", className: "top-[-3px] right-[-3px] w-3 h-3 cursor-nesw-resize" },
  { direction: "sw", className: "bottom-[-3px] left-[-3px] w-4 h-4 cursor-nesw-resize" },
  { direction: "se", className: "bottom-[-3px] right-[-3px] w-4 h-4 cursor-nwse-resize" },
];

const MinimizeGlyph = () => (
  <svg width="13" height="13" viewBox="0 0 13 13">
    <rect x="2" y="9" width="7" height="3" fill="#fff" />
  </svg>
);

const MaximizeGlyph = () => (
  <svg width="13" height="13" viewBox="0 0 13 13">
    <rect x="2" y="2" width="9" height="9" fill="none" stroke="#fff" strokeWidth="1.2" />
    <rect x="1.4" y="1.4" width="10.2" height="3" fill="#fff" />
  </svg>
);

const RestoreGlyph = () => (
  <svg width="13" height="13" viewBox="0 0 13 13">
    <rect x="4.5" y="1.5" width="7" height="7" fill="none" stroke="#fff" strokeWidth="1.2" />
    <rect x="3.9" y="0.9" width="8.2" height="2.2" fill="#fff" />
    <rect x="1.5" y="4.5" width="7" height="7" fill="#2a6ce9" stroke="#fff" strokeWidth="1.2" />
    <rect x="0.9" y="3.9" width="8.2" height="2.2" fill="#fff" />
  </svg>
);

const CloseGlyph = () => (
  <svg width="13" height="13" viewBox="0 0 13 13">
    <path d="M2.5 2.5l8 8M10.5 2.5l-8 8" stroke="#fff" strokeWidth="2.2" />
  </svg>
);

interface WindowProps {
  window: WindowType;
  isActive: boolean;
  isMaximized: boolean;
  isMobile: boolean;
  children: React.ReactNode;
  onActivate: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onClose: () => void;
  onMove: (id: string, x: number, y: number) => void;
  onResize: (
    id: string,
    bounds: { x: number; y: number; width: number; height: number }
  ) => void;
}

const Window: React.FC<WindowProps> = ({
  window,
  isActive,
  isMaximized,
  isMobile,
  children,
  onActivate,
  onMinimize,
  onToggleMaximize,
  onClose,
  onMove,
  onResize,
}) => {
  const fillsScreen = isMaximized || isMobile;
  const menus = MENUS[window.id] || MENUS.default;

  return (
    <div
      className={`xp-window ${isActive ? "" : "inactive"} ${
        fillsScreen
          ? "maximized fixed inset-x-0 top-[env(safe-area-inset-top)] bottom-[calc(38px+env(safe-area-inset-bottom))]"
          : "absolute"
      }`}
      style={
        fillsScreen
          ? { zIndex: window.zIndex }
          : {
              left: window.position.x,
              top: window.position.y,
              width: window.size.width,
              height: window.size.height,
              zIndex: window.zIndex,
            }
      }
      onMouseDown={onActivate}
    >
      <div
        className="xp-titlebar cursor-default"
        onMouseDown={(e) => {
          if (!fillsScreen) handleWindowDrag(e, window, onMove);
        }}
        onDoubleClick={() => {
          if (!isMobile) onToggleMaximize();
        }}
      >
        <img
          src={`/img/icons/${window.id}.png`}
          alt=""
          className="mr-1.5 h-4 w-4 flex-shrink-0"
        />
        <span className="truncate flex-grow">{window.title}</span>
        <div
          className="flex flex-shrink-0"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button className="xp-tb-btn" aria-label="Minimize" onClick={onMinimize}>
            <MinimizeGlyph />
          </button>
          {!isMobile && (
            <button
              className="xp-tb-btn"
              aria-label={isMaximized ? "Restore" : "Maximize"}
              onClick={onToggleMaximize}
            >
              {isMaximized ? <RestoreGlyph /> : <MaximizeGlyph />}
            </button>
          )}
          <button className="xp-tb-btn close" aria-label="Close" onClick={onClose}>
            <CloseGlyph />
          </button>
        </div>
      </div>

      <div className="xp-window-body">
        <div className="xp-menubar">
          {menus.map((menu) => (
            <span key={menu}>{menu}</span>
          ))}
        </div>
        <div className="xp-content">{children}</div>
      </div>

      {!fillsScreen &&
        RESIZE_HANDLES.map(({ direction, className }) => (
          <div
            key={direction}
            className={`absolute z-10 ${className}`}
            onMouseDown={(e) => {
              onActivate();
              handleWindowResize(e, window, direction, MIN_WINDOW_SIZE, onResize);
            }}
          />
        ))}
    </div>
  );
};

export default Window;
