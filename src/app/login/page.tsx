import React from "react";
import Form from "./components/Form";
import LoginTemplate from "./template/LoginTemplate";
import facade from "../assets/Hospital Facade Edited 2.png";
import Image from "next/image";
import ModeToggler from "../components/ModeToggler";

const Login = () => {
  return (
    <div className="relative">
      <LoginTemplate>
        <div className="grid md:grid-cols-2">
          <div className="relative">
            <Image src={facade} alt="Westlake Facade" fill />
            <div className="absolute">
              <ModeToggler />
            </div>
          </div>

          <Form />
        </div>
      </LoginTemplate>
    </div>
  );
};

export default Login;
