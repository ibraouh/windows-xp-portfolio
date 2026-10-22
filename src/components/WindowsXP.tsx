import React, { useState, useEffect, useRef } from "react";
import "../fonts/fonts.css";
import DesktopIcon from "./DesktopIcons.tsx";
import Window from "./Window.tsx";
import Taskbar from "./Taskbar.tsx";
import StartMenu from "./StartMenu.tsx";
import ContextMenu from "./ContextMenu.tsx";
import ShutdownScreen from "./ShutdownScreen.tsx";
import { useWindowManager } from "../hooks/useWindowManager.tsx";
import windowsData from "../data/windowsData.json";

const ICONS_PER_COLUMN = 6;
const MAX_CELL = 94;
const MIN_CELL = 72;

// Desktop icons fill columns of six, top to bottom. On short screens the
// icons shrink to keep six per column, and only below MIN_CELL do columns get shorter.
const getDesktopLayout = (available: number) => {
  const cell = Math.max(MIN_CELL, Math.min(MAX_CELL, Math.floor(available / ICONS_PER_COLUMN)));
  const rows = Math.max(1, Math.min(ICONS_PER_COLUMN, Math.floor(available / cell)));
  return { cell, rows };
};

export default function WindowsXP() {
  const {
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
  } = useWindowManager();
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [maximizedWindows, setMaximizedWindows] = useState({});
  const [shutDown, setShutDown] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [desktopLayout, setDesktopLayout] = useState(() =>
    getDesktopLayout(window.innerHeight - 50)
  );
  const desktopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Size the icon grid from the space the desktop really has, which accounts
  // for the taskbar, iOS toolbars and safe areas.
  useEffect(() => {
    const desktop = desktopRef.current;
    if (!desktop) return;
    const measure = () => {
      const { paddingTop, paddingBottom } = getComputedStyle(desktop);
      const available =
        desktop.clientHeight - parseFloat(paddingTop) - parseFloat(paddingBottom);
      setDesktopLayout(getDesktopLayout(available));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(desktop);
    return () => observer.disconnect();
  }, []);

  const toggleMaximize = (windowId) => {
    setMaximizedWindows((prev) => ({
      ...prev,
      [windowId]: !prev[windowId],
    }));
  };

  const openFromMenu = (id: string, title: string) => {
    setStartMenuOpen(false);
    setContextMenu(null);
    openWindow(id, title);
  };

  const refreshDesktop = () => {
    setContextMenu(null);
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 150);
  };

  return (
    <div
      className="xp-root xp-font bg-[url('bliss.jpg')] bg-cover overflow-hidden relative select-none flex flex-col"
      style={{ "--xp-cell": `${desktopLayout.cell}px` } as React.CSSProperties}
      onMouseDown={() => setContextMenu(null)}
    >
      <div
        ref={desktopRef}
        className="flex-grow min-h-0 p-1 pt-[calc(4px+env(safe-area-inset-top))] grid grid-flow-col content-start justify-start"
        style={{
          gridTemplateRows: `repeat(${desktopLayout.rows}, ${desktopLayout.cell}px)`,
          gridAutoColumns: `${desktopLayout.cell}px`,
        }}
        onMouseDown={() => {
          setSelectedIcon(null);
          deactivateWindows();
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          if (!isMobile) setContextMenu({ x: e.clientX, y: e.clientY });
        }}
      >
        {!refreshing &&
          windowsData.desktopIcons.map((icon) => (
            <DesktopIcon
              key={icon.id}
              icon={icon.icon_id}
              title={icon.title}
              description={icon.description}
              selected={selectedIcon === icon.id}
              isMobile={isMobile}
              onSelect={() => {
                setSelectedIcon(icon.id);
                setContextMenu(null);
              }}
              onOpen={() => openWindow(icon.id, icon.title)}
            />
          ))}
      </div>

      <div className="absolute right-1 bottom-[calc(42px+env(safe-area-inset-bottom))]">
        <DesktopIcon
          icon={windowsData.recycleBin.icon_id}
          title={windowsData.recycleBin.title}
          description={windowsData.recycleBin.description}
          selected={selectedIcon === windowsData.recycleBin.id}
          isMobile={isMobile}
          onSelect={() => {
            setSelectedIcon(windowsData.recycleBin.id);
            setContextMenu(null);
          }}
          onOpen={() =>
            openWindow(windowsData.recycleBin.id, windowsData.recycleBin.title)
          }
        />
      </div>

      {windows.map(
        (window) =>
          !window.isMinimized && (
            <Window
              key={window.id}
              window={window}
              isActive={activeWindow === window.id}
              isMaximized={!!maximizedWindows[window.id]}
              isMobile={isMobile}
              onActivate={() => activateWindow(window.id)}
              onMinimize={() => minimizeWindow(window.id)}
              onToggleMaximize={() => toggleMaximize(window.id)}
              onClose={() => closeWindow(window.id)}
              onMove={moveWindow}
              onResize={resizeWindow}
            >
              {window.content}
            </Window>
          )
      )}

      <Taskbar
        windows={windows}
        activeWindow={activeWindow}
        onStartClick={() => setStartMenuOpen(!startMenuOpen)}
        onShowDesktop={() => {
          setStartMenuOpen(false);
          minimizeAllWindows();
        }}
        onTaskClick={(window) => {
          setStartMenuOpen(false);
          if (activeWindow === window.id && !window.isMinimized) {
            minimizeWindow(window.id);
          } else {
            activateWindow(window.id);
          }
        }}
      />

      {startMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onMouseDown={() => setStartMenuOpen(false)}
          />
          <StartMenu
            onOpen={openFromMenu}
            onLogOff={() => {
              setStartMenuOpen(false);
              closeAllWindows();
            }}
            onTurnOff={() => {
              setStartMenuOpen(false);
              setShutDown(true);
            }}
          />
        </>
      )}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onRefresh={refreshDesktop}
          onProperties={() => openFromMenu("control", "About this site")}
        />
      )}

      {shutDown && <ShutdownScreen onReturn={() => setShutDown(false)} />}
    </div>
  );
}
