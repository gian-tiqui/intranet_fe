import React from "react";
import WelcomeNavbar from "./components/WelcomeNavbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Curtain from "./components/Curtain";
import ModernMedicalLanding from "./components/ModernMedicalLanding";

const WelcomePage = () => {
  return (
    <div className="relative h-screen overflow-hidden">
      <ModernMedicalLanding />
    </div>
  );
};

export default WelcomePage;
