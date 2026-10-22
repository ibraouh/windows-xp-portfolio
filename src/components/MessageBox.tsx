import React from "react";

interface MessageBoxProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  buttons: React.ReactNode;
}

// A small XP message box centered over its parent (which needs `relative`)
const MessageBox: React.FC<MessageBoxProps> = ({ title, icon, children, buttons }) => (
  <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/25">
    <div className="xp-window w-[280px] max-w-[90%]">
      <div className="xp-titlebar !h-[28px] !text-[13px]">{title}</div>
      <div className="xp-window-body px-4 py-3 text-[12px]">
        <div className="flex items-start gap-3 mb-4">
          <img src={icon} alt="" className="w-8 h-8 flex-shrink-0" />
          <div className="pt-1">{children}</div>
        </div>
        <div className="flex justify-center gap-2">{buttons}</div>
      </div>
    </div>
  </div>
);

export default MessageBox;
