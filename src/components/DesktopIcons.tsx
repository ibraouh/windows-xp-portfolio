import React from "react";

interface DesktopIconProps {
  icon: string;
  title: string;
  onClick: () => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ icon, title, onClick }) => (
  <div
    className="flex flex-col items-center text-white cursor-pointer w-20"
    onDoubleClick={onClick}
  >
    <div className="w-16 h-16 flex items-center justify-center rounded">
      <img src={icon} alt={title} className="w-14 h-14" />
    </div>
    <span className="mt-1 text-sm text-center leading-tight shadow-sm">
      {title}
    </span>
  </div>
);

export default DesktopIcon;
