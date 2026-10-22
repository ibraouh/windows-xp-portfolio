import React, { useState, useEffect } from "react";
import "../fonts/fonts.css";
import DesktopIcon from "./DesktopIcons.tsx";
import Window from "./Window.tsx";
import Taskbar from "./Taskbar.tsx";
import StartMenu from "./StartMenu.tsx";
import ContextMenu from "./ContextMenu.tsx";
import ShutdownScreen from "./ShutdownScreen.tsx";
import { useWindowManager, TASKBAR_HEIGHT } from "../hooks/useWindowManager.tsx";
import windowsData from "../data/windowsData.json";

const ICONS_PER_COLUMN = 6;
const MAX_CELL = 94;
const MIN_CELL = 72;

// Desktop icons fill columns of six, top to bottom. On short screens the
// icons shrink to keep six per column, and only below MIN_CELL do columns get shorter.
const getDesktopLayout = () => {
  const available = window.innerHeight - TASKBAR_HEIGHT - 8;
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
  const [desktopLayout, setDesktopLayout] = useState(getDesktopLayout);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
      setDesktopLayout(getDesktopLayout());
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    function setVH() {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }

    setVH();
    window.addEventListener("resize", setVH);

    // Add meta viewport tag for iOS
    const viewportMeta = document.createElement("meta");
    viewportMeta.name = "viewport";
    viewportMeta.content =
      "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
    document.getElementsByTagName("head")[0].appendChild(viewportMeta);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("resize", setVH);
    };
  }, []);

  const renderWindowContent = (window) => {
    if (isMobile && (window.id === "snake" || window.id === "paint")) {
      return (
        <div className="p-4">
          <p>Snake and Paint need a mouse and keyboard. Catch them on a laptop.</p>
        </div>
      );
    }
    return window.content;
  };

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
      className="xp-font h-screen h-[calc(var(--vh,1vh)*100)] bg-[url('bliss.jpg')] bg-cover overflow-hidden relative select-none flex flex-col"
      style={{ "--xp-cell": `${desktopLayout.cell}px` } as React.CSSProperties}
      onMouseDown={() => setContextMenu(null)}
    >
      <div
        className="flex-grow min-h-0 p-1 grid grid-flow-col content-start justify-start"
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

      <div className="absolute right-1 bottom-[42px]">
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
              {renderWindowContent(window)}
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
