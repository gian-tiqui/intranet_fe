import React from "react";
import WelcomeNavbar from "./components/WelcomeNavbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";

const WelcomePage = () => {
  return (
    <div className="relative h-screen">
      <WelcomeNavbar />
      <Hero />
      <Footer />
    </div>
  );
};

export default WelcomePage;
