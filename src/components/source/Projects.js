import React, { useRef, useEffect, useState } from "react";
import projectsData from "../../data/projectsData.json";

const ProjectCard = ({ project }) => (
  <div className="flex items-start mb-4">
    <img
      src={project.image || "img/icons/project.png"}
      height="50px"
      width="50px"
      alt={project.title}
      className="mr-4"
    />

    <div>
      <h4 className="font-bold text-lg">
        {project.title}
        {project.subtitle && (
          <span className="font-normal text-base text-[#5a5a5a]">
            {" · "}
            {project.link ? (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 underline"
              >
                {project.subtitle}
              </a>
            ) : (
              project.subtitle
            )}
          </span>
        )}
      </h4>
      <p className="mb-2">{project.description}</p>

      <div className="flex flex-wrap gap-2">
        {project.technologies.map((tech, i) => (
          <span
            key={i}
            className="xp-tag"
          >
            {tech}
          </span>
        ))}
      </div>
      <hr className="border-t border-gray-300 mt-4" />
    </div>
  </div>
);

const Projects = () => {
  const [data, setData] = useState([]);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    setData(projectsData);
  }, []);

  const recent = data.filter((project) => !project.early);
  const early = data.filter((project) => project.early);

  return (
    <div className="p-4">
      <h1 className="xp-heading text-xl mb-2">Some things I built</h1>

      <div className="p-3 pb-0" ref={scrollContainerRef}>
        {recent.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}

        {early.length > 0 && (
          <h2 className="xp-heading text-lg mb-4 mt-2">Early builds</h2>
        )}
        {early.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Projects;
