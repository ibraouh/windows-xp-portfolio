import React, { useState } from "react";
import recycleData from "../../data/recycleData.json";

// XP's details view: a header row and one line per file, click to select.
const RecycleBin = () => {
  const [selected, setSelected] = useState(null);

  return (
    <div
      className="h-full min-h-full flex flex-col bg-white text-[12px]"
      onMouseDown={() => setSelected(null)}
    >
      <div className="flex-grow overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["Name", "Comments", "Date Deleted", "Size"].map((column) => (
                <th key={column} className="xp-list-header">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recycleData.map((file) => {
              const isSelected = selected === file.name;
              return (
                <tr
                  key={file.name}
                  className={`cursor-default ${isSelected ? "bg-[#316ac5] text-white" : ""}`}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setSelected(file.name);
                  }}
                >
                  <td className="px-2 py-1 align-top whitespace-nowrap">
                    <span className="flex items-center gap-1.5">
                      <img src={`img/files/${file.icon}.png`} alt="" className="w-4 h-4" />
                      {file.name}
                    </span>
                  </td>
                  <td className="px-2 py-1 align-top">{file.comments}</td>
                  <td className="px-2 py-1 align-top whitespace-nowrap">{file.deleted}</td>
                  <td className="px-2 py-1 align-top whitespace-nowrap text-right">{file.size}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="xp-statusbar">
        <span className="xp-statusbar-cell">{recycleData.length} objects</span>
        <span className="xp-statusbar-cell">1.2 GB</span>
      </div>
    </div>
  );
};

export default RecycleBin;
