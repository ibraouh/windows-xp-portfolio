import React, { useEffect, useState } from "react";
import { Window } from "../types/types";

interface TaskbarProps {
  windows: Window[];
  activeWindow: string | null;
  onStartClick: () => void;
  onTaskClick: (window: Window) => void;
  onShowDesktop: () => void;
}

// Yellow XP tooltip that appears after a short hover
const HoverTip: React.FC<{ text: string; align?: "left" | "right" }> = ({
  text,
  align = "left",
}) => (
  <span
    className={`xp-tooltip absolute bottom-full mb-2 ${
      align === "right" ? "right-0" : "left-0"
    } opacity-0 group-hover:opacity-100 transition-opacity group-hover:delay-500 pointer-events-none z-50`}
  >
    {text}
  </span>
);

const QUICK_LAUNCH = [
  { label: "Show Desktop", icon: "desktop", href: undefined },
  { label: "Abe's GitHub", icon: "ie", href: "https://github.com/ibraouh" },
  { label: "Email Abe", icon: "outlook", href: "mailto:abe@raouh.com" },
];

const Taskbar: React.FC<TaskbarProps> = ({
  windows,
  activeWindow,
  onStartClick,
  onTaskClick,
  onShowDesktop,
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="xp-taskbar flex-shrink-0 z-50">
      <div className="flex items-center h-full min-w-0 flex-grow">
        <button
          className="h-full flex-shrink-0 hover:brightness-110"
          onClick={onStartClick}
        >
          <img src="img/icons/logo.png" alt="start" className="h-full w-auto" />
        </button>

        <div className="xp-quick-launch hidden sm:flex">
          {QUICK_LAUNCH.map((item) => {
            const icon = (
              <img src={`img/quicklaunch/${item.icon}.png`} alt={item.label} className="w-5 h-5" />
            );
            return (
              <div key={item.label} className="relative group">
                {item.href ? (
                  <a
                    className="xp-quick-btn"
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                  >
                    {icon}
                  </a>
                ) : (
                  <button className="xp-quick-btn" onClick={onShowDesktop}>
                    {icon}
                  </button>
                )}
                <HoverTip text={item.label} />
              </div>
            );
          })}
        </div>

        <div className="flex gap-1 ml-2 mr-2 h-full items-center min-w-0 flex-grow overflow-x-auto no-scrollbar">
          {windows.map((window) => (
            <button
              key={window.id}
              className={`xp-task-btn ${
                activeWindow === window.id && !window.isMinimized ? "active" : ""
              }`}
              onClick={() => onTaskClick(window)}
            >
              <img
                src={`/img/icons/${window.id}.png`}
                alt=""
                className="h-5 w-5 flex-shrink-0"
              />
              <span className="truncate">{window.title}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="xp-tray">
        <img src="img/tray/network.png" alt="Network" className="h-5 w-5" />
        <img src="img/tray/volume.png" alt="Volume" className="h-5 w-5" />
        <span className="relative group ml-1 cursor-default">
          {time.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
          <HoverTip
            align="right"
            text={time.toLocaleDateString([], {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          />
        </span>
      </div>
    </div>
  );
};

export default Taskbar;
