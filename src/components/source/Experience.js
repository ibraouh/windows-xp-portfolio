import React, { useEffect, useState } from "react";
import workData from "../../data/workData.json";

// Renders **text** in a detail string as bold.
const renderDetail = (detail) =>
  detail
    .split(/(\*\*[^*]+\*\*)/)
    .map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : (
        part
      )
    );

const Experience = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(workData);
  }, []);

  return (
    <div className="p-4 bg-white pb-0">
      <h1 className="xp-heading text-xl mb-4">Work Experience</h1>
      <div>
        {data.map((job, index) => (
          <div key={index} className="flex items-start mb-6">
            {/* Logo to the left */}
            <div className="mr-4 flex-shrink-0 w-16">
              {job.logo ? (
                <img
                  src={job.logo}
                  alt={`${job.company} logo`}
                  className="rounded w-full h-auto"
                />
              ) : (
                <div className="w-full aspect-square rounded border border-gray-300 bg-gray-100 flex items-center justify-center font-bold text-lg text-gray-700">
                  {job.company}
                </div>
              )}
            </div>

            {/* Job details to the right */}
            <div>
              <p className="text-[#5a5a5a] mb-1">{job.date}</p>

              {/* Position and company */}
              <h2 className="text-lg font-bold mb-2">
                {job.position}{" "}
                <span className="font-normal">@ {job.company}</span>
              </h2>

              {/* Job details list */}
              <ul className="list-disc pl-5 space-y-1.5 marker:text-[#5a5a5a]">
                {job.details.map((detail, i) => (
                  <li key={i}>
                    {renderDetail(detail)}
                  </li>
                ))}
              </ul>
              <hr className="border-t border-gray-300 mt-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experience;
