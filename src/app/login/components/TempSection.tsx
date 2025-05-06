import { Image } from "primereact/image";
import React from "react";
import wmcBuilding from "../../assets/bg-removed-wmc.png";

const TempSection = () => {
  return (
    <div className="w-full h-screen relative overflow-hidden">
      <Image
        src={wmcBuilding.src}
        alt="wmc building"
        className="h-[900px] w-[880px] absolute -z-10 -bottom-72 left-0"
      />
      <div className="bottom-0 left-7 absolute "></div>
      <div className="text-7xl font-bold text-[#EEEEEE] p-20">
        <h1>Your Hospital</h1>
        <h1>at the Heart</h1>
        <h1>of Laguna</h1>
      </div>
    </div>
  );
};

export default TempSection;
