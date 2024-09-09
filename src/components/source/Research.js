import React, { useEffect, useState } from "react";
import researchData from "../../data/researchData.json";

const Research = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(researchData);
  }, []);

  return (
    <div className="p-4 pb-0">
      <h1 className="text-2xl font-bold mb-4">Research Experience</h1>
      <div>
        {data.map((research, index) => (
          <div key={index} className="mb-6">
            <h2 className="font-bold text-gray-700 mb-0">{research.title}</h2>
            <h5 className="font-bold mb-0">{research.professor}</h5>

            <ul className="list-disc list-inside m-3">
              {research.details.map((detail, i) => (
                <li key={i} className="mb-1">
                  {detail}
                </li>
              ))}
            </ul>

            <hr className="border-t border-gray-300 mt-4" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Research;
