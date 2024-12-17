import React from "react";
import Form from "./components/Form";
import LoginTemplate from "./template/LoginTemplate";
import facade from "../assets/Hospital Facade Edited 2.png";
import Image from "next/image";

const Login = () => {
  return (
    <div className="relative">
      <LoginTemplate>
        <div className="grid place-content-center relative">
          <Image src={facade} alt="Westlake Facade" fill />
          <div className="absolute w-full lg:w-screen bg-gradient-to-t from-blue-600/70 to-blue-500/70 dark:from-blue-900/70 dark:to-blue-800/70 h-screen"></div>

          <Form />
        </div>
      </LoginTemplate>
    </div>
  );
};

export default Login;
