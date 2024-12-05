import AuthListener from "@/app/components/AuthListener";
import React from "react";
import FolderContent from "../components/FolderContent";

const page = ({ params }: { params: { id: number } }) => {
  return (
    <>
      <AuthListener />
      <FolderContent id={params.id} />
    </>
  );
};

export default page;
