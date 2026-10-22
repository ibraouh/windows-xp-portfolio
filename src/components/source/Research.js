import React, { useEffect, useState } from "react";
import researchData from "../../data/researchData.json";

const Research = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(researchData);
  }, []);

  return (
    <div className="p-4 pb-0">
      <h1 className="xp-heading text-xl mb-4">Research &amp; deep dives</h1>
      <div>
        {data.map((research, index) => (
          <div key={index} className="mb-6">
            <h2 className="font-bold text-gray-700 mb-0">{research.title}</h2>
            <h5 className="font-bold mb-0">{research.professor}</h5>

            {research.details.map((detail, i) => (
              <p key={i} className="mt-2">
                {detail}
              </p>
            ))}

            <hr className="border-t border-gray-300 mt-4" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Research;
