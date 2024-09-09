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
              className="absolute bg-gray-100 border border-gray-400 shadow-lg rounded-t-lg overflow-scroll"
              style={{
                left: `${window.position.x}px`,
                top: `${window.position.y}px`,
                zIndex: window.zIndex,
                width: "550px",
                height: "650px",
              }}
            >
              <div
                className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-1 flex justify-between items-center cursor-move"
                onMouseDown={(e) => {
                  handleWindowDrag(e, window, moveWindow);
                  activateWindow(window.id);
                }}
              >
                <div className="flex items-center">
                  <img
                    src={"/placeholder.svg?height=16&width=16"}
                    alt="Paint icon"
                    className="mr-2 h-4 w-4"
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
                    {/* <Maximize2 size={16} /> */}
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
                    {/* <X size={16} /> */}
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
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-blue-700 to-blue-500 p-1 flex items-center justify-between">
        <div className="flex items-center">
          <button
            className="px-0 py-0"
            onClick={() => setStartMenuOpen(!startMenuOpen)}
          >
            <img
              src={"img/icons/logo.png"}
              alt="Windows XP Logo"
              className="w-30 h-8 mr-0"
            />
          </button>
          <div className="flex space-x-1 ml-2">
            {windows.map((window) => (
              <button
                key={window.id}
                className={`px-2 py-1 text-white rounded ${
                  activeWindow === window.id
                    ? "bg-blue-600"
                    : "bg-blue-400 hover:bg-blue-500"
                }`}
                onClick={() => activateWindow(window.id)}
              >
                <div className="flex items-center">
                  <img
                    src={"/placeholder.svg?height=16&width=16"}
                    alt="Paint icon"
                    className="mr-2 h-4 w-4"
                  />
                  {/* <span className="font-bold text-sm">{window.title}</span> */}
                  {window.title}
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="bg-blue-400 px-2 py-1 rounded text-white">
          {time.toLocaleTimeString()}
        </div>
      </div>

      {/* Start Menu */}
      {startMenuOpen && (
        <div className="absolute bottom-10 left-0 w-64 bg-blue-100 border-r-2 border-t-2 border-blue-300 rounded-tr-lg shadow-lg">
          <div className="bg-gradient-to-b from-blue-600 to-blue-400 p-4">
            <div className="text-white font-bold text-lg">User Name</div>
          </div>
          <div className="p-2">
            {windowsData.startMenuItems.map((item, index) => (
              <button
                key={index}
                className={`w-full text-left p-2 hover:bg-blue-200 rounded flex items-center ${
                  item.className || ""
                }`}
              >
                {/* {item.icon} */}
                {item.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
