import React from "react";
import WelcomeNavbar from "./components/WelcomeNavbar";
import Hero from "./components/Hero";
import ModeToggler from "../components/ModeToggler";

const WelcomePage = () => {
  return (
    <div className="bg-neutral-50 dark:bg-neutral-950">
      <div className="hidden md:flex fixed top-6 right-8">
        <ModeToggler />
      </div>
      <WelcomeNavbar />
      <Hero />
    </div>
  );
};

export default WelcomePage;
