import React, { useRef, useEffect, useState } from "react";
import projectsData from "../../data/projectsData.json";

const Projects = () => {
  const [data, setData] = useState([]);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    setData(projectsData);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Some things I built</h1>
      <h1>Disclaimer: This is still a work in progress</h1>

      <div className="p-3 pb-0" ref={scrollContainerRef}>
        {data.map((project, index) => (
          <div key={index} className="flex items-start mb-4">
            <img
              src={project.image}
              height="50px"
              width="50px"
              alt={project.title}
              className="mr-4"
            />

            <div>
              <h4 className="font-bold text-lg">{project.title}</h4>
              <p className="mb-2">{project.description}</p>

              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, i) => (
                  <span
                    key={i}
                    className="bg-blue-200 text-blue-900 px-2 py-1 rounded-full border border-gray-400 text-xs font-semibold"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <hr className="border-t border-gray-300 mt-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
