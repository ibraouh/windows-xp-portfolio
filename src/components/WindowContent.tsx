import React from "react";

import About from "./source/About.js";
import Experience from "./source/Experience.js";
import Research from "./source/Research.js";
import Projects from "./source/Projects.js";
import Resume from "./source/Resume.js";
import Legal from "./source/legal.js";

import SnakeGame from "./source/Games/SnakeGame.tsx";
import PaintGame from "./source/Games/PaintGame.tsx";

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
    case "legal":
      return <Legal />;
    case "paint":
      return <PaintGame />;

    default:
      return <div>Content not available</div>;
  }
};

export default WindowContent;
