import React from "react";

const Hero = () => {
  return (
    <>
      <div className="w-full grid grid-cols-5 gap-6 px-6 md:h-[75%] mb-6">
        <div className="rounded-3xl col-span-3 bg-black"></div>
        <div className="col-span-2 gap-6 grid">
          <div className="rounded-3xl bg-amber-100"></div>
          <div className="rounded-3xl bg-blue-600"></div>
        </div>
      </div>
    </>
  );
};

export default Hero;
