import AuthListener from "@/app/components/AuthListener";
import React from "react";
import FolderContent from "../components/FolderContent";

const page = () => {
  return (
    <>
      <AuthListener />
      <FolderContent />
    </>
  );
};

export default page;
