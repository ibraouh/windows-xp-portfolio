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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris nec
            dapibus ante. Curabitur aliquet pharetra purus sed semper.
            Vestibulum tincidunt, lacus vitae suscipit gravida, ligula magna
            lobortis elit, in dapibus magna nulla vitae tellus. Phasellus vitae
            semper magna. Integer fringilla ante massa, quis bibendum lorem
            ultricies at. Pellentesque suscipit metus vitae ipsum aliquam
            vulputate. Vestibulum eget sodales risus. Phasellus accumsan
            placerat mi, sit amet sagittis sapien congue eu. Suspendisse
            pharetra sollicitudin enim, pretium condimentum velit pellentesque
            at. Aliquam quis consequat turpis, et vestibulum enim. Quisque sed
            diam orci. Integer sodales libero eget nulla eleifend, a accumsan
            purus hendrerit. Praesent at volutpat orci. Etiam ullamcorper libero
            fringilla ligula consequat vulputate. Sed vitae rhoncus lorem. Class
            aptent taciti sociosqu ad litora torquent per conubia nostra, per
            inceptos himenaeos.
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
