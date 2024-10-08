const SigninLogo = () => {
  return (
    <div className="bg-[#6795df] text-white p-4 md:pt-20 rounded-md flex gap-4">
      <img src="/delta.png" alt="Logo PuzLynk" draggable="false" className="w-16 h-auto" />
      <div className=" flex flex-col p-2 tems-start justify-start">
        <h1 className="text-3xl neon-text">PuzLynk</h1>
        <a
          href="https://adrian-anta.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs flex opacity-60 hover:opacity-75 transition-opacity ease-in-out duration-250"
        >
          by Adrián Anta
        </a>
      </div>
    </div>
  );
};

export default SigninLogo;
