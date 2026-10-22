import React, { useEffect, useState } from "react";
import educationData from "../../data/educationData.json";

const Education = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(educationData);
  }, []);

  return (
    <div className="p-4 pb-0">
      <h1 className="xp-heading text-xl mb-4">Education</h1>
      <div>
        {data.map((entry, index) => (
          <div key={index} className="flex items-start mb-6">
            <img
              src={entry.logo}
              alt={`${entry.school} logo`}
              className="mr-4 flex-shrink-0 w-16 h-auto"
            />

            <div className="flex-grow">
              <h2 className="font-bold text-gray-700 mb-0">{entry.school}</h2>
              <h5 className="font-bold mb-0">{entry.degree}</h5>
              <p className="text-[#5a5a5a]">{entry.date}</p>

              {entry.details && <p className="mt-2">{entry.details}</p>}

              <hr className="border-t border-gray-300 mt-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Education;
