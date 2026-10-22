const Resume = () => {
  return (
    <div className="flex flex-col items-start space-y-4 p-4">
      {/* Button 2: LinkedIn */}
      <a
        href="https://www.linkedin.com/in/iraouh/"
        target="_blank"
        rel="noopener noreferrer"
        className="xp-button w-full py-2 text-[13px] text-center"
      >
        LinkedIn
      </a>

      {/* Button 3: GitHub */}
      <a
        href="https://github.com/ibraouh"
        target="_blank"
        rel="noopener noreferrer"
        className="xp-button w-full py-2 text-[13px] text-center"
      >
        GitHub
      </a>

      {/* Button 4: Email */}
      <a
        href="mailto:abe@raouh.com"
        target="_blank"
        rel="noopener noreferrer"
        className="xp-button w-full py-2 text-[13px] text-center"
      >
        abe@raouh.com
      </a>

      {/* Button 5: Instagram */}
      <a
        href="https://www.instagram.com/ibraouh/"
        target="_blank"
        rel="noopener noreferrer"
        className="xp-button w-full py-2 text-[13px] text-center"
      >
        Instagram
      </a>

      {/* Button 1: Image and Google Drive Resume Request */}
      <a
        className="xp-button w-full flex flex-col items-center py-3"
        href="https://drive.google.com/file/d/1JZ4QWna4dWGHsYditAzsORfMpXNSPOBt/view?usp=sharing"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="/img/icons/link.png"
          alt="Resume Icon"
          className="h-12 w-12 mb-2"
        />

        <span className="text-[13px]">
          Request Resume on Google Drive
        </span>
      </a>
    </div>
  );
};

export default Resume;
