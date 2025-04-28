import React from "react";
import ForgotPassword from "./components/ForgotPassword";
import LoginTemplate from "../login/template/LoginTemplate";

const page = () => {
  return (
    <LoginTemplate>
      <ForgotPassword />
    </LoginTemplate>
  );
};

export default page;
