import React from "react";
import Form from "./components/Form";
import LoginTemplate from "./template/LoginTemplate";

const Login = () => {
  return (
    <div className="relative">
      <LoginTemplate>
        <Form />
      </LoginTemplate>
    </div>
  );
};

export default Login;
