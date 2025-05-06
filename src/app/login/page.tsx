import React from "react";
import Form from "./components/Form";
import LoginTemplate from "./template/LoginTemplate";
import TempSection from "./components/TempSection";

const Login = () => {
  return (
    <div className="relative">
      <LoginTemplate>
        <Form />
        <TempSection />
      </LoginTemplate>
    </div>
  );
};

export default Login;
