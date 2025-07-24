import React from "react";
import AuthListener from "../components/AuthListener";
import PendingUpdatesClient from "./components/PendingUpdatesClient";

const page = () => {
  return (
    <>
      <AuthListener />
      <PendingUpdatesClient />
    </>
  );
};

export default page;
