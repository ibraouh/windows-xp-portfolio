import React from "react";

const About = () => {
  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-2/3 pr-4">
          <h1 className="xp-heading text-xl mb-2">Hi, I'm Abe Raouh</h1>
          <p className="text-[#5a5a5a]">
            Forward Deployed AI Engineer based in New York, NY
          </p>
          <p className="text-[#5a5a5a] mb-2">
            MSE in AI @ Penn (May 2027) · BS &amp; MS in CS @ Fordham
          </p>

          <div className="p-3 mb-3 space-y-4">
            <p>
              Hey there! Thanks for visiting my site. I'm a Forward Deployed AI
              Engineer specializing in private equity, and an AI/ML grad student
              at the University of Pennsylvania (graduating May 2027).
            </p>
            <p>
              At Exadel, I lead engineering for our private equity practice. I
              work side by side with deal teams and firm leadership to learn how
              they actually work, then build AI that fits right into it:
              investment-committee memos drafted straight from the data room,
              messy financial files turned into clean data and monthly reports,
              and tools that make it safe to use AI on sensitive investor
              documents. I also wrote the engineering standards my team follows,
              from how we use AI coding tools to how we gather requirements and
              work with stakeholders.
            </p>
            <p>
              Before Exadel, I was a software engineer at MBO Partners while
              finishing my BS and MS in Computer Science at Fordham. I speak
              Arabic, French and English, and I've played piano for twelve
              years. When I'm not building, I'm probably running, baking or
              playing Snake on this very website.
            </p>
            <p>
              Feel free to look around, and if you'd like to work together or
              just chat, let's connect!
            </p>
          </div>
        </div>
        <div className="md:w-1/3 flex justify-center md:justify-end items-start">
          <div className="p-1 bg-white border border-[#aca899] shadow-md">
            <img
              src={"img/portrait.jpeg"}
              alt="Abe Raouh"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
