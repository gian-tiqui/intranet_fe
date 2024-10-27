import React from "react";
import Form from "./components/Form";
import LoginTemplate from "./template/LoginTemplate";
import bg from "../assets/Hospital Facade Edited 2.png";
import Image from "next/image";
import SpinningLogo from "./components/SpinningLogo";

const Login = () => {
  return (
    <div className="relative">
      <SpinningLogo />
      <LoginTemplate>
        <div className="flex justify-end">
          <Image
            src={bg}
            alt="Background"
            fill
            className="z-[-1] bg-top bg-no-repeat"
          />
          <Form />
        </div>
      </LoginTemplate>
    </div>
  );
};

export default Login;
