import React from "react";
import WelcomeNavbar from "./components/WelcomeNavbar";
import Hero from "./components/Hero";
import Preview from "./components/Preview";
import Footer from "./components/Footer";
import HrFeatures from "./components/HrFeatures";

const WelcomePage = () => {
  return (
    <div className="bg-neutral-50 pt-4 dark:bg-neutral-950">
      <WelcomeNavbar />
      <Hero />
      <HrFeatures />

      <Preview />
      <Footer />
    </div>
  );
};

export default WelcomePage;
