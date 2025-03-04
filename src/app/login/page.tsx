import React from "react";
import Form from "./components/Form";
import LoginTemplate from "./template/LoginTemplate";
import facade from "../assets/employeeportalbg.jpg";
import Image from "next/image";

const Login = () => {
  return (
    <div className="relative">
      <LoginTemplate>
        <div className="grid place-content-center relative">
          <Image src={facade} alt="Westlake Facade" fill />

          <Form />
        </div>
      </LoginTemplate>
    </div>
  );
};

export default Login;
