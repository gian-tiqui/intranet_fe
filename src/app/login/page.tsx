import React from "react";
import Form from "./components/Form";
import LoginTemplate from "./template/LoginTemplate";
import bg from "../assets/Hospital Facade Edited 2.png";
import Image from "next/image";
import SpinningLogo from "./components/SpinningLogo";
import ChangingContainer from "./components/ChangingContainer";

const Login = () => {
  return (
    <div className="relative">
      <SpinningLogo />
      <LoginTemplate>
        <div className="flex">
          <div className="bg-white hidden md:block bg-opacity-50 p-6 max-w-96 w-96 border-0 relative h-screen border-neutral-300 dark:bg-neutral-900 dark:bg-opacity-50 dark:border-black"></div>

          <Image
            src={bg}
            alt="Background"
            fill
            className="z-[-1] bg-top bg-no-repeat"
          />
          <ChangingContainer />
          <Form />
        </div>
      </LoginTemplate>
    </div>
  );
};

export default Login;
