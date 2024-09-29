import React from "react";
import Form from "./components/Form";
import LoginTemplate from "./template/LoginTemplate";
import Appbar from "./components/Appbar";

const Login = () => {
  return (
    <div className="">
      <LoginTemplate>
        <Appbar />
        <Form />
      </LoginTemplate>
    </div>
  );
};

export default Login;
