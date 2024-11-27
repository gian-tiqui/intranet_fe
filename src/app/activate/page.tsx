import React from "react";
import facade from "../assets/Hospital Facade Edited 2.png";
import Image from "next/image";
import LoginTemplate from "../login/template/LoginTemplate";
import ActivateForm from "./ActivateForm";

const ActivatePage = () => {
  return (
    <div className="relative">
      <LoginTemplate>
        <div className="grid place-content-center">
          <Image src={facade} alt="Westlake Facade" fill />
          <div className="absolute w-full lg:w-screen bg-gradient-to-t from-blue-600/70 to-blue-500/70 dark:from-blue-900/70 dark:to-blue-800/70 h-screen"></div>
        </div>
        <ActivateForm />
      </LoginTemplate>
    </div>
  );
};

export default ActivatePage;
