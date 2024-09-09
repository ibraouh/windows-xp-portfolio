import React, { useEffect, useState } from "react";
import workData from "../../data/workData.json";

const Experience = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(workData);
  }, []);

  return (
    <div className="p-4 bg-white pb-0">
      <h1 className="text-2xl font-bold mb-4">Work Experience</h1>
      <div>
        {data.map((job, index) => (
          <div key={index} className="flex items-start mb-6">
            {/* Logo to the left */}
            <div className="mr-4">
              <img
                src={job.logo}
                // height="150px"
                width="150px"
                alt={`${job.company} logo`}
                className="rounded"
              />
            </div>

            {/* Job details to the right */}
            <div>
              {/* Date in italics */}
              <p className="italic text-gray-600 mb-1">{job.date}</p>

              {/* Position and company */}
              <h2 className="text-lg font-bold mb-2">
                {job.position}{" "}
                <span className="font-light">@ {job.company}</span>
              </h2>

              {/* Job details list */}
              <ul className="list-disc list-inside">
                {job.details.map((detail, i) => (
                  <li key={i} className="mb-1">
                    {detail}
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
