import React from "react";

const About = () => {
  return (
    <div className="p-4 bg-blue-100">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-2/3 pr-4">
          <h1 className="text-2xl font-bold mb-2">Hi, I'm Abe Raouh</h1>
          <p className="italic">Software Engineer based in New York, NY</p>
          <p className="italic mb-2">ML/AI Enthusiast</p>

          <p className="p-3 mb-3">
            <li>
              I'm a passionate Junior Software Engineer with a strong foundation
              in computer science and a focus on artificial intelligence. I’m
              currently pursuing a Master’s in Computer Science at Fordham
              University, with an expected graduation in 2025.{" "}
            </li>
            <br></br>
            <li>
              My work at MBO Partners involves building and optimizing
              full-stack applications, where I handle both frontend development
              with React and backend functionality with Python. I’ve also
              spearheaded projects like an automated pricing tool to enhance
              client solutions. With hands-on experience in AI-driven projects,
              including a customer support bot that reduced wait times by over
              70% and cut costs by nearly half, I thrive in roles where I can
              combine technical expertise with practical, impactful solutions.{" "}
            </li>
            <br></br>
            <li>
              I enjoy collaborative, fast-paced environments where I can
              leverage my skills in Python, C++, AWS, and Docker, among others.
              Beyond my professional endeavors, I’m an active leader in the tech
              community as a former Vice-President of the Google Developers
              Student Club and as Fordham’s Computer Science Society Research
              Director. My goal is to contribute innovative ideas and solutions
              to meaningful projects that push the boundaries of technology.{" "}
            </li>
            <br></br>
            Let’s connect to explore how I can bring value to your team!
          </p>
        </div>
        <div className="md:w-1/3 flex justify-center md:justify-end items-start">
          <div className="windows-xp-frame">
            <img
              src={"img/portrait.jpeg"}
              alt="Abe Raouh"
              className="w-full h-auto mb-3"
            />
            <img
              src={"img/portrait.jpeg"}
              alt="Abe Raouh"
              className="w-full h-auto mb-3"
            />
            <img
              src={"img/portrait.jpeg"}
              alt="Abe Raouh"
              className="w-full h-auto mb-3"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
