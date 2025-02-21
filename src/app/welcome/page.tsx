import React from "react";
import WelcomeNavbar from "./components/WelcomeNavbar";
import Hero from "./components/Hero";

const WelcomePage = () => {
  return (
    <div className="bg-neutral-50 dark:bg-neutral-950">
      <WelcomeNavbar />
      <Hero />
    </div>
  );
};

export default WelcomePage;
