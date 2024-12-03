import AuthListener from "@/app/components/AuthListener";
import React from "react";
import FoldersMain from "./components/FoldersMain";

const FoldersPage = () => {
  return (
    <>
      <AuthListener />
      <FoldersMain />
    </>
  );
};

export default FoldersPage;
