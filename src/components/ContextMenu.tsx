import React from "react";

interface ContextMenuProps {
  x: number;
  y: number;
  onRefresh: () => void;
  onProperties: () => void;
}

// The menu XP shows when you right-click the desktop.
const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onRefresh, onProperties }) => (
  <div
    className="xp-menu fixed z-50"
    style={{
      left: Math.min(x, window.innerWidth - 200),
      top: Math.min(y, window.innerHeight - 220),
    }}
    onMouseDown={(e) => e.stopPropagation()}
  >
    <div className="xp-menu-item submenu disabled">Arrange Icons By</div>
    <button className="xp-menu-item" onClick={onRefresh}>
      Refresh
    </button>
    <div className="xp-menu-sep" />
    <div className="xp-menu-item disabled">Paste</div>
    <div className="xp-menu-item disabled">Paste Shortcut</div>
    <div className="xp-menu-sep" />
    <div className="xp-menu-item submenu disabled">New</div>
    <div className="xp-menu-sep" />
    <button className="xp-menu-item" onClick={onProperties}>
      Properties
    </button>
  </div>
);

export default ContextMenu;
