import React, { useState, useEffect } from "react";
import "../fonts/fonts.css";
import DesktopIcon from "./DesktopIcons.tsx";
import { useWindowManager } from "../hooks/useWindowManager.tsx";
import { handleWindowDrag } from "../utils/windowUtils.ts";
import windowsData from "../data/windowsData.json";

export default function WindowsXP() {
  const {
    windows,
    activeWindow,
    openWindow,
    closeWindow,
    minimizeWindow,
    activateWindow,
    moveWindow,
  } = useWindowManager();
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);
  const [maximizedWindows, setMaximizedWindows] = useState({});

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const checkMobile = () => setIsMobile(window.innerWidth < 640);

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
      clearInterval(timer);
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("resize", setVH);
    };
  }, []);

  const renderWindowContent = (window) => {
    if (isMobile && (window.id === "snake" || window.id === "paint")) {
      return (
        <div className="p-4">
          <p>This game can only be played on desktop and not mobile.</p>
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

  return (
    <div className="h-screen h-[calc(var(--vh,1vh)*100)] bg-[url('bliss.jpg')] bg-cover overflow-hidden relative select-none font-[Tahoma,sans-serif] flex flex-col">
      <div className="flex-grow overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-1 md:grid-cols-1 gap-4 content-start">
        {windowsData.desktopIcons.map((icon) => (
          <DesktopIcon
            key={icon.id}
            icon={icon.icon_id}
            title={icon.title}
            onClick={() => openWindow(icon.id, icon.title)}
          />
        ))}
      </div>

      {windows.map(
        (window) =>
          !window.isMinimized && (
            <div
              key={window.id}
              className={`absolute bg-gray-100 border border-gray-400 shadow-lg rounded-t-lg ${
                maximizedWindows[window.id]
                  ? "fixed inset-0 mt-0 mb-10"
                  : isMobile
                  ? "fixed inset-0 mt-0 mb-10"
                  : "w-[550px] h-[650px]"
              }`}
              style={{
                left:
                  maximizedWindows[window.id] || isMobile
                    ? 0
                    : window.position.x,
                top:
                  maximizedWindows[window.id] || isMobile
                    ? 0
                    : window.position.y,
                zIndex: window.zIndex,
                WebkitOverflowScrolling: "touch", // Enable momentum scrolling on iOS
              }}
            >
              <div
                className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-1 flex justify-between items-center cursor-move rounded-t"
                onTouchStart={(e) => {
                  if (!isMobile && !maximizedWindows[window.id]) {
                    handleWindowDrag(e, window, moveWindow);
                  }
                  activateWindow(window.id);
                }}
                onMouseDown={(e) => {
                  if (!isMobile && !maximizedWindows[window.id]) {
                    handleWindowDrag(e, window, moveWindow);
                  }
                  activateWindow(window.id);
                }}
              >
                <div className="flex items-center">
                  <img
                    src={`/img/icons/${window.id}.png`}
                    alt="icon"
                    className="mr-1 h-4 w-4 ml-1"
                  />
                  <span className="font-bold text-sm">{window.title}</span>
                </div>
                <div className="flex">
                  <button
                    className="px-1 py-0.5 hover:bg-[#1E6CEB] rounded"
                    onClick={() => minimizeWindow(window.id)}
                  >
                    <img
                      src={"/img/buttons/Minimize.png"}
                      alt="Minimize"
                      className="h-6 w-6"
                    />
                  </button>
                  <button
                    className="px-1 py-0.5 hover:bg-[#1E6CEB] rounded"
                    onClick={() => toggleMaximize(window.id)}
                  >
                    <img
                      src={
                        maximizedWindows[window.id]
                          ? "/img/buttons/restore.png"
                          : "/img/buttons/Maximize.png"
                      }
                      alt={maximizedWindows[window.id] ? "Restore" : "Maximize"}
                      className="h-6 w-6"
                    />
                  </button>
                  <button
                    className="px-1 py-0.5 hover:bg-[#E74856] rounded"
                    onClick={() => closeWindow(window.id)}
                  >
                    <img
                      src={"/img/buttons/Exit.png"}
                      alt="Close"
                      className="h-6 w-6"
                    />
                  </button>
                </div>
              </div>
              <div className="h-[calc(100%-28px)] overflow-auto -webkit-overflow-scrolling-touch">
                {renderWindowContent(window)}
              </div>
            </div>
          )
      )}

      <div className="flex-shrink-0 h-10 bg-gradient-to-r from-[#245EDC] to-[#3C81F3] flex items-center justify-between z-50">
        <div className="flex items-center h-full overflow-x-auto -webkit-overflow-scrolling-touch">
          <button
            className="px-0 py-0 flex-shrink-0"
            onClick={() => setStartMenuOpen(!startMenuOpen)}
          >
            <img
              src={"img/icons/logo.png"}
              alt="Windows XP Logo"
              className="w-30 h-10"
            />
          </button>
          <div className="flex space-x-1 ml-2 h-full items-center overflow-x-auto -webkit-overflow-scrolling-touch">
            {windows.map((window) => (
              <button
                key={window.id}
                className={`h-8 px-2 py-1 text-white rounded flex items-center flex-shrink-0 ${
                  activeWindow === window.id
                    ? "bg-[#1C3A80]"
                    : "bg-[#3C81F3] hover:bg-[#67A5F5]"
                }`}
                onClick={() => activateWindow(window.id)}
              >
                <img
                  src={`/img/icons/${window.id}.png`}
                  alt={`${window.title} icon`}
                  className="mr-2 h-4 w-4"
                />
                <span className="text-sm whitespace-nowrap">
                  {window.title}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="shadow-xl border-l-2 border-gray-600 bg-[#0C9DF0] px-5 py-2.5 text-white text-sm flex-shrink-0">
          {time.toLocaleTimeString()}
        </div>
      </div>

      {startMenuOpen && (
        <div className="fixed bottom-10 left-0 w-full sm:w-80 bg-[#D3E5FA] border-2 border-[#0A246A] rounded-tr-lg shadow-lg overflow-hidden z-50">
          <div className="bg-gradient-to-r from-[#1C3A80] to-[#3165C3] p-4 flex items-center">
            <img
              src="https://www.thispersondoesnotexist.com"
              alt="User"
              className="w-12 h-12 rounded border border-[#7AA5D7] mr-3 bg-black"
            />
            <div className="text-white font-bold text-lg">Future Employer</div>
          </div>
          <div className="flex flex-col sm:flex-row">
            <div className="w-full sm:w-3/5 p-2 space-y-1">
              <button
                className="w-full text-left p-2 hover:bg-[#316AC5] hover:text-white rounded flex items-center"
                onClick={() => {
                  setStartMenuOpen(false);
                  openWindow("about", "About Me");
                }}
              >
                <img
                  src="/img/icons/about.png"
                  alt="About Me"
                  className="w-7 h-7 mr-1.5"
                />
                <span className="text-sm">About Me</span>
              </button>
              <button
                className="w-full text-left p-2 hover:bg-[#316AC5] hover:text-white rounded flex items-center"
                onClick={() => {
                  setStartMenuOpen(false);
                  openWindow("resume", "Resume");
                }}
              >
                <img
                  src="/img/icons/resume.png"
                  alt="Resume"
                  className="w-7 h-7 mr-1.5"
                />
                <span className="text-sm">Resume</span>
              </button>
              <button
                className="w-full text-left p-2 hover:bg-[#316AC5] hover:text-white rounded flex items-center"
                onClick={() => {
                  setStartMenuOpen(false);
                  openWindow("snake", "Snake");
                }}
              >
                <img
                  src="/img/icons/snake.png"
                  alt="Snake"
                  className="w-7 h-7 mr-1.5"
                />
                <span className="text-sm">Snake</span>
              </button>
              <button
                className="w-full text-left p-2 hover:bg-[#316AC5] hover:text-white rounded flex items-center"
                onClick={() => {
                  setStartMenuOpen(false);
                  openWindow("paint", "Paint");
                }}
              >
                <img
                  src="/img/icons/paint.png"
                  alt="Paint"
                  className="w-7 h-7 mr-1.5"
                />
                <span className="text-sm">Paint</span>
              </button>
            </div>
            <div className="w-full sm:w-2/5 bg-[#9DBDE3] p-2 space-y-1">
              <button className="w-full text-left p-2 hover:bg-[#316AC5] hover:text-white rounded flex items-center">
                <img
                  src="/img/icons/myDocs.png"
                  alt="My Documents"
                  className="w-7 h-7 mr-1.5"
                />
                <span className="text-sm">My Docs</span>
              </button>
              <button className="w-full text-left p-2 hover:bg-[#316AC5] hover:text-white rounded flex items-center">
                <img
                  src="/img/icons/search.png"
                  alt="Search"
                  className="w-7 h-7 mr-1.5"
                />
                <span className="text-sm">Search</span>
              </button>
              <button
                className="w-full text-left p-2 hover:bg-[#316AC5] hover:text-white rounded flex items-center"
                onClick={() => {
                  setStartMenuOpen(false);
                  openWindow("legal", "Legal Notice");
                }}
              >
                <img
                  src="/img/icons/help.png"
                  alt="Help"
                  className="w-7 h-7 mr-1.5"
                />
                <span className="text-sm">Help</span>
              </button>
              <button
                className="w-full text-left p-2 hover:bg-[#316AC5] hover:text-white rounded flex items-center"
                onClick={() => {
                  setStartMenuOpen(false);
                  openWindow("legal", "Legal Notice");
                }}
              >
                <img
                  src="/img/icons/control.png"
                  alt="Control Panel"
                  className="w-7 h-7 mr-1.5"
                />
                <span className="text-sm">Control Panel</span>
              </button>
              <div className="border-t border-[#7AA5D7] my-2"></div>
              <button
                className="w-full text-left p-2 hover:bg-[#316AC5] hover:text-white rounded flex items-center"
                onClick={() => setStartMenuOpen(false)}
              >
                <img
                  src="/img/icons/logout.png"
                  alt="Log Off"
                  className="w-7 h-7 mr-1.5"
                />
                <span className="text-sm">Log Out</span>
              </button>
              <button
                className="w-full text-left p-2 hover:bg-[#316AC5] hover:text-white rounded flex items-center"
                onClick={() => setStartMenuOpen(false)}
              >
                <img
                  src="/img/icons/power.png"
                  alt="Turn Off"
                  className="w-7 h-7 mr-1.5"
                />
                <span className="text-sm">Turn Off</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
