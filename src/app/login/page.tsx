import React from "react";
import Form from "./components/Form";
import LoginTemplate from "./template/LoginTemplate";

const Login = () => {
  return (
    <div className="relative">
      <LoginTemplate>
        <div className="flex justify-end">
          <Form />
        </div>
      </LoginTemplate>
    </div>
  );
};

export default Login;
