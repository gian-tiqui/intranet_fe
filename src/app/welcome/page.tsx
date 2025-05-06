import React from "react";
import WelcomeNavbar from "./components/WelcomeNavbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Curtain from "./components/Curtain";

const WelcomePage = () => {
  return (
    <div className="relative h-screen overflow-hidden">
      <WelcomeNavbar />
      <Curtain />
      <Hero />
      <Footer />
    </div>
  );
};

export default WelcomePage;
