import AuthListener from "@/app/components/AuthListener";
import React from "react";
import FMain from "./components/FMain";

const page = () => {
  return (
    <>
      <AuthListener />
      <FMain />
    </>
  );
};

export default page;
