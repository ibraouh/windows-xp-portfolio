const Resume = () => {
  return (
    <div className="flex flex-col items-start space-y-4 p-4">
      {/* Button 1: Image and Google Drive Resume Request */}
      <a
        className="flex flex-col items-center p-3 bg-blue-200 border border-gray-400 rounded-lg shadow hover:bg-blue-300 transition duration-200"
        href="https://drive.google.com/file/d/1JZ4QWna4dWGHsYditAzsORfMpXNSPOBt/view?usp=sharing"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="/img/icons/link.png"
          alt="Resume Icon"
          className="h-12 w-12 mb-2"
        />

        <span className="font-bold text-gray-800">
          Request Resume on Google Drive
        </span>
      </a>

      {/* Button 2: LinkedIn */}
      <a
        href="https://www.linkedin.com/in/iraouh/"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full p-3 bg-blue-200 border border-gray-400 rounded-lg shadow text-center text-gray-800 font-bold hover:bg-blue-300 transition duration-200"
      >
        LinkedIn
      </a>

      {/* Button 3: GitHub */}
      <a
        href="https://github.com/ibraouh"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full p-3 bg-blue-200 border border-gray-400 rounded-lg shadow text-center text-gray-800 font-bold hover:bg-blue-300 transition duration-200"
      >
        GitHub
      </a>

      {/* Button 4: Instagram */}
      <a
        href="https://www.instagram.com/ibraouh/"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full p-3 bg-blue-200 border border-gray-400 rounded-lg shadow text-center text-gray-800 font-bold hover:bg-blue-300 transition duration-200"
      >
        Instagram
      </a>

      {/* Button 5: Email */}
      <a
        href="mailto:abe@raouh.com"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full p-3 bg-blue-200 border border-gray-400 rounded-lg shadow text-center text-gray-800 font-bold hover:bg-blue-300 transition duration-200"
      >
        abe@raouh.com
      </a>
    </div>
  );
};

export default Resume;
