import React from "react";
import AuthListener from "../components/AuthListener";
import Deactivation from "./components/Deactivation";

const page = () => {
  return (
    <>
      <AuthListener />
      <Deactivation />
    </>
  );
};

export default page;
