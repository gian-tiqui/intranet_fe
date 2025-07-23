import React from "react";
import PhoneDirectory from "./components/PhoneDirectory";
import AuthListener from "../components/AuthListener";

const page = () => {
  return (
    <>
      <AuthListener />
      <PhoneDirectory />
    </>
  );
};

export default page;
