import React from "react";

interface DesktopIconProps {
  icon: string;
  title: string;
  onClick: () => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ icon, title, onClick }) => (
  <div
    className="flex flex-col items-center text-white cursor-pointer w-20 sm:w-24 md:w-28"
    onClick={onClick}
  >
    <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded">
      <img src={icon} alt={title} className="w-10 h-10 sm:w-14 sm:h-14" />
    </div>
    <span className="mt-1 text-xs sm:text-sm text-center leading-tight shadow-sm">
      {title}
    </span>
  </div>
);

export default DesktopIcon;
