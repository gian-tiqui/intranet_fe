import React from "react";
import DepartmentsBulletin from "./DepartmentsBulletin";
import AuthListener from "../components/AuthListener";

const DepartmentsMemo = () => {
  return (
    <div>
      <AuthListener />
      <DepartmentsBulletin />
    </div>
  );
};

export default DepartmentsMemo;
