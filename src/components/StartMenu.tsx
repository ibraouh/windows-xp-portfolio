import React, { useState } from "react";
import windowsData from "../data/windowsData.json";

interface StartMenuProps {
  onOpen: (id: string, title: string) => void;
  onLogOff: () => void;
  onTurnOff: () => void;
}

const PINNED = [
  { id: "about", title: "About Me", subtitle: "Get to know me", icon: "about" },
  { id: "resume", title: "Resume", subtitle: "Links and résumé", icon: "resume" },
];

const RECENT = [
  { id: "experience", title: "Experience", icon: "experience" },
  { id: "projects", title: "Projects", icon: "projects" },
  { id: "snake", title: "Snake", icon: "snake" },
  { id: "paint", title: "Paint", icon: "paint" },
  { id: "minesweeper", title: "Minesweeper", icon: "minesweeper" },
];

const StartMenu: React.FC<StartMenuProps> = ({ onOpen, onLogOff, onTurnOff }) => {
  const [allProgramsOpen, setAllProgramsOpen] = useState(false);

  return (
    <div className="xp-start-menu fixed bottom-[38px] left-0 w-full sm:w-[420px] z-50">
      <div className="xp-start-header">
        <img
          src="https://thispersondoesnotexist.com/random-person.jpeg"
          alt="User"
          className="w-11 h-11 rounded-[3px] border-2 border-white/80 bg-[#d6dff7] object-cover"
        />
        <span>Future Employer</span>
      </div>
      <div className="xp-start-orange" />

      <div className="flex">
        <div className="w-1/2 bg-white flex flex-col py-1">
          {PINNED.map((item) => (
            <button
              key={item.id}
              className="xp-start-item font-bold"
              onClick={() => onOpen(item.id, item.title)}
            >
              <img src={`/img/icons/${item.icon}.png`} alt="" className="w-8 h-8" />
              <span className="flex flex-col leading-tight">
                {item.title}
                <span className="xp-start-sub">{item.subtitle}</span>
              </span>
            </button>
          ))}
          <div className="xp-start-sep" />
          {RECENT.map((item) => (
            <button
              key={item.id}
              className="xp-start-item"
              onClick={() => onOpen(item.id, item.title)}
            >
              <img src={`/img/icons/${item.icon}.png`} alt="" className="w-8 h-8" />
              {item.title}
            </button>
          ))}
          <div className="flex-grow" />
          <div className="xp-start-sep" />
          <div
            className="relative"
            onMouseEnter={() => setAllProgramsOpen(true)}
            onMouseLeave={() => setAllProgramsOpen(false)}
          >
            <button
              className="xp-start-item justify-center font-bold"
              onClick={() => setAllProgramsOpen(!allProgramsOpen)}
            >
              All Programs
              <span className="xp-start-arrow">
                <svg width="8" height="8" viewBox="0 0 8 8">
                  <path d="M2 0l4 4-4 4z" fill="#fff" />
                </svg>
              </span>
            </button>
            {allProgramsOpen && (
              <div className="xp-menu absolute left-full bottom-0 z-10">
                {windowsData.desktopIcons.map((item) => (
                  <button
                    key={item.id}
                    className="xp-menu-item"
                    onClick={() => onOpen(item.id, item.title)}
                  >
                    <img src={item.icon_id} alt="" className="w-4 h-4" />
                    {item.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="xp-start-right w-1/2 bg-[#d3e5fa] border-l border-[#95bdee] py-1">
          <button className="xp-start-item font-bold">
            <img src="/img/icons/myDocs.png" alt="" className="w-6 h-6" />
            My Documents
          </button>
          <div className="xp-start-sep" />
          <button
            className="xp-start-item"
            onClick={() => onOpen("control", "About this site")}
          >
            <img src="/img/icons/control.png" alt="" className="w-6 h-6" />
            Control Panel
          </button>
          <div className="xp-start-sep" />
          <button
            className="xp-start-item"
            onClick={() => onOpen("legal", "Legal Notice")}
          >
            <img src="/img/icons/help.png" alt="" className="w-6 h-6" />
            Help and Support
          </button>
          <button className="xp-start-item">
            <img src="/img/icons/search.png" alt="" className="w-6 h-6" />
            Search
          </button>
        </div>
      </div>

      <div className="xp-start-footer">
        <button onClick={onLogOff}>
          <img src="/img/icons/logout.png" alt="" className="w-6 h-6" />
          Log Off
        </button>
        <button onClick={onTurnOff}>
          <img src="/img/icons/power.png" alt="" className="w-6 h-6" />
          Turn Off Computer
        </button>
      </div>
    </div>
  );
};

export default StartMenu;
