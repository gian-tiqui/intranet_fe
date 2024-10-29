import React from "react";
import Form from "./components/Form";
import LoginTemplate from "./template/LoginTemplate";

const Login = () => {
  return (
    <div className="relative">
      <LoginTemplate>
        <div className="grid md:grid-cols-2">
          <div></div>
          <Form />
        </div>
      </LoginTemplate>
    </div>
  );
};

export default Login;
