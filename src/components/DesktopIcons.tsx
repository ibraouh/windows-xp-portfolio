import React, { useEffect, useRef, useState } from "react";

interface DesktopIconProps {
  icon: string;
  title: string;
  description?: string;
  selected: boolean;
  isMobile: boolean;
  onSelect: () => void;
  onOpen: () => void;
}

// XP desktop icons: one click selects, a double click opens.
// On phones a single tap opens, since double taps zoom instead.
const DesktopIcon: React.FC<DesktopIconProps> = ({
  icon,
  title,
  description,
  selected,
  isMobile,
  onSelect,
  onOpen,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timer.current), []);

  const hideTooltip = () => {
    clearTimeout(timer.current);
    setShowTooltip(false);
  };

  return (
    <div
      className={`xp-desktop-icon relative flex flex-col items-center cursor-default ${
        selected ? "selected" : ""
      }`}
      onMouseDown={(e) => {
        e.stopPropagation();
        hideTooltip();
        if (!isMobile) onSelect();
      }}
      onClick={() => {
        if (isMobile) onOpen();
      }}
      onDoubleClick={() => {
        if (!isMobile) onOpen();
      }}
      onMouseEnter={() => {
        if (description && !isMobile) {
          timer.current = setTimeout(() => setShowTooltip(true), 700);
        }
      }}
      onMouseLeave={hideTooltip}
    >
      <div className="xp-icon-box relative">
        <img src={icon} alt={title} className="w-full h-full" draggable={false} />
        <span
          className="xp-icon-tint"
          style={{ WebkitMaskImage: `url(${icon})`, maskImage: `url(${icon})` }}
        />
      </div>
      <span className="xp-desktop-label">
        {title}
      </span>
      {showTooltip && (
        <div className="xp-tooltip absolute left-[55%] top-[79%] z-30">
          {description}
        </div>
      )}
    </div>
  );
};

export default DesktopIcon;
