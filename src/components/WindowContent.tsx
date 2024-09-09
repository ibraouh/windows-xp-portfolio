import React from "react";

import About from "./source/About.tsx";
import Experience from "./source/Experience.js";
import Research from "./source/Research.js";
import Projects from "./source/Projects.js";
import Resume from "./source/Resume.js";
import SnakeGame from "./source/SnakeGame.tsx";
import PaintGame from "./source/PaintGame.tsx";

const WindowContent: React.FC<{ id: string }> = ({ id }) => {
  switch (id) {
    case "about":
      return <About />;
    case "experience":
      return <Experience />;
    case "research":
      return <Research />;
    case "projects":
      return <Projects />;
    case "resume":
      return <Resume />;
    case "snake":
      return <SnakeGame />;
    case "paint":
      return <PaintGame />;
    default:
      return <div>Content not available</div>;
  }
};

export default WindowContent;
