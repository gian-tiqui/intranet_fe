import React from "react";
import WelcomeNavbar from "./components/WelcomeNavbar";
import Hero from "./components/Hero";
import Preview from "./components/Preview";
import Footer from "./components/Footer";
import HrFeatures from "./components/HrFeatures";
import ModeToggler from "../components/ModeToggler";

const WelcomePage = () => {
  return (
    <div className="bg-neutral-50 pt-4 dark:bg-neutral-950">
      <div className="hidden md:flex fixed top-6 right-8">
        <ModeToggler />
      </div>
      <WelcomeNavbar />
      <Hero />
      <HrFeatures />
      <Preview />
      <Footer />
    </div>
  );
};

export default WelcomePage;
