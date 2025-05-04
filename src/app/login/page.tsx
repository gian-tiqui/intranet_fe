import React from "react";
import Form from "./components/Form";
import LoginTemplate from "./template/LoginTemplate";
import WeMeanCare from "../components/WeMeanCare";

const Login = () => {
  return (
    <div className="relative">
      <LoginTemplate>
        <Form />
        <WeMeanCare />
      </LoginTemplate>
    </div>
  );
};

export default Login;
