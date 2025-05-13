import React from "react";
import AuthListener from "../components/AuthListener";
import Drafts from "./components/Drafts";

const DraftsPage = () => {
  return (
    <>
      <AuthListener />
      <Drafts />
    </>
  );
};

export default DraftsPage;
