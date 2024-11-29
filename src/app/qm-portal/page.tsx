import React from "react";
import AuthListener from "../components/AuthListener";
import QmPortal from "./components/QmPortal";

const page = () => {
  return (
    <>
      <AuthListener />
      <QmPortal />
    </>
  );
};

export default page;
