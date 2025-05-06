import React from "react";
import ForgotPassword from "./components/ForgotPassword";
import LoginTemplate from "../login/template/LoginTemplate";
import TempSection from "../login/components/TempSection";

const page = () => {
  return (
    <LoginTemplate>
      <ForgotPassword />
      <TempSection />
    </LoginTemplate>
  );
};

export default page;
