import { Image } from "primereact/image";
import React from "react";
import wmcBuilding from "../../assets/bg-removed-wmc.png";

const TempSection = () => {
  return (
    <div className="w-full h-screen relative overflow-hidden">
      <Image
        src={wmcBuilding.src}
        alt="wmc building"
        className="h-[900px] w-[880px] absolute -z-10 -bottom-72 left-0 opacity-45"
      />
      <h1 className="left-2 top-0 font-serif absolute text-slate-50 text-4xl font-bold backdrop-blur">
        HOSPITAL AT THE HEART OF LAGUNA
      </h1>

      <h1 className="bottom-0 right-2 font-serif absolute text-slate-100 text-7xl font-bold backdrop-blur">
        CENTERS OF CARE
      </h1>
    </div>
  );
};

export default TempSection;
