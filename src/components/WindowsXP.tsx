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

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Add overflow-hidden to body
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <div className="h-screen bg-[url('https://i.imgur.com/Zk6TR5k.jpg')] bg-cover overflow-hidden relative select-none font-[Tahoma,sans-serif]">
      <div className="grid grid-rows-6 gap-4 p-4">
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
              className="absolute bg-gray-100 border border-gray-400 shadow-lg rounded-t-lg"
              style={{
                left: `${window.position.x}px`,
                top: `${window.position.y}px`,
                zIndex: window.zIndex,
                width: "550px",
                height: "650px",
              }}
            >
              <div
                className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-1 flex justify-between items-center cursor-move rounded-t"
                onMouseDown={(e) => {
                  handleWindowDrag(e, window, moveWindow);
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
                      alt="Paint icon"
                      className="mr-0 h-6 w-6"
                    />
                  </button>
                  <button className="px-1 py-0.5 hover:bg-[#1E6CEB] text-white text-xs font-bold mr-0 rounded">
                    <img
                      src={"/img/buttons/Maximize.png"}
                      alt="Paint icon"
                      className="mr-0 h-6 w-6"
                    />
                  </button>
                  <button
                    className="px-1 py-0.5  hover:bg-[#E74856] text-white text-xs font-bold rounded"
                    onClick={() => closeWindow(window.id)}
                  >
                    <img
                      src={"/img/buttons/Exit.png"}
                      alt="Paint icon"
                      className="mr-0 h-6 w-6"
                    />
                  </button>
                </div>
              </div>
              <div className="h-[calc(100%-28px)] overflow-auto">
                {window.content}
              </div>
            </div>
          )
      )}

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-r from-[#245EDC] to-[#3C81F3] flex items-center justify-between">
        <div className="flex items-center h-full">
          <button
            className="px-0 py-0"
            onClick={() => setStartMenuOpen(!startMenuOpen)}
          >
            <img
              src={"img/icons/logo.png"}
              alt="Windows XP Logo"
              className="w-30 h-10 mr-0"
            />
          </button>
          <div className="flex space-x-1 ml-2 h-full items-center">
            {windows.map((window) => (
              <button
                key={window.id}
                className={`h-8 px-2 py-1 text-white rounded flex items-center ${
                  activeWindow === window.id
                    ? "bg-[#1C3A80]"
                    : "bg-[#3C81F3] hover:bg-[#67A5F5]"
                }`}
                onClick={() => activateWindow(window.id)}
              >
                <img
                  src={`/img/icons/${window.id}.png`}
                  alt="Paint icon"
                  className="mr-2 h-4 w-4"
                />
                <span className="text-sm">{window.title}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="shadow-xl border-l-2 border-gray-600 bg-[#0C9DF0] px-5 py-2.5  text-white text-sm mr-0">
          {time.toLocaleTimeString()}
        </div>
      </div>

      {/* Start Menu */}
      {startMenuOpen && (
        <div className="absolute bottom-10 left-0 w-80 bg-[#D3E5FA] border-2 border-[#0A246A] rounded-tr-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#1C3A80] to-[#3165C3] p-4 flex items-center">
            <img
              src="./img/icons/frog.jpg"
              alt="User"
              className="w-12 h-12 rounded border border-[#7AA5D7] mr-3 bg-black"
            />
            <div className="text-white font-bold text-lg">
              Future Employer pls
            </div>
          </div>
          <div className="flex">
            <div className="w-3/5 p-2 space-y-1">
              <button
                className="w-full text-left p-2 hover:bg-[#316AC5] hover:text-white rounded flex items-center"
                onClick={() => {
                  setStartMenuOpen(false);
                  openWindow("about", "About Me");
                }}
              >
                <img
                  src="/img/icons/about.png"
                  alt="Search"
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
                  alt="Search"
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
                  alt="Search"
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
                  alt="Search"
                  className="w-7 h-7 mr-1.5"
                />
                <span className="text-sm">Paint</span>
              </button>
            </div>
            <div className="w-2/5 bg-[#9DBDE3] p-2 space-y-1">
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
                  alt="Log Off"
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
