const SiteInfo = () => {
  return (
    <div className="p-4">
      <h1 className="xp-heading text-xl mb-4">About this site</h1>
      <p>
        Windows XP was the first operating system I ever used, so version six
        of my portfolio is a tribute to it.
      </p>
      <hr className="border-t border-black-300 m-4"></hr>
      <p>
        Every window, the Start menu, Snake and Paint are built from scratch in
        React and styled with Tailwind. No XP UI libraries. It's deployed on
        Vercel.
      </p>
      <hr className="border-t border-black-300 m-4"></hr>
      <p>Found a bug? Email me at abe@raouh.com.</p>
    </div>
  );
};

export default SiteInfo;
