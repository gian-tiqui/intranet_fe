import React from "react";
import Image from "next/image";
import WelcomeNavbar from "./components/WelcomeNavbar";
import Hero from "./components/Hero";
import bg from "../assets/Hospital Facade Edited 2 - Copy.png";

const WelcomePage = () => {
  return (
    <div className="relative h-screen">
      <div className="absolute inset-0 z-0 opacity-60">
        <Image
          src={bg.src}
          alt="Hospital Facade"
          layout="fill"
          objectFit="cover"
          objectPosition="0% 58%"
          quality={100}
          priority
        />
      </div>

      <div className="relative z-10">
        <WelcomeNavbar />
        <Hero />
      </div>
    </div>
  );
};

export default WelcomePage;
